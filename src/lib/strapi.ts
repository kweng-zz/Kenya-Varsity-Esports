// Strapi API configuration and helper functions
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || process.env.STRAPI_API_TOKEN;

// Types for Strapi responses
export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiArticle {
  id: number;
  documentId?: string;
  // Support both new flat structure and old nested structure
  title?: string;
  description?: string;
  content?: Array<{
    type: string;
    children: Array<{
      type: string;
      text: string;
    }>;
  }> | string;
  slug?: string;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  featured?: boolean;
  category?: string;
  game?: string;
  author?: string;
  tags?: string[];
  image?: unknown;
  // Legacy nested structure support
  attributes?: {
    title?: string;
    description?: string;
    content?: Array<{
      type: string;
      children: Array<{
        type: string;
        text: string;
      }>;
    }> | string;
    slug?: string;
    publishedAt?: string;
    createdAt?: string;
    updatedAt?: string;
    featured?: boolean;
    category?: string;
    game?: string;
    author?: string;
    tags?: string[];
    image?: {
      data?: {
        id: number;
        attributes: {
          name: string;
          alternativeText?: string;
          caption?: string;
          width: number;
          height: number;
          formats?: Record<string, unknown>;
          hash: string;
          ext: string;
          mime: string;
          size: number;
          url: string;
          previewUrl?: string;
          provider: string;
          provider_metadata?: Record<string, unknown>;
          createdAt: string;
          updatedAt: string;
        };
      };
    };
  };
}

// Helper function to build Strapi API URLs
function getStrapiURL(path: string = '') {
  return `${STRAPI_URL}/api${path}`;
}

// Helper function to get media URL
export function getStrapiMediaURL(url: string | undefined) {
  if (!url) return null;
  
  // If it's already a full URL, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Otherwise, prepend the Strapi URL
  return `${STRAPI_URL}${url}`;
}

// Helper function to convert blocks content to string
function blocksToString(content: Array<{
  type: string;
  children: Array<{
    type: string;
    text: string;
  }>;
}> | string): string {
  if (typeof content === 'string') {
    return content;
  }
  
  if (!Array.isArray(content)) {
    return '';
  }
  
  return content
    .map(block => {
      if (block.children && Array.isArray(block.children)) {
        return block.children
          .map(child => child.text || '')
          .join('');
      }
      return '';
    })
    .join('\n\n');
}

