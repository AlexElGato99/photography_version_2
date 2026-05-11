"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type ChangePasswordResult =
  | { ok: true; message: string }
  | { ok: false; error: string };

export async function changePassword(input: {
  current: string;
  next: string;
}): Promise<ChangePasswordResult> {
  const current = (input.current ?? "").trim();
  const next = input.next ?? "";

  if (!current || !next) {
    return { ok: false, error: "Current and new passwords are required." };
  }
  if (next.length < 8) {
    return { ok: false, error: "New password must be at least 8 characters." };
  }

  try {
    const supabase = createSupabaseServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user?.email) {
      return { ok: false, error: "Not signed in." };
    }

    // Re-authenticate with the current password before allowing the change.
    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: current,
    });
    if (signInErr) {
      return { ok: false, error: "Current password is incorrect." };
    }

    // Update using the admin client (works even if the SSR cookie write isn't
    // available in some runtimes).
    const admin = createSupabaseAdminClient();
    const { error: updateErr } = await admin.auth.admin.updateUserById(
      user.id,
      { password: next }
    );
    if (updateErr) {
      return { ok: false, error: updateErr.message };
    }

    return { ok: true, message: "Password updated successfully." };
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : "Password update failed. Check Supabase configuration.",
    };
  }
}
