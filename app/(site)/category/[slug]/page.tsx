import { notFound } from "next/navigation";
import { BackTop } from "@/components/site/BackTop";
import { CategoryPageView } from "@/components/site/CategoryPageView";
import { NovoHomeAnimations } from "@/components/site/NovoHomeAnimations";
import { NovoSiteFooter } from "@/components/site/NovoSiteFooter";
import { NovoSiteNav } from "@/components/site/NovoSiteNav";
import { portfolioForCategory } from "@/lib/site/category-helpers";
import {
  getCategories,
  getCategoryBySlug,
  getContactMeta,
  getFooter,
  getFooterGalleryImages,
  getGeneral,
  getNavigation,
  getPortfolioItems,
  getSeo,
} from "@/lib/site/fetchers";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const [category, baseSeo] = await Promise.all([
    getCategoryBySlug(params.slug),
    getSeo(),
  ]);
  if (!category) {
    return { title: `Not found · ${baseSeo.title}` };
  }
  const title =
    category.page_meta_title?.trim() ||
    `${category.name} · ${baseSeo.title.split("·")[0]?.trim() || baseSeo.title}`;
  const description =
    category.page_meta_description?.trim() ||
    category.page_lead?.trim() ||
    baseSeo.description;
  return {
    title,
    description,
  };
}

export default async function CategorySlugPage({
  params,
}: {
  params: { slug: string };
}) {
  const category = await getCategoryBySlug(params.slug);
  if (!category) notFound();

  const [general, navigation, footer, portfolio, categories, footerGalleryImages, contact] =
    await Promise.all([
      getGeneral(),
      getNavigation(),
      getFooter(),
      getPortfolioItems(),
      getCategories(),
      getFooterGalleryImages(),
      getContactMeta(),
    ]);

  const relatedPortfolio = category.show_portfolio_related
    ? portfolioForCategory(portfolio, category.name)
    : [];

  return (
    <>
      <NovoHomeAnimations />
      <div className="cn-novo-home">
        <NovoSiteNav general={general} navigation={navigation} />
        <CategoryPageView category={category} relatedPortfolio={relatedPortfolio} />
        <NovoSiteFooter
          general={general}
          footer={footer}
          categories={categories}
          footerGalleryImages={footerGalleryImages}
          contact={contact}
        />
      </div>
      <BackTop />
    </>
  );
}
