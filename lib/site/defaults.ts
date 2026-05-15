import type {
  Category,
  Faq,
  FooterColumn,
  HeroSlide,
  InstagramPost,
  NavItem,
  PortfolioItem,
  SectionAbout,
  SectionContact,
  SectionHero,
  SectionInstagram,
  SectionMeta,
  SectionPortfolioMeta,
  SectionProcess,
  SectionStats,
  Service,
  SiteFooter,
  SiteGeneral,
  SiteMarquee,
  SiteNavigation,
  SiteSeo,
  TeamMember,
  Testimonial,
} from "@/lib/types/site";
import { titleHeadingFromLegacyHtml } from "@/lib/site/title-heading";

const th = (html: string) => titleHeadingFromLegacyHtml(html);

export const defaultGeneral: SiteGeneral = {
  id: 1,
  brand_italic: "Cristina",
  brand_bold: "Navarro",
  tagline: "Photography Studio · Murcia, Spain",
  description:
    "A premium photography agency crafting timeless visual stories for brands, weddings, and editorial work since 2018.",
  contact_email: "hola@cristinanavarro.studio",
  contact_phone: "+34 600 000 000",
  address_line: "Calle de la Luna, 14",
  address_city: "Murcia · Spain",
  hours: "Monday – Friday · 9:00 – 18:00",
  loader_enabled: true,
};

export const defaultSeo: SiteSeo = {
  id: 1,
  title:
    "Cristina Navarro Studio · Premium Photography Agency · Murcia",
  description:
    "Cristina Navarro Studio · Premium photography agency in Murcia. Wedding, fashion, editorial, commercial, lifestyle.",
  og_image: null,
  robots: "index, follow, max-snippet:-1, max-image-preview:large",
  schema_jsonld: {},
};

export const defaultNavigation: SiteNavigation = {
  id: 1,
  cta_label: "Book a session",
  cta_href: "#contact",
  items: [
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Explore by category", href: "#categories" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Contact", href: "#contact" },
  ],
};

const footerColumns: FooterColumn[] = [
  {
    title: "Studio",
    links: [
      { label: "About us", href: "#about" },
      { label: "Services", href: "#services" },
      { label: "Portfolio", href: "#portfolio" },
      { label: "Explore by category", href: "#categories" },
    ],
  },
  {
    title: "Categories",
    links: [
      { label: "Wedding", href: "#" },
      { label: "Fashion", href: "#" },
      { label: "Commercial", href: "#" },
      { label: "Lifestyle", href: "#" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "hola@cristinanavarro.studio", href: "mailto:hola@cristinanavarro.studio" },
      { label: "+34 600 000 000", href: "tel:+34600000000" },
      { label: "Calle de la Luna 14, Murcia", href: "#" },
      { label: "Instagram", href: "#" },
    ],
  },
];

export const defaultFooter: SiteFooter = {
  id: 1,
  brand_text:
    "A premium photography agency based in Murcia, Spain. Crafting timeless visual stories since 2018.",
  copyright: "© 2026 Cristina Navarro Studio · All rights reserved",
  columns: footerColumns,
  legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Cookies", href: "#" },
  ],
};

export const defaultMarquee: SiteMarquee = {
  id: 1,
  items: ["Wedding", "Fashion", "Editorial", "Lifestyle", "Commercial", "Events"],
};

export const defaultHero: SectionHero = {
  id: 1,
  eyebrow: "Photography Studio · Murcia, Spain",
  line_1: "Stories told",
  line_2_prefix: "through ",
  line_2_em: "light",
  line_2_suffix: "",
  line_3: "and emotion",
  meta_text:
    "A premium photography agency crafting timeless visual stories for brands, weddings, and editorial work since 2018.",
  cta_primary_label: "Explore portfolio",
  cta_primary_href: "#portfolio",
  cta_secondary_label: "Start a project",
  cta_secondary_href: "#contact",
  autoplay_ms: 6000,
};

