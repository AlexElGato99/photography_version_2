import { SectionForm } from "@/components/dashboard/SectionForm";
import { getMarquee } from "@/lib/site/fetchers";

export default async function MarqueePage() {
  const data = await getMarquee();
  return (
    <SectionForm
      table="site_marquee"
      title="Marquee"
      description="The horizontally scrolling words below the hero section. Type each word and press Enter."
      initialData={data}
      fields={[
        {
          key: "items",
          label: "Marquee words",
          type: "tags",
          placeholder: "e.g. Wedding",
          help: "Each word scrolls across the marquee strip.",
        },
      ]}
    />
  );
}
