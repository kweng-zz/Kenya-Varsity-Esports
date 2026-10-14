#!/usr/bin/env node

import { Client, Databases } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID || 'esports-db';
const TOURNAMENTS_COLLECTION_ID = 'tournaments';

// New dates in 2027 (future relative to Oct 2026)
const tournaments = [
    {
        id: '6ace927600135d4947fb', // eFootball Mobile
        registrationDeadline: '2027-01-10T23:59:59.000Z',
        startDate: '2027-01-15T09:00:00.000Z',
        endDate: '2027-01-17T18:00:00.000Z',
    },
    {
        id: '6ace92790030f4bf863f', // PUBG Mobile
        registrationDeadline: '2027-01-17T23:59:59.000Z',
        startDate: '2027-01-22T09:00:00.000Z',
        endDate: '2027-01-24T18:00:00.000Z',
    },
    {
        id: '6ace927c0035570f6600', // CODM Multiplayer
        registrationDeadline: '2027-01-24T23:59:59.000Z',
        startDate: '2027-01-29T09:00:00.000Z',
        endDate: '2027-01-31T18:00:00.000Z',
    },
    {
        id: '6ace92800028bf146953', // CODM 1v1
        registrationDeadline: '2027-01-31T23:59:59.000Z',
        startDate: '2027-02-05T09:00:00.000Z',
        endDate: '2027-02-07T18:00:00.000Z',
    },
];

async function updateDates() {
    try {
        console.log('🔄 Updating tournament dates to 2027...\n');
        
        for (const t of tournaments) {
            try {
                const result = await databases.updateDocument(
                    DATABASE_ID,
                    TOURNAMENTS_COLLECTION_ID,
                    t.id,
                    {
                        registrationDeadline: t.registrationDeadline,
                        startDate: t.startDate,
                        endDate: t.endDate,
                    }
                );
                console.log(`  ✅ Updated ${result.title} (${t.id})`);
                console.log(`     Start: ${result.startDate}`);
            } catch (error) {
                console.error(`  ❌ Error updating ${t.id}:`, error.message);
            }
        }
        
        console.log('\n🎉 All tournament dates updated to 2027!');
    } catch (error) {
        console.error('❌ Update failed:', error);
        process.exit(1);
    }
}

updateDates();