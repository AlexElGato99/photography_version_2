"use client";

import { useRef, useState, useTransition } from "react";
import { Upload, X, ImageIcon, Loader2, Link } from "lucide-react";
import { ingestRemoteImageAsWebp, uploadImage } from "@/app/dashboard/actions";
import { isAlreadySiteMediaWebp } from "@/lib/images/remote-url";

interface ImageUploadFieldProps {
  label: string;
  value: string;           // current URL (from DB)
  onChange: (url: string) => void;
  help?: string;
  className?: string;
}

export function ImageUploadField({
  label,
  value,
  onChange,
  help,
  className = "",
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>(value ?? "");
  const [uploading, startUpload] = useTransition();
  const [ingestingUrl, setIngestingUrl] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);

  // Keep preview in sync when parent resets value
  const displayed = preview || value;

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    // optimistic local preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setError(null);

    startUpload(async () => {
      const fd = new FormData();
      fd.append("file", file);
      const res = await uploadImage(fd);
      if (res.ok) {
        // swap optimistic blob URL with real public URL
        URL.revokeObjectURL(objectUrl);
        setPreview(res.url);
        onChange(res.url);
      } else {
        setError(res.error);
        setPreview(value); // revert preview
      }
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  const tryIngestUrlAsWebp = async (rawUrl: string) => {
    const u = rawUrl.trim();
    if (!u || !/^https?:\/\//i.test(u)) return;
    if (isAlreadySiteMediaWebp(u, supabaseUrl)) return;
    setIngestingUrl(true);
    setError(null);
    try {
      const res = await ingestRemoteImageAsWebp(u);
      if (res.ok) {
        setPreview(res.url);
        onChange(res.url);
      } else {
        setError(res.error);
      }
    } finally {
      setIngestingUrl(false);
    }
  };

  const clearImage = () => {
    setPreview("");
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={`block min-w-0 space-y-1.5 ${className}`}>
      {/* Label row */}
      <div className="flex w-full min-w-0 max-w-full flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <span className="min-w-0 flex-1 pr-2 text-xs font-medium text-[var(--text-secondary)]">
          {label}
        </span>
        <button
          type="button"
          onClick={() => setShowUrlInput((v) => !v)}
          className="flex shrink-0 items-center gap-1 text-[10px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          title="Paste URL instead"
        >
          <Link size={10} />
          {showUrlInput ? "Hide URL" : "Use URL"}
        </button>
      </div>

      {/* URL input (collapsible) */}
      {showUrlInput && (
        <input
          type="url"
          value={displayed}
          onChange={(e) => {
            setPreview(e.target.value);
            onChange(e.target.value);
          }}
          onBlur={() => {
            void tryIngestUrlAsWebp(displayed);
          }}
          placeholder="https://..."
          disabled={ingestingUrl}
          className="input-base text-xs"
        />
      )}

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="relative group rounded-xl border-2 border-dashed border-[var(--border)] hover:border-[var(--accent)] transition-colors overflow-hidden"
        style={{ minHeight: "9rem" }}
      >
        {/* Preview */}
        {displayed ? (
          <div className="relative w-full h-36">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displayed}
              alt="preview"
              className="w-full h-full object-cover"
              onError={() => setPreview("")}
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploading || ingestingUrl}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--accent)] text-white text-xs font-medium hover:opacity-90 transition-opacity"
              >
                {uploading ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Upload size={12} />
                )}
                Replace
              </button>
              <button
                type="button"
                onClick={clearImage}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/90 text-white text-xs font-medium hover:bg-red-500 transition-colors"
              >
                <X size={12} /> Remove
              </button>
            </div>
          </div>
        ) : (
          /* Empty state */
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading || ingestingUrl}
            className="w-full h-36 flex flex-col items-center justify-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            {uploading ? (
              <>
                <Loader2 size={20} className="animate-spin text-[var(--accent)]" />
                <span className="text-xs">Uploading…</span>
              </>
            ) : (
              <>
                <ImageIcon size={20} />
                <span className="text-xs">
                  Click or drag an image here
                </span>
              </>
            )}
          </button>
        )}

        {/* Upload spinner overlay when replacing */}
        {(uploading || ingestingUrl) && displayed && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Loader2 size={24} className="animate-spin text-white" />
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="text-[11px] text-red-500">{error}</p>
      )}

      {/* Help */}
      {showUrlInput && !error && (
        <span className="block text-[11px] text-[var(--text-muted)]">
          Pasted URLs are fetched and re-saved as WebP when you leave the field.
        </span>
      )}

      {help && !error && (
        <span className="block text-[11px] text-[var(--text-muted)]">{help}</span>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
}
