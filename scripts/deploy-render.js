#!/usr/bin/env node

/**
 * Deploy Strapi to Render.com
 * This script prepares your Strapi backend for Render deployment
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync, copyFileSync, writeFileSync, readFileSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('🚀 Setting up Strapi for Render deployment...');

try {
  // Check if kuer directory exists
  const strapiDir = join(projectRoot, 'kuer');
  if (!existsSync(strapiDir)) {
    console.error('❌ Strapi directory (kuer) not found!');
    process.exit(1);
  }

  // Create deployment directory
  const deployDir = join(projectRoot, 'strapi-render-deploy');
  if (existsSync(deployDir)) {
    rmSync(deployDir, { recursive: true, force: true });
  }
  mkdirSync(deployDir, { recursive: true });
  console.log('📁 Created deployment directory:', deployDir);

  // Copy Strapi files
  console.log('📋 Copying Strapi files...');
  
  // Copy essential directories and files
  const itemsToCopy = [
    'api',
    'config', 
    'database',
    'src',
    'types',
    'public',
    'package.json',
    'tsconfig.json',
    'README.md'
  ];

  itemsToCopy.forEach(item => {
    const srcPath = join(strapiDir, item);
    const destPath = join(deployDir, item);
    
    if (existsSync(srcPath)) {
      try {
        if (process.platform === 'win32') {
          // Windows
          execSync(`xcopy "${srcPath}" "${destPath}" /E /I /H /Y`, { stdio: 'pipe' });
        } else {
          // Unix/Linux/Mac
          execSync(`cp -r "${srcPath}" "${destPath}"`, { stdio: 'pipe' });
        }
        console.log(`✅ Copied ${item}`);
      } catch (error) {
        console.log(`⚠️  Could not copy ${item}:`, error.message);
      }
    }
  });

  // Update package.json for Render
  const packageJsonPath = join(deployDir, 'package.json');
  if (existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
    
    // Update scripts for Render
    packageJson.scripts = {
      ...packageJson.scripts,
      "start": "strapi start",
      "build": "strapi build",
      "postinstall": "strapi build"
    };

    // Ensure PostgreSQL is in dependencies
    if (!packageJson.dependencies['pg']) {
      packageJson.dependencies['pg'] = '^8.11.3';
    }

    // Remove SQLite dependency for production
    if (packageJson.dependencies['better-sqlite3']) {
      delete packageJson.dependencies['better-sqlite3'];
    }

    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('✅ Updated package.json for Render');
  }

  // Create production database config
  const dbConfigPath = join(deployDir, 'config', 'database.js');
  const dbConfig = `const path = require('path');

module.exports = ({ env }) => {
  // Production database configuration for Render
  if (env('NODE_ENV') === 'production') {
    return {
      connection: {
        client: 'postgres',
        connection: {
          connectionString: env('DATABASE_URL'),
          ssl: env.bool('DATABASE_SSL', false) && {
            rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
          },
        },
        pool: {
          min: env.int('DATABASE_POOL_MIN', 2),
          max: env.int('DATABASE_POOL_MAX', 10),
        },
        acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
      },
    };
  }

  // Development database configuration (SQLite)
  return {
    connection: {
      client: 'sqlite',
      connection: {
        filename: path.join(__dirname, '..', '.tmp', 'data.db'),
      },
      useNullAsDefault: true,
      acquireConnectionTimeout: 60000,
    },
  };
};`;

  writeFileSync(dbConfigPath, dbConfig);
  console.log('✅ Updated database config for production');

  // Create server config for Render
  const serverConfigPath = join(deployDir, 'config', 'server.js');
  const serverConfig = `module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS', ['defaultKey1', 'defaultKey2']),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});`;

  writeFileSync(serverConfigPath, serverConfig);
  console.log('✅ Created server config');

  // Update middlewares for CORS
  const middlewaresConfigPath = join(deployDir, 'config', 'middlewares.js');
  const middlewaresConfig = `module.exports = [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'market-assets.strapi.io'],
          'media-src': ["'self'", 'data:', 'blob:'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      headers: '*',
      origin: [
        'http://localhost:3000',
        'https://localhost:3000',
        'https://your-frontend-domain.vercel.app', // Replace with your actual Vercel domain
        /\\.vercel\\.app$/,
        /\\.netlify\\.app$/,
      ]
    }
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];`;

  writeFileSync(middlewaresConfigPath, middlewaresConfig);
  console.log('✅ Updated CORS configuration');

  // Create .env.example for Render
  const envExample = `# Strapi Production Environment Variables for Render

# Environment
NODE_ENV=production

# Database (PostgreSQL - Render will provide DATABASE_URL)
DATABASE_URL=postgresql://username:password@host:port/database

# Strapi Configuration (Generate secure values!)
APP_KEYS=key1,key2,key3,key4
JWT_SECRET=your-jwt-secret-here
ADMIN_JWT_SECRET=your-admin-jwt-secret-here
API_TOKEN_SALT=your-api-token-salt-here
TRANSFER_TOKEN_SALT=your-transfer-token-salt-here

# Server Configuration
HOST=0.0.0.0
PORT=10000

# Admin Panel
ADMIN_PATH=/admin

# Optional: Strapi Cloud
# STRAPI_PLUGIN_CLOUD_API_TOKEN=your-cloud-token
`;

  writeFileSync(join(deployDir, '.env.example'), envExample);
  console.log('✅ Created .env.example');

  // Create render.yaml for automatic deployment
  const renderYaml = `services:
  - type: web
    name: kuer-strapi-backend
    env: node
    plan: free
    buildCommand: npm install && npm run build
    startCommand: npm start
    healthCheckPath: /
    envVars:
      - key: NODE_ENV
        value: production
      - key: HOST
        value: 0.0.0.0
      - key: PORT
        value: 10000
      - key: APP_KEYS
        generateValue: true
      - key: JWT_SECRET
        generateValue: true
      - key: ADMIN_JWT_SECRET
        generateValue: true
      - key: API_TOKEN_SALT
        generateValue: true
      - key: TRANSFER_TOKEN_SALT
        generateValue: true

databases:
  - name: kuer-postgres
    plan: free
`;

  writeFileSync(join(deployDir, 'render.yaml'), renderYaml);
  console.log('✅ Created render.yaml');

  // Create .gitignore
  const gitignoreContent = `############################
# OS X
############################

.DS_Store
.AppleDouble
.LSOverride
Icon
.Spotlight-V100
.Trashes
._*

############################
# Linux
############################

*~

############################
# Windows
############################

Thumbs.db
ehthumbs.db
Desktop.ini
$RECYCLE.BIN/
*.cab
*.msi
*.msm
*.msp

############################
# Packages
############################

*.7z
*.csv
*.dat
*.dmg
*.gz
*.iso
*.jar
*.rar
*.tar
*.zip
*.com
*.class
*.dll
*.exe
*.o
*.seed
*.so
*.swo
*.swp
*.swn
*.swm
*.out
*.pid

############################
# Logs and databases
############################

.tmp
*.log
*.sql
*.sqlite
*.sqlite3

############################
# Misc.
############################

*#
ssl
.idea
nbproject
public/uploads/*
!public/uploads/.gitkeep

############################
# Node.js
############################

lib-cov
lcov.info
pids
logs
results
node_modules
.node_history

############################
# Tests
############################

coverage

############################
# Strapi
############################

.env
license.txt
exports
*.cache
dist
build
.strapi-updater.json
.strapi/
`;

  writeFileSync(join(deployDir, '.gitignore'), gitignoreContent);
  console.log('✅ Created .gitignore');

  // Create deployment README
  const deployReadme = `# KUER Strapi Backend - Render Deployment

This is the Strapi backend for the KUER esports platform, configured for deployment on Render.

## 🚀 Quick Deploy to Render

### Option 1: Automatic Deploy (Recommended)
1. Push this repository to GitHub
2. Go to [Render.com](https://render.com) and sign up/login
3. Click "New +" ��� "Blueprint"
4. Connect your GitHub repository
5. Render will automatically detect the \`render.yaml\` file and set up:
   - PostgreSQL database
   - Web service with environment variables
   - Automatic builds and deployments

### Option 2: Manual Setup
1. Create a new PostgreSQL database on Render
2. Create a new Web Service
3. Connect your GitHub repository
4. Set build command: \`npm install && npm run build\`
5. Set start command: \`npm start\`
6. Add environment variables (see below)

## 🔧 Environment Variables

Set these in your Render dashboard:

\`\`\`
NODE_ENV=production
HOST=0.0.0.0
PORT=10000
DATABASE_URL=[Render will provide this automatically]
APP_KEYS=[Generate 4 random strings separated by commas]
JWT_SECRET=[Generate a secure random string]
ADMIN_JWT_SECRET=[Generate a secure random string]
API_TOKEN_SALT=[Generate a secure random string]
TRANSFER_TOKEN_SALT=[Generate a secure random string]
\`\`\`

### Generate Secure Keys
You can generate secure keys using:
\`\`\`bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
\`\`\`

## 📝 After Deployment

1. **Access Admin Panel**: Visit \`https://your-app-name.onrender.com/admin\`
2. **Create Admin User**: Set up your first admin account
3. **Configure Content Types**: Set up your blog articles and other content
4. **Set Permissions**: Configure API permissions for public access
5. **Generate API Token**: Create an API token for your frontend

## 🔗 Frontend Integration

Update your Next.js app's environment variables:

### Vercel Environment Variables
\`\`\`
NEXT_PUBLIC_STRAPI_URL=https://your-app-name.onrender.com
STRAPI_API_TOKEN=your-generated-api-token
\`\`\`

### Local Development (.env.local)
\`\`\`
NEXT_PUBLIC_STRAPI_URL=https://your-app-name.onrender.com
STRAPI_API_TOKEN=your-generated-api-token
\`\`\`

## 🛠️ Local Development

To run locally:
\`\`\`bash
npm install
npm run develop
\`\`\`

## 📊 Monitoring

- **Logs**: Check Render dashboard for deployment and runtime logs
- **Health Check**: Render automatically monitors your service health
- **Database**: Monitor PostgreSQL usage in Render dashboard

## 🔒 Security Notes

1. **Never commit .env files** - they're in .gitignore
2. **Use strong, unique secrets** for all JWT and API tokens
3. **Configure CORS** properly in \`config/middlewares.js\`
4. **Set up proper API permissions** in Strapi admin panel

## 🆘 Troubleshooting

### Common Issues:
1. **Build fails**: Check Node.js version compatibility
2. **Database connection**: Ensure DATABASE_URL is set correctly
3. **CORS errors**: Update allowed origins in middlewares config
4. **Admin panel 404**: Check ADMIN_PATH environment variable

### Support:
- Render Documentation: https://render.com/docs
- Strapi Documentation: https://docs.strapi.io
`;

  writeFileSync(join(deployDir, 'README.md'), deployReadme);
  console.log('✅ Created deployment README');

  // Create a simple script to generate secrets
  const generateSecretsScript = `#!/usr/bin/env node

const crypto = require('crypto');

console.log('🔐 Generated Secure Keys for Strapi:');
console.log('');
console.log('Copy these to your Render environment variables:');
console.log('');
console.log('APP_KEYS=' + Array.from({length: 4}, () => crypto.randomBytes(32).toString('base64')).join(','));
console.log('JWT_SECRET=' + crypto.randomBytes(32).toString('base64'));
console.log('ADMIN_JWT_SECRET=' + crypto.randomBytes(32).toString('base64'));
console.log('API_TOKEN_SALT=' + crypto.randomBytes(32).toString('base64'));
console.log('TRANSFER_TOKEN_SALT=' + crypto.randomBytes(32).toString('base64'));
console.log('');
console.log('⚠️  Keep these secure and never commit them to version control!');
`;

  writeFileSync(join(deployDir, 'generate-secrets.js'), generateSecretsScript);
  console.log('✅ Created secrets generator script');

  console.log('\n🎉 Strapi Render deployment setup completed!');
  console.log('\n📋 Next Steps:');
  console.log('1. Navigate to the deployment directory:');
  console.log(`   cd "${deployDir}"`);
  console.log('2. Generate secure environment variables:');
  console.log('   node generate-secrets.js');
  console.log('3. Initialize git repository:');
  console.log('   git init');
  console.log('   git add .');
  console.log('   git commit -m "Initial Strapi backend for Render"');
  console.log('4. Push to GitHub:');
  console.log('   git remote add origin https://github.com/yourusername/kuer-strapi-backend.git');
  console.log('   git push -u origin main');
  console.log('5. Deploy on Render:');
  console.log('   - Go to render.com');
  console.log('   - Create new Blueprint');
  console.log('   - Connect your GitHub repo');
  console.log('   - Render will auto-deploy using render.yaml');
  console.log('6. Update your Next.js app environment variables');
  console.log('\n📖 See README.md in the deployment directory for detailed instructions');

} catch (error) {
  console.error('❌ Setup failed:', error.message);
  console.error(error.stack);
  process.exit(1);
}