import type { SectionMeta, Testimonial } from "@/lib/types/site";

const Star = () => (
  <svg viewBox="0 0 24 24">
    <path d="M12 2l2.4 7.4L22 10l-6 4.6L18 22l-6-4.5L6 22l2-7.4L2 10l7.6-.6z" />
  </svg>
);

export function Testimonials({
  meta,
  items,
}: {
  meta: SectionMeta;
  items: Testimonial[];
}) {
  return (
    <section className="cn-section cn-testimonials" aria-label="Testimonials">
      <div className="cn-section-head-center" data-stagger>
        <div className="cn-section-eyebrow">{meta.eyebrow}</div>
        <h2
          className="cn-section-title"
          dangerouslySetInnerHTML={{ __html: meta.title_html }}
        />
      </div>

      <div className="cn-test-grid" data-stagger-cards>
        {items.map((t) => (
          <article key={t.id} className="cn-test-card">
            <div className="cn-test-stars">
              {Array.from({ length: Math.max(0, Math.min(5, t.stars)) }).map(
                (_, i) => (
                  <Star key={i} />
                )
              )}
            </div>
            <p className="cn-test-text">&ldquo;{t.text}&rdquo;</p>
            <div className="cn-test-author">
              <div className="cn-test-avatar">
                {t.author_avatar_url && (
                  <img src={t.author_avatar_url} alt={t.author_name} loading="lazy" />
                )}
              </div>
              <div className="cn-test-author-info">
                <b>{t.author_name}</b>
                <span>{t.author_role}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
