import { SectionForm } from "@/components/dashboard/SectionForm";
import { getStats } from "@/lib/site/fetchers";

export default async function StatsPage() {
  const data = await getStats();
  return (
    <SectionForm
      table="section_stats"
      title="Stats Section"
      description="Eyebrow, title, lead, and stat counters — edit each number, suffix, and label without JSON."
      initialData={data}
      fields={[
        { key: "eyebrow", label: "Eyebrow", type: "text" },
        { key: "title_heading", label: "Section title", type: "section_heading" },
        { key: "lead", label: "Lead paragraph", type: "textarea", rows: 4 },
        {
          key: "items",
          label: "Counter blocks",
          type: "stat_items",
          help: "Each row is one stat on the site: the animated number, an optional suffix (e.g. +, k, yrs), and the line of text underneath.",
        },
      ]}
    />
  );
}
