// Contentful API utility functions
import { createClient, Entry, Asset, ContentfulClientApi } from 'contentful';

/* =============================
   Environment Variables
============================= */
// Environment variables
const CONTENTFUL_SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const CONTENTFUL_ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;
const CONTENTFUL_PREVIEW_ACCESS_TOKEN = process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN;
const CONTENTFUL_ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || 'master';
const NEXT_PUBLIC_FALLBACK_MODE = process.env.NEXT_PUBLIC_FALLBACK_MODE;



/* =============================
   Interfaces & Types
============================= */
export interface ContentfulResponse<T = any> {
  data: T[];
  total: number;
  skip: number;
  limit: number;
}

export interface ContentfulError {
  message: string;
  details?: any;
}

export interface ContentfulArticleFields {
  title: string;
  description: string;
  content: string;
  slug: string;
  publishedAt?: string;
  featured: boolean;
  category: string;
  game?: string;
  author: string;
  authorAvatar?: Asset;
  authorBio?: string;
  authorTwitter?: string;
  authorLinkedIn?: string;
  authorInstagram?: string;
  authorTikTok?: string;
  authorYouTube?: string;
  authorFacebook?: string;
  tags: string[];
  image?: Asset;
}

// Simplified type - just use Entry with any
export type ContentfulArticle = Entry<any>;
export interface ContentfulCategory {
  sys: { id: string };
  fields: { name: string; slug: string };
}

export interface ContentfulGame {
  sys: { id: string };
  fields: { name: string; slug: string };
}

/* =============================
   Contentful API Class
============================= */
class ContentfulAPI {
  private client: ContentfulClientApi<any> | null = null;
  private previewClient: ContentfulClientApi<any> | null = null;

  constructor() {
    this.initClients();
  }

  private initClients() {
    if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_ACCESS_TOKEN) {
      return;
    }

    try {
      this.client = createClient({
        space: CONTENTFUL_SPACE_ID,
        accessToken: CONTENTFUL_ACCESS_TOKEN,
        environment: CONTENTFUL_ENVIRONMENT,
      });

      if (CONTENTFUL_PREVIEW_ACCESS_TOKEN) {
        this.previewClient = createClient({
          space: CONTENTFUL_SPACE_ID,
          accessToken: CONTENTFUL_PREVIEW_ACCESS_TOKEN,
          environment: CONTENTFUL_ENVIRONMENT,
          host: 'preview.contentful.com',
        });
      }
    } catch (err) {
      // Silently fail in production
    }
  }

  private getClient(preview = false) {
    return preview && this.previewClient ? this.previewClient : this.client;
  }

  /* ---------- Queries ---------- */
  async getArticles(params?: {
    page?: number;
    pageSize?: number;
    category?: string;
    game?: string;
    search?: string;
    featured?: boolean;
    preview?: boolean;
  }): Promise<ContentfulResponse<ContentfulArticle>> {
    const client = this.getClient(params?.preview);
    if (!client) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Contentful client not initialized, returning empty results');
        console.warn('Reinitializing clients...');
      }
      this.initClients();
      const retryClient = this.getClient(params?.preview);
      if (!retryClient) {
        return { data: [], total: 0, skip: 0, limit: 10 };
      }
      return this.getArticles(params);
    }

    try {
      const query: any = {
        content_type: 'article',
        limit: params?.pageSize ?? 10,
        skip: params?.page ? (params.page - 1) * (params.pageSize ?? 10) : 0,
        order: '-sys.createdAt',
      };

      if (params?.category) query['fields.category'] = params.category;
      if (params?.game) query['fields.game'] = params.game;
      if (params?.search) query['fields.title[match]'] = params.search;
      if (params?.featured !== undefined) query['fields.featured'] = params.featured;

      const res = await client.getEntries(query);
      return { data: res.items, total: res.total, skip: res.skip, limit: res.limit };
    } catch (error) {
      console.error('Error fetching articles from Contentful:', error);
      return { data: [], total: 0, skip: 0, limit: 10 };
    }
  }

  async getArticleBySlug(slug: string, preview = false) {
    const client = this.getClient(preview);
    if (!client) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Contentful client not initialized');
      }
      return null;
    }

    try {
      const res = await client.getEntries({
        content_type: 'article',
        'fields.slug': slug,
        limit: 1,
      });
      return res.items[0] || null;
    } catch (error) {
      console.error('Error fetching article by slug:', error);
      return null;
    }
  }

  async getFeaturedArticles(limit = 3, preview = false) {
    const client = this.getClient(preview);
    if (!client) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Contentful client not initialized');
      }
      return { data: [], total: 0, skip: 0, limit };
    }

    try {
      const res = await client.getEntries({
        content_type: 'article',
        'fields.featured': true,
        limit,
        order: ['-sys.createdAt'],
      });

      return { data: res.items, total: res.total, skip: res.skip, limit: res.limit };
    } catch (error) {
      console.error('Error fetching featured articles:', error);
      return { data: [], total: 0, skip: 0, limit };
    }
  }

  async getCategories(preview = false): Promise<string[]> {
    const client = this.getClient(preview);
    if (!client) return [];

    try {
      const res = await client.getEntries({ content_type: 'category', limit: 100, order: ['fields.name'] });
      return res.items.map((item: any) => item.fields.name);
    } catch {
      return ['Tournament Results', 'Championship', 'News', 'Reviews', 'Updates'];
    }
  }

  async getGames(preview = false): Promise<string[]> {
    const client = this.getClient(preview);
    if (!client) return [];

    try {
      const res = await client.getEntries({ content_type: 'game', limit: 100, order: ['fields.name'] });
      return res.items.map((item: any) => item.fields.name);
    } catch {
      return ['PUBG Mobile', 'Call of Duty Mobile', 'Free Fire', 'Fortnite', 'Multiple Games'];
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.client?.getSpace();
      return true;
    } catch {
      return false;
    }
  }
}

