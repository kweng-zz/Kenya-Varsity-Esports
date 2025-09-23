module.exports = [
"[project]/esports/.next-internal/server/app/games/[slug]/information/page/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
}),
"[project]/esports/src/app/favicon.ico.mjs { IMAGE => \"[project]/esports/src/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/esports/src/app/favicon.ico.mjs { IMAGE => \"[project]/esports/src/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript)"));
}),
"[project]/esports/src/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/esports/src/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/esports/src/lib/services/tournamentServiceSSR.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/lib/services/tournamentServiceSSR.ts
__turbopack_context__.s([
    "tournamentServiceSSR",
    ()=>tournamentServiceSSR
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/appwrite/dist/esm/sdk.js [app-rsc] (ecmascript)");
;
// Lazy initialization to avoid build-time issues
let client = null;
let databases = null;
const initializeAppwrite = ()=>{
    if (!client) {
        const endpoint = ("TURBOPACK compile-time value", "https://fra.cloud.appwrite.io/v1");
        const projectId = ("TURBOPACK compile-time value", "68c7e7bc0028f9acee36");
        // During build time, environment variables might not be available
        // Return null to gracefully handle this case
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        // Additional validation to ensure endpoint is a valid string
        if (typeof endpoint !== 'string' || endpoint.trim() === '') {
            console.warn('Appwrite endpoint is invalid for tournament service, using fallback data');
            return null;
        }
        try {
            client = new __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Client"]().setEndpoint(endpoint).setProject(projectId);
            databases = new __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Databases"](client);
        } catch (error) {
            console.error('Failed to initialize Appwrite client for tournament service:', error);
            return null;
        }
    }
    return databases;
};
class TournamentServiceSSR {
    databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || ("TURBOPACK compile-time value", "68c7f25e00083a6d2992") || '';
    tournamentsCollectionId = ("TURBOPACK compile-time value", "tournaments") || 'tournaments';
    awardsCollectionId = ("TURBOPACK compile-time value", "tournament_awards") || 'tournament_awards';
    async getTournamentBySlug(slug) {
        try {
            console.log(`🔍 Fetching tournament by slug: ${slug}`);
            const db = initializeAppwrite();
            if (!db) {
                console.warn('Appwrite not configured for tournament service, returning null tournament');
                return null;
            }
            const response = await db.listDocuments(this.databaseId, this.tournamentsCollectionId, [
                __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Query"].equal('slug', slug),
                __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Query"].equal('status', 'published'),
                __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Query"].limit(1)
            ]);
            if (response.documents.length === 0) {
                console.log(`❌ No tournament found for slug: ${slug}`);
                return null;
            }
            const doc = response.documents[0];
            console.log(`✅ Found tournament for slug ${slug}:`, doc);
            // Fetch awards only (simplified structure)
            const awards = await this.getTournamentAwards(doc.$id);
            return this.mapDocumentToTournament(doc, awards);
        } catch (error) {
            console.error(`❌ Error fetching tournament by slug ${slug}:`, error);
            return null;
        }
    }
    async getPublishedTournaments() {
        try {
            console.log('🔍 Fetching all published tournaments');
            const db = initializeAppwrite();
            if (!db) {
                console.warn('Appwrite not configured for tournament service, returning empty tournaments list');
                return [];
            }
            const response = await db.listDocuments(this.databaseId, this.tournamentsCollectionId, [
                __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Query"].equal('status', 'published'),
                __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Query"].orderDesc('$createdAt')
            ]);
            console.log(`✅ Found ${response.documents.length} published tournaments`);
            const tournaments = await Promise.all(response.documents.map(async (doc)=>{
                const awards = await this.getTournamentAwards(doc.$id);
                return this.mapDocumentToTournament(doc, awards);
            }));
            return tournaments;
        } catch (error) {
            console.error('❌ Error fetching published tournaments:', error);
            return [];
        }
    }
    async getTournamentAwards(tournamentId) {
        try {
            const db = initializeAppwrite();
            if (!db) {
                console.warn('Appwrite not configured for tournament service, returning empty awards list');
                return [];
            }
            const response = await db.listDocuments(this.databaseId, this.awardsCollectionId, [
                __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Query"].equal('tournamentId', tournamentId),
                __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Query"].orderAsc('position')
            ]);
            return response.documents.map((doc)=>({
                    id: doc.$id,
                    position: doc.position,
                    title: doc.title,
                    description: doc.description,
                    prize: doc.prize,
                    currency: doc.currency,
                    imageUrl: doc.imageUrl || null
                }));
        } catch (error) {
            console.error(`❌ Error fetching awards for tournament ${tournamentId}:`, error);
            return [];
        }
    }
    mapDocumentToTournament(doc, awards) {
        return {
            id: doc.$id,
            slug: doc.slug,
            gameName: doc.gameName,
            title: doc.title,
            description: doc.description,
            detailedDescription: doc.detailedDescription,
            category: doc.category,
            featuredImageUrl: doc.featuredImageUrl,
            bannerImageUrl: doc.bannerImageUrl || doc.featuredImageUrl,
            status: doc.status,
            tournamentStatus: doc.tournamentStatus,
            startDate: doc.startDate || null,
            endDate: doc.endDate || null,
            registrationStartDate: doc.registrationStartDate || null,
            registrationEndDate: doc.registrationEndDate || null,
            registrationDeadline: doc.registrationDeadline,
            format: doc.format || null,
            maxParticipants: doc.maxParticipants || null,
            currentParticipants: doc.currentParticipants || 0,
            prizePool: doc.prizePool,
            currency: doc.currency,
            rules: [],
            requirements: [],
            rulesTitle: doc.rulesTitle || null,
            pdfUrls: doc.pdfUrls ? doc.pdfUrls.map((pdfString)=>{
                try {
                    return JSON.parse(pdfString);
                } catch (error) {
                    console.error('Error parsing PDF URL:', error);
                    return {
                        title: '',
                        url: ''
                    };
                }
            }) : [],
            awards,
            schedule: [],
            sponsors: [],
            createdAt: doc.$createdAt,
            updatedAt: doc.$updatedAt
        };
    }
}
const tournamentServiceSSR = new TournamentServiceSSR();
}),
"[project]/esports/src/components/pages/tournaments/TournamentInformationContent.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "TournamentInformationContent",
    ()=>TournamentInformationContent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const TournamentInformationContent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call TournamentInformationContent() from the server but TournamentInformationContent is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/esports/src/components/pages/tournaments/TournamentInformationContent.tsx <module evaluation>", "TournamentInformationContent");
}),
"[project]/esports/src/components/pages/tournaments/TournamentInformationContent.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "TournamentInformationContent",
    ()=>TournamentInformationContent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const TournamentInformationContent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call TournamentInformationContent() from the server but TournamentInformationContent is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/esports/src/components/pages/tournaments/TournamentInformationContent.tsx", "TournamentInformationContent");
}),
"[project]/esports/src/components/pages/tournaments/TournamentInformationContent.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$components$2f$pages$2f$tournaments$2f$TournamentInformationContent$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/esports/src/components/pages/tournaments/TournamentInformationContent.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$components$2f$pages$2f$tournaments$2f$TournamentInformationContent$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/esports/src/components/pages/tournaments/TournamentInformationContent.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$components$2f$pages$2f$tournaments$2f$TournamentInformationContent$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/esports/src/lib/tournamentNavigation.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/lib/tournamentNavigation.ts
__turbopack_context__.s([
    "tournamentNavItems",
    ()=>tournamentNavItems
]);
const tournamentNavItems = [
    {
        name: 'Information',
        href: '/games/[slug]/information'
    },
    {
        name: 'Participants',
        href: '/games/[slug]/participants'
    },
    {
        name: 'Calendar',
        href: '/games/[slug]/calendar'
    },
    {
        name: 'Community',
        href: '/games/[slug]/community'
    }
];
}),
"[project]/esports/src/components/Navigation.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "Navigation",
    ()=>Navigation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const Navigation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call Navigation() from the server but Navigation is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/esports/src/components/Navigation.tsx <module evaluation>", "Navigation");
}),
"[project]/esports/src/components/Navigation.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "Navigation",
    ()=>Navigation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const Navigation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call Navigation() from the server but Navigation is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/esports/src/components/Navigation.tsx", "Navigation");
}),
"[project]/esports/src/components/Navigation.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$components$2f$Navigation$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/esports/src/components/Navigation.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$components$2f$Navigation$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/esports/src/components/Navigation.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$components$2f$Navigation$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/esports/src/components/Footer.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "FooterSection",
    ()=>FooterSection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const FooterSection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call FooterSection() from the server but FooterSection is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/esports/src/components/Footer.tsx <module evaluation>", "FooterSection");
}),
"[project]/esports/src/components/Footer.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "FooterSection",
    ()=>FooterSection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const FooterSection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call FooterSection() from the server but FooterSection is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/esports/src/components/Footer.tsx", "FooterSection");
}),
"[project]/esports/src/components/Footer.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$components$2f$Footer$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/esports/src/components/Footer.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$components$2f$Footer$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/esports/src/components/Footer.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$components$2f$Footer$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/esports/src/app/games/[slug]/information/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TournamentInformationPage,
    "dynamic",
    ()=>dynamic,
    "generateMetadata",
    ()=>generateMetadata,
    "revalidate",
    ()=>revalidate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$lib$2f$services$2f$tournamentServiceSSR$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/src/lib/services/tournamentServiceSSR.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$components$2f$pages$2f$tournaments$2f$TournamentInformationContent$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/src/components/pages/tournaments/TournamentInformationContent.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$lib$2f$tournamentNavigation$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/src/lib/tournamentNavigation.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/client/app-dir/link.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$components$2f$Navigation$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/src/components/Navigation.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$components$2f$Footer$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/src/components/Footer.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
