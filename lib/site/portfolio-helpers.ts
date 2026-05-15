import { slugify } from "@/lib/slug";
import { parseGalleryImages } from "@/lib/site/category-helpers";
import {
  normalizeTitleHeading,
  titleHeadingFromLegacyHtml,
} from "@/lib/site/title-heading";
import type { PortfolioItem } from "@/lib/types/site";

/** Public URL path segment for this project (explicit slug or slugified title). */
export function portfolioItemSlug(p: Pick<PortfolioItem, "slug" | "title">): string {
  const raw = (p.slug ?? "").trim();
  if (raw) return slugify(raw);
  const t = (p.title ?? "").trim();
  return t ? slugify(t) : "project";
}

export function portfolioPublicHref(p: PortfolioItem): string {
  const href = (p.link_href ?? "").trim();
  if (href.startsWith("http://") || href.startsWith("https://")) return href;
  if (href && href !== "#") return href;
  return `/project/${portfolioItemSlug(p)}`;
}

export function normalizePortfolioRow(row: Record<string, unknown>): PortfolioItem {
  const pageHeadingRaw = row.page_heading;
  let page_heading = normalizeTitleHeading(pageHeadingRaw);
  const hasHeading =
    page_heading.line1 ||
    page_heading.mid ||
    page_heading.em ||
    page_heading.tail ||
    page_heading.line2 ||
    page_heading.breakAfterLine1;
  if (!hasHeading && typeof row.page_title_html === "string" && row.page_title_html.trim()) {
    page_heading = titleHeadingFromLegacyHtml(String(row.page_title_html));
  }

  return {
    id: String(row.id ?? ""),
    position: Number(row.position ?? 0),
    number_label: String(row.number_label ?? "— 01"),
    tag: String(row.tag ?? ""),
    title: String(row.title ?? ""),
    image_url: String(row.image_url ?? ""),
    tab: String(row.tab ?? "All"),
    link_href: String(row.link_href ?? "#"),
    slug: String(row.slug ?? ""),
    page_eyebrow: String(row.page_eyebrow ?? ""),
    page_heading,
    page_meta_title: String(row.page_meta_title ?? ""),
    page_meta_description: String(row.page_meta_description ?? ""),
    page_lead: String(row.page_lead ?? ""),
    page_body_html: String(row.page_body_html ?? ""),
    gallery_images: parseGalleryImages(row.gallery_images),
  };
}

function portfolioSlugMatch(p: PortfolioItem, normalized: string): boolean {
  const stored = (p.slug ?? "").trim();
  if (stored) return slugify(stored).toLowerCase() === normalized;
  return portfolioItemSlug(p).toLowerCase() === normalized;
}

export function findPortfolioBySlug(items: PortfolioItem[], slug: string): PortfolioItem | null {
  const normalized = slug.trim().toLowerCase();
  if (!normalized) return null;
  return items.find((p) => portfolioSlugMatch(p, normalized)) ?? null;
}
