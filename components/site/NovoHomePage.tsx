"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  Category,
  HeroSlide,
  FooterGalleryImage,
  InstagramPost,
  NavItem,
  PortfolioItem,
  SectionAbout,
  SectionContact,
  SectionHero,
  SectionInstagram,
  SectionMeta,
  SectionPortfolioMeta,
  SectionStats,
  SiteFooter,
  SiteGeneral,
  SiteNavigation,
  StatItem,
} from "@/lib/types/site";
import { FooterGallerySliders } from "@/components/site/FooterGallerySliders";
import { SectionHeading } from "@/components/site/SectionHeading";
import { slugify } from "@/lib/slug";

function parseStatTarget(item: StatItem): number {
  const n = parseInt(String(item.count).replace(/\D/g, ""), 10);
  return Number.isNaN(n) || n < 0 ? 0 : n;
}

export function NovoHomePage({
  general,
  navigation,
  footer,
  hero,
  heroSlides,
  about,
  portfolioMeta,
  portfolioItems,
  stats,
  instagramMeta,
  instagramPosts,
  footerGalleryImages,
  contact,
  categoriesMeta,
  categories,
}: {
  general: SiteGeneral;
  navigation: SiteNavigation;
  footer: SiteFooter;
  hero: SectionHero;
  heroSlides: HeroSlide[];
  about: SectionAbout;
  categoriesMeta: SectionMeta;
  categories: Category[];
  portfolioMeta: SectionPortfolioMeta;
  portfolioItems: PortfolioItem[];
  stats: SectionStats;
  instagramMeta: SectionInstagram;
  instagramPosts: InstagramPost[];
  footerGalleryImages: FooterGalleryImage[];
  contact: SectionContact;
}) {
  const slides = heroSlides.length ? heroSlides : [];
  const [activeSlide, setActiveSlide] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [activeFilter, setActiveFilter] = useState(portfolioMeta.tabs[0] ?? "All");
  const [visibleMasonryIds, setVisibleMasonryIds] = useState<string[]>([]);
  const categoryTabs = useMemo(() => {
    const tags = new Set<string>();
    categories.forEach((c) => {
      const t = (c.tag ?? "").trim();
      if (t) tags.add(t);
    });
    return ["All", ...Array.from(tags).sort((a, b) => a.localeCompare(b))];
  }, [categories]);
  const [activeCategoryTag, setActiveCategoryTag] = useState("All");
  const [visibleCategoryIds, setVisibleCategoryIds] = useState<string[]>([]);
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const [statCounts, setStatCounts] = useState<number[]>([]);

  const totalSlides = slides.length || 1;
  const current = slides[activeSlide % totalSlides];
  const autoplayMs = Math.max(3000, hero.autoplay_ms || 5000);

  const filteredPortfolio = useMemo(() => {
    if (activeFilter === "All") return portfolioItems;
    return portfolioItems.filter((i) => i.tab === activeFilter);
  }, [activeFilter, portfolioItems]);

  const filteredCategories = useMemo(() => {
    if (activeCategoryTag === "All") return categories;
    return categories.filter((c) => (c.tag ?? "").trim() === activeCategoryTag);
  }, [activeCategoryTag, categories]);

  const statSlice = useMemo(() => stats.items.slice(0, 3), [
    stats.items
      .slice(0, 3)
      .map((i) => `${Number(i.count)}|${i.suffix}|${i.label}`)
      .join("~"),
  ]);

  const aboutImageAlt = useMemo(() => {
    const h = about.title_heading;
    const parts = [h.line1, h.mid, h.em, h.tail, h.line2]
      .map((s) => String(s ?? "").trim())
      .filter(Boolean);
    return parts.join(" ").trim() || "About";
  }, [about.title_heading]);

  useEffect(() => {
    if (totalSlides <= 1 || !autoplayMs) return;
    const id = window.setInterval(() => {
      setActiveSlide((s) => (s + 1) % totalSlides);
    }, autoplayMs);
    return () => window.clearInterval(id);
  }, [autoplayMs, totalSlides]);

  useEffect(() => {
    const onScroll = () => {
      setNavScrolled(window.scrollY > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = statsRef.current;
    if (!el || statSlice.length === 0) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setStatsVisible(true);
        });
      },
      { threshold: 0.35 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [statSlice.length]);

  useEffect(() => {
    if (!statsVisible || statSlice.length === 0) return;
    const targets = statSlice.map(parseStatTarget);
    let cancelled = false;
    const duration = 1600;
    const start = performance.now();
    const tick = (now: number) => {
      if (cancelled) return;
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setStatCounts(targets.map((max) => Math.floor(ease * max)));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    return () => {
      cancelled = true;
    };
  }, [statsVisible, statSlice]);

  useEffect(() => {
    setVisibleMasonryIds([]);
    const id = window.setTimeout(() => {
      setVisibleMasonryIds(filteredPortfolio.map((p) => p.id));
    }, 120);
    return () => window.clearTimeout(id);
  }, [filteredPortfolio]);

  useEffect(() => {
    setVisibleCategoryIds([]);
    const id = window.setTimeout(() => {
      setVisibleCategoryIds(filteredCategories.map((c) => c.id));
    }, 120);
    return () => window.clearTimeout(id);
  }, [filteredCategories]);

  const instaUrls = useMemo(
    () => instagramPosts.filter((p) => p.image_url).map((p) => p),
    [instagramPosts]
  );
  const instaDup = useMemo(() => [...instaUrls, ...instaUrls], [instaUrls]);
  const footerGalleryUrls = useMemo(
    () => footerGalleryImages.filter((p) => p.image_url),
    [footerGalleryImages]
  );

  const footerCategoryColumns = useMemo(() => {
    if (categories.length === 0) return [[], []] as [Category[], Category[]];
    const mid = Math.ceil(categories.length / 2);
    return [categories.slice(0, mid), categories.slice(mid)] as [Category[], Category[]];
  }, [categories]);

  const footerManualLinkColumns = useMemo(() => {
    const links = (footer.pages_links ?? []).filter((l) => l.label.trim());
    if (links.length === 0) return [[], []] as [NavItem[], NavItem[]];
    const mid = Math.ceil(links.length / 2);
    return [links.slice(0, mid), links.slice(mid)] as [NavItem[], NavItem[]];
  }, [footer.pages_links]);

  const heroTitle = current?.label ?? [hero.line_1, hero.line_2_prefix, hero.line_3].filter(Boolean).join(" ");

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const categoryHref = useCallback((c: Category) => {
    const href = (c.link_href ?? "").trim();
    if (href && href !== "#") return href;
    const rawSlug = (c.slug ?? "").trim();
    const slug = rawSlug || slugify(c.name);
    if (!slug) return "#categories";
    return `/category/${slug}`;
  }, []);

  const handle = (instagramMeta.handle ?? "").replace(/^@/, "");

  return (
    <div className="cn-novo-home">
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

      <section className="cn-novo-hero" id="hero" aria-label="Hero" style={{ ["--nv-dot-dur" as string]: `${autoplayMs}ms` }}>
        {slides.length === 0 ? (
          <div className="cn-novo-hero-slide cn-novo-hero-slide--active" aria-hidden />
        ) : (
          slides.map((s, i) => (
            <div
              key={s.id ?? i}
              className={`cn-novo-hero-slide${i === activeSlide ? " cn-novo-hero-slide--active" : " cn-novo-hero-slide--inactive"}`}
            >
              {s.image_url ? (
                <Image
                  src={s.image_url}
                  alt={s.alt || s.label}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority={i === 0}
                  loading={i === 0 ? "eager" : "lazy"}
                />
              ) : null}
            </div>
          ))
        )}

        {contact.social.length > 0 && (
          <div className="cn-novo-slide-social" aria-label="Social links">
            {contact.social.slice(0, 4).map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
                {s.label}
              </a>
            ))}
          </div>
        )}

        <div className="cn-novo-hero-content">
          <span className="cn-novo-slide-tag">{hero.eyebrow}</span>
          <h1 className="cn-novo-hero-title">{heroTitle}</h1>
          <p className="cn-novo-hero-subtitle">{hero.meta_text}</p>
          <a href={hero.cta_primary_href} className="cn-novo-btn-outline">
            {hero.cta_primary_label}
          </a>
        </div>

        {slides.length > 1 && (
          <div className="cn-novo-slide-dots" role="tablist" aria-label="Slides">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === activeSlide}
                className={`cn-novo-dot-btn${i === activeSlide ? " cn-novo-dot-btn--active" : ""}`}
                onClick={() => setActiveSlide(i)}
                aria-label={`Slide ${i + 1}`}
              >
                <svg viewBox="0 0 34 34" aria-hidden>
                  <circle cx="17" cy="17" r="15" />
                </svg>
                {String(i + 1).padStart(2, "0")}
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="cn-novo-about" id="about" aria-label="About">
        <div className="cn-novo-about-img-side">
          <div className="cn-novo-about-card">
            <div className="cn-novo-about-card-frame">
              <div className="cn-novo-about-card-inner">
                <div className="cn-novo-about-card-image-slot">
                  {about.image_main ? (
                    <Image
                      src={about.image_main}
                      alt={aboutImageAlt}
                      fill
                      sizes="(max-width: 900px) 100vw, 50vw"
                      className="cn-novo-about-card-img object-cover"
                    />
                  ) : (
                    <div className="cn-novo-about-card-placeholder" aria-hidden />
                  )}
                </div>
                {about.badge_title?.trim() ? (
                  <div className="cn-novo-about-badge-wrap">
                    <div className="cn-novo-about-rating-badge">
                      <div className="cn-novo-about-rating-stars" aria-hidden>
                        {[0, 1, 2, 3, 4].map((i) => (
                          <span key={i} className="cn-novo-about-star">
                            ★
                          </span>
                        ))}
                      </div>
                      <p className="cn-novo-about-rating-score">{about.badge_title.trim()}</p>
                      {about.badge_subtitle?.trim() ? (
                        <p className="cn-novo-about-rating-caption">{about.badge_subtitle.trim()}</p>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="cn-novo-about-text-side" ref={statsRef}>
          <span className="cn-novo-section-tag">{about.eyebrow}</span>
          <SectionHeading heading={about.title_heading} className="cn-novo-about-heading" />
          <div className="cn-novo-divider" />
          <div
            className="cn-novo-about-text"
            dangerouslySetInnerHTML={{
              __html: about.body_html.replace(/<p>/g, '<p class="cn-novo-about-p">'),
            }}
          />

          {statSlice.length > 0 && (
            <div className="cn-novo-stats">
              {statSlice.map((item, i) => {
            const numericCount = parseInt(String(item.count).replace(/\D/g, ""), 10);
            const canCount = !Number.isNaN(numericCount) && numericCount > 0;
            return (
              <div key={i}>
                <div className="cn-novo-stat-num">
                  {canCount ? (
                    <>
                      {statCounts[i] ?? 0}
                      {item.suffix ? (
                        <em style={{ fontStyle: "italic", fontSize: "0.5em", marginLeft: "0.08em" }}>{item.suffix}</em>
                      ) : null}
                    </>
                  ) : (
                    <>
                      {item.count}
                      {item.suffix ? (
                        <em style={{ fontStyle: "italic", fontSize: "0.5em", marginLeft: "0.08em" }}>{item.suffix}</em>
                      ) : null}
                    </>
                  )}
                </div>
                <div className="cn-novo-stat-label">{item.label}</div>
              </div>
            );
          })}
            </div>
          )}

          <a href={hero.cta_secondary_href || "/#portfolio"} className="cn-novo-btn-gold">
            {hero.cta_secondary_label || "Explore work"}
          </a>
        </div>
      </section>

      {categories.length > 0 && (
        <section
          className="cn-novo-portfolio cn-novo-portfolio--categories"
          id="categories"
          aria-label="Explore by category"
        >
          <div className="cn-novo-portfolio__inner">
            <header className="cn-novo-section-intro">
              {categoriesMeta.eyebrow ? (
                <span className="cn-novo-section-tag cn-novo-section-intro__tag">{categoriesMeta.eyebrow}</span>
              ) : null}
              <div className="cn-novo-divider cn-novo-section-intro__divider" />
              <SectionHeading heading={categoriesMeta.title_heading} className="cn-novo-section-heading" />
              {categoriesMeta.lead ? (
                <p className="cn-novo-section-intro__lead">{categoriesMeta.lead}</p>
              ) : null}
            </header>

            {categoryTabs.length > 1 ? (
              <div className="cn-novo-filter-bar cn-novo-portfolio__filters" role="tablist" aria-label="Category filters">
                {categoryTabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    role="tab"
                    aria-selected={activeCategoryTag === tab}
                    className={`cn-novo-filter-btn${activeCategoryTag === tab ? " cn-novo-filter-btn--active" : ""}`}
                    onClick={() => setActiveCategoryTag(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            ) : null}

            <div className="cn-novo-portfolio__grid">
              <div className="cn-novo-masonry cn-novo-masonry--portfolio">
                {filteredCategories.map((c, idx) => (
                  <article
                    key={c.id}
                    className={`cn-novo-masonry-item${
                      visibleCategoryIds.includes(c.id) ? " cn-novo-masonry-item--visible" : ""
                    }`}
                    style={{ transitionDelay: `${idx * 35}ms` }}
                  >
                    <a href={categoryHref(c)} className="cn-novo-masonry-link">
                      {c.image_url ? (
                        <img src={c.image_url} alt={c.name} loading="lazy" decoding="async" />
                      ) : (
                        <span className="cn-novo-masonry-placeholder" aria-hidden />
                      )}
                      <span className="cn-novo-masonry-overlay">
                        <span className="cn-novo-masonry-title">{c.name}</span>
                        {c.tag?.trim() ? <span className="cn-novo-masonry-tag">{c.tag.trim()}</span> : null}
                      </span>
                    </a>
                  </article>
                ))}
              </div>
            </div>

            <div className="cn-novo-portfolio__actions">
              <a href={categoryHref(categories[0])} className="cn-novo-btn-gold">
                Browse a category
              </a>
            </div>
          </div>
        </section>
      )}

      <section className="cn-novo-portfolio cn-novo-portfolio--work" id="portfolio" aria-label="Portfolio">
        <div className="cn-novo-portfolio__inner">
          <header className="cn-novo-section-intro">
            {portfolioMeta.eyebrow ? (
              <span className="cn-novo-section-tag cn-novo-section-intro__tag">{portfolioMeta.eyebrow}</span>
            ) : null}
            <div className="cn-novo-divider cn-novo-section-intro__divider" />
            <SectionHeading heading={portfolioMeta.title_heading} className="cn-novo-section-heading" />
            {portfolioMeta.lead ? <p className="cn-novo-section-intro__lead">{portfolioMeta.lead}</p> : null}
          </header>

          {portfolioMeta.tabs.length > 0 ? (
            <div className="cn-novo-filter-bar cn-novo-portfolio__filters" role="tablist" aria-label="Portfolio filters">
              {portfolioMeta.tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={activeFilter === tab}
                  className={`cn-novo-filter-btn${activeFilter === tab ? " cn-novo-filter-btn--active" : ""}`}
                  onClick={() => setActiveFilter(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          ) : null}

          <div className="cn-novo-portfolio__grid">
            {filteredPortfolio.length > 0 ? (
              <div className="cn-novo-masonry cn-novo-masonry--portfolio">
                {filteredPortfolio.map((item, idx) => (
                  <article
                    key={item.id}
                    className={`cn-novo-masonry-item${
                      visibleMasonryIds.includes(item.id) ? " cn-novo-masonry-item--visible" : ""
                    }`}
                    style={{ transitionDelay: `${idx * 35}ms` }}
                  >
                    <a href={item.link_href || "#"} className="cn-novo-masonry-link">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.title} loading="lazy" decoding="async" />
                      ) : (
                        <span className="cn-novo-masonry-placeholder" aria-hidden />
                      )}
                      <span className="cn-novo-masonry-overlay">
                        <span className="cn-novo-masonry-title">{item.title}</span>
                        {item.tab?.trim() && activeFilter === "All" ? (
                          <span className="cn-novo-masonry-tag">{item.tab.trim()}</span>
                        ) : null}
                      </span>
                    </a>
                  </article>
                ))}
              </div>
            ) : (
              <p className="cn-novo-portfolio__empty">No work in this category yet.</p>
            )}
          </div>

          <div className="cn-novo-portfolio__actions">
            <a href="/#portfolio" className="cn-novo-btn-gold">
              View all
            </a>
          </div>
        </div>
      </section>

      {instaUrls.length > 0 && (
        <div className="cn-novo-insta-strip">
          <div className="cn-novo-insta-inner">
            {instaDup.map((p, i) => (
              <a
                key={`${p.id}-${i}`}
                href={p.link_href || instagramMeta.profile_url}
                className="cn-novo-insta-photo"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image src={p.image_url} alt="" fill sizes="200px" className="object-cover" />
              </a>
            ))}
          </div>
          <div className="cn-novo-insta-btn-wrap">
            <a href={instagramMeta.profile_url} className="cn-novo-insta-follow" target="_blank" rel="noopener noreferrer">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
              </svg>
              {handle ? `Follow @${handle}` : "Follow"}
            </a>
          </div>
        </div>
      )}

      {contact.social.length > 0 && (
        <div className="cn-novo-footer-social" aria-label="Social">
          {contact.social.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
              {s.label}
            </a>
          ))}
        </div>
      )}

      <footer className="cn-novo-footer">
        <div className="cn-novo-footer-grid">
          <div className="cn-novo-footer-col">
            <div className="cn-novo-footer-logo">
              <em>{general.brand_italic}</em>
              <b>{general.brand_bold}</b>
            </div>
            <p className="cn-novo-footer-desc">{footer.brand_text || general.description}</p>
          </div>

          <div className="cn-novo-footer-col cn-novo-footer-col--pages">
            <h5 className="cn-novo-footer-heading">{footer.pages_heading}</h5>
            {footer.use_category_pages ? (
              categories.length > 0 ? (
                <div className="cn-novo-footer-links-grid">
                  {footerCategoryColumns.map((col, colIndex) => (
                    <ul key={colIndex} className="cn-novo-footer-links">
                      {col.map((c) => (
                        <li key={c.id}>
                          <a href={categoryHref(c)}>{c.name}</a>
                        </li>
                      ))}
                    </ul>
                  ))}
                </div>
              ) : (
                <p className="cn-novo-footer-empty">No categories yet.</p>
              )
            ) : footer.pages_links.length > 0 ? (
              <div className="cn-novo-footer-links-grid">
                {footerManualLinkColumns.map((col, colIndex) => (
                  <ul key={colIndex} className="cn-novo-footer-links">
                    {col.map((l) => (
                      <li key={`${l.label}-${l.href}`}>
                        <a href={l.href}>{l.label}</a>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            ) : (
              <p className="cn-novo-footer-empty">Add page links in Dashboard → Footer → Pages.</p>
            )}
          </div>

          <div className="cn-novo-footer-col">
            <h5 className="cn-novo-footer-heading">{footer.contact_heading}</h5>
            {footer.show_phone && general.contact_phone ? (
              <p className="cn-novo-contact-row">
                <strong>Phone:</strong>{" "}
                <a href={`tel:${general.contact_phone.replace(/\s/g, "")}`}>{general.contact_phone}</a>
              </p>
            ) : null}
            {footer.show_email && general.contact_email ? (
              <p className="cn-novo-contact-row">
                <strong>Email:</strong>{" "}
                <a href={`mailto:${general.contact_email}`}>{general.contact_email}</a>
              </p>
            ) : null}
            {footer.show_address && (general.address_line || general.address_city) ? (
              <p className="cn-novo-contact-row">
                <strong>Address:</strong> {[general.address_line, general.address_city].filter(Boolean).join(", ")}
              </p>
            ) : null}
            {footer.show_hours && general.hours ? (
              <p className="cn-novo-contact-row">
                <strong>Hours:</strong> {general.hours}
              </p>
            ) : null}
          </div>

          <div className="cn-novo-footer-col cn-novo-footer-col--gallery">
            <h5 className="cn-novo-footer-heading">{footer.gallery_heading}</h5>
            <FooterGallerySliders images={footerGalleryUrls} label={footer.gallery_heading} />
          </div>
        </div>

        <div className="cn-novo-footer-bar">
          {footer.legal.length > 0 ? (
            <nav className="cn-novo-footer-legal" aria-label="Legal">
              {footer.legal.map((l) => (
                <a key={l.label} href={l.href} className="cn-novo-footer-legal-link">
                  {l.label}
                </a>
              ))}
            </nav>
          ) : null}
          {footer.copyright ? <p className="cn-novo-footer-copy">{footer.copyright}</p> : null}
        </div>
      </footer>
    </div>
  );
}
