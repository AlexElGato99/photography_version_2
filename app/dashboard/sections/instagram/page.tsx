import { InstagramEditor } from "@/components/dashboard/editors/InstagramEditor";
import { getInstagramMeta, getInstagramPosts } from "@/lib/site/fetchers";

export default async function InstagramPage() {
  const [meta, posts] = await Promise.all([
    getInstagramMeta(),
    getInstagramPosts(),
  ]);
  return <InstagramEditor meta={meta} posts={posts} />;
}
