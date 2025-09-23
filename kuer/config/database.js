const path = require('path');

module.exports = ({ env }) => {
  console.log('🔧 DATABASE CONFIG LOADING - KUER JS');
  console.log('🔧 ENV FUNCTION:', typeof env);
  console.log('🔧 NODE_ENV:', env('NODE_ENV'));
  console.log('🔧 DATABASE_CLIENT:', env('DATABASE_CLIENT'));
  console.log('🔧 DATABASE_URL:', env('DATABASE_URL') ? 'SET' : 'NOT SET');
  
  try {
    // Use PostgreSQL in production if DATABASE_URL is provided
    if (env('DATABASE_URL')) {
      const config = {
        connection: {
          client: 'postgres',
          connection: {
            connectionString: env('DATABASE_URL'),
            ssl: env('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
          },
          acquireConnectionTimeout: 60000,
          pool: {
            min: 0,
            max: 10,
          },
        },
      };
      
      console.log('✅ USING POSTGRESQL CONFIG');
      return config;
    }
    
    // Use SQLite for development
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

    console.log('✅ USING SQLITE CONFIG');
    console.log('✅ DATABASE CONFIG CREATED:', JSON.stringify(config, null, 2));
    
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