export const defaultAbout: SectionAbout = {
  id: 1,
  eyebrow: "About the studio",
  title_heading: th("Crafting visual<br>stories with <em>soul</em>"),
  quote:
    "<p>Photography is not about capturing what you see — it's about <em>revealing</em> what others feel.</p>",
  body_html:
    "<p>Cristina Navarro Studio is a creative photography agency based in Murcia, Spain. For over <b>8 years</b>, we've been creating timeless imagery for international brands, couples, and editorial publications.</p><p>Our approach blends classical composition with contemporary storytelling — every frame is intentional, every detail considered. We believe great photography starts with great relationships.</p>",
  image_main:
    "https://images.unsplash.com/photo-1554941426-cc88c91c9bbf?w=1200&q=80&auto=format&fit=crop",
  image_secondary:
    "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600&q=80&auto=format&fit=crop",
  badge_title: "5.0 Rating",
  badge_subtitle: "Based on 200+ projects",
  signature_name: "Cristina N.",
  signature_role: "Founder & Lead Photographer",
  signature_meta: "Estudio Murcia · est. 2018",
};

export const defaultServicesMeta: SectionMeta = {
  id: 1,
  eyebrow: "Our services",
  title_heading: th("What we<br><em>create</em>"),
  lead: "From intimate weddings to international fashion editorials, we bring a refined eye and meticulous craft to every project.",
};

export const defaultCategoriesMeta: SectionMeta = {
  id: 1,
  eyebrow: "Categories",
  title_heading: th("Explore by <em>category</em>"),
};

export const defaultPortfolioMeta: SectionPortfolioMeta = {
  id: 1,
  eyebrow: "Selected work",
  title_heading: th("Featured <em>portfolio</em>"),
  lead: "A curated selection of recent projects across weddings, fashion, and brand storytelling.",
  tabs: ["All", "Wedding", "Fashion", "Commercial", "Lifestyle"],
};

export const defaultStats: SectionStats = {
  id: 1,
  eyebrow: "Achievements",
  title_heading: th("Numbers that<br>tell a <em>story</em>"),
  lead:
    "Eight years of dedicated craftsmanship, hundreds of stories told, and countless moments preserved.",
  items: [
    { count: 240, suffix: "+", label: "Projects completed across weddings, brands and editorials" },
    { count: 85, suffix: "+", label: "Brands trusted us with their visual identity" },
    { count: 32, suffix: "k", label: "Photographs delivered to satisfied clients" },
    { count: 8, suffix: "yrs", label: "Of refining craft and creative vision" },
  ],
};

export const defaultProcess: SectionProcess = {
  id: 1,
  eyebrow: "How we work",
  title_heading: th("A <em>refined</em> process"),
  steps: [
    { num: "01", title: "Discovery", text: "We start with a conversation — understanding your vision, story, and the emotion you want captured." },
    { num: "02", title: "Concept", text: "A tailored creative direction with mood boards, location scouting, and detailed shot planning." },
    { num: "03", title: "Production", text: "The shoot day, executed with care, calm energy, and full attention to every meaningful detail." },
    { num: "04", title: "Delivery", text: "Hand-edited, color-graded final images delivered through a private gallery within two weeks." },
  ],
};

export const defaultTeamMeta: SectionMeta = {
  id: 1,
  eyebrow: "The team",
  title_heading: th("Meet the<br><em>creators</em>"),
  lead: "A small, passionate team united by craft and an unwavering pursuit of beautiful imagery.",
};

export const defaultTestimonialsMeta: SectionMeta = {
  id: 1,
  eyebrow: "Kind words",
  title_heading: th("Trusted by <em>brands</em><br>and couples worldwide"),
};

export const defaultInstagramMeta: SectionInstagram = {
  id: 1,
  handle: "@cristinanavarro_studio",
  title_heading: th("Follow our <em>journey</em>"),
  lead: "Behind-the-scenes, latest work and creative inspiration on Instagram.",
  profile_url: "#",
};

export const defaultFaqMeta: SectionMeta = {
  id: 1,
  eyebrow: "Frequently asked",
  title_heading: th("Questions <em>answered</em>"),
};

export const defaultContactMeta: SectionContact = {
  id: 1,
  eyebrow: "Let's talk",
  title_heading: th("Begin your <em>story</em>"),
  lead: "Tell us about your project and we'll get back to you within 24 hours.",
  services: [
    "Wedding photography",
    "Fashion / Editorial",
    "Commercial / Brand",
    "Event coverage",
    "Lifestyle / Family",
    "Other",
  ],
  social: [
    { label: "Instagram", href: "#" },
    { label: "LinkedIn", href: "#" },
    { label: "Behance", href: "#" },
    { label: "Pinterest", href: "#" },
  ],
};

