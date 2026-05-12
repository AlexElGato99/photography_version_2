import Image from "next/image";
import type { InstagramPost, SectionInstagram } from "@/lib/types/site";
import { SectionHeading } from "@/components/site/SectionHeading";

const IgIcon = () => (
  <svg viewBox="0 0 24 24">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export function Instagram({
  meta,
  posts,
}: {
  meta: SectionInstagram;
  posts: InstagramPost[];
}) {
  return (
    <section className="cn-section cn-instagram" aria-label="Instagram">
      <div className="cn-section-head-center" data-stagger>
        <div className="cn-section-eyebrow">{meta.handle}</div>
        <SectionHeading heading={meta.title_heading} />
        {meta.lead && (
          <p className="cn-section-lead" style={{ margin: "1.5rem auto 0" }}>
            {meta.lead}
          </p>
        )}
      </div>

      <div className="cn-insta-grid" data-stagger-cards>
        {posts.map((p) => (
          <a
            key={p.id}
            href={p.link_href || meta.profile_url}
            className="cn-insta-item"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="cn-insta-bg">
              {p.image_url ? (
                <Image
                  src={p.image_url}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 33vw, 16vw"
                  className="object-cover"
                  loading="lazy"
                />
              ) : null}
            </div>
            <div className="cn-insta-overlay">
              <IgIcon />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
