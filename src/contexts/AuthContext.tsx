'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Account, Client, Databases, Models, ID, Permission, Role } from 'appwrite';

// --- Appwrite Client Setup ---
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

const account = new Account(client);
const databases = new Databases(client);

// --- Types ---
export type AppwriteProfile = {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $collectionId: string;
  $permissions: string[];
  fullname: string;
  email: string;
  university?: string;
  student_id?: string;
  phone_number?: string;
  isAdmin?: boolean; // optional admin flag
  isTeamCaptain?: boolean; // team captain flag
};

export interface AuthContextType {
  user: Models.User<Record<string, unknown>> | null;
  profile: AppwriteProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: unknown; user?: Models.User<Record<string, unknown>> }>;
  signUp: (
    email: string,
    password: string,
    userData: Omit<AppwriteProfile, '$id' | '$createdAt' | '$updatedAt' | '$collectionId' | '$permissions'>
  ) => Promise<{ error?: unknown; user?: Models.User<Record<string, unknown>> }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<AppwriteProfile>) => Promise<{ error?: unknown }>;
  sendPasswordResetEmail: (email: string) => Promise<{ error?: unknown }>;
  resendVerificationEmail: () => Promise<{ error?: unknown }>;
}

// --- Context ---
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- Provider ---
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Models.User<Record<string, unknown>> | null>(null);
  const [profile, setProfile] = useState<AppwriteProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // --- Fetch Profile ---
  const getProfile = async (userId: string): Promise<AppwriteProfile | null> => {
    try {
      console.log('🔍 Fetching profile for user ID:', userId);
      const doc = await databases.getDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_PROFILE_COLLECTION_ID!,
        userId
      );
      console.log('✅ Profile fetched successfully:', doc.fullname || doc.email);
      // Force boolean if missing
      const profile = {
        ...(doc as unknown as AppwriteProfile),
        isAdmin: (doc as Record<string, unknown>).isAdmin as boolean ?? false
      };
      return profile;
    } catch (error) {
      console.error('❌ Error fetching profile:', error);
      // If it's a permission error, try to create a basic profile
      if ((error as { code?: number }).code === 401) {
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
        const currentUser = await account.get();
        console.log('✅ Found user session:', currentUser.email);
        setUser(currentUser);
        const userProfile = await getProfile(currentUser.$id);
        console.log('✅ Found user profile:', userProfile?.fullname);
        setProfile(userProfile);
      } catch (err) {
        // Expected when no active session exists (401 Unauthorized)
        // This is normal behavior, not an error
        console.log('ℹ️ No active session found');
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // --- Auth Actions ---
  const signIn = async (email: string, password: string) => {
    try {
      const session = await account.createEmailPasswordSession(email, password);
      const currentUser = await account.get();
      setUser(currentUser);
      const userProfile = await getProfile(currentUser.$id);
      setProfile(userProfile);
      return { user: currentUser };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    userData: Omit<AppwriteProfile, '$id' | '$createdAt' | '$updatedAt' | '$collectionId' | '$permissions'>
  ) => {
    try {
      // First create the user account
      const newUser = await account.create(ID.unique(), email, password);
      
      // Create a session for the new user so they can create their profile
      await account.createEmailPasswordSession(email, password);

      // Create the profile document (permissions will be handled by collection settings)
      const profileDoc = await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_PROFILE_COLLECTION_ID!,
        newUser.$id,
        {
          ...userData,
          isAdmin: false // Default to non-admin
        }
      );

      setUser(newUser);
      setProfile(profileDoc as unknown as AppwriteProfile);

      return { user: newUser };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      // Only attempt to delete session if user is actually signed in
      if (user) {
        await account.deleteSession('current');
      }
    } catch (error) {
      // Ignore errors when user is already signed out or has no active session
      // This can happen if the session expired or user is already a guest
      console.log('Session already cleared or user already signed out');
    } finally {
      // Always clear local state regardless of API call success
      setUser(null);
      setProfile(null);
    }
  };

  const updateProfile = async (updates: Partial<AppwriteProfile>) => {
    if (!profile) return { error: new Error('No profile to update') };
    try {
      const updated = await databases.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_PROFILE_COLLECTION_ID!,
        profile.$id,
        updates
      );
      setProfile(updated as unknown as AppwriteProfile);
      return {};
    } catch (error) {
      console.error('Update profile error:', error);
      return { error };
    }
  };

  const sendPasswordResetEmail = async (email: string) => {
    try {
      await account.createRecovery(email, `${window.location.origin}/reset-password`);
      return {};
    } catch (error) {
      console.error('Password reset error:', error);
      return { error };
    }
  };

  const resendVerificationEmail = async () => {
  try {
    await account.createVerification(`${window.location.origin}/verify-email`); 
    return {};
  } catch (error) {
    console.error('Verification email error:', error);
    return { error };
  }
};


  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut, updateProfile, sendPasswordResetEmail, resendVerificationEmail }}>
      {children}
    </AuthContext.Provider>
  );
};

// --- Hook ---
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
