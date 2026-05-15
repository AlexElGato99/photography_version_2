-- Ensure footer gallery is readable by the public site (anon key).
alter table public.footer_gallery_images enable row level security;

drop policy if exists "public read" on public.footer_gallery_images;
create policy "public read" on public.footer_gallery_images
  for select
  using (true);
