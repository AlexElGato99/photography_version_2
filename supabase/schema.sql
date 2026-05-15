-- ============================================================
-- Cristina Navarro Studio — Photography Agency CMS schema
-- Run this in the Supabase SQL editor (one-time setup).
-- ============================================================

-- Helper: updated_at trigger
create or replace function public.tg_set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- ============================================================
-- SITE-LEVEL SINGLETONS (always id = 1)
-- ============================================================

create table if not exists public.site_general (
  id smallint primary key default 1,
  brand_italic text not null default 'Cristina',
  brand_bold text not null default 'Navarro',
  tagline text not null default 'Photography Studio · Murcia, Spain',
  description text not null default 'A premium photography agency crafting timeless visual stories for brands, weddings, and editorial work since 2018.',
  contact_email text not null default 'hola@cristinanavarro.studio',
  contact_phone text not null default '+34 600 000 000',
  address_line text not null default 'Calle de la Luna, 14',
  address_city text not null default 'Murcia · Spain',
  hours text not null default 'Monday – Friday · 9:00 – 18:00',
  loader_enabled boolean not null default true,
  updated_at timestamptz not null default now(),
  constraint site_general_singleton check (id = 1)
);

create table if not exists public.site_seo (
  id smallint primary key default 1,
  title text not null default 'Cristina Navarro Studio · Premium Photography Agency · Murcia',
  description text not null default 'Cristina Navarro Studio · Premium photography agency in Murcia. Wedding, fashion, editorial, commercial, lifestyle.',
  og_image text,
  robots text not null default 'index, follow, max-snippet:-1, max-image-preview:large',
  schema_jsonld jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint site_seo_singleton check (id = 1)
);

create table if not exists public.site_navigation (
  id smallint primary key default 1,
  cta_label text not null default 'Book a session',
  cta_href text not null default '#contact',
  items jsonb not null default '[
    {"label":"About","href":"#about"},
    {"label":"Services","href":"#services"},
    {"label":"Categories","href":"#categories"},
    {"label":"Portfolio","href":"#portfolio"},
    {"label":"Contact","href":"#contact"}
  ]'::jsonb,
  updated_at timestamptz not null default now(),
  constraint site_navigation_singleton check (id = 1)
);

create table if not exists public.site_footer (
  id smallint primary key default 1,
  brand_text text not null default 'A premium photography agency based in Murcia, Spain. Crafting timeless visual stories since 2018.',
  copyright text not null default '© 2026 Cristina Navarro Studio · All rights reserved',
  columns jsonb not null default '[
    {"title":"Studio","links":[
      {"label":"About us","href":"#about"},
      {"label":"Services","href":"#services"},
      {"label":"Portfolio","href":"#portfolio"}
    ]},
    {"title":"Categories","links":[
      {"label":"Wedding","href":"#"},
      {"label":"Fashion","href":"#"},
      {"label":"Commercial","href":"#"},
      {"label":"Lifestyle","href":"#"}
    ]},
    {"title":"Contact","links":[
      {"label":"hola@cristinanavarro.studio","href":"mailto:hola@cristinanavarro.studio"},
      {"label":"+34 600 000 000","href":"tel:+34600000000"},
      {"label":"Calle de la Luna 14, Murcia","href":"#"},
      {"label":"Instagram","href":"#"}
    ]}
  ]'::jsonb,
  legal jsonb not null default '[
    {"label":"Privacy","href":"#"},
    {"label":"Terms","href":"#"},
    {"label":"Cookies","href":"#"}
  ]'::jsonb,
  pages_heading text not null default 'Pages',
  contact_heading text not null default 'Contact',
  gallery_heading text not null default 'Latest photos',
  use_category_pages boolean not null default true,
  pages_links jsonb not null default '[]'::jsonb,
  show_phone boolean not null default true,
  show_email boolean not null default true,
  show_address boolean not null default true,
  show_hours boolean not null default true,
  updated_at timestamptz not null default now(),
  constraint site_footer_singleton check (id = 1)
);

