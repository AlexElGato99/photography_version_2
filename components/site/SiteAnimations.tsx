"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function SiteAnimations() {
  useGSAP(
    () => {
      const html = document.documentElement;
      html.classList.add("cn-anim-ready");

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        html.classList.remove("cn-anim-ready");
        document.querySelector(".cn-loader")?.classList.add("is-done");
        return () => {};
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Align GSAP's internal transform cache with the CSS pre-hide state.
        // CSS pre-hides via `transform: translate3d(...)` but GSAP cannot
        // read translate values out of a CSS matrix — so without these sets
        // every `gsap.to({ y: 0 })` would tween from y:0 → y:0 (no movement),
        // and elements would stay stuck in their pre-hide position forever.
        gsap.set("[data-anim='fade-up'], [data-anim='fade']", { y: 28 });
        gsap.set("[data-anim='fade-left']", { x: 36 });
        gsap.set("[data-anim='fade-right']", { x: -36 });
        gsap.set("[data-anim='zoom-in']", { scale: 0.92 });
        gsap.set("[data-stagger] > *", { y: 32 });
        gsap.set("[data-stagger-cards] > *", { y: 32 });
        gsap.set("[data-hero-hide]", { y: 18 });
        // Set overflow:hidden on the wrapper AND push inner spans below —
        // both done here so they're always in sync (no CSS pre-hide needed).
        gsap.set("[data-hero-title-line]", { overflow: "hidden" });
        gsap.set("[data-hero-title-line] > span", { yPercent: 110 });

        const loader = document.querySelector<HTMLElement>(".cn-loader");
        const loaderBarFill = document.querySelector<HTMLElement>(
          ".cn-loader-bar-fill"
        );
        const loaderMarkChars = gsap.utils.toArray<HTMLElement>(
          ".cn-loader-mark span"
        );

        const intro = gsap.timeline({
          defaults: { ease: "power3.out" },
          onComplete: () => loader?.classList.add("is-done"),
        });

        if (loader) {
          intro
            .fromTo(
              loaderMarkChars,
              { yPercent: 100, opacity: 0 },
              {
                yPercent: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.04,
                ease: "expo.out",
              },
              0
            )
            .to(
              loaderBarFill,
              { scaleX: 1, duration: 0.95, ease: "power2.inOut" },
              0.25
            )
            .to(
              loaderMarkChars,
              {
                yPercent: -110,
                opacity: 0,
                duration: 0.5,
                stagger: 0.03,
                ease: "power3.in",
              },
              "+=0.1"
            )
            .to(
              loader,
              { yPercent: -100, duration: 0.9, ease: "power3.inOut" },
              "<+0.05"
            )
            .set(loader, { display: "none" });
        }

        const heroStart = loader ? 1.7 : 0.1;

        const heroIn = gsap.timeline({
          defaults: { ease: "power3.out" },
          delay: heroStart,
        });

        const titleLines = gsap.utils.toArray<HTMLElement>(
          "[data-hero-title-line] > span"
        );
        if (titleLines.length) {
          heroIn.to(
            titleLines,
            {
              yPercent: 0,
              duration: 1.15,
              stagger: 0.1,
              ease: "expo.out",
            },
            0
          );
        }

        heroIn.to(
          "[data-hero-hide]",
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.08,
            ease: "power3.out",
          },
          0.45
        );

        heroIn.to(
          ".cn-hero-eyebrow .cn-dot, .cn-indicators, .cn-carousel-controls",
          { opacity: 1, duration: 0.6, stagger: 0.08 },
          0.55
        );

        ScrollTrigger.batch(
          "[data-anim='fade-up'], [data-anim='fade']",
          {
            start: "top 85%",
            once: true,
            onEnter: (els) =>
              gsap.to(els, {
                opacity: 1,
                y: 0,
                duration: 0.95,
                ease: "power3.out",
                stagger: { each: 0.07, from: "start" },
                overwrite: "auto",
              }),
          }
        );

        ScrollTrigger.batch("[data-anim='fade-left']", {
          start: "top 85%",
          once: true,
          onEnter: (els) =>
            gsap.to(els, {
              opacity: 1,
              x: 0,
              duration: 0.9,
              ease: "power3.out",
              stagger: 0.07,
              overwrite: "auto",
            }),
        });

        ScrollTrigger.batch("[data-anim='fade-right']", {
          start: "top 85%",
          once: true,
          onEnter: (els) =>
            gsap.to(els, {
              opacity: 1,
              x: 0,
              duration: 0.9,
              ease: "power3.out",
              stagger: 0.07,
              overwrite: "auto",
            }),
        });

        ScrollTrigger.batch("[data-anim='zoom-in']", {
          start: "top 85%",
          once: true,
          onEnter: (els) =>
            gsap.to(els, {
              opacity: 1,
              scale: 1,
              duration: 1.0,
              ease: "power3.out",
              stagger: 0.07,
              overwrite: "auto",
            }),
        });

        gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((parent) => {
          const children = Array.from(parent.children) as HTMLElement[];
          ScrollTrigger.create({
            trigger: parent,
            start: "top 82%",
            once: true,
            onEnter: () =>
              gsap.to(children, {
                opacity: 1,
                y: 0,
                duration: 0.85,
                ease: "power3.out",
                stagger: 0.08,
                overwrite: "auto",
              }),
          });
        });

        gsap.utils
          .toArray<HTMLElement>("[data-stagger-cards]")
          .forEach((parent) => {
            const children = Array.from(parent.children) as HTMLElement[];
            ScrollTrigger.create({
              trigger: parent,
              start: "top 80%",
              once: true,
              onEnter: () =>
                gsap.to(children, {
                  opacity: 1,
                  y: 0,
                  duration: 1.0,
                  ease: "power3.out",
                  stagger: { each: 0.09, from: "start" },
                  overwrite: "auto",
                }),
            });
          });

        gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
          const target = Number(el.dataset.count || "0");
          const obj = { v: 0 };
          ScrollTrigger.create({
            trigger: el,
            start: "top 85%",
            once: true,
            onEnter: () => {
              gsap.to(obj, {
                v: target,
                duration: 2.2,
                ease: "power3.out",
                onUpdate: () => {
                  el.textContent = Math.round(obj.v).toLocaleString();
                },
              });
            },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
          const speed = Number(el.dataset.parallax || "0.15");
          gsap.fromTo(
            el,
            { yPercent: -speed * 30 },
            {
              yPercent: speed * 30,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                scrub: true,
                start: "top bottom",
                end: "bottom top",
              },
            }
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-float]").forEach((el, i) => {
          gsap.to(el, {
            y: -12,
            duration: 2.6 + i * 0.35,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });
        });

        const nav = document.querySelector<HTMLElement>(".cn-nav");
        if (nav) {
          let lastScroll = 0;
          ScrollTrigger.create({
            start: 0,
            end: "max",
            onUpdate: (self) => {
              const y = self.scroll();
              if (y < 100) {
                nav.classList.remove("is-hidden");
              } else if (y > lastScroll + 8) {
                nav.classList.add("is-hidden");
              } else if (y < lastScroll - 8) {
                nav.classList.remove("is-hidden");
              }
              lastScroll = y;
            },
          });
        }

        return () => {};
      });

      if (
        typeof document !== "undefined" &&
        document.fonts &&
        document.fonts.ready
      ) {
        document.fonts.ready.then(() => ScrollTrigger.refresh());
      }
    }
  );
  // SiteAnimations is only ever mounted inside the (site) layout, so
  // no explicit scope is needed — GSAP selectors resolve against the document.

  return null;
}

