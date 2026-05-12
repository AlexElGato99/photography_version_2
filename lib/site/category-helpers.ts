import { slugify } from "@/lib/slug";
import type { Category, CategoryGalleryImage, PortfolioItem } from "@/lib/types/site";
import { normalizeTitleHeading, titleHeadingFromLegacyHtml } from "@/lib/site/title-heading";

export function categorySlug(c: Pick<Category, "slug" | "name">): string {
  const raw = (c.slug ?? "").trim();
  return raw ? slugify(raw) : slugify(c.name);
}

export function categoryPublicHref(c: Pick<Category, "slug" | "name" | "link_href">): string {
  const href = (c.link_href ?? "").trim();
  if (href.startsWith("http://") || href.startsWith("https://")) return href;
  if (href && href !== "#") return href;
  return `/category/${categorySlug(c)}`;
}

export function parseGalleryImages(v: unknown): CategoryGalleryImage[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((x) => x as Record<string, unknown>)
    .filter((x) => x && typeof x.image_url === "string")
    .map((x) => ({
      image_url: String(x.image_url),
      alt: typeof x.alt === "string" ? x.alt : undefined,
      caption: typeof x.caption === "string" ? x.caption : undefined,
    }));
}

export function normalizeCategoryRow(row: Record<string, unknown>): Category {
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
    tag: String(row.tag ?? "Featured"),
    name: String(row.name ?? ""),
    slug: String(row.slug ?? ""),
    image_url: String(row.image_url ?? ""),
    link_href: String(row.link_href ?? "#"),
    page_eyebrow: String(row.page_eyebrow ?? ""),
    page_heading,
    page_meta_title: String(row.page_meta_title ?? ""),
    page_meta_description: String(row.page_meta_description ?? ""),
    page_lead: String(row.page_lead ?? ""),
    page_body_html: String(row.page_body_html ?? ""),
    gallery_images: parseGalleryImages(row.gallery_images),
    show_portfolio_related: row.show_portfolio_related !== false,
  };
}

export function portfolioForCategory(
  items: PortfolioItem[],
  categoryName: string
): PortfolioItem[] {
  const n = categoryName.trim().toLowerCase();
  return items.filter(
    (p) =>
      p.tab.trim().toLowerCase() === n ||
      p.tag.trim().toLowerCase() === n
  );
}
