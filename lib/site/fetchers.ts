import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  defaultAbout,
  defaultCategories,
  defaultCategoriesMeta,
  defaultContactMeta,
  defaultFaqMeta,
  defaultFaqs,
  defaultFooter,
  defaultFooterGalleryImages,
  defaultGeneral,
  defaultHero,
  defaultHeroSlides,
  defaultInstagramMeta,
  defaultInstagramPosts,
  defaultMarquee,
  defaultNavigation,
  defaultPortfolio,
  defaultPortfolioMeta,
  defaultProcess,
  defaultSeo,
  defaultServices,
  defaultServicesMeta,
  defaultStats,
  defaultTeam,
  defaultTeamMeta,
  defaultTestimonials,
  defaultTestimonialsMeta,
} from "@/lib/site/defaults";
import { normalizeCategoryRow } from "@/lib/site/category-helpers";
import {
  findPortfolioBySlug,
  normalizePortfolioRow,
} from "@/lib/site/portfolio-helpers";
import { normalizeFooterRow } from "@/lib/site/normalize-footer";
import {
  normalizeAboutRow,
  normalizeContactRow,
  normalizeHeroRow,
  normalizeInstagramRow,
  normalizePortfolioMetaRow,
  normalizeProcessRow,
  normalizeSectionMetaRow,
  normalizeStatsRow,
} from "@/lib/site/normalize-rows";
import { slugify } from "@/lib/slug";
import type {
  Category,
  Faq,
  HeroSlide,
  FooterGalleryImage,
  InstagramPost,
  PortfolioItem,
  Service,
  SiteFooter,
  SiteGeneral,
  SiteMarquee,
  SiteNavigation,
  SiteSeo,
  TeamMember,
  Testimonial,
} from "@/lib/types/site";

