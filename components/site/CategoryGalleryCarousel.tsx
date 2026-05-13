"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

export type CategoryGalleryCarouselItem = {
  image_url: string;
  alt?: string;
  caption?: string | null;
};

function slideKey(item: CategoryGalleryCarouselItem, index: number) {
  return `${item.image_url}-${index}`;
}

/** Default layout ratio before `onLoadingComplete` (replaced by intrinsic size). */
const POSTER_PLACEHOLDER_W = 1600;
const POSTER_PLACEHOLDER_H = 1067;

/** Movie-style card: poster + info; poster height/width follow image aspect (capped in CSS). */
function CategoryMovieStyleCard({
  item,
  categoryName,
  className,
  sizes,
}: {
  item: CategoryGalleryCarouselItem;
  categoryName: string;
  className?: string;
  sizes: string;
}) {
  const title =
    (item.caption && item.caption.trim()) ||
    (item.alt && item.alt.trim()) ||
    categoryName;

  const [intrinsic, setIntrinsic] = useState<{ w: number; h: number } | null>(null);
  const w = intrinsic?.w ?? POSTER_PLACEHOLDER_W;
  const h = intrinsic?.h ?? POSTER_PLACEHOLDER_H;

  return (
    <figure className={`cn-cp-mov-card${className ? ` ${className}` : ""}`}>
      <div className="cn-cp-mov-poster">
        <Image
          src={item.image_url}
          alt={(item.alt && item.alt.trim()) || categoryName}
          width={w}
          height={h}
          sizes={sizes}
          className="cn-cp-mov-poster-img"
          draggable={false}
          onLoadingComplete={(img) => {
            if (img.naturalWidth > 0 && img.naturalHeight > 0) {
              setIntrinsic({ w: img.naturalWidth, h: img.naturalHeight });
            }
          }}
        />
      </div>
      <figcaption className="cn-cp-mov-info">
        <div className="cn-cp-mov-title" title={title}>
          {title}
        </div>
        <div className="cn-cp-mov-meta">
          <span className="cn-cp-mov-type">{categoryName}</span>
        </div>
      </figcaption>
    </figure>
  );
}

function slideDiff(i: number, cur: number, total: number): number {
  let d = ((i - cur) % total + total) % total;
  if (d > total / 2) d -= total;
  return d;
}

/** Same transform / opacity logic as Laravel `show(idx)` on `index.blade.php` Movie Section. */
function slideMotion(
  i: number,
  cur: number,
  total: number
): { active: boolean; style: CSSProperties } {
  const diff = slideDiff(i, cur, total);
  const base = "translate(-50%, -50%)";
  if (diff === 0) {
    return {
      active: true,
      style: { transform: `${base} translateX(0) scale(1)`, opacity: 1 },
    };
  }
  if (diff === -1 || diff === total - 1) {
    return {
      active: false,
      style: { transform: `${base} translateX(-75%) scale(0.85)`, opacity: 0.45 },
    };
  }
  if (diff === 1 || diff === -(total - 1)) {
    return {
      active: false,
      style: { transform: `${base} translateX(75%) scale(0.85)`, opacity: 0.45 },
    };
  }
  return {
    active: false,
    style: { transform: `${base} translateX(0) scale(0.7)`, opacity: 0 },
  };
}

const ARR_PREV = (
  <svg aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
  </svg>
);

const ARR_NEXT = (
  <svg aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
  </svg>
);

/** Interval between automatic slides (ms). */
const AUTO_ADVANCE_MS = 900;
/** Must stay in sync with `.cn-cp-mov-slide` transition duration in `app/site.css` (~0.23s). */
const STEP_DEBOUNCE_MS = 230;

/**
 * Movie Section–style slider: stacked cards, arrows, auto-advance (runs while hovering).
 * `prefers-reduced-motion` disables auto-advance only.
 */
export function CategoryGalleryCarousel({
  items,
  categoryName,
}: {
  items: CategoryGalleryCarouselItem[];
  categoryName: string;
}) {
  const n = items.length;
  const [cur, setCur] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const busyRef = useRef(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackMinH, setTrackMinH] = useState(260);

  const gallerySig = items.map((g) => g.image_url).join("|");

  useLayoutEffect(() => {
    if (n < 2) return;
    const track = trackRef.current;
    if (!track) return;
    const measure = () => {
      const list = track.querySelectorAll(".cn-cp-mov-slide .cn-cp-mov-card");
      let maxH = 0;
      list.forEach((node) => {
        maxH = Math.max(maxH, (node as HTMLElement).offsetHeight);
      });
      if (maxH > 0) setTrackMinH(maxH + 56);
    };
    measure();
    const ro = new ResizeObserver(measure);
    track.querySelectorAll(".cn-cp-mov-slide .cn-cp-mov-card").forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, [n, cur, gallerySig]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const fn = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  const step = useCallback(
    (delta: number) => {
      if (n < 2 || busyRef.current) return;
      busyRef.current = true;
      setCur((c) => ((c + delta) % n + n) % n);
      window.setTimeout(() => {
        busyRef.current = false;
      }, STEP_DEBOUNCE_MS);
    },
    [n]
  );

  useEffect(() => {
    if (n < 2 || reduceMotion) return;
    const id = window.setInterval(() => {
      if (busyRef.current) return;
      busyRef.current = true;
      setCur((c) => ((c + 1) % n + n) % n);
      window.setTimeout(() => {
        busyRef.current = false;
      }, STEP_DEBOUNCE_MS);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(id);
  }, [n, reduceMotion]);

  if (n === 0) return null;

  if (n === 1 && items[0]) {
    const g = items[0];
    return (
      <div className="cn-cp-mov-gallery">
        <p className="cn-cp-mov-sr">Image gallery, one photograph.</p>
        <div className="cn-cp-mov-showcase cn-cp-mov-showcase--solo">
          <CategoryMovieStyleCard
            item={g}
            categoryName={categoryName}
            className="cn-cp-mov-card--solo"
            sizes="(max-width: 768px) 92vw, 400px"
          />
        </div>
      </div>
    );
  }

  const srSummary = reduceMotion
    ? `Image gallery of ${n} photographs. Use arrow buttons for previous and next.`
    : `Image gallery of ${n} photographs. Slides advance automatically. Use arrow buttons for previous and next.`;

  return (
    <div className="cn-cp-mov-gallery">
      <p className="cn-cp-mov-sr">{srSummary}</p>
      <div className="cn-cp-mov-showcase">
        <div className="cn-cp-mov-slider-wrap">
          <button type="button" className="cn-cp-mov-arr cn-cp-mov-arr-l" aria-label="Previous" onClick={() => step(-1)}>
            {ARR_PREV}
          </button>
          <button type="button" className="cn-cp-mov-arr cn-cp-mov-arr-r" aria-label="Next" onClick={() => step(1)}>
            {ARR_NEXT}
          </button>
          <div
            ref={trackRef}
            className="cn-cp-mov-slider-track"
            style={{ minHeight: trackMinH }}
          >
            {items.map((g, i) => {
              const { active, style } = slideMotion(i, cur, n);
              return (
                <div
                  key={slideKey(g, i)}
                  className={`cn-cp-mov-slide${active ? " cn-cp-mov-slide--active" : ""}`}
                  style={style}
                  aria-hidden={!active}
                >
                  <CategoryMovieStyleCard
                    item={g}
                    categoryName={categoryName}
                    sizes="(max-width: 640px) 56vw, 380px"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
