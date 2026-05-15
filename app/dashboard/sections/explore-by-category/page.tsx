import { CategoriesEditor } from "@/components/dashboard/editors/CategoriesEditor";
import { getCategories, getCategoriesMeta } from "@/lib/site/fetchers";

export const dynamic = "force-dynamic";

/** Homepage category block is driven by the same CMS tables as this screen. */
export default async function ExploreByCategoryPage() {
  const [meta, categories] = await Promise.all([getCategoriesMeta(), getCategories()]);
  return <CategoriesEditor meta={meta} categories={categories} sectionTitle="Category" />;
}
