import { PricingEditor } from "@/components/dashboard/editors/PricingEditor";
import { getPricing, getPricingMeta } from "@/lib/site/fetchers";

export default async function PricingPage() {
  const [meta, tiers] = await Promise.all([getPricingMeta(), getPricing()]);
  return <PricingEditor meta={meta} tiers={tiers} />;
}