export const defaultHeroSlides: HeroSlide[] = [
  { id: "1", position: 0, label: "01 · Wedding", image_url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=2000&q=80&auto=format&fit=crop", alt: "Wedding" },
  { id: "2", position: 1, label: "02 · Fashion", image_url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=2000&q=80&auto=format&fit=crop", alt: "Fashion" },
  { id: "3", position: 2, label: "03 · Lifestyle", image_url: "https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?w=2000&q=80&auto=format&fit=crop", alt: "Lifestyle" },
  { id: "4", position: 3, label: "04 · Commercial", image_url: "https://images.unsplash.com/photo-1522335789203-aaa455a47f3a?w=2000&q=80&auto=format&fit=crop", alt: "Commercial" },
  { id: "5", position: 4, label: "05 · Events", image_url: "https://images.unsplash.com/photo-1530023367847-a683933f4172?w=2000&q=80&auto=format&fit=crop", alt: "Events" },
];

const heartIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`;
const sparkleIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2zM5 3v4M3 5h4M19 17v4M17 19h4"/></svg>`;
const cameraIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="4"/></svg>`;
const usersIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
const sunIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`;
const buildingIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M3 9h18M3 15h18"/></svg>`;

export const defaultServices: Service[] = [
  { id: "1", position: 0, number_label: "— 01", icon_svg: heartIcon, name: "Wedding Photography", description: "Documentary-style storytelling for couples who value authenticity, emotion and timeless elegance.", link_label: "Discover", link_href: "#" },
  { id: "2", position: 1, number_label: "— 02", icon_svg: sparkleIcon, name: "Fashion & Editorial", description: "Bold visual language for fashion brands, magazines, and lookbooks with cinematic art direction.", link_label: "Discover", link_href: "#" },
  { id: "3", position: 2, number_label: "— 03", icon_svg: cameraIcon, name: "Commercial & Brand", description: "Premium product, packaging, and brand imagery that elevates your story across every touchpoint.", link_label: "Discover", link_href: "#" },
  { id: "4", position: 3, number_label: "— 04", icon_svg: usersIcon, name: "Event Coverage", description: "Cinematic event photography for galas, launches, and corporate gatherings with editorial polish.", link_label: "Discover", link_href: "#" },
  { id: "5", position: 4, number_label: "— 05", icon_svg: sunIcon, name: "Lifestyle & Family", description: "Natural, light-filled portraits that capture genuine moments and the beauty of everyday life.", link_label: "Discover", link_href: "#" },
  { id: "6", position: 5, number_label: "— 06", icon_svg: buildingIcon, name: "Interior & Architecture", description: "Spaces captured with sensitivity to light, proportion and atmosphere — for hotels, restaurants and design studios.", link_label: "Discover", link_href: "#" },
];

export const defaultCategories: Category[] = [
  {
    id: "1",
    position: 0,
    tag: "Featured",
    name: "Wedding",
    slug: "wedding",
    image_url:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80&auto=format&fit=crop",
    link_href: "#",
    page_eyebrow: "Portfolio · Wedding",
    page_heading: th("Timeless <em>wedding</em> imagery"),
    page_meta_title: "",
    page_meta_description: "",
    page_lead:
      "From intimate ceremonies to grand celebrations — editorial lighting, honest emotion, and artful composition.",
    page_body_html:
      '<p class="cn-about-body">Every couple receives a tailored experience: mood boards, timeline guidance, and a calm presence on the day. Our editing favours natural skin tones, rich blacks, and film-inspired softness.</p>',
    gallery_images: [
      {
        image_url:
          "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1200&q=80&auto=format&fit=crop",
        caption: "Al fresco vows",
        alt: "Outdoor wedding ceremony",
      },
      {
        image_url:
          "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80&auto=format&fit=crop",
        caption: "Golden hour portraits",
        alt: "Bride and groom portrait",
      },
      {
        image_url:
          "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=80&auto=format&fit=crop",
        caption: "Reception light",
        alt: "Wedding reception",
      },
    ],
    show_portfolio_related: true,
  },
  {
    id: "2",
    position: 1,
    tag: "Editorial",
    name: "Fashion",
    slug: "fashion",
    image_url:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1200&q=80&auto=format&fit=crop",
    link_href: "#",
    page_eyebrow: "Portfolio · Fashion",
    page_heading: th("Editorial & <em>fashion</em>"),
    page_meta_title: "",
    page_meta_description: "",
    page_lead: "Campaigns, lookbooks, and magazine work with cinematic art direction.",
    page_body_html: "",
    gallery_images: [],
    show_portfolio_related: true,
  },
  {
    id: "3",
    position: 2,
    tag: "Live",
    name: "Events",
    slug: "events",
    image_url:
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=600&q=80&auto=format&fit=crop",
    link_href: "#",
    page_eyebrow: "Portfolio · Events",
    page_heading: th("Live <em>event</em> coverage"),
    page_meta_title: "",
    page_meta_description: "",
    page_lead: "Galas, launches, and celebrations captured with editorial polish.",
    page_body_html: "",
    gallery_images: [],
    show_portfolio_related: true,
  },
  {
    id: "4",
    position: 3,
    tag: "Brand",
    name: "Commercial",
    slug: "commercial",
    image_url:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=900&q=80&auto=format&fit=crop",
    link_href: "#",
    page_eyebrow: "Portfolio · Commercial",
    page_heading: th("Brand & <em>commercial</em>"),
    page_meta_title: "",
    page_meta_description: "",
    page_lead: "Product, packaging, and campaign imagery for modern brands.",
    page_body_html: "",
    gallery_images: [],
    show_portfolio_related: true,
  },
  {
    id: "5",
    position: 4,
    tag: "Outdoors",
    name: "Lifestyle",
    slug: "lifestyle",
    image_url:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&q=80&auto=format&fit=crop",
    link_href: "#",
    page_eyebrow: "Portfolio · Lifestyle",
    page_heading: th("Natural <em>lifestyle</em>"),
    page_meta_title: "",
    page_meta_description: "",
    page_lead: "Light-filled stories of people and places.",
    page_body_html: "",
    gallery_images: [],
    show_portfolio_related: true,
  },
  {
    id: "6",
    position: 5,
    tag: "Spaces",
    name: "Interiors",
    slug: "interiors",
    image_url:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=80&auto=format&fit=crop",
    link_href: "#",
    page_eyebrow: "Portfolio · Interiors",
    page_heading: th("Interior <em>architecture</em>"),
    page_meta_title: "",
    page_meta_description: "",
    page_lead: "Hotels, restaurants, and residential spaces with sensitivity to light.",
    page_body_html: "",
    gallery_images: [],
    show_portfolio_related: true,
  },
  {
    id: "7",
    position: 6,
    tag: "Personal",
    name: "Portraits",
    slug: "portraits",
    image_url:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&q=80&auto=format&fit=crop",
    link_href: "#",
    page_eyebrow: "Portfolio · Portraits",
    page_heading: th("Portrait <em>sessions</em>"),
    page_meta_title: "",
    page_meta_description: "",
    page_lead: "Editorial portraits with warmth and clarity.",
    page_body_html: "",
    gallery_images: [],
    show_portfolio_related: true,
  },
];

export const defaultPortfolio: PortfolioItem[] = [
  { id: "1", position: 0, number_label: "— 01", tag: "Wedding", title: "Sofia & Daniel", image_url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=900&q=80&auto=format&fit=crop", tab: "Wedding", link_href: "#" },
  { id: "2", position: 1, number_label: "— 02", tag: "Fashion", title: "Editorial Spring", image_url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&q=80&auto=format&fit=crop", tab: "Fashion", link_href: "#" },
  { id: "3", position: 2, number_label: "— 03", tag: "Commercial", title: "Tahe Cosmetics", image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=80&auto=format&fit=crop", tab: "Commercial", link_href: "#" },
  { id: "4", position: 3, number_label: "— 04", tag: "Lifestyle", title: "Golden Hour", image_url: "https://images.unsplash.com/photo-1517438476312-10d79c077509?w=900&q=80&auto=format&fit=crop", tab: "Lifestyle", link_href: "#" },
  { id: "5", position: 4, number_label: "— 05", tag: "Events", title: "Annual Gala 2025", image_url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=900&q=80&auto=format&fit=crop", tab: "All", link_href: "#" },
  { id: "6", position: 5, number_label: "— 06", tag: "Interiors", title: "Casa Mediterránea", image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80&auto=format&fit=crop", tab: "All", link_href: "#" },
];

export const defaultTeam: TeamMember[] = [
  { id: "1", position: 0, name: "Cristina Navarro", role: "Founder · Lead Photographer", image_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&q=80&auto=format&fit=crop", instagram_url: "#", linkedin_url: "#" },
  { id: "2", position: 1, name: "Marco Velez", role: "Senior Photographer", image_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80&auto=format&fit=crop", instagram_url: "#", linkedin_url: "#" },
  { id: "3", position: 2, name: "Lucia Reyes", role: "Art Director", image_url: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&q=80&auto=format&fit=crop", instagram_url: "#", linkedin_url: "#" },
  { id: "4", position: 3, name: "Diego Ortiz", role: "Post-Production Lead", image_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80&auto=format&fit=crop", instagram_url: "#", linkedin_url: "#" },
];

export const defaultTestimonials: Testimonial[] = [
  { id: "1", position: 0, stars: 5, text: "Cristina's eye for emotion is unmatched. Every photograph feels like a moment frozen in poetry — exactly what we dreamed our wedding album would look like.", author_name: "Sofia & Daniel", author_role: "Wedding · Costa Cálida", author_avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80&auto=format&fit=crop" },
  { id: "2", position: 1, stars: 5, text: "Working with the studio felt effortless. Their visuals elevated our brand campaign to a level we couldn't have imagined. Truly world-class.", author_name: "María Alonso", author_role: "Marketing Director · Tahe", author_avatar_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80&auto=format&fit=crop" },
  { id: "3", position: 2, stars: 5, text: "The editorial work for our magazine was beyond expectations. Cinematic, refined, and deeply intentional. We've booked them for three more issues.", author_name: "Laura Prieto", author_role: "Editor · Atelier Magazine", author_avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80&auto=format&fit=crop" },
];

export const defaultFaqs: Faq[] = [
  { id: "1", position: 0, question: "How far in advance should I book my session?", answer: "For weddings, we recommend booking 6-12 months in advance. For brand and editorial work, 4-6 weeks. Last-minute requests are sometimes possible — contact us to check availability." },
  { id: "2", position: 1, question: "Do you travel for shoots?", answer: "Absolutely. We work nationally and internationally. Travel and accommodation costs are added transparently to your custom quote." },
  { id: "3", position: 2, question: "What's included in the final delivery?", answer: "You receive hand-edited, color-graded high-resolution images via a private online gallery. Print release and commercial usage rights are included depending on your package." },
  { id: "4", position: 3, question: "How long until I receive my photos?", answer: "Standard delivery is 10-14 days. For weddings, we provide a sneak peek within 48 hours, and full galleries within 4 weeks during peak season." },
  { id: "5", position: 4, question: "Can we customize a package?", answer: "Yes — every project is unique. We're happy to build a tailored package based on your vision, scope, and timeline. Get in touch for a custom quote." },
];

export const defaultInstagramPosts: InstagramPost[] = [
  { id: "1", position: 0, image_url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80&auto=format&fit=crop", link_href: "#" },
  { id: "2", position: 1, image_url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80&auto=format&fit=crop", link_href: "#" },
  { id: "3", position: 2, image_url: "https://images.unsplash.com/photo-1522335789203-aaa455a47f3a?w=400&q=80&auto=format&fit=crop", link_href: "#" },
  { id: "4", position: 3, image_url: "https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?w=400&q=80&auto=format&fit=crop", link_href: "#" },
  { id: "5", position: 4, image_url: "https://images.unsplash.com/photo-1530023367847-a683933f4172?w=400&q=80&auto=format&fit=crop", link_href: "#" },
  { id: "6", position: 5, image_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80&auto=format&fit=crop", link_href: "#" },
];
