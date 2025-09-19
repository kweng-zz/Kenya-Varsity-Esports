import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    domains: [
      "c.animaapp.com",
      "placehold.co",
      "fra.cloud.appwrite.io",
      "img.youtube.com"
    ],
  }
};

export default nextConfig;
