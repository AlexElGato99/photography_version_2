import { CategoriesEditor } from "@/components/dashboard/editors/CategoriesEditor";
import { getCategories, getCategoriesMeta } from "@/lib/site/fetchers";

export default async function CategoriesPage() {
  const [meta, categories] = await Promise.all([getCategoriesMeta(), getCategories()]);
  return <CategoriesEditor meta={meta} categories={categories} />;
}
