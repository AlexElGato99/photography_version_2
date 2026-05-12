"use client";

import { SectionForm } from "@/components/dashboard/SectionForm";
import { CollectionEditor } from "@/components/dashboard/CollectionEditor";
import { Tabs } from "@/components/dashboard/Tabs";
import type { InstagramPost, SectionInstagram } from "@/lib/types/site";

export function InstagramEditor({
  meta,
  posts,
}: {
  meta: SectionInstagram;
  posts: InstagramPost[];
}) {
  return (
    <Tabs
      tabs={[
        {
          label: "Heading",
          render: () => (
            <SectionForm
              table="section_instagram"
              title="Instagram · Heading"
              initialData={meta}
              fields={[
                { key: "handle", label: "Instagram handle", type: "text" },
                { key: "title_heading", label: "Section title", type: "section_heading" },
                { key: "lead", label: "Lead paragraph", type: "textarea" },
                { key: "profile_url", label: "Profile URL", type: "url" },
              ]}
            />
          ),
        },
        {
          label: `Posts (${posts.length})`,
          render: () => (
            <CollectionEditor<InstagramPost>
              table="instagram_posts"
              title="Instagram posts"
              initialRows={posts}
              blank={() => ({
                position: 0,
                image_url: "",
                link_href: "#",
              })}
              fields={[
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
