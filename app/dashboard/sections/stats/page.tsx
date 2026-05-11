import { SectionForm } from "@/components/dashboard/SectionForm";
import { getStats } from "@/lib/site/fetchers";

export default async function StatsPage() {
  const data = await getStats();
  return (
    <SectionForm
      table="section_stats"
      title="Stats Section"
      description="The four animated counters."
      initialData={data}
      fields={[
        { key: "eyebrow", label: "Eyebrow", type: "text" },
        { key: "title_html", label: "Title (HTML)", type: "html" },
        { key: "lead", label: "Lead paragraph", type: "textarea" },
        {
          key: "items",
          label: "Stat items",
          type: "json",
          help: 'Array of { "count": 240, "suffix": "+", "label": "..." }.',
          rows: 10,
        },
      ]}
    />
  );
}
