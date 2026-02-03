'use client';

import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

export const WhatsAppWidget = () => {
    // Default to a placeholder if not set
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254700000000';
    const message = encodeURIComponent('Hi, I am contacting you from the Tunza Esports website.');
    
    // Using KVE Brand Red #961c18 instead of WhatsApp Green
    return (
        <a
            href={`https://wa.me/${phoneNumber}?text=${message}`}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#961c18] text-white rounded-full shadow-lg hover:bg-[#7a1714] transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#961c18] animate-bounce-slow"
            aria-label="Chat on WhatsApp"
        >
            <FaWhatsapp size={32} />
            <span className="absolute -top-2 -right-2 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
            </span>
        </a>
    );
};
