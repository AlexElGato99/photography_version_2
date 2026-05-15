"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Nav auto-hide on scroll for Novo home. */
export function NovoHomeAnimations() {
  useGSAP(() => {
    const nav = document.querySelector<HTMLElement>(".cn-novo-nav");
    if (!nav) return;

    let lastScroll = 0;
    const st = ScrollTrigger.create({
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

    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }

    return () => {
      st.kill();
    };
  });

  return null;
}
