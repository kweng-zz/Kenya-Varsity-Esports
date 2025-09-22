export default [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'market-assets.strapi.io',
            'res.cloudinary.com',
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'market-assets.strapi.io',
            'res.cloudinary.com',
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: ({ env }: { env: (key: string, defaultValue?: string) => string }) => {
        const allowedOrigins = [
          'http://localhost:3000',
          'http://127.0.0.1:3000',
          'https://www.kenyaesportsrankings.org',
          'https://kenyaesportsrankings.org',
          'https://kuer-production.up.railway.app',
        ];

        // Add custom origins from environment variable
        const customOrigins = env('ALLOWED_ORIGINS', '').split(',').filter(Boolean);
        allowedOrigins.push(...customOrigins);

        // Add development origins in development mode
        if (env('NODE_ENV') === 'development') {
          allowedOrigins.push('http://localhost:3001', 'http://127.0.0.1:3001');
        }

        return allowedOrigins;
      },
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
      keepHeaderOnError: true,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
