import Image from "next/image";
import Link from "next/link";
import type { Category, SectionMeta } from "@/lib/types/site";
import { categoryPublicHref } from "@/lib/site/category-helpers";
import { SectionHeading } from "@/components/site/SectionHeading";

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
        <SectionHeading heading={meta.title_heading} />
      </div>

      <div className="cn-categories-grid" data-stagger-cards>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={categoryPublicHref(c)}
            className="cn-category-card"
            prefetch={false}
          >
            <div className="cn-cat-bg">
              {c.image_url ? (
                <Image
                  src={c.image_url}
                  alt={c.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                  loading="lazy"
                />
              ) : null}
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
          </Link>
        ))}
      </div>
    </section>
  );
}
