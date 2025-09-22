#!/usr/bin/env node

/**
 * Strapi Schema Diagnosis Script
 * 
 * This script examines the Article content type schema to understand
 * how the image relation should be formatted.
 */

import { config } from 'dotenv';

// Load environment variables
config();

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

console.log('🔍 Diagnosing Strapi Article Schema...\n');

async function diagnoseSchema() {
  try {
    // 1. Get the content type schema
    console.log('📋 Fetching Article content type schema...');
    const schemaResponse = await fetch(`${STRAPI_URL}/api/content-type-builder/content-types/api::article.article`, {
      headers: {
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (schemaResponse.ok) {
      const schema = await schemaResponse.json();
      console.log('✅ Schema fetched successfully');
      
      // Look for image field
      const imageField = schema.data?.schema?.attributes?.image;
      if (imageField) {
        console.log('\n🖼️ Image field configuration:');
        console.log(JSON.stringify(imageField, null, 2));
      } else {
        console.log('❌ No image field found in schema');
      }
    } else {
      console.log('❌ Could not fetch schema (this endpoint might not be available)');
    }

    // 2. Examine existing articles with images
    console.log('\n📄 Examining existing articles...');
    const articlesResponse = await fetch(`${STRAPI_URL}/api/articles?populate=image&pagination[limit]=10`, {
      headers: {
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (articlesResponse.ok) {
      const articles = await articlesResponse.json();
      console.log(`✅ Found ${articles.data.length} articles`);
      
      // Look for articles with images
      const articlesWithImages = articles.data.filter(article => article.image);
      
      if (articlesWithImages.length > 0) {
        console.log(`\n🖼️ Found ${articlesWithImages.length} articles with images:`);
        articlesWithImages.forEach((article, index) => {
          console.log(`\nArticle ${index + 1}: "${article.title}"`);
          console.log('Image structure:', JSON.stringify(article.image, null, 2));
        });
      } else {
        console.log('\n⚠️ No articles with images found');
      }
    }

    // 3. Try to manually create a test article with image using different formats
    console.log('\n🧪 Testing different image relation formats...');
    
    const testImageId = 'zuibj0o1ptbo7m7b1dgpxu1y'; // Use the uploaded image ID
    
    const testFormats = [
      { name: 'Direct ID', data: { image: testImageId } },
      { name: 'Numeric ID', data: { image: 10 } }, // Using the numeric ID from upload
      { name: 'Connect Array', data: { image: { connect: [testImageId] } } },
      { name: 'Connect Single', data: { image: { connect: testImageId } } },
      { name: 'Set Array', data: { image: { set: [testImageId] } } },
      { name: 'Array Format', data: { image: [testImageId] } },
      { name: 'Object with ID', data: { image: { id: testImageId } } },
      { name: 'Object with documentId', data: { image: { documentId: testImageId } } },
    ];

    for (const format of testFormats) {
      console.log(`\n🔬 Testing ${format.name}...`);
      
      const testArticleData = {
        data: {
          title: `Test Article - ${format.name} - ${Date.now()}`,
          description: 'Test article for image relation format',
          content: [{ type: 'paragraph', children: [{ type: 'text', text: 'Test content' }] }],
          slug: `test-${format.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
          category: 'Test',
          author: 'Schema Test',
          featured: false,
          tags: ['test'],
          publishedAt: new Date().toISOString(),
          ...format.data
        }
      };

      try {
        const testResponse = await fetch(`${STRAPI_URL}/api/articles`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(testArticleData)
        });

        if (testResponse.ok) {
          const result = await testResponse.json();
          console.log(`✅ ${format.name} WORKS! Article created with ID: ${result.data.id}`);
          
          // Clean up test article
          try {
            const deleteResponse = await fetch(`${STRAPI_URL}/api/articles/${result.data.documentId || result.data.id}`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
                'Content-Type': 'application/json'
              }
            });
            
            if (deleteResponse.ok) {
              console.log(`🗑️ Test article cleaned up successfully`);
            } else {
              console.log(`⚠️ Could not clean up test article (Status: ${deleteResponse.status})`);
            }
          } catch (cleanupError) {
            console.log(`⚠️ Could not clean up test article: ${cleanupError.message}`);
          }
          
          // If we found a working format, we can stop testing
          console.log(`\n🎉 SOLUTION FOUND: Use ${format.name} format for image relations!`);
          console.log(`Format: ${JSON.stringify(format.data, null, 2)}`);
          break;
        } else {
          const errorText = await testResponse.text();
          console.log(`❌ ${format.name} failed: ${testResponse.status}`);
        }
      } catch (error) {
        console.log(`❌ ${format.name} error: ${error.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Diagnosis failed:', error.message);
  }
}

diagnoseSchema().then(() => {
  console.log('\n🏁 Schema diagnosis completed!');
}).catch(error => {
  console.error('\n💥 Diagnosis failed:', error);
  process.exit(1);
});