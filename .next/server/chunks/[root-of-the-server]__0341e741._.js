module.exports = [
"[project]/esports/.next-internal/server/app/api/strapi/upload-test/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
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
"[project]/esports/src/app/api/strapi/upload-test/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/server.js [app-route] (ecmascript)");
;
const STRAPI_URL = ("TURBOPACK compile-time value", "https://kuer-production.up.railway.app") || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;
async function POST(request) {
    try {
        const formData = await request.formData();
        const testFile = formData.get('file');
        if (!testFile) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'No file provided'
            }, {
                status: 400
            });
        }
        console.log('Testing upload with file:', {
            name: testFile.name,
            size: testFile.size,
            type: testFile.type
        });
        // Create FormData for Strapi
        const strapiFormData = new FormData();
        strapiFormData.append('files', testFile);
        // Test different upload endpoints
        const endpoints = [
            `${STRAPI_URL}/api/upload`,
            `${STRAPI_URL}/upload`,
            `${STRAPI_URL}/api/upload/files`
        ];
        const results = [];
        for (const endpoint of endpoints){
            try {
                console.log(`Testing endpoint: ${endpoint}`);
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        ...STRAPI_API_TOKEN && {
                            Authorization: `Bearer ${STRAPI_API_TOKEN}`
                        }
                    },
                    body: strapiFormData
                });
                const responseText = await response.text();
                let responseData;
                try {
                    responseData = JSON.parse(responseText);
                } catch  {
                    responseData = responseText;
                }
                results.push({
                    endpoint,
                    status: response.status,
                    statusText: response.statusText,
                    success: response.ok,
                    data: responseData,
                    headers: Object.fromEntries(response.headers.entries())
                });
                console.log(`Endpoint ${endpoint} result:`, {
                    status: response.status,
                    success: response.ok
                });
                // If successful, break
                if (response.ok) {
                    break;
                }
            } catch (error) {
                results.push({
                    endpoint,
                    status: 'ERROR',
                    error: error instanceof Error ? error.message : String(error)
                });
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: results.some((r)=>r.success),
            results,
            environment: {
                STRAPI_URL,
                hasApiToken: !!STRAPI_API_TOKEN,
                tokenPreview: STRAPI_API_TOKEN ? `${STRAPI_API_TOKEN.substring(0, 10)}...` : 'Not set'
            }
        });
    } catch (error) {
        console.error('Upload test error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, {
            status: 500
        });
    }
}
async function GET() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        message: 'Upload test endpoint. Use POST with a file to test upload functionality.',
        usage: 'POST with FormData containing a "file" field'
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0341e741._.js.map