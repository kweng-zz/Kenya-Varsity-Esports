"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

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
}

export default function EventsList() {
  const [activeTab, setActiveTab] = useState("ALL TITLES");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const categories = ["ALL TITLES", "VALORANT", "FC 24", "CALL OF DUTY", "MOBILE LEGENDS"];

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/events');
      const data = await response.json();
      
      if (data.success) {
        setEvents(data.data);
      } else {
        console.error('Failed to fetch events');
      }
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = activeTab === "ALL TITLES" 
    ? events 
    : events.filter(e => e.tags.includes(activeTab));

  return (
    <section className="relative bg-[#080808] w-full py-20 px-4 md:px-8 overflow-hidden">
      {/* Background accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-40 left-10 w-2 h-28 bg-[#8c110d] opacity-50 transform rotate-12" />
        <div className="absolute bottom-32 right-12 w-2 h-24 bg-[#8c110d] opacity-40 transform -rotate-6" />
        <div className="absolute top-1/3 right-0 w-64 h-64 bg-[#8c110d] opacity-[0.04] blur-[100px]" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-[#8c110d] opacity-[0.06] blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header and Filter */}
        <div className="mb-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-8">
            <div>
              <span className="text-[#8c110d] font-black text-sm tracking-[0.3em] uppercase mb-3 block">BROWSE EVENTS</span>
              <h2 className="text-4xl md:text-5xl lg:text-5xl font-black uppercase tracking-tight text-white leading-none">
                <span className="block">Upcoming</span>
                <span className="block text-[#8c110d]">Events</span>
              </h2>
            </div>
            
            {/* Category tabs — Brutalist */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-5 py-3 font-black text-xs uppercase tracking-wider transition-all duration-300 border-2 ${
                    activeTab === cat 
                      ? "bg-[#8c110d] border-[#8c110d] text-white shadow-lg shadow-[#8c110d]/30" 
                      : "bg-black border-gray-700 text-gray-400 hover:border-[#8c110d] hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-[#8c110d] via-gray-800 to-transparent" />
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {loading ? (
            <div className="col-span-full text-center py-20">
              <div className="inline-block border-2 border-gray-800 p-12">
                <div className="w-8 h-8 border-2 border-[#8c110d] border-t-transparent animate-spin mx-auto mb-4" />
                <p className="text-gray-400 font-black text-sm uppercase tracking-wider">Loading events...</p>
              </div>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <div className="relative inline-block">
                <div className="absolute -inset-3 border border-[#8c110d]/20 transform rotate-1" />
                <div className="relative border-2 border-gray-800 p-12 bg-black">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#8c110d]" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#8c110d]" />
                  <p className="text-gray-400 font-black text-lg uppercase tracking-tight mb-2">No events found</p>
                  <p className="text-gray-500 text-sm">Check back soon for upcoming events!</p>
                </div>
              </div>
            </div>
          ) : (
            filteredEvents.map((event, index) => (
              <EventCard key={event.$id} event={event} index={index} />
            ))
          )}
        </div>

        {/* Load More — Brutalist */}
        <div className="flex flex-col items-center justify-center">
          <span className="text-gray-400 text-xs font-black tracking-[0.3em] mb-4 uppercase">Load More Events</span>
          <button className="group border-2 border-gray-700 hover:border-[#8c110d] p-3 transition-all duration-300 hover:shadow-lg hover:shadow-[#8c110d]/20">
            <ChevronDown size={24} className="text-[#8c110d] group-hover:translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}

const EventCard = ({ event, index }: { event: Event; index: number }) => {
  return (
    <div 
      className="group relative transform transition-all duration-500 hover:scale-105"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Offset border on hover */}
      <div className="absolute -inset-2 border border-[#8c110d]/20 transform rotate-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative bg-black border-2 border-gray-800 group-hover:border-[#8c110d] transition-all duration-500 flex flex-col h-full overflow-hidden">
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#8c110d] z-20" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#8c110d] opacity-0 group-hover:opacity-100 transition-opacity z-20" />
        
        {/* Image Container */}
        <div className="relative h-52 overflow-hidden">
          {/* Status Badge — Brutalist */}
          <div className="absolute top-3 right-3 z-10">
            <span className="inline-block py-1.5 px-4 bg-[#8c110d] text-white text-[10px] font-black uppercase tracking-[0.2em]">
              {event.status}
            </span>
          </div>
          
          {/* Image */}
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-gray-400 text-xs font-black uppercase tracking-wider">{event.date} • {event.time}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-[#8c110d]/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-[#8c110d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <span className="text-gray-400 text-xs font-black uppercase tracking-wider">{event.prizePool}</span>
            </div>

          </div>

          {/* Gradient bar */}
          <div className="h-px bg-gradient-to-r from-[#8c110d] via-gray-800 to-transparent mb-6" />

          {/* Footer Action — Brutalist */}
          <div className="mt-auto">
            {event.status === 'PRO' ? (
              <Link href={event.detailsLink || '#'} className="block">
                <div className="w-full text-center py-4 bg-black border-2 border-gray-700 hover:border-[#8c110d] text-gray-300 hover:text-white text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer">
                  View Details
                </div>
              </Link>
            ) : (
              <Link href="/tournament-registration" className="block">
                <div className="w-full text-center py-4 bg-gradient-to-r from-[#8c110d] to-[#b91c17] hover:from-[#b91c17] hover:to-[#8c110d] text-white text-xs font-black uppercase tracking-wider transition-all duration-300 transform hover:shadow-lg hover:shadow-[#8c110d]/50 cursor-pointer">
                  Register Now
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
