'use client';
import { useEffect } from 'react';
export function HydrationFix() {
    useEffect(() => {
        // Suppress hydration warnings caused by browser extensions
        const originalError = console.error;
        console.error = (...args) => {
            const message = args[0];
            if (typeof message === 'string') {
                // Filter out hydration warnings related to browser extensions
                if (message.includes('Hydration failed') ||
                    message.includes('hydrated but some attributes') ||
                    message.includes('bis_skin_checked') ||
                    message.includes('__processed_') ||
                    message.includes('data-new-gr-c-s-check-loaded') ||
                    message.includes('data-gr-ext-installed') ||
                    message.includes('bis_register')) {
                    // Don't log these specific hydration warnings
                    return;
                }
            }
            // Log all other errors normally
            originalError.apply(console, args);
        };
        // Clean browser extension attributes
        const cleanExtensionAttributes = () => {
            const extensionAttributes = [
                'bis_skin_checked',
                'bis_register',
                '__processed_aca438c9-853a-44c2-ab3e-ff94c42af5c9__',
                'data-new-gr-c-s-check-loaded',
                'data-gr-ext-installed',
                'data-adblock-key',
                'data-darkreader-mode',
                'data-darkreader-scheme',
                'cz-shortcut-listen',
                'data-lt-installed',
                'data-1p-ignore',
                'data-lastpass-icon-root',
            ];
            const allElements = document.querySelectorAll('*');
            allElements.forEach(element => {
                extensionAttributes.forEach(attr => {
                    if (element.hasAttribute(attr)) {
                        element.removeAttribute(attr);
                    }
                });
            });
        };
        // Clean attributes after hydration
        const timeouts = [0, 100, 500, 1000];
        timeouts.forEach(delay => {
            setTimeout(cleanExtensionAttributes, delay);
        });
        // Set up a mutation observer to clean attributes as they're added
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes') {
                    const target = mutation.target;
                    const attrName = mutation.attributeName;
                    if (attrName && (attrName.includes('bis_') ||
                        attrName.includes('__processed_') ||
                        attrName.includes('data-gr-') ||
                        attrName.includes('data-new-gr-'))) {
                        target.removeAttribute(attrName);
                    }
                }
            });
        });
        observer.observe(document.body, {
            attributes: true,
            subtree: true,
            attributeFilter: [
                'bis_skin_checked',
                'bis_register',
                '__processed_aca438c9-853a-44c2-ab3e-ff94c42af5c9__',
                'data-new-gr-c-s-check-loaded',
                'data-gr-ext-installed',
            ]
        });
        return () => {
            observer.disconnect();
            console.error = originalError;
        };
    }, []);
    return null;
}
