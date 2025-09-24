// Strapi API configuration and helper functions
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || process.env.STRAPI_API_TOKEN;
// Helper function to build Strapi API URLs
function getStrapiURL(path = '') {
    return `${STRAPI_URL}/api${path}`;
}
// Helper function to get media URL
export function getStrapiMediaURL(url) {
    if (!url)
        return null;
    // If it's already a full URL, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    // If URL starts with /, prepend the Strapi URL
    if (url.startsWith('/')) {
        return `${STRAPI_URL}${url}`;
    }
    // Otherwise, prepend the Strapi URL with /uploads/ path
    return `${STRAPI_URL}/uploads/${url}`;
}
// Helper function to convert blocks content to string
function blocksToString(content) {
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
        // Add mode: 'cors' to handle CORS properly
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
            // Handle specific error cases more gracefully
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
            // For other errors, still return fallback data instead of throwing
            console.warn(`Strapi API error ${response.status}, using fallback data`);
            return { data: [], meta: { pagination: { page: 1, pageSize: 0, pageCount: 0, total: 0 } } };
        }
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error('Error fetching from Strapi:', error);
        // Handle different types of errors gracefully
        if (error instanceof TypeError && error.message.includes('fetch')) {
            console.warn('Strapi backend not available (network error), using fallback data');
            return { data: [], meta: { pagination: { page: 1, pageSize: 0, pageCount: 0, total: 0 } } };
        }
        if (error instanceof Error && error.name === 'AbortError') {
            console.warn('Strapi request timed out, using fallback data');
            return { data: [], meta: { pagination: { page: 1, pageSize: 0, pageCount: 0, total: 0 } } };
        }
        // For any other errors, return fallback data instead of throwing
        console.warn('Strapi error, using fallback data:', error instanceof Error ? error.message : 'Unknown error');
        return { data: [], meta: { pagination: { page: 1, pageSize: 0, pageCount: 0, total: 0 } } };
    }
}
// Blog API functions
export const strapiAPI = {
    // Get all articles with optional filters
    async getArticles(params = {}) {
        const { page = 1, pageSize = 10, featured, category, game, search, populate = ['image'] } = params;
        
        try {
            // Use our local API route which handles both Strapi and fallback
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
            
            const response = await fetch(`/api/strapi/articles?${queryParams.toString()}`);
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching articles:', error);
            // Return fallback data
            return { 
                data: [], 
                meta: { pagination: { page: 1, pageSize: 0, pageCount: 0, total: 0 } },
                fallback: true 
            };
        }
    },
    // Get a single article by slug
    async getArticleBySlug(slug) {
        const queryParams = new URLSearchParams();
        queryParams.append('filters[slug][$eq]', slug);
        queryParams.append('populate', 'image');
        return fetchAPI(`/articles?${queryParams.toString()}`);
    },
    // Get featured articles
    async getFeaturedArticles(limit = 3) {
        return this.getArticles({
            featured: true,
            pageSize: limit,
            populate: ['image']
        });
    },
    // Get categories (unique values from articles)
    async getCategories() {
        try {
            const response = await this.getArticles({ pageSize: 100 });
            const categories = new Set();
            response.data.forEach(article => {
                if (!article)
                    return;
                // Handle both flat and nested structures
                const category = article.category || article.attributes?.category;
                if (category) {
                    categories.add(category);
                }
            });
            return Array.from(categories).sort();
        }
        catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    },
    // Get games (unique values from articles)
    async getGames() {
        try {
            const response = await this.getArticles({ pageSize: 100 });
            const games = new Set();
            response.data.forEach(article => {
                if (!article)
                    return;
                // Handle both flat and nested structures
                const game = article.game || article.attributes?.game;
                if (game) {
                    games.add(game);
                }
            });
            return Array.from(games).sort();
        }
        catch (error) {
            console.error('Error fetching games:', error);
            return [];
        }
    }
};
// Transform Strapi article to a more usable format
export function transformStrapiArticle(article) {
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
    const getValue = (flatKey, nestedKey) => {
        if (isFlat) {
            return article[flatKey];
        }
        else {
            const key = nestedKey || flatKey;
            return article.attributes?.[key];
        }
    };
    // Handle image URL extraction
    let imageUrl = null;
    if (isFlat) {
        // New flat structure - image might be a direct URL or object
        if (typeof article.image === 'string') {
            imageUrl = article.image;
        }
        else if (article.image && typeof article.image === 'object' && 'url' in article.image) {
            imageUrl = article.image.url;
        }
    }
    else {
        // Old nested structure
        imageUrl = article.attributes?.image?.data?.attributes?.url;
    }
    return {
        id: article.id.toString(),
        title: String(getValue('title') || 'Untitled'),
        description: String(getValue('description') || ''),
        content: blocksToString(getValue('content') || ''),
        slug: String(getValue('slug') || 'untitled'),
        publishedAt: String(getValue('publishedAt') || new Date().toISOString()),
        createdAt: String(getValue('createdAt') || new Date().toISOString()),
        updatedAt: String(getValue('updatedAt') || new Date().toISOString()),
        featured: Boolean(getValue('featured') || false),
        category: String(getValue('category') || 'General'),
        game: getValue('game') ? String(getValue('game')) : null,
        author: String(getValue('author') || 'KUER Team'),
        tags: Array.isArray(getValue('tags')) ? getValue('tags') : [],
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
