const strapi = require('@strapi/strapi');

let instance;

async function createStrapi() {
  if (!instance) {
    instance = await strapi({
      // Disable some features that don't work well in serverless
      serveAdminPanel: false,
      autoReload: false,
    }).load();
  }
  return instance;
}

module.exports = async (req, res) => {
  try {
    const strapiInstance = await createStrapi();
    
    // Handle the request
    return strapiInstance.server.app.callback()(req, res);
  } catch (error) {
    console.error('Strapi error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};