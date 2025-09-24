#!/usr/bin/env node

/**
 * Contentful Setup Script
 * 
 * This script will:
 * 1. Verify Contentful credentials
 * 2. Create content models (Article, Category, Game)
 * 3. Add sample content
 * 4. Test the integration
 * 5. Update environment variables
 */

const { createClient } = require('contentful-management');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

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

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

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
    },
    {
      title: 'TUK TAKES THE OVERALL POSITION FOR SEASON 2',
      description: 'The Technical University of Kenya gathers the top position in KUER Season 2',
      content: 'The Technical University of Kenya (TUK) has emerged victorious in KUER Season 2, showcasing exceptional gaming skills and strategic teamwork that set them apart from the competition.\n\nThroughout the season, TUK demonstrated consistent performance across multiple game titles, with their players showing remarkable adaptability and skill. The team\'s victory was built on months of dedicated practice and strategic preparation.\n\nThis win establishes TUK as a dominant force in Kenyan university esports and sets high expectations for future seasons.',
      slug: 'tuk-season-2-champions',
      category: 'Championship',
      game: 'Multiple Games',
      author: 'KUER Team',
      featured: true,
      tags: ['TUK', 'Season 2', 'Championship', 'Victory'],
      publishedAt: new Date('2024-01-10').toISOString()
    },
    {
      title: 'New Tournament Format Announced for Season 3',
      description: 'KUER introduces exciting changes to improve competitive balance',
      content: 'KUER is excited to announce significant improvements to our tournament format for the upcoming Season 3. These changes are designed to create more competitive balance and provide better opportunities for all participating universities.\n\nKey changes include:\n- Extended qualification periods\n- New game title additions\n- Improved prize distribution\n- Enhanced streaming and broadcast coverage\n\nThese updates reflect our commitment to growing the Kenyan university esports scene and providing the best possible experience for players and fans alike.',
      slug: 'season-3-format-announcement',
      category: 'Updates',
      game: 'Multiple Games',
      author: 'KUER Team',
      featured: false,
      tags: ['Season 3', 'Tournament', 'Format', 'Updates'],
      publishedAt: new Date('2024-01-05').toISOString()
    }
  ]
};

class ContentfulSetup {
  constructor() {
    this.client = null;
    this.space = null;
    this.environment = null;
    this.config = {
      spaceId: '',
      accessToken: '',
      managementToken: '',
      environmentId: 'master'
    };
  }

  async run() {
    try {
      log.title('🚀 CONTENTFUL SETUP WIZARD');
      log.info('This script will set up Contentful for your esports application');
      
      await this.gatherCredentials();
      await this.initializeClient();
      await this.verifyConnection();
      await this.createContentModels();
      await this.addSampleContent();
      await this.testIntegration();
      await this.updateEnvironmentFile();
      
      log.title('🎉 SETUP COMPLETE!');
      log.success('Contentful has been successfully configured for your application');
      log.info('You can now set NEXT_PUBLIC_FALLBACK_MODE=false to use Contentful');
      log.info('Run "npm run dev" to test your application with Contentful');
      
    } catch (error) {
      log.error(`Setup failed: ${error.message}`);
      process.exit(1);
    } finally {
      rl.close();
    }
  }

  async gatherCredentials() {
    log.step('Gathering Contentful credentials...');
    
    console.log('\nYou can find these credentials in your Contentful space:');
    console.log('1. Go to https://app.contentful.com/');
    console.log('2. Select your space');
    console.log('3. Go to Settings > General settings for Space ID');
    console.log('4. Go to Settings > API keys for tokens\n');

    this.config.spaceId = await question('Enter your Contentful Space ID: ');
    this.config.accessToken = await question('Enter your Content Delivery API Token: ');
    this.config.managementToken = await question('Enter your Content Management API Token: ');
    
    if (!this.config.spaceId || !this.config.accessToken || !this.config.managementToken) {
      throw new Error('All credentials are required');
    }
    
    log.success('Credentials collected');
  }

