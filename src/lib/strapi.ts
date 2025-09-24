// Strapi API utility functions

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

if (!STRAPI_URL) {
  console.warn('NEXT_PUBLIC_STRAPI_URL is not configured');
}

interface StrapiResponse<T = any> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface StrapiError {
  error: {
    status: number;
    name: string;
    message: string;
    details?: any;
  };
}

class StrapiAPI {
  private baseURL: string;
  private token?: string;

  constructor(baseURL: string, token?: string) {
    this.baseURL = baseURL.replace(/\/$/, ''); // Remove trailing slash
    this.token = token;
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}/api${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error?.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      return data;
    } catch (error) {
      console.error(`Strapi API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Get multiple entries
  async find<T = any>(
    contentType: string,
    params?: {
      populate?: string | string[];
      filters?: Record<string, any>;
      sort?: string | string[];
      pagination?: {
        page?: number;
        pageSize?: number;
        start?: number;
        limit?: number;
      };
    }
  ): Promise<StrapiResponse<T[]>> {
    const searchParams = new URLSearchParams();

    if (params?.populate) {
      const populate = Array.isArray(params.populate) 
        ? params.populate.join(',') 
        : params.populate;
      searchParams.append('populate', populate);
    }

    if (params?.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        searchParams.append(`filters[${key}]`, value);
      });
    }

    if (params?.sort) {
      const sort = Array.isArray(params.sort) 
        ? params.sort.join(',') 
        : params.sort;
      searchParams.append('sort', sort);
    }

    if (params?.pagination) {
      Object.entries(params.pagination).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(`pagination[${key}]`, value.toString());
        }
      });
    }

    const query = searchParams.toString();
    const endpoint = `/${contentType}${query ? `?${query}` : ''}`;

    return this.request<StrapiResponse<T[]>>(endpoint);
  }

  // Get single entry by ID
  async findOne<T = any>(
    contentType: string,
    id: string | number,
    params?: {
      populate?: string | string[];
    }
  ): Promise<StrapiResponse<T>> {
    const searchParams = new URLSearchParams();

    if (params?.populate) {
      const populate = Array.isArray(params.populate) 
        ? params.populate.join(',') 
        : params.populate;
      searchParams.append('populate', populate);
    }

    const query = searchParams.toString();
    const endpoint = `/${contentType}/${id}${query ? `?${query}` : ''}`;

    return this.request<StrapiResponse<T>>(endpoint);
  }

  // Create new entry
  async create<T = any>(
    contentType: string,
    data: any
  ): Promise<StrapiResponse<T>> {
    return this.request<StrapiResponse<T>>(`/${contentType}`, {
      method: 'POST',
      body: JSON.stringify({ data }),
    });
  }

  // Update entry
  async update<T = any>(
    contentType: string,
    id: string | number,
    data: any
  ): Promise<StrapiResponse<T>> {
    return this.request<StrapiResponse<T>>(`/${contentType}/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ data }),
    });
  }

  // Delete entry
  async delete<T = any>(
    contentType: string,
    id: string | number
  ): Promise<StrapiResponse<T>> {
    return this.request<StrapiResponse<T>>(`/${contentType}/${id}`, {
      method: 'DELETE',
    });
  }

  // Test connection
  async testConnection(): Promise<any> {
    return this.request('/');
  }
}

// Create and export the API instance
export const strapi = new StrapiAPI(STRAPI_URL || '', STRAPI_TOKEN);

// Export utility functions
export const getStrapiURL = (path: string = '') => {
  return `${STRAPI_URL}${path}`;
};

export const getStrapiMedia = (media: any) => {
  if (!media) return null;
  
  const { url } = media.data?.attributes || media;
  return url?.startsWith('/') ? getStrapiURL(url) : url;
};

