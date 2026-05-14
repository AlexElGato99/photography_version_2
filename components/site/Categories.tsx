import type { Category, SectionMeta } from "@/lib/types/site";
import { CategoriesScrollExperience } from "@/components/site/CategoriesScrollExperience";

export function Categories({
  meta,
  categories,
}: {
  meta: SectionMeta;
  categories: Category[];
}) {
  if (!categories.length) return null;

  return (
    <section
      className="cn-section cn-categories cn-categories-scroll"
      id="categories"
      aria-label="Categories"
    >
      <CategoriesScrollExperience meta={meta} categories={categories} />
    </section>
  );
}
