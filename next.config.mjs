/** @type {import('next').NextConfig} */
const nextConfig = {
  // Load sharp from node_modules at runtime (correct native binary per OS).
  // Avoids webpack bundling issues; pair with `npm rebuild sharp` when switching WSL ↔ Windows.
  experimental: {
    serverComponentsExternalPackages: ["sharp"],
  },
  images: {
    // Allow next/image to optimize from these external hosts
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "127.0.0.1" },
    ],
    // Serve WebP from the optimizer (CMS may point at AVIF/JPEG URLs on any CDN)
    formats: ["image/webp"],
    // Use sharp for the image optimisation pipeline (already installed)
    loader: "default",
    minimumCacheTTL: 60 * 60 * 24 * 30, // cache for 30 days
  },
};

export default nextConfig;
