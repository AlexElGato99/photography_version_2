import { ServicesEditor } from "@/components/dashboard/editors/ServicesEditor";
import { getServices, getServicesMeta } from "@/lib/site/fetchers";

export default async function ServicesPage() {
  const [meta, services] = await Promise.all([getServicesMeta(), getServices()]);
  return <ServicesEditor meta={meta} services={services} />;
}
