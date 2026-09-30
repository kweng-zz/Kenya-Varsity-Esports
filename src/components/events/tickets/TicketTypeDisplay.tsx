"use client";

import React from 'react';
import { CheckCircle } from 'lucide-react';

interface TicketTypeDisplayProps {
  ticketTypes: Array<{
    $id: string;
    name: string;
    description?: string;
    price: number;
    originalPrice: number;
    benefits: string[];
    color: string;
    isFeatured: boolean;
    quantityTotal: number;
    quantitySold: number;
  }>;
  currency: string;
  className?: string;
}

export default function TicketTypeDisplay({
  ticketTypes,
  currency = 'KES',
  className = '',
}: TicketTypeDisplayProps) {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!ticketTypes.length) return null;

  return (
    <div className={`space-y-4 ${className}`}>
      {ticketTypes.map((ticketType) => {
        const available = ticketType.quantityTotal - ticketType.quantitySold;
        const isSoldOut = available <= 0;
        
        return (
          <div
            key={ticketType.$id}
            className={`relative p-5 border-2 transition-all duration-300 ${
              ticketType.isFeatured
                ? 'border-[#8c110d] bg-[#8c110d]/5'
                : 'border-gray-800 hover:border-gray-700'
            } ${isSoldOut ? 'opacity-60' : ''}`}
            style={{ borderColor: ticketType.isFeatured ? ticketType.color : undefined }}
          >
            {ticketType.isFeatured && (
              <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-[#8c110d] text-white text-[10px] font-black uppercase tracking-[0.1em]">
                Recommended
              </div>
            )}

            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-black text-white text-lg uppercase">{ticketType.name}</h4>
                  {ticketType.originalPrice > ticketType.price && (
                    <span className="text-green-400 text-xs font-black uppercase tracking-[0.1em]">
                      Save {formatPrice(ticketType.originalPrice - ticketType.price)}
                    </span>
                  )}
                </div>
                {ticketType.description && (
                  <p className="text-gray-400 text-sm mb-3">{ticketType.description}</p>
                )}
                {ticketType.benefits.length > 0 && (
                  <ul className="space-y-1 text-sm text-gray-300">
                    {ticketType.benefits.slice(0, 5).map((benefit, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-[#8c110d] flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                    {ticketType.benefits.length > 5 && (
                      <li className="text-xs text-gray-500 pl-6">
                        +{ticketType.benefits.length - 5} more benefits
                      </li>
                    )}
                  </ul>
                )}
              </div>

              <div className="flex flex-col items-end gap-1">
                <div className="text-right">
                  <span className="text-2xl font-black text-white">
                    {formatPrice(ticketType.price)}
                  </span>
                  {ticketType.originalPrice > ticketType.price && (
                    <div className="text-xs text-gray-500 line-through">
                      {formatPrice(ticketType.originalPrice)}
                    </div>
                  )}
                  <span className="text-xs text-gray-500">per ticket</span>
                </div>
                
                <div className="text-xs text-gray-400">
                  {isSoldOut ? 'Sold Out' : `${available} remaining`}
                </div>
              </div>
            </div>

            <div className="h-2 bg-gray-800 rounded overflow-hidden">
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, (ticketType.quantitySold / ticketType.quantityTotal) * 100)}%`,
                  backgroundColor: ticketType.color,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}