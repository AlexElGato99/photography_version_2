"use client";

import { useState, useTransition } from "react";
import {
  Save,
  Loader2,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { replaceCollection } from "@/app/dashboard/actions";
import { ImageUploadField } from "@/components/dashboard/ImageUploadField";

export type ColFieldDef =
  | {
      key: string;
      label: string;
      type: "text" | "url" | "email" | "tel" | "number";
      placeholder?: string;
    }
  | {
      key: string;
      label: string;
      type: "textarea";
      placeholder?: string;
      rows?: number;
    }
  | {
      key: string;
      label: string;
      type: "switch";
    }
  | {
      key: string;
      label: string;
      type: "image";
      help?: string;
    };

interface CollectionEditorProps<T extends { id?: string }> {
  table: string;
  title: string;
  description?: string;
  initialRows: T[];
  fields: ColFieldDef[];
  blank: () => Omit<T, "id">;
  transformRow?: (row: T) => Record<string, unknown>;
}

export function CollectionEditor<T extends Record<string, unknown> & { id?: string }>({
  table,
  title,
  description,
  initialRows,
  fields,
  blank,
  transformRow,
}: CollectionEditorProps<T>) {
  const [rows, setRows] = useState<T[]>(initialRows);
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<
    { kind: "idle" } | { kind: "ok"; msg: string } | { kind: "err"; msg: string }
  >({ kind: "idle" });

  const updateRow = (idx: number, key: string, value: unknown) => {
    setRows((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [key]: value };
      return next;
    });
  };

  const move = (idx: number, dir: -1 | 1) => {
    setRows((prev) => {
      const next = [...prev];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  };

  const remove = (idx: number) => {
    setRows((prev) => prev.filter((_, i) => i !== idx));
  };

  const add = () => {
    setRows((prev) => [...prev, { ...(blank() as T) }]);
  };

  const onSave = () => {
    startTransition(async () => {
      let prepared: Array<Record<string, unknown>>;
      try {
        prepared = rows.map((r) =>
          transformRow ? transformRow(r) : { ...r }
        );
      } catch (e) {
        setStatus({ kind: "err", msg: (e as Error).message });
        return;
      }
      const res = await replaceCollection(table, prepared);
      if (res.ok) {
        setStatus({ kind: "ok", msg: "Saved." });
        window.setTimeout(() => setStatus({ kind: "idle" }), 2200);
      } else {
        setStatus({ kind: "err", msg: res.error });
      }
    });
  };

  return (
    <div className="w-full space-y-6 animate-fade-in">
      <header className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h2>
          {description && (
            <p className="text-sm text-[var(--text-muted)]">{description}</p>
          )}
        </div>
        <button type="button" onClick={add} className="btn-secondary">
          <Plus size={14} /> Add item
        </button>
      </header>

      <div className="space-y-3">
        {rows.length === 0 && (
          <div className="card p-6 text-center text-sm text-[var(--text-muted)]">
            No items yet. Click <b className="text-[var(--text-primary)]">Add item</b> to create one.
          </div>
        )}
        {rows.map((row, idx) => (
          <div key={idx} className="card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                Item #{idx + 1}
              </span>
              <div className="flex items-center gap-1">
                <IconBtn label="Move up" onClick={() => move(idx, -1)} disabled={idx === 0}>
                  <ChevronUp size={14} />
                </IconBtn>
                <IconBtn
                  label="Move down"
                  onClick={() => move(idx, 1)}
                  disabled={idx === rows.length - 1}
                >
                  <ChevronDown size={14} />
                </IconBtn>
                <IconBtn label="Remove" onClick={() => remove(idx)} danger>
                  <Trash2 size={14} />
                </IconBtn>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {fields.map((f) => (
                <ColField
                  key={f.key}
                  field={f}
                  value={row[f.key]}
                  onChange={(v) => updateRow(idx, f.key, v)}
                  fullWidth={f.type === "textarea" || f.type === "image"}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {status.kind === "err" && (
        <div className="text-xs font-medium px-3 py-2 rounded-lg bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
          {status.msg}
        </div>
      )}
      {status.kind === "ok" && (
        <div className="text-xs font-medium px-3 py-2 rounded-lg bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
          {status.msg}
        </div>
      )}

      <div className="flex items-center justify-end gap-2 sticky bottom-4">
        <button
          type="button"
          onClick={onSave}
          className="btn-primary shadow-lg"
          disabled={pending}
        >
          {pending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {pending ? "Saving..." : "Save collection"}
        </button>
      </div>
    </div>
  );
}

function IconBtn({
  label,
  onClick,
  disabled,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={
        "w-7 h-7 flex items-center justify-center rounded-lg transition-colors disabled:opacity-40 " +
        (danger
          ? "text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]")
      }
    >
      {children}
    </button>
  );
}

function ColField({
  field,
  value,
  onChange,
  fullWidth,
}: {
  field: ColFieldDef;
  value: unknown;
  onChange: (v: unknown) => void;
  fullWidth?: boolean;
}) {
  const cls = fullWidth ? "sm:col-span-2" : "";
  if (field.type === "image") {
    return (
      <ImageUploadField
        label={field.label}
        value={(value as string) ?? ""}
        onChange={onChange}
        help={(field as { help?: string }).help}
        className={cls}
      />
    );
  }
  if (field.type === "switch") {
    const checked = Boolean(value);
    return (
      <label className={`flex items-center justify-between gap-3 ${cls}`}>
        <span className="text-xs font-medium text-[var(--text-secondary)]">
          {field.label}
        </span>
        <button
          type="button"
          onClick={() => onChange(!checked)}
          className={`relative w-10 h-6 rounded-full transition-colors ${
            checked
              ? "bg-[var(--accent)]"
              : "bg-[var(--bg-tertiary)] border border-[var(--border)]"
          }`}
          aria-pressed={checked}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
              checked ? "translate-x-4" : ""
            }`}
          />
        </button>
      </label>
    );
  }
  if (field.type === "textarea") {
    return (
      <label className={`block space-y-1 ${cls}`}>
        <span className="text-xs font-medium text-[var(--text-secondary)]">
          {field.label}
        </span>
        <textarea
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={field.rows ?? 3}
          className="input-base font-mono text-[12px]"
        />
      </label>
    );
  }
  return (
    <label className={`block space-y-1 ${cls}`}>
      <span className="text-xs font-medium text-[var(--text-secondary)]">
        {field.label}
      </span>
      <input
        type={field.type === "number" ? "number" : field.type}
        value={(value as string | number) ?? ""}
        onChange={(e) =>
          onChange(
            field.type === "number" ? Number(e.target.value) : e.target.value
          )
        }
        placeholder={field.placeholder}
        className="input-base"
      />
    </label>
  );
}
