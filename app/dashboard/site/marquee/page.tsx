import { SectionForm } from "@/components/dashboard/SectionForm";
import { getMarquee } from "@/lib/site/fetchers";

export default async function MarqueePage() {
  const data = await getMarquee();
  return (
    <SectionForm
      table="site_marquee"
      title="Marquee"
      description="The horizontally scrolling words below the hero section."
      initialData={data}
      fields={[
        {
          key: "items",
          label: "Marquee words",
          type: "json",
          help: 'Array of strings, e.g. ["Wedding","Fashion","Editorial"].',
          rows: 8,
        },
      ]}
    />
  );
}
