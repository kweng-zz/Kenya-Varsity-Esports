const path = require('path');

module.exports = ({ env }) => {
  console.log('🔧 DATABASE CONFIG LOADING - KUER');
  console.log('🔧 ENV FUNCTION:', typeof env);
  
  try {
    const config = {
      connection: {
        client: 'sqlite',
        connection: {
          filename: path.join(__dirname, '..', '.tmp', 'data.db'),
        },
        useNullAsDefault: true,
        acquireConnectionTimeout: 60000,
      },
    };

    console.log('✅ DATABASE CONFIG CREATED:', JSON.stringify(config, null, 2));
    console.log('✅ CONFIG.CONNECTION:', config.connection);
    console.log('✅ CONFIG.CONNECTION.CLIENT:', config.connection.client);
    
    return config;
  } catch (error) {
    console.error('❌ DATABASE CONFIG ERROR:', error);
    
    // Fallback configuration
    return {
      connection: {
        client: 'sqlite',
        connection: {
          filename: '.tmp/data.db',
        },
        useNullAsDefault: true,
        acquireConnectionTimeout: 60000,
      },
    };
  }
};