module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 8080),
  app: {
    keys: env.array('APP_KEYS', ['defaultKey1', 'defaultKey2']),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
  // Production settings
  ...(env('NODE_ENV') === 'production' && {
    url: env('STRAPI_URL') || env('RAILWAY_STATIC_URL') ? `https://${env('RAILWAY_STATIC_URL')}` : 'http://localhost:8080',
    proxy: env.bool('STRAPI_PROXY', true),
  }),
});