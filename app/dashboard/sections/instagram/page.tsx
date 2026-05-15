import { InstagramEditor } from "@/components/dashboard/editors/InstagramEditor";
import { getInstagramMeta } from "@/lib/site/fetchers";

export default async function InstagramPage() {
  const meta = await getInstagramMeta();
  return <InstagramEditor meta={meta} />;
}
