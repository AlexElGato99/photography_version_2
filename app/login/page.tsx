import { isSetupNeeded } from "./actions";
import { LoginForm } from "./LoginForm";
import { SetupForm } from "./SetupForm";
import { Logo } from "@/components/ui/Logo";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { next?: string; error?: string };
}) {
  const setupNeeded = await isSetupNeeded();
  const next = searchParams?.next ?? "/dashboard";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-secondary)] p-6">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)] shadow-sm px-5 py-4">
            <Logo variant="full" size="lg" />
          </div>
          <p className="text-xs text-[var(--text-muted)] tracking-wide uppercase">
            Studio admin
          </p>
        </div>

        <div className="card p-7 space-y-6">
          {setupNeeded ? (
            <>
              <header className="space-y-1">
                <h1 className="text-xl font-semibold text-[var(--text-primary)]">
                  Create the first admin
                </h1>
                <p className="text-sm text-[var(--text-muted)]">
                  No admin account exists yet. Set the credentials you will use to
                  manage the site.
                </p>
              </header>
              <SetupForm />
            </>
          ) : (
            <>
              <header className="space-y-1">
                <h1 className="text-xl font-semibold text-[var(--text-primary)]">
                  Sign in
                </h1>
                <p className="text-sm text-[var(--text-muted)]">
                  Enter your admin credentials to access the dashboard.
                </p>
              </header>
              <LoginForm next={next} />
            </>
          )}
        </div>

        <p className="mt-6 text-center text-[11px] text-[var(--text-muted)]">
          Protected admin area. Unauthorised access is prohibited.
        </p>
      </div>
    </div>
  );
}
