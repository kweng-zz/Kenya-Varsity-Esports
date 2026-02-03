'use client';

import { useEffect, useState } from 'react';
import { FaComments } from 'react-icons/fa';

export const TawkToWidget = () => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Tawk.to Script
        // @ts-ignore
        var Tawk_API = window.Tawk_API || {}, Tawk_LoadStart = new Date();
        
        // Hide default widget on load
        Tawk_API.onLoad = function() {
            // @ts-ignore
            window.Tawk_API.hideWidget();
            setIsLoaded(true);
        };

        (function() {
            var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
            s1.async = true;
            s1.src = `https://embed.tawk.to/${process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID}/${process.env.NEXT_PUBLIC_TAWK_WIDGET_ID}`;
            s1.charset = 'UTF-8';
            s1.setAttribute('crossorigin', '*');
            // @ts-ignore
            if (s0 && s0.parentNode) s0.parentNode.insertBefore(s1, s0);
        })();
    }, []);

    const toggleChat = () => {
        // @ts-ignore
        if (window.Tawk_API) {
            // @ts-ignore
            window.Tawk_API.toggle();
        }
    };

    if (!isLoaded) return null; // Don't show button until chat is ready

    return (
        <button
            onClick={toggleChat}
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#961c18] text-white rounded-full shadow-lg hover:bg-[#7a1714] transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#961c18] animate-bounce-slow group"
            aria-label="Open Live Chat"
        >
            <FaComments size={28} />
            <span className="absolute -top-2 -right-2 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
            </span>
        </button>
    );
};
