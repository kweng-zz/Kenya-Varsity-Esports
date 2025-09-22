module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS', ['defaultKey1', 'defaultKey2', 'defaultKey3', 'defaultKey4']),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
  // Production settings
  ...(env('NODE_ENV') === 'production' && {
    url: env('STRAPI_URL') || env('RAILWAY_STATIC_URL') ? `https://${env('RAILWAY_STATIC_URL')}` : env('VERCEL_URL') ? `https://${env('VERCEL_URL')}` : 'http://localhost:1337',
    proxy: env.bool('STRAPI_PROXY', true),
  }),
  // Railway-specific settings
  ...(env('RAILWAY_ENVIRONMENT') && {
    serveAdminPanel: env.bool('SERVE_ADMIN_PANEL', true),
    autoReload: false,
  }),
  // Vercel-specific settings
  ...(env('VERCEL') && {
    serveAdminPanel: false, // Disable admin panel in serverless
    autoReload: false,
  }),
});