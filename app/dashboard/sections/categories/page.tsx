import { CategoriesEditor } from "@/components/dashboard/editors/CategoriesEditor";
import { getCategories, getCategoriesMeta } from "@/lib/site/fetchers";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const [meta, categories] = await Promise.all([getCategoriesMeta(), getCategories()]);
  return <CategoriesEditor meta={meta} categories={categories} />;
}
