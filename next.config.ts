import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
  async rewrites() {
    return [
      {
        source: "/privacy.html",
        destination: "/privacy",
      },
      {
        source: "/terms.html",
        destination: "/terms",
      },
      {
        source: "/donate.html",
        destination: "/donate",
      },
    ];
  },
};

export default nextConfig;
