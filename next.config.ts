import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for Firebase App Hosting
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
  
  // Handle problematic modules
  webpack: (config: any) => {
    config.ignoreWarnings = [
      (warning: any) =>
        typeof warning.message === 'string' &&
        warning.message.includes('require.extensions is not supported by webpack'),
    ];
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
    return config;
  },
};

export default nextConfig;
