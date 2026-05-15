"use client";

import { SectionForm } from "@/components/dashboard/SectionForm";
import { CollectionEditor } from "@/components/dashboard/CollectionEditor";
import { Tabs } from "@/components/dashboard/Tabs";
import { slugify } from "@/lib/slug";
import { emptyTitleHeading } from "@/lib/site/title-heading";
import type { Category, SectionMeta } from "@/lib/types/site";

export function CategoriesEditor({
  meta,
  categories,
  sectionTitle = "Categories",
}: {
  meta: SectionMeta;
  categories: Category[];
  /** Shown in form headings (e.g. "Category" on the dedicated dashboard route). */
  sectionTitle?: string;
}) {
  return (
    <Tabs
      initial={1}
      tabs={[
        {
          label: "Heading",
          render: () => (
            <SectionForm
              table="section_categories_meta"
              title={`${sectionTitle} · Heading`}
              initialData={meta}
              fields={[
                { key: "eyebrow", label: "Eyebrow", type: "text" },
                { key: "title_heading", label: "Section title", type: "section_heading" },
              ]}
            />
          ),
        },
        {
          label: `Cards & pages (${categories.length})`,
          render: () => (
            <CollectionEditor<Category>
              table="categories"
              title={`${sectionTitle} · Cards & detail pages`}
              initialRows={categories}
              getRowLabel={(row) => {
                const n = String(row.name ?? "").trim();
                if (!n) return null;
                if (n.toLowerCase() === "new category") return null;
                return n;
              }}
              blank={() => ({
                position: 0,
                tag: "Featured",
                name: "New category",
                slug: "",
                image_url: "",
                link_href: "#",
                page_eyebrow: "",
                page_heading: emptyTitleHeading(),
                page_meta_title: "",
                page_meta_description: "",
                page_lead: "",
                page_body_html: "",
                gallery_images: [],
                show_portfolio_related: true,
              })}
              validateRows={(rows) => {
                const slugs = rows.map((r) => {
                  const raw = (r.slug as string)?.trim();
                  return raw ? slugify(raw) : slugify((r.name as string) || "category");
                });
                const seen = new Set<string>();
                for (const s of slugs) {
                  if (seen.has(s)) {
                    return `Duplicate slug "${s}". Edit the Slug (or name) so every category is unique.`;
                  }
                  seen.add(s);
                }
                return null;
              }}
              transformRow={(row) => {
                const raw = (row.slug as string)?.trim();
                const slug = raw ? slugify(raw) : slugify((row.name as string) || "category");
                const gallery_images = (Array.isArray(row.gallery_images) ? row.gallery_images : [])
                  .map((x) => x as { image_url?: string; alt?: string; caption?: string })
                  .filter((x) => (x?.image_url ?? "").trim().length > 0)
                  .map((x) => ({
                    image_url: String(x.image_url).trim(),
                    alt: typeof x.alt === "string" ? x.alt : "",
                    caption: typeof x.caption === "string" ? x.caption : "",
                  }));
                const out: Record<string, unknown> = { ...row, slug, gallery_images };
                delete out.page_title_html;
                return out;
              }}
              fields={[
                { key: "tag", label: "Card · small tag", type: "text" },
                { key: "name", label: "Card · category name", type: "text" },
                {
                  key: "slug",
                  label: "URL slug (page is /category/slug)",
                  type: "text",
                  placeholder: "auto from name if empty",
                },
                {
                  key: "image_url",
                  label: "Card · cover image",
                  type: "image",
                  help: "Shown on the home categories grid and as the hero backdrop on the category page.",
                },
                {
                  key: "link_href",
                  label: "Link href override",
                  type: "text",
                  placeholder: "# for default category page",
                  help: "Use # for the built-in page. Set https://… only to override.",
                },
                { key: "page_eyebrow", label: "Page · eyebrow", type: "text" },
                {
                  key: "page_heading",
                  label: "Page · title",
                  type: "section_heading",
                },
                {
                  key: "page_meta_title",
                  label: "Page · SEO title",
                  type: "text",
                  placeholder: "Browser tab title (optional)",
                },
                {
                  key: "page_meta_description",
                  label: "Page · SEO description",
                  type: "textarea",
                  rows: 2,
                  placeholder: "Search snippet (optional)",
                },
                {
                  key: "page_lead",
                  label: "Page · lead paragraph",
                  type: "textarea",
                  rows: 3,
                },
                {
                  key: "page_body_html",
                  label: "Page · body",
                  type: "richtext",
                  rows: 6,
                },
                { key: "gallery_images", label: "Page · gallery", type: "gallery", help: "Use “Add gallery image” to upload one or many files at once, or “Blank slide” for a row you fill manually." },
                {
                  key: "show_portfolio_related",
                  label: "Show portfolio projects that match this category name",
                  type: "switch",
                },
              ]}
            />
          ),
        },
      ]}
    />
  );
}
