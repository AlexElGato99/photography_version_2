"use client";

import { X, Plus } from "lucide-react";

interface NavItem { label: string; href: string; }

interface NavItemsFieldProps {
  label: string;
  value: NavItem[];
  onChange: (v: NavItem[]) => void;
  help?: string;
}

export function NavItemsField({ label, value, onChange, help }: NavItemsFieldProps) {
  const items: NavItem[] = Array.isArray(value) ? value : [];

  const update = (i: number, key: keyof NavItem, val: string) => {
    const next = items.map((item, idx) =>
      idx === i ? { ...item, [key]: val } : item
    );
    onChange(next);
  };

  const add = () => onChange([...items, { label: "", href: "#" }]);
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div className="block space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[var(--text-secondary)]">{label}</span>
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1 text-xs text-[var(--accent-dark)] dark:text-[#4ade80] hover:opacity-80 transition-opacity"
        >
          <Plus size={12} /> Add link
        </button>
      </div>

      <div className="space-y-2">
        {items.length === 0 && (
          <p className="text-xs text-[var(--text-muted)] italic">
            No links yet. Click &quot;Add link&quot;.
          </p>
        )}
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={item.label}
              onChange={(e) => update(i, "label", e.target.value)}
              placeholder="Label"
              className="input-base flex-1"
            />
            <input
              type="text"
              value={item.href}
              onChange={(e) => update(i, "href", e.target.value)}
              placeholder="Href (e.g. #about)"
              className="input-base flex-1"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex-shrink-0"
              aria-label="Remove"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {help && <span className="block text-[11px] text-[var(--text-muted)]">{help}</span>}
    </div>
  );
}
