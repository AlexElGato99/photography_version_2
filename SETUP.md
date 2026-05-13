# Setup — Photography Site + Admin Dashboard

This project now contains **two coordinated apps** running on the same Next.js codebase:

| URL              | What it is                                            |
| ---------------- | ----------------------------------------------------- |
| `/`              | Public photography website (Cristina Navarro Studio)  |
| `/dashboard/...` | Admin dashboard that edits every section of the site  |

Content lives in **Supabase** (Postgres + JSON columns). The frontend reads it at request time; the dashboard writes to it through server actions.

---

## 1. Install dependencies

Already done, but for reference:

```bash
npm install
# adds: @supabase/supabase-js, @supabase/ssr (already in package.json)
```

## 2. Create a Supabase project

1. Go to <https://supabase.com> → **New project**.
2. After it's ready, open **Settings → API** and copy:
   - `Project URL`
   - `anon` `public` key
   - `service_role` `secret` key

## 3. Environment variables

Copy the template:

```bash
cp .env.local.example .env.local
```

Fill it in:

```
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
```

The site **works even without these** — fetchers fall back to default photography content if Supabase isn't reachable. You won't be able to save edits until env vars are set.

## 4. Run the SQL schema

Open the Supabase dashboard → **SQL Editor** → paste the contents of `supabase/schema.sql` → **Run**.

This creates:

- **Singleton tables** (one row per setting, `id = 1`):
  `site_general`, `site_seo`, `site_navigation`, `site_footer`, `site_marquee`,
  `section_hero`, `section_about`, `section_services_meta`, `section_categories_meta`,
  `section_portfolio_meta`, `section_stats`, `section_process`, `section_team_meta`,
  `section_testimonials_meta`, `section_instagram`,
  `section_faq_meta`, `section_contact`.

- **Collection tables** (many rows, sortable):
  `hero_slides`, `services`, `categories`, `portfolio_items`, `team_members`,
  `testimonials`, `faqs`, `instagram_posts`.

- **`contact_submissions`** — populated by the public contact form.

- Public-read RLS policies on all content tables.
- Public-insert policy on `contact_submissions` (so the public form works).
- Seeded default rows so the site renders immediately.

## 5. Start the dev server

```bash
npm run dev
```

- Visit `http://localhost:3000` → photography site
- Visit `http://localhost:3000/dashboard` → admin

---

## How the dashboard maps to the site

The dashboard sidebar has two new groups: **Frontend — Site** and **Frontend — Sections**.

### Frontend — Site (`/dashboard/site/*`)

| Route                          | Edits                                            |
| ------------------------------ | ------------------------------------------------ |
| `/dashboard/site/general`      | Brand name, tagline, contact email/phone, hours  |
| `/dashboard/site/navigation`   | Top nav links + primary CTA button               |
| `/dashboard/site/marquee`      | Words in the scrolling marquee under the hero    |
| `/dashboard/site/footer`       | Footer brand text, column links, legal links     |
| `/dashboard/site/seo`          | `<title>`, meta description, robots, OG image    |

### Frontend — Sections (`/dashboard/sections/*`)

| Route                               | Edits                                              |
| ----------------------------------- | -------------------------------------------------- |
| `/dashboard/sections/hero`          | Eyebrow, headline, CTAs **+** carousel slides      |
| `/dashboard/sections/about`         | About block (images, quote, body, signature)       |
| `/dashboard/sections/services`      | Heading **+** service cards (icon SVG, copy)       |
| `/dashboard/sections/categories`    | Heading **+** category tiles                       |
| `/dashboard/sections/portfolio`     | Heading, filter tabs (tags) **+** portfolio items  |
| `/dashboard/sections/stats`         | The four counters under "Numbers that tell a story"|
| `/dashboard/sections/process`       | The 4-step Discovery → Concept → Production → Delivery |
| `/dashboard/sections/team`          | Heading **+** team members (photos, socials)       |
| `/dashboard/sections/testimonials`  | Heading **+** quote cards                          |
| `/dashboard/sections/instagram`     | Handle, lead **+** Instagram post grid             |
| `/dashboard/sections/faq`           | Heading **+** Q&A pairs                            |
| `/dashboard/sections/contact`       | Heading, lead, service dropdown options, social links |

Each editor is a typed form (text / textarea / HTML / URL / number / switch / JSON). Saves go through server actions that upsert into Supabase, then `revalidatePath('/', 'layout')` refreshes the live site.

---

## Architecture

```
app/
  (site)/                # Public photography site (URL = /)
    layout.tsx           # Wraps in .cn-site + loads SEO from Supabase
    page.tsx             # Composes all homepage sections
    actions.ts           # Contact form submission server action
  dashboard/             # Admin (URL = /dashboard/*)
    layout.tsx           # Persistent sidebar + topbar
    actions.ts           # Generic upsert / replaceCollection actions
    site/...             # 5 site-settings editors
    sections/...         # Section editors (hero, about, services, …)
  site.css               # All photography styles, scoped to .cn-site
  globals.css            # Dashboard styles (unchanged)
  layout.tsx             # Root: loads Cormorant Garamond + Inter Tight

components/
  site/                  # Photography UI (Hero, About, Services, …)
  dashboard/             # Editor primitives (SectionForm, CollectionEditor, Tabs)
    editors/             # Per-section composite editors (Hero, Services, …)
  layout/                # Sidebar / Topbar / ThemeProvider
  ui/                    # Logo, Pill, StatCard, …

lib/
  supabase/
    client.ts            # Browser client (SSR-safe)
    server.ts            # Server-side read client (uses anon key + cookies)
    admin.ts             # server-only write client (service-role)
  site/
    defaults.ts          # Fallback content if Supabase is unreachable
    fetchers.ts          # getHero(), getServices(), etc. with graceful fallback
  types/
    site.ts              # All TypeScript types for site data

supabase/
  schema.sql             # Run this once in the Supabase SQL editor
```

### CSS isolation

The photography styles live in `app/site.css` and **all selectors are prefixed with `.cn-…`**. The site is wrapped in `<div className="cn-site">` from `app/(site)/layout.tsx`, so the dashboard's Tailwind-based styles (`globals.css`) and the photography styles never collide.

### Data flow

1. User opens `/` → `app/(site)/page.tsx` runs server-side.
2. It calls all `getX()` helpers in `lib/site/fetchers.ts` in parallel.
3. Each helper queries Supabase. If env vars are missing or the query fails, it returns the matching value from `lib/site/defaults.ts`.
4. The page renders with the data.

When you edit something in the dashboard:

1. The form calls `updateSingleton(table, payload)` (or `replaceCollection`) — both in `app/dashboard/actions.ts`.
2. The server action writes via the **service-role** Supabase client (`lib/supabase/admin.ts`).
3. It calls `revalidatePath('/', 'layout')` so the live site picks up the change on next request.

---

## Adding more content

- **Reorder items in a collection**: use the up/down chevrons in the editor. Position is set automatically on save.
- **Change SEO**: `/dashboard/site/seo` → edit title/description.
- **Change the marquee**: `/dashboard/site/marquee` → edit the JSON array of strings.

---

## Known follow-ups

- GSAP scroll animations from the original mockup are **not** ported yet. The site is fully styled and interactive (carousel autoplay, FAQ accordion, portfolio tab filter, mobile menu, back-to-top) but without scroll-trigger reveal animations.
- Image uploads currently use URLs. Wire Supabase Storage when you want drag-and-drop uploads.
- Auth on the dashboard is not enabled yet. When you add Supabase Auth, the service-role key should only be used inside server actions (which is already the case here).
