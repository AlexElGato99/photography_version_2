import { SectionForm } from "@/components/dashboard/SectionForm";
import { getFooter } from "@/lib/site/fetchers";

export default async function FooterPage() {
  const data = await getFooter();
  return (
    <SectionForm
      table="site_footer"
      title="Footer"
      description="Footer brand text, link columns, copyright line and legal links."
      initialData={data}
      fields={[
        { key: "brand_text", label: "Brand description", type: "textarea" },
        { key: "copyright", label: "Copyright line", type: "text" },
        {
          key: "columns",
          label: "Link columns",
          type: "footercolumns",
        },
        {
          key: "legal",
          label: "Legal links",
          type: "navitems",
          help: "Bottom-of-footer links (Privacy Policy, Terms, etc.).",
        },
      ]}
    />
  );
}
