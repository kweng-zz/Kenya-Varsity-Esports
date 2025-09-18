module.exports = {
  apps: [
    {
      name: 'kuer-strapi',
      cwd: './kuer',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 1337,
        HOST: '0.0.0.0',
      },
    },
    {
      name: 'kuer-nextjs',
      script: 'npm',
      args: 'run start:next',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        NEXT_PUBLIC_STRAPI_URL: 'http://localhost:1337',
      },
    },
  ],
};