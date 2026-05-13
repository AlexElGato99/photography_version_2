-- ============================================================
-- Cristina Navarro Studio — Full data seed
-- Run in Supabase SQL editor AFTER schema.sql
-- ============================================================

-- SITE GENERAL
INSERT INTO public.site_general (id, brand_italic, brand_bold, tagline, description, contact_email, contact_phone, address_line, address_city, hours, loader_enabled)
VALUES (1, 'Cristina', 'Navarro', 'Photography Studio · Murcia, Spain',
  'A premium photography agency crafting timeless visual stories for brands, weddings, and editorial work since 2018.',
  'hola@cristinanavarro.studio', '+34 600 000 000', 'Calle de la Luna, 14', 'Murcia · Spain',
  'Monday – Friday · 9:00 – 18:00', true)
ON CONFLICT (id) DO UPDATE SET
  brand_italic = EXCLUDED.brand_italic, brand_bold = EXCLUDED.brand_bold,
  tagline = EXCLUDED.tagline, description = EXCLUDED.description,
  contact_email = EXCLUDED.contact_email, contact_phone = EXCLUDED.contact_phone,
  address_line = EXCLUDED.address_line, address_city = EXCLUDED.address_city,
  hours = EXCLUDED.hours, loader_enabled = EXCLUDED.loader_enabled,
  updated_at = now();

-- SITE SEO
INSERT INTO public.site_seo (id, title, description, og_image, robots)
VALUES (1,
  'Cristina Navarro Studio · Premium Photography Agency · Murcia',
  'Cristina Navarro Studio · Premium photography agency in Murcia. Wedding, fashion, editorial, commercial, lifestyle.',
  null,
  'index, follow, max-snippet:-1, max-image-preview:large')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title, description = EXCLUDED.description,
  og_image = EXCLUDED.og_image, robots = EXCLUDED.robots, updated_at = now();

