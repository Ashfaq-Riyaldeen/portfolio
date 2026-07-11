import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // three's root export is a big barrel — import only what's used
    optimizePackageImports: ["three"],
  },
  images: {
    remotePatterns: [
      // YouTube video thumbnails (lite embed facade)
      { protocol: "https", hostname: "i.ytimg.com" },
      // Supabase Storage (Phase 4 — uploaded images/certificates)
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

export default nextConfig;
