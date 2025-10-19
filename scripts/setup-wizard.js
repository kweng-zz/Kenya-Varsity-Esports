#!/usr/bin/env node

import dotenv from 'dotenv';
import readline from 'readline';

// Load environment variables
dotenv.config();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}

async function setupWizard() {
    console.log('🚀 KUER Appwrite Setup Wizard');
    console.log('==============================\n');

    const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
    const apiKey = process.env.APPWRITE_API_KEY;
    const fallbackMode = process.env.NEXT_PUBLIC_FALLBACK_MODE;

    console.log('📋 Current Status:');
    console.log(`Project ID: ${projectId ? '✅ ' + projectId : '❌ Not set'}`);
    console.log(`API Key: ${apiKey && apiKey !== 'paste_your_actual_api_key_here' ? '✅ Configured' : '❌ Not configured'}`);
    console.log(`Fallback Mode: ${fallbackMode === 'true' ? '✅ Enabled (demo data)' : '❌ Disabled (requires Appwrite)'}\n`);

    if (fallbackMode === 'true') {
        console.log('🎯 Your application is currently working with demo data.');
        const switchToReal = await askQuestion('Do you want to set up real Appwrite database? (y/n): ');
        
        if (switchToReal.toLowerCase() !== 'y' && switchToReal.toLowerCase() !== 'yes') {
            console.log('\n✅ Keeping demo mode. Your application works perfectly as-is!');
            console.log('Run "npm run dev" to start your application.');
            rl.close();
            return;
        }
    }

    console.log('\n📋 To set up Appwrite database, you need:');
    console.log('1. An Appwrite account at https://cloud.appwrite.io');
    console.log('2. Your Project ID (you have this: ' + projectId + ')');
    console.log('3. An API Key with database permissions\n');

    if (!apiKey || apiKey === 'paste_your_actual_api_key_here') {
        console.log('❌ API Key not configured yet.\n');
        console.log('📋 Steps to get your API Key:');
        console.log('1. Go to: https://cloud.appwrite.io');
        console.log('2. Open your project: ' + projectId);
        console.log('3. Go to Settings → API Keys');
        console.log('4. Create new API Key with these scopes:');
        console.log('   - databases.read & databases.write');
        console.log('   - collections.read & collections.write');
        console.log('   - attributes.read & attributes.write');
        console.log('   - indexes.read & indexes.write');
        console.log('   - documents.read & documents.write');
        console.log('5. Copy the API key\n');

        const hasApiKey = await askQuestion('Do you have your API Key ready? (y/n): ');
        
        if (hasApiKey.toLowerCase() !== 'y' && hasApiKey.toLowerCase() !== 'yes') {
            console.log('\n💡 Get your API Key first, then run this wizard again:');
            console.log('npm run setup:wizard\n');
            rl.close();
            return;
        }

        const newApiKey = await askQuestion('Paste your API Key here: ');
        
        if (!newApiKey || newApiKey.trim().length < 10) {
            console.log('\n❌ Invalid API Key. Please try again.');
            rl.close();
            return;
        }

        console.log('\n📝 Please update your .env file:');
        console.log(`APPWRITE_API_KEY=${newApiKey.trim()}`);
        console.log('\nThen run: npm run setup:appwrite');
    } else {
        console.log('✅ API Key is configured. Ready to set up database!\n');
        
        const proceed = await askQuestion('Run database setup now? (y/n): ');
        
        if (proceed.toLowerCase() === 'y' || proceed.toLowerCase() === 'yes') {
            console.log('\n🚀 Running database setup...');
            rl.close();
            
            // Import and run the setup
            try {
                const { exec } = await import('child_process');
                exec('npm run setup:appwrite', (error, stdout, stderr) => {
                    if (error) {
                        console.error('Setup failed:', error);
                        return;
                    }
                    console.log(stdout);
                    if (stderr) console.error(stderr);
                    
                    // Run populate script
                    exec('npm run populate:appwrite', (error, stdout, stderr) => {
                        if (error) {
                            console.error('Population failed:', error);
                            return;
                        }
                        console.log(stdout);
                        if (stderr) console.error(stderr);
                        
                        console.log('\n🎉 Setup complete! Next steps:');
                        console.log('1. Set NEXT_PUBLIC_FALLBACK_MODE=false in .env');
                        console.log('2. Run: npm run dev');
                        console.log('3. Visit: http://localhost:3000/rankings');
                    });
                });
            } catch (error) {
                console.error('Failed to run setup:', error);
            }
        } else {
            console.log('\n📋 Manual setup commands:');
            console.log('1. npm run setup:appwrite');
            console.log('2. npm run populate:appwrite');
            console.log('3. Set NEXT_PUBLIC_FALLBACK_MODE=false in .env');
            console.log('4. npm run dev');
            rl.close();
        }
    }
}

setupWizard().catch(console.error);