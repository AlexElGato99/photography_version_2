const BLOCKED_HOSTS = new Set([
  "localhost",
  "metadata.google.internal",
  "metadata.goog",
]);

/**
 * Basic SSRF guard for server-side image fetch (dashboard ingest).
 */
export function isSafePublicHttpsImageUrl(urlString: string): boolean {
  let url: URL;
  try {
    url = new URL(urlString.trim());
  } catch {
    return false;
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    return false;
  }

  // Production: prefer HTTPS only; allow HTTP in local dev for tests
  if (url.protocol === "http:" && process.env.NODE_ENV === "production") {
    return false;
  }

  const host = url.hostname.toLowerCase();
  if (BLOCKED_HOSTS.has(host)) return false;
  if (host.endsWith(".localhost") || host.endsWith(".local")) return false;

  // Link-local / metadata
  if (host === "0.0.0.0" || host === "[::1]") return false;
  if (host.startsWith("169.254.")) return false;

  const ipv4 = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const m = host.match(ipv4);
  if (m) {
    const a = Number(m[1]);
    const b = Number(m[2]);
    if (a === 10) return false;
    if (a === 172 && b >= 16 && b <= 31) return false;
    if (a === 192 && b === 168) return false;
    if (a === 127) return false;
    if (a === 0) return false;
    if (a === 100 && b >= 64 && b <= 127) return false; // CGNAT
  }

  return true;
}

export function isAlreadySiteMediaWebp(
  urlString: string,
  supabaseProjectUrl: string | undefined
): boolean {
  if (!supabaseProjectUrl) return false;
  try {
    const u = new URL(urlString.trim());
    const base = new URL(supabaseProjectUrl);
    if (u.hostname !== base.hostname) return false;
    if (!u.pathname.includes("/object/public/site-media/")) return false;
    return u.pathname.toLowerCase().endsWith(".webp");
  } catch {
    return false;
  }
}
