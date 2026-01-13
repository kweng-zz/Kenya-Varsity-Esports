import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for Vercel deployment
  output: 'standalone',
  
  // Fix workspace root warning
  outputFileTracingRoot: __dirname,

  // Cache control headers for better control over stale data
  headers: async () => {
    // In development, we want no caching to avoid stuck stale content
    if (process.env.NODE_ENV === 'development') {
        return [
          {
            source: '/:path*',
            headers: [
              {
                key: 'Cache-Control',
                value: 'no-cache, no-store, must-revalidate',
              },
            ],
          },
        ];
    }

    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Revalidation configuration for ISR
  onDemandEntries: {
    maxInactiveAge: 60 * 1000, // 1 minute
    pagesBufferLength: 5,
  },
  
  // Image optimization
  images: {
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

  // Webpack configuration for stability
  webpack: (config, { isServer }) => {
    // Disable Turbopack and use webpack
    return config;
  },

  // Turbopack configuration (empty to use defaults)
  turbopack: {},

  // Server external packages (moved from experimental)
  serverExternalPackages: ['@strapi/strapi'],

  // TypeScript configuration
  typescript: {
    // Skip type checking during build (Vercel will handle this)
    ignoreBuildErrors: false,
  },
};

export default nextConfig;