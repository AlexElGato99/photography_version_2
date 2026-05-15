-- Per-project page content, gallery, URL slug (optional override; default from title).

alter table public.portfolio_items
  add column if not exists slug text not null default '',
  add column if not exists page_eyebrow text not null default '',
  add column if not exists page_heading jsonb not null default '{}'::jsonb,
  add column if not exists page_meta_title text not null default '',
  add column if not exists page_meta_description text not null default '',
  add column if not exists page_lead text not null default '',
  add column if not exists page_body_html text not null default '',
  add column if not exists gallery_images jsonb not null default '[]'::jsonb;

create unique index if not exists portfolio_items_slug_unique
  on public.portfolio_items (lower(trim(slug)))
  where length(trim(slug)) > 0;