  async initializeClient() {
    log.step('Initializing Contentful client...');
    
    this.client = createClient({
      accessToken: this.config.managementToken
    });
    
    this.space = await this.client.getSpace(this.config.spaceId);
    this.environment = await this.space.getEnvironment(this.config.environmentId);
    
    log.success('Client initialized');
  }

  async verifyConnection() {
    log.step('Verifying connection...');
    
    const space = await this.client.getSpace(this.config.spaceId);
    log.success(`Connected to space: "${space.name}"`);
  }

  async createContentModels() {
    log.step('Creating content models...');
    
    for (const [contentTypeId, model] of Object.entries(contentModels)) {
      try {
        // Check if content type already exists
        try {
          const existingContentType = await this.environment.getContentType(contentTypeId);
          log.warning(`Content type "${model.name}" already exists, skipping...`);
          continue;
        } catch (error) {
          // Content type doesn't exist, create it
        }

        log.info(`Creating content type: ${model.name}`);
        
        const contentType = await this.environment.createContentTypeWithId(contentTypeId, {
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
  }

  async addSampleContent() {
    log.step('Adding sample content...');
    
    // Add categories
    log.info('Adding categories...');
    for (const category of sampleContent.categories) {
      try {
        const entry = await this.environment.createEntry('category', {
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
    log.info('Adding games...');
    for (const game of sampleContent.games) {
      try {
        const entry = await this.environment.createEntry('game', {
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

    // Add articles
    log.info('Adding articles...');
    for (const article of sampleContent.articles) {
      try {
        const entry = await this.environment.createEntry('article', {
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
  }

  async testIntegration() {
    log.step('Testing integration...');
    
    // Test with the delivery API
    const { createClient: createDeliveryClient } = require('contentful');
    const deliveryClient = createDeliveryClient({
      space: this.config.spaceId,
      accessToken: this.config.accessToken
    });

    try {
      const articles = await deliveryClient.getEntries({
        content_type: 'article',
        limit: 1
      });
      
      if (articles.items.length > 0) {
        log.success(`Integration test passed! Found ${articles.total} articles`);
      } else {
        log.warning('Integration test passed but no articles found');
      }
    } catch (error) {
      throw new Error(`Integration test failed: ${error.message}`);
    }
  }

  async updateEnvironmentFile() {
    log.step('Updating environment file...');
    
    const envPath = path.join(process.cwd(), '.env.local');
    const envExamplePath = path.join(process.cwd(), '.env.example');
    
    const envContent = `# Contentful Configuration (Generated by setup script)
NEXT_PUBLIC_CONTENTFUL_SPACE_ID=${this.config.spaceId}
NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN=${this.config.accessToken}
CONTENTFUL_ENVIRONMENT=master

# Set to false to use Contentful instead of fallback data
NEXT_PUBLIC_FALLBACK_MODE=false

# Appwrite Configuration (Optional - keep commented if not using)
# NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_appwrite_project_id_here
# NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
`;

    try {
      // Read existing .env.local if it exists
      let existingContent = '';
      if (fs.existsSync(envPath)) {
        existingContent = fs.readFileSync(envPath, 'utf8');
      }

      // Check if Contentful config already exists
      if (existingContent.includes('NEXT_PUBLIC_CONTENTFUL_SPACE_ID')) {
        log.warning('.env.local already contains Contentful configuration');
        const overwrite = await question('Do you want to overwrite it? (y/N): ');
        if (overwrite.toLowerCase() !== 'y') {
          log.info('Skipping environment file update');
          return;
        }
      }

      fs.writeFileSync(envPath, envContent);
      log.success('Created .env.local with Contentful configuration');
      log.info('You can now restart your application to use Contentful');
      
    } catch (error) {
      log.error(`Failed to update environment file: ${error.message}`);
      log.info('Please manually add these environment variables:');
      console.log(envContent);
    }
  }
}

// Run the setup if this script is executed directly
if (require.main === module) {
  const setup = new ContentfulSetup();
  setup.run().catch(error => {
    console.error('Setup failed:', error);
    process.exit(1);
  });
}

module.exports = ContentfulSetup;