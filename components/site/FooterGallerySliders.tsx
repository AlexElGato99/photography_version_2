"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { FooterGalleryImage } from "@/lib/types/site";

const GRID_SLOTS = 6;
const TICK_MS = 2000;

function buildInitialSlots(pool: FooterGalleryImage[]): FooterGalleryImage[] {
  return Array.from({ length: GRID_SLOTS }, (_, i) => pool[i % pool.length]!);
}

export function FooterGallerySliders({
  images,
  label,
}: {
  images: FooterGalleryImage[];
  label: string;
}) {
  const pool = useMemo(
    () => images.filter((p) => Boolean(p.image_url?.trim())),
    [images]
  );

  const poolSig = useMemo(
    () => pool.map((p) => `${p.id}:${p.image_url}`).join("|"),
    [pool]
  );

  const poolRef = useRef(pool);
  poolRef.current = pool;

  const [slots, setSlots] = useState<FooterGalleryImage[]>(() =>
    pool.length > 0 ? buildInitialSlots(pool) : []
  );

  const slotIndexRef = useRef(0);
  const poolIndexRef = useRef(GRID_SLOTS);

  useEffect(() => {
    if (pool.length === 0) {
      setSlots([]);
      return;
    }

    setSlots(buildInitialSlots(pool));
    slotIndexRef.current = 0;
    poolIndexRef.current = GRID_SLOTS;

    const advance = () => {
      const list = poolRef.current;
      if (list.length === 0) return;

      const slot = slotIndexRef.current;
      let ptr = poolIndexRef.current;

      setSlots((prev) => {
        const row = prev.length === GRID_SLOTS ? [...prev] : buildInitialSlots(list);
        const current = row[slot];
        let next = list[ptr % list.length]!;

        if (list.length > 1) {
          let attempts = 0;
          while (
            attempts < list.length &&
            current &&
            next.id === current.id &&
            next.image_url === current.image_url
          ) {
            ptr += 1;
            next = list[ptr % list.length]!;
            attempts += 1;
          }
        }

        poolIndexRef.current = ptr + 1;
        row[slot] = { ...next };
        return row;
      });

      slotIndexRef.current = (slot + 1) % GRID_SLOTS;
    };

    advance();
    const timer = window.setInterval(advance, TICK_MS);
    return () => window.clearInterval(timer);
  }, [poolSig, pool.length]);

  if (pool.length === 0) {
    return <p className="cn-novo-footer-empty">Add images in Dashboard → Footer → Gallery.</p>;
  }

  const display = slots.length === GRID_SLOTS ? slots : buildInitialSlots(pool);

  return (
    <div className="cn-novo-footer-gallery" aria-label={label}>
      <div className="cn-novo-footer-gallery-grid">
        {display.map((item, index) => (
          <a
            key={`${index}-${item.image_url}`}
            href={item.link_href || "#"}
            className="cn-novo-footer-gallery-cell"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.image_url} alt="" className="cn-novo-footer-gallery-img" loading="lazy" />
          </a>
        ))}
      </div>
    </div>
  );
}
