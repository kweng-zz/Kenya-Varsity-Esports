import path from 'path';

export default ({ env }) => {
  console.log('🔧 Loading kuer TypeScript database configuration...');
  
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

  console.log('✅ Kuer TypeScript database configuration loaded:', JSON.stringify(config, null, 2));
  return config;
};