import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
