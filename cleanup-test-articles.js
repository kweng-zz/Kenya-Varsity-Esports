#!/usr/bin/env node

/**
 * Cleanup Test Articles Script
 * 
 * This script removes test articles created during diagnostics.
 */

import { config } from 'dotenv';

// Load environment variables
config();

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

console.log('🧹 Cleaning up test articles...\n');

async function cleanupTestArticles() {
  try {
    // Get all articles
    console.log('📋 Fetching all articles...');
    const articlesResponse = await fetch(`${STRAPI_URL}/api/articles?pagination[limit]=100`, {
      headers: {
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!articlesResponse.ok) {
      throw new Error(`Failed to fetch articles: ${articlesResponse.status}`);
    }

    const articles = await articlesResponse.json();
    console.log(`✅ Found ${articles.data.length} articles total`);

    // Find test articles (articles with "Test" in title or category)
    const testArticles = articles.data.filter(article => 
      article.title?.includes('Test') || 
      article.category === 'Test' ||
      article.author === 'Schema Test' ||
      article.author === 'Connection Test' ||
      article.slug?.includes('test-')
    );

    console.log(`🎯 Found ${testArticles.length} test articles to delete:`);
    
    if (testArticles.length === 0) {
      console.log('✅ No test articles found to clean up!');
      return;
    }

    // List test articles before deletion
    testArticles.forEach((article, index) => {
      console.log(`  ${index + 1}. "${article.title}" (ID: ${article.id}, Slug: ${article.slug})`);
    });

    console.log('\n🗑️ Deleting test articles...');

    let deletedCount = 0;
    let failedCount = 0;

    for (const article of testArticles) {
      try {
        const deleteResponse = await fetch(`${STRAPI_URL}/api/articles/${article.documentId || article.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
            'Content-Type': 'application/json'
          }
        });

        if (deleteResponse.ok) {
          console.log(`✅ Deleted: "${article.title}"`);
          deletedCount++;
        } else {
          console.log(`❌ Failed to delete: "${article.title}" (Status: ${deleteResponse.status})`);
          failedCount++;
        }
      } catch (error) {
        console.log(`❌ Error deleting "${article.title}": ${error.message}`);
        failedCount++;
      }

      // Small delay to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`\n📊 Cleanup Summary:`);
    console.log(`✅ Successfully deleted: ${deletedCount} articles`);
    console.log(`❌ Failed to delete: ${failedCount} articles`);

    if (deletedCount > 0) {
      console.log('\n🎉 Test articles cleanup completed!');
    }

  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
  }
}

cleanupTestArticles().then(() => {
  console.log('\n🏁 Cleanup process completed!');
}).catch(error => {
  console.error('\n💥 Cleanup failed:', error);
  process.exit(1);
});