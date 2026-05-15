"use client";

import { useState, useTransition } from "react";
import { Save, Loader2 } from "lucide-react";
import { updateSingleton } from "@/app/dashboard/actions";
import { CollectionEditor } from "@/components/dashboard/CollectionEditor";
import { Field, type FieldDef } from "@/components/dashboard/SectionForm";
import { Tabs } from "@/components/dashboard/Tabs";
import type { FooterGalleryImage, SiteFooter } from "@/lib/types/site";

function FooterSettingsPanel({
  values,
  setKey,
  fields,
  onSave,
  pending,
  status,
}: {
  values: Record<string, unknown>;
  setKey: (k: string, v: unknown) => void;
  fields: FieldDef[];
  onSave: (e: React.FormEvent) => void;
  pending: boolean;
  status: { kind: "idle" } | { kind: "ok"; msg: string } | { kind: "err"; msg: string };
}) {
  return (
    <form onSubmit={onSave} className="space-y-5">
      <div className="card p-6 space-y-5">
        {fields.map((f) => (
          <Field key={f.key} field={f} value={values[f.key]} onChange={(v) => setKey(f.key, v)} />
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
      <div className="flex justify-end">
        <button type="submit" className="btn-primary" disabled={pending}>
          {pending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {pending ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}

export function FooterEditor({
  footer,
  gallery,
}: {
  footer: SiteFooter;
  gallery: FooterGalleryImage[];
}) {
  const [values, setValues] = useState<Record<string, unknown>>({ ...footer });
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<
    { kind: "idle" } | { kind: "ok"; msg: string } | { kind: "err"; msg: string }
  >({ kind: "idle" });

  const setKey = (k: string, v: unknown) => setValues((prev) => ({ ...prev, [k]: v }));

  const saveFooter = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const payload = { ...values };
      delete payload.id;
      delete payload.updated_at;
      const res = await updateSingleton("site_footer", payload);
      if (res.ok) {
        setStatus({ kind: "ok", msg: "Footer settings saved." });
        window.setTimeout(() => setStatus({ kind: "idle" }), 2200);
      } else {
        setStatus({ kind: "err", msg: res.error });
      }
    });
  };

  const useCategories = Boolean(values.use_category_pages);

  return (
    <div className="w-full space-y-4 animate-fade-in">
      <header className="space-y-1">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Footer</h2>
        <p className="text-sm text-[var(--text-muted)]">
          Control the homepage footer: brand copy, column headings, page links, contact details, gallery
          images, and legal links.
        </p>
      </header>

      <Tabs
        tabs={[
          {
            label: "Brand",
            render: () => (
              <FooterSettingsPanel
                values={values}
                setKey={setKey}
                pending={pending}
                status={status}
                onSave={saveFooter}
                fields={[
                  {
                    key: "brand_text",
                    label: "Brand description",
                    type: "textarea",
                    rows: 4,
                    help: "Shown under the logo in the first footer column.",
                  },
                  { key: "copyright", label: "Copyright line", type: "text" },
                ]}
              />
            ),
          },
          {
            label: "Headings",
            render: () => (
              <FooterSettingsPanel
                values={values}
                setKey={setKey}
                pending={pending}
                status={status}
                onSave={saveFooter}
                fields={[
                  { key: "pages_heading", label: "Pages column title", type: "text" },
                  { key: "contact_heading", label: "Contact column title", type: "text" },
                  { key: "gallery_heading", label: "Gallery column title", type: "text" },
                ]}
              />
            ),
          },
          {
            label: "Pages",
            render: () => (
              <FooterSettingsPanel
                values={values}
                setKey={setKey}
                pending={pending}
                status={status}
                onSave={saveFooter}
                fields={[
                  {
                    key: "use_category_pages",
                    label: "List categories from Category",
                    type: "switch",
                    help: "When on, the Pages column shows your published categories. When off, use custom links below.",
                  },
                  ...(!useCategories
                    ? [
                        {
                          key: "pages_links",
                          label: "Custom page links",
                          type: "navitems" as const,
                          help: "Two-column layout on the site; links are split evenly.",
                        },
                      ]
                    : []),
                ]}
              />
            ),
          },
          {
            label: "Contact",
            render: () => (
              <FooterSettingsPanel
                values={values}
                setKey={setKey}
                pending={pending}
                status={status}
                onSave={saveFooter}
                fields={[
                  {
                    key: "show_phone",
                    label: "Show phone",
                    type: "switch",
                    help: "Uses the phone from Brand & General.",
                  },
                  {
                    key: "show_email",
                    label: "Show email",
                    type: "switch",
                    help: "Uses the email from Brand & General.",
                  },
                  {
                    key: "show_address",
                    label: "Show address",
                    type: "switch",
                    help: "Uses address fields from Brand & General.",
                  },
                  {
                    key: "show_hours",
                    label: "Show studio hours",
                    type: "switch",
                    help: "Uses hours from Brand & General.",
                  },
                ]}
              />
            ),
          },
          {
            label: "Legal",
            render: () => (
              <FooterSettingsPanel
                values={values}
                setKey={setKey}
                pending={pending}
                status={status}
                onSave={saveFooter}
                fields={[
                  {
                    key: "legal",
                    label: "Legal links",
                    type: "navitems",
                    help: "Centered in the bottom bar (Privacy, Terms, etc.).",
                  },
                ]}
              />
            ),
          },
          {
            label: `Gallery (${gallery.length})`,
            render: () => (
              <CollectionEditor<FooterGalleryImage>
                table="footer_gallery_images"
                title="Footer gallery"
                description="Images in the fourth footer column (vertical slider). Upload several at once, reorder, then save."
                allowEmptySave
                initialRows={gallery}
                bulkImageUpload={{
                  imageFieldKey: "image_url",
                  buttonLabel: "Upload multiple images",
                }}
                getRowLabel={(row, idx) =>
                  row.image_url ? `Image ${idx + 1}` : `New image ${idx + 1}`
                }
                blank={() => ({
                  position: 0,
                  image_url: "",
                  link_href: "#",
                })}
                fields={[
                  { key: "image_url", label: "Image", type: "image" },
                  { key: "link_href", label: "Link (optional)", type: "text" },
                ]}
              />
            ),
          },
        ]}
      />
    </div>
  );
}
