import { Client, Databases } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DB_ID || '';
const collectionId = 'season_statistics';

async function updateSeasonSchema() {
  try {
    console.log('🎯 Updating Season Statistics Collection Schema...');

    try {
      await databases.createDatetimeAttribute(
        databaseId,
        collectionId,
        'registrationStartDate',
        false // Not required
      );
      console.log('✅ registrationStartDate attribute created successfully');
    } catch (error) {
      if (error.code === 409) {
        console.log('ℹ️  registrationStartDate attribute already exists');
      } else {
        throw error;
      }
    }

    console.log('\n🎉 Season statistics schema update complete!');

  } catch (error) {
    console.error('❌ Error updating season schema:', error.message);
    process.exit(1);
  }
}

updateSeasonSchema();
