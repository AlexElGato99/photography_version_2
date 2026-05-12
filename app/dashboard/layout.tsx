import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/DashboardShell";

export const dynamic = "force-dynamic";

function hasSupabasePublicEnv() {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!hasSupabasePublicEnv()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-secondary)] p-6 text-[var(--text-primary)]">
        <div className="w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--bg-primary)] p-8 shadow-[var(--card-shadow)] space-y-4">
          <h1 className="text-xl font-semibold tracking-tight">
            Supabase is not configured
          </h1>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            The admin dashboard needs your Supabase project URL and anon key to
            verify your session. Copy{" "}
            <code className="text-xs bg-[var(--bg-tertiary)] px-1.5 py-0.5 rounded">
              .env.local.example
            </code>{" "}
            to{" "}
            <code className="text-xs bg-[var(--bg-tertiary)] px-1.5 py-0.5 rounded">
              .env.local
            </code>{" "}
            and set{" "}
            <code className="text-xs bg-[var(--bg-tertiary)] px-1.5 py-0.5 rounded">
              NEXT_PUBLIC_SUPABASE_URL
            </code>{" "}
            and{" "}
            <code className="text-xs bg-[var(--bg-tertiary)] px-1.5 py-0.5 rounded">
              NEXT_PUBLIC_SUPABASE_ANON_KEY
            </code>
            , then restart <code className="text-xs">npm run dev</code>.
          </p>
        </div>
      </div>
    );
  }

  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Belt-and-braces: middleware should have already redirected, but if
  // Supabase env vars are missing the middleware short-circuits.
  if (!user) {
    redirect("/login");
  }

  return (
    <DashboardShell userEmail={user.email ?? ""}>{children}</DashboardShell>
  );
}