export const contentful = new ContentfulAPI();

/* =============================
   Helpers & Transformers
============================= */
export const getContentfulImageUrl = (asset?: Asset, width?: number, height?: number): string | null => {
  if (!asset?.fields?.file?.url) return null;
  
  let url = asset.fields.file.url;
  if (typeof url !== 'string') return null;

  // Add protocol if missing
  if (url.startsWith('//')) {
    url = `https:${url}`;
  }

  // Validate that it's a proper Contentful URL
  if (!url.includes('ctfassets.net') && !url.includes('contentful.com')) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Invalid Contentful image URL:', url);
    }
    return null;
  }

  try {
    // For development, use simpler image URLs without heavy optimization
    if (process.env.NODE_ENV === 'development') {
      const params = new URLSearchParams();
      if (width) params.append('w', Math.min(width, 1200).toString()); // Cap width for dev
      if (height) params.append('h', Math.min(height, 800).toString()); // Cap height for dev
      params.append('fm', 'jpg'); // Use JPG instead of WebP for better compatibility
      params.append('q', '75'); // Slightly lower quality for faster loading
      
      const processedUrl = params.toString() ? `${url}?${params}` : url;
      return processedUrl;
    }

    // Production optimization with fallback strategy
    const params = new URLSearchParams();
    if (width) params.append('w', width.toString());
    if (height) params.append('h', height.toString());
    
    // Try WebP first, but have JPG fallback ready
    params.append('fm', 'webp');
    params.append('q', '80');
    
    const processedUrl = `${url}?${params}`;
    return processedUrl;
  } catch (error) {
    console.error('Error processing Contentful image URL:', error);
    return url; // Return original URL as fallback
  }
};