function hasSupabase() {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

async function safeFetch<T>(
  fn: (sb: ReturnType<typeof createSupabaseServerClient>) => Promise<T | null>,
  fallback: T
): Promise<T> {
  if (!hasSupabase()) return fallback;
  try {
    const sb = createSupabaseServerClient();
    const value = await fn(sb);
    return (value ?? fallback) as T;
  } catch (err) {
    console.warn("[supabase] fetch failed, using defaults:", err);
    return fallback;
  }
}

async function fetchSingleton<T>(table: string, fallback: T): Promise<T> {
  return safeFetch(async (sb) => {
    const { data } = await sb.from(table).select("*").eq("id", 1).single();
    return data as T | null;
  }, fallback);
}

async function fetchCollection<T>(
  table: string,
  fallback: T[]
): Promise<T[]> {
  return safeFetch(async (sb) => {
    const { data } = await sb
      .from(table)
      .select("*")
      .order("position", { ascending: true });
    return (data as T[] | null) ?? null;
  }, fallback);
}

export const getGeneral = () => fetchSingleton<SiteGeneral>("site_general", defaultGeneral);
export const getSeo = () => fetchSingleton<SiteSeo>("site_seo", defaultSeo);
export const getNavigation = () => fetchSingleton<SiteNavigation>("site_navigation", defaultNavigation);
export const getFooter = () =>
  safeFetch(async (sb) => {
    const { data } = await sb.from("site_footer").select("*").eq("id", 1).single();
    return data ? normalizeFooterRow(data as Record<string, unknown>, defaultFooter) : null;
  }, defaultFooter);

export const getFooterGalleryImages = () =>
  safeFetch(async (sb) => {
    const { data, error } = await sb
      .from("footer_gallery_images")
      .select("*")
      .order("position", { ascending: true });
    if (error) {
      console.warn("[supabase] footer_gallery_images:", error.message);
      return null;
    }
    const rows = (data ?? []) as FooterGalleryImage[];
    if (rows.length === 0) return null;
    return rows;
  }, defaultFooterGalleryImages);
export const getMarquee = () => fetchSingleton<SiteMarquee>("site_marquee", defaultMarquee);

export const getHero = () =>
  safeFetch(async (sb) => {
    const { data } = await sb.from("section_hero").select("*").eq("id", 1).single();
    return data ? normalizeHeroRow(data as Record<string, unknown>, defaultHero) : null;
  }, defaultHero);

export const getAbout = () =>
  safeFetch(async (sb) => {
    const { data } = await sb.from("section_about").select("*").eq("id", 1).single();
    return data ? normalizeAboutRow(data as Record<string, unknown>, defaultAbout) : null;
  }, defaultAbout);

export const getServicesMeta = () =>
  safeFetch(async (sb) => {
    const { data } = await sb.from("section_services_meta").select("*").eq("id", 1).single();
    return data ? normalizeSectionMetaRow(data as Record<string, unknown>, defaultServicesMeta) : null;
  }, defaultServicesMeta);

export const getCategoriesMeta = () =>
  safeFetch(async (sb) => {
    const { data } = await sb.from("section_categories_meta").select("*").eq("id", 1).single();
    return data ? normalizeSectionMetaRow(data as Record<string, unknown>, defaultCategoriesMeta) : null;
  }, defaultCategoriesMeta);

export const getPortfolioMeta = () =>
  safeFetch(async (sb) => {
    const { data } = await sb.from("section_portfolio_meta").select("*").eq("id", 1).single();
    return data ? normalizePortfolioMetaRow(data as Record<string, unknown>, defaultPortfolioMeta) : null;
  }, defaultPortfolioMeta);

export const getStats = () =>
  safeFetch(async (sb) => {
    const { data } = await sb.from("section_stats").select("*").eq("id", 1).single();
    return data ? normalizeStatsRow(data as Record<string, unknown>, defaultStats) : null;
  }, defaultStats);

export const getProcess = () =>
  safeFetch(async (sb) => {
    const { data } = await sb.from("section_process").select("*").eq("id", 1).single();
    return data ? normalizeProcessRow(data as Record<string, unknown>, defaultProcess) : null;
  }, defaultProcess);

export const getTeamMeta = () =>
  safeFetch(async (sb) => {
    const { data } = await sb.from("section_team_meta").select("*").eq("id", 1).single();
    return data ? normalizeSectionMetaRow(data as Record<string, unknown>, defaultTeamMeta) : null;
  }, defaultTeamMeta);

export const getTestimonialsMeta = () =>
  safeFetch(async (sb) => {
    const { data } = await sb.from("section_testimonials_meta").select("*").eq("id", 1).single();
    return data ? normalizeSectionMetaRow(data as Record<string, unknown>, defaultTestimonialsMeta) : null;
  }, defaultTestimonialsMeta);

export const getInstagramMeta = () =>
  safeFetch(async (sb) => {
    const { data } = await sb.from("section_instagram").select("*").eq("id", 1).single();
    return data ? normalizeInstagramRow(data as Record<string, unknown>, defaultInstagramMeta) : null;
  }, defaultInstagramMeta);

export const getFaqMeta = () =>
  safeFetch(async (sb) => {
    const { data } = await sb.from("section_faq_meta").select("*").eq("id", 1).single();
    return data ? normalizeSectionMetaRow(data as Record<string, unknown>, defaultFaqMeta) : null;
  }, defaultFaqMeta);

export const getContactMeta = () =>
  safeFetch(async (sb) => {
    const { data } = await sb.from("section_contact").select("*").eq("id", 1).single();
    return data ? normalizeContactRow(data as Record<string, unknown>, defaultContactMeta) : null;
  }, defaultContactMeta);

export const getHeroSlides = () => fetchCollection<HeroSlide>("hero_slides", defaultHeroSlides);
export const getServices = () => fetchCollection<Service>("services", defaultServices);
export const getCategories = () =>
  safeFetch(async (sb) => {
    const { data } = await sb
      .from("categories")
      .select("*")
      .order("position", { ascending: true });
    if (!data) return null;
    return (data as Record<string, unknown>[]).map((row) => normalizeCategoryRow(row));
  }, defaultCategories);

function categorySlugMatch(c: Category, slug: string): boolean {
  const s = (c.slug ?? "").trim().toLowerCase();
  const derived = (s || slugify(c.name)).toLowerCase();
  return derived === slug;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const normalized = slug.trim().toLowerCase();
  if (!normalized) return null;
  if (!hasSupabase()) {
    return defaultCategories.find((c) => categorySlugMatch(c, normalized)) ?? null;
  }
  try {
    const sb = createSupabaseServerClient();
    let { data, error } = await sb
      .from("categories")
      .select("*")
      .eq("slug", normalized)
      .maybeSingle();
    if (!data && !error) {
      ({ data, error } = await sb
        .from("categories")
        .select("*")
        .ilike("slug", normalized)
        .limit(1)
        .maybeSingle());
    }
    if (error || !data) {
      return defaultCategories.find((c) => categorySlugMatch(c, normalized)) ?? null;
    }
    return normalizeCategoryRow(data as Record<string, unknown>);
  } catch {
    return defaultCategories.find((c) => categorySlugMatch(c, normalized)) ?? null;
  }
}

export const getPortfolioItems = () =>
  safeFetch(async (sb) => {
    const { data } = await sb
      .from("portfolio_items")
      .select("*")
      .order("position", { ascending: true });
    if (!data) return null;
    return (data as Record<string, unknown>[]).map((row) => normalizePortfolioRow(row));
  }, defaultPortfolio);

export async function getPortfolioBySlug(slug: string): Promise<PortfolioItem | null> {
  const normalized = slug.trim().toLowerCase();
  if (!normalized) return null;
  if (!hasSupabase()) {
    return findPortfolioBySlug(defaultPortfolio, normalized);
  }
  try {
    const sb = createSupabaseServerClient();
    const { data, error } = await sb
      .from("portfolio_items")
      .select("*")
      .order("position", { ascending: true });
    if (error || !data) {
      return findPortfolioBySlug(defaultPortfolio, normalized);
    }
    const items = (data as Record<string, unknown>[]).map((row) => normalizePortfolioRow(row));
    return findPortfolioBySlug(items, normalized) ?? findPortfolioBySlug(defaultPortfolio, normalized);
  } catch {
    return findPortfolioBySlug(defaultPortfolio, normalized);
  }
}
export const getTeam = () => fetchCollection<TeamMember>("team_members", defaultTeam);
export const getTestimonials = () => fetchCollection<Testimonial>("testimonials", defaultTestimonials);
export const getFaqs = () => fetchCollection<Faq>("faqs", defaultFaqs);
export const getInstagramPosts = () => fetchCollection<InstagramPost>("instagram_posts", defaultInstagramPosts);
