import { SiteNav } from "@/components/site/SiteNav";
import { Hero } from "@/components/site/Hero";
import { Marquee } from "@/components/site/Marquee";
import { About } from "@/components/site/About";
import { Services } from "@/components/site/Services";
import { Categories } from "@/components/site/Categories";
import { Portfolio } from "@/components/site/Portfolio";
import { Stats } from "@/components/site/Stats";
import { Process } from "@/components/site/Process";
import { Team } from "@/components/site/Team";
import { Pricing } from "@/components/site/Pricing";
import { Testimonials } from "@/components/site/Testimonials";
import { Instagram } from "@/components/site/Instagram";
import { FaqSection } from "@/components/site/Faq";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { BackTop } from "@/components/site/BackTop";
import { Loader } from "@/components/site/Loader";
import { SiteAnimations } from "@/components/site/SiteAnimations";
import {
  getAbout,
  getCategories,
  getCategoriesMeta,
  getContactMeta,
  getFaqMeta,
  getFaqs,
  getFooter,
  getGeneral,
  getHero,
  getHeroSlides,
  getInstagramMeta,
  getInstagramPosts,
  getMarquee,
  getNavigation,
  getPortfolioItems,
  getPortfolioMeta,
  getPricing,
  getPricingMeta,
  getProcess,
  getServices,
  getServicesMeta,
  getStats,
  getTeam,
  getTeamMeta,
  getTestimonials,
  getTestimonialsMeta,
} from "@/lib/site/fetchers";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [
    general,
    navigation,
    footer,
    marquee,
    hero,
    heroSlides,
    about,
    servicesMeta,
    services,
    categoriesMeta,
    categories,
    portfolioMeta,
    portfolioItems,
    stats,
    processData,
    teamMeta,
    team,
    pricingMeta,
    pricing,
    testimonialsMeta,
    testimonials,
    instagramMeta,
    instagramPosts,
    faqMeta,
    faqs,
    contactMeta,
  ] = await Promise.all([
    getGeneral(),
    getNavigation(),
    getFooter(),
    getMarquee(),
    getHero(),
    getHeroSlides(),
    getAbout(),
    getServicesMeta(),
    getServices(),
    getCategoriesMeta(),
    getCategories(),
    getPortfolioMeta(),
    getPortfolioItems(),
    getStats(),
    getProcess(),
    getTeamMeta(),
    getTeam(),
    getPricingMeta(),
    getPricing(),
    getTestimonialsMeta(),
    getTestimonials(),
    getInstagramMeta(),
    getInstagramPosts(),
    getFaqMeta(),
    getFaqs(),
    getContactMeta(),
  ]);

  return (
    <>
      <Loader name={general.brand_italic} />
      <SiteAnimations />
      <SiteNav general={general} navigation={navigation} />
      <Hero hero={hero} slides={heroSlides} />
      <Marquee items={marquee.items} />
      <About about={about} />
      <Services meta={servicesMeta} services={services} />
      <Categories meta={categoriesMeta} categories={categories} />
      <Portfolio meta={portfolioMeta} items={portfolioItems} />
      <Stats stats={stats} />
      <Process process={processData} />
      <Team meta={teamMeta} members={team} />
      <Pricing meta={pricingMeta} tiers={pricing} />
      <Testimonials meta={testimonialsMeta} items={testimonials} />
      <Instagram meta={instagramMeta} posts={instagramPosts} />
      <FaqSection meta={faqMeta} items={faqs} />
      <Contact general={general} meta={contactMeta} />
      <Footer general={general} footer={footer} />
      <BackTop />
    </>
  );
}
