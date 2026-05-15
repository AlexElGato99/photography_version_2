"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { FooterGalleryImage } from "@/lib/types/site";

const SLIDER_COUNT = 4;
const VISIBLE_COUNT = 2;
const THUMB_PX = 76;
const GAP_PX = 6;
const STEP_PX = THUMB_PX + GAP_PX;
const VIEWPORT_H = VISIBLE_COUNT * THUMB_PX + GAP_PX;
const STEP_MS = 2400;

type SliderDirection = "up" | "down";

function splitIntoColumns(images: FooterGalleryImage[]): FooterGalleryImage[][] {
  const cols: FooterGalleryImage[][] = Array.from({ length: SLIDER_COUNT }, () => []);
  images.forEach((img, i) => {
    cols[i % SLIDER_COUNT]!.push(img);
  });
  return cols;
}

function buildTrackItems(images: FooterGalleryImage[]): FooterGalleryImage[] {
  if (images.length === 0) return [];
  if (images.length === 1) {
    return [images[0]!, images[0]!, images[0]!];
  }
  return [...images, ...images.slice(0, VISIBLE_COUNT)];
}

function FooterGalleryColumn({
  images,
  direction,
  index,
}: {
  images: FooterGalleryImage[];
  direction: SliderDirection;
  index: number;
}) {
  const slideCount = images.length;
  const trackItems = useMemo(() => buildTrackItems(images), [images]);
  const [step, setStep] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (slideCount <= 1 || reduceMotion) return;

    const delayMs = index * 550;
    let intervalId: ReturnType<typeof setInterval> | undefined;

    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        setStep((prev) => {
          if (direction === "up") {
            return (prev + 1) % slideCount;
          }
          return (prev - 1 + slideCount) % slideCount;
        });
      }, STEP_MS);
    }, delayMs);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [slideCount, direction, index, reduceMotion]);

  if (slideCount === 0) return null;

  const translateY = reduceMotion ? 0 : -step * STEP_PX;

  return (
    <div
      className={`cn-novo-footer-slider cn-novo-footer-slider--${direction}`}
      style={{ width: THUMB_PX, height: VIEWPORT_H }}
    >
      <div
        className="cn-novo-footer-slider-track"
        style={{ transform: `translate3d(0, ${translateY}px, 0)` }}
      >
        {trackItems.map((p, i) => (
          <a
            key={`${p.id}-${i}`}
            href={p.link_href || "#"}
            className="cn-novo-footer-slider-photo"
            style={{
              width: THUMB_PX,
              height: THUMB_PX,
              marginBottom: i < trackItems.length - 1 ? GAP_PX : 0,
            }}
            tabIndex={i < slideCount ? 0 : -1}
            aria-hidden={i >= slideCount}
          >
            <Image
              src={p.image_url}
              alt=""
              width={THUMB_PX}
              height={THUMB_PX}
              className="h-full w-full object-cover"
            />
          </a>
        ))}
      </div>
    </div>
  );
}

export function FooterGallerySliders({
  images,
  label,
}: {
  images: FooterGalleryImage[];
  label: string;
}) {
  const columns = useMemo(() => splitIntoColumns(images), [images]);
  const directions: SliderDirection[] = ["up", "down", "down", "down"];
  const hasAny = columns.some((col) => col.length > 0);

  if (!hasAny) {
    return <p className="cn-novo-footer-empty">Add images in Dashboard → Footer → Gallery.</p>;
  }

  return (
    <div className="cn-novo-footer-gallery-sliders" aria-label={label}>
      {columns.map((col, i) => (
        <FooterGalleryColumn
          key={i}
          images={col}
          direction={directions[i] ?? "down"}
          index={i}
        />
      ))}
    </div>
  );
}
