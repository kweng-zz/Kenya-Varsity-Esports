'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
export default function ProtectedRoute({ children, adminOnly = false, redirectTo = '/login', fallback, }) {
    const { user, profile, loading } = useAuth();
    const router = useRouter();
    useEffect(() => {
        if (!loading && !fallback) {
            if (!user) {
                router.push(redirectTo);
                return;
            }
            if (adminOnly && !profile?.isAdmin) {
                router.push('/');
                return;
            }
        }
    }, [user, profile, loading, adminOnly, redirectTo, router, fallback]);
    if (loading) {
        return null;
    }
    if (!user || (adminOnly && !profile?.isAdmin)) {
        if (fallback) {
            return <>{fallback}</>;
        }
        return null;
    }
    return <>{children}</>;
}
