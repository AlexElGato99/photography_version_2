import { SectionForm } from "@/components/dashboard/SectionForm";
import { getProcess } from "@/lib/site/fetchers";

export default async function ProcessPage() {
  const data = await getProcess();
  return (
    <SectionForm
      table="section_process"
      title="Process Section"
      description="The four-step Discovery → Concept → Production → Delivery flow."
      initialData={data}
      fields={[
        { key: "eyebrow", label: "Eyebrow", type: "text" },
        { key: "title_html", label: "Title (HTML)", type: "html" },
        {
          key: "steps",
          label: "Steps",
          type: "json",
          help: 'Array of { "num": "01", "title": "...", "text": "..." }.',
          rows: 12,
        },
      ]}
    />
  );
}
