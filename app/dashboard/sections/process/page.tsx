import { SectionForm } from "@/components/dashboard/SectionForm";
import { getProcess } from "@/lib/site/fetchers";

export default async function ProcessPage() {
  const data = await getProcess();
  return (
    <SectionForm
      table="section_process"
      title="Process Section"
      description="How-we-work headline and timeline steps — edit each step with plain text; no JSON or HTML required."
      initialData={data}
      fields={[
        { key: "eyebrow", label: "Eyebrow", type: "text" },
        { key: "title_heading", label: "Section title", type: "section_heading" },
        {
          key: "steps",
          label: "Process steps",
          type: "process_steps",
          help: "Each step shows a badge (e.g. 01), a title, and a short paragraph on the public site. Reorder with the arrows.",
        },
      ]}
    />
  );
}
