#!/usr/bin/env node

/**
 * Simple Contentful Setup Script
 * 
 * This script sets up the basic content models needed for the blog system.
 * Make sure you have your Management API token set in .env.local first!
 */

const { createClient } = require('contentful-management');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✅${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}❌${colors.reset} ${msg}`),
  step: (msg) => console.log(`${colors.cyan}🔧${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.bright}${colors.magenta}${msg}${colors.reset}\n`)
};

// Content model definitions
const contentModels = {
  article: {
    name: 'Article',
    description: 'Blog articles and news posts',
    displayField: 'title',
    fields: [
      {
        id: 'title',
        name: 'Title',
        type: 'Symbol',
        required: true,
        validations: [{ size: { max: 200 } }]
      },
      {
        id: 'description',
        name: 'Description',
        type: 'Text',
        required: true,
        validations: [{ size: { max: 500 } }]
      },
      {
        id: 'content',
        name: 'Content',
        type: 'Text',
        required: true
      },
      {
        id: 'slug',
        name: 'Slug',
        type: 'Symbol',
        required: true,
        validations: [
          { unique: true },
          { size: { max: 100 } },
          { regexp: { pattern: '^[a-z0-9-]+$' } }
        ]
      },
      {
        id: 'category',
        name: 'Category',
        type: 'Symbol',
        required: true
      },
      {
        id: 'game',
        name: 'Game',
        type: 'Symbol',
        required: false
      },
      {
        id: 'author',
        name: 'Author',
        type: 'Symbol',
        required: true,
        defaultValue: { 'en-US': 'KUER Team' }
      },
      {
        id: 'featured',
        name: 'Featured',
        type: 'Boolean',
        required: false,
        defaultValue: { 'en-US': false }
      },
      {
        id: 'tags',
        name: 'Tags',
        type: 'Array',
        required: false,
        items: { type: 'Symbol' }
      },
      {
        id: 'image',
        name: 'Featured Image',
        type: 'Link',
        required: false,
        linkType: 'Asset'
      },
      {
        id: 'publishedAt',
        name: 'Published At',
        type: 'Date',
        required: false
      }
    ]
  },
  category: {
    name: 'Category',
    description: 'Article categories',
    displayField: 'name',
    fields: [
      {
        id: 'name',
        name: 'Name',
        type: 'Symbol',
        required: true,
        validations: [{ unique: true }, { size: { max: 100 } }]
      },
      {
        id: 'slug',
        name: 'Slug',
        type: 'Symbol',
        required: true,
        validations: [
          { unique: true },
          { size: { max: 100 } },
          { regexp: { pattern: '^[a-z0-9-]+$' } }
        ]
      }
    ]
  },
  game: {
    name: 'Game',
    description: 'Games featured in articles',
    displayField: 'name',
    fields: [
      {
        id: 'name',
        name: 'Name',
        type: 'Symbol',
        required: true,
        validations: [{ unique: true }, { size: { max: 100 } }]
      },
      {
        id: 'slug',
        name: 'Slug',
        type: 'Symbol',
        required: true,
        validations: [
          { unique: true },
          { size: { max: 100 } },
          { regexp: { pattern: '^[a-z0-9-]+$' } }
        ]
      }
    ]
  }
};

// Sample content data
const sampleContent = {
  categories: [
    { name: 'Tournament Results', slug: 'tournament-results' },
    { name: 'Championship', slug: 'championship' },
    { name: 'News', slug: 'news' },
    { name: 'Reviews', slug: 'reviews' },
    { name: 'Updates', slug: 'updates' }
  ],
  games: [
    { name: 'PUBG Mobile', slug: 'pubg-mobile' },
    { name: 'Call of Duty Mobile', slug: 'call-of-duty-mobile' },
    { name: 'Free Fire', slug: 'free-fire' },
    { name: 'Fortnite', slug: 'fortnite' },
    { name: 'Multiple Games', slug: 'multiple-games' }
  ],
  articles: [
    {
      title: 'MASINDE MULIRO UNIVERSITY (MMUST) MAKES HISTORY',
      description: 'As the Only Non-Nairobi Winner in the Kenya University Esports Rankings',
      content: 'MMUST has made history by becoming the first non-Nairobi university to win the Kenya University Esports Rankings. This achievement showcases the growing talent pool outside of Nairobi and demonstrates that esports excellence can be found across Kenya.\n\nThe victory came after intense competition against top universities from Nairobi, with MMUST demonstrating exceptional skill and teamwork throughout the tournament. This win marks a significant milestone in Kenyan esports, proving that talent and dedication can emerge from any corner of the country.\n\nThe team\'s success has inspired other regional universities to invest more in their esports programs, potentially leading to a more diverse and competitive landscape in future tournaments.',
      slug: 'mmust-makes-history',
      category: 'Tournament Results',
      game: 'PUBG Mobile',
      author: 'KUER Team',
      featured: true,
      tags: ['MMUST', 'Tournament', 'Victory', 'History'],
      publishedAt: new Date('2024-01-15').toISOString()
    }
  ]
};

async function setupContentful() {
  log.title('🚀 CONTENTFUL SIMPLE SETUP');

  // Check environment variables
  const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
  const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
  const environmentId = process.env.CONTENTFUL_ENVIRONMENT || 'master';

  if (!spaceId) {
    log.error('NEXT_PUBLIC_CONTENTFUL_SPACE_ID is not set in .env.local');
    return false;
  }

  if (!managementToken) {
    log.error('CONTENTFUL_MANAGEMENT_TOKEN is not set in .env.local');
    log.info('Please create a Management API token in Contentful and add it to .env.local');
    return false;
  }

  log.step('Initializing Contentful Management client...');
  
  try {
    const client = createClient({
      accessToken: managementToken
    });

    const space = await client.getSpace(spaceId);
    const environment = await space.getEnvironment(environmentId);
    
    log.success(`Connected to space: "${space.name}"`);

    // Create content models
    log.step('Creating content models...');
    
    for (const [contentTypeId, model] of Object.entries(contentModels)) {
      try {
        // Check if content type already exists
        try {
          const existingContentType = await environment.getContentType(contentTypeId);
          log.warning(`Content type "${model.name}" already exists, skipping...`);
          continue;
        } catch (error) {
          // Content type doesn't exist, create it
        }

        log.info(`Creating content type: ${model.name}`);
        
        const contentType = await environment.createContentTypeWithId(contentTypeId, {
          name: model.name,
          description: model.description,
          displayField: model.displayField,
          fields: model.fields
        });

        await contentType.publish();
        log.success(`Created and published: ${model.name}`);
        
        // Wait a bit between creations to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        log.error(`Failed to create ${model.name}: ${error.message}`);
      }
    }

    // Add sample content
    log.step('Adding sample content...');
    
    // Add categories
    for (const category of sampleContent.categories) {
      try {
        const entry = await environment.createEntry('category', {
          fields: {
            name: { 'en-US': category.name },
            slug: { 'en-US': category.slug }
          }
        });
        await entry.publish();
        log.success(`Added category: ${category.name}`);
      } catch (error) {
        log.warning(`Category "${category.name}" might already exist`);
      }
    }

    // Add games
    for (const game of sampleContent.games) {
      try {
        const entry = await environment.createEntry('game', {
          fields: {
            name: { 'en-US': game.name },
            slug: { 'en-US': game.slug }
          }
        });
        await entry.publish();
        log.success(`Added game: ${game.name}`);
      } catch (error) {
        log.warning(`Game "${game.name}" might already exist`);
      }
    }

    // Add sample article
    for (const article of sampleContent.articles) {
      try {
        const entry = await environment.createEntry('article', {
          fields: {
            title: { 'en-US': article.title },
            description: { 'en-US': article.description },
            content: { 'en-US': article.content },
            slug: { 'en-US': article.slug },
            category: { 'en-US': article.category },
            game: { 'en-US': article.game },
            author: { 'en-US': article.author },
            featured: { 'en-US': article.featured },
            tags: { 'en-US': article.tags },
            publishedAt: { 'en-US': article.publishedAt }
          }
        });
        await entry.publish();
        log.success(`Added article: ${article.title}`);
      } catch (error) {
        log.warning(`Article "${article.title}" might already exist`);
      }
    }

    log.title('🎉 SETUP COMPLETE!');
    log.success('Contentful content models and sample data have been created');
    log.info('You can now use the blog management system in your admin panel');
    
    return true;

  } catch (error) {
    log.error(`Setup failed: ${error.message}`);
    if (error.message.includes('The access token you sent could not be found')) {
      log.error('Invalid Management API token. Please check your CONTENTFUL_MANAGEMENT_TOKEN in .env.local');
    }
    return false;
  }
}

// Run the setup
setupContentful().catch(error => {
  console.error('Setup failed:', error);
  process.exit(1);
});