// Additional API methods for backward compatibility
export const strapiAPI = {
  async getArticles(params?: {
    page?: number;
    pageSize?: number;
    category?: string;
    game?: string;
    search?: string;
    featured?: boolean;
    populate?: string[];
  }): Promise<StrapiResponse<any[]>> {
    try {
      const searchParams: any = {};
      
      if (params?.page) searchParams.pagination = { page: params.page, pageSize: params.pageSize || 10 };
      if (params?.category) searchParams.filters = { category: { $eq: params.category } };
      if (params?.search) searchParams.filters = { ...searchParams.filters, title: { $containsi: params.search } };
      if (params?.populate) searchParams.populate = params.populate;
      
      const response = await strapi.find('articles', searchParams);
      
      // Ensure data is always an array
      return {
        data: Array.isArray(response.data) ? response.data : [],
        meta: response.meta
      };
    } catch (error) {
      console.error('Error fetching articles:', error);
      // Return empty array on error to prevent filter crashes
      return {
        data: [],
        meta: {
          pagination: {
            page: 1,
            pageSize: 10,
            pageCount: 0,
            total: 0
          }
        }
      };
    }
  },

  async getCategories(): Promise<string[]> {
    try {
      const response = await strapi.find('categories');
      return response.data.map((cat: any) => cat.attributes?.name || cat.name);
    } catch (error) {
      console.warn('Could not fetch categories from Strapi, using defaults');
      return ['Tournament Results', 'Championship', 'News', 'Reviews', 'Updates'];
    }
  },

  async getGames(): Promise<string[]> {
    try {
      const response = await strapi.find('games');
      return response.data.map((game: any) => game.attributes?.name || game.name);
    } catch (error) {
      console.warn('Could not fetch games from Strapi, using defaults');
      return ['PUBG Mobile', 'Call of Duty Mobile', 'Free Fire', 'Fortnite', 'Multiple Games'];
    }
  },

  async getArticleBySlug(slug: string): Promise<StrapiResponse<any[]>> {
    try {
      const searchParams: any = {
        filters: { slug: { $eq: slug } },
        populate: ['image']
      };
      
      const response = await strapi.find('articles', searchParams);
      
      // Ensure data is always an array
      return {
        data: Array.isArray(response.data) ? response.data : [],
        meta: response.meta
      };
    } catch (error) {
      console.error('Error fetching article by slug:', error);
      // Return empty array on error
      return {
        data: [],
        meta: {
          pagination: {
            page: 1,
            pageSize: 10,
            pageCount: 0,
            total: 0
          }
        }
      };
    }
  },

  async getFeaturedArticles(limit: number = 1): Promise<StrapiResponse<any[]>> {
    try {
      const searchParams: any = {
        filters: { featured: { $eq: true } },
        populate: ['image'],
        pagination: { pageSize: limit },
        sort: ['publishedAt:desc']
      };
      
      const response = await strapi.find('articles', searchParams);
      
      // Ensure data is always an array
      return {
        data: Array.isArray(response.data) ? response.data : [],
        meta: response.meta
      };
    } catch (error) {
      console.error('Error fetching featured articles:', error);
      // Return empty array on error
      return {
        data: [],
        meta: {
          pagination: {
            page: 1,
            pageSize: limit,
            pageCount: 0,
            total: 0
          }
        }
      };
    }
  }
};

// Transform function for Strapi articles
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
  tags: string[];
  imageUrl: string | null;
  image: any;
}

export const transformStrapiArticle = (article: any): TransformedArticle => {
  const attributes = article.attributes || article;
  
  return {
    id: String(article.id || ''),
    title: String(attributes.title || ''),
    description: String(attributes.description || ''),
    content: String(attributes.content || ''),
    slug: String(attributes.slug || ''),
    publishedAt: String(attributes.publishedAt || attributes.createdAt || new Date().toISOString()),
    createdAt: String(attributes.createdAt || new Date().toISOString()),
    updatedAt: String(attributes.updatedAt || new Date().toISOString()),
    featured: Boolean(attributes.featured),
    category: String(attributes.category || 'General'),
    game: String(attributes.game || ''),
    author: String(attributes.author || 'KUER Team'),
    tags: Array.isArray(attributes.tags) ? attributes.tags : [],
    imageUrl: getStrapiMedia(attributes.image) || null,
    image: attributes.image || null
  };
};

// Export types
export type { StrapiResponse, StrapiError };