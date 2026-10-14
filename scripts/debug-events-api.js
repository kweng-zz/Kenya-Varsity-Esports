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

async function debug() {
    try {
        console.log('🔍 Debugging events API query...\n');
        
        const now = new Date().toISOString();
        console.log(`Now: ${now}\n`);
        
        // Test 1: Query with showInEvents
        console.log('Test 1: Query with showInEvents=true, status=published, tournamentStatus!=completed, startDate>=now');
        try {
            const response1 = await databases.listDocuments(DATABASE_ID, TOURNAMENTS_COLLECTION_ID, [
                Query.equal('showInEvents', true),
                Query.equal('status', 'published'),
                Query.notEqual('tournamentStatus', 'completed'),
                Query.greaterThanEqual('startDate', now),
                Query.orderDesc('startDate'),
                Query.limit(50),
            ]);
            console.log(`  Results: ${response1.documents.length} documents`);
            response1.documents.forEach(d => console.log(`    - ${d.title} (${d.$id})`));
        } catch (e) {
            console.log(`  Error: ${e.message}`);
        }
        
        // Test 2: Query without showInEvents
        console.log('\nTest 2: Query without showInEvents');
        try {
            const response2 = await databases.listDocuments(DATABASE_ID, TOURNAMENTS_COLLECTION_ID, [
                Query.equal('status', 'published'),
                Query.notEqual('tournamentStatus', 'completed'),
                Query.greaterThanEqual('startDate', now),
                Query.orderDesc('startDate'),
                Query.limit(50),
            ]);
            console.log(`  Results: ${response2.documents.length} documents`);
            response2.documents.forEach(d => console.log(`    - ${d.title} (${d.$id})`));
        } catch (e) {
            console.log(`  Error: ${e.message}`);
        }
        
        // Test 3: Query with just status
        console.log('\nTest 3: Query with just status=published');
        try {
            const response3 = await databases.listDocuments(DATABASE_ID, TOURNAMENTS_COLLECTION_ID, [
                Query.equal('status', 'published'),
                Query.limit(50),
            ]);
            console.log(`  Results: ${response3.documents.length} documents`);
            response3.documents.forEach(d => console.log(`    - ${d.title} (${d.$id}) showInEvents: ${d.showInEvents}`));
        } catch (e) {
            console.log(`  Error: ${e.message}`);
        }
        
        // Test 4: Check one tournament's attributes
        console.log('\nTest 4: Check tournament attributes');
        try {
            const response4 = await databases.listDocuments(DATABASE_ID, TOURNAMENTS_COLLECTION_ID, [
                Query.limit(1),
            ]);
            if (response4.documents.length > 0) {
                const doc = response4.documents[0];
                console.log('  Document keys:', Object.keys(doc).sort());
                console.log('  showInEvents:', doc.showInEvents);
            }
        } catch (e) {
            console.log(`  Error: ${e.message}`);
        }
        
    } catch (error) {
        console.error('❌ Debug failed:', error);
    }
}

debug();