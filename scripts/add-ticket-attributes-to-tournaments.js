#!/usr/bin/env node

/**
 * Add ticket-related attributes to tournaments collection
 * Run this to fix "Unknown attribute: enableTickets" error
 */

import { Client, Databases } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID;
const TOURNAMENTS_COLLECTION_ID = 'tournaments';

async function addTicketAttributes() {
  try {
    console.log('🚀 Adding ticket attributes to tournaments collection...\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (!process.env.APPWRITE_API_KEY) {
      console.error('❌ APPWRITE_API_KEY not found in .env');
      process.exit(1);
    }

    console.log(`📋 Using Database ID: ${DATABASE_ID}`);
    console.log(`📋 Using Collection ID: ${TOURNAMENTS_COLLECTION_ID}`);
    console.log('');

    // List current attributes
    console.log('🔍 Checking existing attributes...');
    const attributes = await databases.listAttributes(DATABASE_ID, TOURNAMENTS_COLLECTION_ID);
    const attributeNames = attributes.attributes.map(a => a.key);
    console.log('Current attributes:', attributeNames.join(', '));
    console.log('');

    // Attributes to add
    const newAttributes = [
      { key: 'enableTickets', type: 'boolean', required: false, default: false, description: 'Whether ticketing is enabled for this tournament' },
      { key: 'ticketCurrency', type: 'string', size: 10, required: false, default: 'KES', description: 'Currency for ticket prices' },
      { key: 'maxTicketsPerUser', type: 'integer', required: false, default: 5, description: 'Maximum tickets a single user can purchase' },
      { key: 'platformFee', type: 'double', required: false, default: 0, description: 'Platform fee amount' },
      { key: 'platformFeeType', type: 'string', size: 20, required: false, default: 'fixed', description: 'Fee type: fixed or percentage' },
      { key: 'showInEvents', type: 'boolean', required: false, default: false, description: 'Show tournament in events page' },
      { key: 'ticketTypes', type: 'string', size: 10000, required: false, array: false, description: 'JSON string of ticket types configuration' },
    ];

    for (const attr of newAttributes) {
      if (attributeNames.includes(attr.key)) {
        console.log(`ℹ️  ${attr.key} already exists, skipping...`);
        continue;
      }

      console.log(`➕ Adding ${attr.key} (${attr.type})...`);
      try {
        if (attr.type === 'boolean') {
          await databases.createBooleanAttribute(
            DATABASE_ID,
            TOURNAMENTS_COLLECTION_ID,
            attr.key,
            attr.required,
            attr.default
          );
        } else if (attr.type === 'string') {
          await databases.createStringAttribute(
            DATABASE_ID,
            TOURNAMENTS_COLLECTION_ID,
            attr.key,
            attr.size,
            attr.required,
            attr.default,
            attr.array || false
          );
        } else if (attr.type === 'integer') {
          await databases.createIntegerAttribute(
            DATABASE_ID,
            TOURNAMENTS_COLLECTION_ID,
            attr.key,
            attr.required,
            undefined,
            undefined,
            attr.default
          );
        } else if (attr.type === 'double') {
          await databases.createFloatAttribute(
            DATABASE_ID,
            TOURNAMENTS_COLLECTION_ID,
            attr.key,
            attr.required,
            undefined,
            undefined,
            attr.default
          );
        }
        console.log(`✅ ${attr.key} created successfully`);
      } catch (error) {
        if (error.code === 409) {
          console.log(`ℹ️  ${attr.key} already exists (race condition)`);
        } else {
          console.error(`❌ Error creating ${attr.key}:`, error.message);
        }
      }

      // Wait between attribute creation
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('\n🎉 Ticket attributes migration completed!');
    console.log('⏳ Please wait a few seconds for Appwrite to process the attributes.');
    console.log('');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

addTicketAttributes();