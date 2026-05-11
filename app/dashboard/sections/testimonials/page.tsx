import { TestimonialsEditor } from "@/components/dashboard/editors/TestimonialsEditor";
import { getTestimonials, getTestimonialsMeta } from "@/lib/site/fetchers";

export default async function TestimonialsPage() {
  const [meta, items] = await Promise.all([
    getTestimonialsMeta(),
    getTestimonials(),
  ]);
  return <TestimonialsEditor meta={meta} items={items} />;
}
