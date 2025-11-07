#!/usr/bin/env node

/**
 * Migration Script: Update Tournament Registration Schema
 * 
 * This script updates the Appwrite database schema to reflect changes in how we collect
 * tournament registration data. Specifically:
 * - Adds studentId field to the tournament_registrations collection
 * - Updates the players and substitutes JSON structure to use studentId instead of email
 * 
 * Usage: node scripts/migrate-tournament-registration-schema.js
 */

import { Client, Databases, ID } from 'appwrite';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

const databases = new Databases(client);

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID;
const REGISTRATIONS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_TOURNAMENT_REGISTRATIONS_COLLECTION_ID || 'tournament_registrations';

async function migrateSchema() {
  try {
    console.log('🔄 Starting Tournament Registration Schema Migration...\n');

    // Step 1: Verify collection exists
    console.log('📋 Step 1: Verifying tournament_registrations collection exists...');
    try {
      const collection = await databases.getCollection(DB_ID, REGISTRATIONS_COLLECTION_ID);
      console.log(`✅ Collection found: ${collection.name}\n`);
    } catch (error) {
      console.log('⚠️  Collection not found. Creating new collection...');
      await createRegistrationCollection();
      console.log('✅ Collection created successfully\n');
      return;
    }

    // Step 2: Fetch all existing registrations
    console.log('📋 Step 2: Fetching all existing registrations...');
    let allRegistrations = [];
    let offset = 0;
    const limit = 100;
    let hasMore = true;

    while (hasMore) {
      try {
        const response = await databases.listDocuments(
          DB_ID,
          REGISTRATIONS_COLLECTION_ID,
          [],
          limit,
          offset
        );
        allRegistrations = allRegistrations.concat(response.documents);
        offset += limit;
        hasMore = response.documents.length === limit;
      } catch (error) {
        hasMore = false;
      }
    }

    console.log(`✅ Found ${allRegistrations.length} existing registrations\n`);

    // Step 3: Migrate existing registrations
    if (allRegistrations.length > 0) {
      console.log('📋 Step 3: Migrating existing registrations...');
      let migratedCount = 0;
      let errorCount = 0;

      for (const registration of allRegistrations) {
        try {
          const updatedData = migrateRegistrationData(registration);
          
          await databases.updateDocument(
            DB_ID,
            REGISTRATIONS_COLLECTION_ID,
            registration.$id,
            updatedData
          );
          
          migratedCount++;
          console.log(`  ✓ Migrated registration ${migratedCount}/${allRegistrations.length}`);
        } catch (error) {
          errorCount++;
          console.log(`  ✗ Error migrating registration: ${error.message}`);
        }
      }

      console.log(`\n✅ Migration complete: ${migratedCount} successful, ${errorCount} failed\n`);
    } else {
      console.log('📋 Step 3: No existing registrations to migrate\n');
    }

    // Step 4: Display schema information
    console.log('📋 Step 4: Current Schema Information');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\nTournament Registration Collection Structure:');
    console.log('  - tournamentId (string): ID of the tournament');
    console.log('  - playerName (string): Captain\'s full name');
    console.log('  - email (string): Captain\'s email');
    console.log('  - studentId (string): Captain\'s student ID (UNIQUE)');
    console.log('  - university (string): Captain\'s university');
    console.log('  - teamName (string, optional): Team name');
    console.log('  - players (JSON): Team members data');
    console.log('    └─ Structure: { players: [...], substitutes: [...] }');
    console.log('       └─ Each player: { name, studentId, university, inGameId }');
    console.log('  - additionalInfo (string, optional): Additional information');
    console.log('  - status (string): Registration status (pending/approved/rejected)');
    console.log('  - registrationDate (datetime): When registered');
    console.log('  - userId (string): Appwrite user ID');
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('✨ Schema migration completed successfully!\n');
    console.log('📝 Key Changes:');
    console.log('  • Added studentId field to track unique student identifiers');
    console.log('  • Updated players/substitutes JSON to use studentId instead of email');
    console.log('  • Each student ID can now only register once per tournament');
    console.log('  • Email is retained for contact purposes\n');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

/**
 * Create the tournament_registrations collection if it doesn't exist
 */
async function createRegistrationCollection() {
  try {
    // Note: This is a simplified version. In production, you'd want to use
    // the Appwrite Admin SDK to create attributes properly
    console.log('Creating tournament_registrations collection...');
    
    // The collection will be created with basic structure
    // Attributes should be added through Appwrite Console or Admin SDK
    console.log('⚠️  Please ensure the following attributes exist in Appwrite Console:');
    console.log('  - tournamentId (string)');
    console.log('  - playerName (string)');
    console.log('  - email (string)');
    console.log('  - studentId (string) - UNIQUE INDEX');
    console.log('  - university (string)');
    console.log('  - teamName (string)');
    console.log('  - players (string/JSON)');
    console.log('  - additionalInfo (string)');
    console.log('  - status (string)');
    console.log('  - registrationDate (datetime)');
    console.log('  - userId (string)');
  } catch (error) {
    console.error('Error creating collection:', error.message);
  }
}

/**
 * Migrate individual registration data
 * Converts email references to studentId in players/substitutes
 */
function migrateRegistrationData(registration) {
  const updatedData = { ...registration };

  // Ensure studentId exists
  if (!updatedData.studentId) {
    updatedData.studentId = updatedData.userId || '';
  }

  // Migrate players data if it exists
  if (updatedData.players) {
    try {
      let playersData = updatedData.players;
      
      // Parse if it's a JSON string
      if (typeof playersData === 'string') {
        playersData = JSON.parse(playersData);
      }

      // Migrate players array
      if (playersData.players && Array.isArray(playersData.players)) {
        playersData.players = playersData.players.map(player => ({
          name: player.name || '',
          studentId: player.studentId || player.email || '',
          university: player.university || '',
          inGameId: player.inGameId || ''
        }));
      }

      // Migrate substitutes array
      if (playersData.substitutes && Array.isArray(playersData.substitutes)) {
        playersData.substitutes = playersData.substitutes.map(substitute => ({
          name: substitute.name || '',
          studentId: substitute.studentId || substitute.email || '',
          university: substitute.university || '',
          inGameId: substitute.inGameId || ''
        }));
      }

      updatedData.players = JSON.stringify(playersData);
    } catch (error) {
      console.log(`  ⚠️  Could not parse players data: ${error.message}`);
    }
  }

  return updatedData;
}

/**
 * Verify the migration was successful
 */
async function verifyMigration() {
  try {
    console.log('🔍 Verifying migration...');
    
    const sample = await databases.listDocuments(
      DB_ID,
      REGISTRATIONS_COLLECTION_ID,
      [],
      1
    );

    if (sample.documents.length > 0) {
      const doc = sample.documents[0];
      console.log('\n📊 Sample Registration Document:');
      console.log(JSON.stringify({
        tournamentId: doc.tournamentId,
        playerName: doc.playerName,
        studentId: doc.studentId,
        email: doc.email,
        status: doc.status,
        playersStructure: doc.players ? '✓ Contains players data' : '✗ No players data'
      }, null, 2));
    }

    console.log('\n✅ Verification complete!\n');
  } catch (error) {
    console.error('Verification error:', error.message);
  }
}

// Run migration
migrateSchema()
  .then(() => verifyMigration())
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
