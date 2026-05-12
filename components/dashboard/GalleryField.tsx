"use client";

import { Plus } from "lucide-react";
import { ImageUploadField } from "@/components/dashboard/ImageUploadField";
import type { CategoryGalleryImage } from "@/lib/types/site";

export function GalleryField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: CategoryGalleryImage[];
  onChange: (v: CategoryGalleryImage[]) => void;
}) {
  const items = Array.isArray(value) ? value : [];

  const update = (i: number, patch: Partial<CategoryGalleryImage>) => {
    onChange(items.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  };

  const add = () =>
    onChange([...items, { image_url: "", alt: "", caption: "" }]);

  const remove = (i: number) => onChange(items.filter((_, j) => j !== i));

  return (
    <div className="block space-y-3 sm:col-span-2">
      <span className="text-xs font-medium text-[var(--text-secondary)]">
        {label}
      </span>
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
      <button type="button" onClick={add} className="btn-secondary text-xs">
        <Plus size={14} /> Add gallery image
      </button>
    </div>
  );
}
