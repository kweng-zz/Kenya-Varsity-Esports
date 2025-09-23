(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/esports/src/app/admin/users/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AdminUsersPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/esports/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/src/contexts/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/appwrite/dist/esm/sdk.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
// Lazy initialization to avoid build-time issues
let client = null;
let databases = null;
const initializeAppwrite = ()=>{
    if (!client) {
        const endpoint = ("TURBOPACK compile-time value", "https://fra.cloud.appwrite.io/v1");
        const projectId = ("TURBOPACK compile-time value", "68c7e7bc0028f9acee36");
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        if (typeof endpoint !== 'string' || endpoint.trim() === '') {
            console.warn('Appwrite endpoint is invalid for admin users');
            return null;
        }
        try {
            client = new __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Client"]().setEndpoint(endpoint).setProject(projectId);
            databases = new __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Databases"](client);
        } catch (error) {
            console.error('Failed to initialize Appwrite client for admin users:', error);
            return null;
        }
    }
    return databases;
};
function AdminUsersPage() {
    _s();
    const { user, profile, loading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [users, setUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loadingUsers, setLoadingUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [filter, setFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('all');
    const [updatingUsers, setUpdatingUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Redirect if not admin
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AdminUsersPage.useEffect": ()=>{
            if (!loading && (!user || !(profile === null || profile === void 0 ? void 0 : profile.isAdmin))) {
                router.push('/admin');
            }
        }
    }["AdminUsersPage.useEffect"], [
        user,
        profile,
        loading,
        router
    ]);
    // Fetch users with proper error handling
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AdminUsersPage.useEffect": ()=>{
            const fetchUsers = {
                "AdminUsersPage.useEffect.fetchUsers": async ()=>{
                    if (!user || !(profile === null || profile === void 0 ? void 0 : profile.isAdmin)) return;
                    try {
                        const db = initializeAppwrite();
                        if (!db) {
                            console.warn('Appwrite not configured, skipping users fetch');
                            setLoadingUsers(false);
                            return;
                        }
                        const response = await db.listDocuments(("TURBOPACK compile-time value", "68c7f25e00083a6d2992"), ("TURBOPACK compile-time value", "user_profiles"), [
                            __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Query"].orderDesc('$createdAt'),
                            __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Query"].limit(100)
                        ]);
                        // Map users and ensure isTeamCaptain defaults to false if undefined
                        const usersData = response.documents.map({
                            "AdminUsersPage.useEffect.fetchUsers.usersData": (doc)=>({
                                    ...doc,
                                    isTeamCaptain: doc.isTeamCaptain || false
                                })
                        }["AdminUsersPage.useEffect.fetchUsers.usersData"]);
                        setUsers(usersData);
                        setError(null);
                    } catch (error) {
                        console.error('Error fetching users:', error);
                        setError('Failed to fetch users. Please try again.');
                    } finally{
                        setLoadingUsers(false);
                    }
                }
            }["AdminUsersPage.useEffect.fetchUsers"];
            fetchUsers();
        }
    }["AdminUsersPage.useEffect"], [
        user,
        profile
    ]);
    // Sync with Team Captains Manager localStorage
    const syncWithTeamCaptainsManager = (userProfile, isTeamCaptain)=>{
        console.log('🔄 Starting sync with Team Captains Manager...');
        console.log('👤 User Profile:', userProfile);
        console.log('🎯 Is Team Captain:', isTeamCaptain);
        try {
            const savedCaptains = localStorage.getItem('teamCaptains');
            console.log('📦 Current localStorage data:', savedCaptains);
            let captains = savedCaptains ? JSON.parse(savedCaptains) : [];
            console.log('📋 Parsed captains array:', captains);
            if (isTeamCaptain) {
                console.log('➕ Adding user as team captain...');
                // Add to team captains if not already there
                const existingCaptain = captains.find((captain)=>captain.studentId === userProfile.student_id || captain.email === userProfile.email);
                console.log('🔍 Existing captain found:', existingCaptain);
                if (!existingCaptain) {
                    const newCaptain = {
                        id: "captain_".concat(Date.now()),
                        name: userProfile.fullname,
                        studentId: userProfile.student_id || '',
                        university: userProfile.university || '',
                        email: userProfile.email,
                        dateAdded: new Date().toISOString(),
                        addedBy: (profile === null || profile === void 0 ? void 0 : profile.fullname) || (user === null || user === void 0 ? void 0 : user.email) || 'Admin',
                        notes: 'Added via User Management'
                    };
                    console.log('🆕 New captain object:', newCaptain);
                    captains.push(newCaptain);
                    console.log('📝 Updated captains array:', captains);
                    localStorage.setItem('teamCaptains', JSON.stringify(captains));
                    console.log('💾 Saved to localStorage successfully!');
                } else {
                    console.log('⚠️ Captain already exists, skipping...');
                }
            } else {
                console.log('➖ Removing user from team captains...');
                const originalLength = captains.length;
                captains = captains.filter((captain)=>captain.studentId !== userProfile.student_id && captain.email !== userProfile.email);
                console.log("🗑️ Removed ".concat(originalLength - captains.length, " captains"));
                console.log('📝 Updated captains array:', captains);
                localStorage.setItem('teamCaptains', JSON.stringify(captains));
                console.log('💾 Saved to localStorage successfully!');
            }
        } catch (error) {
            console.error('❌ Error syncing with Team Captains Manager:', error);
        }
    };
    const updateUserRole = async (userId, field, value)=>{
        setUpdatingUsers((prev)=>new Set(prev).add(userId));
        setError(null);
        // Get the user profile for syncing
        const userProfile = users.find((u)=>u.$id === userId);
        try {
            const db = initializeAppwrite();
            if (!db) {
                setError('Appwrite not configured. Please try again.');
                return;
            }
            // First, try to update the document
            await db.updateDocument(("TURBOPACK compile-time value", "68c7f25e00083a6d2992"), ("TURBOPACK compile-time value", "user_profiles"), userId, {
                [field]: value
            });
            // Update local state only if the update was successful
            setUsers((prev)=>prev.map((user)=>user.$id === userId ? {
                        ...user,
                        [field]: value
                    } : user));
            // Sync with Team Captains Manager if updating isTeamCaptain
            if (field === 'isTeamCaptain' && userProfile) {
                syncWithTeamCaptainsManager(userProfile, value);
                if (value) {
                    setError(null);
                    // Show success message for team captain addition
                    setTimeout(()=>{
                        setError("✅ ".concat(userProfile.fullname, " has been added as a team captain and synced with the Team Captains Manager."));
                    }, 100);
                } else {
                    setError(null);
                    setTimeout(()=>{
                        setError("✅ ".concat(userProfile.fullname, " has been removed as a team captain and synced with the Team Captains Manager."));
                    }, 100);
                }
            }
        } catch (error) {
            var _error_message;
            console.error("Error updating user ".concat(field, ":"), error);
            // Handle specific error cases
            if ((_error_message = error.message) === null || _error_message === void 0 ? void 0 : _error_message.includes('Unknown attribute')) {
                setError('The "'.concat(field, "\" attribute doesn't exist in your user collection. Please add it in your Appwrite console."));
            } else {
                setError("Failed to update user role. Please try again.");
            }
            // Refresh users to ensure UI is in sync with database
            try {
                const refreshDb = initializeAppwrite();
                if (refreshDb) {
                    const response = await refreshDb.listDocuments(("TURBOPACK compile-time value", "68c7f25e00083a6d2992"), ("TURBOPACK compile-time value", "user_profiles"), [
                        __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Query"].orderDesc('$createdAt'),
                        __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Query"].limit(100)
                    ]);
                    const usersData = response.documents.map((doc)=>({
                            ...doc,
                            isTeamCaptain: doc.isTeamCaptain || false
                        }));
                    setUsers(usersData);
                }
            } catch (refreshError) {
                console.error('Error refreshing users:', refreshError);
            }
        } finally{
            setUpdatingUsers((prev)=>{
                const newSet = new Set(prev);
                newSet.delete(userId);
                return newSet;
            });
        }
    };
    const filteredUsers = users.filter((user)=>{
        const matchesSearch = user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase()) || user.university && user.university.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' || filter === 'admins' && user.isAdmin || filter === 'captains' && user.isTeamCaptain || filter === 'regular' && !user.isAdmin && !user.isTeamCaptain;
        return matchesSearch && matchesFilter;
    });
    if (loading || loadingUsers) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-gray-900 text-white flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "animate-spin rounded-full h-12 w-12 border-b-2 border-[#961c18] mx-auto mb-4"
                    }, void 0, false, {
                        fileName: "[project]/esports/src/app/admin/users/page.tsx",
                        lineNumber: 280,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "Loading users..."
                    }, void 0, false, {
                        fileName: "[project]/esports/src/app/admin/users/page.tsx",
                        lineNumber: 281,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/esports/src/app/admin/users/page.tsx",
                lineNumber: 279,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/esports/src/app/admin/users/page.tsx",
            lineNumber: 278,
            columnNumber: 7
        }, this);
    }
    if (!user || !(profile === null || profile === void 0 ? void 0 : profile.isAdmin)) {
        return null; // Will redirect
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gray-900 text-white p-8",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-7xl mx-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-between items-center mb-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-3xl font-bold",
                            children: "User Management"
                        }, void 0, false, {
                            fileName: "[project]/esports/src/app/admin/users/page.tsx",
                            lineNumber: 295,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>router.push('/admin'),
                            className: "px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors",
                            children: "Back to Admin"
                        }, void 0, false, {
                            fileName: "[project]/esports/src/app/admin/users/page.tsx",
                            lineNumber: 296,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/esports/src/app/admin/users/page.tsx",
                    lineNumber: 294,
                    columnNumber: 9
                }, this),
                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-6 rounded-lg p-4 ".concat(error.startsWith('✅') ? 'bg-green-900/20 border border-green-600/30' : 'bg-red-900/20 border border-red-600/30'),
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: error.startsWith('✅') ? 'text-green-200' : 'text-red-200',
                                    children: error
                                }, void 0, false, {
                                    fileName: "[project]/esports/src/app/admin/users/page.tsx",
                                    lineNumber: 313,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/esports/src/app/admin/users/page.tsx",
                                lineNumber: 312,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setError(null),
                                className: "text-sm hover:opacity-70 ".concat(error.startsWith('✅') ? 'text-green-400' : 'text-red-400'),
                                children: "✕"
                            }, void 0, false, {
                                fileName: "[project]/esports/src/app/admin/users/page.tsx",
                                lineNumber: 315,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/esports/src/app/admin/users/page.tsx",
                        lineNumber: 311,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/esports/src/app/admin/users/page.tsx",
                    lineNumber: 306,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col md:flex-row gap-4 mb-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: "Search users by name, email, or university...",
                                value: searchTerm,
                                onChange: (e)=>setSearchTerm(e.target.value),
                                className: "w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#961c18] text-white"
                            }, void 0, false, {
                                fileName: "[project]/esports/src/app/admin/users/page.tsx",
                                lineNumber: 330,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/esports/src/app/admin/users/page.tsx",
                            lineNumber: 329,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex space-x-1 bg-gray-800 p-1 rounded-lg",
                            children: [
                                'all',
                                'admins',
                                'captains',
                                'regular'
                            ].map((filterOption)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setFilter(filterOption),
                                    className: "px-4 py-2 rounded-md text-sm font-medium transition-colors ".concat(filter === filterOption ? 'bg-[#961c18] text-white' : 'text-gray-300 hover:text-white hover:bg-gray-700'),
                                    children: [
                                        filterOption.charAt(0).toUpperCase() + filterOption.slice(1),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "ml-2 text-xs",
                                            children: [
                                                "(",
                                                filterOption === 'all' ? users.length : filterOption === 'admins' ? users.filter((u)=>u.isAdmin).length : filterOption === 'captains' ? users.filter((u)=>u.isTeamCaptain).length : users.filter((u)=>!u.isAdmin && !u.isTeamCaptain).length,
                                                ")"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/esports/src/app/admin/users/page.tsx",
                                            lineNumber: 350,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, filterOption, true, {
                                    fileName: "[project]/esports/src/app/admin/users/page.tsx",
                                    lineNumber: 340,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/esports/src/app/admin/users/page.tsx",
                            lineNumber: 338,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/esports/src/app/admin/users/page.tsx",
                    lineNumber: 328,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-gray-800 rounded-lg overflow-hidden",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "overflow-x-auto",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                className: "w-full",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                        className: "bg-gray-700",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-6 py-4 text-left text-white font-bold",
                                                    children: "User"
                                                }, void 0, false, {
                                                    fileName: "[project]/esports/src/app/admin/users/page.tsx",
                                                    lineNumber: 367,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-6 py-4 text-left text-white font-bold",
                                                    children: "University"
                                                }, void 0, false, {
                                                    fileName: "[project]/esports/src/app/admin/users/page.tsx",
                                                    lineNumber: 368,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-6 py-4 text-center text-white font-bold",
                                                    children: "Admin"
                                                }, void 0, false, {
                                                    fileName: "[project]/esports/src/app/admin/users/page.tsx",
                                                    lineNumber: 369,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-6 py-4 text-center text-white font-bold",
                                                    children: "Team Captain"
                                                }, void 0, false, {
                                                    fileName: "[project]/esports/src/app/admin/users/page.tsx",
                                                    lineNumber: 370,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-6 py-4 text-center text-white font-bold",
                                                    children: "Joined"
                                                }, void 0, false, {
                                                    fileName: "[project]/esports/src/app/admin/users/page.tsx",
                                                    lineNumber: 371,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/esports/src/app/admin/users/page.tsx",
                                            lineNumber: 366,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/esports/src/app/admin/users/page.tsx",
                                        lineNumber: 365,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                        children: filteredUsers.map((userProfile)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                className: "border-t border-gray-700 hover:bg-gray-750",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-6 py-4",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "font-medium text-white",
                                                                    children: userProfile.fullname
                                                                }, void 0, false, {
                                                                    fileName: "[project]/esports/src/app/admin/users/page.tsx",
                                                                    lineNumber: 379,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-sm text-gray-400",
                                                                    children: userProfile.email
                                                                }, void 0, false, {
                                                                    fileName: "[project]/esports/src/app/admin/users/page.tsx",
                                                                    lineNumber: 380,
                                                                    columnNumber: 25
                                                                }, this),
                                                                userProfile.student_id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-xs text-gray-500",
                                                                    children: [
                                                                        "ID: ",
                                                                        userProfile.student_id
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/esports/src/app/admin/users/page.tsx",
                                                                    lineNumber: 382,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/esports/src/app/admin/users/page.tsx",
                                                            lineNumber: 378,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/esports/src/app/admin/users/page.tsx",
                                                        lineNumber: 377,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-6 py-4",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-white",
                                                            children: userProfile.university || 'Not specified'
                                                        }, void 0, false, {
                                                            fileName: "[project]/esports/src/app/admin/users/page.tsx",
                                                            lineNumber: 387,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/esports/src/app/admin/users/page.tsx",
                                                        lineNumber: 386,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-6 py-4 text-center",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>updateUserRole(userProfile.$id, 'isAdmin', !userProfile.isAdmin),
                                                                disabled: updatingUsers.has(userProfile.$id) || userProfile.$id === user.$id,
                                                                className: "px-3 py-1 rounded-full text-xs font-medium transition-colors ".concat(userProfile.isAdmin ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-600 text-gray-300 hover:bg-gray-500', " disabled:opacity-50 disabled:cursor-not-allowed"),
                                                                children: updatingUsers.has(userProfile.$id) ? 'Updating...' : userProfile.isAdmin ? 'Admin' : 'Make Admin'
                                                            }, void 0, false, {
                                                                fileName: "[project]/esports/src/app/admin/users/page.tsx",
                                                                lineNumber: 390,
                                                                columnNumber: 23
                                                            }, this),
                                                            userProfile.$id === user.$id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-xs text-gray-500 mt-1",
                                                                children: "You"
                                                            }, void 0, false, {
                                                                fileName: "[project]/esports/src/app/admin/users/page.tsx",
                                                                lineNumber: 403,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/esports/src/app/admin/users/page.tsx",
                                                        lineNumber: 389,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-6 py-4 text-center",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>updateUserRole(userProfile.$id, 'isTeamCaptain', !userProfile.isTeamCaptain),
                                                            disabled: updatingUsers.has(userProfile.$id),
                                                            className: "px-3 py-1 rounded-full text-xs font-medium transition-colors ".concat(userProfile.isTeamCaptain ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-600 text-gray-300 hover:bg-gray-500', " disabled:opacity-50 disabled:cursor-not-allowed"),
                                                            children: updatingUsers.has(userProfile.$id) ? 'Updating...' : userProfile.isTeamCaptain ? 'Captain' : 'Make Captain'
                                                        }, void 0, false, {
                                                            fileName: "[project]/esports/src/app/admin/users/page.tsx",
                                                            lineNumber: 407,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/esports/src/app/admin/users/page.tsx",
                                                        lineNumber: 406,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-6 py-4 text-center",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-sm text-gray-400",
                                                            children: new Date(userProfile.$createdAt).toLocaleDateString()
                                                        }, void 0, false, {
                                                            fileName: "[project]/esports/src/app/admin/users/page.tsx",
                                                            lineNumber: 421,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/esports/src/app/admin/users/page.tsx",
                                                        lineNumber: 420,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, userProfile.$id, true, {
                                                fileName: "[project]/esports/src/app/admin/users/page.tsx",
                                                lineNumber: 376,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/esports/src/app/admin/users/page.tsx",
                                        lineNumber: 374,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/esports/src/app/admin/users/page.tsx",
                                lineNumber: 364,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/esports/src/app/admin/users/page.tsx",
                            lineNumber: 363,
                            columnNumber: 11
                        }, this),
                        filteredUsers.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-8 text-center text-gray-400",
                            children: "No users found matching your search criteria."
                        }, void 0, false, {
                            fileName: "[project]/esports/src/app/admin/users/page.tsx",
                            lineNumber: 432,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/esports/src/app/admin/users/page.tsx",
                    lineNumber: 362,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-8 grid grid-cols-1 md:grid-cols-4 gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-gray-800 rounded-lg p-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-2xl font-bold text-white",
                                    children: users.length
                                }, void 0, false, {
                                    fileName: "[project]/esports/src/app/admin/users/page.tsx",
                                    lineNumber: 441,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-sm text-gray-400",
                                    children: "Total Users"
                                }, void 0, false, {
                                    fileName: "[project]/esports/src/app/admin/users/page.tsx",
                                    lineNumber: 442,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/esports/src/app/admin/users/page.tsx",
                            lineNumber: 440,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-gray-800 rounded-lg p-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-2xl font-bold text-green-400",
                                    children: users.filter((u)=>u.isAdmin).length
                                }, void 0, false, {
                                    fileName: "[project]/esports/src/app/admin/users/page.tsx",
                                    lineNumber: 445,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-sm text-gray-400",
                                    children: "Admins"
                                }, void 0, false, {
                                    fileName: "[project]/esports/src/app/admin/users/page.tsx",
                                    lineNumber: 446,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/esports/src/app/admin/users/page.tsx",
                            lineNumber: 444,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-gray-800 rounded-lg p-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-2xl font-bold text-blue-400",
                                    children: users.filter((u)=>u.isTeamCaptain).length
                                }, void 0, false, {
                                    fileName: "[project]/esports/src/app/admin/users/page.tsx",
                                    lineNumber: 449,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-sm text-gray-400",
                                    children: "Team Captains"
                                }, void 0, false, {
                                    fileName: "[project]/esports/src/app/admin/users/page.tsx",
                                    lineNumber: 450,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/esports/src/app/admin/users/page.tsx",
                            lineNumber: 448,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-gray-800 rounded-lg p-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-2xl font-bold text-gray-400",
                                    children: users.filter((u)=>!u.isAdmin && !u.isTeamCaptain).length
                                }, void 0, false, {
                                    fileName: "[project]/esports/src/app/admin/users/page.tsx",
                                    lineNumber: 453,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-sm text-gray-400",
                                    children: "Regular Users"
                                }, void 0, false, {
                                    fileName: "[project]/esports/src/app/admin/users/page.tsx",
                                    lineNumber: 454,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/esports/src/app/admin/users/page.tsx",
                            lineNumber: 452,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/esports/src/app/admin/users/page.tsx",
                    lineNumber: 439,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/esports/src/app/admin/users/page.tsx",
            lineNumber: 293,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/esports/src/app/admin/users/page.tsx",
        lineNumber: 292,
        columnNumber: 5
    }, this);
}
_s(AdminUsersPage, "qltGKAl9DLEiunmW+QsW3EbTXjg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AdminUsersPage;
var _c;
__turbopack_context__.k.register(_c, "AdminUsersPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/esports/node_modules/next/navigation.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/esports/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=esports_c96fc2d4._.js.map