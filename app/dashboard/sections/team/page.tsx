import { TeamEditor } from "@/components/dashboard/editors/TeamEditor";
import { getTeam, getTeamMeta } from "@/lib/site/fetchers";

export default async function TeamPage() {
  const [meta, members] = await Promise.all([getTeamMeta(), getTeam()]);
  return <TeamEditor meta={meta} members={members} />;
}
