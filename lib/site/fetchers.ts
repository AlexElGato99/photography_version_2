import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  defaultAbout,
  defaultCategories,
  defaultCategoriesMeta,
  defaultContactMeta,
  defaultFaqMeta,
  defaultFaqs,
  defaultFooter,
  defaultGeneral,
  defaultHero,
  defaultHeroSlides,
  defaultInstagramMeta,
  defaultInstagramPosts,
  defaultMarquee,
  defaultNavigation,
  defaultPortfolio,
  defaultPortfolioMeta,
  defaultPricing,
  defaultPricingMeta,
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
import type {
  Category,
  Faq,
  HeroSlide,
  InstagramPost,
  PortfolioItem,
  PricingTier,
  SectionAbout,
  SectionContact,
  SectionHero,
  SectionInstagram,
  SectionMeta,
  SectionPortfolioMeta,
  SectionProcess,
  SectionStats,
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
export const getFooter = () => fetchSingleton<SiteFooter>("site_footer", defaultFooter);
export const getMarquee = () => fetchSingleton<SiteMarquee>("site_marquee", defaultMarquee);

export const getHero = () => fetchSingleton<SectionHero>("section_hero", defaultHero);
export const getAbout = () => fetchSingleton<SectionAbout>("section_about", defaultAbout);
export const getServicesMeta = () => fetchSingleton<SectionMeta>("section_services_meta", defaultServicesMeta);
export const getCategoriesMeta = () => fetchSingleton<SectionMeta>("section_categories_meta", defaultCategoriesMeta);
export const getPortfolioMeta = () => fetchSingleton<SectionPortfolioMeta>("section_portfolio_meta", defaultPortfolioMeta);
export const getStats = () => fetchSingleton<SectionStats>("section_stats", defaultStats);
export const getProcess = () => fetchSingleton<SectionProcess>("section_process", defaultProcess);
export const getTeamMeta = () => fetchSingleton<SectionMeta>("section_team_meta", defaultTeamMeta);
export const getPricingMeta = () => fetchSingleton<SectionMeta>("section_pricing_meta", defaultPricingMeta);
export const getTestimonialsMeta = () => fetchSingleton<SectionMeta>("section_testimonials_meta", defaultTestimonialsMeta);
export const getInstagramMeta = () => fetchSingleton<SectionInstagram>("section_instagram", defaultInstagramMeta);
export const getFaqMeta = () => fetchSingleton<SectionMeta>("section_faq_meta", defaultFaqMeta);
export const getContactMeta = () => fetchSingleton<SectionContact>("section_contact", defaultContactMeta);

export const getHeroSlides = () => fetchCollection<HeroSlide>("hero_slides", defaultHeroSlides);
export const getServices = () => fetchCollection<Service>("services", defaultServices);
export const getCategories = () => fetchCollection<Category>("categories", defaultCategories);
export const getPortfolioItems = () => fetchCollection<PortfolioItem>("portfolio_items", defaultPortfolio);
export const getTeam = () => fetchCollection<TeamMember>("team_members", defaultTeam);
export const getPricing = () => fetchCollection<PricingTier>("pricing_tiers", defaultPricing);
export const getTestimonials = () => fetchCollection<Testimonial>("testimonials", defaultTestimonials);
export const getFaqs = () => fetchCollection<Faq>("faqs", defaultFaqs);
export const getInstagramPosts = () => fetchCollection<InstagramPost>("instagram_posts", defaultInstagramPosts);
