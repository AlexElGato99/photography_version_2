import type { SectionProcess } from "@/lib/types/site";
import { SectionHeading } from "@/components/site/SectionHeading";

export function Process({ process }: { process: SectionProcess }) {
  return (
    <section className="cn-section cn-process" aria-label="Process">
      <div className="cn-section-head-center" data-stagger>
        <div className="cn-section-eyebrow">{process.eyebrow}</div>
        <SectionHeading heading={process.title_heading} />
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
