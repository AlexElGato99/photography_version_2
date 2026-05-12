"use client";

import type { TitleHeadingV1 } from "@/lib/site/title-heading";
import { emptyTitleHeading, normalizeTitleHeading } from "@/lib/site/title-heading";

export function SectionHeadingField({
  label,
  value,
  onChange,
  help,
}: {
  label: string;
  value: unknown;
  onChange: (v: TitleHeadingV1) => void;
  help?: string;
}) {
  const h = normalizeTitleHeading(value);

  const patch = (p: Partial<TitleHeadingV1>) => onChange({ ...h, ...p, v: 1 });

  return (
    <fieldset className="block space-y-3 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
      <legend className="text-xs font-medium text-[var(--text-secondary)] px-1">{label}</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block space-y-1 sm:col-span-2">
          <span className="text-[11px] text-[var(--text-muted)]">Main line</span>
          <input
            type="text"
            value={h.line1}
            onChange={(e) => patch({ line1: e.target.value })}
            className="input-base"
            placeholder="e.g. Explore by"
          />
        </label>
        <label className="flex items-center gap-2 sm:col-span-2">
          <input
            type="checkbox"
            checked={h.breakAfterLine1}
            onChange={(e) => patch({ breakAfterLine1: e.target.checked })}
            className="rounded border-[var(--border)]"
          />
          <span className="text-[11px] text-[var(--text-secondary)]">Line break after main line</span>
        </label>
        <label className="block space-y-1 sm:col-span-2">
          <span className="text-[11px] text-[var(--text-muted)]">Text before italic (optional)</span>
          <input
            type="text"
            value={h.mid}
            onChange={(e) => patch({ mid: e.target.value })}
            className="input-base"
            placeholder="e.g. tell a"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-[11px] text-[var(--text-muted)]">Italic phrase</span>
          <input
            type="text"
            value={h.em}
            onChange={(e) => patch({ em: e.target.value })}
            className="input-base"
            placeholder="e.g. story"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-[11px] text-[var(--text-muted)]">After italic (same line)</span>
          <input
            type="text"
            value={h.tail}
            onChange={(e) => patch({ tail: e.target.value })}
            className="input-base"
            placeholder="e.g. imagery"
          />
        </label>
        <label className="block space-y-1 sm:col-span-2">
          <span className="text-[11px] text-[var(--text-muted)]">Second line (plain)</span>
          <input
            type="text"
            value={h.line2}
            onChange={(e) => patch({ line2: e.target.value })}
            className="input-base"
            placeholder="Optional extra line under the title"
          />
        </label>
      </div>
      {help && <p className="text-[11px] text-[var(--text-muted)]">{help}</p>}
      <button
        type="button"
        className="text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] underline"
        onClick={() => onChange(emptyTitleHeading())}
      >
        Clear title
      </button>
    </fieldset>
  );
}
