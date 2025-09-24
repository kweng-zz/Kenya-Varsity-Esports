import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for Vercel deployment
  output: 'standalone',
  
  // Fix workspace root warning
  outputFileTracingRoot: __dirname,
  
  // Image optimization
  images: {
    domains: [
      'localhost',
      'c.animaapp.com', // Add animaapp.com domain
      'images.ctfassets.net', // Contentful images
      'fra.cloud.appwrite.io', // Appwrite images
      'cloud.appwrite.io', // Appwrite images (general)
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.onrender.com',
        port: '',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'c.animaapp.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.cloud.appwrite.io',
        port: '',
        pathname: '/v1/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'fra.cloud.appwrite.io',
        port: '',
        pathname: '/v1/storage/**',
      }
    ],
  },

  // Environment variables
  env: {
    SKIP_STRAPI_BUILD: process.env.SKIP_STRAPI_BUILD || 'true',
    NEXT_PUBLIC_CONTENTFUL_SPACE_ID: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
    NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN,
    NEXT_PUBLIC_FALLBACK_MODE: process.env.NEXT_PUBLIC_FALLBACK_MODE,
  },

  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Ignore Strapi files during build
    config.watchOptions = {
      ...config.watchOptions,
      ignored: [
        '**/node_modules/**',
        '**/kuer/**',
        '**/kuer-backend/**',
        '**/.strapi/**',
        '**/strapi-render-deploy/**',
      ],
    };

    return config;
  },

  // Server external packages (moved from experimental)
  serverExternalPackages: ['@strapi/strapi'],

  // TypeScript configuration
  typescript: {
    // Skip type checking during build (Vercel will handle this)
    ignoreBuildErrors: false,
  },

  // ESLint configuration
  eslint: {
    // Skip ESLint during build if needed
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;