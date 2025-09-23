module.exports = ({ env }) => {
  const port = env.int('PORT', 1337);
  const host = env('HOST', '0.0.0.0');
  
  console.log('🔧 SERVER CONFIG - HOST:', host, 'PORT:', port);
  console.log('🔧 NODE_ENV:', env('NODE_ENV'));
  console.log('🔧 RENDER_EXTERNAL_URL:', env('RENDER_EXTERNAL_URL'));
  
  return {
    host,
    port,
    app: {
      keys: env.array('APP_KEYS', ['defaultKey1', 'defaultKey2', 'defaultKey3', 'defaultKey4']),
    },
    webhooks: {
      populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
    },
    // Production settings
    ...(env('NODE_ENV') === 'production' && {
      url: env('RENDER_EXTERNAL_URL') || env('STRAPI_URL') || env('RAILWAY_STATIC_URL') ? `https://${env('RAILWAY_STATIC_URL')}` : env('VERCEL_URL') ? `https://${env('VERCEL_URL')}` : `http://localhost:${port}`,
      proxy: env.bool('STRAPI_PROXY', true),
    }),
    // Render-specific settings
    ...(env('RENDER') && {
      serveAdminPanel: env.bool('SERVE_ADMIN_PANEL', true),
      autoReload: false,
    }),
    // Railway-specific settings
    ...(env('RAILWAY_ENVIRONMENT') && {
      serveAdminPanel: env.bool('SERVE_ADMIN_PANEL', true),
      autoReload: false,
      admin: {
        build: {
          backend: env('STRAPI_URL') || env('RAILWAY_STATIC_URL') ? `https://${env('RAILWAY_STATIC_URL')}` : `http://localhost:${port}`,
        },
      },
    }),
    // Vercel-specific settings
    ...(env('VERCEL') && {
      serveAdminPanel: false, // Disable admin panel in serverless
      autoReload: false,
    }),
  };
};