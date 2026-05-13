import Link from "next/link";
import type { SiteFooter, SiteGeneral } from "@/lib/types/site";

export function Footer({
  general,
  footer,
}: {
  general: SiteGeneral;
  footer: SiteFooter;
}) {
  return (
    <footer className="cn-footer">
      <div className="cn-footer-grid" data-stagger-cards>
        <div className="cn-footer-brand">
          <Link href="/" className="cn-footer-logo">
            <i>{general.brand_italic}</i> <b>{general.brand_bold}</b>
          </Link>
          <p>{footer.brand_text}</p>
        </div>
        {footer.columns.map((col) => (
          <div key={col.title} className="cn-footer-col">
            <h5>{col.title}</h5>
            <ul>
              {col.links.map((l) => (
                <li key={l.label}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="cn-footer-bottom">
        <small>{footer.copyright}</small>
        <div className="cn-footer-legal">
          {footer.legal.map((l) => (
            <a key={l.label} href={l.href}>
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
