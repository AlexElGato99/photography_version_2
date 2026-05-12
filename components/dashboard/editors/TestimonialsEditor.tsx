"use client";

import { SectionForm } from "@/components/dashboard/SectionForm";
import { CollectionEditor } from "@/components/dashboard/CollectionEditor";
import { Tabs } from "@/components/dashboard/Tabs";
import type { SectionMeta, Testimonial } from "@/lib/types/site";

export function TestimonialsEditor({
  meta,
  items,
}: {
  meta: SectionMeta;
  items: Testimonial[];
}) {
  return (
    <Tabs
      tabs={[
        {
          label: "Heading",
          render: () => (
            <SectionForm
              table="section_testimonials_meta"
              title="Testimonials · Heading"
              initialData={meta}
              fields={[
                { key: "eyebrow", label: "Eyebrow", type: "text" },
                { key: "title_heading", label: "Section title", type: "section_heading" },
              ]}
            />
          ),
        },
        {
          label: `Quotes (${items.length})`,
          render: () => (
            <CollectionEditor<Testimonial>
              table="testimonials"
              title="Testimonials"
              initialRows={items}
              blank={() => ({
                position: 0,
                stars: 5,
                text: "",
                author_name: "Author",
                author_role: "Role",
                author_avatar_url: null,
              })}
              fields={[
                { key: "stars", label: "Stars (1-5)", type: "number" },
                { key: "text", label: "Quote", type: "textarea", rows: 4 },
                { key: "author_name", label: "Author name", type: "text" },
                { key: "author_role", label: "Author role", type: "text" },
                { key: "author_avatar_url", label: "Avatar photo", type: "image" },
              ]}
            />
          ),
        },
      ]}
    />
  );
}
