import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for Vercel deployment
  output: 'standalone',
  
  // Fix workspace root warning
  outputFileTracingRoot: __dirname,

  // Cache control headers for better control over stale data
  headers: async () => {
    // Allowed origins for CORS
    const allowedOrigins = [
      'https://tunzaesports.com',
      'https://www.tunzaesports.com',
      'https://kuer.co.ke',
      'https://www.kuer.co.ke',
      'http://localhost:3000',
      'http://localhost:3001'
    ];

    // Get origin from request or use default
    const getOriginHeaders = (origin: string | undefined) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return [
          {
            key: 'Access-Control-Allow-Origin',
            value: origin || allowedOrigins[0],
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          }
        ];
      }
      
      // Return empty for unauthorized origins
      return [];
    };

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
              {
                key: 'Access-Control-Allow-Methods',
                value: 'GET, POST, PUT, DELETE, OPTIONS',
              },
              {
                key: 'Access-Control-Allow-Headers',
                value: 'Content-Type, Authorization, X-Requested-With',
              },
              {
                key: 'Access-Control-Max-Age',
                value: '86400',
              },
              {
                key: 'Vary',
                value: 'Origin',
              },
              ...getOriginHeaders(process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : undefined)
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
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-Requested-With',
          },
          {
            key: 'Access-Control-Max-Age',
            value: '86400',
          },
          {
            key: 'Vary',
            value: 'Origin',
          },
          ...getOriginHeaders(undefined)
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-Requested-With',
          },
          {
            key: 'Access-Control-Max-Age',
            value: '86400',
          },
          {
            key: 'Vary',
            value: 'Origin',
          },
          ...getOriginHeaders(undefined)
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
    CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID,
    CONTENTFUL_ACCESS_TOKEN: process.env.CONTENTFUL_ACCESS_TOKEN,
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