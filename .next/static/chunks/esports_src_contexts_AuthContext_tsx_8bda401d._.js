(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/esports/src/contexts/AuthContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthContext",
    ()=>AuthContext,
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/esports/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/appwrite/dist/esm/sdk.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
// --- Appwrite Client Setup with lazy initialization ---
let client = null;
let account = null;
let databases = null;
const initializeAppwrite = ()=>{
    if (!client) {
        const endpoint = ("TURBOPACK compile-time value", "https://fra.cloud.appwrite.io/v1");
        const projectId = ("TURBOPACK compile-time value", "68c7e7bc0028f9acee36");
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        if (typeof endpoint !== 'string' || endpoint.trim() === '') {
            console.warn('Appwrite endpoint is invalid for auth, authentication will not work');
            return null;
        }
        try {
            client = new __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Client"]().setEndpoint(endpoint).setProject(projectId);
            account = new __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Account"](client);
            databases = new __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Databases"](client);
        } catch (error) {
            console.error('Failed to initialize Appwrite client for auth:', error);
            return null;
        }
    }
    // Ensure both account and databases are initialized
    if (!account || !databases) {
        return null;
    }
    return {
        account,
        databases
    };
};
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const AuthProvider = (param)=>{
    let { children } = param;
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [profile, setProfile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // --- Fetch Profile ---
    const getProfile = async (userId)=>{
        try {
            console.log('🔍 Fetching profile for user ID:', userId);
            const appwrite = initializeAppwrite();
            if (!appwrite) {
                console.warn('Appwrite not configured, cannot fetch profile');
                return null;
            }
            const doc = await appwrite.databases.getDocument(("TURBOPACK compile-time value", "68c7f25e00083a6d2992"), ("TURBOPACK compile-time value", "user_profiles"), userId);
            console.log('✅ Profile fetched successfully:', doc.fullname || doc.email);
            var _isAdmin;
            // Force boolean if missing
            const profile = {
                ...doc,
                isAdmin: (_isAdmin = doc.isAdmin) !== null && _isAdmin !== void 0 ? _isAdmin : false
            };
            return profile;
        } catch (error) {
            console.error('❌ Error fetching profile:', error);
            // If it's a permission error, try to create a basic profile
            if (error.code === 401) {
                console.log('🔧 Permission error - user may need to re-authenticate');
            }
            return null;
        }
    };
    // --- Initialize User ---
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            const init = {
                "AuthProvider.useEffect.init": async ()=>{
                    try {
                        console.log('🔍 Checking for existing session...');
                        const appwrite = initializeAppwrite();
                        if (!appwrite) {
                            console.warn('Appwrite not configured, skipping session check');
                            setLoading(false);
                            return;
                        }
                        const currentUser = await appwrite.account.get();
                        console.log('✅ Found user session:', currentUser.email);
                        setUser(currentUser);
                        const userProfile = await getProfile(currentUser.$id);
                        console.log('✅ Found user profile:', userProfile === null || userProfile === void 0 ? void 0 : userProfile.fullname);
                        setProfile(userProfile);
                    } catch (err) {
                        // Expected when no active session exists (401 Unauthorized)
                        // This is normal behavior, not an error
                        console.log('ℹ️ No active session found');
                        setUser(null);
                        setProfile(null);
                    } finally{
                        setLoading(false);
                    }
                }
            }["AuthProvider.useEffect.init"];
            init();
        }
    }["AuthProvider.useEffect"], []);
    // --- Auth Actions ---
    const signIn = async (email, password)=>{
        try {
            const appwrite = initializeAppwrite();
            if (!appwrite) {
                return {
                    error: new Error('Appwrite not configured')
                };
            }
            const session = await appwrite.account.createEmailPasswordSession(email, password);
            const currentUser = await appwrite.account.get();
            setUser(currentUser);
            const userProfile = await getProfile(currentUser.$id);
            setProfile(userProfile);
            return {
                user: currentUser
            };
        } catch (error) {
            console.error('Sign in error:', error);
            return {
                error
            };
        }
    };
    const signUp = async (email, password, userData)=>{
        try {
            const appwrite = initializeAppwrite();
            if (!appwrite) {
                return {
                    error: new Error('Appwrite not configured')
                };
            }
            // First create the user account
            const newUser = await appwrite.account.create(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$appwrite$2f$dist$2f$esm$2f$sdk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ID"].unique(), email, password);
            // Create a session for the new user so they can create their profile
            await appwrite.account.createEmailPasswordSession(email, password);
            // Create the profile document (permissions will be handled by collection settings)
            const profileDoc = await appwrite.databases.createDocument(("TURBOPACK compile-time value", "68c7f25e00083a6d2992"), ("TURBOPACK compile-time value", "user_profiles"), newUser.$id, {
                ...userData,
                isAdmin: false // Default to non-admin
            });
            setUser(newUser);
            setProfile(profileDoc);
            return {
                user: newUser
            };
        } catch (error) {
            console.error('Sign up error:', error);
            return {
                error
            };
        }
    };
    const signOut = async ()=>{
        try {
            // Only attempt to delete session if user is actually signed in
            if (user) {
                const appwrite = initializeAppwrite();
                if (appwrite) {
                    await appwrite.account.deleteSession('current');
                }
            }
        } catch (error) {
            // Ignore errors when user is already signed out or has no active session
            // This can happen if the session expired or user is already a guest
            console.log('Session already cleared or user already signed out');
        } finally{
            // Always clear local state regardless of API call success
            setUser(null);
            setProfile(null);
        }
    };
    const updateProfile = async (updates)=>{
        if (!profile) return {
            error: new Error('No profile to update')
        };
        try {
            const appwrite = initializeAppwrite();
            if (!appwrite) {
                return {
                    error: new Error('Appwrite not configured')
                };
            }
            const updated = await appwrite.databases.updateDocument(("TURBOPACK compile-time value", "68c7f25e00083a6d2992"), ("TURBOPACK compile-time value", "user_profiles"), profile.$id, updates);
            setProfile(updated);
            return {};
        } catch (error) {
            console.error('Update profile error:', error);
            return {
                error
            };
        }
    };
    const sendPasswordResetEmail = async (email)=>{
        try {
            const appwrite = initializeAppwrite();
            if (!appwrite) {
                return {
                    error: new Error('Appwrite not configured')
                };
            }
            await appwrite.account.createRecovery(email, "".concat(window.location.origin, "/reset-password"));
            return {};
        } catch (error) {
            console.error('Password reset error:', error);
            return {
                error
            };
        }
    };
    const resendVerificationEmail = async ()=>{
        try {
            const appwrite = initializeAppwrite();
            if (!appwrite) {
                return {
                    error: new Error('Appwrite not configured')
                };
            }
            await appwrite.account.createVerification("".concat(window.location.origin, "/verify-email"));
            return {};
        } catch (error) {
            console.error('Verification email error:', error);
            return {
                error
            };
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user,
            profile,
            loading,
            signIn,
            signUp,
            signOut,
            updateProfile,
            sendPasswordResetEmail,
            resendVerificationEmail
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/esports/src/contexts/AuthContext.tsx",
        lineNumber: 284,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(AuthProvider, "DYSpA4ZauWKW8e4CNkO4ayA+RbM=");
_c = AuthProvider;
const useAuth = ()=>{
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
_s1(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=esports_src_contexts_AuthContext_tsx_8bda401d._.js.map