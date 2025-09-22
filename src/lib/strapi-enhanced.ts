// Enhanced Strapi API configuration with better error handling
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || process.env.STRAPI_API_TOKEN;

// Helper function to make API requests to Strapi with enhanced error handling
async function fetchAPI(path, options = {}, requireAuth = false) {
  // Skip Strapi calls during build if environment variable is set
  if (process.env.SKIP_STRAPI_BUILD === 'true') {
    console.log('Skipping Strapi API call during build:', path);
    return { data: [], meta: { pagination: { page: 1, pageSize: 0, pageCount: 0, total: 0 } } };
  }

  // Check if Strapi is configured
  if (!STRAPI_URL || STRAPI_URL === 'http://localhost:1337') {
    // During build time, if Strapi URL is localhost, skip the call
    if (process.env.NODE_ENV === 'production' || process.env.VERCEL === '1') {
      console.log('Skipping localhost Strapi call in production build:', path);
      return { data: [], meta: { pagination: { page: 1, pageSize: 0, pageCount: 0, total: 0 } } };
    }
  }

  // Build headers - only add Authorization for authenticated requests
  const headers = {
    'Content-Type': 'application/json',
  };

  // Only add Authorization header if explicitly required and token is available
  if (requireAuth && STRAPI_API_TOKEN) {
    headers.Authorization = `Bearer ${STRAPI_API_TOKEN}`;
  }

  const defaultOptions = {
    headers,
    mode: 'cors',
    // Add timeout to prevent hanging requests
    signal: AbortSignal.timeout(10000), // 10 second timeout
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
      
      // Handle specific error cases
      if (response.status === 404) {
        console.warn('Strapi content not found, using fallback data');
        return { data: [], meta: { pagination: { page: 1, pageSize: 0, pageCount: 0, total: 0 } } };
      }
      
      if (response.status === 403) {
        console.warn('Strapi access forbidden, check API token permissions');
        return { data: [], meta: { pagination: { page: 1, pageSize: 0, pageCount: 0, total: 0 } } };
      }
      
      if (response.status === 0) {
        console.warn('Strapi backend not available (CORS or network error), using fallback data');
        return { data: [], meta: { pagination: { page: 1, pageSize: 0, pageCount: 0, total: 0 } } };
      }
      
      throw new Error(`Failed to fetch from Strapi: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching from Strapi:', error);
    
    // Handle different types of errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.warn('Strapi backend not available (network error), using fallback data');
      return { data: [], meta: { pagination: { page: 1, pageSize: 0, pageCount: 0, total: 0 } } };
    }
    
    if (error.name === 'AbortError') {
      console.warn('Strapi request timed out, using fallback data');
      return { data: [], meta: { pagination: { page: 1, pageSize: 0, pageCount: 0, total: 0 } } };
    }
    
    // For other errors, still return fallback data instead of throwing
    console.warn('Strapi error, using fallback data:', error.message);
    return { data: [], meta: { pagination: { page: 1, pageSize: 0, pageCount: 0, total: 0 } } };
  }
}

export { fetchAPI };
