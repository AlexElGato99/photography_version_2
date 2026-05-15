"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { CategoryGalleryCarousel } from "@/components/site/CategoryGalleryCarousel";
import { normalizeTitleHeading, renderTitleHeadingNodes } from "@/lib/site/title-heading";
import type { PortfolioItem } from "@/lib/types/site";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function ProjectPageView({ project }: { project: PortfolioItem }) {
  const root = useRef<HTMLDivElement>(null);
  const gallery = (project.gallery_images ?? []).filter((g) => g.image_url?.trim());

  useGSAP(
    () => {
      if (!root.current) return;

      const sel = gsap.utils.selector(root);
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!reduceMotion) {
        gsap.from(sel(".cn-cp-hero-inner"), {
          opacity: 0,
          y: 48,
          duration: 1,
          ease: "power3.out",
        });
      }

      const galleryHead = sel(".cn-cp-gallery-head")[0];

      if (!reduceMotion && galleryHead) {
        gsap.from(galleryHead, {
          autoAlpha: 0,
          y: 32,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: galleryHead,
            start: "top 92%",
            once: true,
          },
        });
      }
    },
    { scope: root, dependencies: [project.id], revertOnUpdate: true }
  );

  const heading = normalizeTitleHeading(project.page_heading);
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
          {project.image_url ? (
            <Image
              src={project.image_url}
              alt={project.title}
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
            <Link href="/#portfolio">Portfolio</Link>
            <span className="cn-cp-bc-sep" aria-hidden>
              /
            </span>
            <span>{project.title}</span>
          </nav>
          {project.page_eyebrow?.trim() ? (
            <div className="cn-section-eyebrow cn-cp-eyebrow">{project.page_eyebrow.trim()}</div>
          ) : null}
          <h1 className="cn-cp-title">
            {hasCustomTitle ? (
              renderTitleHeadingNodes(heading)
            ) : (
              <span className="cn-cp-title-fallback">{project.title}</span>
            )}
          </h1>
          {project.page_lead?.trim() ? <p className="cn-cp-lead">{project.page_lead.trim()}</p> : null}
          <div className="cn-cp-meta">
            <span className="cn-cp-badge">{project.tag}</span>
          </div>
        </div>
      </header>

      {project.page_body_html?.trim() ? (
        <section className="cn-section cn-cp-bodywrap" aria-label="Project details">
          <div
            className="cn-cp-body cn-cp-reveal"
            dangerouslySetInnerHTML={{ __html: project.page_body_html }}
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
          <CategoryGalleryCarousel items={gallery} categoryName={project.title} />
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
