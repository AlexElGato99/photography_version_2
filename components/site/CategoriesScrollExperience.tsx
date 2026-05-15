"use client";

import { useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { Category, SectionMeta } from "@/lib/types/site";
import { categoryPublicHref } from "@/lib/site/category-helpers";
import { SectionHeading } from "@/components/site/SectionHeading";

gsap.registerPlugin(useGSAP);

/** Horizontal slide + short text crossfade */
const SLIDE_DURATION = 0.42;

function categoryDesc(c: Category): string {
  const lead = (c.page_lead ?? "").trim();
  if (lead) return lead;
  const raw = (c.page_body_html ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (raw.length > 240) return `${raw.slice(0, 237)}…`;
  return raw || "Explore this category.";
}

export function CategoriesScrollExperience({
  meta,
  categories,
}: {
  meta: SectionMeta;
  categories: Category[];
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const catsRef = useRef(categories);
  catsRef.current = categories;

  const depsKey = useMemo(
    () => categories.map((c) => `${c.id}:${c.slug}:${c.name}:${c.image_url}`).join("|"),
    [categories]
  );

  useGSAP(
    () => {
      const root = rootRef.current;
      const stageEl = stageRef.current;
      if (!root || !stageEl) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
        const list = catsRef.current;
        const n = list.length;
        if (n === 0) return () => {};

        const viewport = root.querySelector<HTMLElement>(".cn-cat-scroll-viewport");
        const track = root.querySelector<HTMLElement>(".cn-cat-scroll-track");
        const textAnim = root.querySelector<HTMLElement>(".cn-cat-scroll-text-anim");
        const catIndexEl = root.querySelector<HTMLElement>(".cn-cat-scroll-index");
        const catTotalEl = root.querySelector<HTMLElement>(".cn-cat-scroll-total");
        const catEyebrowEl = root.querySelector<HTMLElement>(".cn-cat-scroll-eyebrow");
        const catTitleEl = root.querySelector<HTMLElement>(".cn-cat-scroll-title");
        const catDescEl = root.querySelector<HTMLElement>(".cn-cat-scroll-desc");
        const catCta = root.querySelector<HTMLAnchorElement>(".cn-cat-scroll-cta");
        const catBars = gsap.utils.toArray<HTMLElement>(root.querySelectorAll(".cn-cat-scroll-bar"));

        if (
          !viewport ||
          !track ||
          !textAnim ||
          !catIndexEl ||
          !catTotalEl ||
          !catEyebrowEl ||
          !catTitleEl ||
          !catDescEl ||
          !catCta ||
          catBars.length !== n
        ) {
          return () => {};
        }

        const wPad = Math.max(2, String(n).length);
        let currentCat = 0;

        const slideWidth = () => viewport.clientWidth;

        const applyTexts = (idx: number) => {
          const data = list[idx];
          catIndexEl.textContent = String(idx + 1).padStart(wPad, "0");
          catTotalEl.textContent = String(n).padStart(wPad, "0");
          catEyebrowEl.textContent = (data.tag ?? "").toUpperCase();
          catTitleEl.textContent = data.name;
          catDescEl.textContent = categoryDesc(data);
          catCta.setAttribute("href", categoryPublicHref(data));
        };

        const setBars = (idx: number) => {
          catBars.forEach((b, i) => {
            b.classList.toggle("is-active", i === idx);
            b.setAttribute("aria-selected", String(i === idx));
          });
        };

        const goTo = (idx: number, animate: boolean) => {
          if (idx === currentCat || idx < 0 || idx >= n) return;
          currentCat = idx;
          const w = slideWidth();
          const xTarget = -idx * w;

          setBars(idx);

          if (!animate) {
            gsap.killTweensOf([track, textAnim]);
            gsap.set(track, { x: xTarget });
            applyTexts(idx);
            gsap.set(textAnim, { autoAlpha: 1, y: 0 });
            return;
          }

          gsap.killTweensOf([track, textAnim]);

          const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
          tl.to(
            textAnim,
            { autoAlpha: 0, y: 10, duration: Math.min(0.16, SLIDE_DURATION * 0.35) },
            0
          );
          tl.to(track, { x: xTarget, duration: SLIDE_DURATION }, 0);
          tl.call(() => applyTexts(idx));
          tl.fromTo(
            textAnim,
            { autoAlpha: 0, y: -12 },
            { autoAlpha: 1, y: 0, duration: Math.min(0.28, SLIDE_DURATION * 0.65) }
          );
        };

        gsap.set(track, { x: 0 });
        applyTexts(0);
        setBars(0);
        gsap.set(textAnim, { autoAlpha: 1, y: 0 });

        const onBarClick = (i: number) => () => {
          goTo(i, true);
        };
        catBars.forEach((bar, i) => {
          bar.addEventListener("click", onBarClick(i));
        });

        const onResize = () => {
          gsap.set(track, { x: -currentCat * slideWidth() });
        };
        window.addEventListener("resize", onResize);

        return () => {
          window.removeEventListener("resize", onResize);
          catBars.forEach((bar, i) => bar.removeEventListener("click", onBarClick(i)));
        };
      });

      return () => {
        mm.revert();
      };
    },
    { scope: rootRef, dependencies: [depsKey], revertOnUpdate: true }
  );

  const n = categories.length;
  const padW = Math.max(2, String(n).length);

  return (
    <div ref={rootRef} className="cn-categories-scroll-root">
      <div className="cn-section-head-center cn-categories-scroll-head" data-stagger>
        <div className="cn-section-eyebrow">{meta.eyebrow}</div>
        <SectionHeading heading={meta.title_heading} />
      </div>

      <div className="cn-categories-fallback" aria-label="Category links">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={categoryPublicHref(c)}
            className="cn-categories-fallback-card"
            prefetch={false}
          >
            <div className="cn-categories-fallback-img">
              {c.image_url ? (
                <Image
                  src={c.image_url}
                  alt={c.name}
                  fill
                  sizes="(max-width: 900px) 50vw, 33vw"
                  className="object-cover"
                />
              ) : null}
            </div>
            <div className="cn-categories-fallback-text">
              <small>{c.tag}</small>
              <h3>{c.name}</h3>
            </div>
          </Link>
        ))}
      </div>

      <div ref={stageRef} className="cn-categories-pin">
        <div className="cn-categories-stage">
          <div className="cn-cat-scroll-text">
            <div className="cn-cat-scroll-text-anim">
              <p className="cn-cat-scroll-meta">
                <span className="cn-cat-scroll-index">{String(1).padStart(padW, "0")}</span>
                <span className="cn-cat-scroll-div"> / </span>
                <span className="cn-cat-scroll-total">{String(n).padStart(padW, "0")}</span>
                <span className="cn-cat-scroll-dot"> · </span>
                <span className="cn-cat-scroll-eyebrow">
                  {(categories[0]?.tag ?? "").toUpperCase()}
                </span>
              </p>
              <h3 className="cn-cat-scroll-title">{categories[0]?.name}</h3>
              <p className="cn-cat-scroll-desc">
                {categories[0] ? categoryDesc(categories[0]) : ""}
              </p>
            </div>
            <div className="cn-cat-scroll-progress" role="group" aria-label="Choose category">
              {categories.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`cn-cat-scroll-bar${i === 0 ? " is-active" : ""}`}
                  aria-label={`Show category ${i + 1}`}
                  aria-selected={i === 0}
                />
              ))}
            </div>
            <p className="cn-cat-scroll-hint">Select a category with the bar above</p>
          </div>

          <div className="cn-cat-scroll-stage">
            <div className="cn-cat-scroll-viewport">
              <div className="cn-cat-scroll-track">
                {categories.map((c) => (
                  <div key={c.id} className="cn-cat-scroll-slide">
                    {c.image_url ? (
                      <Image
                        src={c.image_url}
                        alt={c.name}
                        fill
                        sizes="(max-width: 1100px) 90vw, (max-width: 1400px) 48vw, 640px"
                        className="object-cover"
                        draggable={false}
                      />
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
            <a href={categoryPublicHref(categories[0])} className="cn-cat-scroll-cta">
              View category
              <svg viewBox="0 0 24 24" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
