/**
 * Setup script for ticket management collections in Appwrite
 * Run this script to create the necessary collections and attributes for the ticket system
 */

import { Client, Databases, Storage, Permission, Role, ID } from 'node-appwrite';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Appwrite client
const client = new Client();
client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || ''); // You'll need an API key with admin permissions

const databases = new Databases(client);
const storage = new Storage(client);

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID || '';
const TICKETS_COLLECTION_ID = 'tickets';
const TICKET_RESPONSES_COLLECTION_ID = 'ticket_responses';
const TICKET_ATTACHMENTS_BUCKET_ID = 'ticket_attachments';

async function setupTicketCollections() {
  try {
    console.log('🎫 Setting up ticket management collections...');

    // Create tickets collection
    console.log('Creating tickets collection...');
    try {
      await databases.createCollection(
        DB_ID,
        TICKETS_COLLECTION_ID,
        'Support Tickets',
        [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.update(Role.team('admins')),
          Permission.delete(Role.team('admins'))
        ]
      );
      console.log('✅ Tickets collection created');
    } catch (error) {
      if (error.code === 409) {
        console.log('⚠️ Tickets collection already exists');
      } else {
        throw error;
      }
    }

    // Create ticket attributes
    const ticketAttributes = [
      { key: 'ticketId', type: 'string', size: 20, required: true },
      { key: 'title', type: 'string', size: 255, required: true },
      { key: 'subject', type: 'string', size: 100, required: true },
      { key: 'message', type: 'string', size: 10000, required: true },
      { key: 'status', type: 'string', size: 50, required: false, default: 'open' },
      { key: 'priority', type: 'string', size: 20, required: false, default: 'medium' },
      { key: 'userId', type: 'string', size: 50, required: true },
      { key: 'userName', type: 'string', size: 255, required: true },
      { key: 'assignedTo', type: 'string', size: 50, required: false },
      { key: 'attachmentUrl', type: 'string', size: 500, required: false },
      { key: 'attachmentName', type: 'string', size: 255, required: false },
      { key: 'lastResponseAt', type: 'string', size: 50, required: false },
      { key: 'responseCount', type: 'integer', required: false, default: 0 },
      { key: 'isUnreadByUser', type: 'boolean', required: false, default: false },
      { key: 'isUnreadByAdmin', type: 'boolean', required: false, default: true },
      { key: 'tags', type: 'string', size: 1000, required: false, array: true }
    ];

    for (const attr of ticketAttributes) {
      try {
        if (attr.type === 'string') {
          await databases.createStringAttribute(
            DB_ID,
            TICKETS_COLLECTION_ID,
            attr.key,
            attr.size,
            attr.required,
            attr.default,
            attr.array || false
          );
        } else if (attr.type === 'integer') {
          await databases.createIntegerAttribute(
            DB_ID,
            TICKETS_COLLECTION_ID,
            attr.key,
            attr.required,
            undefined,
            undefined,
            attr.default
          );
        } else if (attr.type === 'boolean') {
          await databases.createBooleanAttribute(
            DB_ID,
            TICKETS_COLLECTION_ID,
            attr.key,
            attr.required,
            attr.default
          );
        }
        console.log(`✅ Created attribute: ${attr.key}`);
      } catch (error) {
        if (error.code === 409) {
          console.log(`⚠️ Attribute ${attr.key} already exists`);
        } else {
          console.error(`❌ Error creating attribute ${attr.key}:`, error.message);
        }
      }
    }

    // Create ticket responses collection
    console.log('Creating ticket responses collection...');
    try {
      await databases.createCollection(
        DB_ID,
        TICKET_RESPONSES_COLLECTION_ID,
        'Ticket Responses',
        [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.update(Role.team('admins')),
          Permission.delete(Role.team('admins'))
        ]
      );
      console.log('✅ Ticket responses collection created');
    } catch (error) {
      if (error.code === 409) {
        console.log('⚠️ Ticket responses collection already exists');
      } else {
        throw error;
      }
    }

    // Create ticket response attributes
    const responseAttributes = [
      { key: 'ticketId', type: 'string', size: 20, required: true },
      { key: 'message', type: 'string', size: 10000, required: true },
      { key: 'isAdminResponse', type: 'boolean', required: false, default: false },
      { key: 'userId', type: 'string', size: 50, required: true },
      { key: 'userName', type: 'string', size: 255, required: true },
      { key: 'attachmentUrl', type: 'string', size: 500, required: false },
      { key: 'attachmentName', type: 'string', size: 255, required: false },
      { key: 'isInternal', type: 'boolean', required: false, default: false }
    ];

    for (const attr of responseAttributes) {
      try {
        if (attr.type === 'string') {
          await databases.createStringAttribute(
            DB_ID,
            TICKET_RESPONSES_COLLECTION_ID,
            attr.key,
            attr.size,
            attr.required,
            attr.default
          );
        } else if (attr.type === 'boolean') {
          await databases.createBooleanAttribute(
            DB_ID,
            TICKET_RESPONSES_COLLECTION_ID,
            attr.key,
            attr.required,
            attr.default
          );
        }
        console.log(`✅ Created response attribute: ${attr.key}`);
      } catch (error) {
        if (error.code === 409) {
          console.log(`⚠️ Response attribute ${attr.key} already exists`);
        } else {
          console.error(`❌ Error creating response attribute ${attr.key}:`, error.message);
        }
      }
    }

    // Create storage bucket for ticket attachments
    console.log('Creating ticket attachments storage bucket...');
    try {
      await storage.createBucket(
        TICKET_ATTACHMENTS_BUCKET_ID,
        'Ticket Attachments',
        [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users()),
          Permission.delete(Role.team('admins'))
        ],
        false, // Not file security
        true,  // Enabled
        5 * 1024 * 1024, // 5MB max file size
        ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'txt', 'doc', 'docx'], // Allowed file extensions
        'gzip', // Compression
        false,  // Not encryption
        false   // Not antivirus
      );
      console.log('✅ Ticket attachments bucket created');
    } catch (error) {
      if (error.code === 409) {
        console.log('⚠️ Ticket attachments bucket already exists');
      } else {
        console.error('❌ Error creating storage bucket:', error.message);
      }
    }

    // Create indexes for better performance
    console.log('Creating database indexes...');
    const indexes = [
      { collection: TICKETS_COLLECTION_ID, key: 'ticketId', type: 'unique', attributes: ['ticketId'] },
      { collection: TICKETS_COLLECTION_ID, key: 'userId', type: 'key', attributes: ['userId'] },
      { collection: TICKETS_COLLECTION_ID, key: 'status', type: 'key', attributes: ['status'] },
      { collection: TICKETS_COLLECTION_ID, key: 'priority', type: 'key', attributes: ['priority'] },
      { collection: TICKETS_COLLECTION_ID, key: 'assignedTo', type: 'key', attributes: ['assignedTo'] },
      { collection: TICKETS_COLLECTION_ID, key: 'isUnreadByAdmin', type: 'key', attributes: ['isUnreadByAdmin'] },
      { collection: TICKET_RESPONSES_COLLECTION_ID, key: 'ticketId', type: 'key', attributes: ['ticketId'] },
      { collection: TICKET_RESPONSES_COLLECTION_ID, key: 'isAdminResponse', type: 'key', attributes: ['isAdminResponse'] }
    ];

    for (const index of indexes) {
      try {
        await databases.createIndex(
          DB_ID,
          index.collection,
          index.key,
          index.type,
          index.attributes
        );
        console.log(`✅ Created index: ${index.key} on ${index.collection}`);
      } catch (error) {
        if (error.code === 409) {
          console.log(`⚠️ Index ${index.key} already exists on ${index.collection}`);
        } else {
          console.error(`❌ Error creating index ${index.key}:`, error.message);
        }
      }
    }

    console.log('🎉 Ticket management system setup completed successfully!');
    console.log('\n📋 Summary:');
    console.log('- Tickets collection created with all attributes');
    console.log('- Ticket responses collection created with all attributes');
    console.log('- Storage bucket created for attachments');
    console.log('- Database indexes created for performance');
    console.log('\n🚀 Your ticket management system is ready to use!');

  } catch (error) {
    console.error('❌ Error setting up ticket collections:', error);
    process.exit(1);
  }
}

// Run the setup
setupTicketCollections();