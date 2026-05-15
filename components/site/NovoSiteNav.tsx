"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { SiteGeneral, SiteNavigation } from "@/lib/types/site";

/** Same nav + mobile menu as Novo home (`cn-novo-nav`, outline CTA). */
export function NovoSiteNav({
  general,
  navigation,
}: {
  general: SiteGeneral;
  navigation: SiteNavigation;
}) {
  const [navScrolled, setNavScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setNavScrolled(window.scrollY > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <div className={`cn-novo-mobile-menu${menuOpen ? " cn-novo-mobile-menu--open" : ""}`}>
        {navigation.items.map((item) => (
          <a key={item.label} href={item.href} onClick={closeMenu}>
            {item.label}
          </a>
        ))}
        <a href={navigation.cta_href} onClick={closeMenu}>
          {navigation.cta_label}
        </a>
      </div>

      <nav
        className={`cn-novo-nav${navScrolled ? " cn-novo-nav--scrolled" : " cn-novo-nav--top"}`}
        aria-label="Main navigation"
      >
        <Link href="/" className="cn-novo-nav-logo" onClick={closeMenu}>
          <em>{general.brand_italic}</em>
          <b>{general.brand_bold}</b>
        </Link>
        <ul className="cn-novo-nav-links">
          {navigation.items.map((item) => (
            <li key={item.label}>
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ul>
        <div className="cn-novo-nav-right">
          <a href={navigation.cta_href} className="cn-novo-btn-outline cn-novo-nav-cta">
            {navigation.cta_label}
          </a>
          <button
            type="button"
            className="cn-novo-hamburger"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span
              style={
                menuOpen ? { transform: "rotate(45deg) translate(5px, 5px)" } : undefined
              }
            />
            <span style={menuOpen ? { opacity: 0 } : undefined} />
            <span
              style={
                menuOpen ? { transform: "rotate(-45deg) translate(5px, -5px)" } : undefined
              }
            />
          </button>
        </div>
      </nav>
    </>
  );
}
