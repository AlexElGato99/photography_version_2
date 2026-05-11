import type { SectionStats } from "@/lib/types/site";

export function Stats({ stats }: { stats: SectionStats }) {
  return (
    <section className="cn-section cn-stats" aria-label="Stats">
      <div className="cn-section-head" style={{ marginBottom: "5rem" }} data-stagger>
        <div>
          <div className="cn-section-eyebrow">{stats.eyebrow}</div>
          <h2
            className="cn-section-title"
            dangerouslySetInnerHTML={{ __html: stats.title_html }}
          />
        </div>
        <p className="cn-section-lead">{stats.lead}</p>
      </div>

      <div className="cn-stats-grid" data-stagger-cards>
        {stats.items.map((item, i) => {
          const numericCount = parseInt(String(item.count).replace(/\D/g, ""), 10);
          const canCount = !Number.isNaN(numericCount) && numericCount > 0;
          return (
            <div key={i} className="cn-stat-item">
              <span className="cn-stat-num">
                {canCount ? (
                  <span data-count={numericCount}>0</span>
                ) : (
                  item.count
                )}
                <em>{item.suffix}</em>
              </span>
              <p className="cn-stat-label">{item.label}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
