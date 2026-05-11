import { PortfolioEditor } from "@/components/dashboard/editors/PortfolioEditor";
import { getPortfolioItems, getPortfolioMeta } from "@/lib/site/fetchers";

export default async function PortfolioPage() {
  const [meta, items] = await Promise.all([
    getPortfolioMeta(),
    getPortfolioItems(),
  ]);
  return <PortfolioEditor meta={meta} items={items} />;
}
