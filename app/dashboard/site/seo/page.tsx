import { SectionForm } from "@/components/dashboard/SectionForm";
import { getSeo } from "@/lib/site/fetchers";

export default async function SeoPage() {
  const data = await getSeo();
  return (
    <SectionForm
      table="site_seo"
      title="SEO"
      description="Page title, meta description and crawler directives."
      initialData={data}
      fields={[
        { key: "title", label: "Page title", type: "text" },
        { key: "description", label: "Meta description", type: "textarea" },
        { key: "og_image", label: "Open Graph image URL", type: "url" },
        { key: "robots", label: "Robots directive", type: "text" },
        {
          key: "schema_jsonld",
          label: "JSON-LD schema",
          type: "json",
          rows: 10,
          help: "Structured data injected as application/ld+json.",
        },
      ]}
    />
  );
}
