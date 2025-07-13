import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@genkit-ai/core', 'genkit'],
  experimental: {
    optimizePackageImports: ['@genkit-ai/core', 'genkit'],
  },
  webpack: (config, { isServer }) => {
    // Handle Firebase and other Node.js modules in client-side code
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

    // Handle handlebars and other problematic modules
    config.module.rules.push({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false,
      },
    });

    // Ignore specific modules that cause issues during build
    config.externals = config.externals || [];
    if (isServer) {
      config.externals.push({
        '@opentelemetry/exporter-jaeger': 'commonjs @opentelemetry/exporter-jaeger',
      });
    }

    return config;
  },
  // Disable static generation for pages that use Firebase auth
  generateStaticParams: async () => {
    return [];
  },
  // Add environment variable handling
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // Optimize for Firebase App Hosting
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
