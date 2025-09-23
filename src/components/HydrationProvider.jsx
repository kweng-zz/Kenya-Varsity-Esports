'use client';
import { useEffect, useState } from 'react';
export function HydrationProvider({ children }) {
    const [isHydrated, setIsHydrated] = useState(false);
    useEffect(() => {
        // This effect only runs on the client
        setIsHydrated(true);
    }, []);
    // During SSR and before hydration, render a simplified version
    if (!isHydrated) {
        return <div suppressHydrationWarning>{children}</div>;
    }
    // After hydration, render the full version
    return <>{children}</>;
}
// Hook to check if we're on the client side
export function useIsClient() {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);
    return isClient;
}
