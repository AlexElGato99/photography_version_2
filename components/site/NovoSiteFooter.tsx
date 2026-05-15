import type {
  Category,
  FooterGalleryImage,
  NavItem,
  SectionContact,
  SiteFooter,
  SiteGeneral,
} from "@/lib/types/site";
import { categoryPublicHref } from "@/lib/site/category-helpers";
import { FooterGallerySliders } from "@/components/site/FooterGallerySliders";

function splitCategories(categories: Category[]): [Category[], Category[]] {
  if (categories.length === 0) return [[], []];
  const mid = Math.ceil(categories.length / 2);
  return [categories.slice(0, mid), categories.slice(mid)];
}

function splitManualLinks(links: NavItem[]): [NavItem[], NavItem[]] {
  const trimmed = (links ?? []).filter((l) => l.label.trim());
  if (trimmed.length === 0) return [[], []];
  const mid = Math.ceil(trimmed.length / 2);
  return [trimmed.slice(0, mid), trimmed.slice(mid)];
}

/** Same footer block as Novo home (grid, gallery, legal bar). */
export function NovoSiteFooter({
  general,
  footer,
  categories,
  footerGalleryImages,
  contact,
}: {
  general: SiteGeneral;
  footer: SiteFooter;
  categories: Category[];
  footerGalleryImages: FooterGalleryImage[];
  contact: SectionContact;
}) {
  const footerCategoryColumns = splitCategories(categories);
  const footerManualLinkColumns = splitManualLinks(footer.pages_links ?? []);
  const footerGalleryUrls = footerGalleryImages.filter((p) => p.image_url);

  return (
    <>
      {contact.social.length > 0 ? (
        <div className="cn-novo-footer-social" aria-label="Social">
          {contact.social.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
              {s.label}
            </a>
          ))}
        </div>
      ) : null}

      <footer className="cn-novo-footer">
        <div className="cn-novo-footer-grid">
          <div className="cn-novo-footer-col">
            <div className="cn-novo-footer-logo">
              <em>{general.brand_italic}</em>
              <b>{general.brand_bold}</b>
            </div>
            <p className="cn-novo-footer-desc">{footer.brand_text || general.description}</p>
          </div>

          <div className="cn-novo-footer-col cn-novo-footer-col--pages">
            <h5 className="cn-novo-footer-heading">{footer.pages_heading}</h5>
            {footer.use_category_pages ? (
              categories.length > 0 ? (
                <div className="cn-novo-footer-links-grid">
                  {footerCategoryColumns.map((col, colIndex) => (
                    <ul key={colIndex} className="cn-novo-footer-links">
                      {col.map((c) => (
                        <li key={c.id}>
                          <a href={categoryPublicHref(c)}>{c.name}</a>
                        </li>
                      ))}
                    </ul>
                  ))}
                </div>
              ) : (
                <p className="cn-novo-footer-empty">No categories yet.</p>
              )
            ) : footer.pages_links.length > 0 ? (
              <div className="cn-novo-footer-links-grid">
                {footerManualLinkColumns.map((col, colIndex) => (
                  <ul key={colIndex} className="cn-novo-footer-links">
                    {col.map((l) => (
                      <li key={`${l.label}-${l.href}`}>
                        <a href={l.href}>{l.label}</a>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            ) : (
              <p className="cn-novo-footer-empty">Add page links in Dashboard → Footer → Pages.</p>
            )}
          </div>

          <div className="cn-novo-footer-col">
            <h5 className="cn-novo-footer-heading">{footer.contact_heading}</h5>
            {footer.show_phone && general.contact_phone ? (
              <p className="cn-novo-contact-row">
                <strong>Phone:</strong>{" "}
                <a href={`tel:${general.contact_phone.replace(/\s/g, "")}`}>{general.contact_phone}</a>
              </p>
            ) : null}
            {footer.show_email && general.contact_email ? (
              <p className="cn-novo-contact-row">
                <strong>Email:</strong>{" "}
                <a href={`mailto:${general.contact_email}`}>{general.contact_email}</a>
              </p>
            ) : null}
            {footer.show_address && (general.address_line || general.address_city) ? (
              <p className="cn-novo-contact-row">
                <strong>Address:</strong> {[general.address_line, general.address_city].filter(Boolean).join(", ")}
              </p>
            ) : null}
            {footer.show_hours && general.hours ? (
              <p className="cn-novo-contact-row">
                <strong>Hours:</strong> {general.hours}
              </p>
            ) : null}
          </div>

          <div className="cn-novo-footer-col cn-novo-footer-col--gallery">
            <h5 className="cn-novo-footer-heading">{footer.gallery_heading}</h5>
            <FooterGallerySliders images={footerGalleryUrls} label={footer.gallery_heading} />
          </div>
        </div>

        <div className="cn-novo-footer-bar">
          {footer.legal.length > 0 ? (
            <nav className="cn-novo-footer-legal" aria-label="Legal">
              {footer.legal.map((l) => (
                <a key={l.label} href={l.href} className="cn-novo-footer-legal-link">
                  {l.label}
                </a>
              ))}
            </nav>
          ) : null}
          {footer.copyright ? <p className="cn-novo-footer-copy">{footer.copyright}</p> : null}
        </div>
      </footer>
    </>
  );
}
