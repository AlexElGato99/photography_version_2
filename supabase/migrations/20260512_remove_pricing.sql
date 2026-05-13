-- Drop pricing section (no longer used). Strip dead "Pricing" / #pricing links from nav + footer JSON.

drop table if exists public.pricing_tiers;
drop table if exists public.section_pricing_meta;

update public.site_navigation
set
  items = (
    select coalesce(jsonb_agg(e order by o), '[]'::jsonb)
    from jsonb_array_elements(items) with ordinality as x(e, o)
    where coalesce(e->>'label', '') <> 'Pricing'
  ),
  updated_at = now()
where id = 1;

update public.site_footer sf
set
  columns = (
    select coalesce(
      jsonb_agg(jsonb_set(col, '{links}', flt.arr) order by ord),
      '[]'::jsonb
    )
    from jsonb_array_elements(sf.columns) with ordinality as t(col, ord)
    cross join lateral (
      select coalesce(jsonb_agg(link order by lo), '[]'::jsonb) as arr
      from jsonb_array_elements(coalesce(col->'links', '[]'::jsonb)) with ordinality as u(link, lo)
      where coalesce(link->>'label', '') <> 'Pricing'
    ) flt
  ),
  updated_at = now()
where sf.id = 1;
