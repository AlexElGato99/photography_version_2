"use client";

import { useState } from "react";

export function Tabs({
  tabs,
  initial = 0,
}: {
  tabs: { label: string; render: () => React.ReactNode }[];
  initial?: number;
}) {
  const [active, setActive] = useState(initial);
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)]">
        {tabs.map((t, i) => (
          <button
            key={t.label}
            type="button"
            onClick={() => setActive(i)}
            className={
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors " +
              (active === i
                ? "bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]")
            }
          >
            {t.label}
          </button>
        ))}
      </div>
      <div>{tabs[active].render()}</div>
    </div>
  );
}
