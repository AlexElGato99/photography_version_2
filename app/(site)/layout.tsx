import type { Metadata } from "next";
import { getSeo } from "@/lib/site/fetchers";
import "../novo-home.css";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeo();
  return {
    title: seo.title,
    description: seo.description,
    robots: seo.robots,
    openGraph: {
      title: seo.title,
      description: seo.description,
      images: seo.og_image ? [seo.og_image] : undefined,
      type: "website",
    },
  };
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <div className="cn-site">{children}</div>;
}
