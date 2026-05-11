import { HeroEditor } from "@/components/dashboard/editors/HeroEditor";
import { getHero, getHeroSlides } from "@/lib/site/fetchers";

export default async function HeroSectionPage() {
  const [hero, slides] = await Promise.all([getHero(), getHeroSlides()]);
  return <HeroEditor hero={hero} slides={slides} />;
}
