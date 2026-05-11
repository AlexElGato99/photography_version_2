import type { Category, SectionMeta } from "@/lib/types/site";

export function Categories({
  meta,
  categories,
}: {
  meta: SectionMeta;
  categories: Category[];
}) {
  return (
    <section
      className="cn-section cn-categories"
      id="categories"
      aria-label="Categories"
    >
      <div className="cn-section-head-center" data-stagger>
        <div className="cn-section-eyebrow">{meta.eyebrow}</div>
        <h2
          className="cn-section-title"
          dangerouslySetInnerHTML={{ __html: meta.title_html }}
        />
      </div>

      <div className="cn-categories-grid" data-stagger-cards>
        {categories.map((c) => (
          <a key={c.id} href={c.link_href} className="cn-category-card">
            <div className="cn-cat-bg">
              <img src={c.image_url} alt={c.name} loading="lazy" />
            </div>
            <div className="cn-cat-overlay" />
            <div className="cn-cat-arrow">
              <svg viewBox="0 0 24 24">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </div>
            <div className="cn-cat-content">
              <small>{c.tag}</small>
              <h3>{c.name}</h3>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
