#!/usr/bin/env node

/**
 * Cleanup script to remove duplicate game category rankings
 * This script identifies and removes duplicate rankings that were created due to the glitch
 * Run this script to clean up your database before using the fixed version
 */

import { Client, Databases, Query } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config();

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DB_ID;

if (!endpoint || !projectId || !apiKey || !databaseId) {
    console.error('❌ Missing required environment variables');
    console.error('Required: NEXT_PUBLIC_APPWRITE_ENDPOINT, NEXT_PUBLIC_APPWRITE_PROJECT_ID, APPWRITE_API_KEY, NEXT_PUBLIC_APPWRITE_DB_ID');
    process.exit(1);
}

const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey);

const databases = new Databases(client);

async function cleanupDuplicateRankings() {
    try {
        console.log('🔍 Starting cleanup of duplicate rankings...\n');

        // Fetch all rankings
        const response = await databases.listDocuments(
            databaseId,
            'game_category_rankings',
            [Query.limit(1000)]
        );

        console.log(`📊 Total rankings found: ${response.documents.length}\n`);

        // Group rankings by categoryId and rank
        const rankingsByCategory = new Map();
        const duplicates = [];

        response.documents.forEach((doc) => {
            const key = `${doc.categoryId}-${doc.rank}`;
            if (!rankingsByCategory.has(key)) {
                rankingsByCategory.set(key, []);
            }
            rankingsByCategory.get(key).push(doc);
        });

        // Find duplicates
        rankingsByCategory.forEach((docs, key) => {
            if (docs.length > 1) {
                console.log(`⚠️  Found ${docs.length} duplicates for ${key}`);
                // Keep the first one, mark others for deletion
                for (let i = 1; i < docs.length; i++) {
                    duplicates.push(docs[i]);
                }
            }
        });

        if (duplicates.length === 0) {
            console.log('✅ No duplicates found! Your database is clean.');
            return;
        }

        console.log(`\n🗑️  Found ${duplicates.length} duplicate entries to remove\n`);

        // Ask for confirmation
        console.log('⚠️  This will delete the duplicate entries.');
        console.log('Make sure you have a backup before proceeding!\n');

        // Delete duplicates
        let deleted = 0;
        for (const doc of duplicates) {
            try {
                await databases.deleteDocument(
                    databaseId,
                    'game_category_rankings',
                    doc.$id
                );
                deleted++;
                console.log(`✅ Deleted duplicate: ${doc.$id}`);
            } catch (error) {
                console.error(`❌ Failed to delete ${doc.$id}:`, error.message);
            }
        }

        console.log(`\n✅ Cleanup complete! Deleted ${deleted} duplicate entries.`);
        console.log(`📊 Remaining rankings: ${response.documents.length - deleted}`);

    } catch (error) {
        console.error('❌ Error during cleanup:', error);
        process.exit(1);
    }
}

// Run the cleanup
cleanupDuplicateRankings();
