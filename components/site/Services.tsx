import type { SectionMeta, Service } from "@/lib/types/site";
import { SectionHeading } from "@/components/site/SectionHeading";

export function Services({
  meta,
  services,
}: {
  meta: SectionMeta;
  services: Service[];
}) {
  return (
    <section className="cn-section cn-services" id="services" aria-label="Services">
      <div className="cn-section-head" data-stagger>
        <div>
          <div className="cn-section-eyebrow">{meta.eyebrow}</div>
          <SectionHeading heading={meta.title_heading} />
        </div>
        {meta.lead && <p className="cn-section-lead">{meta.lead}</p>}
      </div>

      <div className="cn-services-grid" data-stagger-cards>
        {services.map((s) => (
          <article key={s.id} className="cn-service-card">
            <div className="cn-service-num">{s.number_label}</div>
            <div
              className="cn-service-icon-wrap"
              dangerouslySetInnerHTML={{ __html: s.icon_svg }}
            />
            <h3 className="cn-service-name">{s.name}</h3>
            <p className="cn-service-desc">{s.description}</p>
            <a href={s.link_href} className="cn-service-link">
              {s.link_label}
              <svg viewBox="0 0 24 24">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
