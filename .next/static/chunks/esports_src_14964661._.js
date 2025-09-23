(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/esports/src/lib/strapi.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/esports/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const STRAPI_URL = ("TURBOPACK compile-time value", "https://kuer-strapi-backend-production.up.railway.app") || 'http://localhost:1337';
const STRAPI_API_TOKEN = ("TURBOPACK compile-time value", "e3cff91858de3e5c3571877d32ba8ace1538cae90deb278c7d43d4385165fb503f8b4924941cb4a11477ea4c5dd27f140aecd360c35326f9ef24f900419c3d582c2c15169e60febaa93ab13882d1f4d4af1842893bea15e8aed011564b686c06537fb112eef522c596783a7768795c8d567e0ced6ed356b3ef46a99eccb2c5f0") || __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.STRAPI_API_TOKEN;
// Helper function to build Strapi API URLs
function getStrapiURL() {
    let path = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : '';
    return "".concat(STRAPI_URL, "/api").concat(path);
}
function getStrapiMediaURL(url) {
    if (!url) return null;
    // If it's already a full URL, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    // If URL starts with /, prepend the Strapi URL
    if (url.startsWith('/')) {
        return "".concat(STRAPI_URL).concat(url);
    }
    // Otherwise, prepend the Strapi URL with /uploads/ path
    return "".concat(STRAPI_URL, "/uploads/").concat(url);
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
async function fetchAPI(path) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, requireAuth = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
    // Skip Strapi calls during build if environment variable is set
    if (__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.SKIP_STRAPI_BUILD === 'true') {
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
    // Build headers - only add Authorization for authenticated requests
    const headers = {
        'Content-Type': 'application/json'
    };
    // Only add Authorization header if explicitly required and token is available
    if (requireAuth && STRAPI_API_TOKEN) {
        headers.Authorization = "Bearer ".concat(STRAPI_API_TOKEN);
    }
    const defaultOptions = {
        headers
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
            console.error("Strapi API error: ".concat(response.status, " ").concat(response.statusText));
            throw new Error("Failed to fetch from Strapi: ".concat(response.status));
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
    async getArticles () {
        let params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
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
        return fetchAPI("/articles?".concat(queryParams.toString()));
    },
    // Get a single article by slug
    async getArticleBySlug (slug) {
        const queryParams = new URLSearchParams();
        queryParams.append('filters[slug][$eq]', slug);
        queryParams.append('populate', 'image');
        return fetchAPI("/articles?".concat(queryParams.toString()));
    },
    // Get featured articles
    async getFeaturedArticles () {
        let limit = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 3;
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
                var _article_attributes;
                if (!article) return;
                // Handle both flat and nested structures
                const category = article.category || ((_article_attributes = article.attributes) === null || _article_attributes === void 0 ? void 0 : _article_attributes.category);
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
                var _article_attributes;
                if (!article) return;
                // Handle both flat and nested structures
                const game = article.game || ((_article_attributes = article.attributes) === null || _article_attributes === void 0 ? void 0 : _article_attributes.game);
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
            var _article_attributes;
            const key = nestedKey || flatKey;
            return (_article_attributes = article.attributes) === null || _article_attributes === void 0 ? void 0 : _article_attributes[key];
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
        var _article_attributes_image_data_attributes, _article_attributes_image_data, _article_attributes_image, _article_attributes;
        // Old nested structure
        imageUrl = (_article_attributes = article.attributes) === null || _article_attributes === void 0 ? void 0 : (_article_attributes_image = _article_attributes.image) === null || _article_attributes_image === void 0 ? void 0 : (_article_attributes_image_data = _article_attributes_image.data) === null || _article_attributes_image_data === void 0 ? void 0 : (_article_attributes_image_data_attributes = _article_attributes_image_data.attributes) === null || _article_attributes_image_data_attributes === void 0 ? void 0 : _article_attributes_image_data_attributes.url;
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/esports/src/app/admin/blogs/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AdminBlogsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/src/contexts/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$lib$2f$strapi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/src/lib/strapi.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/esports/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__ = __turbopack_context__.i("[project]/esports/node_modules/lucide-react/dist/esm/icons/square-pen.js [app-client] (ecmascript) <export default as Edit>");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/esports/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/esports/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/esports/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/esports/node_modules/lucide-react/dist/esm/icons/calendar.js [app-client] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/esports/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
const initialFormData = {
    title: '',
    description: '',
    content: '',
    slug: '',
    category: '',
    game: '',
    author: '',
    featured: false,
    tags: []
};
function AdminBlogsPage() {
    _s();
    const { user, profile, loading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const [articles, setArticles] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [categories, setCategories] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [games, setGames] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showCreateForm, setShowCreateForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [editingArticle, setEditingArticle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialFormData);
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [selectedCategory, setSelectedCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [currentPage, setCurrentPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [totalPages, setTotalPages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [isSubmitting, setIsSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const articlesPerPage = 10;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AdminBlogsPage.useEffect": ()=>{
            if (!loading && (profile === null || profile === void 0 ? void 0 : profile.isAdmin)) {
                loadArticles();
                loadFilters();
            }
        }
    }["AdminBlogsPage.useEffect"], [
        currentPage,
        selectedCategory,
        searchTerm,
        loading,
        profile === null || profile === void 0 ? void 0 : profile.isAdmin
    ]);
    const loadArticles = async ()=>{
        try {
            var _response_meta_pagination;
            setIsLoading(true);
            setError(null);
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$lib$2f$strapi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["strapiAPI"].getArticles({
                page: currentPage,
                pageSize: articlesPerPage,
                category: selectedCategory || undefined,
                search: searchTerm || undefined,
                populate: [
                    'image'
                ]
            });
            const transformedArticles = response.data.map(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$lib$2f$strapi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transformStrapiArticle"]);
            setArticles(transformedArticles);
            setTotalPages(((_response_meta_pagination = response.meta.pagination) === null || _response_meta_pagination === void 0 ? void 0 : _response_meta_pagination.pageCount) || 1);
        } catch (error) {
            console.error('Error loading articles:', error);
            setError('Failed to load articles. Using fallback data.');
            // Fallback articles for when Strapi is not available
            const fallbackArticles = [
                {
                    id: '1',
                    title: 'MASINDE MULIRO UNIVERSITY (MMUST) MAKES HISTORY',
                    description: 'As the Only Non-Nairobi Winner in the Kenya University Esports Rankings',
                    content: 'MMUST has made history by becoming the first non-Nairobi university to win the Kenya University Esports Rankings.',
                    slug: 'mmust-makes-history',
                    publishedAt: '2024-01-15T00:00:00.000Z',
                    createdAt: '2024-01-15T00:00:00.000Z',
                    updatedAt: '2024-01-15T00:00:00.000Z',
                    featured: true,
                    category: 'Tournament Results',
                    game: 'PUBG Mobile',
                    author: 'KUER Team',
                    tags: [
                        'MMUST',
                        'Tournament',
                        'Victory'
                    ],
                    imageUrl: '/images/Join our tournaments.png',
                    image: null
                }
            ];
            setArticles(fallbackArticles);
            setTotalPages(1);
        } finally{
            setIsLoading(false);
        }
    };
    const loadFilters = async ()=>{
        try {
            const [categoriesData, gamesData] = await Promise.all([
                __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$lib$2f$strapi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["strapiAPI"].getCategories(),
                __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$lib$2f$strapi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["strapiAPI"].getGames()
            ]);
            setCategories(categoriesData);
            setGames(gamesData);
        } catch (error) {
            console.error('Error loading filters:', error);
            setCategories([
                'Tournament Results',
                'Championship',
                'News',
                'Reviews',
                'Updates'
            ]);
            setGames([
                'PUBG Mobile',
                'Call of Duty Mobile',
                'Free Fire',
                'Fortnite',
                'Multiple Games'
            ]);
        }
    };
    const handleCreateNew = ()=>{
        setFormData({
            ...initialFormData,
            author: (profile === null || profile === void 0 ? void 0 : profile.fullname) || 'KUER Team'
        });
        setEditingArticle(null);
        setShowCreateForm(true);
    };
    const handleEdit = (article)=>{
        setFormData({
            title: String(article.title || ''),
            description: String(article.description || ''),
            content: String(article.content || ''),
            slug: String(article.slug || ''),
            category: String(article.category || ''),
            game: String(article.game || ''),
            author: String(article.author || ''),
            featured: Boolean(article.featured),
            tags: Array.isArray(article.tags) ? article.tags : []
        });
        setEditingArticle(article);
        setShowCreateForm(true);
    };
    const handleDelete = async (articleId)=>{
        if (!confirm('Are you sure you want to delete this article?')) return;
        try {
            const response = await fetch("/api/strapi/articles/".concat(articleId), {
                method: 'DELETE'
            });
            const result = await response.json();
            if (result.success) {
                alert('Article deleted successfully');
                loadArticles();
            } else {
                throw new Error(result.error || 'Failed to delete article');
            }
        } catch (error) {
            console.error('Error deleting article:', error);
            alert('Failed to delete article: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    };
    const generateSlug = (title)=>{
        return title.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
    };
    const handleFormSubmit = async (e)=>{
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // Generate slug if not provided
            if (!formData.slug && formData.title) {
                formData.slug = generateSlug(formData.title);
            }
            // Create FormData for file upload
            const submitFormData = new FormData();
            submitFormData.append('title', formData.title);
            submitFormData.append('description', formData.description);
            submitFormData.append('content', formData.content);
            submitFormData.append('slug', formData.slug);
            submitFormData.append('category', formData.category);
            submitFormData.append('game', formData.game);
            submitFormData.append('author', formData.author);
            submitFormData.append('featured', formData.featured.toString());
            submitFormData.append('tags', formData.tags.join(','));
            if (formData.image) {
                submitFormData.append('image', formData.image);
            }
            let response;
            if (editingArticle) {
                // Update existing article
                response = await fetch("/api/strapi/articles/".concat(editingArticle.id), {
                    method: 'PUT',
                    body: submitFormData
                });
            } else {
                // Create new article
                response = await fetch('/api/strapi/articles/create', {
                    method: 'POST',
                    body: submitFormData
                });
            }
            const result = await response.json();
            if (result.success) {
                alert(editingArticle ? 'Article updated successfully!' : 'Article created successfully!');
                setShowCreateForm(false);
                setFormData(initialFormData);
                setEditingArticle(null);
                loadArticles();
            } else {
                // Handle specific Strapi connection errors
                if (result.details && result.details.includes('Strapi')) {
                    alert("Strapi Connection Error: ".concat(result.details, "\n\nTo use blog management:\n1. Start Strapi: cd kuer && npm run develop\n2. Configure environment variables\n3. Follow STRAPI_SETUP.md guide"));
                } else {
                    throw new Error(result.error || 'Failed to save article');
                }
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            let errorMessage = 'Failed to save article: ';
            if (error instanceof Error) {
                if (error.message.includes('fetch')) {
                    errorMessage += 'Cannot connect to server. Please check if Strapi is running.';
                } else {
                    errorMessage += error.message;
                }
            } else {
                errorMessage += 'Unknown error';
            }
            alert(errorMessage);
        } finally{
            setIsSubmitting(false);
        }
    };
    const formatDate = (dateString)=>{
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    // Loading state
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center min-h-screen bg-gray-900 text-white",
            children: "Loading admin panel..."
        }, void 0, false, {
            fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
            lineNumber: 264,
            columnNumber: 7
        }, this);
    }
    // Unauthorized access
    if (!(profile === null || profile === void 0 ? void 0 : profile.isAdmin)) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white gap-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "text-3xl font-bold",
                    children: "Access Denied"
                }, void 0, false, {
                    fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                    lineNumber: 274,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: "You must be an admin to view this page."
                }, void 0, false, {
                    fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                    lineNumber: 275,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
            lineNumber: 273,
            columnNumber: 7
        }, this);
    }
    if (showCreateForm) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-gray-900 text-white p-8",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-4xl mx-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mb-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-3xl font-bold",
                                children: editingArticle ? 'Edit Article' : 'Create New Article'
                            }, void 0, false, {
                                fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                lineNumber: 285,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    setShowCreateForm(false);
                                    setFormData(initialFormData);
                                    setEditingArticle(null);
                                },
                                className: "px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors",
                                children: "Cancel"
                            }, void 0, false, {
                                fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                lineNumber: 288,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                        lineNumber: 284,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleFormSubmit,
                        className: "space-y-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 md:grid-cols-2 gap-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm font-medium mb-2",
                                                children: "Title *"
                                            }, void 0, false, {
                                                fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                                lineNumber: 303,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: formData.title,
                                                onChange: (e)=>setFormData({
                                                        ...formData,
                                                        title: e.target.value
                                                    }),
                                                className: "w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500",
                                                required: true
                                            }, void 0, false, {
                                                fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                                lineNumber: 304,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                        lineNumber: 302,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm font-medium mb-2",
                                                children: "Slug"
                                            }, void 0, false, {
                                                fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                                lineNumber: 314,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: formData.slug,
                                                onChange: (e)=>setFormData({
                                                        ...formData,
                                                        slug: e.target.value
                                                    }),
                                                placeholder: "Auto-generated from title",
                                                className: "w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500"
                                            }, void 0, false, {
                                                fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                                lineNumber: 315,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                        lineNumber: 313,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm font-medium mb-2",
                                                children: "Category *"
                                            }, void 0, false, {
                                                fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                                lineNumber: 325,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: formData.category,
                                                onChange: (e)=>setFormData({
                                                        ...formData,
                                                        category: e.target.value
                                                    }),
                                                placeholder: "e.g., Tournament Results, News, Reviews",
                                                className: "w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500",
                                                required: true
                                            }, void 0, false, {
                                                fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                                lineNumber: 326,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                        lineNumber: 324,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm font-medium mb-2",
                                                children: "Game"
                                            }, void 0, false, {
                                                fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                                lineNumber: 337,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: formData.game,
                                                onChange: (e)=>setFormData({
                                                        ...formData,
                                                        game: e.target.value
                                                    }),
                                                placeholder: "e.g., PUBG Mobile, Call of Duty Mobile, Free Fire",
                                                className: "w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500"
                                            }, void 0, false, {
                                                fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                                lineNumber: 338,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                        lineNumber: 336,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm font-medium mb-2",
                                                children: "Author"
                                            }, void 0, false, {
                                                fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                                lineNumber: 348,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: formData.author,
                                                onChange: (e)=>setFormData({
                                                        ...formData,
                                                        author: e.target.value
                                                    }),
                                                className: "w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500"
                                            }, void 0, false, {
                                                fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                                lineNumber: 349,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                        lineNumber: 347,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                id: "featured",
                                                checked: formData.featured,
                                                onChange: (e)=>setFormData({
                                                        ...formData,
                                                        featured: e.target.checked
                                                    }),
                                                className: "mr-2"
                                            }, void 0, false, {
                                                fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                                lineNumber: 358,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                htmlFor: "featured",
                                                className: "text-sm font-medium",
                                                children: "Featured Article"
                                            }, void 0, false, {
                                                fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                                lineNumber: 365,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                        lineNumber: 357,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                lineNumber: 301,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium mb-2",
                                        children: "Description *"
                                    }, void 0, false, {
                                        fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                        lineNumber: 370,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                        value: formData.description,
                                        onChange: (e)=>setFormData({
                                                ...formData,
                                                description: e.target.value
                                            }),
                                        rows: 3,
                                        className: "w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500",
                                        required: true
                                    }, void 0, false, {
                                        fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                        lineNumber: 371,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                lineNumber: 369,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium mb-2",
                                        children: "Content *"
                                    }, void 0, false, {
                                        fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                        lineNumber: 381,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                        value: formData.content,
                                        onChange: (e)=>setFormData({
                                                ...formData,
                                                content: e.target.value
                                            }),
                                        rows: 12,
                                        className: "w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500",
                                        required: true
                                    }, void 0, false, {
                                        fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                        lineNumber: 382,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                lineNumber: 380,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium mb-2",
                                        children: "Tags (comma-separated)"
                                    }, void 0, false, {
                                        fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                        lineNumber: 392,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: formData.tags.join(', '),
                                        onChange: (e)=>setFormData({
                                                ...formData,
                                                tags: e.target.value.split(',').map((tag)=>tag.trim()).filter((tag)=>tag)
                                            }),
                                        placeholder: "e.g., tournament, victory, PUBG",
                                        className: "w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500"
                                    }, void 0, false, {
                                        fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                        lineNumber: 393,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                lineNumber: 391,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium mb-2",
                                        children: "Featured Image"
                                    }, void 0, false, {
                                        fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                        lineNumber: 406,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "file",
                                        accept: "image/*",
                                        onChange: (e)=>{
                                            var _e_target_files;
                                            return setFormData({
                                                ...formData,
                                                image: (_e_target_files = e.target.files) === null || _e_target_files === void 0 ? void 0 : _e_target_files[0]
                                            });
                                        },
                                        className: "w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500"
                                    }, void 0, false, {
                                        fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                        lineNumber: 407,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                lineNumber: 405,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "submit",
                                        disabled: isSubmitting,
                                        className: "px-6 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg transition-colors",
                                        children: isSubmitting ? 'Saving...' : editingArticle ? 'Update Article' : 'Create Article'
                                    }, void 0, false, {
                                        fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                        lineNumber: 416,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>{
                                            setShowCreateForm(false);
                                            setFormData(initialFormData);
                                            setEditingArticle(null);
                                        },
                                        className: "px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors",
                                        children: "Cancel"
                                    }, void 0, false, {
                                        fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                        lineNumber: 423,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                lineNumber: 415,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                        lineNumber: 300,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                lineNumber: 283,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
            lineNumber: 282,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gray-900 text-white p-8",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-7xl mx-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between mb-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-4xl font-bold mb-2",
                                    children: "Blog Management"
                                }, void 0, false, {
                                    fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                    lineNumber: 447,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-gray-400",
                                    children: "Manage your blog posts and articles"
                                }, void 0, false, {
                                    fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                    lineNumber: 448,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                            lineNumber: 446,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/admin",
                                    className: "px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors",
                                    children: "Back to Admin"
                                }, void 0, false, {
                                    fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                    lineNumber: 451,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleCreateNew,
                                    className: "flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                            lineNumber: 461,
                                            columnNumber: 15
                                        }, this),
                                        "Create New Article"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                    lineNumber: 457,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                            lineNumber: 450,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                    lineNumber: 445,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col md:flex-row gap-4 mb-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative flex-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                    className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                    lineNumber: 470,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: searchTerm,
                                    onChange: (e)=>setSearchTerm(e.target.value),
                                    placeholder: "Search articles...",
                                    className: "pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 w-full"
                                }, void 0, false, {
                                    fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                    lineNumber: 471,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                            lineNumber: 469,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                            value: selectedCategory,
                            onChange: (e)=>setSelectedCategory(e.target.value),
                            className: "px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "",
                                    children: "All Categories"
                                }, void 0, false, {
                                    fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                    lineNumber: 484,
                                    columnNumber: 13
                                }, this),
                                categories.map((category)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: category,
                                        children: category
                                    }, category, false, {
                                        fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                        lineNumber: 486,
                                        columnNumber: 15
                                    }, this))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                            lineNumber: 479,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                    lineNumber: 468,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-gray-800 rounded-lg overflow-hidden",
                    children: isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-center py-12",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"
                        }, void 0, false, {
                            fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                            lineNumber: 497,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                        lineNumber: 496,
                        columnNumber: 13
                    }, this) : articles.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center py-12",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-400",
                            children: "No articles found"
                        }, void 0, false, {
                            fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                            lineNumber: 501,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                        lineNumber: 500,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "overflow-x-auto",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                            className: "w-full",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                    className: "bg-gray-700",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider",
                                                children: "Article"
                                            }, void 0, false, {
                                                fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                                lineNumber: 508,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider",
                                                children: "Category"
                                            }, void 0, false, {
                                                fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                                lineNumber: 511,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider",
                                                children: "Author"
                                            }, void 0, false, {
                                                fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                                lineNumber: 514,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider",
                                                children: "Published"
                                            }, void 0, false, {
                                                fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                                lineNumber: 517,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider",
                                                children: "Status"
                                            }, void 0, false, {
                                                fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                                lineNumber: 520,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider",
                                                children: "Actions"
                                            }, void 0, false, {
                                                fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                                lineNumber: 523,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                        lineNumber: 507,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                    lineNumber: 506,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                    className: "divide-y divide-gray-700",
                                    children: articles.map((article)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            className: "hover:bg-gray-750",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-6 py-4",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex-shrink-0 h-12 w-12",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                    className: "h-12 w-12 rounded-lg object-cover",
                                                                    src: article.imageUrl || '/images/Join our tournaments.png',
                                                                    alt: String(article.title || 'Article image')
                                                                }, void 0, false, {
                                                                    fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                                                    lineNumber: 534,
                                                                    columnNumber: 29
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                                                lineNumber: 533,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "ml-4",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "text-sm font-medium text-white line-clamp-1",
                                                                        children: String(article.title || 'Untitled Article')
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                                                        lineNumber: 541,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "text-sm text-gray-400 line-clamp-1",
                                                                        children: String(article.description || 'No description available')
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                                                        lineNumber: 544,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                                                lineNumber: 540,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                                        lineNumber: 532,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                                    lineNumber: 531,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-6 py-4 whitespace-nowrap",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "px-2 py-1 text-xs font-medium bg-red-900 text-red-200 rounded-full",
                                                        children: String(article.category || 'General')
                                                    }, void 0, false, {
                                                        fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                                        lineNumber: 551,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                                    lineNumber: 550,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-6 py-4 whitespace-nowrap text-sm text-gray-300",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                                className: "w-4 h-4 mr-1"
                                                            }, void 0, false, {
                                                                fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                                                lineNumber: 557,
                                                                columnNumber: 27
                                                            }, this),
                                                            String(article.author || 'Unknown Author')
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                                        lineNumber: 556,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                                    lineNumber: 555,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-6 py-4 whitespace-nowrap text-sm text-gray-300",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                                                className: "w-4 h-4 mr-1"
                                                            }, void 0, false, {
                                                                fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                                                lineNumber: 563,
                                                                columnNumber: 27
                                                            }, this),
                                                            formatDate(String(article.publishedAt || new Date().toISOString()))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                                        lineNumber: 562,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                                    lineNumber: 561,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-6 py-4 whitespace-nowrap",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center",
                                                        children: [
                                                            article.featured && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "px-2 py-1 text-xs font-medium bg-yellow-900 text-yellow-200 rounded-full mr-2",
                                                                children: "Featured"
                                                            }, void 0, false, {
                                                                fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                                                lineNumber: 570,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "px-2 py-1 text-xs font-medium bg-green-900 text-green-200 rounded-full",
                                                                children: "Published"
                                                            }, void 0, false, {
                                                                fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                                                lineNumber: 574,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                                        lineNumber: 568,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                                    lineNumber: 567,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-6 py-4 whitespace-nowrap text-right text-sm font-medium",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center justify-end gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                href: "/blogs/".concat(article.slug),
                                                                className: "text-blue-400 hover:text-blue-300 p-1",
                                                                title: "View Article",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                                    className: "w-4 h-4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                                                    lineNumber: 586,
                                                                    columnNumber: 29
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                                                lineNumber: 581,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>handleEdit(article),
                                                                className: "text-yellow-400 hover:text-yellow-300 p-1",
                                                                title: "Edit Article",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__["Edit"], {
                                                                    className: "w-4 h-4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                                                    lineNumber: 593,
                                                                    columnNumber: 29
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                                                lineNumber: 588,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>handleDelete(article.id),
                                                                className: "text-red-400 hover:text-red-300 p-1",
                                                                title: "Delete Article",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                    className: "w-4 h-4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                                                    lineNumber: 600,
                                                                    columnNumber: 29
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                                                lineNumber: 595,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                                        lineNumber: 580,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                                    lineNumber: 579,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, article.id, true, {
                                            fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                            lineNumber: 530,
                                            columnNumber: 21
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                                    lineNumber: 528,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                            lineNumber: 505,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                        lineNumber: 504,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                    lineNumber: 494,
                    columnNumber: 9
                }, this),
                totalPages > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-center gap-4 mt-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setCurrentPage(Math.max(1, currentPage - 1)),
                            disabled: currentPage <= 1,
                            className: "px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
                            children: "Previous"
                        }, void 0, false, {
                            fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                            lineNumber: 615,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-white",
                            children: [
                                "Page ",
                                currentPage,
                                " of ",
                                totalPages
                            ]
                        }, void 0, true, {
                            fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                            lineNumber: 623,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setCurrentPage(Math.min(totalPages, currentPage + 1)),
                            disabled: currentPage >= totalPages,
                            className: "px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
                            children: "Next"
                        }, void 0, false, {
                            fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                            lineNumber: 627,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
                    lineNumber: 614,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
            lineNumber: 443,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/esports/src/app/admin/blogs/page.tsx",
        lineNumber: 442,
        columnNumber: 5
    }, this);
}
_s(AdminBlogsPage, "SUNt36KO3K1hTfyby+ieZfKt1bo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = AdminBlogsPage;
var _c;
__turbopack_context__.k.register(_c, "AdminBlogsPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=esports_src_14964661._.js.map