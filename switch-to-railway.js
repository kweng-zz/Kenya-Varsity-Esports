import fs from 'fs';
import path from 'path';

// Railway configuration with the generated secure keys
const railwayConfig = {
  // Frontend environment variables
  frontend: {
    'NEXT_PUBLIC_STRAPI_URL': 'https://kuer-production.up.railway.app',
    'NEXT_PUBLIC_BASE_URL': 'https://your-railway-frontend-url.up.railway.app',
    'NODE_ENV': 'production'
  },
  
  // Backend environment variables for Railway
  backend: {
    'APP_KEYS': '50e4f592829260c9116cd367b4ab21a5d6230ed9525f5f391c147d37c6889b4df3163c6825f80b5a68e845383c76a4f543d3eed09214bfc48bdd960c0f429c425c5ba52bf36dd1e322588f8e831c7fd6a8d8fd42160fddb6eab11ac90a4c6406fc89f8d978d027b0cda19635317535c1db53732ac5dc204afd5b6e6c8d7c3d17',
    'API_TOKEN_SALT': 'ad61338f9c4f5549d88ed1100cf1d58112e4b2e494ee03d595ed4f96b0007f64',
    'ADMIN_JWT_SECRET': '2b59738d18d391f8647cf080bac3ea33e5f8c45919fea9f99c740a7ba8e475a3',
    'TRANSFER_TOKEN_SALT': 'bd1ce74a833c6b89da591011e7c680c78d7901e526a0b1b331cd75877418d4eb',
    'JWT_SECRET': '197576366db4b56d4f01611bafec680fdbe75eddc3abd83c54e82627ce499983',
    'NODE_ENV': 'production',
    'HOST': '0.0.0.0',
    'PORT': '1337',
    'DATABASE_URL': 'your_railway_postgresql_url_here',
    'DATABASE_SSL': 'true',
    'RAILWAY_ENVIRONMENT': 'production'
  }
};

function updateEnvFile() {
  try {
    // Copy Railway environment to main .env file
    const envContent = Object.entries(railwayConfig.frontend)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    
    fs.writeFileSync('.env', envContent);
    console.log('✅ Updated .env file with Railway configuration');
    
    // Update .env.railway with backend variables
    const railwayEnvContent = Object.entries(railwayConfig.backend)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    
    fs.writeFileSync('.env.railway', railwayEnvContent);
    console.log('✅ Updated .env.railway file with secure keys');
    
  } catch (error) {
    console.error('❌ Error updating environment files:', error.message);
  }
}

function displayRailwayInstructions() {
  console.log('\n🚀 RAILWAY DEPLOYMENT INSTRUCTIONS');
  console.log('=' .repeat(60));
  
  console.log('\n1. ADD THESE ENVIRONMENT VARIABLES TO RAILWAY:');
  console.log('   Go to Railway Dashboard → Your Project → Variables');
  console.log('');
  
  Object.entries(railwayConfig.backend).forEach(([key, value]) => {
    if (key === 'DATABASE_URL') {
      console.log(`   ${key}=<your_railway_postgresql_connection_string>`);
    } else {
      console.log(`   ${key}=${value}`);
    }
  });
  
  console.log('\n2. SET UP POSTGRESQL DATABASE:');
  console.log('   - Add PostgreSQL service in Railway');
  console.log('   - Copy the connection string');
  console.log('   - Set it as DATABASE_URL environment variable');
  
  console.log('\n3. DEPLOY YOUR STRAPI BACKEND:');
  console.log('   - Connect your GitHub repository');
  console.log('   - Set root directory to /kuer');
  console.log('   - Railway will auto-deploy using nixpacks.toml');
  
  console.log('\n4. UPDATE FRONTEND CONFIGURATION:');
  console.log('   - Update NEXT_PUBLIC_STRAPI_URL with your Railway backend URL');
  console.log('   - Deploy your frontend to Vercel/Railway');
  
  console.log('\n5. VERIFY DEPLOYMENT:');
  console.log('   - Run: node verify-railway-deployment.js');
  console.log('   - Test admin panel: https://your-backend.railway.app/admin');
  
  console.log('\n📋 QUICK COPY-PASTE FOR RAILWAY VARIABLES:');
  console.log('=' .repeat(60));
  Object.entries(railwayConfig.backend).forEach(([key, value]) => {
    console.log(`${key}=${value}`);
  });
}

function main() {
  console.log('🔄 Switching to Railway deployment...\n');
  
  updateEnvFile();
  displayRailwayInstructions();
  
  console.log('\n✨ Railway configuration complete!');
  console.log('Next: Add the environment variables to Railway and deploy.');
}

main();