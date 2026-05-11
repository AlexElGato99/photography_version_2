import { FaqEditor } from "@/components/dashboard/editors/FaqEditor";
import { getFaqMeta, getFaqs } from "@/lib/site/fetchers";

export default async function FaqPage() {
  const [meta, items] = await Promise.all([getFaqMeta(), getFaqs()]);
  return <FaqEditor meta={meta} items={items} />;
}
