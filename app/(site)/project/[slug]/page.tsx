import { notFound } from "next/navigation";
import { BackTop } from "@/components/site/BackTop";
import { NovoHomeAnimations } from "@/components/site/NovoHomeAnimations";
import { NovoSiteFooter } from "@/components/site/NovoSiteFooter";
import { NovoSiteNav } from "@/components/site/NovoSiteNav";
import { ProjectPageView } from "@/components/site/ProjectPageView";
import {
  getCategories,
  getContactMeta,
  getFooter,
  getFooterGalleryImages,
  getGeneral,
  getNavigation,
  getPortfolioBySlug,
  getSeo,
} from "@/lib/site/fetchers";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const [project, baseSeo] = await Promise.all([getPortfolioBySlug(params.slug), getSeo()]);
  if (!project) {
    return { title: `Not found · ${baseSeo.title}` };
  }
  const title =
    project.page_meta_title?.trim() ||
    `${project.title} · ${baseSeo.title.split("·")[0]?.trim() || baseSeo.title}`;
  const description =
    project.page_meta_description?.trim() ||
    project.page_lead?.trim() ||
    baseSeo.description;
  return {
    title,
    description,
  };
}

export default async function ProjectSlugPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = await getPortfolioBySlug(params.slug);
  if (!project) notFound();

  const [general, navigation, footer, categories, footerGalleryImages, contact] = await Promise.all([
    getGeneral(),
    getNavigation(),
    getFooter(),
    getCategories(),
    getFooterGalleryImages(),
    getContactMeta(),
  ]);

  return (
    <>
      <NovoHomeAnimations />
      <div className="cn-novo-home">
        <NovoSiteNav general={general} navigation={navigation} />
        <ProjectPageView project={project} />
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
