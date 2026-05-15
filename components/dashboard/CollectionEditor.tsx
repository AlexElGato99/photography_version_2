"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  Loader2,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  ChevronRight,
  Upload,
} from "lucide-react";
import { replaceCollection, uploadImage } from "@/app/dashboard/actions";
import { ImageUploadField } from "@/components/dashboard/ImageUploadField";
import { GalleryField } from "@/components/dashboard/GalleryField";
import { RichTextEditor } from "@/components/dashboard/RichTextEditor";
import { SectionHeadingField } from "@/components/dashboard/SectionHeadingField";
import type { CategoryGalleryImage } from "@/lib/types/site";

export type ColFieldDef =
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
      type: "textarea" | "richtext";
      placeholder?: string;
      rows?: number;
      help?: string;
    }
  | {
      key: string;
      label: string;
      type: "section_heading";
      help?: string;
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
    }
  | {
      key: string;
      label: string;
      type: "gallery";
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
  validateRows?: (rows: T[]) => string | null;
  /** When set, non-empty return value replaces the collapsed-row label (default: `Item #n`). */
  getRowLabel?: (row: T, index: number) => string | null | undefined;
  /** When true, saving zero rows is allowed (delete all). Default false to avoid wiping collections by mistake. */
  allowEmptySave?: boolean;
  /** Enables a multi-file picker that uploads images and appends one row per file. */
  bulkImageUpload?: {
    imageFieldKey?: string;
    buttonLabel?: string;
  };
}

