module.exports = [
"[project]/esports/.next-internal/server/app/api/strapi/articles/create/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
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
"[project]/esports/src/app/api/strapi/articles/create/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/server.js [app-route] (ecmascript)");
;
const STRAPI_URL = ("TURBOPACK compile-time value", "https://kuer-strapi-backend-production.up.railway.app") || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;
async function POST(request) {
    try {
        // Check if Strapi URL is configured (allow localhost:1337 as it's the default)
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        const formData = await request.formData();
        // Extract form fields
        const title = formData.get('title');
        const description = formData.get('description');
        const content = formData.get('content');
        const slug = formData.get('slug');
        const category = formData.get('category');
        const game = formData.get('game');
        const author = formData.get('author');
        const featured = formData.get('featured') === 'true';
        const tags = formData.get('tags');
        const image = formData.get('image');
        // Validate required fields
        if (!title || !description || !content || !category) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Missing required fields'
            }, {
                status: 400
            });
        }
        // Generate slug if not provided
        const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
        // Test Strapi connection first
        try {
            console.log('Testing Strapi connection at:', STRAPI_URL);
            console.log('Using API token:', STRAPI_API_TOKEN ? 'Token present' : 'No token');
            const testResponse = await fetch(`${STRAPI_URL}/api/articles?pagination[limit]=1`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...STRAPI_API_TOKEN && {
                        Authorization: `Bearer ${STRAPI_API_TOKEN}`
                    }
                }
            });
            console.log('Strapi test response status:', testResponse.status);
            if (!testResponse.ok) {
                const errorText = await testResponse.text();
                console.error('Strapi test response error:', errorText);
                if (testResponse.status === 401) {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        success: false,
                        error: 'Invalid Strapi API token',
                        details: 'The STRAPI_API_TOKEN is missing, expired, or invalid. Please generate a new API token in your Strapi admin panel (Settings → API Tokens → Create new API token) and update your environment variables.'
                    }, {
                        status: 401
                    });
                } else if (testResponse.status === 403) {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        success: false,
                        error: 'Strapi permissions not configured',
                        details: 'Please enable Article permissions for the API token or Public role in Strapi admin panel. Go to Settings → Roles → Public/Authenticated and enable find, findOne, create, update, delete permissions for Article content type.'
                    }, {
                        status: 403
                    });
                } else if (testResponse.status === 404) {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        success: false,
                        error: 'Article content type not found',
                        details: 'Please create the Article content type in Strapi admin panel. See STRAPI_QUICK_SETUP.md for instructions.'
                    }, {
                        status: 404
                    });
                }
                throw new Error(`Strapi connection failed: ${testResponse.status} - ${errorText}`);
            }
            console.log('Strapi connection test successful');
        } catch (connectionError) {
            console.error('Strapi connection error:', connectionError);
            return __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Cannot connect to Strapi server',
                details: `Please ensure Strapi is running at ${STRAPI_URL}. Error: ${connectionError instanceof Error ? connectionError.message : 'Unknown error'}`
            }, {
                status: 503
            });
        }
        let imageId = null;
        // Upload image if provided
        if (image && image.size > 0) {
            try {
                console.log('Attempting to upload image:', {
                    fileName: image.name,
                    fileSize: image.size,
                    fileType: image.type
                });
                const imageFormData = new FormData();
                imageFormData.append('files', image);
                // Try the standard upload endpoint first
                let imageResponse = await fetch(`${STRAPI_URL}/api/upload`, {
                    method: 'POST',
                    headers: {
                        ...STRAPI_API_TOKEN && {
                            Authorization: `Bearer ${STRAPI_API_TOKEN}`
                        }
                    },
                    body: imageFormData
                });
                console.log('Upload response status:', imageResponse.status);
                // If the standard endpoint fails with 404, try alternative endpoints
                if (!imageResponse.ok && imageResponse.status === 404) {
                    console.log('Standard upload endpoint failed, trying alternative...');
                    // Try without /api prefix (some Strapi configurations)
                    imageResponse = await fetch(`${STRAPI_URL}/upload`, {
                        method: 'POST',
                        headers: {
                            ...STRAPI_API_TOKEN && {
                                Authorization: `Bearer ${STRAPI_API_TOKEN}`
                            }
                        },
                        body: imageFormData
                    });
                    console.log('Alternative upload response status:', imageResponse.status);
                }
                if (imageResponse.ok) {
                    const imageData = await imageResponse.json();
                    // For Strapi v5, we might need to use documentId instead of id
                    imageId = imageData[0]?.documentId || imageData[0]?.id;
                    console.log('Image uploaded successfully:', {
                        imageId,
                        originalId: imageData[0]?.id,
                        documentId: imageData[0]?.documentId,
                        imageUrl: imageData[0]?.url,
                        fullImageData: imageData[0]
                    });
                } else {
                    const errorText = await imageResponse.text();
                    console.warn('Image upload failed:', {
                        status: imageResponse.status,
                        statusText: imageResponse.statusText,
                        error: errorText
                    });
                    console.warn('Continuing without image...');
                }
            } catch (error) {
                console.error('Error uploading image:', error);
            // Continue without image rather than failing the entire request
            }
        }
        // Convert content string to blocks format for Strapi
        const contentBlocks = content ? [
            {
                type: 'paragraph',
                children: [
                    {
                        type: 'text',
                        text: content
                    }
                ]
            }
        ] : [];
        // Create article data without image first (to avoid relation issues)
        const articleData = {
            data: {
                title,
                description,
                content: contentBlocks,
                slug: finalSlug,
                category,
                game: game || null,
                author: author || 'KUER Team',
                featured,
                tags: tags ? tags.split(',').map((tag)=>tag.trim()).filter((tag)=>tag) : [],
                publishedAt: new Date().toISOString()
            }
        };
        console.log('Creating article without image first:', {
            ...articleData,
            data: {
                ...articleData.data,
                content: '[Content blocks - truncated for logging]'
            }
        });
        // Create article in Strapi
        const response = await fetch(`${STRAPI_URL}/api/articles`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...STRAPI_API_TOKEN && {
                    Authorization: `Bearer ${STRAPI_API_TOKEN}`
                }
            },
            body: JSON.stringify(articleData)
        });
        console.log('Strapi create response status:', response.status);
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Strapi API error:', errorData);
            if (response.status === 403) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: false,
                    error: 'Strapi permissions not configured for article creation',
                    details: 'Please enable create, update, delete permissions for Article and upload permission in Strapi admin panel. See PERMISSION_FIX.md for step-by-step instructions.'
                }, {
                    status: 403
                });
            }
            throw new Error(`Failed to create article: ${response.status} - ${JSON.stringify(errorData)}`);
        }
        const createdArticle = await response.json();
        // If we have an image and the article was created successfully, try to update it with the image
        if (imageId && createdArticle.data) {
            console.log('Article created successfully, now attempting to add image...');
            const articleId = createdArticle.data.documentId || createdArticle.data.id;
            // Try different image relation formats
            const imageUpdateAttempts = [
                {
                    image: imageId
                },
                {
                    image: {
                        connect: [
                            imageId
                        ]
                    }
                },
                {
                    image: {
                        set: [
                            imageId
                        ]
                    }
                },
                {
                    image: [
                        imageId
                    ]
                }
            ];
            let imageUpdateSuccess = false;
            for(let i = 0; i < imageUpdateAttempts.length && !imageUpdateSuccess; i++){
                const updateData = {
                    data: imageUpdateAttempts[i]
                };
                console.log(`Trying image update approach ${i + 1}:`, updateData);
                try {
                    const updateResponse = await fetch(`${STRAPI_URL}/api/articles/${articleId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            ...STRAPI_API_TOKEN && {
                                Authorization: `Bearer ${STRAPI_API_TOKEN}`
                            }
                        },
                        body: JSON.stringify(updateData)
                    });
                    console.log(`Image update attempt ${i + 1} status:`, updateResponse.status);
                    if (updateResponse.ok) {
                        const updatedArticle = await updateResponse.json();
                        console.log('✅ Image successfully added to article!');
                        imageUpdateSuccess = true;
                        // Update the createdArticle with the image-updated version
                        Object.assign(createdArticle, updatedArticle);
                    } else {
                        const errorText = await updateResponse.text();
                        console.log(`❌ Image update attempt ${i + 1} failed:`, errorText);
                    }
                } catch (updateError) {
                    console.log(`❌ Image update attempt ${i + 1} error:`, updateError);
                }
            }
            if (!imageUpdateSuccess) {
                console.warn('⚠️ Article created but image could not be attached. You can add the image manually in Strapi admin panel.');
            }
        }
        console.log('Article created successfully:', {
            id: createdArticle.data?.id,
            documentId: createdArticle.data?.documentId,
            slug: createdArticle.data?.slug || createdArticle.data?.attributes?.slug,
            title: createdArticle.data?.title || createdArticle.data?.attributes?.title
        });
        // Verify the article can be retrieved by slug
        try {
            const verifyResponse = await fetch(`${STRAPI_URL}/api/articles?filters[slug][$eq]=${finalSlug}&populate=image`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...STRAPI_API_TOKEN && {
                        Authorization: `Bearer ${STRAPI_API_TOKEN}`
                    }
                }
            });
            if (verifyResponse.ok) {
                const verifyData = await verifyResponse.json();
                console.log('Article verification successful:', {
                    found: verifyData.data?.length > 0,
                    slug: finalSlug,
                    count: verifyData.data?.length
                });
            } else {
                console.warn('Article verification failed:', verifyResponse.status);
            }
        } catch (verifyError) {
            console.warn('Article verification error:', verifyError);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            article: createdArticle,
            message: 'Article created successfully',
            debug: {
                slug: finalSlug,
                imageUploaded: !!imageId,
                imageId: imageId
            }
        });
    } catch (error) {
        console.error('Error creating article:', error);
        // Check if it's a connection error
        if (error instanceof Error && error.message.includes('ECONNREFUSED')) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Cannot connect to Strapi server',
                details: 'Please ensure Strapi is running at ' + STRAPI_URL
            }, {
                status: 503
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Failed to create article',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__3d70b35f._.js.map