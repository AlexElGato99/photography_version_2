"use client";

import { SectionForm } from "@/components/dashboard/SectionForm";
import { CollectionEditor } from "@/components/dashboard/CollectionEditor";
import { Tabs } from "@/components/dashboard/Tabs";
import type { PricingTier, SectionMeta } from "@/lib/types/site";

type PricingRow = PricingTier & { features_text: string };

export function PricingEditor({
  meta,
  tiers,
}: {
  meta: SectionMeta;
  tiers: PricingTier[];
}) {
  const enriched: PricingRow[] = tiers.map((t) => ({
    ...t,
    features_text: JSON.stringify(t.features ?? [], null, 2),
  }));

  return (
    <Tabs
      tabs={[
        {
          label: "Heading",
          render: () => (
            <SectionForm
              table="section_pricing_meta"
              title="Pricing · Heading"
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
          label: `Tiers (${tiers.length})`,
          render: () => (
            <CollectionEditor<PricingRow>
              table="pricing_tiers"
              title="Pricing tiers"
              initialRows={enriched}
              blank={() => ({
                position: 0,
                name: "New tier",
                currency: "€",
                amount: "0",
                period: "From / per project",
                badge: null,
                features: [],
                features_text: "[]",
                cta_label: "Get started",
                cta_href: "#contact",
                featured: false,
              })}
              fields={[
                { key: "name", label: "Name", type: "text" },
                { key: "currency", label: "Currency", type: "text" },
                { key: "amount", label: "Amount", type: "text" },
                { key: "period", label: "Period text", type: "text" },
                { key: "badge", label: "Badge text", type: "text" },
                { key: "cta_label", label: "CTA label", type: "text" },
                { key: "cta_href", label: "CTA href", type: "text" },
                { key: "featured", label: "Featured (highlighted)", type: "switch" },
                {
                  key: "features_text",
                  label: "Features (JSON array of strings)",
                  type: "textarea",
                  rows: 6,
                  placeholder: '["Up to 2 hours","40+ edited photos"]',
                },
              ]}
              transformRow={(row) => {
                let features: string[] = [];
                try {
                  const parsed = JSON.parse(row.features_text || "[]");
                  if (!Array.isArray(parsed)) {
                    throw new Error("Features must be a JSON array of strings.");
                  }
                  features = parsed;
                } catch (err) {
                  throw new Error(
                    `Tier "${row.name}": invalid features JSON — ${(err as Error).message}`
                  );
                }
                const { features_text: _ft, ...rest } = row;
                void _ft;
                return { ...rest, features };
              }}
            />
          ),
        },
      ]}
    />
  );
}
