"use client";

import Image from "next/image";
import { useMemo, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { PortfolioItem } from "@/lib/types/site";
import { portfolioPublicHref } from "@/lib/site/portfolio-helpers";

gsap.registerPlugin(useGSAP);

function portfolioDesc(item: PortfolioItem): string {
  const lead = (item.page_lead ?? "").trim();
  if (lead) {
    if (lead.length > 240) return `${lead.slice(0, 237)}…`;
    return lead;
  }
  const tab = (item.tab ?? "").trim();
  if (tab && tab !== "All") return tab;
  return "Selected work from the studio.";
}

const SLIDE_DURATION = 0.42;
const AUTO_ADVANCE_MS = 5000;

function usePortfolioPinnedKey(items: PortfolioItem[]) {
  return useMemo(
    () =>
      items
        .map(
          (p) =>
            `${p.id}:${p.title}:${p.image_url}:${p.link_href}:${p.slug}:${p.page_lead}:${p.tag}`
        )
        .join("|"),
    [items]
  );
}

export function NovoPortfolioPinnedShowcase({ items }: { items: PortfolioItem[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef(items);
  itemsRef.current = items;

  const depsKey = usePortfolioPinnedKey(items);

  useGSAP(
    () => {
      const root = rootRef.current;
      const viewport = viewportRef.current;
      const track = trackRef.current;
      if (!root || !viewport || !track) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
        const list = itemsRef.current;
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
          catTitleEl.textContent = data.title;
          catDescEl.textContent = portfolioDesc(data);
          catCta.setAttribute("href", portfolioPublicHref(data));
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

  const n = items.length;
  const padW = Math.max(2, String(n).length);
  const first = items[0];

  return (
    <div
      ref={rootRef}
      className="cn-novo-cat-showcase-root cn-novo-cat-showcase-root--portfolio"
    >
      <div className="cn-novo-cat-showcase-fallback" aria-label="Portfolio">
        {items.map((p) => (
          <a key={p.id} href={portfolioPublicHref(p)} className="cn-novo-cat-showcase-fallback-card">
            <div className="cn-novo-cat-showcase-fallback-img">
              {p.image_url ? (
                <Image
                  src={p.image_url}
                  alt={p.title}
                  fill
                  sizes="(max-width: 900px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : null}
            </div>
            <div className="cn-novo-cat-showcase-fallback-text">
              {p.tag?.trim() ? <small>{p.tag.trim()}</small> : null}
              <h3>{p.title}</h3>
            </div>
          </a>
        ))}
      </div>

      <div className="cn-novo-cat-showcase-pin">
        <div className="cn-novo-cat-showcase-stage">
          <div className="cn-novo-cat-showcase-visual">
            <div ref={viewportRef} className="cn-novo-cat-showcase-viewport">
              <div ref={trackRef} className="cn-novo-cat-showcase-track">
                {items.map((p) => (
                  <div key={p.id} className="cn-novo-cat-showcase-slide">
                    {p.image_url ? (
                      <Image
                        src={p.image_url}
                        alt={p.title}
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
            <a
              href={first ? portfolioPublicHref(first) : "#portfolio"}
              className="cn-novo-btn-outline cn-novo-cat-showcase-cta"
            >
              View project
            </a>
          </div>

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
              <h3 className="cn-novo-cat-showcase-title">{first?.title}</h3>
              <p className="cn-novo-cat-showcase-desc">{first ? portfolioDesc(first) : ""}</p>
            </div>
            {n > 1 ? (
              <div className="cn-novo-cat-showcase-progress" role="tablist" aria-label="Portfolio slides">
                {items.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    role="tab"
                    className={`cn-novo-cat-showcase-bar${i === 0 ? " is-active" : ""}`}
                    aria-label={`Go to project ${i + 1}`}
                    aria-selected={i === 0}
                  />
                ))}
              </div>
            ) : null}
            <p className="cn-novo-cat-showcase-hint">
              Cycles every 5 seconds · use the indicators to jump
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
