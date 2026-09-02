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
      {
        protocol: 'https',
        hostname: 'p16-cc-image-search-sign-sg.ibyteimg.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
      {
        protocol: 'https',
        hostname: 'sgrlnwyawzeqlpsxgbdm.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'cdn11.bigcommerce.com',
      },
    ],
  },
};

export default nextConfig;
