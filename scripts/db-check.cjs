/**
 * Quick check that DATABASE_URL reaches Postgres.
 * Usage: npm run db:check
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
  const url = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
  if (!url) {
    console.error("Missing DATABASE_URL in .env.local — see .env.local.example");
    process.exit(1);
  }
  const { Client } = require("pg");
  const client = new Client({
    connectionString: url,
    ssl: url.includes("localhost") || url.includes("127.0.0.1") ? undefined : { rejectUnauthorized: false },
  });
  await client.connect();
  try {
    const { rows } = await client.query("select current_database() as db, current_user as role, version()");
    console.log("Connected OK:", rows[0].db, "as", rows[0].role);
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error("Connection failed:", e.message || e);
  process.exit(1);
});
