import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Ignore TypeScript errors during build
  },
  experimental: {
    reactCompiler: true,
  },
};

export default nextConfig;
