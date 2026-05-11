"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type Json = Record<string, unknown>;

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
 * Upload an image file to Supabase Storage → returns the public URL.
 * Bucket: "site-media"  (create it once in Supabase Storage → New bucket → public)
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

    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const sb = createSupabaseAdminClient();
    const { error } = await sb.storage
      .from("site-media")
      .upload(path, buffer, { contentType: file.type, upsert: false });

    if (error) return { ok: false, error: error.message };

    const { data } = sb.storage.from("site-media").getPublicUrl(path);
    return { ok: true, url: data.publicUrl };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}
