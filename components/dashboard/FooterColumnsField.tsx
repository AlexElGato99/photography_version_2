"use client";

import { X, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface LinkItem { label: string; href: string; }
interface FooterColumn { title: string; links: LinkItem[]; }

interface FooterColumnsFieldProps {
  label: string;
  value: FooterColumn[];
  onChange: (v: FooterColumn[]) => void;
}

export function FooterColumnsField({ label, value, onChange }: FooterColumnsFieldProps) {
  const cols: FooterColumn[] = Array.isArray(value) ? value : [];
  const [open, setOpen] = useState<number[]>([0]);

  const toggle = (i: number) =>
    setOpen((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]);

  const updateCol = (i: number, patch: Partial<FooterColumn>) =>
    onChange(cols.map((c, idx) => idx === i ? { ...c, ...patch } : c));

  const addCol = () => {
    const next = [...cols, { title: "New column", links: [] }];
    onChange(next);
    setOpen((prev) => [...prev, next.length - 1]);
  };
  const removeCol = (i: number) => onChange(cols.filter((_, idx) => idx !== i));

  const addLink = (ci: number) =>
    updateCol(ci, { links: [...cols[ci].links, { label: "", href: "#" }] });

  const updateLink = (ci: number, li: number, key: keyof LinkItem, val: string) =>
    updateCol(ci, {
      links: cols[ci].links.map((l, idx) => idx === li ? { ...l, [key]: val } : l),
    });

  const removeLink = (ci: number, li: number) =>
    updateCol(ci, { links: cols[ci].links.filter((_, idx) => idx !== li) });

  return (
    <div className="block space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[var(--text-secondary)]">{label}</span>
        <button
          type="button"
          onClick={addCol}
          className="inline-flex items-center gap-1 text-xs text-[var(--accent-dark)] dark:text-[#4ade80] hover:opacity-80 transition-opacity"
        >
          <Plus size={12} /> Add column
        </button>
      </div>

      <div className="space-y-2">
        {cols.length === 0 && (
          <p className="text-xs text-[var(--text-muted)] italic">No columns yet.</p>
        )}
        {cols.map((col, ci) => (
          <div key={ci} className="rounded-xl border border-[var(--border)] overflow-hidden">
            {/* Column header */}
            <div className="flex items-center gap-2 px-3 py-2.5 bg-[var(--bg-secondary)]">
              <button
                type="button"
                onClick={() => toggle(ci)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                {open.includes(ci) ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              <input
                type="text"
                value={col.title}
                onChange={(e) => updateCol(ci, { title: e.target.value })}
                placeholder="Column title"
                className="flex-1 bg-transparent text-sm font-medium text-[var(--text-primary)] outline-none"
              />
              <button
                type="button"
                onClick={() => removeCol(ci)}
                className="w-6 h-6 flex items-center justify-center rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <X size={12} />
              </button>
            </div>

            {/* Links */}
            {open.includes(ci) && (
              <div className="px-3 py-3 space-y-2 border-t border-[var(--border)]">
                {col.links.length === 0 && (
                  <p className="text-xs text-[var(--text-muted)] italic">No links.</p>
                )}
                {col.links.map((lnk, li) => (
                  <div key={li} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={lnk.label}
                      onChange={(e) => updateLink(ci, li, "label", e.target.value)}
                      placeholder="Link label"
                      className="input-base flex-1 text-xs py-1.5"
                    />
                    <input
                      type="text"
                      value={lnk.href}
                      onChange={(e) => updateLink(ci, li, "href", e.target.value)}
                      placeholder="URL or #anchor"
                      className="input-base flex-1 text-xs py-1.5"
                    />
                    <button
                      type="button"
                      onClick={() => removeLink(ci, li)}
                      className="w-7 h-7 flex items-center justify-center rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex-shrink-0"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addLink(ci)}
                  className="inline-flex items-center gap-1 text-xs text-[var(--accent-dark)] dark:text-[#4ade80] hover:opacity-80 transition-opacity mt-1"
                >
                  <Plus size={11} /> Add link
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
