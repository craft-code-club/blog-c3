import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: "export",
  images: {
    loader: 'custom',
    loaderFile: './imageLoader.ts',
  },
};

export default nextConfig;
