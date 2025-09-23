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
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
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

// Export types
export type { StrapiResponse, StrapiError };