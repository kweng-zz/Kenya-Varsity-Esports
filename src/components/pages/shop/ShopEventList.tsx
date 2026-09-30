"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PurchaseTicketButton } from "@/components/events/tickets";
import { useAuth } from "@/contexts/AuthContext";

interface Event {
  $id: string;
  title: string;
  gameSlug: string;
  image: string;
  date: string;
  time: string;
  prizePool: string;
  entryFee: string;
  status: 'OPEN' | 'LEAGUE' | 'PRO';
  tags: string[];
  registrationLink?: string;
  detailsLink?: string;
  isActive: boolean;
  isExternal?: boolean;
  externalUrl?: string;
  hasTickets?: boolean;
  ticketStartingPrice?: number;
  ticketCurrency?: string;
  venue?: string;
  description?: string;
}

export default function ShopEventList() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/events');
      const data = await response.json();
      
      if (data.success) {
        // Filter only events that have tickets available
        const eventsWithTickets = data.data.filter((e: Event) => e.hasTickets && e.isActive);
        setEvents(eventsWithTickets);
      }
    } catch (error) {
      console.error('Error loading shop events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number | undefined, currency: string) => {
    if (!price) return '';
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <section className="bg-[#080808] w-full py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto text-center py-20">
          <div className="inline-block border-2 border-gray-800 p-12">
            <div className="w-8 h-8 border-2 border-[#8c110d] border-t-transparent animate-spin mx-auto mb-4" />
            <p className="text-gray-400 font-black text-sm uppercase tracking-wider">Loading shop...</p>
          </div>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section className="bg-[#080808] w-full py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto text-center py-20">
          <div className="relative inline-block">
            <div className="absolute -inset-3 border border-[#8c110d]/20 transform rotate-1" />
            <div className="relative border-2 border-gray-800 p-12 bg-black">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#8c110d]" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#8c110d]" />
              <p className="text-gray-400 font-black text-lg uppercase tracking-tight mb-2">No Tickets Available</p>
              <p className="text-gray-500 text-sm">Check back soon for upcoming events with tickets!</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-[#080808] w-full py-20 px-4 md:px-8 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-40 left-10 w-2 h-28 bg-[#8c110d] opacity-50 transform rotate-12" />
        <div className="absolute bottom-32 right-12 w-2 h-24 bg-[#8c110d] opacity-40 transform -rotate-6" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-8">
            <div>
              <span className="text-[#8c110d] font-black text-sm tracking-[0.3em] uppercase mb-3 block">TICKET SHOP</span>
              <h2 className="text-4xl md:text-5xl lg:text-5xl font-black uppercase tracking-tight text-white leading-none">
                <span className="block">Browse & Buy</span>
                <span className="block text-[#8c110d]">Event Tickets</span>
              </h2>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-[#8c110d] via-gray-800 to-transparent" />
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <ShopEventCard key={event.$id} event={event} index={index} user={user} />
          ))}
        </div>
      </div>
    </section>
  );
}

const ShopEventCard = ({ event, index, user }: { event: Event; index: number; user: any }) => {
  return (
    <div 
      className="group relative transform transition-all duration-500 hover:scale-105"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="absolute -inset-2 border border-[#8c110d]/20 transform rotate-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative bg-black border-2 border-gray-800 group-hover:border-[#8c110d] transition-all duration-500 flex flex-col h-full overflow-hidden">
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#8c110d] z-20" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#8c110d] opacity-0 group-hover:opacity-100 transition-opacity z-20" />
        
        {/* Image Container */}
        <div className="relative h-52 overflow-hidden">
          <div className="absolute top-3 right-3 z-10 flex gap-2">
            {event.isExternal && (
              <span className="inline-block py-1.5 px-3 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em]">
                External Event
              </span>
            )}
            <span className="inline-block py-1.5 px-4 bg-[#8c110d] text-white text-[10px] font-black uppercase tracking-[0.2em]">
              {event.isExternal ? 'EVENT' : event.status}
            </span>
          </div>
          
          <div 
            className="w-full h-full bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-110"
            style={{ backgroundImage: `url('${event.image}')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-black uppercase tracking-tight text-white mb-5 leading-tight group-hover:text-[#8c110d] transition-colors duration-300">
            {event.title}
          </h3>

          <div className="space-y-3 mb-6 flex-grow">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-[#8c110d]/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-[#8c110d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-gray-400 text-xs font-black uppercase tracking-wider">{event.date} • {event.time}</span>
            </div>
            {event.venue && (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-[#8c110d]/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-[#8c110d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-gray-400 text-xs font-black uppercase tracking-wider">{event.venue}</span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-[#8c110d]/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-[#8c110d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <span className="text-gray-400 text-xs font-black uppercase tracking-wider">{event.prizePool}</span>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-[#8c110d] via-gray-800 to-transparent mb-6" />

          {/* Purchase Section */}
          <div className="mt-auto space-y-3">
            {event.hasTickets && (
              <PurchaseTicketButton
                eventId={event.$id}
                eventTitle={event.title}
                eventSlug={event.gameSlug || "external"}
                userId={user?.$id}
                userEmail={user?.email}
                userName={user?.name}
                variant="primary"
                size="md"
                className="w-full"
              />
            )}
            
            <Link href={`/events/${event.$id}`} className="block">
              <div className="w-full text-center py-3 bg-gray-800 border-2 border-gray-700 hover:border-[#8c110d] text-gray-300 hover:text-white text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer">
                View Event Details
              </div>
            </Link>
            
            {event.externalUrl && (
              <a href={event.externalUrl} target="_blank" rel="noopener noreferrer" className="block">
                <div className="w-full text-center py-3 bg-gray-900 border-2 border-gray-800 hover:border-gray-700 text-gray-500 hover:text-gray-300 text-[10px] font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2">
                  View on External Site
                </div>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};