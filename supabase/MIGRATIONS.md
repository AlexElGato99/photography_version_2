# Running SQL migrations (Supabase / Postgres)

The project ships SQL in:

- `supabase/schema.sql` — full schema for **new** projects (paste in Supabase SQL Editor once).
- `supabase/migrations/*.sql` — **incremental** changes for existing databases.

## Easiest: terminal (hosted Supabase, no Docker)

Uses your **cloud** database. You do **not** need `npx supabase migration up` (that command only talks to **local** Postgres on port 54322 and requires Docker).

1. Supabase → **Project Settings → Database** → copy the **URI** (direct connection, port **5432**).
2. In `.env.local` (next to `package.json`):

   ```bash
   DATABASE_URL=postgresql://postgres.[REF]:[YOUR-PASSWORD]@db.[REF].supabase.co:5432/postgres
   ```

3. From the project root:

   ```bash
   npm run db:check
   ```

   You should see `Connected OK: postgres as postgres`.

4. Apply every migration file in `supabase/migrations/` that has not been applied yet (sorted by filename):

   ```bash
   npm run db:migrate
   ```

   Applied filenames are stored in `public._pod_dashboard_migrations`. To **re-run one file** after you edited it:

   ```sql
   delete from public._pod_dashboard_migrations where filename = '20260212_categories_page_fields.sql';
   ```

   Then run `npm run db:migrate` again.

5. Run a **single** SQL file (no ledger):

   ```bash
   npm run migrate:sql -- supabase/migrations/20260212_categories_page_fields.sql
   ```

The `pg` package is already in **devDependencies**; run `npm install` if you have not yet.

---

## Supabase Dashboard (no terminal)

1. Open [Supabase](https://supabase.com) → your project → **SQL Editor**.
2. Paste a migration file’s contents and click **Run**.

---

## `psql` only

```bash
psql "postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres" -f supabase/migrations/20260212_categories_page_fields.sql
```

---

## Supabase CLI (linked project + Docker optional)

If the repo is linked with `supabase link`:

```bash
npx supabase db push
```

`npx supabase migration up` applies only to a **local** stack started with `supabase start` (Docker). For this repo, prefer **`npm run db:migrate`** with `DATABASE_URL` above.

---

After migrations, restart `npm run dev`, open `/category/wedding` (or your slug), and use **Dashboard → Frontend — Sections → Categories** (the **Cards & pages** tab opens first) to edit page content and gallery.
