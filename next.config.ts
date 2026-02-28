import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.GITHUB_ACTIONS ? (process.env.BASE_PATH || "/prosemirror-mechanics") : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
