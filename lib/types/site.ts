export type NavItem = { label: string; href: string };

export type SiteGeneral = {
  id: number;
  brand_italic: string;
  brand_bold: string;
  tagline: string;
  description: string;
  contact_email: string;
  contact_phone: string;
  address_line: string;
  address_city: string;
  hours: string;
  loader_enabled: boolean;
};

export type SiteSeo = {
  id: number;
  title: string;
  description: string;
  og_image: string | null;
  robots: string;
  schema_jsonld: Record<string, unknown>;
};

export type SiteNavigation = {
  id: number;
  cta_label: string;
  cta_href: string;
  items: NavItem[];
};

export type FooterColumn = { title: string; links: NavItem[] };
export type SiteFooter = {
  id: number;
  brand_text: string;
  copyright: string;
  columns: FooterColumn[];
  legal: NavItem[];
};

export type SiteMarquee = {
  id: number;
  items: string[];
};

export type SectionHero = {
  id: number;
  eyebrow: string;
  line_1: string;
  line_2: string;
  line_3: string;
  meta_text: string;
  cta_primary_label: string;
  cta_primary_href: string;
  cta_secondary_label: string;
  cta_secondary_href: string;
  autoplay_ms: number;
};

export type SectionAbout = {
  id: number;
  eyebrow: string;
  title_html: string;
  quote: string;
  body_html: string;
  image_main: string;
  image_secondary: string;
  badge_title: string;
  badge_subtitle: string;
  signature_name: string;
  signature_role: string;
  signature_meta: string;
};

export type SectionMeta = {
  id: number;
  eyebrow: string;
  title_html: string;
  lead?: string;
};

export type SectionPortfolioMeta = SectionMeta & { tabs: string[] };

export type StatItem = { count: number; suffix: string; label: string };
export type SectionStats = {
  id: number;
  eyebrow: string;
  title_html: string;
  lead: string;
  items: StatItem[];
};

export type ProcessStep = { num: string; title: string; text: string };
export type SectionProcess = {
  id: number;
  eyebrow: string;
  title_html: string;
  steps: ProcessStep[];
};

export type SectionInstagram = {
  id: number;
  handle: string;
  title_html: string;
  lead: string;
  profile_url: string;
};

export type SectionContact = {
  id: number;
  eyebrow: string;
  title_html: string;
  lead: string;
  services: string[];
  social: NavItem[];
};

export type HeroSlide = {
  id: string;
  position: number;
  label: string;
  image_url: string;
  alt: string;
};

export type Service = {
  id: string;
  position: number;
  number_label: string;
  icon_svg: string;
  name: string;
  description: string;
  link_label: string;
  link_href: string;
};

export type Category = {
  id: string;
  position: number;
  tag: string;
  name: string;
  image_url: string;
  link_href: string;
};

export type PortfolioItem = {
  id: string;
  position: number;
  number_label: string;
  tag: string;
  title: string;
  image_url: string;
  tab: string;
  link_href: string;
};

export type TeamMember = {
  id: string;
  position: number;
  name: string;
  role: string;
  image_url: string;
  instagram_url: string | null;
  linkedin_url: string | null;
};

export type PricingTier = {
  id: string;
  position: number;
  name: string;
  currency: string;
  amount: string;
  period: string;
  badge: string | null;
  features: string[];
  cta_label: string;
  cta_href: string;
  featured: boolean;
};

export type Testimonial = {
  id: string;
  position: number;
  stars: number;
  text: string;
  author_name: string;
  author_role: string;
  author_avatar_url: string | null;
};

export type Faq = {
  id: string;
  position: number;
  question: string;
  answer: string;
};

export type InstagramPost = {
  id: string;
  position: number;
  image_url: string;
  link_href: string;
};
