import type { NavItem, SiteFooter } from "@/lib/types/site";

function parseNavItems(raw: unknown): NavItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const o = item as Record<string, unknown>;
      const label = String(o.label ?? "").trim();
      const href = String(o.href ?? "#").trim() || "#";
      if (!label) return null;
      return { label, href };
    })
    .filter((x): x is NavItem => x !== null);
}

export function normalizeFooterRow(
  row: Record<string, unknown>,
  fallback: SiteFooter
): SiteFooter {
  return {
    id: 1,
    brand_text: String(row.brand_text ?? fallback.brand_text),
    copyright: String(row.copyright ?? fallback.copyright),
    columns: Array.isArray(row.columns)
      ? (row.columns as SiteFooter["columns"])
      : fallback.columns,
    legal: parseNavItems(row.legal).length ? parseNavItems(row.legal) : fallback.legal,
    pages_heading: String(row.pages_heading ?? fallback.pages_heading).trim() || fallback.pages_heading,
    contact_heading:
      String(row.contact_heading ?? fallback.contact_heading).trim() || fallback.contact_heading,
    gallery_heading:
      String(row.gallery_heading ?? fallback.gallery_heading).trim() || fallback.gallery_heading,
    use_category_pages:
      row.use_category_pages === undefined || row.use_category_pages === null
        ? fallback.use_category_pages
        : Boolean(row.use_category_pages),
    pages_links: parseNavItems(row.pages_links),
    show_phone:
      row.show_phone === undefined || row.show_phone === null
        ? fallback.show_phone
        : Boolean(row.show_phone),
    show_email:
      row.show_email === undefined || row.show_email === null
        ? fallback.show_email
        : Boolean(row.show_email),
    show_address:
      row.show_address === undefined || row.show_address === null
        ? fallback.show_address
        : Boolean(row.show_address),
    show_hours:
      row.show_hours === undefined || row.show_hours === null
        ? fallback.show_hours
        : Boolean(row.show_hours),
  };
}
