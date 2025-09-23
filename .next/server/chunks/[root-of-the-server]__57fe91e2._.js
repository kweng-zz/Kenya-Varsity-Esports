module.exports = [
"[project]/esports/.next-internal/server/app/api/strapi/articles/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[project]/esports/src/lib/strapi.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Strapi API configuration and helper functions
__turbopack_context__.s([
    "getStrapiMediaURL",
    ()=>getStrapiMediaURL,
    "strapiAPI",
    ()=>strapiAPI,
    "transformStrapiArticle",
    ()=>transformStrapiArticle
]);
const STRAPI_URL = ("TURBOPACK compile-time value", "https://kuer-production.up.railway.app") || 'http://localhost:1337';
const STRAPI_API_TOKEN = ("TURBOPACK compile-time value", "279a6ee3be0e8e2d3af220ea9e93cf5d8f43bdb41d96b6f860b435afdbde6bc28852a28f3be26610a314d19020765851acdcc42aa092075072ea4482264dc9091ca32d01f2117e4e8c578173b05980c4a32c77bddc2b9439d86587e6769f27c07a27f7a9b6e03c825ca7628fc4718ba156dcc1f18b1df36e385df1469b27841f") || process.env.STRAPI_API_TOKEN;
// Helper function to build Strapi API URLs
function getStrapiURL(path = '') {
    return `${STRAPI_URL}/api${path}`;
}
function getStrapiMediaURL(url) {
    if (!url) return null;
    // If it's already a full URL, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    // Otherwise, prepend the Strapi URL
    return `${STRAPI_URL}${url}`;
}
// Helper function to convert blocks content to string
function blocksToString(content) {
    if (typeof content === 'string') {
        return content;
    }
    if (!Array.isArray(content)) {
        return '';
    }
    return content.map((block)=>{
        if (block.children && Array.isArray(block.children)) {
            return block.children.map((child)=>child.text || '').join('');
        }
        return '';
    }).join('\n\n');
}
// Helper function to make API requests to Strapi
async function fetchAPI(path, options = {}) {
    // Skip Strapi calls during build if environment variable is set
    if (process.env.SKIP_STRAPI_BUILD === 'true') {
        console.log('Skipping Strapi API call during build:', path);
        return {
            data: [],
            meta: {
                pagination: {
                    page: 1,
                    pageSize: 0,
                    pageCount: 0,
                    total: 0
                }
            }
        };
    }
    // Check if Strapi is configured
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...STRAPI_API_TOKEN && {
                Authorization: `Bearer ${STRAPI_API_TOKEN}`
            }
        }
    };
    const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
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
const strapiAPI = {
    // Get all articles with optional filters
    async getArticles (params = {}) {
        const { page = 1, pageSize = 10, featured, category, game, search, populate = [
            'image'
        ] } = params;
        // Build query parameters
        const queryParams = new URLSearchParams();
        // Pagination
        queryParams.append('pagination[page]', page.toString());
        queryParams.append('pagination[pageSize]', pageSize.toString());
        // Populate relations
        populate.forEach((field)=>{
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
    async getArticleBySlug (slug) {
        const queryParams = new URLSearchParams();
        queryParams.append('filters[slug][$eq]', slug);
        queryParams.append('populate', 'image');
        return fetchAPI(`/articles?${queryParams.toString()}`);
    },
    // Get featured articles
    async getFeaturedArticles (limit = 3) {
        return this.getArticles({
            featured: true,
            pageSize: limit,
            populate: [
                'image'
            ]
        });
    },
    // Get categories (unique values from articles)
    async getCategories () {
        try {
            const response = await this.getArticles({
                pageSize: 100
            });
            const categories = new Set();
            response.data.forEach((article)=>{
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
    async getGames () {
        try {
            const response = await this.getArticles({
                pageSize: 100
            });
            const games = new Set();
            response.data.forEach((article)=>{
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
function transformStrapiArticle(article) {
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
    const getValue = (flatKey, nestedKey)=>{
        if (isFlat) {
            return article[flatKey];
        } else {
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
        } else if (article.image && typeof article.image === 'object' && 'url' in article.image) {
            imageUrl = article.image.url;
        }
    } else {
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
            height: null
        } : null
    };
}
}),
"[project]/esports/src/app/api/strapi/articles/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$lib$2f$strapi$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/src/lib/strapi.ts [app-route] (ecmascript)");
;
;
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        // Parse query parameters
        const page = parseInt(searchParams.get('page') || '1');
        const pageSize = parseInt(searchParams.get('pageSize') || '10');
        const featured = searchParams.get('featured') === 'true' ? true : undefined;
        const category = searchParams.get('category') || undefined;
        const game = searchParams.get('game') || undefined;
        const search = searchParams.get('search') || undefined;
        const limit = parseInt(searchParams.get('limit') || '0');
        // Fetch articles from Strapi
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$lib$2f$strapi$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["strapiAPI"].getArticles({
            page,
            pageSize: limit > 0 ? limit : pageSize,
            featured,
            category,
            game,
            search,
            populate: [
                'image'
            ]
        });
        // Transform articles
        const transformedArticles = response.data.map(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$lib$2f$strapi$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["transformStrapiArticle"]);
        return __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            articles: transformedArticles,
            pagination: response.meta.pagination
        });
    } catch (error) {
        console.error('Error fetching articles from Strapi:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Failed to fetch articles',
            articles: []
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        success: false,
        error: 'Method not allowed'
    }, {
        status: 405
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__57fe91e2._.js.map