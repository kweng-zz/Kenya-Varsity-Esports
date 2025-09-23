const path = require('path');

module.exports = ({ env }) => {
  console.log('🔧 Loading kuer database configuration...');
  
  // Create a completely safe database configuration
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

  console.log('✅ Kuer database configuration loaded:', JSON.stringify(config, null, 2));
  return config;
};