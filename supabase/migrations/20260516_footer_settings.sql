-- Footer settings: section headings, pages source, contact toggles, dedicated gallery images.

create table if not exists public.footer_gallery_images (
  id uuid primary key default gen_random_uuid(),
  position integer not null default 0,
  image_url text not null,
  link_href text not null default '#',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.site_footer
  add column if not exists pages_heading text not null default 'Pages',
  add column if not exists contact_heading text not null default 'Contact',
  add column if not exists gallery_heading text not null default 'Latest photos',
  add column if not exists use_category_pages boolean not null default true,
  add column if not exists pages_links jsonb not null default '[]'::jsonb,
  add column if not exists show_phone boolean not null default true,
  add column if not exists show_email boolean not null default true,
  add column if not exists show_address boolean not null default true,
  add column if not exists show_hours boolean not null default true;

-- Seed gallery from homepage slider when empty (one-time convenience).
insert into public.footer_gallery_images (position, image_url, link_href)
select ip.position, ip.image_url, ip.link_href
from public.instagram_posts ip
where not exists (select 1 from public.footer_gallery_images limit 1)
order by ip.position;

update public.site_footer
set
  pages_heading = coalesce(nullif(trim(pages_heading), ''), 'Pages'),
  contact_heading = coalesce(nullif(trim(contact_heading), ''), 'Contact'),
  gallery_heading = coalesce(nullif(trim(gallery_heading), ''), 'Latest photos')
where id = 1;
