"use client";

import { SectionForm } from "@/components/dashboard/SectionForm";
import { CollectionEditor } from "@/components/dashboard/CollectionEditor";
import { Tabs } from "@/components/dashboard/Tabs";
import type { HeroSlide, SectionHero } from "@/lib/types/site";

export function HeroEditor({
  hero,
  slides,
}: {
  hero: SectionHero;
  slides: HeroSlide[];
}) {
  return (
    <Tabs
      tabs={[
        {
          label: "Content",
          render: () => (
            <SectionForm
              table="section_hero"
              title="Hero · Content"
              description="Eyebrow, three-line headline, meta text and CTA buttons."
              initialData={hero}
              fields={[
                { key: "eyebrow", label: "Eyebrow", type: "text" },
                { key: "line_1", label: "Headline · line 1", type: "text" },
                { key: "line_2_prefix", label: "Headline · line 2 — before italic", type: "text" },
                { key: "line_2_em", label: "Headline · line 2 — italic word", type: "text" },
                { key: "line_2_suffix", label: "Headline · line 2 — after italic", type: "text" },
                { key: "line_3", label: "Headline · line 3", type: "text" },
                { key: "meta_text", label: "Meta paragraph", type: "textarea" },
                { key: "cta_primary_label", label: "Primary CTA label", type: "text" },
                { key: "cta_primary_href", label: "Primary CTA href", type: "text" },
                { key: "cta_secondary_label", label: "Secondary CTA label", type: "text" },
                { key: "cta_secondary_href", label: "Secondary CTA href", type: "text" },
                { key: "autoplay_ms", label: "Carousel autoplay (ms)", type: "number" },
              ]}
            />
          ),
        },
        {
          label: `Slides (${slides.length})`,
          render: () => (
            <CollectionEditor<HeroSlide>
              table="hero_slides"
              title="Hero · Carousel slides"
              description="Order and edit the rotating background slides."
              initialRows={slides}
              blank={() => ({
                position: 0,
                label: "06 · New",
                image_url: "",
                alt: "",
              })}
              fields={[
                { key: "label", label: "Label", type: "text", placeholder: "01 · Wedding" },
                { key: "image_url", label: "Image", type: "image" },
                { key: "alt", label: "Alt text", type: "text" },
              ]}
            />
          ),
        },
      ]}
    />
  );
}
