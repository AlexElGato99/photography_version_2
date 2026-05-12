# Running SQL migrations (Supabase / Postgres)

The project ships SQL in:

- `supabase/schema.sql` — full schema for **new** projects (paste in Supabase SQL Editor once).
- `supabase/migrations/*.sql` — **incremental** changes for existing databases (e.g. category page columns).

## 1) Supabase Dashboard (no terminal)

1. Open [Supabase](https://supabase.com) → your project → **SQL Editor**.
2. Paste the contents of `supabase/migrations/20260212_categories_page_fields.sql`.
3. Click **Run**.

## 2) Terminal with npm script (recommended)

1. In Supabase: **Project Settings → Database** copy the **URI** connection string (direct, port **5432**).
2. Add to `.env.local` (same folder as `package.json`):

   ```bash
   DATABASE_URL=postgresql://postgres.[REF]:[YOUR-PASSWORD]@db.[REF].supabase.co:5432/postgres
   ```

3. Install the tiny Postgres client (once):

   ```bash
   npm install pg --save-dev
   ```

4. Run the migration file:

   ```bash
   npm run migrate:categories
   ```

   Or any SQL file:

   ```bash
   npm run migrate:sql -- supabase/migrations/20260212_categories_page_fields.sql
   ```

## 3) `psql` only (if you already use it)

```bash
psql "postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres" -f supabase/migrations/20260212_categories_page_fields.sql
```

## 4) Supabase CLI (linked project)

If the repo is linked with `supabase link`:

```bash
npx supabase db push
```

(Uses everything under `supabase/migrations/` that is not yet applied — naming must follow Supabase migration conventions.)

---

After migrations, restart `npm run dev`, open `/category/wedding` (or your slug), and use **Dashboard → Frontend — Sections → Categories** (the **Cards & pages** tab opens first) to edit page content and gallery.
