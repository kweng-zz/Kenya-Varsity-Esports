module.exports = [
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
      origin: ({ env }) => {
        const allowedOrigins = [
          'http://localhost:3000',
          'http://127.0.0.1:3000',
          'https://www.kenyaesportsrankings.org',
          'https://kenyaesportsrankings.org',
          'https://kuer-production.up.railway.app',
          'https://kuer-strapi-backend-production.up.railway.app',
        ];

        // Add custom origins from environment variable
        const customOrigins = env('ALLOWED_ORIGINS', '').split(',').filter(Boolean);
        allowedOrigins.push(...customOrigins);

        // Add development origins in development mode
        if (env('NODE_ENV') === 'development') {
          allowedOrigins.push('http://localhost:3001', 'http://127.0.0.1:3001');
        }

        console.log('CORS allowed origins:', allowedOrigins);
        return allowedOrigins;
      },
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'X-Requested-With'],
      keepHeaderOnError: true,
      credentials: true,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];