import type { NextConfig } from "next";

// Extendemos el tipo con allowedDevOrigins
type ExtendedNextConfig = NextConfig & {
  allowedDevOrigins?: string[];
};

const nextConfig: ExtendedNextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  trailingSlash: true,
  allowedDevOrigins: ["http://192.168.1.39"],
};

export default nextConfig;
