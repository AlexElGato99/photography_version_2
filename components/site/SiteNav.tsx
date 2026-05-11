"use client";

import { useEffect, useState } from "react";
import type { NavItem, SiteGeneral, SiteNavigation } from "@/lib/types/site";

export function SiteNav({
  general,
  navigation,
}: {
  general: SiteGeneral;
  navigation: SiteNavigation;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`cn-nav${scrolled ? " scrolled" : ""}`}
      aria-label="Main navigation"
    >
      <a href="#hero" className="cn-nav-logo">
        <i>{general.brand_italic}</i> <b>{general.brand_bold}</b>
      </a>

      <ul className="cn-nav-links">
        {navigation.items.map((item: NavItem) => (
          <li key={item.label}>
            <a href={item.href}>{item.label}</a>
          </li>
        ))}
      </ul>

      <a href={navigation.cta_href} className="cn-nav-cta">
        {navigation.cta_label}
        <svg viewBox="0 0 24 24">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </a>

      <button
        type="button"
        className="cn-nav-toggle"
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
        onClick={() => setMobileOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>

      {mobileOpen && (
        <div
          style={{
            position: "fixed",
            inset: "var(--cn-nav-h) 0 0 0",
            background: "var(--cn-paper)",
            zIndex: 499,
            padding: "2rem var(--cn-gutter)",
            display: "flex",
            flexDirection: "column",
            gap: "1.2rem",
          }}
          onClick={() => setMobileOpen(false)}
        >
          {navigation.items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              style={{
                fontFamily: "var(--font-cn-display), serif",
                fontSize: "1.8rem",
                color: "var(--cn-ink)",
              }}
            >
              {item.label}
            </a>
          ))}
          <a
            href={navigation.cta_href}
            className="cn-nav-cta"
            style={{ alignSelf: "flex-start", marginTop: "1rem" }}
          >
            {navigation.cta_label}
            <svg viewBox="0 0 24 24">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>
      )}
    </nav>
  );
}
