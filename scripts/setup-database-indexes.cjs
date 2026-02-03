// scripts/setup-database-indexes.cjs
/**
 * Database Index Setup Script
 * Creates optimized indexes for better query performance
 */

require('dotenv').config();
const { Client, Databases } = require('node-appwrite');

async function setupIndexes() {
  console.log('🔧 Setting up database indexes...');
  console.log('📍 Endpoint:', process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT);
  console.log('🆔 Project ID:', process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

  try {
    // Initialize Appwrite client
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);

    const databases = new Databases(client);
    const dbId = process.env.NEXT_PUBLIC_APPWRITE_DB_ID;

    // Tournament registrations collection indexes
    const tournamentRegCollectionId = process.env.NEXT_PUBLIC_APPWRITE_TOURNAMENT_REGISTRATIONS_COLLECTION_ID || 'tournament_registrations';
    
    console.log('📊 Creating indexes for tournament registrations...');
    
    // Index 1: Email (for checking duplicates by email)
    try {
      await databases.createIndex(
        dbId,
        tournamentRegCollectionId,
        'email_index',
        'unique',
        ['email'],
        ['asc'] // order
      );
      console.log('✅ Created email index');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('ℹ️ Email index already exists');
      } else {
        console.error('❌ Failed to create email index:', error.message);
      }
    }

    // Index 2: StudentId (for student uniqueness checks)
    try {
      await databases.createIndex(
        dbId,
        tournamentRegCollectionId,
        'student_id_index',
        'unique',
        ['studentId']
      );
      console.log('✅ Created studentId index');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('ℹ️ StudentId index already exists');
      } else {
        console.error('❌ Failed to create studentId index:', error.message);
      }
    }

    // Index 3: TournamentId (for listing participants by tournament)
    try {
      await databases.createIndex(
        dbId,
        tournamentRegCollectionId,
        'tournament_id_index',
        'key',
        ['tournamentId']
      );
      console.log('✅ Created tournamentId index');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('ℹ️ TournamentId index already exists');
      } else {
        console.error('❌ Failed to create tournamentId index:', error.message);
      }
    }

    // Index 4: Status (for filtering by status)
    try {
      await databases.createIndex(
        dbId,
        tournamentRegCollectionId,
        'status_index',
        'key',
        ['status']
      );
      console.log('✅ Created status index');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('ℹ️ Status index already exists');
      } else {
        console.error('❌ Failed to create status index:', error.message);
      }
    }

    // Tournaments collection indexes
    const tournamentsCollectionId = process.env.NEXT_PUBLIC_APPWRITE_TOURNAMENTS_COLLECTION_ID || 'tournaments';
    
    console.log('🏆 Creating indexes for tournaments...');
    
    // Index 1: TournamentStatus (for filtering tournaments by status)
    try {
      await databases.createIndex(
        dbId,
        tournamentsCollectionId,
        'tournament_status_index',
        'key',
        ['tournamentStatus']
      );
      console.log('✅ Created tournamentStatus index');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('ℹ️ TournamentStatus index already exists');
      } else {
        console.error('❌ Failed to create tournamentStatus index:', error.message);
      }
    }

    console.log('✨ Database index setup completed!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

// Run the setup
setupIndexes().catch(console.error);