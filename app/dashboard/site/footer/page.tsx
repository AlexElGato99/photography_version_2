import { FooterEditor } from "@/components/dashboard/editors/FooterEditor";
import { getFooter, getFooterGalleryImages } from "@/lib/site/fetchers";

export default async function FooterPage() {
  const [footer, gallery] = await Promise.all([getFooter(), getFooterGalleryImages()]);
  return <FooterEditor footer={footer} gallery={gallery} />;
}
