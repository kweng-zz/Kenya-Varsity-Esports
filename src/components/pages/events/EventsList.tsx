"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Trophy, Ticket, ChevronDown } from "lucide-react";

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
    <section className="bg-black w-full py-16 px-4 md:px-8">
      <div className="container mx-auto">
        {/* Header and Filter */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-12 gap-6 border-b border-gray-800 pb-4">
            <h2 className="text-3xl md:text-5xl font-black italic uppercase text-white tracking-tighter">
                Upcoming <span className="text-[#E73138]">Events</span>
            </h2>
            
            <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveTab(cat)}
                        className={`text-xs md:text-sm font-bold uppercase px-4 py-2 skew-x-[-12deg] transition-colors border ${
                            activeTab === cat 
                            ? "bg-[#E73138] border-[#E73138] text-white" 
                            : "bg-[#1A1A1A] border-transparent text-gray-400 hover:text-white hover:bg-[#252525]"
                        }`}
                    >
                        <span className="skew-x-[12deg] block">{cat}</span>
                    </button>
                ))}
            </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-400 text-lg">Loading events...</p>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-400 text-lg">No events found.</p>
                <p className="text-gray-500 text-sm mt-2">Check back soon for upcoming events!</p>
              </div>
            ) : (
              filteredEvents.map((event) => (
                <EventCard key={event.$id} event={event} />
              ))
            )}
        </div>

        {/* Load More */}
        <div className="flex flex-col items-center justify-center">
            <span className="text-white text-xs font-bold tracking-[0.2em] mb-2 uppercase">Load More Events</span>
            <button className="text-[#E73138] hover:text-white transition-colors animate-bounce">
                <ChevronDown size={32} />
            </button>
        </div>
      </div>
    </section>
  );
}

const EventCard = ({ event }: { event: Event }) => {
    return (
        <div className="group relative bg-[#0F0F0F] border border-gray-800 hover:border-[#E73138] transition-all duration-300 flex flex-col h-full">
            {/* Image Container */}
            <div className="relative h-48 overflow-hidden">
                {/* Status Badge */}
                <div className="absolute top-0 right-0 z-10">
                    <span className={`inline-block py-1 px-3 text-[10px] font-bold uppercase text-white skew-x-0 ${
                        event.status === 'OPEN' ? 'bg-[#E73138]' : 
                        event.status === 'LEAGUE' ? 'bg-[#E73138]' : 'bg-[#E73138]'
                    }`}>
                        {event.status}
                    </span>
                 </div>
                 
                 {/* Image */}
                 <div 
                    className="w-full h-full bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-105"
                    style={{ backgroundImage: `url('${event.image}')` }}
                 >
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] to-transparent opacity-80" />
                 </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-black italic uppercase text-white mb-4 leading-tight">
                    {event.title}
                </h3>

                <div className="space-y-3 mb-6 flex-grow">
                    <div className="flex items-center gap-3 text-gray-400 text-xs font-medium uppercase tracking-wide">
                        <Calendar size={14} className="text-[#E73138]" />
                        <span>{event.date} • {event.time}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400 text-xs font-medium uppercase tracking-wide">
                        <Trophy size={14} className="text-[#E73138]" />
                        <span>{event.prizePool}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400 text-xs font-medium uppercase tracking-wide">
                        <Ticket size={14} className="text-[#E73138]" />
                        <span>Entries: {event.entryFee}</span>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="mt-auto">
                    {event.status === 'PRO' ? (
                        <div className="w-full text-center py-3 bg-[#1A1A1A] border border-gray-700 text-gray-300 text-xs font-bold uppercase tracking-wider group-hover:bg-[#252525] transition-colors cursor-pointer flex items-center justify-center gap-2">
                           View Details
                        </div>
                    ) : (
                         <Button className="w-full bg-[#E73138] hover:bg-[#c42127] text-white font-bold uppercase tracking-wider rounded-none h-12 skew-x-[-12deg] group-hover:shadow-[0_0_15px_rgba(231,49,56,0.5)] transition-all">
                             <span className="skew-x-[12deg]">Register Now</span>
                         </Button>
                    )}
                   
                </div>
            </div>
            
            {/* Corner Checks */}
             <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#E73138] opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#E73138] opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
    );
}
