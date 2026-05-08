import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.turboairinc.com',
      },
      {
        protocol: 'https',
        hostname: 'www.atlanticse.com',
      },
    ],
  },
};

export default nextConfig;
