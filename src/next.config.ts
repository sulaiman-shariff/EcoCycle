import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for Firebase App Hosting
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
