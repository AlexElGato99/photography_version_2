"use client";

import { CollectionEditor } from "@/components/dashboard/CollectionEditor";
import type { InstagramPost } from "@/lib/types/site";

export function SliderEditor({ slides }: { slides: InstagramPost[] }) {
  return (
    <CollectionEditor<InstagramPost>
      table="instagram_posts"
      title="Slider"
      description="Images for the homepage horizontal photo strip. Footer gallery images are managed under Site → Footer."
      allowEmptySave
      initialRows={slides}
      blank={() => ({
        position: 0,
        image_url: "",
        link_href: "#",
      })}
      fields={[
        { key: "image_url", label: "Image", type: "image" },
        { key: "link_href", label: "Link (optional)", type: "text" },
      ]}
    />
  );
}
