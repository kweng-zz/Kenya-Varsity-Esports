// src/hooks/useAuth.ts
'use client';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
/**
 * Custom hook to access Appwrite authentication and profile data.
 * Throws an error if used outside of AuthProvider.
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
