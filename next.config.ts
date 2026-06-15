import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project. Without this, Next infers the root
  // from the nearest lockfile and can pick up a stray ~/package-lock.json.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