create table if not exists public.footer_gallery_images (
  id uuid primary key default gen_random_uuid(),
  position integer not null default 0,
  image_url text not null,
  link_href text not null default '#',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_marquee (
  id smallint primary key default 1,
  items jsonb not null default '["Wedding","Fashion","Editorial","Lifestyle","Commercial","Events"]'::jsonb,
  updated_at timestamptz not null default now(),
  constraint site_marquee_singleton check (id = 1)
);

-- ============================================================
-- SECTION SINGLETONS
-- ============================================================

create table if not exists public.section_hero (
  id smallint primary key default 1,
  eyebrow text not null default 'Photography Studio · Murcia, Spain',
  line_1 text not null default 'Stories told',
  line_2_prefix text not null default 'through ',
  line_2_em text not null default 'light',
  line_2_suffix text not null default '',
  line_3 text not null default 'and emotion',
  meta_text text not null default 'A premium photography agency crafting timeless visual stories for brands, weddings, and editorial work since 2018.',
  cta_primary_label text not null default 'Explore portfolio',
  cta_primary_href text not null default '#portfolio',
  cta_secondary_label text not null default 'Start a project',
  cta_secondary_href text not null default '#contact',
  autoplay_ms integer not null default 6000,
  updated_at timestamptz not null default now(),
  constraint section_hero_singleton check (id = 1)
);

create table if not exists public.section_about (
  id smallint primary key default 1,
  eyebrow text not null default 'About the studio',
  title_heading jsonb not null default '{"v":1,"line1":"Crafting visual","mid":"stories with","em":"soul","tail":"","breakAfterLine1":true,"line2":""}'::jsonb,
  quote text not null default 'Photography is not about capturing what you see — it''s about <em>revealing</em> what others feel.',
  body_html text not null default '<p>Cristina Navarro Studio is a creative photography agency based in Murcia, Spain. For over <b>8 years</b>, we''ve been creating timeless imagery for international brands, couples, and editorial publications.</p><p>Our approach blends classical composition with contemporary storytelling — every frame is intentional, every detail considered. We believe great photography starts with great relationships.</p>',
  image_main text not null default 'https://images.unsplash.com/photo-1554941426-cc88c91c9bbf?w=1200&q=80&auto=format&fit=crop',
  image_secondary text not null default 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600&q=80&auto=format&fit=crop',
  badge_title text not null default '5.0 Rating',
  badge_subtitle text not null default 'Based on 200+ projects',
  signature_name text not null default 'Cristina N.',
  signature_role text not null default 'Founder & Lead Photographer',
  signature_meta text not null default 'Estudio Murcia · est. 2018',
  updated_at timestamptz not null default now(),
  constraint section_about_singleton check (id = 1)
);

create table if not exists public.section_services_meta (
  id smallint primary key default 1,
  eyebrow text not null default 'Our services',
  title_heading jsonb not null default '{"v":1,"line1":"What we","mid":"","em":"create","tail":"","breakAfterLine1":true,"line2":""}'::jsonb,
  lead text not null default 'From intimate weddings to international fashion editorials, we bring a refined eye and meticulous craft to every project.',
  updated_at timestamptz not null default now(),
  constraint section_services_meta_singleton check (id = 1)
);

create table if not exists public.section_categories_meta (
  id smallint primary key default 1,
  eyebrow text not null default 'Categories',
  title_heading jsonb not null default '{"v":1,"line1":"Explore by ","mid":"","em":"category","tail":"","breakAfterLine1":false,"line2":""}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint section_categories_meta_singleton check (id = 1)
);

create table if not exists public.section_portfolio_meta (
  id smallint primary key default 1,
  eyebrow text not null default 'Selected work',
  title_heading jsonb not null default '{"v":1,"line1":"Featured ","mid":"","em":"portfolio","tail":"","breakAfterLine1":false,"line2":""}'::jsonb,
  lead text not null default 'A curated selection of recent projects across weddings, fashion, and brand storytelling.',
  tabs jsonb not null default '["All","Wedding","Fashion","Commercial","Lifestyle"]'::jsonb,
  updated_at timestamptz not null default now(),
  constraint section_portfolio_meta_singleton check (id = 1)
);

create table if not exists public.section_stats (
  id smallint primary key default 1,
  eyebrow text not null default 'Achievements',
  title_heading jsonb not null default '{"v":1,"line1":"Numbers that","mid":"tell a ","em":"story","tail":"","breakAfterLine1":true,"line2":""}'::jsonb,
  lead text not null default 'Eight years of dedicated craftsmanship, hundreds of stories told, and countless moments preserved.',
  items jsonb not null default '[
    {"count":240,"suffix":"+","label":"Projects completed across weddings, brands and editorials"},
    {"count":85,"suffix":"+","label":"Brands trusted us with their visual identity"},
    {"count":32,"suffix":"k","label":"Photographs delivered to satisfied clients"},
    {"count":8,"suffix":"yrs","label":"Of refining craft and creative vision"}
  ]'::jsonb,
  updated_at timestamptz not null default now(),
  constraint section_stats_singleton check (id = 1)
);

