-- Structured section titles (JSON) + category page SEO + hero line split.
-- Run after prior migrations. Safe to re-run: uses IF NOT EXISTS / IF EXISTS.

-- --- Hero: split line_2 ---
alter table public.section_hero
  add column if not exists line_2_prefix text not null default '',
  add column if not exists line_2_em text not null default '',
  add column if not exists line_2_suffix text not null default '';

update public.section_hero set
  line_1 = coalesce(nullif(trim(line_1), ''), 'Stories told'),
  line_2_prefix = 'through ',
  line_2_em = 'light',
  line_2_suffix = '',
  line_3 = coalesce(nullif(trim(line_3), ''), 'and emotion')
where id = 1;

alter table public.section_hero drop column if exists line_2;

-- --- Section metas: title_heading jsonb ---
alter table public.section_about add column if not exists title_heading jsonb not null default '{}'::jsonb;
update public.section_about set title_heading = '{"v":1,"line1":"Crafting visual","mid":"stories with","em":"soul","tail":"","breakAfterLine1":true,"line2":""}'::jsonb where id = 1;
alter table public.section_about drop column if exists title_html;

alter table public.section_services_meta add column if not exists title_heading jsonb not null default '{}'::jsonb;
update public.section_services_meta set title_heading = '{"v":1,"line1":"What we","mid":"","em":"create","tail":"","breakAfterLine1":true,"line2":""}'::jsonb where id = 1;
alter table public.section_services_meta drop column if exists title_html;

alter table public.section_categories_meta add column if not exists title_heading jsonb not null default '{}'::jsonb;
update public.section_categories_meta set title_heading = '{"v":1,"line1":"Explore by ","mid":"","em":"category","tail":"","breakAfterLine1":false,"line2":""}'::jsonb where id = 1;
alter table public.section_categories_meta drop column if exists title_html;

alter table public.section_portfolio_meta add column if not exists title_heading jsonb not null default '{}'::jsonb;
update public.section_portfolio_meta set title_heading = '{"v":1,"line1":"Featured ","mid":"","em":"portfolio","tail":"","breakAfterLine1":false,"line2":""}'::jsonb where id = 1;
alter table public.section_portfolio_meta drop column if exists title_html;

alter table public.section_stats add column if not exists title_heading jsonb not null default '{}'::jsonb;
update public.section_stats set title_heading = '{"v":1,"line1":"Numbers that","mid":"tell a ","em":"story","tail":"","breakAfterLine1":true,"line2":""}'::jsonb where id = 1;
alter table public.section_stats drop column if exists title_html;

alter table public.section_process add column if not exists title_heading jsonb not null default '{}'::jsonb;
update public.section_process set title_heading = '{"v":1,"line1":"A ","mid":"","em":"refined","tail":" process","breakAfterLine1":false,"line2":""}'::jsonb where id = 1;
alter table public.section_process drop column if exists title_html;

alter table public.section_team_meta add column if not exists title_heading jsonb not null default '{}'::jsonb;
update public.section_team_meta set title_heading = '{"v":1,"line1":"Meet the","mid":"","em":"creators","tail":"","breakAfterLine1":true,"line2":""}'::jsonb where id = 1;
alter table public.section_team_meta drop column if exists title_html;

do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'section_pricing_meta'
  ) then
    alter table public.section_pricing_meta add column if not exists title_heading jsonb not null default '{}'::jsonb;
    update public.section_pricing_meta set title_heading = '{"v":1,"line1":"Transparent ","mid":"","em":"pricing","tail":"","breakAfterLine1":false,"line2":""}'::jsonb where id = 1;
    alter table public.section_pricing_meta drop column if exists title_html;
  end if;
end $$;

alter table public.section_testimonials_meta add column if not exists title_heading jsonb not null default '{}'::jsonb;
update public.section_testimonials_meta set title_heading = '{"v":1,"line1":"Trusted by ","mid":"","em":"brands","tail":"","breakAfterLine1":false,"line2":"and couples worldwide"}'::jsonb where id = 1;
alter table public.section_testimonials_meta drop column if exists title_html;

alter table public.section_instagram add column if not exists title_heading jsonb not null default '{}'::jsonb;
update public.section_instagram set title_heading = '{"v":1,"line1":"Follow our ","mid":"","em":"journey","tail":"","breakAfterLine1":false,"line2":""}'::jsonb where id = 1;
alter table public.section_instagram drop column if exists title_html;

alter table public.section_faq_meta add column if not exists title_heading jsonb not null default '{}'::jsonb;
update public.section_faq_meta set title_heading = '{"v":1,"line1":"Questions ","mid":"","em":"answered","tail":"","breakAfterLine1":false,"line2":""}'::jsonb where id = 1;
alter table public.section_faq_meta drop column if exists title_html;

alter table public.section_contact add column if not exists title_heading jsonb not null default '{}'::jsonb;
update public.section_contact set title_heading = '{"v":1,"line1":"Begin your ","mid":"","em":"story","tail":"","breakAfterLine1":false,"line2":""}'::jsonb where id = 1;
alter table public.section_contact drop column if exists title_html;

-- --- Categories: page heading + SEO ---
alter table public.categories add column if not exists page_heading jsonb not null default '{}'::jsonb;
alter table public.categories add column if not exists page_meta_title text not null default '';
alter table public.categories add column if not exists page_meta_description text not null default '';

update public.categories set page_heading = case trim(name)
  when 'Wedding' then '{"v":1,"line1":"Timeless ","mid":"","em":"wedding","tail":" imagery","breakAfterLine1":false,"line2":""}'::jsonb
  when 'Fashion' then '{"v":1,"line1":"Editorial & ","mid":"","em":"fashion","tail":"","breakAfterLine1":false,"line2":""}'::jsonb
  when 'Events' then '{"v":1,"line1":"Live ","mid":"","em":"event","tail":" coverage","breakAfterLine1":false,"line2":""}'::jsonb
  when 'Commercial' then '{"v":1,"line1":"Brand & ","mid":"","em":"commercial","tail":"","breakAfterLine1":false,"line2":""}'::jsonb
  when 'Lifestyle' then '{"v":1,"line1":"Natural ","mid":"","em":"lifestyle","tail":"","breakAfterLine1":false,"line2":""}'::jsonb
  when 'Interiors' then '{"v":1,"line1":"Interior ","mid":"","em":"architecture","tail":"","breakAfterLine1":false,"line2":""}'::jsonb
  when 'Portraits' then '{"v":1,"line1":"Portrait ","mid":"","em":"sessions","tail":"","breakAfterLine1":false,"line2":""}'::jsonb
  else page_heading
end
where page_heading = '{}'::jsonb or page_heading is null;

alter table public.categories drop column if exists page_title_html;
