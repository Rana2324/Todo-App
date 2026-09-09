import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allows next/image to optimize todo images once S3 is configured
    // (Phase 5's local-disk fallback path is same-origin, no config needed).
    remotePatterns: [{ protocol: "https", hostname: "*.s3.*.amazonaws.com" }],
  },
};

export default nextConfig;
