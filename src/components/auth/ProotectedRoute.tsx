'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
  redirectTo?: string;
  fallback?: ReactNode;
}

export default function ProtectedRoute({
  children,
  adminOnly = false,
  redirectTo = '/login',
  fallback,
}: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !fallback) {
      if (!user) {
        router.push(redirectTo);
        return;
      }

      if (user && user.emailVerification === false) {
        router.push('/verify-email');
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

  if (!user || (adminOnly && !profile?.isAdmin) || user.emailVerification === false) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return null;
  }

  return <>{children}</>;
}
