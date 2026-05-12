import { notFound } from "next/navigation";
import { BackTop } from "@/components/site/BackTop";
import { CategoryPageView } from "@/components/site/CategoryPageView";
import { Footer } from "@/components/site/Footer";
import { Loader } from "@/components/site/Loader";
import { SiteAnimations } from "@/components/site/SiteAnimations";
import { SiteNav } from "@/components/site/SiteNav";
import { portfolioForCategory } from "@/lib/site/category-helpers";
import {
  getCategoryBySlug,
  getFooter,
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

  const [general, navigation, footer, portfolio] = await Promise.all([
    getGeneral(),
    getNavigation(),
    getFooter(),
    getPortfolioItems(),
  ]);

  const relatedPortfolio = category.show_portfolio_related
    ? portfolioForCategory(portfolio, category.name)
    : [];

  return (
    <>
      <Loader name={general.brand_italic} />
      <SiteAnimations />
      <SiteNav general={general} navigation={navigation} />
      <CategoryPageView category={category} relatedPortfolio={relatedPortfolio} />
      <Footer general={general} footer={footer} />
      <BackTop />
    </>
  );
}
