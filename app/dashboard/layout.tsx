import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/DashboardShell";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
