/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow next/image to optimize from these external hosts
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.supabase.co" },       // Supabase Storage
      { protocol: "https", hostname: "**.supabase.in" },
      { protocol: "https", hostname: "**.pexels.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "**.cloudinary.com" },
      { protocol: "https", hostname: "**.imgix.net" },
    ],
    // Prefer WebP, fallback to AVIF for browsers that support it
    formats: ["image/avif", "image/webp"],
    // Use sharp for the image optimisation pipeline (already installed)
    loader: "default",
    minimumCacheTTL: 60 * 60 * 24 * 30, // cache for 30 days
  },
};

export default nextConfig;
