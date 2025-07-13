import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for Firebase App Hosting
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
  
  // Handle problematic modules
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };
    }
    return config;
  },
};

export default nextConfig;
