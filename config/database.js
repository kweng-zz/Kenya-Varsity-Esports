const path = require('path');

module.exports = ({ env }) => {
  // Helper functions to handle env methods safely
  const envInt = (key, defaultValue) => {
    if (env.int) return env.int(key, defaultValue);
    const val = env(key, defaultValue);
    return typeof val === 'string' ? parseInt(val, 10) : val;
  };
  
  const envBool = (key, defaultValue) => {
    if (env.bool) return env.bool(key, defaultValue);
    const val = env(key, defaultValue);
    if (typeof val === 'string') return val.toLowerCase() === 'true';
    return val;
  };
  
  // Default to SQLite for simplicity
  const client = env('DATABASE_CLIENT', 'sqlite');
  
  // SQLite configuration (default)
  if (client === 'sqlite') {
    return {
      connection: {
        client: 'sqlite',
        connection: {
          filename: path.join(__dirname, '..', '..', env('DATABASE_FILENAME', '.tmp/data.db')),
        },
        useNullAsDefault: true,
        acquireConnectionTimeout: envInt('DATABASE_CONNECTION_TIMEOUT', 60000),
      },
    };
  }
  
  // PostgreSQL configuration
  if (client === 'postgres') {
    return {
      connection: {
        client: 'postgres',
        connection: {
          connectionString: env('DATABASE_URL'),
          host: env('DATABASE_HOST', 'localhost'),
          port: envInt('DATABASE_PORT', 5432),
          database: env('DATABASE_NAME', 'strapi'),
          user: env('DATABASE_USERNAME', 'strapi'),
          password: env('DATABASE_PASSWORD', 'strapi'),
          ssl: envBool('DATABASE_SSL', false),
          schema: env('DATABASE_SCHEMA', 'public'),
        },
        pool: { 
          min: envInt('DATABASE_POOL_MIN', 2), 
          max: envInt('DATABASE_POOL_MAX', 10) 
        },
        acquireConnectionTimeout: envInt('DATABASE_CONNECTION_TIMEOUT', 60000),
      },
    };
  }
  
  // MySQL configuration
  if (client === 'mysql') {
    return {
      connection: {
        client: 'mysql',
        connection: {
          host: env('DATABASE_HOST', 'localhost'),
          port: envInt('DATABASE_PORT', 3306),
          database: env('DATABASE_NAME', 'strapi'),
          user: env('DATABASE_USERNAME', 'strapi'),
          password: env('DATABASE_PASSWORD', 'strapi'),
          ssl: envBool('DATABASE_SSL', false),
        },
        pool: { 
          min: envInt('DATABASE_POOL_MIN', 2), 
          max: envInt('DATABASE_POOL_MAX', 10) 
        },
        acquireConnectionTimeout: envInt('DATABASE_CONNECTION_TIMEOUT', 60000),
      },
    };
  }
  
  // Fallback to SQLite
  return {
    connection: {
      client: 'sqlite',
      connection: {
        filename: path.join(__dirname, '..', '..', '.tmp/data.db'),
      },
      useNullAsDefault: true,
      acquireConnectionTimeout: 60000,
    },
  };
};