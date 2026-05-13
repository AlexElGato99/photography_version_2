"use client";

import { SectionForm } from "@/components/dashboard/SectionForm";
import { CollectionEditor } from "@/components/dashboard/CollectionEditor";
import { Tabs } from "@/components/dashboard/Tabs";
import type { PortfolioItem, SectionPortfolioMeta } from "@/lib/types/site";

export function PortfolioEditor({
  meta,
  items,
}: {
  meta: SectionPortfolioMeta;
  items: PortfolioItem[];
}) {
  return (
    <Tabs
      tabs={[
        {
          label: "Heading & tabs",
          render: () => (
            <SectionForm
              table="section_portfolio_meta"
              title="Portfolio · Heading"
              initialData={meta}
              fields={[
                { key: "eyebrow", label: "Eyebrow", type: "text" },
                { key: "title_heading", label: "Section title", type: "section_heading" },
                { key: "lead", label: "Lead paragraph", type: "textarea" },
                {
                  key: "tabs",
                  label: "Filter tabs",
                  type: "tags",
                  placeholder: "e.g. All",
                  help: 'One label per chip (left to right). Usually start with "All" if you use it as the catch-all. Each portfolio item\'s "Tab (filter)" must match one of these labels.',
                },
              ]}
            />
          ),
        },
        {
          label: `Items (${items.length})`,
          render: () => (
            <CollectionEditor<PortfolioItem>
              table="portfolio_items"
              title="Portfolio · Items"
              initialRows={items}
              blank={() => ({
                position: 0,
                number_label: "— 07",
                tag: "Wedding",
                title: "New project",
                image_url: "",
                tab: "All",
                link_href: "#",
              })}
              fields={[
                { key: "number_label", label: "Number label", type: "text" },
                { key: "tag", label: "Tag", type: "text" },
                { key: "title", label: "Title", type: "text" },
                { key: "image_url", label: "Image", type: "image" },
                { key: "tab", label: "Tab (filter)", type: "text" },
                { key: "link_href", label: "Link href", type: "text" },
              ]}
            />
          ),
        },
      ]}
    />
  );
}