// Helper function to make API requests to Strapi
async function fetchAPI(path: string, options: RequestInit = {}) {
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(STRAPI_API_TOKEN && { Authorization: `Bearer ${STRAPI_API_TOKEN}` }),
    },
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  const requestUrl = getStrapiURL(path);
  
  try {
    const response = await fetch(requestUrl, mergedOptions);
    
    if (!response.ok) {
      console.error(`Strapi API error: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch from Strapi: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching from Strapi:', error);
    throw error;
  }
}

// Blog API functions
export const strapiAPI = {
  // Get all articles with optional filters
  async getArticles(params: {
    page?: number;
    pageSize?: number;
    featured?: boolean;
    category?: string;
    game?: string;
    search?: string;
    populate?: string[];
  } = {}): Promise<StrapiResponse<StrapiArticle[]>> {
    const {
      page = 1,
      pageSize = 10,
      featured,
      category,
      game,
      search,
      populate = ['image']
    } = params;

    // Build query parameters
    const queryParams = new URLSearchParams();
    
    // Pagination
    queryParams.append('pagination[page]', page.toString());
    queryParams.append('pagination[pageSize]', pageSize.toString());
    
    // Populate relations
    populate.forEach(field => {
      queryParams.append('populate', field);
    });
    
    // Filters
    if (featured !== undefined) {
      queryParams.append('filters[featured][$eq]', featured.toString());
    }
    
    if (category) {
      queryParams.append('filters[category][$eq]', category);
    }
    
    if (game) {
      queryParams.append('filters[game][$eq]', game);
    }
    
    if (search) {
      queryParams.append('filters[$or][0][title][$containsi]', search);
      queryParams.append('filters[$or][1][description][$containsi]', search);
      queryParams.append('filters[$or][2][content][$containsi]', search);
    }
    
    // Sort by publishedAt descending (newest first)
    queryParams.append('sort', 'publishedAt:desc');

    return fetchAPI(`/articles?${queryParams.toString()}`);
  },

  // Get a single article by slug
  async getArticleBySlug(slug: string): Promise<StrapiResponse<StrapiArticle[]>> {
    const queryParams = new URLSearchParams();
    queryParams.append('filters[slug][$eq]', slug);
    queryParams.append('populate', 'image');
    
    return fetchAPI(`/articles?${queryParams.toString()}`);
  },

  // Get featured articles
  async getFeaturedArticles(limit: number = 3): Promise<StrapiResponse<StrapiArticle[]>> {
    return this.getArticles({
      featured: true,
      pageSize: limit,
      populate: ['image']
    });
  },

  // Get categories (unique values from articles)
  async getCategories(): Promise<string[]> {
    try {
      const response = await this.getArticles({ pageSize: 100 });
      const categories = new Set<string>();
      
      response.data.forEach(article => {
        if (!article) return;
        
        // Handle both flat and nested structures
        const category = article.category || article.attributes?.category;
        if (category) {
          categories.add(category);
        }
      });
      
      return Array.from(categories).sort();
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },

  // Get games (unique values from articles)
  async getGames(): Promise<string[]> {
    try {
      const response = await this.getArticles({ pageSize: 100 });
      const games = new Set<string>();
      
      response.data.forEach(article => {
        if (!article) return;
        
        // Handle both flat and nested structures
        const game = article.game || article.attributes?.game;
        if (game) {
          games.add(game);
        }
      });
      
      return Array.from(games).sort();
    } catch (error) {
      console.error('Error fetching games:', error);
      return [];
    }
  }
};

// Transform Strapi article to a more usable format
export function transformStrapiArticle(article: StrapiArticle) {
  if (!article) {
    console.warn('Invalid article structure:', article);
    return {
      id: 'unknown',
      title: 'Unknown Article',
      description: 'No description available',
      content: '',
      slug: 'unknown-article',
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      featured: false,
      category: 'General',
      game: null,
      author: 'KUER Team',
      tags: [],
      imageUrl: null,
      image: null
    };
  }

  // Determine if we're using the new flat structure or old nested structure
  const isFlat = article.title !== undefined || article.attributes === undefined;
  
  // Helper function to get value from either flat or nested structure
  const getValue = (flatKey: keyof StrapiArticle, nestedKey?: string): unknown => {
    if (isFlat) {
      return article[flatKey];
    } else {
      const key = nestedKey || flatKey;
      return article.attributes?.[key as keyof typeof article.attributes];
    }
  };

  // Handle image URL extraction
  let imageUrl = null;
  if (isFlat) {
    // New flat structure - image might be a direct URL or object
    if (typeof article.image === 'string') {
      imageUrl = article.image;
    } else if (article.image && typeof article.image === 'object' && 'url' in article.image) {
      imageUrl = (article.image as { url: string }).url;
    }
  } else {
    // Old nested structure
    imageUrl = article.attributes?.image?.data?.attributes?.url;
  }
  
  return {
    id: article.id.toString(),
    title: String(getValue('title') || 'Untitled'),
    description: String(getValue('description') || ''),
    content: blocksToString((getValue('content') as Array<{type: string; children: Array<{type: string; text: string}>}> | string) || ''),
    slug: String(getValue('slug') || 'untitled'),
    publishedAt: String(getValue('publishedAt') || new Date().toISOString()),
    createdAt: String(getValue('createdAt') || new Date().toISOString()),
    updatedAt: String(getValue('updatedAt') || new Date().toISOString()),
    featured: Boolean(getValue('featured') || false),
    category: String(getValue('category') || 'General'),
    game: getValue('game') ? String(getValue('game')) : null,
    author: String(getValue('author') || 'KUER Team'),
    tags: Array.isArray(getValue('tags')) ? getValue('tags') as string[] : [],
    imageUrl: imageUrl ? getStrapiMediaURL(imageUrl) : null,
    image: imageUrl ? {
      id: article.id,
      url: getStrapiMediaURL(imageUrl),
      alternativeText: null,
      width: null,
      height: null,
    } : null
  };
}

export type TransformedArticle = ReturnType<typeof transformStrapiArticle>;