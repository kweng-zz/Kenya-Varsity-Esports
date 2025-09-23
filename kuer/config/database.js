const path = require('path');

module.exports = ({ env }) => {
  // Helper functions to handle env methods safely
  const envInt = (key, defaultValue) => {
    if (!env) return defaultValue;
    if (env.int) return env.int(key, defaultValue);
    const val = env(key, defaultValue);
    return typeof val === 'string' ? parseInt(val, 10) : val;
  };
  
  const envBool = (key, defaultValue) => {
    if (!env) return defaultValue;
    if (env.bool) return env.bool(key, defaultValue);
    const val = env(key, defaultValue);
    if (typeof val === 'string') return val.toLowerCase() === 'true';
    return val;
  };
  
  const envStr = (key, defaultValue) => {
    if (!env) return defaultValue;
    return env(key, defaultValue);
  };

  // For production deployments (Vercel, Railway), prefer PostgreSQL
  const client = envStr('DATABASE_CLIENT', (envStr('VERCEL') || envStr('RAILWAY_ENVIRONMENT')) ? 'postgres' : 'sqlite');

  // SQLite configuration (default)
  if (client === 'sqlite') {
    return {
      connection: {
        client: 'sqlite',
        connection: {
          filename: path.join(__dirname, '..', envStr('DATABASE_FILENAME', '.tmp/data.db')),
        },
        useNullAsDefault: true,
        acquireConnectionTimeout: envInt('DATABASE_CONNECTION_TIMEOUT', 60000),
      },
    };
  }

  // PostgreSQL configuration
  if (client === 'postgres' || client === 'postgresql') {
    const config = {
      connection: {
        client: 'postgres',
        connection: {
          host: envStr('DATABASE_HOST', 'localhost'),
          port: envInt('DATABASE_PORT', 5432),
          database: envStr('DATABASE_NAME', 'strapi'),
          user: envStr('DATABASE_USERNAME', 'strapi'),
          password: envStr('DATABASE_PASSWORD', 'strapi'),
          schema: envStr('DATABASE_SCHEMA', 'public'),
        },
        pool: { 
          min: envInt('DATABASE_POOL_MIN', 2), 
          max: envInt('DATABASE_POOL_MAX', 10) 
        },
        acquireConnectionTimeout: envInt('DATABASE_CONNECTION_TIMEOUT', 60000),
      },
    };

    // Add DATABASE_URL if provided
    if (envStr('DATABASE_URL')) {
      config.connection.connection.connectionString = envStr('DATABASE_URL');
    }

    // Add SSL configuration if needed
    const sslDefault = envStr('VERCEL') || envStr('RAILWAY_ENVIRONMENT') ? true : false;
    if (envBool('DATABASE_SSL', sslDefault)) {
      config.connection.connection.ssl = {
        rejectUnauthorized: envBool('DATABASE_SSL_REJECT_UNAUTHORIZED', false),
      };
    }

    return config;
  }

  // MySQL configuration
  if (client === 'mysql') {
    const config = {
      connection: {
        client: 'mysql',
        connection: {
          host: envStr('DATABASE_HOST', 'localhost'),
          port: envInt('DATABASE_PORT', 3306),
          database: envStr('DATABASE_NAME', 'strapi'),
          user: envStr('DATABASE_USERNAME', 'strapi'),
          password: envStr('DATABASE_PASSWORD', 'strapi'),
        },
        pool: { 
          min: envInt('DATABASE_POOL_MIN', 2), 
          max: envInt('DATABASE_POOL_MAX', 10) 
        },
        acquireConnectionTimeout: envInt('DATABASE_CONNECTION_TIMEOUT', 60000),
      },
    };

    // Add DATABASE_URL if provided
    if (envStr('DATABASE_URL')) {
      config.connection.connection.connectionString = envStr('DATABASE_URL');
    }

    // Add SSL configuration if needed
    if (envBool('DATABASE_SSL', false)) {
      config.connection.connection.ssl = {
        rejectUnauthorized: envBool('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
      };
    }

    return config;
  }

  // Fallback to SQLite
  return {
    connection: {
      client: 'sqlite',
      connection: {
        filename: path.join(__dirname, '..', '.tmp/data.db'),
      },
      useNullAsDefault: true,
      acquireConnectionTimeout: 60000,
    },
  };
};