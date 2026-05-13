"use client";

import { ArrowDown, ArrowUp, Plus, X } from "lucide-react";
import type { ProcessStep } from "@/lib/types/site";

function normalizeSteps(raw: unknown): ProcessStep[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((x) => {
    const o = x as Record<string, unknown>;
    return {
      num: typeof o.num === "string" ? o.num : String(o.num ?? ""),
      title: typeof o.title === "string" ? o.title : "",
      text: typeof o.text === "string" ? o.text : "",
    };
  });
}

interface ProcessStepsFieldProps {
  label: string;
  value: unknown;
  onChange: (v: ProcessStep[]) => void;
  help?: string;
}

export function ProcessStepsField({ label, value, onChange, help }: ProcessStepsFieldProps) {
  const steps = normalizeSteps(value);

  const update = (i: number, patch: Partial<ProcessStep>) => {
    onChange(steps.map((row, j) => (j === i ? { ...row, ...patch } : row)));
  };

  const add = () => {
    const n = String(steps.length + 1).padStart(2, "0");
    onChange([...steps, { num: n, title: "", text: "" }]);
  };

  const remove = (i: number) => onChange(steps.filter((_, j) => j !== i));

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= steps.length) return;
    const next = [...steps];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="block space-y-2 min-w-0">
      <div className="flex w-full min-w-0 flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-medium text-[var(--text-secondary)]">{label}</span>
        <button type="button" onClick={add} className="btn-secondary text-xs inline-flex items-center gap-1 shrink-0">
          <Plus size={14} /> Add step
        </button>
      </div>

      {steps.length === 0 ? (
        <p className="text-xs text-[var(--text-muted)] italic rounded-lg border border-dashed border-[var(--border)] px-3 py-4">
          No steps yet. Use &quot;Add step&quot; to build your process timeline (step label, title, and description).
        </p>
      ) : (
        <div className="space-y-3">
          {steps.map((row, i) => (
            <div
              key={i}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] p-4 space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Step {i + 1}
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
                    disabled={i === steps.length - 1}
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
                <label className="sm:col-span-2 space-y-1">
                  <span className="text-[10px] font-medium text-[var(--text-muted)]">Step no.</span>
                  <input
                    type="text"
                    value={row.num}
                    onChange={(e) => update(i, { num: e.target.value })}
                    className="input-base text-sm w-full font-mono"
                    placeholder="01"
                    maxLength={8}
                  />
                </label>
                <label className="sm:col-span-10 space-y-1">
                  <span className="text-[10px] font-medium text-[var(--text-muted)]">Title</span>
                  <input
                    type="text"
                    value={row.title}
                    onChange={(e) => update(i, { title: e.target.value })}
                    className="input-base text-sm w-full"
                    placeholder="Discovery"
                  />
                </label>
              </div>

              <label className="block space-y-1">
                <span className="text-[10px] font-medium text-[var(--text-muted)]">Description</span>
                <textarea
                  value={row.text}
                  onChange={(e) => update(i, { text: e.target.value })}
                  rows={4}
                  className="input-base text-sm w-full min-h-[5.5rem] resize-y"
                  placeholder="Plain language shown on the public site (no HTML required)."
                />
              </label>
            </div>
          ))}
        </div>
      )}

      {help && <span className="block text-[11px] text-[var(--text-muted)]">{help}</span>}
    </div>
  );
}
