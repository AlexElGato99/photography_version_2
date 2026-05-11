"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bell,
  Sun,
  Moon,
  RefreshCw,
  Trash2,
  Settings,
  Globe,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useTheme } from "@/components/layout/ThemeProvider";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOut } from "@/app/login/actions";

const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL ?? "/";

const TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/analytics": "Analytics",

  "/dashboard/site/general": "Brand & General",
  "/dashboard/site/navigation": "Navigation",
  "/dashboard/site/marquee": "Marquee",
  "/dashboard/site/footer": "Footer",
  "/dashboard/site/seo": "SEO",

  "/dashboard/sections/hero": "Hero Section",
  "/dashboard/sections/about": "About Section",
  "/dashboard/sections/services": "Services",
  "/dashboard/sections/categories": "Categories",
  "/dashboard/sections/portfolio": "Portfolio",
  "/dashboard/sections/stats": "Stats",
  "/dashboard/sections/process": "Process",
  "/dashboard/sections/team": "Team",
  "/dashboard/sections/pricing": "Pricing Tiers",
  "/dashboard/sections/testimonials": "Testimonials",
  "/dashboard/sections/instagram": "Instagram",
  "/dashboard/sections/faq": "FAQ",
  "/dashboard/sections/contact": "Contact Section",

  "/dashboard/users": "Users",
  "/dashboard/orders": "Orders",
  "/dashboard/notifications": "Submissions",
  "/dashboard/live-chat": "Live Chat",
  "/dashboard/pricing": "Subscription Plans",
  "/dashboard/settings": "Settings",
};

function titleFromPathname(pathname: string | null): string {
  if (!pathname) return "Dashboard";
  if (TITLES[pathname]) return TITLES[pathname];
  const last = pathname.split("/").filter(Boolean).pop() ?? "Dashboard";
  return last
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

interface TopbarProps {
  title?: string;
  userEmail?: string;
}

export function Topbar({ title, userEmail = "" }: TopbarProps) {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const resolvedTitle = title ?? titleFromPathname(pathname);

  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const initial = (userEmail || "A").trim().charAt(0).toUpperCase() || "A";

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  };

  const handleRefresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    router.refresh();
    window.setTimeout(() => setRefreshing(false), 700);
  };

  const handleClearCache = async () => {
    const ok = window.confirm(
      "Clear cached data for this site?\n\nThis will remove local storage, session storage, cookies and any service-worker caches. You will stay logged in only if your session uses server-side cookies."
    );
    if (!ok) return;

    try {
      window.localStorage.clear();
      window.sessionStorage.clear();

      document.cookie.split(";").forEach((c) => {
        const eq = c.indexOf("=");
        const name = (eq > -1 ? c.substr(0, eq) : c).trim();
        if (!name) return;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      });

      if ("caches" in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }

      if ("serviceWorker" in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map((r) => r.unregister()));
      }

      showToast("Cache cleared");
      router.refresh();
    } catch (err) {
      console.error(err);
      showToast("Failed to clear cache");
    }
  };

  return (
    <header className="relative h-14 shrink-0 flex items-center justify-between gap-4 px-5 sm:px-6 border-b border-[var(--border)] bg-[var(--bg-primary)]/80 backdrop-blur-md shadow-[0_1px_0_var(--border-light)]">
      <div className="min-w-0 flex items-center">
        <h1 className="text-base sm:text-lg font-semibold tracking-tight text-[var(--text-primary)] truncate">
          {resolvedTitle}
        </h1>
      </div>

      <div className="flex items-center gap-0.5 sm:gap-1 shrink-0 pl-2 border-l border-[var(--border)]/80">
        <a
          href={FRONTEND_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 flex items-center justify-center rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-colors"
          title="Open frontend website"
          aria-label="Open frontend website"
        >
          <Globe size={16} strokeWidth={1.75} />
        </a>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing}
          className="w-9 h-9 flex items-center justify-center rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] disabled:opacity-60 transition-colors"
          title="Refresh data"
          aria-label="Refresh data"
        >
          <RefreshCw
            size={16}
            strokeWidth={1.75}
            className={cn(refreshing && "animate-spin")}
          />
        </button>

        <button
          type="button"
          onClick={handleClearCache}
          className="w-9 h-9 flex items-center justify-center rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-colors"
          title="Clear website cache"
          aria-label="Clear website cache"
        >
          <Trash2 size={16} strokeWidth={1.75} />
        </button>

        <button
          type="button"
          onClick={toggleTheme}
          className="w-9 h-9 flex items-center justify-center rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-colors"
          title={theme === "dark" ? "Switch to light" : "Switch to dark"}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun size={16} strokeWidth={1.75} />
          ) : (
            <Moon size={16} strokeWidth={1.75} />
          )}
        </button>

        <Link
          href="/dashboard/notifications"
          className="relative w-9 h-9 flex items-center justify-center rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-colors"
          title="Notifications"
        >
          <Bell size={16} strokeWidth={1.75} />
          <span className="absolute top-1.5 right-1.5 min-w-[14px] h-3.5 px-0.5 bg-[var(--accent)] rounded-full flex items-center justify-center text-white text-[8px] font-bold leading-none shadow-sm">
            1
          </span>
        </Link>

        <Link
          href="/dashboard/settings"
          className="w-9 h-9 flex items-center justify-center rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-colors"
          title="Account settings"
        >
          <Settings size={16} strokeWidth={1.75} />
        </Link>

        <div className="relative ml-1 sm:ml-2" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-1.5 pl-0.5 pr-1.5 py-0.5 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            title={userEmail || "Account"}
          >
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-dark)] flex items-center justify-center text-white text-sm font-semibold shadow-sm ring-2 ring-[var(--bg-primary)]">
              {initial}
            </span>
            <ChevronDown
              size={13}
              strokeWidth={2}
              className={cn(
                "text-[var(--text-muted)] transition-transform",
                menuOpen && "rotate-180"
              )}
            />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-[calc(100%+6px)] w-60 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] shadow-lg overflow-hidden z-50 animate-fade-in"
            >
              <div className="px-3 py-2.5 border-b border-[var(--border)]">
                <p className="text-[10px] uppercase tracking-wide text-[var(--text-muted)]">
                  Signed in as
                </p>
                <p className="text-xs font-medium text-[var(--text-primary)] truncate">
                  {userEmail || "admin"}
                </p>
              </div>

              <Link
                href="/dashboard/settings"
                role="menuitem"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <Settings size={14} strokeWidth={1.75} />
                Account security
              </Link>

              <form action={signOut}>
                <button
                  type="submit"
                  role="menuitem"
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut size={14} strokeWidth={1.75} />
                  Sign out
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="absolute right-4 top-[calc(100%+8px)] z-50 px-3 py-2 rounded-xl text-xs font-medium bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-primary)] shadow-lg animate-fade-in"
        >
          {toast}
        </div>
      )}
    </header>
  );
}
