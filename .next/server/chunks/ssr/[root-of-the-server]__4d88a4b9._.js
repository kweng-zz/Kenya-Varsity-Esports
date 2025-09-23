module.exports = [
"[project]/esports/.next-internal/server/app/blogs/[slug]/page/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
}),
"[project]/esports/src/app/favicon.ico.mjs { IMAGE => \"[project]/esports/src/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/esports/src/app/favicon.ico.mjs { IMAGE => \"[project]/esports/src/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript)"));
}),
"[project]/esports/src/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/esports/src/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/esports/src/app/blogs/[slug]/not-found.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/esports/src/app/blogs/[slug]/not-found.tsx [app-rsc] (ecmascript)"));
}),
"[project]/esports/src/lib/strapi.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
const STRAPI_URL = ("TURBOPACK compile-time value", "https://kuer-strapi-backend-production.up.railway.app") || 'http://localhost:1337';
const STRAPI_API_TOKEN = ("TURBOPACK compile-time value", "e3cff91858de3e5c3571877d32ba8ace1538cae90deb278c7d43d4385165fb503f8b4924941cb4a11477ea4c5dd27f140aecd360c35326f9ef24f900419c3d582c2c15169e60febaa93ab13882d1f4d4af1842893bea15e8aed011564b686c06537fb112eef522c596783a7768795c8d567e0ced6ed356b3ef46a99eccb2c5f0") || process.env.STRAPI_API_TOKEN;
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
    return content.map((block)=>{
        if (block.children && Array.isArray(block.children)) {
            return block.children.map((child)=>child.text || '').join('');
        }
        return '';
    }).join('\n\n');
}
// Helper function to make API requests to Strapi
async function fetchAPI(path, options = {}, requireAuth = false) {
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
    // Build headers - only add Authorization for authenticated requests
    const headers = {
        'Content-Type': 'application/json'
    };
    // Only add Authorization header if explicitly required and token is available
    if (requireAuth && STRAPI_API_TOKEN) {
        headers.Authorization = `Bearer ${STRAPI_API_TOKEN}`;
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
"[project]/esports/src/components/pages/blogs/BlogPostContent.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "BlogPostContent",
    ()=>BlogPostContent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const BlogPostContent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call BlogPostContent() from the server but BlogPostContent is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/esports/src/components/pages/blogs/BlogPostContent.tsx <module evaluation>", "BlogPostContent");
}),
"[project]/esports/src/components/pages/blogs/BlogPostContent.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "BlogPostContent",
    ()=>BlogPostContent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const BlogPostContent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call BlogPostContent() from the server but BlogPostContent is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/esports/src/components/pages/blogs/BlogPostContent.tsx", "BlogPostContent");
}),
"[project]/esports/src/components/pages/blogs/BlogPostContent.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$components$2f$pages$2f$blogs$2f$BlogPostContent$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/esports/src/components/pages/blogs/BlogPostContent.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$components$2f$pages$2f$blogs$2f$BlogPostContent$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/esports/src/components/pages/blogs/BlogPostContent.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$components$2f$pages$2f$blogs$2f$BlogPostContent$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/esports/src/app/blogs/[slug]/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BlogPostPage,
    "generateMetadata",
    ()=>generateMetadata,
    "generateStaticParams",
    ()=>generateStaticParams,
    "revalidate",
    ()=>revalidate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$lib$2f$strapi$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/src/lib/strapi.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$components$2f$Navigation$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/src/components/Navigation.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$components$2f$Footer$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/src/components/Footer.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$components$2f$pages$2f$blogs$2f$BlogPostContent$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/src/components/pages/blogs/BlogPostContent.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
