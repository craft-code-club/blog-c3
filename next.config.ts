import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: "export",
  images: {
    loader: 'custom',
    loaderFile: './imageLoader.ts',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**',
      },
    ],
    unoptimized: process.env.NODE_ENV === 'production', // This ensures external images aren't processed in production
  },
};

export default nextConfig;
