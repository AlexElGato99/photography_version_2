"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { PortfolioItem, SectionPortfolioMeta } from "@/lib/types/site";
import { SectionHeading } from "@/components/site/SectionHeading";

export function Portfolio({
  meta,
  items,
}: {
  meta: SectionPortfolioMeta;
  items: PortfolioItem[];
}) {
  const [activeTab, setActiveTab] = useState(meta.tabs[0] ?? "All");

  const filtered = useMemo(() => {
    if (activeTab === "All") return items;
    return items.filter((i) => i.tab === activeTab);
  }, [activeTab, items]);

  return (
    <section
      className="cn-section cn-portfolio"
      id="portfolio"
      aria-label="Portfolio"
    >
      <div className="cn-section-head-center" data-stagger>
        <div className="cn-section-eyebrow">{meta.eyebrow}</div>
        <SectionHeading heading={meta.title_heading} />
        {meta.lead && (
          <p className="cn-section-lead" style={{ margin: "1.5rem auto 0" }}>
            {meta.lead}
          </p>
        )}
      </div>

      <div className="cn-portfolio-tabs" data-anim="fade-up">
        {meta.tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`cn-portfolio-tab${activeTab === tab ? " active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="cn-portfolio-grid" data-stagger-cards>
        {filtered.map((p) => (
          <a key={p.id} href={p.link_href} className="cn-port-item">
            <div className="cn-port-bg">
              {p.image_url ? (
                <Image
                  src={p.image_url}
                  alt={p.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                  loading="lazy"
                />
              ) : null}
            </div>
            <span className="cn-port-num">{p.number_label}</span>
            <div className="cn-port-veil" />
            <div className="cn-port-meta">
              <small>{p.tag}</small>
              <h4>{p.title}</h4>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
