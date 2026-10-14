import { Client, Databases, ID, Permission, Role } from 'node-appwrite';
import * as dotenv from 'dotenv';

dotenv.config();

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DB_ID!;

if (!projectId || !apiKey || !databaseId) {
  console.error('❌ Error: NEXT_PUBLIC_APPWRITE_PROJECT_ID, NEXT_PUBLIC_APPWRITE_DB_ID and APPWRITE_API_KEY must be set in .env');
  process.exit(1);
}

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey);

const databases = new Databases(client);

async function setupAppwrite() {
  console.log('🚀 Starting Appwrite Blog Database Setup...');
  console.log(`📍 Endpoint: ${endpoint}`);
  console.log(`🆔 Project: ${projectId}`);

  // 1. Verify Database
  try {
    await databases.get(databaseId);
    console.log(`✅ Database "${databaseId}" verified.`);
  } catch (error) {
    console.error(`❌ Error: Database "${databaseId}" not found. Please ensure NEXT_PUBLIC_APPWRITE_DB_ID is correct.`);
    process.exit(1);
  }

  const collections = [
    {
      id: 'article_likes',
      name: 'Article Likes',
      attributes: [
        { key: 'articleId', type: 'string', size: 255, required: true },
        { key: 'userId', type: 'string', size: 255, required: true },
        { key: 'createdAt', type: 'string', size: 50, required: true }
      ],
      indexes: [
        { key: 'idx_article', type: 'key', attributes: ['articleId'] },
        { key: 'idx_user', type: 'key', attributes: ['userId'] },
        { key: 'idx_unique_like', type: 'unique', attributes: ['articleId', 'userId'] }
      ]
    },
    {
      id: 'article_comments',
      name: 'Article Comments',
      attributes: [
        { key: 'articleId', type: 'string', size: 255, required: true },
        { key: 'authorName', type: 'string', size: 100, required: true },
        { key: 'content', type: 'string', size: 5000, required: true },
        { key: 'authorAvatar', type: 'string', size: 500, required: false },
        { key: 'parentId', type: 'string', size: 255, required: false },
        { key: 'createdAt', type: 'string', size: 50, required: true }
      ],
      indexes: [
        { key: 'idx_article_comments', type: 'key', attributes: ['articleId'] },
        { key: 'idx_parent', type: 'key', attributes: ['parentId'] }
      ]
    },
    {
      id: 'article_bookmarks',
      name: 'Article Bookmarks',
      attributes: [
        { key: 'articleId', type: 'string', size: 255, required: true },
        { key: 'userId', type: 'string', size: 255, required: true },
        { key: 'createdAt', type: 'string', size: 50, required: true }
      ],
      indexes: [
        { key: 'idx_user_bookmarks', type: 'key', attributes: ['userId'] },
        { key: 'idx_unique_bookmark', type: 'unique', attributes: ['articleId', 'userId'] }
      ]
    },
    {
      id: 'author_follows',
      name: 'Author Follows',
      attributes: [
        { key: 'authorName', type: 'string', size: 100, required: true },
        { key: 'userId', type: 'string', size: 255, required: true },
        { key: 'createdAt', type: 'string', size: 50, required: true }
      ],
      indexes: [
        { key: 'idx_author', type: 'key', attributes: ['authorName'] },
        { key: 'idx_unique_follow', type: 'unique', attributes: ['authorName', 'userId'] }
      ]
    },
    {
      id: 'article_views',
      name: 'Article Views',
      attributes: [
        { key: 'articleId', type: 'string', size: 255, required: true },
        { key: 'viewCount', type: 'integer', required: false, min: 0, default: 0 },
        { key: 'lastViewed', type: 'string', size: 50, required: false }
      ],
      indexes: [
        { key: 'idx_view_article', type: 'unique', attributes: ['articleId'] }
      ]
    }
  ];

  for (const col of collections) {
    try {
      console.log(`\n📦 Processing collection: ${col.name} (${col.id})`);
      
      try {
        await databases.getCollection(databaseId, col.id);
        console.log(`  - Already exists.`);
      } catch {
        console.log(`  - Creating collection...`);
        // We set document permissions to allow users to create and guests to read
        await databases.createCollection(
          databaseId, 
          col.id, 
          col.name, 
          [
            Permission.read(Role.any()),
            Permission.create(Role.users()),
            Permission.create(Role.team('admins')),
            Permission.update(Role.users()),
            Permission.update(Role.team('admins')),
            Permission.delete(Role.users()),
            Permission.delete(Role.team('admins'))
          ]
        );
      }

      // Attributes
      const existing = await databases.listAttributes(databaseId, col.id);
      const existingKeys = existing.attributes.map(a => a.key);

      for (const attr of col.attributes) {
        if (existingKeys.includes(attr.key)) {
          console.log(`  - Attribute "${attr.key}" exists.`);
          continue;
        }

        console.log(`  - Creating attribute: ${attr.key}...`);
        if (attr.type === 'string') {
          await databases.createStringAttribute(databaseId, col.id, attr.key, attr.size!, attr.required, attr.default as any);
        } else if (attr.type === 'integer') {
          await databases.createIntegerAttribute(databaseId, col.id, attr.key, attr.required, attr.min, undefined, attr.default as any);
        } else if (attr.type === 'boolean') {
          await databases.createBooleanAttribute(databaseId, col.id, attr.key, attr.required, attr.default as any);
        }
        
        // Wait a bit for Appwrite to process
        await new Promise(r => setTimeout(r, 1000));
      }

      // Indexes (usually takes longer)
      const existingIdx = await databases.listIndexes(databaseId, col.id);
      const existingIdxKeys = existingIdx.indexes.map(i => i.key);

      for (const idx of col.indexes) {
        if (existingIdxKeys.includes(idx.key)) {
          console.log(`  - Index "${idx.key}" exists.`);
          continue;
        }

        console.log(`  - Creating index: ${idx.key}...`);
        try {
          await databases.createIndex(databaseId, col.id, idx.key, idx.type as any, idx.attributes);
        } catch (e: any) {
          console.log(`  ⚠️ Warning creating index ${idx.key}: ${e.message}`);
        }
      }

    } catch (error: any) {
      console.error(`❌ Error setting up collection ${col.id}:`, error.message);
    }
  }

  console.log('\n✨ Appwrite Blog Setup Complete!');
  console.log(`📢 Make sure to set DB_TYPE=appwrite in your .env`);
}

setupAppwrite().catch(console.error);
