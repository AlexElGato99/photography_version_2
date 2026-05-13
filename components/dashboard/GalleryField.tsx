"use client";

import { useRef, useState, useTransition } from "react";
import { Plus, Upload, Loader2 } from "lucide-react";
import { ImageUploadField } from "@/components/dashboard/ImageUploadField";
import { uploadImage } from "@/app/dashboard/actions";
import type { CategoryGalleryImage } from "@/lib/types/site";

export function GalleryField({
  label,
  value,
  onChange,
  help,
}: {
  label: string;
  value: CategoryGalleryImage[];
  onChange: (v: CategoryGalleryImage[]) => void;
  help?: string;
}) {
  const items = Array.isArray(value) ? value : [];
  const itemsRef = useRef(items);
  itemsRef.current = items;
  const multiInputRef = useRef<HTMLInputElement>(null);
  const [multiError, setMultiError] = useState<string | null>(null);
  const [multiProgress, setMultiProgress] = useState<string | null>(null);
  const [isMultiUploading, startMultiUpload] = useTransition();

  const update = (i: number, patch: Partial<CategoryGalleryImage>) => {
    onChange(items.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  };

  const addBlank = () =>
    onChange([...items, { image_url: "", alt: "", caption: "" }]);

  const remove = (i: number) => onChange(items.filter((_, j) => j !== i));

  const handleMultiFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!imageFiles.length) {
      setMultiError("Please select one or more image files.");
      e.target.value = "";
      return;
    }
    setMultiError(null);
    startMultiUpload(async () => {
      const appended: CategoryGalleryImage[] = [];
      let failed = 0;
      for (let i = 0; i < imageFiles.length; i++) {
        setMultiProgress(`Uploading ${i + 1} / ${imageFiles.length}…`);
        const fd = new FormData();
        fd.append("file", imageFiles[i]);
        const res = await uploadImage(fd);
        if (res.ok) {
          appended.push({ image_url: res.url, alt: "", caption: "" });
        } else {
          failed += 1;
        }
      }
      setMultiProgress(null);
      if (appended.length) {
        onChange([...itemsRef.current, ...appended]);
      }
      if (failed > 0) {
        setMultiError(
          failed === imageFiles.length
            ? "Upload failed for all selected files."
            : `${failed} file(s) failed to upload; others were added.`
        );
      }
      e.target.value = "";
    });
  };

  return (
    <div className="flex flex-col gap-3 sm:col-span-2 min-w-0">
      <div className="flex w-full min-w-0 max-w-full flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <span className="min-w-0 flex-1 pr-2 text-xs font-medium text-[var(--text-secondary)]">
          {label}
        </span>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <input
            ref={multiInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleMultiFileChange}
          />
          <button
            type="button"
            disabled={isMultiUploading}
            onClick={() => multiInputRef.current?.click()}
            className="btn-secondary text-xs inline-flex items-center gap-1.5"
          >
            {isMultiUploading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Upload size={14} />
            )}
            Add gallery image
          </button>
          <button
            type="button"
            disabled={isMultiUploading}
            onClick={addBlank}
            className="text-[11px] font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:underline"
          >
            <Plus size={12} className="inline align-text-bottom mr-0.5" />
            Blank slide
          </button>
        </div>
      </div>
      {multiProgress && (
        <p className="text-[11px] text-[var(--text-muted)]">{multiProgress}</p>
      )}
      {multiError && (
        <p className="text-[11px] text-red-500">{multiError}</p>
      )}
      {items.map((item, i) => (
        <div
          key={i}
          className="rounded-xl border border-[var(--border)] p-4 space-y-3 bg-[var(--bg-primary)]"
        >
          <ImageUploadField
            label={`Image ${i + 1}`}
            value={item.image_url}
            onChange={(url) => update(i, { image_url: url })}
          />
          <label className="block space-y-1">
            <span className="text-[10px] font-medium text-[var(--text-muted)]">
              Alt text
            </span>
            <input
              type="text"
              value={item.alt ?? ""}
              onChange={(e) => update(i, { alt: e.target.value })}
              className="input-base text-xs"
              placeholder="Describe the image for accessibility"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-[10px] font-medium text-[var(--text-muted)]">
              Caption (optional)
            </span>
            <input
              type="text"
              value={item.caption ?? ""}
              onChange={(e) => update(i, { caption: e.target.value })}
              className="input-base text-xs"
              placeholder="Short label shown on hover"
            />
          </label>
          <button
            type="button"
            onClick={() => remove(i)}
            className="text-[11px] font-medium text-red-600 hover:underline"
          >
            Remove this slide
          </button>
        </div>
      ))}
      {help && (
        <p className="text-[11px] text-[var(--text-muted)] pt-1">{help}</p>
      )}
    </div>
  );
}
