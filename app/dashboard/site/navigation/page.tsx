import { SectionForm } from "@/components/dashboard/SectionForm";
import { getNavigation } from "@/lib/site/fetchers";

export default async function NavigationPage() {
  const data = await getNavigation();
  return (
    <SectionForm
      table="site_navigation"
      title="Top Navigation"
      description="Links displayed in the public site's top nav, and the primary call-to-action button."
      initialData={data}
      fields={[
        { key: "cta_label", label: "CTA button label", type: "text", placeholder: "Book a session" },
        { key: "cta_href", label: "CTA button href", type: "text", placeholder: "#contact" },
        {
          key: "items",
          label: "Navigation links",
          type: "navitems",
          help: "Drag to reorder (coming soon). Each row is one nav link.",
        },
      ]}
    />
  );
}
