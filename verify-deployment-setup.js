#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔍 RAILWAY DEPLOYMENT VERIFICATION');
console.log('==================================\n');

// Check critical files
const criticalFiles = [
    'package.json',
    'Dockerfile', 
    'railway.json',
    'src/index.ts',
    'config/database.ts',
    'config/server.ts'
];

console.log('📁 CHECKING CRITICAL FILES:');
console.log('===========================');

criticalFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
        console.log(`✅ ${file} - EXISTS`);
    } else {
        console.log(`❌ ${file} - MISSING`);
    }
});

// Check package.json content
console.log('\n📦 PACKAGE.JSON VERIFICATION:');
console.log('=============================');

try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    console.log(`✅ Name: ${packageJson.name}`);
    console.log(`✅ Description: ${packageJson.description}`);
    
    // Check scripts
    const requiredScripts = ['build', 'start'];
    requiredScripts.forEach(script => {
        if (packageJson.scripts && packageJson.scripts[script]) {
            console.log(`✅ Script "${script}": ${packageJson.scripts[script]}`);
        } else {
            console.log(`❌ Script "${script}": MISSING`);
        }
    });
    
    // Check dependencies
    const requiredDeps = ['@strapi/strapi', 'pg'];
    requiredDeps.forEach(dep => {
        if (packageJson.dependencies && packageJson.dependencies[dep]) {
            console.log(`✅ Dependency "${dep}": ${packageJson.dependencies[dep]}`);
        } else {
            console.log(`❌ Dependency "${dep}": MISSING`);
        }
    });
    
} catch (error) {
    console.log(`❌ Error reading package.json: ${error.message}`);
}

// Check Dockerfile
console.log('\n🐳 DOCKERFILE VERIFICATION:');
console.log('===========================');

try {
    const dockerfile = fs.readFileSync('Dockerfile', 'utf8');
    
    if (dockerfile.includes('FROM node:')) {
        console.log('✅ Base image: Node.js');
    } else {
        console.log('❌ Base image: Not Node.js');
    }
    
    if (dockerfile.includes('npm run build')) {
        console.log('✅ Build command: npm run build');
    } else {
        console.log('❌ Build command: Missing npm run build');
    }
    
    if (dockerfile.includes('npm run start') || dockerfile.includes('strapi start')) {
        console.log('✅ Start command: Found');
    } else {
        console.log('❌ Start command: Missing');
    }
    
    if (dockerfile.includes('EXPOSE 8080')) {
        console.log('✅ Port exposure: 8080');
    } else {
        console.log('❌ Port exposure: Not 8080');
    }
    
} catch (error) {
    console.log(`❌ Error reading Dockerfile: ${error.message}`);
}

// Check railway.json
console.log('\n🚂 RAILWAY.JSON VERIFICATION:');
console.log('=============================');

try {
    const railwayJson = JSON.parse(fs.readFileSync('railway.json', 'utf8'));
    
    if (railwayJson.build && railwayJson.build.builder === 'DOCKERFILE') {
        console.log('✅ Builder: DOCKERFILE');
    } else {
        console.log('❌ Builder: Not DOCKERFILE');
    }
    
    if (railwayJson.deploy && railwayJson.deploy.startCommand) {
        console.log(`✅ Start command: ${railwayJson.deploy.startCommand}`);
    } else {
        console.log('❌ Start command: Missing');
    }
    
    if (railwayJson.deploy && railwayJson.deploy.healthcheckPath) {
        console.log(`✅ Health check: ${railwayJson.deploy.healthcheckPath}`);
    } else {
        console.log('❌ Health check: Missing');
    }
    
} catch (error) {
    console.log(`❌ Error reading railway.json: ${error.message}`);
}

console.log('\n��� DEPLOYMENT CHECKLIST:');
console.log('========================');
console.log('1. ✅ Files moved from kuer-backend/ to root');
console.log('2. ❓ Environment variables set in Railway (9 required)');
console.log('3. ❓ PostgreSQL service running and connected');
console.log('4. ❓ Manual redeploy triggered');
console.log('5. ❓ Deployment logs checked for errors');

console.log('\n🚨 MOST LIKELY ISSUES:');
console.log('======================');
console.log('1. DATABASE_URL not set or incorrect format');
console.log('2. PostgreSQL service not running');
console.log('3. Build timeout (Strapi builds can take 5-10 minutes)');
console.log('4. Memory limits exceeded during build');
console.log('5. Missing environment variables');

console.log('\n📋 IMMEDIATE ACTION PLAN:');
console.log('=========================');
console.log('1. Go to Railway Dashboard');
console.log('2. Check deployment status and logs');
console.log('3. Verify DATABASE_URL is set and PostgreSQL is running');
console.log('4. Try manual redeploy');
console.log('5. Monitor build/deploy logs for specific errors');
console.log('6. If build times out, increase memory/timeout limits');

console.log('\n💡 SUCCESS CRITERIA:');
console.log('====================');
console.log('Deployment logs should show:');
console.log('   "✅ Build completed"');
console.log('   "✅ Starting Strapi application"');
console.log('   "✅ Server started on port 8080"');
console.log('   "✅ Database connected successfully"');