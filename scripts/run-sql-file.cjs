/**
 * Run a .sql file against Postgres (e.g. Supabase).
 *
 * Usage:
 *   node scripts/run-sql-file.cjs supabase/migrations/20260212_categories_page_fields.sql
 *
 * Requires in .env.local (or env):
 *   DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
 *
 * Use the direct connection (port 5432), not the pooler, for DDL if the pooler rejects it.
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

async function main() {
  loadEnvLocal();
  const rel = process.argv[2];
  if (!rel) {
    console.error("Usage: node scripts/run-sql-file.cjs <path-to.sql>");
    process.exit(1);
  }
  const abs = path.isAbsolute(rel) ? rel : path.join(process.cwd(), rel);
  if (!fs.existsSync(abs)) {
    console.error("File not found:", abs);
    process.exit(1);
  }
  const url = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
  if (!url) {
    console.error(
      "Missing DATABASE_URL (or SUPABASE_DB_URL).\n" +
        "Add your Postgres URI to .env.local — see supabase/MIGRATIONS.md"
    );
    process.exit(1);
  }

  let Client;
  try {
    ({ Client } = require("pg"));
  } catch {
    console.error('Please install dev dependency: npm install pg --save-dev\n  (then re-run this script.)');
    process.exit(1);
  }

  const sql = fs.readFileSync(abs, "utf8");
  const client = new Client({
    connectionString: url,
    ssl: url.includes("localhost") ? undefined : { rejectUnauthorized: false },
  });
  await client.connect();
  try {
    await client.query(sql);
    console.log("Applied SQL file successfully:", path.relative(process.cwd(), abs));
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
