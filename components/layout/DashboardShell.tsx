"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

export function DashboardShell({
  children,
  userEmail,
}: {
  children: React.ReactNode;
  userEmail: string;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-secondary)]">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <Topbar userEmail={userEmail} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>

        <footer className="h-8 flex items-center justify-center gap-8 px-6 bg-[var(--bg-primary)] border-t border-[var(--border)] shrink-0">
          <StatusBadge label="Next.js" value="14.2.3" />
          <StatusBadge label="React" value="18" />
          <StatusBadge label="TypeScript" value="5" />
          <StatusBadge label="Tailwind CSS" value="3.4.1" />
          <StatusBadge label="Recharts" value="2.12.7" />
          <StatusBadge label="Lucide" value="0.383.0" />
        </footer>
      </div>
    </div>
  );
}

function StatusBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)]">
      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
      <span className="font-medium text-[var(--text-secondary)]">{label}</span>
      <span>{value}</span>
    </div>
  );
}
