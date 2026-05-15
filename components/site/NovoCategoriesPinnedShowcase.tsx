"use client";

import Image from "next/image";
import { useMemo, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { Category } from "@/lib/types/site";

gsap.registerPlugin(useGSAP);

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

const SLIDE_DURATION = 0.42;
/** Time between automatic advances (desktop, motion OK). */
const AUTO_ADVANCE_MS = 5000;

function useCategoryPinnedKey(categories: Category[]) {
  return useMemo(
    () => categories.map((c) => `${c.id}:${c.slug}:${c.name}:${c.image_url}`).join("|"),
    [categories]
  );
}

export function NovoCategoriesPinnedShowcase({
  categories,
  categoryHref,
}: {
  categories: Category[];
  categoryHref: (c: Category) => string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const catsRef = useRef(categories);
  catsRef.current = categories;

  const depsKey = useCategoryPinnedKey(categories);

  useGSAP(
    () => {
      const root = rootRef.current;
      const viewport = viewportRef.current;
      const track = trackRef.current;
      if (!root || !viewport || !track) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
        const list = catsRef.current;
        const n = list.length;
        if (n === 0) return () => {};

        const textAnim = root.querySelector<HTMLElement>(".cn-novo-cat-showcase-text-anim");
        const catIndexEl = root.querySelector<HTMLElement>(".cn-novo-cat-showcase-index");
        const catTotalEl = root.querySelector<HTMLElement>(".cn-novo-cat-showcase-total");
        const catEyebrowEl = root.querySelector<HTMLElement>(".cn-novo-cat-showcase-eyebrow");
        const catTitleEl = root.querySelector<HTMLElement>(".cn-novo-cat-showcase-title");
        const catDescEl = root.querySelector<HTMLElement>(".cn-novo-cat-showcase-desc");
        const catCta = root.querySelector<HTMLAnchorElement>(".cn-novo-cat-showcase-cta");
        const catBars = gsap.utils.toArray<HTMLElement>(
          root.querySelectorAll(".cn-novo-cat-showcase-bar")
        );

        if (
          !textAnim ||
          !catIndexEl ||
          !catTotalEl ||
          !catEyebrowEl ||
          !catTitleEl ||
          !catDescEl ||
          !catCta
        ) {
          return () => {};
        }

        if (n > 1 && catBars.length !== n) {
          return () => {};
        }

        const wPad = Math.max(2, String(n).length);
        let currentCat = 0;

        const slideWidth = () => Math.max(1, viewport.clientWidth);

        const applyTexts = (idx: number) => {
          const data = list[idx];
          catIndexEl.textContent = String(idx + 1).padStart(wPad, "0");
          catTotalEl.textContent = String(n).padStart(wPad, "0");
          catEyebrowEl.textContent = (data.tag ?? "").toUpperCase();
          catTitleEl.textContent = data.name;
          catDescEl.textContent = categoryDesc(data);
          catCta.setAttribute("href", categoryHref(data));
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

        if (n <= 1) {
          return () => {};
        }

        let autoTimer: ReturnType<typeof setInterval> | null = null;

        const tickAutoplay = () => {
          const next = (currentCat + 1) % n;
          goTo(next, true);
        };

        const startAutoplay = () => {
          if (autoTimer !== null) clearInterval(autoTimer);
          autoTimer = setInterval(tickAutoplay, AUTO_ADVANCE_MS);
        };

        const stopAutoplay = () => {
          if (autoTimer !== null) {
            clearInterval(autoTimer);
            autoTimer = null;
          }
        };

        const onBarClick = (i: number) => () => {
          goTo(i, true);
          startAutoplay();
        };
        catBars.forEach((bar, i) => {
          bar.addEventListener("click", onBarClick(i));
        });

        const onVisibility = () => {
          if (document.hidden) stopAutoplay();
          else startAutoplay();
        };
        document.addEventListener("visibilitychange", onVisibility);

        const onResize = () => {
          gsap.set(track, { x: -currentCat * slideWidth() });
        };
        window.addEventListener("resize", onResize);

        startAutoplay();

        return () => {
          stopAutoplay();
          document.removeEventListener("visibilitychange", onVisibility);
          window.removeEventListener("resize", onResize);
          catBars.forEach((bar, i) => bar.removeEventListener("click", onBarClick(i)));
        };
      });

      return () => mm.revert();
    },
    {
      scope: rootRef,
      dependencies: [depsKey],
      revertOnUpdate: true,
    }
  );

  const n = categories.length;
  const padW = Math.max(2, String(n).length);
  const first = categories[0];

  return (
    <div ref={rootRef} className="cn-novo-cat-showcase-root">
      <div className="cn-novo-cat-showcase-fallback" aria-label="Categories">
        {categories.map((c) => (
          <a key={c.id} href={categoryHref(c)} className="cn-novo-cat-showcase-fallback-card">
            <div className="cn-novo-cat-showcase-fallback-img">
              {c.image_url ? (
                <Image
                  src={c.image_url}
                  alt={c.name}
                  fill
                  sizes="(max-width: 900px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : null}
            </div>
            <div className="cn-novo-cat-showcase-fallback-text">
              {c.tag?.trim() ? <small>{c.tag.trim()}</small> : null}
              <h3>{c.name}</h3>
            </div>
          </a>
        ))}
      </div>

      <div className="cn-novo-cat-showcase-pin">
        <div className="cn-novo-cat-showcase-stage">
          <div className="cn-novo-cat-showcase-copy">
            <div className="cn-novo-cat-showcase-text-anim">
              <p className="cn-novo-cat-showcase-meta">
                <span className="cn-novo-cat-showcase-index">{String(1).padStart(padW, "0")}</span>
                <span className="cn-novo-cat-showcase-div"> / </span>
                <span className="cn-novo-cat-showcase-total">{String(n).padStart(padW, "0")}</span>
                <span className="cn-novo-cat-showcase-dot"> · </span>
                <span className="cn-novo-cat-showcase-eyebrow">
                  {(first?.tag ?? "").toUpperCase()}
                </span>
              </p>
              <h3 className="cn-novo-cat-showcase-title">{first?.name}</h3>
              <p className="cn-novo-cat-showcase-desc">{first ? categoryDesc(first) : ""}</p>
            </div>
            {n > 1 ? (
              <div className="cn-novo-cat-showcase-progress" role="tablist" aria-label="Category slides">
                {categories.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    role="tab"
                    className={`cn-novo-cat-showcase-bar${i === 0 ? " is-active" : ""}`}
                    aria-label={`Go to category ${i + 1}`}
                    aria-selected={i === 0}
                  />
                ))}
              </div>
            ) : null}
            <p className="cn-novo-cat-showcase-hint">
              Cycles every 5 seconds · use the indicators to jump
            </p>
          </div>

          <div className="cn-novo-cat-showcase-visual">
            <div ref={viewportRef} className="cn-novo-cat-showcase-viewport">
              <div ref={trackRef} className="cn-novo-cat-showcase-track">
                {categories.map((c) => (
                  <div key={c.id} className="cn-novo-cat-showcase-slide">
                    {c.image_url ? (
                      <Image
                        src={c.image_url}
                        alt={c.name}
                        fill
                        sizes="(max-width: 1100px) 90vw, 560px"
                        className="object-cover"
                        draggable={false}
                      />
                    ) : (
                      <span className="cn-novo-cat-showcase-placeholder" aria-hidden />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <a href={first ? categoryHref(first) : "#categories"} className="cn-novo-btn-outline cn-novo-cat-showcase-cta">
              View category
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
