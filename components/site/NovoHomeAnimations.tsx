"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Loader intro + nav auto-hide for Novo home (no legacy hero title GSAP). */
export function NovoHomeAnimations() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: reduce)", () => {
      document.querySelector(".cn-loader")?.classList.add("is-done");
      return () => {};
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const loader = document.querySelector<HTMLElement>(".cn-loader");
      const loaderBarFill = document.querySelector<HTMLElement>(".cn-loader-bar-fill");
      const loaderMarkChars = gsap.utils.toArray<HTMLElement>(".cn-loader-mark span");

      if (loader && loaderBarFill && loaderMarkChars.length) {
        const intro = gsap.timeline({
          defaults: { ease: "power3.out" },
          onComplete: () => loader.classList.add("is-done"),
        });
        intro
          .fromTo(
            loaderMarkChars,
            { yPercent: 100, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.6, stagger: 0.04, ease: "expo.out" },
            0
          )
          .to(loaderBarFill, { scaleX: 1, duration: 0.95, ease: "power2.inOut" }, 0.25)
          .to(
            loaderMarkChars,
            { yPercent: -110, opacity: 0, duration: 0.5, stagger: 0.03, ease: "power3.in" },
            "+=0.1"
          )
          .to(loader, { yPercent: -100, duration: 0.9, ease: "power3.inOut" }, "<+0.05")
          .set(loader, { display: "none" });
      } else {
        loader?.classList.add("is-done");
      }

      const nav = document.querySelector<HTMLElement>(".cn-novo-nav");
      if (nav) {
        let lastScroll = 0;
        ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => {
            const y = self.scroll();
            if (y < 100) {
              nav.classList.remove("cn-novo-nav--hidden");
            } else if (y > lastScroll + 8) {
              nav.classList.add("cn-novo-nav--hidden");
            } else if (y < lastScroll - 8) {
              nav.classList.remove("cn-novo-nav--hidden");
            }
            lastScroll = y;
          },
        });
      }

      return () => {};
    });

    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }
  });

  return null;
}
