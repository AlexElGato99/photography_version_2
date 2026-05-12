"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { bufferToWebp } from "@/lib/images/to-webp";
import { isSafePublicHttpsImageUrl } from "@/lib/images/remote-url";

type Json = Record<string, unknown>;

const MAX_REMOTE_IMAGE_BYTES = 20 * 1024 * 1024;

async function uploadWebpBufferToSiteMedia(webpBuffer: Buffer): Promise<string> {
  const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
  const sb = createSupabaseAdminClient();
  const { error } = await sb.storage
    .from("site-media")
    .upload(path, webpBuffer, { contentType: "image/webp", upsert: false });
  if (error) throw new Error(error.message);
  const { data } = sb.storage.from("site-media").getPublicUrl(path);
  return data.publicUrl;
}

function hasAdminEnv() {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function updateSingleton(
  table: string,
  payload: Json
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!hasAdminEnv()) {
    return {
      ok: false,
      error:
        "Supabase admin not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.",
    };
  }
  try {
    const sb = createSupabaseAdminClient();
    const { error } = await sb
      .from(table)
      .upsert({ id: 1, ...payload }, { onConflict: "id" });
    if (error) return { ok: false, error: error.message };
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export async function upsertRow(
  table: string,
  row: Json
): Promise<{ ok: true; id?: string } | { ok: false; error: string }> {
  if (!hasAdminEnv()) {
    return { ok: false, error: "Supabase admin not configured." };
  }
  try {
    const sb = createSupabaseAdminClient();
    const { data, error } = await sb.from(table).upsert(row).select("id").single();
    if (error) return { ok: false, error: error.message };
    revalidatePath("/", "layout");
    return { ok: true, id: data?.id as string | undefined };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export async function deleteRow(
  table: string,
  id: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!hasAdminEnv()) {
    return { ok: false, error: "Supabase admin not configured." };
  }
  try {
    const sb = createSupabaseAdminClient();
    const { error } = await sb.from(table).delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export async function replaceCollection(
  table: string,
  rows: Array<Json & { id?: string }>
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!hasAdminEnv()) {
    return { ok: false, error: "Supabase admin not configured." };
  }
  try {
    const sb = createSupabaseAdminClient();
    const { error: delErr } = await sb.from(table).delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (delErr) return { ok: false, error: delErr.message };
    if (rows.length > 0) {
      const stripped = rows.map(({ id: _, ...rest }, position) => ({
        ...rest,
        position,
      }));
      const { error: insErr } = await sb.from(table).insert(stripped);
      if (insErr) return { ok: false, error: insErr.message };
    }
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

/**
 * Upload an image file to Supabase Storage.
 * Every image is converted to WebP (quality 85) before upload for optimal
 * file size and SEO performance. Returns the public URL.
 * Bucket: "site-media" (public bucket in Supabase Storage)
 */
export async function uploadImage(
  formData: FormData
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  if (!hasAdminEnv()) {
    return { ok: false, error: "Supabase admin not configured." };
  }
  try {
    const file = formData.get("file") as File | null;
    if (!file || file.size === 0) return { ok: false, error: "No file provided." };

    const raw = Buffer.from(await file.arrayBuffer());
    const webpBuffer = await bufferToWebp(raw);
    const url = await uploadWebpBufferToSiteMedia(webpBuffer);
    return { ok: true, url };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

/**
 * Fetch a remote image (AVIF, JPEG, PNG, …), convert to WebP, upload to site-media.
 * Dashboard uses this when an editor pastes an image URL so stored assets are WebP.
 */
export async function ingestRemoteImageAsWebp(
  url: string
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  if (!hasAdminEnv()) {
    return { ok: false, error: "Supabase admin not configured." };
  }
  const trimmed = url.trim();
  if (!trimmed) {
    return { ok: false, error: "No URL provided." };
  }
  if (!isSafePublicHttpsImageUrl(trimmed)) {
    return { ok: false, error: "This URL cannot be imported (invalid or blocked)." };
  }
  try {
    const res = await fetch(trimmed, {
      redirect: "follow",
      cache: "no-store",
      headers: {
        Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
      },
      signal: AbortSignal.timeout(45_000),
    });
    if (!res.ok) {
      return { ok: false, error: `Download failed (${res.status}).` };
    }
    const len = res.headers.get("content-length");
    if (len && Number(len) > MAX_REMOTE_IMAGE_BYTES) {
      return { ok: false, error: "Remote image is too large." };
    }
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length > MAX_REMOTE_IMAGE_BYTES) {
      return { ok: false, error: "Remote image is too large." };
    }
    const webpBuffer = await bufferToWebp(buf);
    const publicUrl = await uploadWebpBufferToSiteMedia(webpBuffer);
    return { ok: true, url: publicUrl };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}