-- SITE NAVIGATION
INSERT INTO public.site_navigation (id, cta_label, cta_href, items)
VALUES (1, 'Book a session', '#contact',
  '[{"label":"About","href":"#about"},{"label":"Services","href":"#services"},{"label":"Categories","href":"#categories"},{"label":"Portfolio","href":"#portfolio"},{"label":"Contact","href":"#contact"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  cta_label = EXCLUDED.cta_label, cta_href = EXCLUDED.cta_href,
  items = EXCLUDED.items, updated_at = now();

-- SITE FOOTER
INSERT INTO public.site_footer (id, brand_text, copyright, columns, legal)
VALUES (1,
  'A premium photography agency based in Murcia, Spain. Crafting timeless visual stories since 2018.',
  '© 2026 Cristina Navarro Studio · All rights reserved',
  '[{"title":"Studio","links":[{"label":"About us","href":"#about"},{"label":"Services","href":"#services"},{"label":"Portfolio","href":"#portfolio"}]},{"title":"Categories","links":[{"label":"Wedding","href":"#"},{"label":"Fashion","href":"#"},{"label":"Commercial","href":"#"},{"label":"Lifestyle","href":"#"}]},{"title":"Contact","links":[{"label":"hola@cristinanavarro.studio","href":"mailto:hola@cristinanavarro.studio"},{"label":"+34 600 000 000","href":"tel:+34600000000"},{"label":"Calle de la Luna 14, Murcia","href":"#"},{"label":"Instagram","href":"#"}]}]'::jsonb,
  '[{"label":"Privacy","href":"#"},{"label":"Terms","href":"#"},{"label":"Cookies","href":"#"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  brand_text = EXCLUDED.brand_text, copyright = EXCLUDED.copyright,
  columns = EXCLUDED.columns, legal = EXCLUDED.legal, updated_at = now();

-- SITE MARQUEE
INSERT INTO public.site_marquee (id, items)
VALUES (1, '["Wedding","Fashion","Editorial","Lifestyle","Commercial","Events"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET items = EXCLUDED.items, updated_at = now();

-- SECTION HERO
INSERT INTO public.section_hero (id, eyebrow, line_1, line_2_prefix, line_2_em, line_2_suffix, line_3, meta_text, cta_primary_label, cta_primary_href, cta_secondary_label, cta_secondary_href, autoplay_ms)
VALUES (1,
  'Photography Studio · Murcia, Spain',
  'Stories told', 'through ', 'light', '', 'and emotion',
  'A premium photography agency crafting timeless visual stories for brands, weddings, and editorial work since 2018.',
  'Explore portfolio', '#portfolio', 'Start a project', '#contact', 6000)
ON CONFLICT (id) DO UPDATE SET
  eyebrow = EXCLUDED.eyebrow, line_1 = EXCLUDED.line_1,
  line_2_prefix = EXCLUDED.line_2_prefix, line_2_em = EXCLUDED.line_2_em, line_2_suffix = EXCLUDED.line_2_suffix,
  line_3 = EXCLUDED.line_3, meta_text = EXCLUDED.meta_text,
  cta_primary_label = EXCLUDED.cta_primary_label, cta_primary_href = EXCLUDED.cta_primary_href,
  cta_secondary_label = EXCLUDED.cta_secondary_label, cta_secondary_href = EXCLUDED.cta_secondary_href,
  autoplay_ms = EXCLUDED.autoplay_ms, updated_at = now();

-- SECTION ABOUT
INSERT INTO public.section_about (id, eyebrow, title_heading, quote, body_html, image_main, image_secondary, badge_title, badge_subtitle, signature_name, signature_role, signature_meta)
VALUES (1,
  'About the studio',
  '{"v":1,"line1":"Crafting visual","mid":"stories with","em":"soul","tail":"","breakAfterLine1":true,"line2":""}'::jsonb,
  '<p>Photography is not about capturing what you see — it''s about <em>revealing</em> what others feel.</p>',
  '<p>Cristina Navarro Studio is a creative photography agency based in Murcia, Spain. For over <b>8 years</b>, we''ve been creating timeless imagery for international brands, couples, and editorial publications.</p><p>Our approach blends classical composition with contemporary storytelling — every frame is intentional, every detail considered. We believe great photography starts with great relationships.</p>',
  'https://images.unsplash.com/photo-1554941426-cc88c91c9bbf?w=1200&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600&q=80&auto=format&fit=crop',
  '5.0 Rating', 'Based on 200+ projects',
  'Cristina N.', 'Founder & Lead Photographer', 'Estudio Murcia · est. 2018')
ON CONFLICT (id) DO UPDATE SET
  eyebrow = EXCLUDED.eyebrow, title_heading = EXCLUDED.title_heading, quote = EXCLUDED.quote,
  body_html = EXCLUDED.body_html, image_main = EXCLUDED.image_main,
  image_secondary = EXCLUDED.image_secondary, badge_title = EXCLUDED.badge_title,
  badge_subtitle = EXCLUDED.badge_subtitle, signature_name = EXCLUDED.signature_name,
  signature_role = EXCLUDED.signature_role, signature_meta = EXCLUDED.signature_meta,
  updated_at = now();

-- SECTION SERVICES META
INSERT INTO public.section_services_meta (id, eyebrow, title_heading, lead)
VALUES (1, 'Our services', '{"v":1,"line1":"What we","mid":"","em":"create","tail":"","breakAfterLine1":true,"line2":""}'::jsonb,
  'From intimate weddings to international fashion editorials, we bring a refined eye and meticulous craft to every project.')
ON CONFLICT (id) DO UPDATE SET eyebrow=EXCLUDED.eyebrow, title_heading=EXCLUDED.title_heading, lead=EXCLUDED.lead, updated_at=now();

-- SECTION CATEGORIES META
INSERT INTO public.section_categories_meta (id, eyebrow, title_heading)
VALUES (1, 'Categories', '{"v":1,"line1":"Explore by ","mid":"","em":"category","tail":"","breakAfterLine1":false,"line2":""}'::jsonb)
ON CONFLICT (id) DO UPDATE SET eyebrow=EXCLUDED.eyebrow, title_heading=EXCLUDED.title_heading, updated_at=now();

-- SECTION PORTFOLIO META
INSERT INTO public.section_portfolio_meta (id, eyebrow, title_heading, lead, tabs)
VALUES (1, 'Selected work', '{"v":1,"line1":"Featured ","mid":"","em":"portfolio","tail":"","breakAfterLine1":false,"line2":""}'::jsonb,
  'A curated selection of recent projects across weddings, fashion, and brand storytelling.',
  '["All","Wedding","Fashion","Commercial","Lifestyle"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  eyebrow=EXCLUDED.eyebrow, title_heading=EXCLUDED.title_heading, lead=EXCLUDED.lead,
  tabs=EXCLUDED.tabs, updated_at=now();

-- SECTION STATS
INSERT INTO public.section_stats (id, eyebrow, title_heading, lead, items)
VALUES (1, 'Achievements', '{"v":1,"line1":"Numbers that","mid":"tell a ","em":"story","tail":"","breakAfterLine1":true,"line2":""}'::jsonb,
  'Eight years of dedicated craftsmanship, hundreds of stories told, and countless moments preserved.',
  '[{"count":240,"suffix":"+","label":"Projects completed across weddings, brands and editorials"},{"count":85,"suffix":"+","label":"Brands trusted us with their visual identity"},{"count":32,"suffix":"k","label":"Photographs delivered to satisfied clients"},{"count":8,"suffix":"yrs","label":"Of refining craft and creative vision"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  eyebrow=EXCLUDED.eyebrow, title_heading=EXCLUDED.title_heading, lead=EXCLUDED.lead,
  items=EXCLUDED.items, updated_at=now();

-- SECTION PROCESS
INSERT INTO public.section_process (id, eyebrow, title_heading, steps)
VALUES (1, 'How we work', '{"v":1,"line1":"A ","mid":"","em":"refined","tail":" process","breakAfterLine1":false,"line2":""}'::jsonb,
  '[{"num":"01","title":"Discovery","text":"We start with a conversation — understanding your vision, story, and the emotion you want captured."},{"num":"02","title":"Concept","text":"A tailored creative direction with mood boards, location scouting, and detailed shot planning."},{"num":"03","title":"Production","text":"The shoot day, executed with care, calm energy, and full attention to every meaningful detail."},{"num":"04","title":"Delivery","text":"Hand-edited, color-graded final images delivered through a private gallery within two weeks."}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  eyebrow=EXCLUDED.eyebrow, title_heading=EXCLUDED.title_heading, steps=EXCLUDED.steps, updated_at=now();

-- SECTION TEAM META
INSERT INTO public.section_team_meta (id, eyebrow, title_heading, lead)
VALUES (1, 'The team', '{"v":1,"line1":"Meet the","mid":"","em":"creators","tail":"","breakAfterLine1":true,"line2":""}'::jsonb,
  'A small, passionate team united by craft and an unwavering pursuit of beautiful imagery.')
ON CONFLICT (id) DO UPDATE SET eyebrow=EXCLUDED.eyebrow, title_heading=EXCLUDED.title_heading, lead=EXCLUDED.lead, updated_at=now();

-- SECTION TESTIMONIALS META
INSERT INTO public.section_testimonials_meta (id, eyebrow, title_heading)
VALUES (1, 'Kind words', '{"v":1,"line1":"Trusted by ","mid":"","em":"brands","tail":"","breakAfterLine1":false,"line2":"and couples worldwide"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET eyebrow=EXCLUDED.eyebrow, title_heading=EXCLUDED.title_heading, updated_at=now();

-- SECTION INSTAGRAM
INSERT INTO public.section_instagram (id, handle, title_heading, lead, profile_url)
VALUES (1, '@cristinanavarro_studio', '{"v":1,"line1":"Follow our ","mid":"","em":"journey","tail":"","breakAfterLine1":false,"line2":""}'::jsonb,
  'Behind-the-scenes, latest work and creative inspiration on Instagram.', '#')
ON CONFLICT (id) DO UPDATE SET
  handle=EXCLUDED.handle, title_heading=EXCLUDED.title_heading, lead=EXCLUDED.lead,
  profile_url=EXCLUDED.profile_url, updated_at=now();

-- SECTION FAQ META
INSERT INTO public.section_faq_meta (id, eyebrow, title_heading)
VALUES (1, 'Frequently asked', '{"v":1,"line1":"Questions ","mid":"","em":"answered","tail":"","breakAfterLine1":false,"line2":""}'::jsonb)
ON CONFLICT (id) DO UPDATE SET eyebrow=EXCLUDED.eyebrow, title_heading=EXCLUDED.title_heading, updated_at=now();

-- SECTION CONTACT
INSERT INTO public.section_contact (id, eyebrow, title_heading, lead, services, social)
VALUES (1, 'Let''s talk', '{"v":1,"line1":"Begin your ","mid":"","em":"story","tail":"","breakAfterLine1":false,"line2":""}'::jsonb,
  'Tell us about your project and we''ll get back to you within 24 hours.',
  '["Wedding photography","Fashion / Editorial","Commercial / Brand","Event coverage","Lifestyle / Family","Other"]'::jsonb,
  '[{"label":"Instagram","href":"#"},{"label":"LinkedIn","href":"#"},{"label":"Behance","href":"#"},{"label":"Pinterest","href":"#"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  eyebrow=EXCLUDED.eyebrow, title_heading=EXCLUDED.title_heading, lead=EXCLUDED.lead,
  services=EXCLUDED.services, social=EXCLUDED.social, updated_at=now();

-- ============================================================
-- COLLECTIONS (delete + re-insert for clean seed)
-- ============================================================

-- HERO SLIDES
DELETE FROM public.hero_slides;
INSERT INTO public.hero_slides (position, label, image_url, alt) VALUES
(0, '01 · Wedding',   'https://images.unsplash.com/photo-1519741497674-611481863552?w=2000&q=80&auto=format&fit=crop', 'Wedding'),
(1, '02 · Fashion',   'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=2000&q=80&auto=format&fit=crop', 'Fashion'),
(2, '03 · Lifestyle', 'https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?w=2000&q=80&auto=format&fit=crop', 'Lifestyle'),
(3, '04 · Commercial','https://images.unsplash.com/photo-1522335789203-aaa455a47f3a?w=2000&q=80&auto=format&fit=crop', 'Commercial'),
(4, '05 · Events',    'https://images.unsplash.com/photo-1530023367847-a683933f4172?w=2000&q=80&auto=format&fit=crop', 'Events');

-- SERVICES
DELETE FROM public.services;
INSERT INTO public.services (position, number_label, icon_svg, name, description, link_label, link_href) VALUES
(0,'— 01','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
  'Wedding Photography','Documentary-style storytelling for couples who value authenticity, emotion and timeless elegance.','Discover','#'),
(1,'— 02','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2zM5 3v4M3 5h4M19 17v4M17 19h4"/></svg>',
  'Fashion & Editorial','Bold visual language for fashion brands, magazines, and lookbooks with cinematic art direction.','Discover','#'),
(2,'— 03','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="4"/></svg>',
  'Commercial & Brand','Premium product, packaging, and brand imagery that elevates your story across every touchpoint.','Discover','#'),
(3,'— 04','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  'Event Coverage','Cinematic event photography for galas, launches, and corporate gatherings with editorial polish.','Discover','#'),
(4,'— 05','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>',
  'Lifestyle & Family','Natural, light-filled portraits that capture genuine moments and the beauty of everyday life.','Discover','#'),
(5,'— 06','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M3 9h18M3 15h18"/></svg>',
  'Interior & Architecture','Spaces captured with sensitivity to light, proportion and atmosphere — for hotels, restaurants and design studios.','Discover','#');

-- CATEGORIES
DELETE FROM public.categories;
INSERT INTO public.categories (position, tag, name, image_url, link_href) VALUES
(0,'Featured','Wedding',   'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80&auto=format&fit=crop','#'),
(1,'Editorial','Fashion',  'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1200&q=80&auto=format&fit=crop','#'),
(2,'Live',    'Events',    'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=600&q=80&auto=format&fit=crop','#'),
(3,'Brand',   'Commercial','https://images.unsplash.com/photo-1556228720-195a672e8a03?w=900&q=80&auto=format&fit=crop','#'),
(4,'Outdoors','Lifestyle', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&q=80&auto=format&fit=crop','#'),
(5,'Spaces',  'Interiors', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=80&auto=format&fit=crop','#'),
(6,'Personal','Portraits', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&q=80&auto=format&fit=crop','#');

UPDATE public.categories SET slug = CASE trim(name)
  WHEN 'Wedding' THEN 'wedding'
  WHEN 'Fashion' THEN 'fashion'
  WHEN 'Events' THEN 'events'
  WHEN 'Commercial' THEN 'commercial'
  WHEN 'Lifestyle' THEN 'lifestyle'
  WHEN 'Interiors' THEN 'interiors'
  WHEN 'Portraits' THEN 'portraits'
  ELSE lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'))
END;

UPDATE public.categories SET page_heading = (CASE trim(name)
  WHEN 'Wedding' THEN '{"v":1,"line1":"Timeless ","mid":"","em":"wedding","tail":" imagery","breakAfterLine1":false,"line2":""}'::jsonb
  WHEN 'Fashion' THEN '{"v":1,"line1":"Editorial & ","mid":"","em":"fashion","tail":"","breakAfterLine1":false,"line2":""}'::jsonb
  WHEN 'Events' THEN '{"v":1,"line1":"Live ","mid":"","em":"event","tail":" coverage","breakAfterLine1":false,"line2":""}'::jsonb
  WHEN 'Commercial' THEN '{"v":1,"line1":"Brand & ","mid":"","em":"commercial","tail":"","breakAfterLine1":false,"line2":""}'::jsonb
  WHEN 'Lifestyle' THEN '{"v":1,"line1":"Natural ","mid":"","em":"lifestyle","tail":"","breakAfterLine1":false,"line2":""}'::jsonb
  WHEN 'Interiors' THEN '{"v":1,"line1":"Interior ","mid":"","em":"architecture","tail":"","breakAfterLine1":false,"line2":""}'::jsonb
  WHEN 'Portraits' THEN '{"v":1,"line1":"Portrait ","mid":"","em":"sessions","tail":"","breakAfterLine1":false,"line2":""}'::jsonb
  ELSE page_heading
END);

-- PORTFOLIO ITEMS
DELETE FROM public.portfolio_items;
INSERT INTO public.portfolio_items (position, number_label, tag, title, image_url, tab, link_href) VALUES
(0,'— 01','Wedding',   'Sofia & Daniel',      'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=900&q=80&auto=format&fit=crop','Wedding','#'),
(1,'— 02','Fashion',   'Editorial Spring',    'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&q=80&auto=format&fit=crop','Fashion','#'),
(2,'— 03','Commercial','Tahe Cosmetics',      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=80&auto=format&fit=crop','Commercial','#'),
(3,'— 04','Lifestyle', 'Golden Hour',         'https://images.unsplash.com/photo-1517438476312-10d79c077509?w=900&q=80&auto=format&fit=crop','Lifestyle','#'),
(4,'— 05','Events',    'Annual Gala 2025',    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=900&q=80&auto=format&fit=crop','All','#'),
(5,'— 06','Interiors', 'Casa Mediterránea',   'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80&auto=format&fit=crop','All','#');

-- TEAM MEMBERS
DELETE FROM public.team_members;
INSERT INTO public.team_members (position, name, role, image_url, instagram_url, linkedin_url) VALUES
(0,'Cristina Navarro','Founder · Lead Photographer','https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&q=80&auto=format&fit=crop','#','#'),
(1,'Marco Velez',     'Senior Photographer',        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80&auto=format&fit=crop','#','#'),
(2,'Lucia Reyes',     'Art Director',               'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&q=80&auto=format&fit=crop','#','#'),
(3,'Diego Ortiz',     'Post-Production Lead',       'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80&auto=format&fit=crop','#','#');

-- TESTIMONIALS
DELETE FROM public.testimonials;
INSERT INTO public.testimonials (position, stars, text, author_name, author_role, author_avatar_url) VALUES
(0,5,'Cristina''s eye for emotion is unmatched. Every photograph feels like a moment frozen in poetry — exactly what we dreamed our wedding album would look like.',
  'Sofia & Daniel','Wedding · Costa Cálida','https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80&auto=format&fit=crop'),
(1,5,'Working with the studio felt effortless. Their visuals elevated our brand campaign to a level we couldn''t have imagined. Truly world-class.',
  'María Alonso','Marketing Director · Tahe','https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80&auto=format&fit=crop'),
(2,5,'The editorial work for our magazine was beyond expectations. Cinematic, refined, and deeply intentional. We''ve booked them for three more issues.',
  'Laura Prieto','Editor · Atelier Magazine','https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80&auto=format&fit=crop');

-- FAQS
DELETE FROM public.faqs;
INSERT INTO public.faqs (position, question, answer) VALUES
(0,'How far in advance should I book my session?',
  'For weddings, we recommend booking 6-12 months in advance. For brand and editorial work, 4-6 weeks. Last-minute requests are sometimes possible — contact us to check availability.'),
(1,'Do you travel for shoots?',
  'Absolutely. We work nationally and internationally. Travel and accommodation costs are added transparently to your custom quote.'),
(2,'What''s included in the final delivery?',
  'You receive hand-edited, color-graded high-resolution images via a private online gallery. Print release and commercial usage rights are included depending on your package.'),
(3,'How long until I receive my photos?',
  'Standard delivery is 10-14 days. For weddings, we provide a sneak peek within 48 hours, and full galleries within 4 weeks during peak season.'),
(4,'Can we customize a package?',
  'Yes — every project is unique. We''re happy to build a tailored package based on your vision, scope, and timeline. Get in touch for a custom quote.');

-- INSTAGRAM POSTS
DELETE FROM public.instagram_posts;
INSERT INTO public.instagram_posts (position, image_url, link_href) VALUES
(0,'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80&auto=format&fit=crop','#'),
(1,'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80&auto=format&fit=crop','#'),
(2,'https://images.unsplash.com/photo-1522335789203-aaa455a47f3a?w=400&q=80&auto=format&fit=crop','#'),
(3,'https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?w=400&q=80&auto=format&fit=crop','#'),
(4,'https://images.unsplash.com/photo-1530023367847-a683933f4172?w=400&q=80&auto=format&fit=crop','#'),
(5,'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80&auto=format&fit=crop','#');
