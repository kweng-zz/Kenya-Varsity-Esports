'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Account, Client, Databases, Models, ID, Permission, Role } from 'appwrite';

// --- Appwrite Client Setup with lazy initialization ---
let client: Client | null = null;
let account: Account | null = null;
let databases: Databases | null = null;

const initializeAppwrite = (): { account: Account; databases: Databases } | null => {
  // Check if we're in auth fallback mode
  if (process.env.NEXT_PUBLIC_AUTH_FALLBACK_MODE === 'true') {
    console.log('Auth fallback mode enabled, Appwrite disabled');
    return null;
  }

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
    } catch (error) {
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
      const appwrite = initializeAppwrite();
      if (!appwrite) {
        console.warn('Appwrite not configured, cannot fetch profile');
        return null;
      }

      const doc = await appwrite.databases.getDocument(
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
      
      // Handle archived project error
      if ((error as any)?.message?.includes('Project is archived')) {
        console.warn('⚠️ Appwrite project is archived, using fallback profile');
        return {
          $id: userId,
          $createdAt: new Date().toISOString(),
          $updatedAt: new Date().toISOString(),
          $collectionId: 'fallback',
          $permissions: [],
          fullname: 'Demo User',
          email: 'demo@kuer.com',
          university: 'Demo University',
          isAdmin: true, // Grant admin access for demo
          isTeamCaptain: false
        };
      }
      
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
        const appwrite = initializeAppwrite();
        if (!appwrite) {
          console.warn('Appwrite not configured, using demo mode');
          
          // In auth fallback mode, provide a demo user with admin privileges
          if (process.env.NEXT_PUBLIC_AUTH_FALLBACK_MODE === 'true') {
            const demoUser = {
              $id: 'demo-user-id',
              email: 'demo@kuer.com',
              name: 'Demo User',
              emailVerification: true,
              phoneVerification: false,
              phone: '',
              passwordUpdate: new Date().toISOString(),
              prefs: {},
              registration: new Date().toISOString(),
              status: true,
              labels: [],
              accessedAt: new Date().toISOString(),
              $createdAt: new Date().toISOString(),
              $updatedAt: new Date().toISOString(),
              mfa: false,
              targets: []
            } as Models.User<Record<string, unknown>>;
            
            const demoProfile: AppwriteProfile = {
              $id: 'demo-user-id',
              $createdAt: new Date().toISOString(),
              $updatedAt: new Date().toISOString(),
              $collectionId: 'fallback',
              $permissions: [],
              fullname: 'Demo User',
              email: 'demo@kuer.com',
              university: 'Demo University',
              isAdmin: true, // Grant admin access for demo
              isTeamCaptain: false
            };
            
            setUser(demoUser);
            setProfile(demoProfile);
            console.log('✅ Demo user initialized with admin privileges');
          }
          
          setLoading(false);
          return;
        }

        const currentUser = await appwrite.account.get();
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
    } catch (error) {
      console.error('Sign in error:', error);
      
      // Handle archived project error with demo login
      if ((error as any)?.message?.includes('Project is archived')) {
        console.warn('⚠️ Appwrite project is archived, using demo login');
        const demoUser = {
          $id: 'demo-user-id',
          email: email,
          name: 'Demo User',
          emailVerification: true,
          phoneVerification: false,
          phone: '',
          passwordUpdate: new Date().toISOString(),
          prefs: {},
          registration: new Date().toISOString(),
          status: true,
          labels: [],
          accessedAt: new Date().toISOString(),
          $createdAt: new Date().toISOString(),
          $updatedAt: new Date().toISOString(),
          mfa: false,
          targets: []
        } as Models.User<Record<string, unknown>>;
        
        const demoProfile = await getProfile('demo-user-id');
        setUser(demoUser);
        setProfile(demoProfile);
        return { user: demoUser };
      }
      
      return { error };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    userData: Omit<AppwriteProfile, '$id' | '$createdAt' | '$updatedAt' | '$collectionId' | '$permissions'>
  ) => {
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
      const profileDoc = await appwrite.databases.createDocument(
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
        const appwrite = initializeAppwrite();
        if (appwrite) {
          await appwrite.account.deleteSession('current');
        }
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
      const appwrite = initializeAppwrite();
      if (!appwrite) {
        return { error: new Error('Appwrite not configured') };
      }

      const updated = await appwrite.databases.updateDocument(
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
      const appwrite = initializeAppwrite();
      if (!appwrite) {
        return { error: new Error('Appwrite not configured') };
      }

      await appwrite.account.createRecovery(email, `${window.location.origin}/reset-password`);
      return {};
    } catch (error) {
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
