import { SectionForm } from "@/components/dashboard/SectionForm";
import { getGeneral } from "@/lib/site/fetchers";

export default async function GeneralPage() {
  const data = await getGeneral();
  return (
    <SectionForm
      table="site_general"
      title="Brand & General"
      description="Brand name, tagline and global contact details used across the site."
      initialData={data}
      fields={[
        { key: "brand_italic", label: "Brand · italic part", type: "text", placeholder: "Cristina" },
        { key: "brand_bold", label: "Brand · bold part", type: "text", placeholder: "Navarro" },
        { key: "tagline", label: "Tagline", type: "text" },
        { key: "description", label: "Short description", type: "textarea" },
        { key: "contact_email", label: "Contact email", type: "email" },
        { key: "contact_phone", label: "Contact phone", type: "tel" },
        { key: "address_line", label: "Address line", type: "text" },
        { key: "address_city", label: "Address city", type: "text" },
        { key: "hours", label: "Studio hours", type: "text" },
      ]}
    />
  );
}
