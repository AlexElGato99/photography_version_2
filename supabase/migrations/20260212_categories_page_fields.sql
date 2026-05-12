-- Run in Supabase SQL editor if the project already existed before category pages.
-- New installs can rely on schema.sql only.

alter table public.categories
  add column if not exists slug text not null default '';

alter table public.categories
  add column if not exists page_eyebrow text not null default '';

alter table public.categories
  add column if not exists page_title_html text not null default '';

alter table public.categories
  add column if not exists page_lead text not null default '';

alter table public.categories
  add column if not exists page_body_html text not null default '';

alter table public.categories
  add column if not exists gallery_images jsonb not null default '[]'::jsonb;

alter table public.categories
  add column if not exists show_portfolio_related boolean not null default true;

update public.categories
set slug = lower(regexp_replace(trim(name), '[^a-zA-Z0-9]+', '-', 'g'))
where slug is null or trim(slug) = '';

create unique index if not exists categories_slug_unique on public.categories (slug)
  where length(trim(slug)) > 0;
