import { BackTop } from "@/components/site/BackTop";
import { NovoHomeAnimations } from "@/components/site/NovoHomeAnimations";
import { NovoHomePage } from "@/components/site/NovoHomePage";
import {
  getAbout,
  getCategories,
  getCategoriesMeta,
  getContactMeta,
  getFooter,
  getFooterGalleryImages,
  getGeneral,
  getHero,
  getHeroSlides,
  getInstagramMeta,
  getInstagramPosts,
  getNavigation,
  getPortfolioItems,
  getPortfolioMeta,
  getStats,
} from "@/lib/site/fetchers";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [
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
    contact,
    categoriesMeta,
    categories,
    footerGalleryImages,
  ] = await Promise.all([
    getGeneral(),
    getNavigation(),
    getFooter(),
    getHero(),
    getHeroSlides(),
    getAbout(),
    getPortfolioMeta(),
    getPortfolioItems(),
    getStats(),
    getInstagramMeta(),
    getInstagramPosts(),
    getContactMeta(),
    getCategoriesMeta(),
    getCategories(),
    getFooterGalleryImages(),
  ]);

  return (
    <>
      <NovoHomeAnimations />
      <NovoHomePage
        general={general}
        navigation={navigation}
        footer={footer}
        hero={hero}
        heroSlides={heroSlides}
        about={about}
        portfolioMeta={portfolioMeta}
        portfolioItems={portfolioItems}
        stats={stats}
        instagramMeta={instagramMeta}
        instagramPosts={instagramPosts}
        contact={contact}
        categoriesMeta={categoriesMeta}
        categories={categories}
        footerGalleryImages={footerGalleryImages}
      />
      <BackTop />
    </>
  );
}