export function CollectionEditor<T extends Record<string, unknown> & { id?: string }>({
  table,
  title,
  description,
  initialRows,
  fields,
  blank,
  transformRow,
  validateRows,
  getRowLabel,
  allowEmptySave = false,
  bulkImageUpload,
}: CollectionEditorProps<T>) {
  const router = useRouter();
  const [rows, setRows] = useState<T[]>(() => (Array.isArray(initialRows) ? initialRows : []));
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<
    { kind: "idle" } | { kind: "ok"; msg: string } | { kind: "err"; msg: string }
  >({ kind: "idle" });
  /** Indices of items whose field grid is visible (all start collapsed). */
  const [expanded, setExpanded] = useState<Set<number>>(() => new Set());
  const initialSig = useRef<string>("");
  const bulkInputRef = useRef<HTMLInputElement>(null);
  const [bulkError, setBulkError] = useState<string | null>(null);
  const [bulkProgress, setBulkProgress] = useState<string | null>(null);
  const [isBulkUploading, startBulkUpload] = useTransition();

  const bulkImageFieldKey = bulkImageUpload?.imageFieldKey ?? "image_url";

  useEffect(() => {
    const next = Array.isArray(initialRows) ? initialRows : [];
    let sig: string;
    try {
      const raw = JSON.stringify(next);
      sig = raw === undefined ? "[]" : raw;
    } catch {
      sig = `__len_${next.length}__`;
    }
    if (sig === initialSig.current) return;
    initialSig.current = sig;
    setRows(next as T[]);
    setExpanded(new Set());
  }, [initialRows]);

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
    setExpanded((prev) => remapExpandedAfterSwap(prev, idx, idx + dir));
  };

  const remove = (idx: number) => {
    setRows((prev) => prev.filter((_, i) => i !== idx));
    setExpanded((prev) => remapExpandedAfterRemove(prev, idx));
  };

  const add = () => {
    setRows((prev) => [...prev, { ...(blank() as T) }]);
  };

  const handleBulkFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length || !bulkImageUpload) return;
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!imageFiles.length) {
      setBulkError("Please select one or more image files.");
      e.target.value = "";
      return;
    }
    setBulkError(null);
    startBulkUpload(async () => {
      const appended: T[] = [];
      let failed = 0;
      for (let i = 0; i < imageFiles.length; i++) {
        setBulkProgress(`Uploading ${i + 1} / ${imageFiles.length}…`);
        const fd = new FormData();
        fd.append("file", imageFiles[i]);
        const res = await uploadImage(fd);
        if (res.ok) {
          appended.push({
            ...(blank() as T),
            [bulkImageFieldKey]: res.url,
          } as T);
        } else {
          failed += 1;
        }
      }
      setBulkProgress(null);
      if (appended.length) {
        setRows((prev) => [...prev, ...appended]);
      }
      if (failed > 0) {
        setBulkError(
          failed === imageFiles.length
            ? "Upload failed for all selected files."
            : `${failed} file(s) failed to upload; others were added.`
        );
      } else if (appended.length > 0) {
        setStatus({
          kind: "ok",
          msg: `Added ${appended.length} image${appended.length === 1 ? "" : "s"}. Click Save collection to publish.`,
        });
        window.setTimeout(() => setStatus({ kind: "idle" }), 4000);
      }
      e.target.value = "";
    });
  };

  const onSave = () => {
    startTransition(async () => {
      if (validateRows) {
        const err = validateRows(rows);
        if (err) {
          setStatus({ kind: "err", msg: err });
          return;
        }
      }
      let prepared: Array<Record<string, unknown>>;
      try {
        prepared = rows.map((r) =>
          transformRow ? transformRow(r) : { ...r }
        );
      } catch (e) {
        setStatus({ kind: "err", msg: (e as Error).message });
        return;
      }
      const res = await replaceCollection(table, prepared, { allowEmpty: allowEmptySave });
      if (res.ok) {
        setStatus({ kind: "ok", msg: "Saved." });
        router.refresh();
        window.setTimeout(() => setStatus({ kind: "idle" }), 2200);
      } else {
        setStatus({ kind: "err", msg: res.error });
      }
    });
  };

  return (
    <div className="w-full space-y-6 animate-fade-in">
      <header className="flex min-w-0 flex-wrap items-start justify-between gap-x-3 gap-y-2">
        <div className="min-w-0 flex-1 space-y-1 pr-2">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h2>
          {description && (
            <p className="text-sm text-[var(--text-muted)]">{description}</p>
          )}
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {bulkImageUpload ? (
            <>
              <input
                ref={bulkInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleBulkFileChange}
              />
              <button
                type="button"
                disabled={isBulkUploading || pending}
                onClick={() => bulkInputRef.current?.click()}
                className="btn-primary text-xs inline-flex items-center gap-1.5"
              >
                {isBulkUploading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Upload size={14} />
                )}
                {bulkImageUpload.buttonLabel ?? "Upload images"}
              </button>
            </>
          ) : null}
          <button type="button" onClick={add} className="btn-secondary shrink-0" disabled={isBulkUploading}>
            <Plus size={14} /> Add item
          </button>
        </div>
      </header>

      {bulkImageUpload && bulkProgress ? (
        <p className="text-xs text-[var(--text-muted)]">{bulkProgress}</p>
      ) : null}
      {bulkImageUpload && bulkError ? (
        <p className="text-xs font-medium text-red-600 dark:text-red-400">{bulkError}</p>
      ) : null}
      {bulkImageUpload ? (
        <p className="text-xs text-[var(--text-muted)]">
          Select multiple files at once. New images are added to the list below — click{" "}
          <b className="text-[var(--text-primary)]">Save collection</b> when you are done.
        </p>
      ) : null}

      <div className="space-y-3">
        {rows.length === 0 && (
          <div className="card p-6 text-center text-sm text-[var(--text-muted)]">
            No items yet. Click <b className="text-[var(--text-primary)]">Add item</b> to create one.
          </div>
        )}
        {rows.map((row, idx) => {
          const isOpen = expanded.has(idx);
          const fromLabel = getRowLabel?.(row, idx);
          const rowSummary =
            typeof fromLabel === "string" && fromLabel.trim() !== ""
              ? fromLabel.trim()
              : `Item #${idx + 1}`;
          return (
            <div key={idx} className="card min-w-0 p-5 space-y-4">
              <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-2 gap-y-2">
                <div className="flex min-w-0 flex-1 items-center gap-1 pr-2">
                  <IconBtn
                    label={isOpen ? "Collapse item" : "Expand item"}
                    aria-expanded={isOpen}
                    onClick={() =>
                      setExpanded((prev) => {
                        const next = new Set(prev);
                        if (next.has(idx)) next.delete(idx);
                        else next.add(idx);
                        return next;
                      })
                    }
                  >
                    {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </IconBtn>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] truncate">
                    {rowSummary}
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <IconBtn label="Move up" onClick={() => move(idx, -1)} disabled={idx === 0}>
                    <ArrowUp size={14} />
                  </IconBtn>
                  <IconBtn
                    label="Move down"
                    onClick={() => move(idx, 1)}
                    disabled={idx === rows.length - 1}
                  >
                    <ArrowDown size={14} />
                  </IconBtn>
                  <IconBtn label="Remove" onClick={() => remove(idx)} danger>
                    <Trash2 size={14} />
                  </IconBtn>
                </div>
              </div>

              {isOpen && (
                <div className="grid min-w-0 grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-[var(--border)]">
                  {fields.map((f) => (
                    <ColField
                      key={f.key}
                      field={f}
                      value={row[f.key]}
                      onChange={(v) => updateRow(idx, f.key, v)}
                      fullWidth={
                        f.type === "textarea" ||
                        f.type === "richtext" ||
                        f.type === "image" ||
                        f.type === "gallery" ||
                        f.type === "section_heading" ||
                        f.type === "switch"
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
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

function remapExpandedAfterRemove(expanded: Set<number>, removedIdx: number): Set<number> {
  const next = new Set<number>();
  expanded.forEach((i) => {
    if (i === removedIdx) return;
    next.add(i > removedIdx ? i - 1 : i);
  });
  return next;
}

function remapExpandedAfterSwap(expanded: Set<number>, a: number, b: number): Set<number> {
  const next = new Set<number>();
  expanded.forEach((i) => {
    if (i === a) next.add(b);
    else if (i === b) next.add(a);
    else next.add(i);
  });
  return next;
}

function IconBtn({
  label,
  onClick,
  disabled,
  danger,
  children,
  "aria-expanded": ariaExpanded,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: React.ReactNode;
  "aria-expanded"?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      aria-expanded={ariaExpanded}
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
  const cls = [fullWidth && "sm:col-span-2", "min-w-0"].filter(Boolean).join(" ");
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
    const checked = value !== false && value !== "false";
    return (
      <label
        className={`flex w-full min-w-0 max-w-full flex-wrap items-center justify-between gap-x-3 gap-y-2 ${cls}`}
      >
        <span className="min-w-0 flex-1 pr-2 text-xs font-medium text-[var(--text-secondary)]">
          {field.label}
        </span>
        <button
          type="button"
          onClick={() => onChange(!checked)}
          className={`relative shrink-0 w-10 h-6 rounded-full transition-colors ${
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
  if (field.type === "gallery") {
    return (
      <div className={cls}>
        <GalleryField
          label={field.label}
          value={(value as CategoryGalleryImage[]) ?? []}
          onChange={onChange}
          help={field.help}
        />
      </div>
    );
  }
  if (field.type === "section_heading") {
    return (
      <div className={cls}>
        <SectionHeadingField
          label={field.label}
          value={value}
          onChange={onChange}
          help={(field as { help?: string }).help}
        />
      </div>
    );
  }
  if (field.type === "richtext") {
    return (
      <RichTextEditor
        label={field.label}
        value={(value as string) ?? ""}
        onChange={onChange}
        help={(field as { help?: string }).help}
        className={cls}
      />
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
