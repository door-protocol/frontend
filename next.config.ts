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
};

export default nextConfig;
