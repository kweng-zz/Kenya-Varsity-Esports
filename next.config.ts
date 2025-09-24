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
      'your-strapi-domain.onrender.com', // Replace with your actual Render domain
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
      }
    ],
  },

  // Environment variables
  env: {
    SKIP_STRAPI_BUILD: process.env.SKIP_STRAPI_BUILD || 'true',
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