"use client";

import { useState } from "react";
import type { Faq, SectionMeta } from "@/lib/types/site";
import { SectionHeading } from "@/components/site/SectionHeading";

export function FaqSection({
  meta,
  items,
}: {
  meta: SectionMeta;
  items: Faq[];
}) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);

  return (
    <section className="cn-section cn-faq" aria-label="FAQ">
      <div className="cn-section-head-center" data-stagger>
        <div className="cn-section-eyebrow">{meta.eyebrow}</div>
        <SectionHeading heading={meta.title_heading} />
      </div>

      <div className="cn-faq-wrap" data-stagger-cards>
        {items.map((q) => (
          <div
            key={q.id}
            className={`cn-faq-item${open === q.id ? " open" : ""}`}
            onClick={() => setOpen(open === q.id ? null : q.id)}
          >
            <div className="cn-faq-q">
              <h4>{q.question}</h4>
              <div className="cn-faq-toggle">
                <svg viewBox="0 0 24 24">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
            </div>
            <div className="cn-faq-a">
              <p>{q.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
