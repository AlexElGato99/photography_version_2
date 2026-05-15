import { SliderEditor } from "@/components/dashboard/editors/SliderEditor";
import { getInstagramPosts } from "@/lib/site/fetchers";

export default async function SliderPage() {
  const slides = await getInstagramPosts();
  return <SliderEditor slides={slides} />;
}
