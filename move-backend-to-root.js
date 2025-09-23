#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 MOVING STRAPI BACKEND TO ROOT FOR RAILWAY DEPLOYMENT');
console.log('=====================================================\n');

const backendPath = path.join(process.cwd(), 'kuer-backend');
const rootPath = process.cwd();

if (!fs.existsSync(backendPath)) {
    console.log('❌ Error: kuer-backend directory not found');
    process.exit(1);
}

// Backup current root files that might conflict
const filesToBackup = ['package.json', 'Dockerfile', 'railway.json', 'tsconfig.json'];
const backupDir = path.join(rootPath, 'frontend-backup');

console.log('📦 Creating backup of frontend files...');
if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
}

filesToBackup.forEach(file => {
    const sourcePath = path.join(rootPath, file);
    const backupPath = path.join(backupDir, file);
    
    if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, backupPath);
        console.log(`✅ Backed up ${file}`);
    }
});

// Copy backend files to root
console.log('\n📁 Moving backend files to root...');

function copyRecursive(src, dest) {
    const stats = fs.statSync(src);
    
    if (stats.isDirectory()) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        
        const files = fs.readdirSync(src);
        files.forEach(file => {
            if (file !== 'node_modules' && file !== '.git' && file !== 'dist' && file !== '.tmp') {
                copyRecursive(path.join(src, file), path.join(dest, file));
            }
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

const backendFiles = fs.readdirSync(backendPath);
backendFiles.forEach(file => {
    if (file !== 'node_modules' && file !== '.git' && file !== 'dist' && file !== '.tmp') {
        const sourcePath = path.join(backendPath, file);
        const destPath = path.join(rootPath, file);
        
        try {
            if (fs.statSync(sourcePath).isDirectory()) {
                copyRecursive(sourcePath, destPath);
                console.log(`✅ Copied directory: ${file}/`);
            } else {
                fs.copyFileSync(sourcePath, destPath);
                console.log(`✅ Copied file: ${file}`);
            }
        } catch (error) {
            console.log(`⚠️  Warning: Could not copy ${file}: ${error.message}`);
        }
    }
});

// Update railway.json for proper Strapi deployment
const railwayConfig = {
    "$schema": "https://railway.app/railway.schema.json",
    "build": {
        "builder": "DOCKERFILE",
        "dockerfilePath": "Dockerfile"
    },
    "deploy": {
        "startCommand": "npm run start",
        "healthcheckPath": "/admin",
        "healthcheckTimeout": 300,
        "restartPolicyType": "ON_FAILURE",
        "restartPolicyMaxRetries": 10
    }
};

fs.writeFileSync(path.join(rootPath, 'railway.json'), JSON.stringify(railwayConfig, null, 2));
console.log('✅ Updated railway.json for Strapi deployment');

console.log('\n🎉 BACKEND FILES MOVED SUCCESSFULLY!');
console.log('\n📋 NEXT STEPS:');
console.log('1. Commit and push these changes to your repository');
console.log('2. Railway will automatically redeploy');
console.log('3. Verify environment variables in Railway dashboard');
console.log('4. Test the endpoints after deployment');

console.log('\n🔍 REQUIRED ENVIRONMENT VARIABLES:');
console.log('Make sure these are set in Railway dashboard:');
const envVars = [
    'DATABASE_URL (PostgreSQL connection string)',
    'APP_KEYS (comma-separated random strings)',
    'API_TOKEN_SALT (random string)',
    'ADMIN_JWT_SECRET (random string)', 
    'TRANSFER_TOKEN_SALT (random string)',
    'JWT_SECRET (random string)',
    'NODE_ENV=production',
    'HOST=0.0.0.0',
    'PORT=8080'
];

envVars.forEach(envVar => {
    console.log(`   - ${envVar}`);
});

console.log('\n⚡ VERIFICATION COMMAND:');
console.log('After deployment, run: node diagnose-railway.cjs');