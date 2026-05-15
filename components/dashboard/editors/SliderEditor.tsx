"use client";

import { CollectionEditor } from "@/components/dashboard/CollectionEditor";
import type { InstagramPost } from "@/lib/types/site";

export function SliderEditor({ slides }: { slides: InstagramPost[] }) {
  return (
    <CollectionEditor<InstagramPost>
      table="instagram_posts"
      title="Slider"
      description="Images for the homepage horizontal photo strip. Upload several at once, reorder, then save. Footer gallery is under Site → Footer."
      allowEmptySave
      initialRows={slides}
      bulkImageUpload={{
        imageFieldKey: "image_url",
        buttonLabel: "Upload multiple images",
      }}
      getRowLabel={(row, idx) =>
        row.image_url ? `Slide ${idx + 1}` : `New slide ${idx + 1}`
      }
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
