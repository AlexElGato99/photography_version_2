"use client";

import { SectionForm } from "@/components/dashboard/SectionForm";
import { CollectionEditor } from "@/components/dashboard/CollectionEditor";
import { Tabs } from "@/components/dashboard/Tabs";
import type { Faq, SectionMeta } from "@/lib/types/site";

export function FaqEditor({
  meta,
  items,
}: {
  meta: SectionMeta;
  items: Faq[];
}) {
  return (
    <Tabs
      tabs={[
        {
          label: "Heading",
          render: () => (
            <SectionForm
              table="section_faq_meta"
              title="FAQ · Heading"
              initialData={meta}
              fields={[
                { key: "eyebrow", label: "Eyebrow", type: "text" },
                { key: "title_heading", label: "Section title", type: "section_heading" },
              ]}
            />
          ),
        },
        {
          label: `Questions (${items.length})`,
          render: () => (
            <CollectionEditor<Faq>
              table="faqs"
              title="FAQ items"
              initialRows={items}
              blank={() => ({
                position: 0,
                question: "New question?",
                answer: "Answer...",
              })}
              fields={[
                { key: "question", label: "Question", type: "text" },
                { key: "answer", label: "Answer", type: "textarea", rows: 4 },
              ]}
            />
          ),
        },
      ]}
    />
  );
}
