"use client";

import { ArrowDown, ArrowUp, Plus, X } from "lucide-react";
import type { StatItem } from "@/lib/types/site";

function normalizeItems(raw: unknown): StatItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((x) => {
    const o = x as Record<string, unknown>;
    const n = Number(o.count);
    return {
      count: Number.isFinite(n) ? n : 0,
      suffix: typeof o.suffix === "string" ? o.suffix : "",
      label: typeof o.label === "string" ? o.label : "",
    };
  });
}

interface StatsItemsFieldProps {
  label: string;
  value: unknown;
  onChange: (v: StatItem[]) => void;
  help?: string;
}

export function StatsItemsField({ label, value, onChange, help }: StatsItemsFieldProps) {
  const items = normalizeItems(value);

  const update = (i: number, patch: Partial<StatItem>) => {
    onChange(items.map((row, j) => (j === i ? { ...row, ...patch } : row)));
  };

  const add = () => onChange([...items, { count: 0, suffix: "", label: "" }]);
  const remove = (i: number) => onChange(items.filter((_, j) => j !== i));

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="block space-y-2 min-w-0">
      <div className="flex w-full min-w-0 flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-medium text-[var(--text-secondary)]">{label}</span>
        <button type="button" onClick={add} className="btn-secondary text-xs inline-flex items-center gap-1 shrink-0">
          <Plus size={14} /> Add counter
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-xs text-[var(--text-muted)] italic rounded-lg border border-dashed border-[var(--border)] px-3 py-4">
          No counters yet. Use &quot;Add counter&quot; to build the stats row (number, optional suffix like + or k, and label).
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((row, i) => (
            <div
              key={i}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] p-4 space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Counter {i + 1}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    title="Move up"
                    disabled={i === 0}
                    onClick={() => move(i, -1)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] disabled:opacity-30"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    title="Move down"
                    disabled={i === items.length - 1}
                    onClick={() => move(i, 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] disabled:opacity-30"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    type="button"
                    title="Remove"
                    onClick={() => remove(i)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <label className="sm:col-span-3 space-y-1">
                  <span className="text-[10px] font-medium text-[var(--text-muted)]">Number</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={Number.isFinite(row.count) ? row.count : 0}
                    onChange={(e) => {
                      const v = e.target.value === "" ? 0 : Number(e.target.value);
                      update(i, { count: Number.isFinite(v) ? v : 0 });
                    }}
                    className="input-base text-sm w-full"
                    placeholder="240"
                  />
                </label>
                <label className="sm:col-span-2 space-y-1">
                  <span className="text-[10px] font-medium text-[var(--text-muted)]">Suffix</span>
                  <input
                    type="text"
                    value={row.suffix}
                    onChange={(e) => update(i, { suffix: e.target.value })}
                    className="input-base text-sm w-full"
                    placeholder="+, k, yrs…"
                  />
                </label>
                <label className="sm:col-span-7 space-y-1">
                  <span className="text-[10px] font-medium text-[var(--text-muted)]">Label</span>
                  <input
                    type="text"
                    value={row.label}
                    onChange={(e) => update(i, { label: e.target.value })}
                    className="input-base text-sm w-full"
                    placeholder="Short description under the number"
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      )}

      {help && <span className="block text-[11px] text-[var(--text-muted)]">{help}</span>}
    </div>
  );
}