;
const revalidate = 300;
async function generateStaticParams() {
    try {
        // Check if Strapi is available during build
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$lib$2f$strapi$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["strapiAPI"].getArticles({
            pageSize: 100
        });
        const publishedArticles = response.data.filter((article)=>{
            // Handle both flat and nested structures
            const slug = article.slug || article.attributes?.slug;
            return slug; // Only include articles with valid slugs
        });
        return publishedArticles.map((article)=>{
            const slug = article.slug || article.attributes?.slug;
            return {
                slug: slug || 'unknown-article'
            };
        });
    } catch (error) {
        console.error('❌ Error generating static params:', error);
        // Return fallback slugs if Strapi is not available
        return [
            {
                slug: 'mmust-makes-history'
            },
            {
                slug: 'tuk-season-2-champions'
            },
            {
                slug: 'season-3-registration-open'
            },
            {
                slug: 'new-games-added-kuer-lineup'
            }
        ];
    }
}
async function generateMetadata({ params }) {
    try {
        const { slug } = await params;
        // Try to fetch from Strapi
        if ("TURBOPACK compile-time truthy", 1) {
            try {
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$lib$2f$strapi$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["strapiAPI"].getArticleBySlug(slug);
                if (response.data.length > 0) {
                    const article = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$lib$2f$strapi$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["transformStrapiArticle"])(response.data[0]);
                    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kuer.com';
                    const postUrl = `${baseUrl}/blogs/${article.slug}`;
                    return {
                        title: `${String(article.title || 'Article')} | KUER Gaming Blog`,
                        description: String(article.description || 'Read the latest gaming and esports news from KUER.'),
                        keywords: [
                            String(article.category || ''),
                            String(article.game || ''),
                            'gaming',
                            'esports',
                            'KUER',
                            'Kenya'
                        ].filter(Boolean).join(', '),
                        authors: [
                            {
                                name: String(article.author || 'KUER Team')
                            }
                        ],
                        openGraph: {
                            title: String(article.title || 'Article'),
                            description: String(article.description || 'Read the latest gaming and esports news from KUER.'),
                            url: postUrl,
                            siteName: 'KUER',
                            images: article.imageUrl ? [
                                {
                                    url: article.imageUrl,
                                    width: 1200,
                                    height: 630,
                                    alt: String(article.title || 'Article')
                                }
                            ] : [],
                            locale: 'en_US',
                            type: 'article',
                            publishedTime: String(article.publishedAt || new Date().toISOString()),
                            modifiedTime: String(article.updatedAt || article.publishedAt || new Date().toISOString()),
                            authors: [
                                String(article.author || 'KUER Team')
                            ],
                            section: String(article.category || 'Gaming'),
                            tags: Array.isArray(article.tags) ? article.tags : []
                        },
                        twitter: {
                            card: 'summary_large_image',
                            title: String(article.title || 'Article'),
                            description: String(article.description || 'Read the latest gaming and esports news from KUER.'),
                            images: article.imageUrl ? [
                                article.imageUrl
                            ] : [],
                            creator: '@kuer',
                            site: '@kuer'
                        },
                        alternates: {
                            canonical: postUrl
                        }
                    };
                }
            } catch (strapiError) {
                console.error('❌ Error fetching metadata from Strapi:', strapiError);
            }
        }
        // Fallback metadata
        return {
            title: 'Article | KUER Gaming Blog',
            description: 'Read the latest gaming and esports news from KUER.'
        };
    } catch (error) {
        console.error('❌ Error generating metadata:', error);
        return {
            title: 'Article | KUER Gaming Blog',
            description: 'Read the latest gaming and esports news from KUER.'
        };
    }
}
async function BlogPostPage({ params }) {
    const { slug } = await params;
    let article = null;
    try {
        // First try to fetch from Strapi directly (server-side)
        if ("TURBOPACK compile-time truthy", 1) {
            try {
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$lib$2f$strapi$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["strapiAPI"].getArticleBySlug(slug);
                if (response.data.length > 0) {
                    article = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$lib$2f$strapi$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["transformStrapiArticle"])(response.data[0]);
                }
            } catch (strapiError) {
                console.error('❌ Error fetching from Strapi directly:', strapiError);
            // Continue to fallback
            }
        }
        // If no article found, use fallback articles
        if (!article) {
            const fallbackArticles = [
                {
                    id: '6',
                    title: 'Safaricom Game Conference: KUER Showcases the Future of University Esports in Kenya',
                    description: 'Kenya University Esports Rankings (KUER) is shaping the future of university gaming in Kenya, giving student gamers a platform to shine and grow.',
                    content: 'The Safaricom Game Conference marked a historic moment for the growth of Esports in Kenya, bringing together gamers, brands, and industry leaders to discuss how to shape the future of the industry. Safaricom Kenya, represented by Chief Consumer Business Officer Fawzia Ali Kimanthi, shared the company\'s commitment to empowering young people and supporting innovation in gaming.\n\nFawzia highlighted Safaricom\'s support for startups through initiatives such as the Spark Accelerator Program, noting that the company is open to game development in Kenya. She explained that Safaricom Kenya wants to be recognized as a brand associated with gaming by listening to gamers, understanding their needs, and offering solutions that will grow the industry locally.\n\nGamers Speak at the Safaricom Game Conference\n\nThe conference also gave a platform to gamers who are shaping the Esports scene in Kenya. Thee Beast, who grew up in Kibera, shared how gaming saved his life, showing how powerful Esports can be as a source of hope, opportunity, and transformation.\n\nShirley Adema, CEO of Tunza Esports and founder of the Kenya University Esports Rankings (KUER), shared her personal journey of being introduced to gaming at an early age by her five brothers. She spoke about the challenges she faced as an Esports athlete and the level of dedication it takes to reach the professional stage. These experiences inspired her to create KUER, a platform designed to provide the structure and recognition that she and many other gamers lacked.\n\nKUER Leading the Way in University Esports\n\nAt the heart of Shirley\'s message was KUER, which has quickly become the most important platform for University Esports in Kenya. By ranking and spotlighting student gamers, KUER bridges the gap between university sports and professional Esports, offering students visibility, competitive opportunities, and a pathway to growth.\n\nKUER is more than a ranking system. It is a movement to create a sustainable structure for Kenyan Esports, ensuring that university players are recognized for their skills and given the chance to pursue careers in competitive gaming. The platform is helping to transform student passion into professional potential, making universities a breeding ground for the next generation of Esports talent.\n\nA Strong Future for Esports in Kenya\n\nThe Safaricom Game Conference highlighted how collaboration between industry leaders, gamers, and organizations like KUER can unlock the future of Esports. With Safaricom Kenya positioning itself as a brand that supports gaming and with KUER driving the university Esports agenda, the Kenyan gaming scene is entering an exciting new era.\n\nThe stories of Thee Beast and Shirley Adema are proof that Esports in Kenya is not just about competition but about transformation, resilience, and opportunity. Through platforms like KUER and the support of partners like Safaricom Kenya, the future of University Esports in Kenya has never looked brighter.',
                    slug: 'safaricom-game-conference-kuer-showcases-the-future-of-university-esportsinkenya',
                    publishedAt: '2025-09-22T18:03:30.570Z',
                    createdAt: '2025-09-22T18:03:30.570Z',
                    updatedAt: '2025-09-22T18:03:30.570Z',
                    featured: true,
                    category: 'News',
                    game: 'General',
                    author: 'Wayne Kabaraji',
                    tags: [],
                    imageUrl: 'https://kuer-strapi-backend-production.up.railway.app/uploads/Whats_App_Image_2025_09_22_at_19_46_27_fdfd5106_09a24f2c46.jpg',
                    image: null
                },
                {
                    id: '2',
                    title: 'B34R CL4N: Official KUER Sponsor',
                    description: 'Who is B34R CL4N?',
                    content: 'B34R CL4N isn\'t just a name—it\'s a movement. Built on teamwork dedication and pure love for the game B34R CL4N has grown into a respected force within the Call of Duty: Mobile community. Known for their tactical plays fierce competitive spirit and an unshakable bond the clan embodies what it means to dominate the battlefield while still upholding the values of respect and sportsmanship.\n\nThe battleground is heating up and the competition is fiercer than ever. KUER Call of Duty Tournaments have quickly become one of the most exciting esports events in the region bringing together top talent rising stars and passionate fans of Call of Duty: Mobile. And now we\'re proud to announce a powerful partnership that\'s taking things to the next level.\n\nWhy KUER Tournaments?\n\nSponsoring the KUER Call of Duty Tournaments is more than just a partnership—it\'s a mission. B34R CL4N is committed to growing the local and regional esports scene giving players a platform to showcase their skills and providing fans with unforgettable competitive moments.\n\nBy backing KUER tournaments the clan is not only supporting the next generation of Call of Duty players but also contributing to the overall growth of esports culture.',
                    slug: 'b34r-cl4n-official-kuer-sponsor',
                    publishedAt: '2025-09-19T19:38:52.825Z',
                    createdAt: '2025-09-19T19:38:52.809Z',
                    updatedAt: '2025-09-19T19:38:52.809Z',
                    featured: false,
                    category: 'News',
                    game: null,
                    author: 'Tonny Maina',
                    tags: [],
                    imageUrl: '/images/B34R-CL4N-with-name.png',
                    image: null
                },
                {
                    id: '1',
                    title: 'MASINDE MULIRO UNIVERSITY (MMUST) MAKES HISTORY',
                    description: 'As the Only Non-Nairobi Winner in the Kenya University Esports Rankings, MMUST has proven that talent exists beyond the capital city.',
                    content: 'MMUST has made history by becoming the first non-Nairobi university to win the Kenya University Esports Rankings. This achievement showcases the incredible talent that exists beyond the capital city and proves that esports excellence can be found throughout Kenya.\n\nThe team\'s journey to victory was marked by exceptional teamwork, strategic gameplay, and countless hours of practice. Their success serves as an inspiration to universities across the country and demonstrates that with dedication and skill, any team can reach the top.\n\nThis victory not only brings pride to MMUST but also highlights the growing esports scene in Kenya\'s universities. As more institutions invest in esports programs, we can expect to see even more exciting competitions and talented players emerging from across the country.',
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
                        'Victory',
                        'University'
                    ],
                    imageUrl: '/images/Join our tournaments.png',
                    image: null
                },
                {
                    id: '3',
                    title: 'TUK TAKES THE OVERALL POSITION FOR SEASON 2',
                    description: 'The Technical University of Kenya gathers the top position in KUER Season 2, showcasing exceptional gaming skills and teamwork.',
                    content: 'The Technical University of Kenya (TUK) has claimed the overall championship position in KUER Season 2, demonstrating exceptional gaming skills and remarkable teamwork throughout the competition.\n\nTUK\'s path to victory was characterized by consistent performance across multiple game titles and strategic gameplay that outmaneuvered their competitors. The team\'s dedication to practice and their ability to adapt to different gaming scenarios proved to be the key factors in their success.\n\nThis championship win solidifies TUK\'s position as one of the premier esports institutions in Kenya and sets a high standard for future competitions. Their victory serves as motivation for other universities to strengthen their esports programs and compete at the highest level.',
                    slug: 'tuk-season-2-champions',
                    publishedAt: '2024-01-10T00:00:00.000Z',
                    createdAt: '2024-01-10T00:00:00.000Z',
                    updatedAt: '2024-01-10T00:00:00.000Z',
                    featured: false,
                    category: 'Championship',
                    game: 'Call of Duty Mobile',
                    author: 'KUER Team',
                    tags: [
                        'TUK',
                        'Championship',
                        'Season 2',
                        'Victory'
                    ],
                    imageUrl: '/images/Join-Your-Uni.png',
                    image: null
                },
                {
                    id: '4',
                    title: 'SEASON 3 REGISTRATION NOW OPEN',
                    description: 'Universities across Kenya can now register for the upcoming Season 3 of the Kenya University Esports Rankings.',
                    content: 'The registration for KUER Season 3 is now officially open! Universities across Kenya are invited to participate in what promises to be the most exciting season yet.\n\nSeason 3 will feature expanded game titles, increased prize pools, and enhanced streaming coverage. We\'re expecting record participation as more universities recognize the value of competitive esports.\n\nRegistration is simple and can be completed through our official website. Don\'t miss this opportunity to showcase your university\'s gaming talent and compete for the championship title.',
                    slug: 'season-3-registration-open',
                    publishedAt: '2024-01-20T00:00:00.000Z',
                    createdAt: '2024-01-20T00:00:00.000Z',
                    updatedAt: '2024-01-20T00:00:00.000Z',
                    featured: false,
                    category: 'Registration',
                    game: 'Multiple Games',
                    author: 'KUER Team',
                    tags: [
                        'Registration',
                        'Season 3',
                        'Universities',
                        'Competition'
                    ],
                    imageUrl: '/images/Join-the-Discord.png',
                    image: null
                },
                {
                    id: '5',
                    title: 'NEW GAMES ADDED TO KUER LINEUP',
                    description: 'Exciting new gaming titles have been added to the official KUER tournament lineup for the upcoming season.',
                    content: 'We\'re thrilled to announce the addition of several new gaming titles to the KUER tournament lineup! These additions reflect the evolving esports landscape and provide more opportunities for universities to showcase their gaming talents.\n\nThe new games have been carefully selected based on their competitive viability, popularity among university students, and potential for exciting tournament play. Each game brings unique strategic elements and skill requirements to the competition.\n\nWith these additions, KUER continues to evolve and provide the most comprehensive university esports experience in Kenya. Stay tuned for more details about tournament formats and schedules for these new titles.',
                    slug: 'new-games-added-kuer-lineup',
                    publishedAt: '2024-01-18T00:00:00.000Z',
                    createdAt: '2024-01-18T00:00:00.000Z',
                    updatedAt: '2024-01-18T00:00:00.000Z',
                    featured: false,
                    category: 'Updates',
                    game: 'Multiple Games',
                    author: 'KUER Team',
                    tags: [
                        'New Games',
                        'Tournament',
                        'Updates',
                        'Lineup'
                    ],
                    imageUrl: '/images/footer.png',
                    image: null
                }
            ];
            const foundArticle = fallbackArticles.find((a)=>a.slug === slug);
            if (!foundArticle) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["notFound"])();
            }
            article = foundArticle;
        }
    } catch (error) {
        console.error('❌ Error fetching article:', error);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["notFound"])();
    }
    if (!article) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["notFound"])();
    }
    // ✅ JSON-LD (SEO)
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: String(article.title || 'Article'),
        description: String(article.description || 'Read the latest gaming and esports news from KUER.'),
        image: article.imageUrl ? [
            article.imageUrl
        ] : [],
        datePublished: String(article.publishedAt || new Date().toISOString()),
        dateModified: String(article.updatedAt || article.publishedAt || new Date().toISOString()),
        author: {
            '@type': 'Person',
            name: String(article.author || 'KUER Team')
        },
        publisher: {
            '@type': 'Organization',
            name: 'KUER',
            logo: {
                '@type': 'ImageObject',
                url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://kuer.com'}/logo.png`
            }
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${process.env.NEXT_PUBLIC_BASE_URL || 'https://kuer.com'}/blogs/${article.slug}`
        },
        articleSection: String(article.category || 'Gaming'),
        keywords: [
            String(article.category || ''),
            String(article.game || ''),
            ...Array.isArray(article.tags) ? article.tags : []
        ].filter(Boolean).join(', ')
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("script", {
                type: "application/ld+json",
                dangerouslySetInnerHTML: {
                    __html: JSON.stringify(jsonLd)
                }
            }, void 0, false, {
                fileName: "[project]/esports/src/app/blogs/[slug]/page.tsx",
                lineNumber: 298,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "bg-black w-full min-h-screen",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full relative z-20",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$components$2f$Navigation$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Navigation"], {}, void 0, false, {
                            fileName: "[project]/esports/src/app/blogs/[slug]/page.tsx",
                            lineNumber: 305,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/esports/src/app/blogs/[slug]/page.tsx",
                        lineNumber: 304,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$components$2f$pages$2f$blogs$2f$BlogPostContent$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["BlogPostContent"], {
                        post: article
                    }, void 0, false, {
                        fileName: "[project]/esports/src/app/blogs/[slug]/page.tsx",
                        lineNumber: 309,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$components$2f$Footer$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FooterSection"], {}, void 0, false, {
                        fileName: "[project]/esports/src/app/blogs/[slug]/page.tsx",
                        lineNumber: 312,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/esports/src/app/blogs/[slug]/page.tsx",
                lineNumber: 302,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
}),
"[project]/esports/src/app/blogs/[slug]/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/esports/src/app/blogs/[slug]/page.tsx [app-rsc] (ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__4d88a4b9._.js.map