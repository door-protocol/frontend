import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  compiler: {
    // Remove console.log, console.info, etc. in production builds
    // Keep console.error and console.warn
    removeConsole: {
      exclude: ['error', 'warn'],
    },
  },
  // Turbopack configuration for Next.js 16+
  turbopack: {},
  // Exclude external and keeper-bot folders from webpack watch (fallback for webpack mode)
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/external/**', '**/keeper-bot/**', '**/node_modules/**'],
    };
    return config;
  },
};

export default nextConfig;
