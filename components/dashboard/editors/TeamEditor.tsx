"use client";

import { SectionForm } from "@/components/dashboard/SectionForm";
import { CollectionEditor } from "@/components/dashboard/CollectionEditor";
import { Tabs } from "@/components/dashboard/Tabs";
import type { SectionMeta, TeamMember } from "@/lib/types/site";

export function TeamEditor({
  meta,
  members,
}: {
  meta: SectionMeta;
  members: TeamMember[];
}) {
  return (
    <Tabs
      tabs={[
        {
          label: "Heading",
          render: () => (
            <SectionForm
              table="section_team_meta"
              title="Team · Heading"
              initialData={meta}
              fields={[
                { key: "eyebrow", label: "Eyebrow", type: "text" },
                { key: "title_html", label: "Title (HTML)", type: "html" },
                { key: "lead", label: "Lead paragraph", type: "textarea" },
              ]}
            />
          ),
        },
        {
          label: `Members (${members.length})`,
          render: () => (
            <CollectionEditor<TeamMember>
              table="team_members"
              title="Team members"
              initialRows={members}
              blank={() => ({
                position: 0,
                name: "New member",
                role: "Role",
                image_url: "",
                instagram_url: null,
                linkedin_url: null,
              })}
              fields={[
                { key: "name", label: "Name", type: "text" },
                { key: "role", label: "Role", type: "text" },
                { key: "image_url", label: "Photo", type: "image" },
                { key: "instagram_url", label: "Instagram URL", type: "url" },
                { key: "linkedin_url", label: "LinkedIn URL", type: "url" },
              ]}
            />
          ),
        },
      ]}
    />
  );
}