create table if not exists public.section_process (
  id smallint primary key default 1,
  eyebrow text not null default 'How we work',
  title_heading jsonb not null default '{"v":1,"line1":"A ","mid":"","em":"refined","tail":" process","breakAfterLine1":false,"line2":""}'::jsonb,
  steps jsonb not null default '[
    {"num":"01","title":"Discovery","text":"We start with a conversation — understanding your vision, story, and the emotion you want captured."},
    {"num":"02","title":"Concept","text":"A tailored creative direction with mood boards, location scouting, and detailed shot planning."},
    {"num":"03","title":"Production","text":"The shoot day, executed with care, calm energy, and full attention to every meaningful detail."},
    {"num":"04","title":"Delivery","text":"Hand-edited, color-graded final images delivered through a private gallery within two weeks."}
  ]'::jsonb,
  updated_at timestamptz not null default now(),
  constraint section_process_singleton check (id = 1)
);

create table if not exists public.section_team_meta (
  id smallint primary key default 1,
  eyebrow text not null default 'The team',
  title_heading jsonb not null default '{"v":1,"line1":"Meet the","mid":"","em":"creators","tail":"","breakAfterLine1":true,"line2":""}'::jsonb,
  lead text not null default 'A small, passionate team united by craft and an unwavering pursuit of beautiful imagery.',
  updated_at timestamptz not null default now(),
  constraint section_team_meta_singleton check (id = 1)
);

create table if not exists public.section_testimonials_meta (
  id smallint primary key default 1,
  eyebrow text not null default 'Kind words',
  title_heading jsonb not null default '{"v":1,"line1":"Trusted by ","mid":"","em":"brands","tail":"","breakAfterLine1":false,"line2":"and couples worldwide"}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint section_testimonials_meta_singleton check (id = 1)
);

create table if not exists public.section_instagram (
  id smallint primary key default 1,
  handle text not null default '@cristinanavarro_studio',
  title_heading jsonb not null default '{"v":1,"line1":"Follow our ","mid":"","em":"journey","tail":"","breakAfterLine1":false,"line2":""}'::jsonb,
  lead text not null default 'Behind-the-scenes, latest work and creative inspiration on Instagram.',
  profile_url text not null default '#',
  updated_at timestamptz not null default now(),
  constraint section_instagram_singleton check (id = 1)
);

create table if not exists public.section_faq_meta (
  id smallint primary key default 1,
  eyebrow text not null default 'Frequently asked',
  title_heading jsonb not null default '{"v":1,"line1":"Questions ","mid":"","em":"answered","tail":"","breakAfterLine1":false,"line2":""}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint section_faq_meta_singleton check (id = 1)
);

create table if not exists public.section_contact (
  id smallint primary key default 1,
  eyebrow text not null default 'Let''s talk',
  title_heading jsonb not null default '{"v":1,"line1":"Begin your ","mid":"","em":"story","tail":"","breakAfterLine1":false,"line2":""}'::jsonb,
  lead text not null default 'Tell us about your project and we''ll get back to you within 24 hours.',
  services jsonb not null default '["Wedding photography","Fashion / Editorial","Commercial / Brand","Event coverage","Lifestyle / Family","Other"]'::jsonb,
  social jsonb not null default '[
    {"label":"Instagram","href":"#"},
    {"label":"LinkedIn","href":"#"},
    {"label":"Behance","href":"#"},
    {"label":"Pinterest","href":"#"}
  ]'::jsonb,
  updated_at timestamptz not null default now(),
  constraint section_contact_singleton check (id = 1)
);

-- ============================================================
-- COLLECTIONS
-- ============================================================

