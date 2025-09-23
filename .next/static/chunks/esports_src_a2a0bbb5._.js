(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/esports/src/types/ticket.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Ticket Management System Types
 */ __turbopack_context__.s([
    "TICKET_PRIORITY_COLORS",
    ()=>TICKET_PRIORITY_COLORS,
    "TICKET_PRIORITY_LABELS",
    ()=>TICKET_PRIORITY_LABELS,
    "TICKET_STATUS_COLORS",
    ()=>TICKET_STATUS_COLORS,
    "TICKET_STATUS_LABELS",
    ()=>TICKET_STATUS_LABELS,
    "TICKET_SUBJECTS",
    ()=>TICKET_SUBJECTS
]);
const TICKET_SUBJECTS = {
    'General Support': 'medium',
    'Tournament Registration': 'high',
    'Account Issues': 'high',
    'Technical Problems': 'medium',
    'Payment & Billing': 'high',
    'Student Verification': 'medium',
    'Rankings & Leaderboards': 'low',
    'Bug Report': 'medium',
    'Feature Request': 'low'
};
const TICKET_STATUS_LABELS = {
    'open': 'Open',
    'in-progress': 'In Progress',
    'waiting-for-user': 'Waiting for User',
    'waiting-for-admin': 'Waiting for Admin',
    'resolved': 'Resolved',
    'closed': 'Closed'
};
const TICKET_PRIORITY_LABELS = {
    'low': 'Low',
    'medium': 'Medium',
    'high': 'High',
    'urgent': 'Urgent'
};
const TICKET_STATUS_COLORS = {
    'open': 'bg-blue-500',
    'in-progress': 'bg-yellow-500',
    'waiting-for-user': 'bg-orange-500',
    'waiting-for-admin': 'bg-purple-500',
    'resolved': 'bg-green-500',
    'closed': 'bg-gray-500'
};
const TICKET_PRIORITY_COLORS = {
    'low': 'bg-gray-500',
    'medium': 'bg-blue-500',
    'high': 'bg-orange-500',
    'urgent': 'bg-red-500'
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/esports/src/lib/services/ticketService.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Ticket Management Service
 * Handles all ticket-related database operations
 */ __turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "ticketService",
    ()=>ticketService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/esports/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/appwrite/dist/esm/sdk.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$types$2f$ticket$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/src/types/ticket.ts [app-client] (ecmascript)");
;
;
// Lazy initialization to avoid build-time issues
let client = null;
let databases = null;
let storage = null;
const initializeAppwrite = ()=>{
    if (!client) {
        const endpoint = ("TURBOPACK compile-time value", "https://fra.cloud.appwrite.io/v1");
        const projectId = ("TURBOPACK compile-time value", "68c7e7bc0028f9acee36");
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        if (typeof endpoint !== 'string' || endpoint.trim() === '') {
            console.warn('Appwrite endpoint is invalid for ticket service');
            return null;
        }
        try {
            client = new __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Client"]().setEndpoint(endpoint).setProject(projectId);
            databases = new __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Databases"](client);
            storage = new __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Storage"](client);
        } catch (error) {
            console.error('Failed to initialize Appwrite client for ticket service:', error);
            return null;
        }
    }
    // Ensure both databases and storage are initialized
    if (!databases || !storage) {
        return null;
    }
    return {
        databases,
        storage
    };
};
const DB_ID = ("TURBOPACK compile-time value", "68c7f25e00083a6d2992") || '';
const TICKETS_COLLECTION_ID = 'tickets';
const TICKET_RESPONSES_COLLECTION_ID = 'ticket_responses';
const TICKET_ATTACHMENTS_BUCKET_ID = 'ticket_attachments';
// Fallback to an existing bucket if ticket_attachments doesn't exist
const FALLBACK_BUCKET_ID = 'default'; // You can change this to any existing bucket ID
class TicketService {
    /**
   * Create a new support ticket
   */ async createTicket(userId, userName, data) {
        try {
            const appwrite = initializeAppwrite();
            if (!appwrite) {
                throw new Error('Appwrite not configured');
            }
            // Generate human-readable ticket ID
            const ticketId = "TKT-".concat(Date.now().toString().slice(-6));
            // Determine priority based on subject if not provided
            const priority = data.priority || __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$types$2f$ticket$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TICKET_SUBJECTS"][data.subject] || 'medium';
            let attachmentUrl = '';
            let attachmentName = '';
            // Handle file upload if attachment exists
            if (data.attachment) {
                const fileId = __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ID"].unique();
                const uploadedFile = await appwrite.storage.createFile(TICKET_ATTACHMENTS_BUCKET_ID, fileId, data.attachment, [
                    __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Permission"].read(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Role"].user(userId)),
                    __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Permission"].read(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Role"].team('admins')),
                    __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Permission"].delete(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Role"].user(userId))
                ]);
                attachmentUrl = appwrite.storage.getFileView(TICKET_ATTACHMENTS_BUCKET_ID, uploadedFile.$id).toString();
                attachmentName = data.attachment.name;
            }
            // Create ticket document
            const ticket = await appwrite.databases.createDocument(DB_ID, TICKETS_COLLECTION_ID, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ID"].unique(), {
                ticketId,
                title: data.title,
                subject: data.subject,
                message: data.message,
                status: 'open',
                priority,
                userId,
                userName,
                attachmentUrl,
                attachmentName,
                responseCount: 0,
                isUnreadByUser: false,
                isUnreadByAdmin: true,
                tags: [],
                lastResponseAt: new Date().toISOString()
            }, [
                __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Permission"].read(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Role"].user(userId)),
                __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Permission"].read(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Role"].team('admins')),
                __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Permission"].update(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Role"].user(userId)),
                __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Permission"].update(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Role"].team('admins')),
                __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Permission"].delete(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Role"].team('admins'))
            ]);
            return ticket;
        } catch (error) {
            console.error('Error creating ticket:', error);
            throw new Error('Failed to create ticket');
        }
    }
    /**
   * Get tickets with filters and pagination
   */ async getTickets() {
        let filters = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, limit = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 25, offset = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0;
        try {
            const appwrite = initializeAppwrite();
            if (!appwrite) {
                throw new Error('Appwrite not configured');
            }
            const queries = [
                __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Query"].limit(limit),
                __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Query"].offset(offset),
                __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Query"].orderDesc('$createdAt')
            ];
            // Apply filters
            if (filters.status && filters.status.length > 0) {
                queries.push(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Query"].equal('status', filters.status));
            }
            if (filters.priority && filters.priority.length > 0) {
                queries.push(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Query"].equal('priority', filters.priority));
            }
            if (filters.subject && filters.subject.length > 0) {
                queries.push(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Query"].equal('subject', filters.subject));
            }
            if (filters.assignedTo) {
                queries.push(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Query"].equal('assignedTo', filters.assignedTo));
            }
            if (filters.userId) {
                queries.push(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Query"].equal('userId', filters.userId));
            }
            if (filters.unreadOnly) {
                queries.push(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Query"].equal('isUnreadByAdmin', true));
            }
            if (filters.search) {
                queries.push(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Query"].search('title', filters.search));
            }
            if (filters.dateFrom) {
                queries.push(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Query"].greaterThanEqual('$createdAt', filters.dateFrom));
            }
            if (filters.dateTo) {
                queries.push(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Query"].lessThanEqual('$createdAt', filters.dateTo));
            }
            const response = await appwrite.databases.listDocuments(DB_ID, TICKETS_COLLECTION_ID, queries);
            return {
                tickets: response.documents,
                total: response.total
            };
        } catch (error) {
            console.error('Error fetching tickets:', error);
            throw new Error('Failed to fetch tickets');
        }
    }
    /**
   * Get a single ticket by ID
   */ async getTicket(ticketId) {
        try {
            const appwrite = initializeAppwrite();
            if (!appwrite) {
                return null;
            }
            const response = await appwrite.databases.listDocuments(DB_ID, TICKETS_COLLECTION_ID, [
                __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Query"].equal('ticketId', ticketId)
            ]);
            return response.documents.length > 0 ? response.documents[0] : null;
        } catch (error) {
            console.error('Error fetching ticket:', error);
            return null;
        }
    }
    /**
   * Update ticket
   */ async updateTicket(ticketId, updates) {
        try {
            const appwrite = initializeAppwrite();
            if (!appwrite) {
                throw new Error('Appwrite not configured');
            }
            const ticket = await this.getTicket(ticketId);
            if (!ticket) {
                throw new Error('Ticket not found');
            }
            const updatedTicket = await appwrite.databases.updateDocument(DB_ID, TICKETS_COLLECTION_ID, ticket.$id, {
                ...updates,
                $updatedAt: new Date().toISOString()
            });
            return updatedTicket;
        } catch (error) {
            console.error('Error updating ticket:', error);
            throw new Error('Failed to update ticket');
        }
    }
    /**
   * Add response to ticket
   */ async addResponse(userId, userName, data) {
        try {
            const appwrite = initializeAppwrite();
            if (!appwrite) {
                throw new Error('Appwrite not configured');
            }
            const ticket = await this.getTicket(data.ticketId);
            if (!ticket) {
                throw new Error('Ticket not found');
            }
            let attachmentUrl = '';
            let attachmentName = '';
            // Handle file upload if attachment exists
            if (data.attachment) {
                const fileId = __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ID"].unique();
                const uploadedFile = await appwrite.storage.createFile(TICKET_ATTACHMENTS_BUCKET_ID, fileId, data.attachment, [
                    __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Permission"].read(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Role"].user(ticket.userId)),
                    __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Permission"].read(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Role"].team('admins')),
                    __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Permission"].delete(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Role"].user(userId))
                ]);
                attachmentUrl = appwrite.storage.getFileView(TICKET_ATTACHMENTS_BUCKET_ID, uploadedFile.$id).toString();
                attachmentName = data.attachment.name;
            }
            // Determine if this is an admin response
            const isAdminResponse = userName.includes('@') || userId === 'admin'; // You might want to check against admin role
            // Create response document
            const response = await appwrite.databases.createDocument(DB_ID, TICKET_RESPONSES_COLLECTION_ID, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ID"].unique(), {
                ticketId: data.ticketId,
                message: data.message,
                isAdminResponse,
                userId,
                userName,
                attachmentUrl,
                attachmentName,
                isInternal: data.isInternal || false
            }, [
                __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Permission"].read(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Role"].user(ticket.userId)),
                __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Permission"].read(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Role"].team('admins')),
                __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Permission"].update(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Role"].user(userId)),
                __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Permission"].delete(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Role"].team('admins'))
            ]);
            // Update ticket with response info
            const newStatus = isAdminResponse ? 'waiting-for-user' : 'waiting-for-admin';
            await appwrite.databases.updateDocument(DB_ID, TICKETS_COLLECTION_ID, ticket.$id, {
                responseCount: ticket.responseCount + 1,
                lastResponseAt: new Date().toISOString(),
                status: ticket.status === 'closed' ? ticket.status : newStatus,
                isUnreadByUser: isAdminResponse,
                isUnreadByAdmin: !isAdminResponse
            });
            return response;
        } catch (error) {
            console.error('Error adding response:', error);
            throw new Error('Failed to add response');
        }
    }
    /**
   * Get responses for a ticket
   */ async getTicketResponses(ticketId) {
        try {
            const appwrite = initializeAppwrite();
            if (!appwrite) {
                throw new Error('Appwrite not configured');
            }
            const response = await appwrite.databases.listDocuments(DB_ID, TICKET_RESPONSES_COLLECTION_ID, [
                __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Query"].equal('ticketId', ticketId),
                __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Query"].orderAsc('$createdAt')
            ]);
            return response.documents;
        } catch (error) {
            console.error('Error fetching ticket responses:', error);
            throw new Error('Failed to fetch ticket responses');
        }
    }
    /**
   * Mark ticket as read
   */ async markAsRead(ticketId, isAdmin) {
        try {
            const appwrite = initializeAppwrite();
            if (!appwrite) {
                throw new Error('Appwrite not configured');
            }
            const ticket = await this.getTicket(ticketId);
            if (!ticket) {
                throw new Error('Ticket not found');
            }
            const updateData = isAdmin ? {
                isUnreadByAdmin: false
            } : {
                isUnreadByUser: false
            };
            await appwrite.databases.updateDocument(DB_ID, TICKETS_COLLECTION_ID, ticket.$id, updateData);
        } catch (error) {
            console.error('Error marking ticket as read:', error);
            throw new Error('Failed to mark ticket as read');
        }
    }
    /**
   * Get ticket statistics for admin dashboard
   */ async getTicketStats() {
        try {
            const appwrite = initializeAppwrite();
            if (!appwrite) {
                throw new Error('Appwrite not configured');
            }
            const [totalResponse, openResponse, inProgressResponse, waitingUserResponse, waitingAdminResponse, resolvedResponse, closedResponse, unreadResponse] = await Promise.all([
                appwrite.databases.listDocuments(DB_ID, TICKETS_COLLECTION_ID, [
                    __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Query"].limit(1)
                ]),
                appwrite.databases.listDocuments(DB_ID, TICKETS_COLLECTION_ID, [
                    __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Query"].equal('status', 'open'),
                    __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Query"].limit(1)
                ]),
                appwrite.databases.listDocuments(DB_ID, TICKETS_COLLECTION_ID, [
                    __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Query"].equal('status', 'in-progress'),
                    __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Query"].limit(1)
                ]),
                appwrite.databases.listDocuments(DB_ID, TICKETS_COLLECTION_ID, [
                    __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Query"].equal('status', 'waiting-for-user'),
                    __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Query"].limit(1)
                ]),
                appwrite.databases.listDocuments(DB_ID, TICKETS_COLLECTION_ID, [
                    __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Query"].equal('status', 'waiting-for-admin'),
                    __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Query"].limit(1)
                ]),
                appwrite.databases.listDocuments(DB_ID, TICKETS_COLLECTION_ID, [
                    __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Query"].equal('status', 'resolved'),
                    __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Query"].limit(1)
                ]),
                appwrite.databases.listDocuments(DB_ID, TICKETS_COLLECTION_ID, [
                    __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Query"].equal('status', 'closed'),
                    __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Query"].limit(1)
                ]),
                appwrite.databases.listDocuments(DB_ID, TICKETS_COLLECTION_ID, [
                    __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Query"].equal('isUnreadByAdmin', true),
                    __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Query"].limit(1)
                ])
            ]);
            return {
                total: totalResponse.total,
                open: openResponse.total,
                inProgress: inProgressResponse.total,
                waitingForUser: waitingUserResponse.total,
                waitingForAdmin: waitingAdminResponse.total,
                resolved: resolvedResponse.total,
                closed: closedResponse.total,
                unreadByAdmin: unreadResponse.total,
                averageResponseTime: 0,
                totalResponseTime: 0
            };
        } catch (error) {
            console.error('Error fetching ticket stats:', error);
            throw new Error('Failed to fetch ticket statistics');
        }
    }
    /**
   * Close ticket
   */ async closeTicket(ticketId) {
        try {
            await this.updateTicket(ticketId, {
                status: 'closed'
            });
        } catch (error) {
            console.error('Error closing ticket:', error);
            throw new Error('Failed to close ticket');
        }
    }
    /**
   * Reopen ticket
   */ async reopenTicket(ticketId) {
        try {
            await this.updateTicket(ticketId, {
                status: 'open'
            });
        } catch (error) {
            console.error('Error reopening ticket:', error);
            throw new Error('Failed to reopen ticket');
        }
    }
}
const ticketService = new TicketService();
const __TURBOPACK__default__export__ = ticketService;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/esports/src/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn() {
    for(var _len = arguments.length, inputs = new Array(_len), _key = 0; _key < _len; _key++){
        inputs[_key] = arguments[_key];
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/esports/src/components/ui/button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
            destructive: "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
            outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
            secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
            link: "text-primary underline-offset-4 hover:underline"
        },
        size: {
            default: "h-9 px-4 py-2 has-[>svg]:px-3",
            sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
            lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
            icon: "size-9"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }
});
function Button(param) {
    let { className, variant, size, asChild = false, ...props } = param;
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : "button";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        "data-slot": "button",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ...props
    }, void 0, false, {
        fileName: "[project]/esports/src/components/ui/button.tsx",
        lineNumber: 51,
        columnNumber: 5
    }, this);
}
_c = Button;
;
var _c;
__turbopack_context__.k.register(_c, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/esports/src/components/TicketNotifications.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TicketNotifications",
    ()=>TicketNotifications,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/src/contexts/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$lib$2f$services$2f$ticketService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/src/lib/services/ticketService.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/src/components/ui/button.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
const TicketNotifications = ()=>{
    var _user_labels;
    _s();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [notifications, setNotifications] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [unreadCount, setUnreadCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Check if user is admin
    const isAdmin = (user === null || user === void 0 ? void 0 : (_user_labels = user.labels) === null || _user_labels === void 0 ? void 0 : _user_labels.includes('admin')) || false;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TicketNotifications.useEffect": ()=>{
            if (!isAdmin) return;
            // Load initial notifications
            loadNotifications();
            // Set up polling for new notifications every 30 seconds
            const interval = setInterval(loadNotifications, 30000);
            return ({
                "TicketNotifications.useEffect": ()=>clearInterval(interval)
            })["TicketNotifications.useEffect"];
        }
    }["TicketNotifications.useEffect"], [
        isAdmin
    ]);
    const loadNotifications = async ()=>{
        if (!isAdmin) return;
        try {
            setLoading(true);
            // Get unread tickets and recent activity
            const { tickets } = await __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$lib$2f$services$2f$ticketService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ticketService"].getTickets({
                unreadOnly: true
            }, 10, 0);
            const newNotifications = tickets.map((ticket)=>({
                    id: ticket.$id,
                    ticketId: ticket.ticketId,
                    title: ticket.title,
                    type: ticket.priority === 'urgent' ? 'urgent' : 'new_ticket',
                    timestamp: ticket.$createdAt,
                    isRead: false
                }));
            setNotifications(newNotifications);
            setUnreadCount(newNotifications.length);
        } catch (error) {
            console.error('Error loading notifications:', error);
        } finally{
            setLoading(false);
        }
    };
    const markAsRead = (notificationId)=>{
        setNotifications((prev)=>prev.map((notif)=>notif.id === notificationId ? {
                    ...notif,
                    isRead: true
                } : notif));
        setUnreadCount((prev)=>Math.max(0, prev - 1));
    };
    const handleNotificationClick = (notification)=>{
        markAsRead(notification.id);
        setIsOpen(false);
        router.push("/help/tickets/".concat(notification.ticketId));
    };
    const clearAllNotifications = ()=>{
        setNotifications([]);
        setUnreadCount(0);
        setIsOpen(false);
    };
    if (!isAdmin) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>setIsOpen(!isOpen),
                className: "relative p-2 text-gray-400 hover:text-white transition-colors",
                title: "Support Tickets",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        className: "w-6 h-6",
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: 2,
                            d: "M15 17h5l-5 5v-5zM11 19H6.5A2.5 2.5 0 014 16.5v-9A2.5 2.5 0 016.5 5h11A2.5 2.5 0 0120 7.5v4"
                        }, void 0, false, {
                            fileName: "[project]/esports/src/components/TicketNotifications.tsx",
                            lineNumber: 106,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/esports/src/components/TicketNotifications.tsx",
                        lineNumber: 105,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    unreadCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center",
                        children: unreadCount > 9 ? '9+' : unreadCount
                    }, void 0, false, {
                        fileName: "[project]/esports/src/components/TicketNotifications.tsx",
                        lineNumber: 111,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/esports/src/components/TicketNotifications.tsx",
                lineNumber: 100,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute right-0 top-full mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-4 border-b border-gray-700",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-white font-medium",
                                    children: "Support Tickets"
                                }, void 0, false, {
                                    fileName: "[project]/esports/src/components/TicketNotifications.tsx",
                                    lineNumber: 122,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            onClick: ()=>router.push('/admin/tickets'),
                                            className: "bg-[#961c18] hover:bg-[#D13431] text-xs py-1 px-2",
                                            children: "View All"
                                        }, void 0, false, {
                                            fileName: "[project]/esports/src/components/TicketNotifications.tsx",
                                            lineNumber: 124,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        notifications.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            onClick: clearAllNotifications,
                                            className: "bg-gray-600 hover:bg-gray-700 text-xs py-1 px-2",
                                            children: "Clear"
                                        }, void 0, false, {
                                            fileName: "[project]/esports/src/components/TicketNotifications.tsx",
                                            lineNumber: 131,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/esports/src/components/TicketNotifications.tsx",
                                    lineNumber: 123,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/esports/src/components/TicketNotifications.tsx",
                            lineNumber: 121,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/esports/src/components/TicketNotifications.tsx",
                        lineNumber: 120,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "max-h-96 overflow-y-auto",
                        children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-4 text-center text-gray-400",
                            children: "Loading notifications..."
                        }, void 0, false, {
                            fileName: "[project]/esports/src/components/TicketNotifications.tsx",
                            lineNumber: 144,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0)) : notifications.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-4 text-center text-gray-400",
                            children: "No new tickets"
                        }, void 0, false, {
                            fileName: "[project]/esports/src/components/TicketNotifications.tsx",
                            lineNumber: 148,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0)) : notifications.map((notification)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                onClick: ()=>handleNotificationClick(notification),
                                className: "p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-700/50 transition-colors ".concat(!notification.isRead ? 'bg-gray-700/30' : ''),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-start gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-2 h-2 rounded-full mt-2 flex-shrink-0 ".concat(notification.type === 'urgent' ? 'bg-red-500' : 'bg-blue-500')
                                        }, void 0, false, {
                                            fileName: "[project]/esports/src/components/TicketNotifications.tsx",
                                            lineNumber: 161,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex-1 min-w-0",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2 mb-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-white font-medium text-sm",
                                                            children: notification.ticketId
                                                        }, void 0, false, {
                                                            fileName: "[project]/esports/src/components/TicketNotifications.tsx",
                                                            lineNumber: 167,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        notification.type === 'urgent' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "bg-red-500 text-white text-xs px-2 py-1 rounded",
                                                            children: "URGENT"
                                                        }, void 0, false, {
                                                            fileName: "[project]/esports/src/components/TicketNotifications.tsx",
                                                            lineNumber: 171,
                                                            columnNumber: 27
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/esports/src/components/TicketNotifications.tsx",
                                                    lineNumber: 166,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-gray-300 text-sm truncate",
                                                    children: notification.title
                                                }, void 0, false, {
                                                    fileName: "[project]/esports/src/components/TicketNotifications.tsx",
                                                    lineNumber: 177,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-gray-500 text-xs mt-1",
                                                    children: new Date(notification.timestamp).toLocaleString()
                                                }, void 0, false, {
                                                    fileName: "[project]/esports/src/components/TicketNotifications.tsx",
                                                    lineNumber: 181,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/esports/src/components/TicketNotifications.tsx",
                                            lineNumber: 165,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/esports/src/components/TicketNotifications.tsx",
                                    lineNumber: 160,
                                    columnNumber: 19
                                }, ("TURBOPACK compile-time value", void 0))
                            }, notification.id, false, {
                                fileName: "[project]/esports/src/components/TicketNotifications.tsx",
                                lineNumber: 153,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)))
                    }, void 0, false, {
                        fileName: "[project]/esports/src/components/TicketNotifications.tsx",
                        lineNumber: 142,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    notifications.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-3 border-t border-gray-700 text-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            onClick: ()=>{
                                setIsOpen(false);
                                router.push('/admin/tickets');
                            },
                            className: "w-full bg-gray-700 hover:bg-gray-600 text-white text-sm",
                            children: [
                                "View All Tickets (",
                                unreadCount,
                                " unread)"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/esports/src/components/TicketNotifications.tsx",
                            lineNumber: 193,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/esports/src/components/TicketNotifications.tsx",
                        lineNumber: 192,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/esports/src/components/TicketNotifications.tsx",
                lineNumber: 119,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-40",
                onClick: ()=>setIsOpen(false)
            }, void 0, false, {
                fileName: "[project]/esports/src/components/TicketNotifications.tsx",
                lineNumber: 209,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/esports/src/components/TicketNotifications.tsx",
        lineNumber: 98,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(TicketNotifications, "zZpQ7KKbqn7UNABidLuWp0Ujm0A=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = TicketNotifications;
const __TURBOPACK__default__export__ = TicketNotifications;
var _c;
__turbopack_context__.k.register(_c, "TicketNotifications");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/esports/src/components/Navigation.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Navigation",
    ()=>Navigation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$react$2d$social$2d$icons$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/react-social-icons.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/src/contexts/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$components$2f$TicketNotifications$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/src/components/TicketNotifications.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
function Navigation() {
    _s();
    const [isSearchOpen, setIsSearchOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const { user, profile, loading, signOut } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const isAdmin = profile === null || profile === void 0 ? void 0 : profile.isAdmin;
    // Close dropdown when clicking outside
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Navigation.useEffect": ()=>{
            const handleClickOutside = {
                "Navigation.useEffect.handleClickOutside": (event)=>{
                    const target = event.target;
                    if (isProfileDropdownOpen && !target.closest('.profile-dropdown')) {
                        setIsProfileDropdownOpen(false);
                    }
                    if (isSearchOpen && !target.closest('.search-dropdown')) {
                        setIsSearchOpen(false);
                    }
                }
            }["Navigation.useEffect.handleClickOutside"];
            document.addEventListener('mousedown', handleClickOutside);
            return ({
                "Navigation.useEffect": ()=>document.removeEventListener('mousedown', handleClickOutside)
            })["Navigation.useEffect"];
        }
    }["Navigation.useEffect"], [
        isProfileDropdownOpen,
        isSearchOpen
    ]);
    const navItems = [
        {
            name: "HOME",
            href: "/"
        },
        {
            name: "ABOUT US",
            href: "/about"
        },
        {
            name: "BLOGS",
            href: "/blogs"
        },
        {
            name: "TOURNAMENTS",
            href: "/tournaments",
            protected: true
        },
        {
            name: "RANKINGS",
            href: "/rankings"
        },
        {
            name: "SHOP",
            href: "/shop"
        }
    ];
    const socialIcons = [
        {
            url: "https://www.facebook.com/people/Kenya-University-Esports-Rankings/61564114237402/?mibextid=LQQJ4d",
            alt: "Facebook"
        },
        {
            url: "https://www.instagram.com/keuniesportsrankings/?igsh=MXRmNHZtOTVqZDh5dQ%3D%3D&utm_source=qr",
            alt: "Instagram"
        },
        {
            url: "https://www.linkedin.com/company/kenya-university-esports-rankings",
            alt: "LinkedIn"
        },
        {
            url: "https://www.twitch.tv/kenyauniesportsrankings",
            alt: "Twitch"
        },
        {
            url: "https://www.whatsapp.com/channel/0029VafLdwE96H4XI1gb3X3Z",
            alt: "WhatsApp"
        },
        {
            url: "https://www.tiktok.com/@kenyauniesportsrankings",
            alt: "TikTok"
        },
        {
            url: "https://x.com/keunierankings?s=21",
            alt: "Twitter"
        },
        {
            url: "https://www.youtube.com/@kenyauniversityesportsrankings",
            alt: "YouTube"
        }
    ];
    const isActiveRoute = (href)=>href === '/' ? pathname === '/' : pathname.startsWith(href);
    const toggleSearch = ()=>setIsSearchOpen(!isSearchOpen);
    const renderAuthButtons = (isMobile)=>{
        if (loading) return null;
        if (user) {
            if (isMobile) {
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col items-center space-y-3",
                    children: [
                        isAdmin && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/admin",
                            className: "px-4 py-2 bg-[#961c18] hover:bg-[#7a1514] text-white font-medium text-sm rounded transition-colors",
                            onClick: ()=>setIsMobileMenuOpen(false),
                            children: "Admin Panel"
                        }, void 0, false, {
                            fileName: "[project]/esports/src/components/Navigation.tsx",
                            lineNumber: 80,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/tournament-registration",
                            className: "px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded transition-colors",
                            onClick: ()=>setIsMobileMenuOpen(false),
                            children: "Register for Tournament"
                        }, void 0, false, {
                            fileName: "[project]/esports/src/components/Navigation.tsx",
                            lineNumber: 88,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: signOut,
                            className: "px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors",
                            children: "Logout"
                        }, void 0, false, {
                            fileName: "[project]/esports/src/components/Navigation.tsx",
                            lineNumber: 95,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/esports/src/components/Navigation.tsx",
                    lineNumber: 78,
                    columnNumber: 11
                }, this);
            }
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center space-x-4",
                children: [
                    isAdmin && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$components$2f$TicketNotifications$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/esports/src/components/Navigation.tsx",
                        lineNumber: 107,
                        columnNumber: 23
                    }, this),
                    isAdmin && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/admin",
                        className: "px-4 py-2 bg-[#961c18] hover:bg-[#7a1514] text-white font-medium text-sm rounded transition-colors",
                        children: "Admin Panel"
                    }, void 0, false, {
                        fileName: "[project]/esports/src/components/Navigation.tsx",
                        lineNumber: 109,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative profile-dropdown",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setIsProfileDropdownOpen(!isProfileDropdownOpen),
                                className: "flex items-center justify-center w-10 h-10 bg-[#961c18] hover:bg-[#7a1514] text-white rounded-full transition-colors",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "w-6 h-6",
                                    fill: "none",
                                    stroke: "currentColor",
                                    viewBox: "0 0 24 24",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        strokeWidth: 2,
                                        d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    }, void 0, false, {
                                        fileName: "[project]/esports/src/components/Navigation.tsx",
                                        lineNumber: 122,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/esports/src/components/Navigation.tsx",
                                    lineNumber: 121,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/esports/src/components/Navigation.tsx",
                                lineNumber: 117,
                                columnNumber: 13
                            }, this),
                            isProfileDropdownOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute top-12 right-0 bg-white border border-gray-300 rounded-lg shadow-lg py-2 w-48 z-50",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "px-4 py-2 border-b border-gray-200",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm font-medium text-gray-900",
                                                children: profile === null || profile === void 0 ? void 0 : profile.fullname
                                            }, void 0, false, {
                                                fileName: "[project]/esports/src/components/Navigation.tsx",
                                                lineNumber: 128,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-gray-500",
                                                children: user.email
                                            }, void 0, false, {
                                                fileName: "[project]/esports/src/components/Navigation.tsx",
                                                lineNumber: 129,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/esports/src/components/Navigation.tsx",
                                        lineNumber: 127,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "http://kuer-drab.vercel.app",
                                        className: "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors",
                                        onClick: ()=>setIsProfileDropdownOpen(false),
                                        children: "Register for Tournament"
                                    }, void 0, false, {
                                        fileName: "[project]/esports/src/components/Navigation.tsx",
                                        lineNumber: 131,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            setIsProfileDropdownOpen(false);
                                            signOut();
                                        },
                                        className: "block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors",
                                        children: "Logout"
                                    }, void 0, false, {
                                        fileName: "[project]/esports/src/components/Navigation.tsx",
                                        lineNumber: 138,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/esports/src/components/Navigation.tsx",
                                lineNumber: 126,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/esports/src/components/Navigation.tsx",
                        lineNumber: 116,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/esports/src/components/Navigation.tsx",
                lineNumber: 106,
                columnNumber: 9
            }, this);
        }
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex ".concat(isMobile ? 'flex-col items-center space-y-3' : 'items-center space-x-4'),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "/login",
                    className: "px-4 py-2 bg-[#961c18] rounded text-white font-medium text-base hover:bg-[#7a1514] transition-colors",
                    children: "Login"
                }, void 0, false, {
                    fileName: "[project]/esports/src/components/Navigation.tsx",
                    lineNumber: 156,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "/register",
                    className: "px-4 py-2 rounded-lg bg-transparent border border-[#961c18] text-[#961c18] font-medium text-base hover:bg-[#961c18] hover:text-white transition-colors",
                    children: "Register"
                }, void 0, false, {
                    fileName: "[project]/esports/src/components/Navigation.tsx",
                    lineNumber: 162,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/esports/src/components/Navigation.tsx",
            lineNumber: 155,
            columnNumber: 7
        }, this);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "relative w-full bg-black z-50",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "hidden md:flex justify-between items-center px-6 h-[70px] border-b border-white",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center space-x-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[#8d130e] text-base font-normal",
                                children: "Follow us on"
                            }, void 0, false, {
                                fileName: "[project]/esports/src/components/Navigation.tsx",
                                lineNumber: 177,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex space-x-2",
                                children: socialIcons.map((icon, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SocialIcon"], {
                                        url: icon.url,
                                        style: {
                                            width: 30,
                                            height: 30
                                        },
                                        fgColor: "white",
                                        bgColor: "transparent",
                                        target: "_blank",
                                        rel: "noopener noreferrer"
                                    }, idx, false, {
                                        fileName: "[project]/esports/src/components/Navigation.tsx",
                                        lineNumber: 180,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/esports/src/components/Navigation.tsx",
                                lineNumber: 178,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/esports/src/components/Navigation.tsx",
                        lineNumber: 176,
                        columnNumber: 9
                    }, this),
                    renderAuthButtons()
                ]
            }, void 0, true, {
                fileName: "[project]/esports/src/components/Navigation.tsx",
                lineNumber: 175,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative h-[120px] md:h-[100px]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        src: "https://c.animaapp.com/md6ebassseX7AK/img/group-44.png",
                        alt: "Background",
                        fill: true,
                        className: "object-cover opacity-20 pointer-events-none",
                        priority: true
                    }, void 0, false, {
                        fileName: "[project]/esports/src/components/Navigation.tsx",
                        lineNumber: 197,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "md:hidden relative z-20 flex justify-between items-center px-4 h-full",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: "https://c.animaapp.com/md7xc8iywLDvVn/img/kuer-transparent-1.png",
                                    alt: "Kuer Logo",
                                    className: "w-12 h-12 object-cover"
                                }, void 0, false, {
                                    fileName: "[project]/esports/src/components/Navigation.tsx",
                                    lineNumber: 208,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/esports/src/components/Navigation.tsx",
                                lineNumber: 207,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setIsMobileMenuOpen(!isMobileMenuOpen),
                                className: "text-[#8c110d] hover:text-[#b91c17]",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "w-6 h-6",
                                    fill: "none",
                                    stroke: "currentColor",
                                    viewBox: "0 0 24 24",
                                    children: isMobileMenuOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        strokeWidth: 2,
                                        d: "M6 18L18 6M6 6l12 12"
                                    }, void 0, false, {
                                        fileName: "[project]/esports/src/components/Navigation.tsx",
                                        lineNumber: 220,
                                        columnNumber: 17
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        strokeWidth: 2,
                                        d: "M4 6h16M4 12h16M4 18h16"
                                    }, void 0, false, {
                                        fileName: "[project]/esports/src/components/Navigation.tsx",
                                        lineNumber: 222,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/esports/src/components/Navigation.tsx",
                                    lineNumber: 218,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/esports/src/components/Navigation.tsx",
                                lineNumber: 214,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/esports/src/components/Navigation.tsx",
                        lineNumber: 206,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "hidden md:flex justify-between items-center relative z-30 h-full px-12",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex space-x-10",
                                children: navItems.slice(0, 3).map((item, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: item.href,
                                        className: "text-xl font-bold tracking-wide transition-colors ".concat(isActiveRoute(item.href) ? 'text-[#8c110d]' : 'text-white hover:text-[#b91c17]'),
                                        children: item.name
                                    }, idx, false, {
                                        fileName: "[project]/esports/src/components/Navigation.tsx",
                                        lineNumber: 233,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/esports/src/components/Navigation.tsx",
                                lineNumber: 231,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                className: "absolute w-[220px] h-[220px] top-10 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20",
                                alt: "Group",
                                src: "https://c.animaapp.com/md7xc8iywLDvVn/img/group-151.png"
                            }, void 0, false, {
                                fileName: "[project]/esports/src/components/Navigation.tsx",
                                lineNumber: 248,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                className: "absolute w-[175px] h-[187px] top-6 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover z-30",
                                alt: "Kuer transparent",
                                src: "https://c.animaapp.com/md7xc8iywLDvVn/img/kuer-transparent-1.png"
                            }, void 0, false, {
                                fileName: "[project]/esports/src/components/Navigation.tsx",
                                lineNumber: 253,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center space-x-10",
                                children: [
                                    navItems.slice(3).map((item, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: item.href,
                                            className: "text-xl font-bold tracking-wide transition-colors ".concat(isActiveRoute(item.href) ? 'text-[#8c110d]' : 'text-white hover:text-[#b91c17]'),
                                            children: item.name
                                        }, idx, false, {
                                            fileName: "[project]/esports/src/components/Navigation.tsx",
                                            lineNumber: 262,
                                            columnNumber: 15
                                        }, this)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative search-dropdown",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: toggleSearch,
                                                className: "w-6 h-6 flex items-center justify-center hover:text-[#8c110d]",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    className: "w-5 h-5 text-gray-400 hover:text-[#8c110d]",
                                                    fill: "none",
                                                    stroke: "currentColor",
                                                    viewBox: "0 0 24 24",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        strokeLinecap: "round",
                                                        strokeLinejoin: "round",
                                                        strokeWidth: 2,
                                                        d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                                    }, void 0, false, {
                                                        fileName: "[project]/esports/src/components/Navigation.tsx",
                                                        lineNumber: 281,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/esports/src/components/Navigation.tsx",
                                                    lineNumber: 280,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/esports/src/components/Navigation.tsx",
                                                lineNumber: 276,
                                                columnNumber: 15
                                            }, this),
                                            isSearchOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute top-10 right-0 bg-white border border-gray-300 rounded-lg shadow-lg p-3 w-[250px] z-50",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    placeholder: "Search...",
                                                    className: "w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#961c18] text-black",
                                                    autoFocus: true
                                                }, void 0, false, {
                                                    fileName: "[project]/esports/src/components/Navigation.tsx",
                                                    lineNumber: 286,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/esports/src/components/Navigation.tsx",
                                                lineNumber: 285,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/esports/src/components/Navigation.tsx",
                                        lineNumber: 275,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/esports/src/components/Navigation.tsx",
                                lineNumber: 260,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/esports/src/components/Navigation.tsx",
                        lineNumber: 229,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute bottom-0 left-0 w-full h-[0.5px] bg-white/50"
                    }, void 0, false, {
                        fileName: "[project]/esports/src/components/Navigation.tsx",
                        lineNumber: 298,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/esports/src/components/Navigation.tsx",
                lineNumber: 196,
                columnNumber: 7
            }, this),
            isMobileMenuOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "md:hidden fixed inset-0 bg-black bg-opacity-95 z-50 flex flex-col items-center justify-center space-y-6",
                children: [
                    navItems.map((item, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: item.href,
                            className: "text-2xl font-bold text-white hover:text-[#961c18]",
                            onClick: ()=>setIsMobileMenuOpen(false),
                            children: item.name
                        }, idx, false, {
                            fileName: "[project]/esports/src/components/Navigation.tsx",
                            lineNumber: 305,
                            columnNumber: 13
                        }, this)),
                    renderAuthButtons(true),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex space-x-4 mt-6",
                        children: socialIcons.map((icon, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SocialIcon"], {
                                url: icon.url,
                                style: {
                                    width: 30,
                                    height: 30
                                },
                                fgColor: "white",
                                bgColor: "transparent",
                                target: "_blank",
                                rel: "noopener noreferrer"
                            }, idx, false, {
                                fileName: "[project]/esports/src/components/Navigation.tsx",
                                lineNumber: 320,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/esports/src/components/Navigation.tsx",
                        lineNumber: 318,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/esports/src/components/Navigation.tsx",
                lineNumber: 303,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/esports/src/components/Navigation.tsx",
        lineNumber: 173,
        columnNumber: 5
    }, this);
}
_s(Navigation, "u5jr3oScTbnvhO1WhClCZNWeO88=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = Navigation;
var _c;
__turbopack_context__.k.register(_c, "Navigation");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
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
"[project]/esports/src/components/pages/blogs/HeroBanner.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HeroBannerSection",
    ()=>HeroBannerSection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/esports/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$lib$2f$strapi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/src/lib/strapi.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const HeroBannerSection = ()=>{
    _s();
    const [featuredArticle, setFeaturedArticle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HeroBannerSection.useEffect": ()=>{
            loadFeaturedArticle();
        }
    }["HeroBannerSection.useEffect"], []);
    const loadFeaturedArticle = async ()=>{
        try {
            // Check if Strapi is configured
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            console.log('Loading featured article from Strapi...');
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$lib$2f$strapi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["strapiAPI"].getFeaturedArticles(1);
            if (response.data.length > 0) {
                const article = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$lib$2f$strapi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transformStrapiArticle"])(response.data[0]);
                console.log('Featured article loaded:', article);
                setFeaturedArticle(article);
            } else {
                console.log('No featured articles found');
                setFeaturedArticle(null);
            }
        } catch (error) {
            console.log('Strapi not available, using fallback content');
            setFeaturedArticle(null);
        } finally{
            setLoading(false);
        }
    };
    // Fallback data if no featured article is found
    const fallbackData = {
        title: 'KUER GAMING BLOG',
        subtitle: 'Stay updated with the latest gaming news, tournament coverage, and esports insights from Kenya\'s premier gaming community',
        backgroundImage: '/images/Join our tournaments.png'
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            className: "relative bg-black min-h-screen flex items-center justify-center py-16",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-white text-xl",
                children: "Loading..."
            }, void 0, false, {
                fileName: "[project]/esports/src/components/pages/blogs/HeroBanner.tsx",
                lineNumber: 54,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/esports/src/components/pages/blogs/HeroBanner.tsx",
            lineNumber: 53,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "relative bg-black min-h-screen flex items-center justify-center py-16",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 overflow-hidden",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                    className: "absolute bottom-0 left-0 w-1/3 h-auto object-cover transform -translate-x-1/4 translate-y-1/4 opacity-30",
                    alt: "Background Left",
                    src: "/images/Mask Group.png",
                    onError: (e)=>{
                        const target = e.target;
                        target.style.display = 'none';
                    }
                }, void 0, false, {
                    fileName: "[project]/esports/src/components/pages/blogs/HeroBanner.tsx",
                    lineNumber: 63,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/esports/src/components/pages/blogs/HeroBanner.tsx",
                lineNumber: 62,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            (featuredArticle === null || featuredArticle === void 0 ? void 0 : featuredArticle.imageUrl) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 bg-cover bg-center",
                        style: {
                            backgroundImage: "url(".concat(featuredArticle.imageUrl, ")")
                        }
                    }, void 0, false, {
                        fileName: "[project]/esports/src/components/pages/blogs/HeroBanner.tsx",
                        lineNumber: 77,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 bg-black opacity-70"
                    }, void 0, false, {
                        fileName: "[project]/esports/src/components/pages/blogs/HeroBanner.tsx",
                        lineNumber: 81,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative w-full max-w-[1440px] mx-auto flex flex-col lg:flex-row h-auto items-center lg:items-stretch z-10 px-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 flex flex-col justify-center p-4 md:p-8 text-center lg:text-left",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-full max-w-xl mx-auto lg:mx-20",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "font-['Hind',Helvetica] font-bold text-4xl sm:text-5xl md:text-[44px] leading-tight md:leading-[61.6px] tracking-[0.77px] mb-4 text-white",
                                    children: featuredArticle ? featuredArticle.title.includes('(MMUST)') ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            featuredArticle.title.split('(MMUST)')[0],
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[#961c18]",
                                                children: "(MMUST)"
                                            }, void 0, false, {
                                                fileName: "[project]/esports/src/components/pages/blogs/HeroBanner.tsx",
                                                lineNumber: 95,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            featuredArticle.title.split('(MMUST)')[1]
                                        ]
                                    }, void 0, true) : featuredArticle.title : fallbackData.title
                                }, void 0, false, {
                                    fileName: "[project]/esports/src/components/pages/blogs/HeroBanner.tsx",
                                    lineNumber: 90,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "font-normal text-lg sm:text-xl mt-4 text-[#aaaaaa]",
                                    children: featuredArticle ? featuredArticle.description : fallbackData.subtitle
                                }, void 0, false, {
                                    fileName: "[project]/esports/src/components/pages/blogs/HeroBanner.tsx",
                                    lineNumber: 106,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                featuredArticle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-wrap gap-4 mt-4 text-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "px-3 py-1 bg-[#961c18] text-white rounded-full",
                                            children: featuredArticle.category
                                        }, void 0, false, {
                                            fileName: "[project]/esports/src/components/pages/blogs/HeroBanner.tsx",
                                            lineNumber: 113,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        featuredArticle.game && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "px-3 py-1 bg-gray-700 text-white rounded-full",
                                            children: featuredArticle.game
                                        }, void 0, false, {
                                            fileName: "[project]/esports/src/components/pages/blogs/HeroBanner.tsx",
                                            lineNumber: 117,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[#aaaaaa]",
                                            children: new Date(featuredArticle.publishedAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/esports/src/components/pages/blogs/HeroBanner.tsx",
                                            lineNumber: 121,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/esports/src/components/pages/blogs/HeroBanner.tsx",
                                    lineNumber: 112,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                featuredArticle ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-6",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/blogs/".concat(featuredArticle.slug),
                                        className: "inline-block bg-[#961c18] hover:bg-[#7a1514] text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200",
                                        children: "Read Full Article"
                                    }, void 0, false, {
                                        fileName: "[project]/esports/src/components/pages/blogs/HeroBanner.tsx",
                                        lineNumber: 134,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/esports/src/components/pages/blogs/HeroBanner.tsx",
                                    lineNumber: 133,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-6",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "#articles",
                                        className: "inline-block bg-[#961c18] hover:bg-[#7a1514] text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200",
                                        children: "Explore Articles"
                                    }, void 0, false, {
                                        fileName: "[project]/esports/src/components/pages/blogs/HeroBanner.tsx",
                                        lineNumber: 143,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/esports/src/components/pages/blogs/HeroBanner.tsx",
                                    lineNumber: 142,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/esports/src/components/pages/blogs/HeroBanner.tsx",
                            lineNumber: 89,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/esports/src/components/pages/blogs/HeroBanner.tsx",
                        lineNumber: 88,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative flex-1 flex items-center justify-center p-0 md:p-12",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            className: "w-full h-auto max-w-[450px] object-contain",
                            alt: featuredArticle ? featuredArticle.title : "KUER Gaming Blog",
                            src: (featuredArticle === null || featuredArticle === void 0 ? void 0 : featuredArticle.imageUrl) || fallbackData.backgroundImage,
                            onError: (e)=>{
                                const target = e.target;
                                target.src = fallbackData.backgroundImage;
                            }
                        }, void 0, false, {
                            fileName: "[project]/esports/src/components/pages/blogs/HeroBanner.tsx",
                            lineNumber: 156,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/esports/src/components/pages/blogs/HeroBanner.tsx",
                        lineNumber: 155,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/esports/src/components/pages/blogs/HeroBanner.tsx",
                lineNumber: 86,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/esports/src/components/pages/blogs/HeroBanner.tsx",
        lineNumber: 60,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(HeroBannerSection, "896+tjnp/QFe1V0BwQQJigBcHWk=");
_c = HeroBannerSection;
var _c;
__turbopack_context__.k.register(_c, "HeroBannerSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/esports/src/components/ui/separator.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Separator",
    ()=>Separator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$separator$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/@radix-ui/react-separator/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
function Separator(param) {
    let { className, orientation = "horizontal", decorative = true, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$separator$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "separator",
        decorative: decorative,
        orientation: orientation,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/esports/src/components/ui/separator.tsx",
        lineNumber: 15,
        columnNumber: 5
    }, this);
}
_c = Separator;
;
var _c;
__turbopack_context__.k.register(_c, "Separator");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/esports/src/components/Footer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FooterSection",
    ()=>FooterSection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/src/components/ui/button.tsx [app-client] (ecmascript)"); // Assuming you have this Button component
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$components$2f$ui$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/src/components/ui/separator.tsx [app-client] (ecmascript)");
"use client";
;
;
;
;
;
const FooterSection = ()=>{
    const currentYear = 2025;
    const socialLinks = [
        {
            icon: "https://c.animaapp.com/md6ebassseX7AK/img/vector-3.svg",
            alt: "Facebook",
            url: "https://www.facebook.com/people/Kenya-University-Esports-Rankings/61564114237402/?mibextid=LQQJ4d"
        },
        {
            icon: "https://c.animaapp.com/md6ebassseX7AK/img/vector-7.svg",
            alt: "Instagram",
            url: "https://www.instagram.com/keuniesportsrankings/?igsh=MXRmNHZtOTVqZDh5dQ%3D%3D&utm_source=qr"
        },
        {
            icon: "https://c.animaapp.com/md6ebassseX7AK/img/linkedin-1-1.png",
            alt: "LinkedIn",
            url: "https://www.linkedin.com/company/kenya-university-esports-rankings"
        },
        {
            // FIX: Swapped icon URL with Discord's for the correct YouTube icon.
            icon: "https://c.animaapp.com/md6ebassseX7AK/img/vector-12.svg",
            alt: "YouTube",
            url: "https://www.youtube.com/@kenyauniversityesportsrankings"
        },
        {
            icon: "https://c.animaapp.com/md6ebassseX7AK/img/whattsapp-1-1.png",
            alt: "WhatsApp",
            url: "https://www.whatsapp.com/channel/0029VafLdwE96H4XI1gb3X3Z"
        },
        {
            icon: "https://c.animaapp.com/md6ebassseX7AK/img/tiktox-1-1.png",
            alt: "TikTok",
            url: "https://www.tiktok.com/@kenyauniesportsrankings"
        },
        {
            icon: "https://c.animaapp.com/md6ebassseX7AK/img/x-1-1.png",
            alt: "X",
            url: "https://x.com/keunierankings?s=21"
        },
        {
            // FIX: Swapped icon URL with YouTube's for the correct Discord icon.
            icon: "https://c.animaapp.com/md6ebassseX7AK/img/vector-13.svg",
            alt: "Twitch",
            url: "https://www.twitch.tv/kenyauniesportsrankings"
        }
    ];
    const handleNavLinkClick = (linkName)=>{
        console.log("Navigating to: ".concat(linkName));
    };
    const handleDonateClick = ()=>{
        console.log("Donate Now button clicked!");
    };
    const scrollToTop = ()=>{
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
        className: "w-full relative",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 z-0",
                style: {
                    backgroundImage: 'url(/images/footer.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }
            }, void 0, false, {
                fileName: "[project]/esports/src/components/Footer.tsx",
                lineNumber: 78,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full pt-6 pb-8 relative z-10",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-[1200px] mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 sm:gap-x-12 lg:gap-x-[120px] gap-y-8 sm:gap-y-10",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col items-center sm:items-start pt-2 col-span-1 sm:col-span-2 lg:col-span-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    className: "w-[120px] sm:w-[140px] h-[130px] sm:h-[150px] object-cover mb-4 sm:mb-0 sm:ml-6",
                                    alt: "Kuer transparent",
                                    src: "https://c.animaapp.com/md6ebassseX7AK/img/kuer-transparent-1.png",
                                    width: 140,
                                    height: 150
                                }, void 0, false, {
                                    fileName: "[project]/esports/src/components/Footer.tsx",
                                    lineNumber: 93,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-wrap gap-1 justify-center sm:justify-start sm:ml-6",
                                    children: socialLinks.map((link, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: link.url,
                                            target: "_blank",
                                            rel: "noopener noreferrer",
                                            "aria-label": link.alt,
                                            className: "hover:scale-110 transition-transform",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                className: "w-[17px] h-[17px] object-cover",
                                                alt: link.alt,
                                                src: link.icon,
                                                width: 17,
                                                height: 17
                                            }, void 0, false, {
                                                fileName: "[project]/esports/src/components/Footer.tsx",
                                                lineNumber: 112,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, "social-".concat(index), false, {
                                            fileName: "[project]/esports/src/components/Footer.tsx",
                                            lineNumber: 104,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)))
                                }, void 0, false, {
                                    fileName: "[project]/esports/src/components/Footer.tsx",
                                    lineNumber: 102,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/esports/src/components/Footer.tsx",
                            lineNumber: 92,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "font-semibold text-white text-xl uppercase tracking-wider",
                                    children: "INFORMATION"
                                }, void 0, false, {
                                    fileName: "[project]/esports/src/components/Footer.tsx",
                                    lineNumber: 126,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$components$2f$ui$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {
                                    className: "w-[50px] h-0.5 mt-2 mb-4 bg-[#961C18]"
                                }, void 0, false, {
                                    fileName: "[project]/esports/src/components/Footer.tsx",
                                    lineNumber: 127,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/terms",
                                            className: "flex items-center gap-2 text-left w-full cursor-pointer text-[#AAAAAA] hover:text-white transition-colors",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-3.5 h-[11px] bg-[url(https://c.animaapp.com/md6ebassseX7AK/img/vector.svg)] bg-cover bg-center"
                                                }, void 0, false, {
                                                    fileName: "[project]/esports/src/components/Footer.tsx",
                                                    lineNumber: 134,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-normal text-base",
                                                    children: "Terms and Conditions"
                                                }, void 0, false, {
                                                    fileName: "[project]/esports/src/components/Footer.tsx",
                                                    lineNumber: 135,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/esports/src/components/Footer.tsx",
                                            lineNumber: 130,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/privacy",
                                            className: "flex items-center gap-2 text-left w-full cursor-pointer text-[#AAAAAA] hover:text-white transition-colors",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-3.5 h-3.5 bg-[url(https://c.animaapp.com/md6ebassseX7AK/img/vector-4.svg)] bg-cover bg-center"
                                                }, void 0, false, {
                                                    fileName: "[project]/esports/src/components/Footer.tsx",
                                                    lineNumber: 144,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-normal text-base",
                                                    children: "Privacy Policy"
                                                }, void 0, false, {
                                                    fileName: "[project]/esports/src/components/Footer.tsx",
                                                    lineNumber: 145,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/esports/src/components/Footer.tsx",
                                            lineNumber: 140,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/esports/src/components/Footer.tsx",
                                    lineNumber: 129,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/esports/src/components/Footer.tsx",
                            lineNumber: 125,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "font-semibold text-white text-xl uppercase tracking-wider",
                                    children: "HELP"
                                }, void 0, false, {
                                    fileName: "[project]/esports/src/components/Footer.tsx",
                                    lineNumber: 154,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$components$2f$ui$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {
                                    className: "w-[50px] h-0.5 mt-2 mb-4 bg-[#961C18]"
                                }, void 0, false, {
                                    fileName: "[project]/esports/src/components/Footer.tsx",
                                    lineNumber: 155,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/help",
                                            onClick: ()=>handleNavLinkClick("Help"),
                                            className: "font-normal text-[#AAAAAA] text-base block w-full text-left cursor-pointer hover:text-white transition-colors",
                                            children: "Help"
                                        }, void 0, false, {
                                            fileName: "[project]/esports/src/components/Footer.tsx",
                                            lineNumber: 158,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/faq",
                                            onClick: ()=>handleNavLinkClick("Help"),
                                            className: "font-normal text-[#AAAAAA] text-base block w-full text-left cursor-pointer hover:text-white transition-colors",
                                            children: "Frequently Asked Questions - FAQs"
                                        }, void 0, false, {
                                            fileName: "[project]/esports/src/components/Footer.tsx",
                                            lineNumber: 165,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/contact",
                                            onClick: ()=>handleNavLinkClick("Help"),
                                            className: "font-normal text-[#AAAAAA] text-base block w-full text-left cursor-pointer hover:text-white transition-colors",
                                            children: "Contact"
                                        }, void 0, false, {
                                            fileName: "[project]/esports/src/components/Footer.tsx",
                                            lineNumber: 172,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/blogs",
                                            className: "flex items-center text-left cursor-pointer text-[#961C18] hover:text-[#D13431] transition-colors mt-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-normal text-base mr-1",
                                                    children: "View all news here"
                                                }, void 0, false, {
                                                    fileName: "[project]/esports/src/components/Footer.tsx",
                                                    lineNumber: 184,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    className: "w-4 h-[15px] object-contain",
                                                    alt: "Arrow",
                                                    src: "https://c.animaapp.com/md6ebassseX7AK/img/arrow-2.svg",
                                                    width: 16,
                                                    height: 15
                                                }, void 0, false, {
                                                    fileName: "[project]/esports/src/components/Footer.tsx",
                                                    lineNumber: 187,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/esports/src/components/Footer.tsx",
                                            lineNumber: 180,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/esports/src/components/Footer.tsx",
                                    lineNumber: 157,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/esports/src/components/Footer.tsx",
                            lineNumber: 153,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "font-semibold text-white text-xl uppercase tracking-wider",
                                    children: "LINKS OF INTEREST"
                                }, void 0, false, {
                                    fileName: "[project]/esports/src/components/Footer.tsx",
                                    lineNumber: 200,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$components$2f$ui$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {
                                    className: "w-[50px] h-0.5 mt-2 mb-4 bg-[#961C18]"
                                }, void 0, false, {
                                    fileName: "[project]/esports/src/components/Footer.tsx",
                                    lineNumber: 203,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>window.location.href = "https://tunzaesports.org/",
                                        className: "font-normal text-[#AAAAAA] text-base block w-full text-left cursor-pointer hover:text-white transition-colors",
                                        children: "TUNZA ESPORTS"
                                    }, void 0, false, {
                                        fileName: "[project]/esports/src/components/Footer.tsx",
                                        lineNumber: 206,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/esports/src/components/Footer.tsx",
                                    lineNumber: 205,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/esports/src/components/Footer.tsx",
                            lineNumber: 199,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/esports/src/components/Footer.tsx",
                    lineNumber: 90,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/esports/src/components/Footer.tsx",
                lineNumber: 89,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full min-h-[130px] bg-[#07080A] border-t border-[#212121] flex items-center relative py-4 sm:py-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative w-full max-w-[1200px] mx-auto h-full flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 gap-6 sm:gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-start gap-0 order-2 sm:order-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        className: "w-[13px] h-4 object-cover mt-0.5",
                                        alt: "Location pin",
                                        src: "https://c.animaapp.com/md6ebassseX7AK/img/vector-6.svg",
                                        width: 13,
                                        height: 16
                                    }, void 0, false, {
                                        fileName: "[project]/esports/src/components/Footer.tsx",
                                        lineNumber: 223,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-col gap-0.5 items-start ml-[30px]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-medium text-white text-base sm:text-lg",
                                                children: "Nairobi, Kenya"
                                            }, void 0, false, {
                                                fileName: "[project]/esports/src/components/Footer.tsx",
                                                lineNumber: 231,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[#AAAAAA] text-sm",
                                                children: "P.O BOX 45085-00100"
                                            }, void 0, false, {
                                                fileName: "[project]/esports/src/components/Footer.tsx",
                                                lineNumber: 234,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/esports/src/components/Footer.tsx",
                                        lineNumber: 230,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/esports/src/components/Footer.tsx",
                                lineNumber: 222,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col items-center justify-center text-center order-1 sm:order-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-medium text-white text-sm sm:text-base lg:text-lg leading-tight",
                                        children: "Support the Movement:"
                                    }, void 0, false, {
                                        fileName: "[project]/esports/src/components/Footer.tsx",
                                        lineNumber: 242,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-medium text-white text-sm sm:text-base lg:text-lg leading-tight mb-3 sm:mb-4",
                                        children: "Fuel the Future of Kenyan Esports!"
                                    }, void 0, false, {
                                        fileName: "[project]/esports/src/components/Footer.tsx",
                                        lineNumber: 245,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        onClick: handleDonateClick,
                                        className: "w-[120px] sm:w-[140px] h-[45px] sm:h-[50px] bg-[#961C18] rounded-md text-white font-medium text-base sm:text-lg hover:bg-[#D13431] transition-colors",
                                        children: "Donate Now"
                                    }, void 0, false, {
                                        fileName: "[project]/esports/src/components/Footer.tsx",
                                        lineNumber: 249,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/esports/src/components/Footer.tsx",
                                lineNumber: 241,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/esports/src/components/Footer.tsx",
                        lineNumber: 220,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: scrollToTop,
                        "aria-label": "Scroll to top of page",
                        className: "w-[50px] h-[50px] rounded-none flex items-center justify-center bg-white shadow-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 absolute right-4 bottom-0 transform translate-y-1/2 z-30",
                        title: "Back to top",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            width: "24",
                            height: "24",
                            viewBox: "0 0 24 24",
                            fill: "none",
                            xmlns: "http://www.w3.org/2000/svg",
                            className: "w-[18px] h-[18px] text-black",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M12 18L12 6M12 6L7 11M12 6L17 11",
                                stroke: "#961c18",
                                strokeWidth: "2",
                                strokeLinecap: "round",
                                strokeLinejoin: "round"
                            }, void 0, false, {
                                fileName: "[project]/esports/src/components/Footer.tsx",
                                lineNumber: 266,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/esports/src/components/Footer.tsx",
                            lineNumber: 265,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/esports/src/components/Footer.tsx",
                        lineNumber: 259,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/esports/src/components/Footer.tsx",
                lineNumber: 219,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full min-h-[59px] bg-[#961C18] flex items-center justify-center px-4 sm:px-6 py-3 relative z-20",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center sm:text-left max-w-[1200px] w-full",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-medium text-white text-xs sm:text-sm leading-relaxed",
                        children: [
                            "KENYA UNIVERSITY ESPORTS RANKINGS (KUER) COPYRIGHTS ALL RESERVED",
                            " ",
                            currentYear
                        ]
                    }, void 0, true, {
                        fileName: "[project]/esports/src/components/Footer.tsx",
                        lineNumber: 274,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/esports/src/components/Footer.tsx",
                    lineNumber: 273,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/esports/src/components/Footer.tsx",
                lineNumber: 272,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/esports/src/components/Footer.tsx",
        lineNumber: 76,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = FooterSection;
var _c;
__turbopack_context__.k.register(_c, "FooterSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/esports/src/components/pages/blogs/BlogsOverview.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BlogsOverviewSection",
    ()=>BlogsOverviewSection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/esports/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/esports/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/esports/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/esports/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-client] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/esports/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$lib$2f$strapi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/src/lib/strapi.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
// Search Input Component
const SearchInput = (param)=>{
    let { value, onChange, placeholder, className } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-4 h-4"
            }, void 0, false, {
                fileName: "[project]/esports/src/components/pages/blogs/BlogsOverview.tsx",
                lineNumber: 21,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: "text",
                value: value,
                onChange: (e)=>onChange(e.target.value),
                placeholder: placeholder,
                className: "\n        pl-10 pr-4 py-2 w-64 rounded-lg text-white placeholder-white\n        border-2 border-red-900 focus:border-red-900 focus:ring-2 focus:ring-red-900\n        bg-transparent outline-none transition-colors ".concat(className || "", "\n      ")
            }, void 0, false, {
                fileName: "[project]/esports/src/components/pages/blogs/BlogsOverview.tsx",
                lineNumber: 22,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/esports/src/components/pages/blogs/BlogsOverview.tsx",
        lineNumber: 20,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
};
_c = SearchInput;
// Filter Dropdown Component
const FilterDropdown = (param)=>{
    let { value, onChange, options, placeholder, allLabel, className } = param;
    _s();
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative w-40",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>setIsOpen(!isOpen),
                className: "\n          flex items-center justify-between px-4 py-2 w-full rounded-lg text-white\n          border-2 border-red-900 bg-transparent focus:border-red-900 focus:ring-2 focus:ring-red-900\n          transition-colors ".concat(className || "", "\n        "),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "truncate",
                        children: value || allLabel
                    }, void 0, false, {
                        fileName: "[project]/esports/src/components/pages/blogs/BlogsOverview.tsx",
                        lineNumber: 64,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                        className: "w-4 h-4 transition-transform ".concat(isOpen ? "rotate-180" : "")
                    }, void 0, false, {
                        fileName: "[project]/esports/src/components/pages/blogs/BlogsOverview.tsx",
                        lineNumber: 65,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/esports/src/components/pages/blogs/BlogsOverview.tsx",
                lineNumber: 56,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "\n            absolute top-full left-0 mt-1 w-full rounded-lg overflow-y-auto max-h-48\n            bg-transparent border-2 border-red-900 text-white z-10\n          ",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            onChange("");
                            setIsOpen(false);
                        },
                        className: "w-full px-4 py-2 text-left hover:bg-red-900 transition-colors",
                        children: allLabel
                    }, void 0, false, {
                        fileName: "[project]/esports/src/components/pages/blogs/BlogsOverview.tsx",
                        lineNumber: 75,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    options.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>{
                                onChange(option);
                                setIsOpen(false);
                            },
                            className: "w-full px-4 py-2 text-left hover:bg-red-900 transition-colors",
                            children: option
                        }, option, false, {
                            fileName: "[project]/esports/src/components/pages/blogs/BlogsOverview.tsx",
                            lineNumber: 85,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)))
                ]
            }, void 0, true, {
                fileName: "[project]/esports/src/components/pages/blogs/BlogsOverview.tsx",
                lineNumber: 69,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/esports/src/components/pages/blogs/BlogsOverview.tsx",
        lineNumber: 55,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(FilterDropdown, "+sus0Lb0ewKHdwiUhiTAJFoFyQ0=");
_c1 = FilterDropdown;
// Blog Card Component
const BlogCard = (param)=>{
    let { article } = param;
    _s1();
    const [currentImageUrl, setCurrentImageUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [imageError, setImageError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const formatDate = (dateString)=>new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    // Ensure we have a valid image URL with proper fallback
    const getImageUrl = (url)=>{
        if (!url || url.trim() === '') return '/images/Join our tournaments.png';
        // If it's already a full URL, return as is
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }
        // If it starts with /uploads/, it's a Strapi upload - prepend Strapi URL
        if (url.startsWith('/uploads/')) {
            const strapiUrl = ("TURBOPACK compile-time value", "https://kuer-strapi-backend-production.up.railway.app") || 'https://kuer-strapi-backend-production.up.railway.app';
            return "".concat(strapiUrl).concat(url);
        }
        // If it starts with /, assume it's a local image
        if (url.startsWith('/')) {
            return url;
        }
        // Otherwise, assume it needs /images/ prefix
        return "/images/".concat(url);
    };
    // Initialize the image URL when component mounts or imageUrl changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BlogCard.useEffect": ()=>{
            setImageError(false);
            const processedUrl = getImageUrl(article.imageUrl);
            console.log('Processing blog image URL:', {
                original: article.imageUrl,
                processed: processedUrl
            });
            setCurrentImageUrl(processedUrl);
        }
    }["BlogCard.useEffect"], [
        article.imageUrl
    ]);
    const displayImageUrl = imageError ? '/images/Join our tournaments.png' : currentImageUrl || '/images/Join our tournaments.png';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        href: "/blogs/".concat(article.slug),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative h-48 bg-gray-800",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: displayImageUrl,
                            alt: article.title,
                            className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300",
                            onError: (e)=>{
                                console.error('Blog image failed to load:', displayImageUrl);
                                if (!imageError) {
                                    setImageError(true);
                                }
                            },
                            onLoad: ()=>{
                                // Reset error state if image loads successfully
                                if (imageError) {
                                    setImageError(false);
                                }
                            }
                        }, void 0, false, {
                            fileName: "[project]/esports/src/components/pages/blogs/BlogsOverview.tsx",
                            lineNumber: 152,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        article.featured && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute top-2 left-2 bg-[#961c18] text-white px-2 py-1 rounded text-xs font-semibold",
                            children: "Featured"
                        }, void 0, false, {
                            fileName: "[project]/esports/src/components/pages/blogs/BlogsOverview.tsx",
                            lineNumber: 170,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs",
                            children: formatDate(article.publishedAt)
                        }, void 0, false, {
                            fileName: "[project]/esports/src/components/pages/blogs/BlogsOverview.tsx",
                            lineNumber: 174,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/esports/src/components/pages/blogs/BlogsOverview.tsx",
                    lineNumber: 151,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-wrap gap-2 mb-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "px-2 py-1 bg-[#961c18] text-white rounded text-xs",
                                    children: article.category
                                }, void 0, false, {
                                    fileName: "[project]/esports/src/components/pages/blogs/BlogsOverview.tsx",
                                    lineNumber: 181,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                article.game && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "px-2 py-1 bg-gray-700 text-white rounded text-xs",
                                    children: article.game
                                }, void 0, false, {
                                    fileName: "[project]/esports/src/components/pages/blogs/BlogsOverview.tsx",
                                    lineNumber: 185,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/esports/src/components/pages/blogs/BlogsOverview.tsx",
                            lineNumber: 180,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-white text-xl font-bold mb-2 group-hover:text-[#961c18] transition-colors line-clamp-2",
                            children: article.title
                        }, void 0, false, {
                            fileName: "[project]/esports/src/components/pages/blogs/BlogsOverview.tsx",
                            lineNumber: 189,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-400 text-sm line-clamp-3 mb-4",
                            children: article.description
                        }, void 0, false, {
                            fileName: "[project]/esports/src/components/pages/blogs/BlogsOverview.tsx",
                            lineNumber: 193,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between text-xs text-gray-500",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: [
                                        "By ",
                                        article.author
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/esports/src/components/pages/blogs/BlogsOverview.tsx",
                                    lineNumber: 196,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-[#961c18] group-hover:text-white transition-colors",
                                    children: "Read More →"
                                }, void 0, false, {
                                    fileName: "[project]/esports/src/components/pages/blogs/BlogsOverview.tsx",
                                    lineNumber: 197,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/esports/src/components/pages/blogs/BlogsOverview.tsx",
                            lineNumber: 195,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/esports/src/components/pages/blogs/BlogsOverview.tsx",
                    lineNumber: 179,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/esports/src/components/pages/blogs/BlogsOverview.tsx",
            lineNumber: 150,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/esports/src/components/pages/blogs/BlogsOverview.tsx",
        lineNumber: 149,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s1(BlogCard, "AdDs9FwfKOdp2hkb+ijq9V5Wybc=");
_c2 = BlogCard;
// Pagination Controls
const PaginationControls = (param)=>{
    let { currentPage, totalPages, onPreviousPage, onNextPage } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center justify-center gap-4 mt-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: onPreviousPage,
                disabled: currentPage <= 1,
                className: "flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                        className: "w-4 h-4"
                    }, void 0, false, {
                        fileName: "[project]/esports/src/components/pages/blogs/BlogsOverview.tsx",
                        lineNumber: 223,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0)),
                    "Previous"
                ]
            }, void 0, true, {
                fileName: "[project]/esports/src/components/pages/blogs/BlogsOverview.tsx",
                lineNumber: 218,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-white",
                children: [
                    "Page ",
                    currentPage,
                    " of ",
                    totalPages
                ]
            }, void 0, true, {
                fileName: "[project]/esports/src/components/pages/blogs/BlogsOverview.tsx",
                lineNumber: 227,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: onNextPage,
                disabled: currentPage >= totalPages,
                className: "flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
                children: [
                    "Next",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                        className: "w-4 h-4"
                    }, void 0, false, {
                        fileName: "[project]/esports/src/components/pages/blogs/BlogsOverview.tsx",
                        lineNumber: 237,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/esports/src/components/pages/blogs/BlogsOverview.tsx",
                lineNumber: 231,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/esports/src/components/pages/blogs/BlogsOverview.tsx",
        lineNumber: 217,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
};
_c3 = PaginationControls;
const BlogsOverviewSection = ()=>{
    _s2();
    const [articles, setArticles] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [categories, setCategories] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [games, setGames] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [selectedCategory, setSelectedCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [selectedGame, setSelectedGame] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [currentPage, setCurrentPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [totalPages, setTotalPages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [scrollPosition, setScrollPosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const articlesPerPage = 6;
    const scrollContainerRef = __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useRef(null);
    // Load articles and filters
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BlogsOverviewSection.useEffect": ()=>{
            loadData();
        }
    }["BlogsOverviewSection.useEffect"], [
        currentPage,
        selectedCategory,
        selectedGame,
        searchTerm
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BlogsOverviewSection.useEffect": ()=>{
            loadFilters();
        }
    }["BlogsOverviewSection.useEffect"], []);
    const loadData = async ()=>{
        try {
            setLoading(true);
            setError(null);
            let fetchedArticles = [];
            if ("TURBOPACK compile-time truthy", 1) {
                var _response_meta_pagination;
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$lib$2f$strapi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["strapiAPI"].getArticles({
                    page: currentPage,
                    pageSize: articlesPerPage,
                    category: selectedCategory || undefined,
                    game: selectedGame || undefined,
                    search: searchTerm || undefined,
                    populate: [
                        "image"
                    ]
                });
                fetchedArticles = response.data.map(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$lib$2f$strapi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transformStrapiArticle"]);
                setTotalPages(((_response_meta_pagination = response.meta.pagination) === null || _response_meta_pagination === void 0 ? void 0 : _response_meta_pagination.pageCount) || 1);
            } else {
                // Fallback data (copy your fallback array here)
                fetchedArticles = []; // Add your fallback data here
            }
            setArticles(fetchedArticles);
        } catch (err) {
            console.error(err);
            setError("Failed to load articles.");
        } finally{
            setLoading(false);
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
        } catch (e) {
            setCategories([
                "Tournament Results",
                "Championship",
                "News",
                "Reviews"
            ]);
            setGames([
                "PUBG Mobile",
                "Call of Duty Mobile",
                "Free Fire",
                "Fortnite"
            ]);
        }
    };
    const handlePreviousPage = ()=>currentPage > 1 && setCurrentPage(currentPage - 1);
    const handleNextPage = ()=>currentPage < totalPages && setCurrentPage(currentPage + 1);
    const scrollLeft = ()=>{
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: -320,
                behavior: "smooth"
            });
        }
    };
    const scrollRight = ()=>{
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: 320,
                behavior: "smooth"
            });
        }
    };
    const handleScroll = ()=>{
        if (scrollContainerRef.current) {
            setScrollPosition(scrollContainerRef.current.scrollLeft);
        }
    };
    const canScrollLeft = scrollPosition > 0;
    const canScrollRight = scrollContainerRef.current ? scrollPosition < scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth : articles.length > 2;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        id: "articles",
        className: "bg-[#101013] py-16 min-h-screen",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col md:flex-row items-center justify-between gap-4 mb-12",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SearchInput, {
                            value: searchTerm,
                            onChange: setSearchTerm,
                            placeholder: "Search articles..."
                        }, void 0, false, {
                            fileName: "[project]/esports/src/components/pages/blogs/BlogsOverview.tsx",
                            lineNumber: 342,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FilterDropdown, {
                                    value: selectedCategory,
                                    onChange: setSelectedCategory,
                                    options: categories,
                                    placeholder: "All Categories",
                                    allLabel: "All Categories"
                                }, void 0, false, {
                                    fileName: "[project]/esports/src/components/pages/blogs/BlogsOverview.tsx",
                                    lineNumber: 345,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FilterDropdown, {
                                    value: selectedGame,
                                    onChange: setSelectedGame,
                                    options: games,
                                    placeholder: "All Games",
                                    allLabel: "All Games"
                                }, void 0, false, {
                                    fileName: "[project]/esports/src/components/pages/blogs/BlogsOverview.tsx",
                                    lineNumber: 352,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/esports/src/components/pages/blogs/BlogsOverview.tsx",
                            lineNumber: 344,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/esports/src/components/pages/blogs/BlogsOverview.tsx",
                    lineNumber: 341,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "min-h-[600px] relative",
                    children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-center py-20",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "animate-spin rounded-full h-12 w-12 border-b-2 border-[#961c18] mx-auto mb-4"
                                }, void 0, false, {
                                    fileName: "[project]/esports/src/components/pages/blogs/BlogsOverview.tsx",
                                    lineNumber: 367,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[#aaaaaa] text-lg",
                                    children: "Loading articles..."
                                }, void 0, false, {
                                    fileName: "[project]/esports/src/components/pages/blogs/BlogsOverview.tsx",
                                    lineNumber: 368,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/esports/src/components/pages/blogs/BlogsOverview.tsx",
                            lineNumber: 366,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/esports/src/components/pages/blogs/BlogsOverview.tsx",
                        lineNumber: 365,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)) : articles.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-center py-20",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-[#aaaaaa] text-lg",
                            children: "No articles found matching your criteria."
                        }, void 0, false, {
                            fileName: "[project]/esports/src/components/pages/blogs/BlogsOverview.tsx",
                            lineNumber: 373,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/esports/src/components/pages/blogs/BlogsOverview.tsx",
                        lineNumber: 372,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                ref: scrollContainerRef,
                                onScroll: handleScroll,
                                className: "flex gap-6 overflow-x-auto scrollbar-hide pb-4",
                                children: articles.map((article)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-none w-80",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(BlogCard, {
                                            article: article
                                        }, void 0, false, {
                                            fileName: "[project]/esports/src/components/pages/blogs/BlogsOverview.tsx",
                                            lineNumber: 384,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, article.id, false, {
                                        fileName: "[project]/esports/src/components/pages/blogs/BlogsOverview.tsx",
                                        lineNumber: 383,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0)))
                            }, void 0, false, {
                                fileName: "[project]/esports/src/components/pages/blogs/BlogsOverview.tsx",
                                lineNumber: 377,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            canScrollLeft && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: scrollLeft,
                                className: "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                    className: "w-6 h-6"
                                }, void 0, false, {
                                    fileName: "[project]/esports/src/components/pages/blogs/BlogsOverview.tsx",
                                    lineNumber: 394,
                                    columnNumber: 19
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/esports/src/components/pages/blogs/BlogsOverview.tsx",
                                lineNumber: 390,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)),
                            canScrollRight && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: scrollRight,
                                className: "absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                    className: "w-6 h-6"
                                }, void 0, false, {
                                    fileName: "[project]/esports/src/components/pages/blogs/BlogsOverview.tsx",
                                    lineNumber: 403,
                                    columnNumber: 19
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/esports/src/components/pages/blogs/BlogsOverview.tsx",
                                lineNumber: 399,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true)
                }, void 0, false, {
                    fileName: "[project]/esports/src/components/pages/blogs/BlogsOverview.tsx",
                    lineNumber: 363,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                totalPages > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PaginationControls, {
                    currentPage: currentPage,
                    totalPages: totalPages,
                    onPreviousPage: handlePreviousPage,
                    onNextPage: handleNextPage
                }, void 0, false, {
                    fileName: "[project]/esports/src/components/pages/blogs/BlogsOverview.tsx",
                    lineNumber: 412,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/esports/src/components/pages/blogs/BlogsOverview.tsx",
            lineNumber: 339,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/esports/src/components/pages/blogs/BlogsOverview.tsx",
        lineNumber: 338,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s2(BlogsOverviewSection, "q4Wo8hcMkeMpUm98uKmdoT0JvWs=");
_c4 = BlogsOverviewSection;
var _c, _c1, _c2, _c3, _c4;
__turbopack_context__.k.register(_c, "SearchInput");
__turbopack_context__.k.register(_c1, "FilterDropdown");
__turbopack_context__.k.register(_c2, "BlogCard");
__turbopack_context__.k.register(_c3, "PaginationControls");
__turbopack_context__.k.register(_c4, "BlogsOverviewSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=esports_src_a2a0bbb5._.js.map