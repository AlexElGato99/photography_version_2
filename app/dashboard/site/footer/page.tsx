import { SectionForm } from "@/components/dashboard/SectionForm";
import { getFooter } from "@/lib/site/fetchers";

export default async function FooterPage() {
  const data = await getFooter();
  return (
    <SectionForm
      table="site_footer"
      title="Footer"
      description="Footer brand text, columns of links, copyright line and legal links."
      initialData={data}
      fields={[
        { key: "brand_text", label: "Brand description", type: "textarea" },
        { key: "copyright", label: "Copyright line", type: "text" },
        {
          key: "columns",
          label: "Link columns",
          type: "json",
          help: 'Array of { "title": "...", "links": [{ "label":"...","href":"..." }, ...] }.',
          rows: 14,
        },
        {
          key: "legal",
          label: "Legal links",
          type: "json",
          help: 'Array of { "label":"...","href":"..." }.',
          rows: 6,
        },
      ]}
    />
  );
}