create table if not exists public.hero_slides (
  id uuid primary key default gen_random_uuid(),
  position integer not null default 0,
  label text not null,
  image_url text not null,
  alt text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  position integer not null default 0,
  number_label text not null default '— 01',
  icon_svg text not null,
  name text not null,
  description text not null,
  link_label text not null default 'Discover',
  link_href text not null default '#',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  position integer not null default 0,
  tag text not null default 'Featured',
  name text not null,
  slug text not null default '',
  image_url text not null,
  link_href text not null default '#',
  page_eyebrow text not null default '',
  page_heading jsonb not null default '{}'::jsonb,
  page_meta_title text not null default '',
  page_meta_description text not null default '',
  page_lead text not null default '',
  page_body_html text not null default '',
  gallery_images jsonb not null default '[]'::jsonb,
  show_portfolio_related boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists categories_slug_unique on public.categories (slug)
  where length(trim(slug)) > 0;

create table if not exists public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  position integer not null default 0,
  number_label text not null default '— 01',
  tag text not null,
  title text not null,
  image_url text not null,
  tab text not null default 'All',
  link_href text not null default '#',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  position integer not null default 0,
  name text not null,
  role text not null,
  image_url text not null,
  instagram_url text,
  linkedin_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  position integer not null default 0,
  stars smallint not null default 5,
  text text not null,
  author_name text not null,
  author_role text not null,
  author_avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  position integer not null default 0,
  question text not null,
  answer text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.instagram_posts (
  id uuid primary key default gen_random_uuid(),
  position integer not null default 0,
  image_url text not null,
  link_href text not null default '#',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.section_pricing_meta (
  id smallint primary key default 1,
  eyebrow text not null default 'Investment',
  title_heading jsonb not null default '{}'::jsonb,
  lead text not null default '',
  updated_at timestamptz not null default now(),
  constraint section_pricing_meta_singleton check (id = 1)
);

create table if not exists public.pricing_tiers (
  id uuid primary key default gen_random_uuid(),
  position integer not null default 0,
  name text not null,
  currency text not null default '€',
  amount text not null,
  period text not null default '',
  badge text,
  features jsonb not null default '[]'::jsonb,
  cta_label text not null default 'Get started',
  cta_href text not null default '#contact',
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Contact submissions (public form drops here)
create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text,
  email text not null,
  phone text,
  service text,
  message text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================
-- updated_at triggers (skip contact_submissions / collections optional)
-- ============================================================
do $$
declare t text;
begin
  for t in select unnest(array[
    'site_general','site_seo','site_navigation','site_footer','site_marquee',
    'section_hero','section_about','section_services_meta','section_categories_meta',
    'section_portfolio_meta','section_pricing_meta','section_stats','section_process','section_team_meta',
    'section_testimonials_meta','section_instagram',
    'section_faq_meta','section_contact',
    'hero_slides','services','categories','portfolio_items','pricing_tiers','team_members',
    'testimonials','faqs','instagram_posts','footer_gallery_images'
  ]) loop
    execute format('drop trigger if exists trg_updated_at on public.%I', t);
    execute format(
      'create trigger trg_updated_at before update on public.%I
       for each row execute function public.tg_set_updated_at()', t);
  end loop;
end $$;

-- ============================================================
-- Seed singletons (id = 1 rows so reads always succeed)
-- ============================================================
insert into public.site_general (id) values (1) on conflict (id) do nothing;
insert into public.site_seo (id) values (1) on conflict (id) do nothing;
insert into public.site_navigation (id) values (1) on conflict (id) do nothing;
insert into public.site_footer (id) values (1) on conflict (id) do nothing;
insert into public.site_marquee (id) values (1) on conflict (id) do nothing;
insert into public.section_hero (id) values (1) on conflict (id) do nothing;
insert into public.section_about (id) values (1) on conflict (id) do nothing;
insert into public.section_services_meta (id) values (1) on conflict (id) do nothing;
insert into public.section_categories_meta (id) values (1) on conflict (id) do nothing;
insert into public.section_portfolio_meta (id) values (1) on conflict (id) do nothing;
insert into public.section_stats (id) values (1) on conflict (id) do nothing;
insert into public.section_process (id) values (1) on conflict (id) do nothing;
insert into public.section_team_meta (id) values (1) on conflict (id) do nothing;
insert into public.section_testimonials_meta (id) values (1) on conflict (id) do nothing;
insert into public.section_instagram (id) values (1) on conflict (id) do nothing;
insert into public.section_pricing_meta (id) values (1) on conflict (id) do nothing;
insert into public.section_faq_meta (id) values (1) on conflict (id) do nothing;
insert into public.section_contact (id) values (1) on conflict (id) do nothing;

-- ============================================================
-- RLS — public read for content, public insert for contact submissions only
-- (You can swap to authenticated-only later when you wire auth.)
-- ============================================================
do $$
declare t text;
begin
  for t in select unnest(array[
    'site_general','site_seo','site_navigation','site_footer','site_marquee',
    'section_hero','section_about','section_services_meta','section_categories_meta',
    'section_portfolio_meta','section_pricing_meta','section_stats','section_process','section_team_meta',
    'section_testimonials_meta','section_instagram',
    'section_faq_meta','section_contact',
    'hero_slides','services','categories','portfolio_items','pricing_tiers','team_members',
    'testimonials','faqs','instagram_posts','footer_gallery_images'
  ]) loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "public read" on public.%I', t);
    execute format('create policy "public read" on public.%I for select using (true)', t);
  end loop;
end $$;

alter table public.contact_submissions enable row level security;
drop policy if exists "public insert" on public.contact_submissions;
create policy "public insert" on public.contact_submissions
  for insert with check (true);
