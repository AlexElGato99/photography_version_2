import { SectionForm } from "@/components/dashboard/SectionForm";
import { getAbout } from "@/lib/site/fetchers";

export default async function AboutSectionPage() {
  const data = await getAbout();
  return (
    <SectionForm
      table="section_about"
      title="About Section"
      description="Studio story, quote, body paragraphs, images and founder signature."
      initialData={data}
      fields={[
        { key: "eyebrow", label: "Eyebrow", type: "text" },
        { key: "title_html", label: "Section title", type: "html", help: "Use <em> for emphasis and <br> for line breaks." },
        { key: "quote", label: "Pull quote", type: "textarea" },
        { key: "body_html", label: "Body (HTML)", type: "html", rows: 8 },
        { key: "image_main", label: "Main image", type: "image" },
        { key: "image_secondary", label: "Secondary image", type: "image" },
        { key: "badge_title", label: "Badge title", type: "text" },
        { key: "badge_subtitle", label: "Badge subtitle", type: "text" },
        { key: "signature_name", label: "Signature name", type: "text" },
        { key: "signature_role", label: "Signature role", type: "text" },
        { key: "signature_meta", label: "Signature meta", type: "text" },
      ]}
    />
  );
}
