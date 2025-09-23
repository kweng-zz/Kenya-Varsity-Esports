import path from 'path';

export default ({ env }) => {
  // Helper functions to handle env methods safely
  const envInt = (key: string, defaultValue: number) => {
    if (!env) return defaultValue;
    if (env.int) return env.int(key, defaultValue);
    const val = env(key, defaultValue);
    return typeof val === 'string' ? parseInt(val, 10) : val;
  };
  
  const envBool = (key: string, defaultValue: boolean) => {
    if (!env) return defaultValue;
    if (env.bool) return env.bool(key, defaultValue);
    const val = env(key, defaultValue);
    if (typeof val === 'string') return val.toLowerCase() === 'true';
    return val;
  };
  
  const envStr = (key: string, defaultValue?: string) => {
    if (!env) return defaultValue;
    return env(key, defaultValue);
  };

  // Railway PostgreSQL configuration
  if (envStr('DATABASE_URL')) {
    const config = {
      connection: {
        client: 'postgres',
        connection: {
          connectionString: envStr('DATABASE_URL'),
        },
        pool: {
          min: envInt('DATABASE_POOL_MIN', 2),
          max: envInt('DATABASE_POOL_MAX', 10),
        },
        acquireConnectionTimeout: envInt('DATABASE_CONNECTION_TIMEOUT', 60000),
      },
    };

    // Add SSL configuration if needed
    if (envBool('DATABASE_SSL', false)) {
      config.connection.connection.ssl = {
        rejectUnauthorized: envBool('DATABASE_SSL_SELF', false),
      };
    }

    return config;
  }

  // Fallback to SQLite for local development
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
};
