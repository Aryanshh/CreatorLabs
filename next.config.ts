import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Force turbopack to use the current directory as root to fix 404s
    turbopack: {
      root: __dirname,
    }
  }
};

export default nextConfig;
