import Image from "next/image";
import type { SectionMeta, TeamMember } from "@/lib/types/site";
import { SectionHeading } from "@/components/site/SectionHeading";

const IgIcon = () => (
  <svg viewBox="0 0 24 24">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const LiIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export function Team({
  meta,
  members,
}: {
  meta: SectionMeta;
  members: TeamMember[];
}) {
  return (
    <section className="cn-section cn-team" aria-label="Team">
      <div className="cn-section-head" data-stagger>
        <div>
          <div className="cn-section-eyebrow">{meta.eyebrow}</div>
          <SectionHeading heading={meta.title_heading} />
        </div>
        {meta.lead && <p className="cn-section-lead">{meta.lead}</p>}
      </div>

      <div className="cn-team-grid" data-stagger-cards>
        {members.map((m) => (
          <div key={m.id} className="cn-team-member">
            <div className="cn-team-img">
              <div className="cn-team-img-bg">
                {m.image_url ? (
                  <Image
                    src={m.image_url}
                    alt={m.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                    loading="lazy"
                  />
                ) : null}
              </div>
              <div className="cn-team-social">
                {m.instagram_url && (
                  <a href={m.instagram_url} aria-label="Instagram">
                    <IgIcon />
                  </a>
                )}
                {m.linkedin_url && (
                  <a href={m.linkedin_url} aria-label="LinkedIn">
                    <LiIcon />
                  </a>
                )}
              </div>
            </div>
            <h4 className="cn-team-name">{m.name}</h4>
            <p className="cn-team-role">{m.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
