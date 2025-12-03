import type { NextConfig } from "next";
import withBundleAnalyzer from '@next/bundle-analyzer';

// Only enable in development
const withA = false;
const withBundleAnalyzerConfig = withA
  ? withBundleAnalyzer({ enabled: true })
  : (config: NextConfig) => config;


const nextConfig: NextConfig = {
  reactStrictMode: true,
  cacheComponents: true,
  compress: true,
  reactCompiler: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 1 week
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizeCss: true,
    turbopackFileSystemCacheForDev: true,
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
    ],
  },
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
      ],
    },
  ],
};

// Wrap the config with the bundle analyzer if enabled
module.exports = withBundleAnalyzerConfig(nextConfig);
