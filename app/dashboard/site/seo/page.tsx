import { SectionForm } from "@/components/dashboard/SectionForm";
import { getSeo } from "@/lib/site/fetchers";

export default async function SeoPage() {
  const data = await getSeo();
  return (
    <SectionForm
      table="site_seo"
      title="SEO"
      description="Page title, meta description, Open Graph image and crawler directives."
      initialData={data}
      fields={[
        { key: "title", label: "Page title", type: "text", help: "Shown in browser tab and search results." },
        {
          key: "description",
          label: "Meta description",
          type: "textarea",
          help: "1–2 sentences summarising the page. ~155 characters recommended.",
        },
        { key: "og_image", label: "Open Graph image", type: "image", help: "Shown when the page is shared on social media. Min 1200×630px." },
        {
          key: "robots",
          label: "Robots directive",
          type: "text",
          placeholder: "index, follow",
          help: "Controls crawler indexing. Leave as 'index, follow' unless you know what you're doing.",
        },
      ]}
    />
  );
}
