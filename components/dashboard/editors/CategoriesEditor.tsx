"use client";

import { SectionForm } from "@/components/dashboard/SectionForm";
import { CollectionEditor } from "@/components/dashboard/CollectionEditor";
import { Tabs } from "@/components/dashboard/Tabs";
import type { Category, SectionMeta } from "@/lib/types/site";

export function CategoriesEditor({
  meta,
  categories,
}: {
  meta: SectionMeta;
  categories: Category[];
}) {
  return (
    <Tabs
      tabs={[
        {
          label: "Heading",
          render: () => (
            <SectionForm
              table="section_categories_meta"
              title="Categories · Heading"
              initialData={meta}
              fields={[
                { key: "eyebrow", label: "Eyebrow", type: "text" },
                { key: "title_html", label: "Title (HTML)", type: "html" },
              ]}
            />
          ),
        },
        {
          label: `Cards (${categories.length})`,
          render: () => (
            <CollectionEditor<Category>
              table="categories"
              title="Categories · Cards"
              initialRows={categories}
              blank={() => ({
                position: 0,
                tag: "Featured",
                name: "New category",
                image_url: "",
                link_href: "#",
              })}
              fields={[
                { key: "tag", label: "Small tag", type: "text" },
                { key: "name", label: "Category name", type: "text" },
                { key: "image_url", label: "Image", type: "image" },
                { key: "link_href", label: "Link href", type: "text" },
              ]}
            />
          ),
        },
      ]}
    />
  );
}
