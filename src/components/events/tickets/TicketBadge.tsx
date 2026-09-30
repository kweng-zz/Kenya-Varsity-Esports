"use client";

import React from 'react';
import { Ticket } from 'lucide-react';

interface TicketBadgeProps {
  hasTickets: boolean;
  startingPrice?: number;
  currency?: string;
  onClick?: () => void;
  className?: string;
}

export default function TicketBadge({
  hasTickets,
  startingPrice,
  currency = 'KES',
  onClick,
  className = '',
}: TicketBadgeProps) {
  if (!hasTickets) return null;

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#8c110d] to-[#b91c17] text-white text-xs font-black uppercase tracking-wider transition-all duration-300 hover:from-[#b91c17] hover:to-[#8c110d] hover:shadow-lg hover:shadow-[#8c110d]/50 ${className}`}
      disabled={!onClick}
    >
      <Ticket className="w-3 h-3" />
      <span>Get Tickets</span>
      {startingPrice && (
        <span className="ml-1 px-2 py-0.5 bg-black/30 rounded text-[10px] font-black">
          from {formatPrice(startingPrice)}
        </span>
      )}
    </button>
  );
}