const dynamic = 'force-dynamic';
const revalidate = 0;
async function generateMetadata({ params }) {
    const { slug } = await params;
    // Only fetch tournament data from CMS
    const tournamentData = await __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$lib$2f$services$2f$tournamentServiceSSR$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["tournamentServiceSSR"].getTournamentBySlug(slug);
    if (!tournamentData) {
        return {
            title: 'Tournament Not Configured | Kuer',
            description: 'This tournament has not been configured in the CMS yet.'
        };
    }
    // Use only tournament data for metadata
    const title = tournamentData.gameName || 'Tournament';
    const description = tournamentData.description || tournamentData.detailedDescription || 'Tournament information and details';
    const category = tournamentData.category || '';
    const ogImageUrl = tournamentData.featuredImageUrl;
    return {
        title: `${title} Tournament Information | Kuer`,
        description: description,
        keywords: `${title}, tournament, esports, gaming, Kenya, university, competition, ${category}`,
        openGraph: {
            title: `${title} Tournament Information`,
            description: description,
            type: 'website',
            url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://kuer.com'}/games/${slug}/information`,
            images: ogImageUrl ? [
                {
                    url: ogImageUrl,
                    width: 1200,
                    height: 630,
                    alt: title
                }
            ] : undefined
        },
        twitter: {
            card: 'summary_large_image',
            title: `${title} Tournament Information`,
            description: description,
            images: ogImageUrl ? [
                ogImageUrl
            ] : undefined
        }
    };
}
async function TournamentInformationPage({ params }) {
    const { slug } = await params;
    // Add debug logging
    console.log(`🔍 Loading tournament page for slug: ${slug}`);
    // Only fetch tournament data from CMS - no static data fallbacks
    let tournamentData = null;
    try {
        console.log(`🔄 Attempting to fetch tournament by slug: ${slug}`);
        tournamentData = await __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$lib$2f$services$2f$tournamentServiceSSR$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["tournamentServiceSSR"].getTournamentBySlug(slug);
        console.log(`📊 Tournament data for ${slug}:`, {
            found: !!tournamentData,
            data: tournamentData,
            awards: tournamentData?.awards,
            slug: tournamentData?.slug,
            gameName: tournamentData?.gameName
        });
    } catch (error) {
        console.error(`❌ Error fetching tournament data for ${slug}:`, error);
    }
    // If no tournament found, try to get all tournaments and find by slug
    if (!tournamentData) {
        try {
            console.log(`🔄 No direct match, searching all tournaments for slug: ${slug}`);
            const allTournaments = await __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$lib$2f$services$2f$tournamentServiceSSR$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["tournamentServiceSSR"].getPublishedTournaments();
            console.log(`📋 All tournaments:`, allTournaments.map((t)=>({
                    slug: t.slug,
                    gameName: t.gameName,
                    id: t.id
                })));
            tournamentData = allTournaments.find((t)=>t.slug === slug) || null;
            console.log(`📊 Found tournament in all tournaments for ${slug}:`, {
                found: !!tournamentData,
                matchingTournament: tournamentData ? {
                    slug: tournamentData.slug,
                    gameName: tournamentData.gameName
                } : null
            });
        } catch (error) {
            console.error(`❌ Error fetching all tournaments for ${slug}:`, error);
        }
    }
    console.log(`🎮 Using ${tournamentData ? 'CMS tournament data' : 'no data - will show not configured message'} for ${slug}`);
    const currentPath = `/games/${slug}/information`;
    // Determine hero background image - only use tournament image or default
    const getHeroImage = ()=>{
        // Use tournament featured image if available
        if (tournamentData?.featuredImageUrl) {
            return tournamentData.featuredImageUrl;
        }
        // Fallback to default image
        return '/images/Mask Group.png';
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative w-full min-h-screen bg-black overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$components$2f$Navigation$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Navigation"], {}, void 0, false, {
                fileName: "[project]/esports/src/app/games/[slug]/information/page.tsx",
                lineNumber: 117,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "relative w-full h-[560px] bg-black mt-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 bg-cover bg-center",
                        style: {
                            backgroundImage: `url(${getHeroImage()})`
                        }
                    }, void 0, false, {
                        fileName: "[project]/esports/src/app/games/[slug]/information/page.tsx",
                        lineNumber: 121,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 bg-[#0F0F13] opacity-0"
                    }, void 0, false, {
                        fileName: "[project]/esports/src/app/games/[slug]/information/page.tsx",
                        lineNumber: 126,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0",
                        style: {
                            background: 'linear-gradient(182.1deg, #0F0F13 22.17%, rgba(12, 14, 17, 0) 74.51%)'
                        }
                    }, void 0, false, {
                        fileName: "[project]/esports/src/app/games/[slug]/information/page.tsx",
                        lineNumber: 128,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0",
                        style: {
                            background: 'linear-gradient(0deg, rgba(15, 15, 19, 0.9) 22.17%, rgba(12, 14, 17, 0) 74.51%)'
                        }
                    }, void 0, false, {
                        fileName: "[project]/esports/src/app/games/[slug]/information/page.tsx",
                        lineNumber: 135,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 overflow-hidden",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                className: "absolute top-105 left-19 w-2/4 h-2/4 object-contain -translate-x-1/2 -translate-y-1/2",
                                alt: "Background Left",
                                src: "/images/Mask Group.png"
                            }, void 0, false, {
                                fileName: "[project]/esports/src/app/games/[slug]/information/page.tsx",
                                lineNumber: 143,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                className: "absolute top-105 right-19 w-2/4 h-2/4 object-contain translate-x-1/2 -translate-y-1/2 scale-x-[-1]",
                                alt: "Background Right",
                                src: "/images/Mask Group.png"
                            }, void 0, false, {
                                fileName: "[project]/esports/src/app/games/[slug]/information/page.tsx",
                                lineNumber: 149,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/esports/src/app/games/[slug]/information/page.tsx",
                        lineNumber: 142,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/esports/src/app/games/[slug]/information/page.tsx",
                lineNumber: 120,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "relative bg-black h-[100px]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        className: "absolute w-full h-full object-cover opacity-20",
                        alt: "Background",
                        src: "https://c.animaapp.com/md6ebassseX7AK/img/group-44.png"
                    }, void 0, false, {
                        fileName: "[project]/esports/src/app/games/[slug]/information/page.tsx",
                        lineNumber: 159,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute bottom-1 left-0 w-full h-[0.5px] bg-white/50 z-5"
                    }, void 0, false, {
                        fileName: "[project]/esports/src/app/games/[slug]/information/page.tsx",
                        lineNumber: 165,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative z-10 h-full",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex space-x-12",
                            children: __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$lib$2f$tournamentNavigation$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["tournamentNavItems"].map((item, index)=>{
                                const itemHref = item.href.replace('[slug]', slug);
                                const isActive = currentPath === itemHref;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                            href: itemHref,
                                            className: `text-xl font-bold font-hind tracking-wide transition-colors ${isActive ? 'text-[#8c110d]' : 'text-[#8c110d] hover:text-[#b91c17]'}`,
                                            children: item.name
                                        }, void 0, false, {
                                            fileName: "[project]/esports/src/app/games/[slug]/information/page.tsx",
                                            lineNumber: 175,
                                            columnNumber: 19
                                        }, this),
                                        isActive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute -bottom-2 left-0 w-full h-[3px] bg-[#8e130e]"
                                        }, void 0, false, {
                                            fileName: "[project]/esports/src/app/games/[slug]/information/page.tsx",
                                            lineNumber: 186,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, `tournament-nav-${index}`, true, {
                                    fileName: "[project]/esports/src/app/games/[slug]/information/page.tsx",
                                    lineNumber: 174,
                                    columnNumber: 17
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/esports/src/app/games/[slug]/information/page.tsx",
                            lineNumber: 168,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/esports/src/app/games/[slug]/information/page.tsx",
                        lineNumber: 167,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/esports/src/app/games/[slug]/information/page.tsx",
                lineNumber: 158,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$components$2f$pages$2f$tournaments$2f$TournamentInformationContent$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TournamentInformationContent"], {
                tournamentData: tournamentData,
                slug: slug
            }, void 0, false, {
                fileName: "[project]/esports/src/app/games/[slug]/information/page.tsx",
                lineNumber: 196,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$components$2f$Footer$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FooterSection"], {}, void 0, false, {
                fileName: "[project]/esports/src/app/games/[slug]/information/page.tsx",
                lineNumber: 201,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/esports/src/app/games/[slug]/information/page.tsx",
        lineNumber: 116,
        columnNumber: 5
    }, this);
}
}),
"[project]/esports/src/app/games/[slug]/information/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/esports/src/app/games/[slug]/information/page.tsx [app-rsc] (ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__e0c2e6a0._.js.map