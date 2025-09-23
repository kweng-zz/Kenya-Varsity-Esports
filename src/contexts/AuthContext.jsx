'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Account, Client, Databases, ID } from 'appwrite';
// --- Appwrite Client Setup with lazy initialization ---
let client = null;
let account = null;
let databases = null;
const initializeAppwrite = () => {
    if (!client) {
        const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
        const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
        if (!endpoint || !projectId) {
            console.warn('Appwrite configuration missing for auth, authentication will not work');
            return null;
        }
        if (typeof endpoint !== 'string' || endpoint.trim() === '') {
            console.warn('Appwrite endpoint is invalid for auth, authentication will not work');
            return null;
        }
        try {
            client = new Client()
                .setEndpoint(endpoint)
                .setProject(projectId);
            account = new Account(client);
            databases = new Databases(client);
        }
        catch (error) {
            console.error('Failed to initialize Appwrite client for auth:', error);
            return null;
        }
    }
    // Ensure both account and databases are initialized
    if (!account || !databases) {
        return null;
    }
    return { account, databases };
};
// --- Context ---
export const AuthContext = createContext(undefined);
// --- Provider ---
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    // --- Fetch Profile ---
    const getProfile = async (userId) => {
        try {
            console.log('🔍 Fetching profile for user ID:', userId);
            const appwrite = initializeAppwrite();
            if (!appwrite) {
                console.warn('Appwrite not configured, cannot fetch profile');
                return null;
            }
            const doc = await appwrite.databases.getDocument(process.env.NEXT_PUBLIC_APPWRITE_DB_ID, process.env.NEXT_PUBLIC_APPWRITE_PROFILE_COLLECTION_ID, userId);
            console.log('✅ Profile fetched successfully:', doc.fullname || doc.email);
            // Force boolean if missing
            const profile = {
                ...doc,
                isAdmin: doc.isAdmin ?? false
            };
            return profile;
        }
        catch (error) {
            console.error('❌ Error fetching profile:', error);
            // If it's a permission error, try to create a basic profile
            if (error.code === 401) {
                console.log('🔧 Permission error - user may need to re-authenticate');
            }
            return null;
        }
    };
    // --- Initialize User ---
    useEffect(() => {
        const init = async () => {
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
                console.log('✅ Found user profile:', userProfile?.fullname);
                setProfile(userProfile);
            }
            catch (err) {
                // Expected when no active session exists (401 Unauthorized)
                // This is normal behavior, not an error
                console.log('ℹ️ No active session found');
                setUser(null);
                setProfile(null);
            }
            finally {
                setLoading(false);
            }
        };
        init();
    }, []);
    // --- Auth Actions ---
    const signIn = async (email, password) => {
        try {
            const appwrite = initializeAppwrite();
            if (!appwrite) {
                return { error: new Error('Appwrite not configured') };
            }
            const session = await appwrite.account.createEmailPasswordSession(email, password);
            const currentUser = await appwrite.account.get();
            setUser(currentUser);
            const userProfile = await getProfile(currentUser.$id);
            setProfile(userProfile);
            return { user: currentUser };
        }
        catch (error) {
            console.error('Sign in error:', error);
            return { error };
        }
    };
    const signUp = async (email, password, userData) => {
        try {
            const appwrite = initializeAppwrite();
            if (!appwrite) {
                return { error: new Error('Appwrite not configured') };
            }
            // First create the user account
            const newUser = await appwrite.account.create(ID.unique(), email, password);
            // Create a session for the new user so they can create their profile
            await appwrite.account.createEmailPasswordSession(email, password);
            // Create the profile document (permissions will be handled by collection settings)
            const profileDoc = await appwrite.databases.createDocument(process.env.NEXT_PUBLIC_APPWRITE_DB_ID, process.env.NEXT_PUBLIC_APPWRITE_PROFILE_COLLECTION_ID, newUser.$id, {
                ...userData,
                isAdmin: false // Default to non-admin
            });
            setUser(newUser);
            setProfile(profileDoc);
            return { user: newUser };
        }
        catch (error) {
            console.error('Sign up error:', error);
            return { error };
        }
    };
    const signOut = async () => {
        try {
            // Only attempt to delete session if user is actually signed in
            if (user) {
                const appwrite = initializeAppwrite();
                if (appwrite) {
                    await appwrite.account.deleteSession('current');
                }
            }
        }
        catch (error) {
            // Ignore errors when user is already signed out or has no active session
            // This can happen if the session expired or user is already a guest
            console.log('Session already cleared or user already signed out');
        }
        finally {
            // Always clear local state regardless of API call success
            setUser(null);
            setProfile(null);
        }
    };
    const updateProfile = async (updates) => {
        if (!profile)
            return { error: new Error('No profile to update') };
        try {
            const appwrite = initializeAppwrite();
            if (!appwrite) {
                return { error: new Error('Appwrite not configured') };
            }
            const updated = await appwrite.databases.updateDocument(process.env.NEXT_PUBLIC_APPWRITE_DB_ID, process.env.NEXT_PUBLIC_APPWRITE_PROFILE_COLLECTION_ID, profile.$id, updates);
            setProfile(updated);
            return {};
        }
        catch (error) {
            console.error('Update profile error:', error);
            return { error };
        }
    };
    const sendPasswordResetEmail = async (email) => {
        try {
            const appwrite = initializeAppwrite();
            if (!appwrite) {
                return { error: new Error('Appwrite not configured') };
            }
            await appwrite.account.createRecovery(email, `${window.location.origin}/reset-password`);
            return {};
        }
        catch (error) {
            console.error('Password reset error:', error);
            return { error };
        }
    };
    const resendVerificationEmail = async () => {
        try {
            const appwrite = initializeAppwrite();
            if (!appwrite) {
                return { error: new Error('Appwrite not configured') };
            }
            await appwrite.account.createVerification(`${window.location.origin}/verify-email`);
            return {};
        }
        catch (error) {
            console.error('Verification email error:', error);
            return { error };
        }
    };
    return (<AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut, updateProfile, sendPasswordResetEmail, resendVerificationEmail }}>
      {children}
    </AuthContext.Provider>);
};
// --- Hook ---
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
