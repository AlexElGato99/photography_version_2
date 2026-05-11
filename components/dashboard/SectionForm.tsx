"use client";

import { useState, useTransition } from "react";
import { Save, Loader2 } from "lucide-react";
import { updateSingleton } from "@/app/dashboard/actions";
import { ImageUploadField } from "@/components/dashboard/ImageUploadField";
import { RichTextEditor } from "@/components/dashboard/RichTextEditor";
import { TagsField } from "@/components/dashboard/TagsField";
import { NavItemsField } from "@/components/dashboard/NavItemsField";
import { FooterColumnsField } from "@/components/dashboard/FooterColumnsField";

export type FieldDef =
  | {
      key: string;
      label: string;
      type: "text" | "url" | "email" | "tel" | "number";
      placeholder?: string;
      help?: string;
    }
  | {
      key: string;
      label: string;
      type: "textarea" | "html";
      placeholder?: string;
      help?: string;
      rows?: number;
    }
  | {
      key: string;
      label: string;
      type: "switch";
      help?: string;
    }
  | {
      key: string;
      label: string;
      type: "json";
      help?: string;
      rows?: number;
    }
  | {
      key: string;
      label: string;
      type: "image";
      help?: string;
    }
  | {
      key: string;
      label: string;
      type: "tags";
      placeholder?: string;
      help?: string;
    }
  | {
      key: string;
      label: string;
      type: "navitems";
      help?: string;
    }
  | {
      key: string;
      label: string;
      type: "footercolumns";
    };

interface SectionFormProps<T extends Record<string, unknown>> {
  table: string;
  title: string;
  description?: string;
  initialData: T;
  fields: FieldDef[];
}

export function SectionForm<T extends Record<string, unknown>>({
  table,
  title,
  description,
  initialData,
  fields,
}: SectionFormProps<T>) {
  const [values, setValues] = useState<Record<string, unknown>>(initialData);
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<
    | { kind: "idle" }
    | { kind: "ok"; msg: string }
    | { kind: "err"; msg: string }
  >({ kind: "idle" });

  const setKey = (k: string, v: unknown) =>
    setValues((prev) => ({ ...prev, [k]: v }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const payload = { ...values };
      delete (payload as Record<string, unknown>).id;
      delete (payload as Record<string, unknown>).updated_at;
      const res = await updateSingleton(table, payload);
      if (res.ok) {
        setStatus({ kind: "ok", msg: "Saved." });
        window.setTimeout(() => setStatus({ kind: "idle" }), 2200);
      } else {
        setStatus({ kind: "err", msg: res.error });
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className="w-full space-y-6 animate-fade-in">
      <header className="space-y-1">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h2>
        {description && (
          <p className="text-sm text-[var(--text-muted)]">{description}</p>
        )}
      </header>

      <div className="card p-6 space-y-5">
        {fields.map((f) => (
          <Field
            key={f.key}
            field={f}
            value={values[f.key]}
            onChange={(v) => setKey(f.key, v)}
          />
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

      <div className="flex items-center justify-end gap-2">
        <button
          type="submit"
          className="btn-primary"
          disabled={pending}
        >
          {pending ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Save size={14} />
          )}
          {pending ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}

function Field({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  if (field.type === "image") {
    return (
      <ImageUploadField
        label={field.label}
        value={(value as string) ?? ""}
        onChange={onChange}
        help={field.help}
      />
    );
  }

  if (field.type === "tags") {
    const arr = Array.isArray(value) ? (value as string[]) : [];
    return (
      <TagsField
        label={field.label}
        value={arr}
        onChange={onChange}
        help={field.help}
        placeholder={(field as { placeholder?: string }).placeholder}
      />
    );
  }

  if (field.type === "navitems") {
    return (
      <NavItemsField
        label={field.label}
        value={(value as { label: string; href: string }[]) ?? []}
        onChange={onChange}
        help={field.help}
      />
    );
  }

  if (field.type === "footercolumns") {
    return (
      <FooterColumnsField
        label={field.label}
        value={(value as { title: string; links: { label: string; href: string }[] }[]) ?? []}
        onChange={onChange}
      />
    );
  }

  if (field.type === "switch") {
    const checked = Boolean(value);
    return (
      <label className="flex items-center justify-between gap-3">
        <span className="space-y-0.5">
          <span className="block text-sm font-medium text-[var(--text-primary)]">
            {field.label}
          </span>
          {field.help && (
            <span className="block text-xs text-[var(--text-muted)]">
              {field.help}
            </span>
          )}
        </span>
        <button
          type="button"
          onClick={() => onChange(!checked)}
          className={`relative w-10 h-6 rounded-full transition-colors ${
            checked ? "bg-[var(--accent)]" : "bg-[var(--bg-tertiary)] border border-[var(--border)]"
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

  if (field.type === "html") {
    return (
      <RichTextEditor
        label={field.label}
        value={(value as string) ?? ""}
        onChange={onChange}
        help={field.help}
      />
    );
  }

  if (field.type === "textarea") {
    return (
      <label className="block space-y-1.5">
        <span className="text-xs font-medium text-[var(--text-secondary)]">
          {field.label}
        </span>
        <textarea
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={field.rows ?? 4}
          className="input-base font-mono text-[12px]"
        />
        {field.help && (
          <span className="block text-[11px] text-[var(--text-muted)]">{field.help}</span>
        )}
      </label>
    );
  }

  if (field.type === "json") {
    return <JsonField field={field} value={value} onChange={onChange} />;
  }

  return (
    <label className="block space-y-1.5">
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
      {field.help && (
        <span className="block text-[11px] text-[var(--text-muted)]">{field.help}</span>
      )}
    </label>
  );
}

function JsonField({
  field,
  value,
  onChange,
}: {
  field: Extract<FieldDef, { type: "json" }>;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const [text, setText] = useState(() => JSON.stringify(value ?? null, null, 2));
  const [error, setError] = useState<string | null>(null);

  const handleChange = (v: string) => {
    setText(v);
    try {
      onChange(JSON.parse(v));
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-[var(--text-secondary)] flex items-center justify-between">
        {field.label}
        {error ? (
          <span className="text-red-600 dark:text-red-400 text-[10px]">{error}</span>
        ) : (
          <span className="text-[10px] text-[var(--text-muted)]">JSON</span>
        )}
      </span>
      <textarea
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        rows={field.rows ?? 8}
        className="input-base font-mono text-[12px]"
        spellCheck={false}
      />
      {field.help && (
        <span className="block text-[11px] text-[var(--text-muted)]">{field.help}</span>
      )}
    </label>
  );
}