export interface TransformedArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  slug: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  featured: boolean;
  category: string;
  game: string;
  author: string;
  authorAvatar?: string;
  authorBio?: string;
  authorTwitter?: string;
  authorLinkedIn?: string;
  authorInstagram?: string;
  authorTikTok?: string;
  authorYouTube?: string;
  authorFacebook?: string;
  tags: string[];
  imageUrl: string | null;
  image: any;
}

export const transformContentfulArticle = (article: ContentfulArticle): TransformedArticle => {
  const f = article.fields as any;
  return {
    id: article.sys.id,
    title: f.title || '',
    description: f.description || '',
    content: f.content || '',
    slug: f.slug || '',
    publishedAt: f.publishedAt || article.sys.createdAt,
    createdAt: article.sys.createdAt,
    updatedAt: article.sys.updatedAt,
    featured: Boolean(f.featured),
    category: f.category || 'General',
    game: f.game || '',
    author: f.author || 'KVE Team',
    authorAvatar: f.authorAvatar?.fields?.file?.url
      ? `https:${f.authorAvatar.fields.file.url}`
      : undefined,
    authorBio: f.authorBio || `Esports writer and analyst covering ${(f.category || 'gaming').toLowerCase()} and competitive gaming trends.`,
    authorTwitter: f.authorTwitter,
    authorLinkedIn: f.authorLinkedIn,
    authorInstagram: f.authorInstagram,
    authorTikTok: f.authorTiktok || f.authorTikTok,
    authorYouTube: f.authorYouTube,
    authorFacebook: f.authorFacebook,
    tags: Array.isArray(f.tags) ? f.tags : [],
    imageUrl: getContentfulImageUrl(f.image, 800, 600) ?? '/images/Join our tournaments.png',
    image: f.image || null,
  };
};

/* =============================
   Backward Compatibility API
============================= */
const isFallbackMode = () => NEXT_PUBLIC_FALLBACK_MODE === 'true'; 

export const contentfulAPI = {
  async getArticles(params?: any) {
    if (isFallbackMode() || !CONTENTFUL_SPACE_ID || !CONTENTFUL_ACCESS_TOKEN) {
      return emptyPaginatedResponse();
    }

    const res = await contentful.getArticles(params);
    const data = res.data.map(transformContentfulArticle);
    return paginatedResponse(data, res.total, params?.page || 1, params?.pageSize || 10);
  },

  async getCategories() {
    if (isFallbackMode()) return defaultCategories();
    return contentful.getCategories().catch(defaultCategories);
  },

  async getGames() {
    if (isFallbackMode()) return defaultGames();
    return contentful.getGames().catch(defaultGames);
  },

  async getArticleBySlug(slug: string) {
    if (isFallbackMode()) return emptyPaginatedResponse();
    const article = await contentful.getArticleBySlug(slug);
    const data = article ? [transformContentfulArticle(article)] : [];
    return paginatedResponse(data, data.length);
  },

  async getFeaturedArticles(limit = 1) {
    if (isFallbackMode()) return emptyPaginatedResponse(limit);
    const res = await contentful.getFeaturedArticles(limit);
    const data = res.data.map(transformContentfulArticle);
    return paginatedResponse(data, res.total, 1, limit);
  },
};

/* =============================
   Utilities for fallback
============================= */
const emptyPaginatedResponse = (pageSize = 10) => ({
  data: [],
  meta: { pagination: { page: 1, pageSize, pageCount: 0, total: 0 } },
});

const paginatedResponse = (data: any[], total: number, page = 1, pageSize = 10) => ({
  data,
  meta: {
    pagination: {
      page,
      pageSize,
      pageCount: Math.ceil(total / pageSize),
      total,
    },
  },
});

const defaultCategories = () => ['Tournament Results', 'Championship', 'News', 'Reviews', 'Updates'];
const defaultGames = () => ['PUBG Mobile', 'Call of Duty Mobile', 'Free Fire', 'Fortnite', 'Multiple Games'];

/* =============================
   Export legacy types
============================= */
export type { ContentfulResponse as StrapiResponse, ContentfulError as StrapiError };