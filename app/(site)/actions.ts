"use server";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

function hasAdminEnv() {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function submitContact(payload: {
  first_name: string;
  last_name?: string;
  email: string;
  phone?: string;
  service?: string;
  message?: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!payload.first_name || !payload.email) {
    return { ok: false, error: "First name and email are required." };
  }
  if (!hasAdminEnv()) {
    console.warn("[contact] Supabase admin not configured — dropping submission.");
    return { ok: true };
  }
  try {
    const sb = createSupabaseAdminClient();
    const { error } = await sb.from("contact_submissions").insert({
      first_name: payload.first_name,
      last_name: payload.last_name || null,
      email: payload.email,
      phone: payload.phone || null,
      service: payload.service || null,
      message: payload.message || null,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}
