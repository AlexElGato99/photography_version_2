"use client";

import { SectionForm } from "@/components/dashboard/SectionForm";
import type { SectionInstagram } from "@/lib/types/site";

export function InstagramEditor({ meta }: { meta: SectionInstagram }) {
  return (
    <SectionForm
      table="section_instagram"
      title="Instagram · Heading"
      description="Handle and follow button for the homepage strip. Manage slider images under Frontend → Slider."
      initialData={meta}
      fields={[
        { key: "handle", label: "Instagram handle", type: "text" },
        { key: "title_heading", label: "Section title", type: "section_heading" },
        { key: "lead", label: "Lead paragraph", type: "textarea" },
        { key: "profile_url", label: "Profile URL", type: "url" },
      ]}
    />
  );
}
