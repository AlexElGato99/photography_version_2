import type { SectionProcess } from "@/lib/types/site";

export function Process({ process }: { process: SectionProcess }) {
  return (
    <section className="cn-section cn-process" aria-label="Process">
      <div className="cn-section-head-center" data-stagger>
        <div className="cn-section-eyebrow">{process.eyebrow}</div>
        <h2
          className="cn-section-title"
          dangerouslySetInnerHTML={{ __html: process.title_html }}
        />
      </div>

      <div className="cn-process-grid" data-stagger-cards>
        {process.steps.map((step, i) => (
          <div key={i} className="cn-process-step">
            <div className="cn-process-num">{step.num}</div>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
