const fs = require("fs");
const path = require("path");

function loadEnvLocal() {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    const k = t.slice(0, eq).trim();
    let v = t.slice(eq + 1).trim();
    if (!process.env[k]) process.env[k] = v;
  }
}

async function main() {
  loadEnvLocal();
  const { createClient } = require("@supabase/supabase-js");
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  const { data, error } = await sb
    .from("footer_gallery_images")
    .select("id, image_url, position")
    .order("position");
  console.log("anon error:", error?.message ?? "none");
  console.log("anon rows:", data?.length ?? 0);
  if (data?.length) console.log("first url:", data[0].image_url?.slice(0, 80));

  const { Client } = require("pg");
  const c = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  await c.connect();
  const count = await c.query("select count(*)::int as n from public.footer_gallery_images");
  console.log("db count:", count.rows[0].n);
  const rls = await c.query(
    "select relrowsecurity from pg_class c join pg_namespace n on n.oid = c.relnamespace where c.relname = 'footer_gallery_images' and n.nspname = 'public'"
  );
  console.log("rls enabled:", rls.rows[0]?.relrowsecurity);
  const pol = await c.query(
    `select policyname, cmd from pg_policies where tablename = 'footer_gallery_images'`
  );
  console.log("policies:", pol.rows);
  await c.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
