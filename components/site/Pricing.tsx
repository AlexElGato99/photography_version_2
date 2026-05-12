import type { PricingTier, SectionMeta } from "@/lib/types/site";
import { SectionHeading } from "@/components/site/SectionHeading";

const Check = () => (
  <svg viewBox="0 0 24 24">
    <path d="M5 13l4 4L19 7" />
  </svg>
);

const Arrow = () => (
  <svg viewBox="0 0 24 24">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export function Pricing({
  meta,
  tiers,
}: {
  meta: SectionMeta;
  tiers: PricingTier[];
}) {
  return (
    <section className="cn-section cn-pricing" id="pricing" aria-label="Pricing">
      <div className="cn-section-head-center" data-stagger>
        <div className="cn-section-eyebrow">{meta.eyebrow}</div>
        <SectionHeading heading={meta.title_heading} />
        {meta.lead && (
          <p className="cn-section-lead" style={{ margin: "1.5rem auto 0" }}>
            {meta.lead}
          </p>
        )}
      </div>

      <div className="cn-pricing-grid" data-stagger-cards>
        {tiers.map((t) => (
          <div
            key={t.id}
            className={`cn-price-card${t.featured ? " featured" : ""}`}
          >
            {t.badge && <div className="cn-price-badge">{t.badge}</div>}
            <div className="cn-price-name">{t.name}</div>
            <div className="cn-price-amount">
              <span className="cn-currency">{t.currency}</span>
              <span className="cn-num">{t.amount}</span>
            </div>
            <p className="cn-price-period">{t.period}</p>
            <ul className="cn-price-features">
              {(Array.isArray(t.features) ? t.features : []).map((f, i) => (
                <li key={i}>
                  <Check />
                  {f}
                </li>
              ))}
            </ul>
            <a href={t.cta_href} className="cn-price-cta">
              {t.cta_label}
              <Arrow />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
