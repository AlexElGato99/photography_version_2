"use client";

import { SectionForm } from "@/components/dashboard/SectionForm";
import { CollectionEditor } from "@/components/dashboard/CollectionEditor";
import { Tabs } from "@/components/dashboard/Tabs";
import type { SectionMeta, Service } from "@/lib/types/site";

export function ServicesEditor({
  meta,
  services,
}: {
  meta: SectionMeta;
  services: Service[];
}) {
  return (
    <Tabs
      tabs={[
        {
          label: "Heading",
          render: () => (
            <SectionForm
              table="section_services_meta"
              title="Services · Heading"
              initialData={meta}
              fields={[
                { key: "eyebrow", label: "Eyebrow", type: "text" },
                { key: "title_heading", label: "Section title", type: "section_heading" },
                { key: "lead", label: "Lead paragraph", type: "textarea" },
              ]}
            />
          ),
        },
        {
          label: `Cards (${services.length})`,
          render: () => (
            <CollectionEditor<Service>
              table="services"
              title="Services · Cards"
              initialRows={services}
              blank={() => ({
                position: 0,
                number_label: "— 07",
                icon_svg: "<svg viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"10\"/></svg>",
                name: "New service",
                description: "Description...",
                link_label: "Discover",
                link_href: "#",
              })}
              fields={[
                { key: "number_label", label: "Number label", type: "text" },
                { key: "name", label: "Service name", type: "text" },
                { key: "description", label: "Description", type: "textarea" },
                { key: "icon_svg", label: "Icon SVG (raw markup)", type: "textarea" },
                { key: "link_label", label: "Link label", type: "text" },
                { key: "link_href", label: "Link href", type: "text" },
              ]}
            />
          ),
        },
      ]}
    />
  );
}
