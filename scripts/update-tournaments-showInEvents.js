#!/usr/bin/env node

import { Client, Databases, Query } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID || 'esports-db';
const TOURNAMENTS_COLLECTION_ID = 'tournaments';

const tournamentIds = [
    '6ace927600135d4947fb', // eFootball Mobile
    '6ace92790030f4bf863f', // PUBG Mobile
    '6ace927c0035570f6600', // CODM Multiplayer
    '6ace92800028bf146953', // CODM 1v1
];

async function updateTournaments() {
    try {
        console.log('🔄 Updating tournaments with showInEvents: true...\n');
        
        for (const id of tournamentIds) {
            try {
                const result = await databases.updateDocument(
                    DATABASE_ID,
                    TOURNAMENTS_COLLECTION_ID,
                    id,
                    { showInEvents: true }
                );
                console.log(`  ✅ Updated ${result.title} (${id})`);
            } catch (error) {
                console.error(`  ❌ Error updating ${id}:`, error.message);
            }
        }
        
        console.log('\n🎉 All tournaments updated!');
    } catch (error) {
        console.error('❌ Update failed:', error);
        process.exit(1);
    }
}

updateTournaments();