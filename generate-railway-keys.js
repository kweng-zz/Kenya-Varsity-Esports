import crypto from 'crypto';

// Generate secure random keys for Strapi
function generateSecureKey() {
  return crypto.randomBytes(32).toString('hex');
}

// Generate 4 secure keys for APP_KEYS
const appKeys = Array.from({ length: 4 }, () => generateSecureKey());

// Generate other required keys
const apiTokenSalt = generateSecureKey();
const adminJwtSecret = generateSecureKey();
const transferTokenSalt = generateSecureKey();
const jwtSecret = generateSecureKey();

console.log('=== RAILWAY ENVIRONMENT VARIABLES ===');
console.log('Copy these environment variables to your Railway project:');
console.log('');
console.log(`APP_KEYS=${appKeys.join(',')}`);
console.log(`API_TOKEN_SALT=${apiTokenSalt}`);
console.log(`ADMIN_JWT_SECRET=${adminJwtSecret}`);
console.log(`TRANSFER_TOKEN_SALT=${transferTokenSalt}`);
console.log(`JWT_SECRET=${jwtSecret}`);
console.log('');
console.log('=== ADDITIONAL REQUIRED VARIABLES ===');
console.log('NODE_ENV=production');
console.log('HOST=0.0.0.0');
console.log('PORT=1337');
console.log('');
console.log('=== DATABASE CONFIGURATION ===');
console.log('Add your Railway PostgreSQL database URL:');
console.log('DATABASE_URL=postgresql://username:password@host:port/database');
console.log('');
console.log('=== INSTRUCTIONS ===');
console.log('1. Go to your Railway project dashboard');
console.log('2. Navigate to Variables tab');
console.log('3. Add each environment variable listed above');
console.log('4. Redeploy your service');