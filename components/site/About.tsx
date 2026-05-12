import Image from "next/image";
import type { SectionAbout } from "@/lib/types/site";
import { SectionHeading } from "@/components/site/SectionHeading";

export function About({ about }: { about: SectionAbout }) {
  return (
    <section className="cn-section cn-about" id="about" aria-label="About">
      <div className="cn-about-visual" data-anim="fade-right">
        <div className="cn-about-img-main">
          {about.image_main ? (
            <Image
              src={about.image_main}
              alt="Studio"
              fill
              sizes="(max-width: 900px) 100vw, 45vw"
              className="object-cover"
              loading="lazy"
              data-parallax="0.2"
            />
          ) : null}
        </div>
        <div className="cn-about-img-secondary" data-float>
          {about.image_secondary ? (
            <Image
              src={about.image_secondary}
              alt="Studio detail"
              fill
              sizes="(max-width: 900px) 45vw, 22vw"
              className="object-cover"
              loading="lazy"
            />
          ) : null}
        </div>
        <div className="cn-about-badge" data-float>
          <div className="cn-badge-icon">
            <svg viewBox="0 0 24 24">
              <path d="M12 2l2.4 7.4L22 10l-6 4.6L18 22l-6-4.5L6 22l2-7.4L2 10l7.6-.6z" />
            </svg>
          </div>
          <div className="cn-about-badge-text">
            <b>{about.badge_title}</b>
            <span>{about.badge_subtitle}</span>
          </div>
        </div>
      </div>

      <div className="cn-about-content" data-stagger>
        <div className="cn-section-eyebrow">{about.eyebrow}</div>
        <SectionHeading heading={about.title_heading} />
        <div
          className="cn-about-quote"
          dangerouslySetInnerHTML={{ __html: about.quote }}
        />
        <div
          className="cn-about-body-wrap"
          style={{ display: "flex", flexDirection: "column", gap: 0 }}
          dangerouslySetInnerHTML={{
            __html: about.body_html.replace(
              /<p>/g,
              '<p class="cn-about-body">'
            ),
          }}
        />
        <div className="cn-about-signature">
          <div className="cn-signature-mark">
            <i>{about.signature_name}</i>
          </div>
          <div className="cn-signature-info">
            <b>{about.signature_role}</b>
            <span>{about.signature_meta}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
