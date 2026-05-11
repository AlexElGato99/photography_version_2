import { SectionForm } from "@/components/dashboard/SectionForm";
import { getContactMeta } from "@/lib/site/fetchers";

export default async function ContactSectionPage() {
  const data = await getContactMeta();
  return (
    <SectionForm
      table="section_contact"
      title="Contact Section"
      description="Heading, lead, service dropdown options and social links."
      initialData={data}
      fields={[
        { key: "eyebrow", label: "Eyebrow", type: "text" },
        { key: "title_html", label: "Title (HTML)", type: "html" },
        { key: "lead", label: "Lead paragraph", type: "textarea" },
        {
          key: "services",
          label: "Service dropdown options",
          type: "json",
          help: "Array of strings.",
          rows: 8,
        },
        {
          key: "social",
          label: "Social links",
          type: "json",
          help: 'Array of { "label":"...","href":"..." }.',
          rows: 8,
        },
      ]}
    />
  );
}
