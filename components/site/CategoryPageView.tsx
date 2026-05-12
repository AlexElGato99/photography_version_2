"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import type { Category, PortfolioItem } from "@/lib/types/site";
import { normalizeTitleHeading, renderTitleHeadingNodes } from "@/lib/site/title-heading";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function CategoryPageView({
  category,
  relatedPortfolio,
}: {
  category: Category;
  relatedPortfolio: PortfolioItem[];
}) {
  const root = useRef<HTMLDivElement>(null);
  const gallery = (category.gallery_images ?? []).filter((g) => g.image_url?.trim());

  useGSAP(
    () => {
      if (!root.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const sel = gsap.utils.selector(root);

      gsap.from(sel(".cn-cp-hero-inner"), {
        opacity: 0,
        y: 48,
        duration: 1,
        ease: "power3.out",
      });

      sel(".cn-cp-gallery-item").forEach((el, i) => {
        gsap.from(el, {
          opacity: 0,
          y: 44,
          duration: 0.72,
          ease: "power2.out",
          delay: i * 0.04,
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            once: true,
          },
        });
      });

      sel(".cn-cp-related-card").forEach((el, i) => {
        gsap.from(el, {
          opacity: 0,
          y: 32,
          duration: 0.58,
          ease: "power2.out",
          delay: i * 0.06,
          scrollTrigger: {
            trigger: el,
            start: "top 92%",
            once: true,
          },
        });
      });
    },
    { scope: root, dependencies: [category.id], revertOnUpdate: true }
  );

  const heading = normalizeTitleHeading(category.page_heading);
  const hasCustomTitle =
    heading.line1 ||
    heading.mid ||
    heading.em ||
    heading.tail ||
    heading.line2 ||
    heading.breakAfterLine1;

  return (
    <article ref={root} className="cn-category-page">
      <header className="cn-cp-hero">
        <div className="cn-cp-hero-media">
          {category.image_url ? (
            <Image
              src={category.image_url}
              alt={category.name}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          ) : null}
          <div className="cn-cp-hero-scrim" aria-hidden />
        </div>
        <div className="cn-cp-hero-inner">
          <nav className="cn-cp-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="cn-cp-bc-sep" aria-hidden>
              /
            </span>
            <Link href="/#categories">Categories</Link>
            <span className="cn-cp-bc-sep" aria-hidden>
              /
            </span>
            <span>{category.name}</span>
          </nav>
          {category.page_eyebrow ? (
            <div className="cn-section-eyebrow cn-cp-eyebrow">{category.page_eyebrow}</div>
          ) : null}
          <h1 className="cn-cp-title">
            {hasCustomTitle ? (
              renderTitleHeadingNodes(heading)
            ) : (
              <span className="cn-cp-title-fallback">{category.name}</span>
            )}
          </h1>
          {category.page_lead ? <p className="cn-cp-lead">{category.page_lead}</p> : null}
          <div className="cn-cp-meta">
            <span className="cn-cp-badge">{category.tag}</span>
          </div>
        </div>
      </header>

      {category.page_body_html?.trim() ? (
        <section className="cn-section cn-cp-bodywrap" aria-label="Introduction">
          <div
            className="cn-cp-body cn-cp-reveal"
            dangerouslySetInnerHTML={{ __html: category.page_body_html }}
          />
        </section>
      ) : null}

      {gallery.length > 0 ? (
        <section className="cn-section cn-cp-gallery-section" aria-label="Gallery">
          <div className="cn-cp-gallery-head">
            <div className="cn-section-eyebrow">Gallery</div>
            <h2 className="cn-section-title">
              Selected <em>frames</em>
            </h2>
          </div>
          <div className="cn-cp-gallery">
            {gallery.map((g, i) => (
              <figure
                key={`${g.image_url}-${i}`}
                className={`cn-cp-gallery-item cn-cp-gal-${(i % 5) + 1}`}
              >
                <div className="cn-cp-gallery-img">
                  {g.image_url ? (
                    <Image
                      src={g.image_url}
                      alt={g.alt || category.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 38vw"
                      className="object-cover"
                    />
                  ) : null}
                  {g.caption ? (
                    <figcaption className="cn-cp-gallery-cap">{g.caption}</figcaption>
                  ) : null}
                </div>
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      {relatedPortfolio.length > 0 ? (
        <section className="cn-section cn-cp-related" aria-label="Related work">
          <div className="cn-cp-gallery-head">
            <div className="cn-section-eyebrow">Portfolio</div>
            <h2 className="cn-section-title">
              Related <em>projects</em>
            </h2>
          </div>
          <div className="cn-cp-related-grid">
            {relatedPortfolio.map((p) => (
              <a key={p.id} href={p.link_href} className="cn-cp-related-card">
                <div className="cn-cp-related-img">
                  {p.image_url ? (
                    <Image
                      src={p.image_url}
                      alt={p.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <div className="cn-cp-related-meta">
                  <small>{p.tag}</small>
                  <h3>{p.title}</h3>
                </div>
              </a>
            ))}
          </div>
        </section>
      ) : null}

      <section className="cn-cp-cta" aria-label="Contact">
        <p className="cn-cp-cta-lead">Ready to collaborate?</p>
        <Link href="/#contact" className="cn-btn-light">
          Start a project
          <svg className="cn-icon-sm" viewBox="0 0 24 24">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </section>
    </article>
  );
}
