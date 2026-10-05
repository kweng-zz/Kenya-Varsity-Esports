"use client";

import React, { useState, useEffect } from 'react';
import { Ticket, Loader2 } from 'lucide-react';
import TicketPurchaseModal from './TicketPurchaseModal';

interface PurchaseTicketButtonProps {
  eventId: string;
  eventTitle: string;
  eventSlug?: string;
  userId?: string;
  userEmail?: string;
  userName?: string;
  userPhone?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export default function PurchaseTicketButton({
  eventId,
  eventTitle,
  eventSlug,
  userId,
  userEmail,
  userName,
  userPhone,
  className = '',
  variant = 'primary',
  size = 'md',
}: PurchaseTicketButtonProps) {
  const [hasTickets, setHasTickets] = useState(false);
  const [startingPrice, setStartingPrice] = useState<number | null>(null);
  const [currency, setCurrency] = useState('KES');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    checkTicketAvailability();
  }, [eventId, eventSlug]);

  const checkTicketAvailability = async () => {
    try {
      // Always use eventId for ticket lookup since the API supports it
      // eventSlug from external events is just a placeholder ("external")
      const response = await fetch(`/api/events/${eventId}/tickets`);
      const data = await response.json();
      
      if (data.success && data.data.ticketTypes.length > 0) {
        setHasTickets(true);
        const minPrice = Math.min(...data.data.ticketTypes.map((t: any) => t.price));
        setStartingPrice(minPrice);
        setCurrency(data.data.eventTicket.currency);
      } else {
        setHasTickets(false);
      }
    } catch {
      setHasTickets(false);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const baseStyles = 'inline-flex items-center gap-2 font-black uppercase tracking-wider transition-all duration-300';
  
  const variantStyles = {
    primary: 'bg-gradient-to-r from-[#8c110d] to-[#b91c17] text-white hover:from-[#b91c17] hover:to-[#8c110d] hover:shadow-lg hover:shadow-[#8c110d]/50',
    secondary: 'bg-black border-2 border-gray-700 text-gray-300 hover:border-[#8c110d] hover:text-white',
    outline: 'bg-transparent border-2 border-[#8c110d] text-[#8c110d] hover:bg-[#8c110d] hover:text-white',
  };

  const sizeStyles = {
    sm: 'px-3 py-2 text-xs',
    md: 'px-5 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  if (loading) {
    return (
      <button className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`} disabled>
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Loading...</span>
      </button>
    );
  }

  if (!hasTickets) {
    return null;
  }

  const handleClick = () => {
    if (!userId || !userEmail || !userName) {
      // Redirect to login or show auth required
      window.location.href = `/login?redirect=/events/${eventId}`;
      return;
    }
    setModalOpen(true);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className} ${(!userId || !userEmail || !userName) ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <Ticket className="w-4 h-4" />
        <span>Get Tickets</span>
        {startingPrice && (
          <span className="px-2 py-0.5 bg-black/30 rounded text-[10px] font-black">
            from {formatPrice(startingPrice)}
          </span>
        )}
      </button>

      <TicketPurchaseModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        eventId={eventId}
        eventTitle={eventTitle}
        userId={userId!}
        userEmail={userEmail!}
        userName={userName!}
        userPhone={userPhone}
      />
    </>
  );
}