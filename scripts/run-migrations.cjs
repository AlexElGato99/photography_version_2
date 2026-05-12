/**
 * Apply pending SQL files under supabase/migrations/ to Postgres (hosted Supabase).
 *
 * Usage:
 *   npm run db:migrate
 *
 * Requires in .env.local:
 *   DATABASE_URL=postgresql://postgres.[REF]:[PASSWORD]@db.[REF].supabase.co:5432/postgres
 *
 * Tracks applied files in public._pod_dashboard_migrations so re-runs are safe.
 * To re-apply one file after you changed it: delete that row in SQL Editor:
 *   delete from public._pod_dashboard_migrations where filename = '20260212_....sql';
 */
const fs = require("fs");
const path = require("path");

function loadEnvLocal() {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (!fs.existsSync(envPath)) return;
  const raw = fs.readFileSync(envPath, "utf8");
  for (const line of raw.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    const k = t.slice(0, eq).trim();
    let v = t.slice(eq + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    if (!process.env[k]) process.env[k] = v;
  }
}

const MIGRATIONS_DIR = path.join(__dirname, "..", "supabase", "migrations");
const LEDGER_TABLE = "public._pod_dashboard_migrations";

async function main() {
  loadEnvLocal();

  const url = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
  if (!url) {
    console.error(
      "Missing DATABASE_URL (or SUPABASE_DB_URL) in .env.local.\n\n" +
        "Supabase → Project Settings → Database → copy the direct URI (port 5432).\n" +
        "Example:\n" +
        "  DATABASE_URL=postgresql://postgres.[REF]:[PASSWORD]@db.[REF].supabase.co:5432/postgres\n"
    );
    process.exit(1);
  }

  let Client;
  try {
    ({ Client } = require("pg"));
  } catch {
    console.error("Install pg: npm install (pg is listed in devDependencies.)");
    process.exit(1);
  }

  if (!fs.existsSync(MIGRATIONS_DIR)) {
    console.error("Migrations folder not found:", MIGRATIONS_DIR);
    process.exit(1);
  }

  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  if (files.length === 0) {
    console.log("No .sql files in", path.relative(process.cwd(), MIGRATIONS_DIR));
    return;
  }

  const client = new Client({
    connectionString: url,
    ssl: url.includes("localhost") || url.includes("127.0.0.1") ? undefined : { rejectUnauthorized: false },
  });
  await client.connect();

  try {
    await client.query(`
      create table if not exists ${LEDGER_TABLE} (
        filename text primary key,
        applied_at timestamptz not null default now()
      );
    `);

    let applied = 0;
    let skipped = 0;

    for (const name of files) {
      const abs = path.join(MIGRATIONS_DIR, name);
      const sql = fs.readFileSync(abs, "utf8");

      const { rowCount } = await client.query(
        `select 1 from ${LEDGER_TABLE} where filename = $1`,
        [name]
      );
      if (rowCount > 0) {
        console.log("skip (already applied):", name);
        skipped += 1;
        continue;
      }

      console.log("apply:", name);
      await client.query(sql);
      await client.query(`insert into ${LEDGER_TABLE} (filename) values ($1)`, [name]);
      applied += 1;
    }

    console.log(`\nDone. Applied: ${applied}, skipped: ${skipped}.`);
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
