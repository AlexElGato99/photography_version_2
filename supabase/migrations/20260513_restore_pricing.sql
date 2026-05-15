-- Restore pricing section (tables + default rows + nav/footer links when missing).
-- Note: this cannot recover custom tiers lost after 20260512_remove_pricing.sql without a backup.

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

drop trigger if exists trg_updated_at on public.section_pricing_meta;
create trigger trg_updated_at
  before update on public.section_pricing_meta
  for each row execute function public.tg_set_updated_at();

drop trigger if exists trg_updated_at on public.pricing_tiers;
create trigger trg_updated_at
  before update on public.pricing_tiers
  for each row execute function public.tg_set_updated_at();

alter table public.section_pricing_meta enable row level security;
drop policy if exists "public read" on public.section_pricing_meta;
create policy "public read" on public.section_pricing_meta for select using (true);

alter table public.pricing_tiers enable row level security;
drop policy if exists "public read" on public.pricing_tiers;
create policy "public read" on public.pricing_tiers for select using (true);

insert into public.section_pricing_meta (id, eyebrow, title_heading, lead)
values (
  1,
  'Investment',
  '{"v":1,"line1":"Transparent ","mid":"","em":"pricing","tail":"","breakAfterLine1":false,"line2":""}'::jsonb,
  'Tailored packages designed for every story. Custom quotes available for unique projects.'
)
on conflict (id) do update set
  eyebrow = excluded.eyebrow,
  title_heading = excluded.title_heading,
  lead = excluded.lead,
  updated_at = now();

insert into public.pricing_tiers (position, name, currency, amount, period, badge, features, cta_label, cta_href, featured)
select * from (
  values
    (0, 'Essential'::text, '€'::text, '890'::text, 'From / per session'::text, null::text,
     '["Up to 2 hours of coverage","40+ edited high-res photos","Online private gallery","Color grading included","Delivery in 14 days"]'::jsonb,
     'Get started'::text, '#contact'::text, false),
    (1, 'Signature'::text, '€'::text, '1,890'::text, 'From / per project'::text, 'Most popular'::text,
     '["Full day coverage (8h)","120+ edited photos","Mood board + planning call","Premium color grading","Print release license","Delivery in 10 days"]'::jsonb,
     'Book signature'::text, '#contact'::text, true),
    (2, 'Atelier'::text, '€'::text, '3,490'::text, 'From / custom project'::text, null::text,
     '["Multi-day shoots","250+ edited photos","Full creative direction","Location scouting","Team of 2-3 photographers","Commercial usage rights"]'::jsonb,
     'Request quote'::text, '#contact'::text, false)
) as v(position, name, currency, amount, period, badge, features, cta_label, cta_href, featured)
where not exists (select 1 from public.pricing_tiers limit 1);

update public.site_navigation
set
  items = coalesce(items, '[]'::jsonb) || '[{"label":"Pricing","href":"#pricing"}]'::jsonb,
  updated_at = now()
where id = 1
  and not exists (
    select 1 from jsonb_array_elements(coalesce(items, '[]'::jsonb)) el
    where coalesce(el->>'label', '') = 'Pricing'
  );

update public.site_footer sf
set
  columns = (
    select jsonb_agg(x.elem order by x.ord)
    from (
      select
        ord,
        case
          when ord = 1 then jsonb_set(
            col,
            '{links}',
            coalesce(col->'links', '[]'::jsonb) || '[{"label":"Pricing","href":"#pricing"}]'::jsonb
          )
          else col
        end as elem
      from jsonb_array_elements(coalesce(sf.columns, '[]'::jsonb)) with ordinality as t(col, ord)
    ) x
  ),
  updated_at = now()
where sf.id = 1
  and not exists (
    select 1
    from jsonb_array_elements(coalesce(sf.columns, '[]'::jsonb)) c,
         jsonb_array_elements(coalesce(c->'links', '[]'::jsonb)) l
    where coalesce(l->>'label', '') = 'Pricing'
  );
