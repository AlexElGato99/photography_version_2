"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";

interface TagsFieldProps {
  label: string;
  value: string[];   // array of strings
  onChange: (v: string[]) => void;
  help?: string;
  placeholder?: string;
}

export function TagsField({ label, value, onChange, help, placeholder = "Add item…" }: TagsFieldProps) {
  const tags = Array.isArray(value) ? value : [];
  const [input, setInput] = useState("");

  const add = () => {
    const v = input.trim();
    if (!v || tags.includes(v)) return;
    onChange([...tags, v]);
    setInput("");
  };

  const remove = (i: number) => onChange(tags.filter((_, idx) => idx !== i));

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); }
    if (e.key === "Backspace" && !input && tags.length) remove(tags.length - 1);
  };

  return (
    <div className="block space-y-1.5">
      <span className="text-xs font-medium text-[var(--text-secondary)]">{label}</span>

      <div
        className="flex flex-wrap gap-2 p-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-tertiary)] focus-within:border-[var(--accent)] focus-within:shadow-[0_0_0_3px_rgba(34,197,94,0.12)] transition-all min-h-[44px] cursor-text"
        onClick={() => document.getElementById(`tags-input-${label}`)?.focus()}
      >
        {tags.map((t, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[var(--accent-light)] text-[var(--accent-dark)] dark:bg-[rgba(34,197,94,0.12)] dark:text-[#4ade80] text-xs font-medium"
          >
            {t}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); remove(i); }}
              className="hover:opacity-70 transition-opacity"
              aria-label={`Remove ${t}`}
            >
              <X size={10} />
            </button>
          </span>
        ))}
        <input
          id={`tags-input-${label}`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          onBlur={add}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none"
        />
      </div>

      {help && <span className="block text-[11px] text-[var(--text-muted)]">{help}</span>}
      <span className="block text-[11px] text-[var(--text-muted)]">Press Enter or comma to add · Backspace to remove last</span>
    </div>
  );
}
