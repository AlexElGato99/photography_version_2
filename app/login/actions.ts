"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export type AuthResult =
  | { ok: true }
  | { ok: false; error: string };

export async function signIn(
  _prev: AuthResult | null,
  formData: FormData
): Promise<AuthResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/dashboard");

  if (!email || !password) {
    return { ok: false, error: "Email and password are required." };
  }

  let dest = "/dashboard";
  try {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      return { ok: false, error: error.message };
    }
    dest = next.startsWith("/dashboard") ? next : "/dashboard";
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : "Sign-in failed. Check Supabase configuration.",
    };
  }

  revalidatePath("/", "layout");
  redirect(dest);
}

export async function signOut(): Promise<void> {
  try {
    const supabase = createSupabaseServerClient();
    await supabase.auth.signOut();
  } catch {
    // ignore — we redirect anyway
  }
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function isSetupNeeded(): Promise<boolean> {
  try {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin.auth.admin.listUsers({
      page: 1,
      perPage: 1,
    });
    if (error) return false;
    return (data?.users?.length ?? 0) === 0;
  } catch {
    return false;
  }
}

export async function setupAdmin(
  _prev: AuthResult | null,
  formData: FormData
): Promise<AuthResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!email || !password) {
    return { ok: false, error: "Email and password are required." };
  }
  if (password.length < 8) {
    return { ok: false, error: "Password must be at least 8 characters." };
  }
  if (password !== confirm) {
    return { ok: false, error: "Passwords do not match." };
  }

  try {
    const admin = createSupabaseAdminClient();

    const { data: existing, error: listErr } = await admin.auth.admin.listUsers(
      { page: 1, perPage: 1 }
    );
    if (listErr) {
      return { ok: false, error: listErr.message };
    }
    if ((existing?.users?.length ?? 0) > 0) {
      return {
        ok: false,
        error:
          "An admin already exists. Use the login form instead, or reset the password from Supabase.",
      };
    }

    const { error: createErr } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role: "admin" },
    });
    if (createErr) {
      return { ok: false, error: createErr.message };
    }

    const supabase = createSupabaseServerClient();
    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (signInErr) {
      return { ok: false, error: signInErr.message };
    }
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : "Setup failed. Check Supabase configuration.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
