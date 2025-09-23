module.exports = [
"[project]/esports/.next-internal/server/app/api/strapi/articles/[id]/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
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
"[project]/esports/src/app/api/strapi/articles/[id]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET,
    "PUT",
    ()=>PUT
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/server.js [app-route] (ecmascript)");
;
const STRAPI_URL = ("TURBOPACK compile-time value", "https://kuer-strapi-backend-production.up.railway.app") || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;
async function PUT(request, { params }) {
    try {
        // Check if Strapi URL is configured (allow localhost:1337 as it's the default)
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        const { id } = await params;
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
        let imageId = null;
        // Upload new image if provided
        if (image && image.size > 0) {
            try {
                const imageFormData = new FormData();
                imageFormData.append('files', image);
                const imageResponse = await fetch(`${STRAPI_URL}/api/upload`, {
                    method: 'POST',
                    headers: {
                        ...STRAPI_API_TOKEN && {
                            Authorization: `Bearer ${STRAPI_API_TOKEN}`
                        }
                    },
                    body: imageFormData
                });
                if (imageResponse.ok) {
                    const imageData = await imageResponse.json();
                    imageId = imageData[0]?.id;
                }
            } catch (error) {
                console.error('Error uploading image:', error);
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
        // Create update data
        const updateData = {
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
                ...imageId && {
                    image: imageId
                }
            }
        };
        // Try to update article by documentId first (Strapi v5), then by id
        let response = await fetch(`${STRAPI_URL}/api/articles/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...STRAPI_API_TOKEN && {
                    Authorization: `Bearer ${STRAPI_API_TOKEN}`
                }
            },
            body: JSON.stringify(updateData)
        });
        // If not found by documentId, try to find by id and get documentId
        if (!response.ok && response.status === 404) {
            const findResponse = await fetch(`${STRAPI_URL}/api/articles?filters[id][$eq]=${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...STRAPI_API_TOKEN && {
                        Authorization: `Bearer ${STRAPI_API_TOKEN}`
                    }
                }
            });
            if (findResponse.ok) {
                const findData = await findResponse.json();
                if (findData.data && findData.data.length > 0) {
                    const documentId = findData.data[0].documentId;
                    response = await fetch(`${STRAPI_URL}/api/articles/${documentId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            ...STRAPI_API_TOKEN && {
                                Authorization: `Bearer ${STRAPI_API_TOKEN}`
                            }
                        },
                        body: JSON.stringify(updateData)
                    });
                }
            }
        }
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Strapi API error:', errorData);
            throw new Error(`Failed to update article: ${response.status}`);
        }
        const updatedArticle = await response.json();
        return __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            article: updatedArticle,
            message: 'Article updated successfully'
        });
    } catch (error) {
        console.error('Error updating article:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Failed to update article',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, {
            status: 500
        });
    }
}
async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        // Try to delete article by documentId first (Strapi v5), then by id
        let response = await fetch(`${STRAPI_URL}/api/articles/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...STRAPI_API_TOKEN && {
                    Authorization: `Bearer ${STRAPI_API_TOKEN}`
                }
            }
        });
        // If not found by documentId, try to find by id and get documentId
        if (!response.ok && response.status === 404) {
            const findResponse = await fetch(`${STRAPI_URL}/api/articles?filters[id][$eq]=${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...STRAPI_API_TOKEN && {
                        Authorization: `Bearer ${STRAPI_API_TOKEN}`
                    }
                }
            });
            if (findResponse.ok) {
                const findData = await findResponse.json();
                if (findData.data && findData.data.length > 0) {
                    const documentId = findData.data[0].documentId;
                    response = await fetch(`${STRAPI_URL}/api/articles/${documentId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            ...STRAPI_API_TOKEN && {
                                Authorization: `Bearer ${STRAPI_API_TOKEN}`
                            }
                        }
                    });
                }
            }
        }
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Strapi API error:', errorData);
            throw new Error(`Failed to delete article: ${response.status}`);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: 'Article deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting article:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Failed to delete article',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, {
            status: 500
        });
    }
}
async function GET(request, { params }) {
    try {
        const { id } = await params;
        // Try to get article by documentId first (Strapi v5), then by id
        let response = await fetch(`${STRAPI_URL}/api/articles/${id}?populate=image`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...STRAPI_API_TOKEN && {
                    Authorization: `Bearer ${STRAPI_API_TOKEN}`
                }
            }
        });
        // If not found by documentId, try to find by id using filters
        if (!response.ok && response.status === 404) {
            response = await fetch(`${STRAPI_URL}/api/articles?filters[id][$eq]=${id}&populate=image`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...STRAPI_API_TOKEN && {
                        Authorization: `Bearer ${STRAPI_API_TOKEN}`
                    }
                }
            });
            if (response.ok) {
                const data = await response.json();
                if (data.data && data.data.length > 0) {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        success: true,
                        article: {
                            data: data.data[0],
                            meta: {}
                        }
                    });
                }
            }
        }
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Strapi API error:', errorData);
            throw new Error(`Failed to get article: ${response.status}`);
        }
        const article = await response.json();
        return __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            article
        });
    } catch (error) {
        console.error('Error getting article:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Failed to get article',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__be2bfba9._.js.map