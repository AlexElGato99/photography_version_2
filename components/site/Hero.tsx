"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import type { HeroSlide, SectionHero } from "@/lib/types/site";

export function Hero({
  hero,
  slides,
}: {
  hero: SectionHero;
  slides: HeroSlide[];
}) {
  const [active, setActive] = useState(0);
  const total = slides.length || 1;

  const go = useCallback(
    (delta: number) => setActive((i) => (i + delta + total) % total),
    [total]
  );

  useEffect(() => {
    if (total <= 1 || !hero.autoplay_ms) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % total);
    }, hero.autoplay_ms);
    return () => window.clearInterval(id);
  }, [hero.autoplay_ms, total]);

  const current = slides[active] ?? slides[0];

  return (
    <section className="cn-hero" id="hero" aria-label="Hero">
      <div className="cn-carousel">
        {slides.map((s, i) => (
          <div key={s.id ?? i} className={`cn-slide${i === active ? " active" : ""}`}>
            <div className="cn-slide-img">
                <Image
                  src={s.image_url}
                  alt={s.alt || s.label}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority={i === 0}
                  loading={i === 0 ? "eager" : "lazy"}
                />
              </div>
          </div>
        ))}
      </div>

      {current && <div className="cn-slide-label">{current.label}</div>}

      <div className="cn-hero-content">
        <div className="cn-hero-eyebrow" data-hero-hide>
          <span className="cn-dot" />
          <span>{hero.eyebrow}</span>
          <span className="cn-line" />
        </div>

        <h1 className="cn-hero-title">
          <span data-hero-title-line>
            <span dangerouslySetInnerHTML={{ __html: hero.line_1 }} />
          </span>
          <span data-hero-title-line>
            <span dangerouslySetInnerHTML={{ __html: hero.line_2 }} />
          </span>
          <span data-hero-title-line>
            <span dangerouslySetInnerHTML={{ __html: hero.line_3 }} />
          </span>
        </h1>

        <div className="cn-hero-bottom">
          <div className="cn-hero-meta" data-hero-hide>
            <p>{hero.meta_text}</p>
          </div>
          <div className="cn-hero-actions" data-hero-hide>
            <a href={hero.cta_primary_href} className="cn-btn-light">
              {hero.cta_primary_label}
              <svg className="cn-icon-sm" viewBox="0 0 24 24">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
            <a href={hero.cta_secondary_href} className="cn-btn-line">
              {hero.cta_secondary_label}
              <svg className="cn-icon-sm" viewBox="0 0 24 24">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="cn-indicators">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`cn-indicator${i === active ? " active" : ""}`}
            onClick={() => setActive(i)}
            aria-label={`Go to slide ${i + 1}`}
          >
            <span className="cn-indicator-fill" />
          </button>
        ))}
      </div>

      <div className="cn-carousel-controls">
        <button
          type="button"
          className="cn-ctrl-btn"
          onClick={() => go(-1)}
          aria-label="Previous slide"
        >
          <svg viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="cn-carousel-counter">
          <b>{String(active + 1).padStart(2, "0")}</b> /{" "}
          <span>{String(total).padStart(2, "0")}</span>
        </div>
        <button
          type="button"
          className="cn-ctrl-btn"
          onClick={() => go(1)}
          aria-label="Next slide"
        >
          <svg viewBox="0 0 24 24">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </section>
  );
}
