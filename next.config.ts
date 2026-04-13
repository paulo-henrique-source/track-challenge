import type { NextConfig } from "next";

const nextConfig: NextConfig =
  process.env.NODE_ENV === "development"
    ? {
        distDir: "next-dev-cache",
      }
    : {};

export default nextConfig;
