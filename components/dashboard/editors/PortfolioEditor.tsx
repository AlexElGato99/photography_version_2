"use client";

import { SectionForm } from "@/components/dashboard/SectionForm";
import { CollectionEditor } from "@/components/dashboard/CollectionEditor";
import { Tabs } from "@/components/dashboard/Tabs";
import { slugify } from "@/lib/slug";
import { emptyTitleHeading } from "@/lib/site/title-heading";
import type { PortfolioItem, SectionPortfolioMeta } from "@/lib/types/site";

export function PortfolioEditor({
  meta,
  items,
}: {
  meta: SectionPortfolioMeta;
  items: PortfolioItem[];
}) {
  return (
    <Tabs
      tabs={[
        {
          label: "Heading & tabs",
          render: () => (
            <SectionForm
              table="section_portfolio_meta"
              title="Portfolio · Heading"
              initialData={meta}
              fields={[
                { key: "eyebrow", label: "Eyebrow", type: "text" },
                { key: "title_heading", label: "Section title", type: "section_heading" },
                { key: "lead", label: "Lead paragraph", type: "textarea" },
                {
                  key: "tabs",
                  label: "Filter tabs",
                  type: "tags",
                  placeholder: "e.g. All",
                  help: 'One label per chip (left to right). Usually start with "All" if you use it as the catch-all. Each portfolio item\'s "Tab (filter)" must match one of these labels.',
                },
              ]}
            />
          ),
        },
        {
          label: `Items & pages (${items.length})`,
          render: () => (
            <CollectionEditor<PortfolioItem>
              table="portfolio_items"
              title="Portfolio · Projects"
              initialRows={items}
              blank={() => ({
                position: 0,
                number_label: "— 07",
                tag: "Wedding",
                title: "New project",
                image_url: "",
                tab: "All",
                link_href: "#",
                slug: "",
                page_eyebrow: "",
                page_heading: emptyTitleHeading(),
                page_meta_title: "",
                page_meta_description: "",
                page_lead: "",
                page_body_html: "",
                gallery_images: [],
              })}
              transformRow={(row) => {
                const raw = (row.slug as string)?.trim();
                const slug = raw ? slugify(raw) : "";
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
              validateRows={(rows) => {
                const slugs = rows.map((r) => {
                  const raw = (r.slug as string)?.trim();
                  return raw ? slugify(raw) : slugify((r.title as string) || "project");
                });
                const seen = new Set<string>();
                for (const s of slugs) {
                  if (seen.has(s)) {
                    return `Duplicate project URL slug "${s}". Change Title, Slug override, or slug field so every project URL is unique.`;
                  }
                  seen.add(s);
                }
                return null;
              }}
              fields={[
                { key: "number_label", label: "Number label", type: "text" },
                { key: "tag", label: "Tag", type: "text" },
                { key: "title", label: "Title", type: "text" },
                { key: "image_url", label: "Cover image", type: "image" },
                { key: "tab", label: "Tab (filter)", type: "text" },
                {
                  key: "slug",
                  label: "URL slug (page is /project/slug)",
                  type: "text",
                  placeholder: "auto from title if empty",
                  help: "Lowercase path segment. Leave blank to derive from Title (e.g. “Sofia & Daniel” → sofia-daniel).",
                },
                {
                  key: "link_href",
                  label: "Link href override",
                  type: "text",
                  placeholder: "# for built-in project page",
                  help: "Use # for the project detail page. Set https://… only to override.",
                },
                {
                  key: "page_lead",
                  label: "Homepage · right column text",
                  type: "textarea",
                  rows: 3,
                  help: "Shown under the title in the homepage portfolio slider (and as the lead on the project page if set).",
                },
                { key: "page_eyebrow", label: "Project page · eyebrow", type: "text" },
                {
                  key: "page_heading",
                  label: "Project page · title",
                  type: "section_heading",
                  help: "Optional structured title on the project page. If empty, the project Title is used.",
                },
                {
                  key: "page_meta_title",
                  label: "Project page · SEO title",
                  type: "text",
                  placeholder: "Browser tab title (optional)",
                },
                {
                  key: "page_meta_description",
                  label: "Project page · SEO description",
                  type: "textarea",
                  rows: 2,
                  placeholder: "Search snippet (optional)",
                },
                {
                  key: "page_body_html",
                  label: "Project page · body",
                  type: "richtext",
                  rows: 6,
                },
                {
                  key: "gallery_images",
                  label: "Project page · gallery (slider)",
                  type: "gallery",
                  help: "Same card slider as category pages. Add images here to show the gallery section.",
                },
              ]}
            />
          ),
        },
      ]}
    />
  );
}
