"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PurchaseTicketButton } from "@/components/events/tickets";

interface FeaturedEvent {
  $id?: string;
  title: string;
  image: string;
  date: string;
  time: string;
  prizePool: string;
  gameSlug: string;
  registrationLink?: string;
  isExternal?: boolean;
  externalUrl?: string;
  hasTickets?: boolean;
  ticketStartingPrice?: number;
  ticketCurrency?: string;
}

export default function EventsHero() {
  const [featuredEvent, setFeaturedEvent] = useState<FeaturedEvent | null>(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    mins: 0,
  });

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await fetch('/api/events/featured');
        const data = await response.json();
        if (data.success) {
          setFeaturedEvent(data.data);
        }
      } catch (error) {
        console.error('Error fetching featured event:', error);
      }
    };
    fetchFeatured();
  }, []);

  useEffect(() => {
    if (!featuredEvent) return;

    const calculateTimeLeft = () => {
      const eventDateStr = `${featuredEvent.date} ${featuredEvent.time}`;
      const eventDate = new Date(eventDateStr);
      const now = new Date();
      
      // If date parsing fails or date is in the past, don't show negative
      if (isNaN(eventDate.getTime())) {
        setTimeLeft({ days: 0, hours: 0, mins: 0 });
        return;
      }

      const difference = eventDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          mins: Math.floor((difference / 1000 / 60) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, mins: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(timer);
  }, [featuredEvent]);

  const displayTitle = featuredEvent ? featuredEvent.title : "Join Your Institution's Esports Legacy";
  const displayImage = featuredEvent ? featuredEvent.image : "/images/hero-bg.jpg";
  const displayPrize = featuredEvent ? featuredEvent.prizePool : "KSH 500,000+";

  const renderTitle = () => {
    if (featuredEvent) {
      const parts = displayTitle.split(':');
      if (parts.length > 1) {
        return (
          <>
            <span className="block">{parts[0]}</span>
            <span className="block text-[#8c110d]">{parts[1]}</span>
          </>
        );
      }
      return <span className="block">{displayTitle}</span>;
    }
    return (
      <>
        <span className="block">Join Your</span>
        <span className="block text-[#8c110d]">Institution&apos;s</span>
        <span className="block">Esports Legacy</span>
      </>
    );
  };

  return (
    <section className="relative w-full min-h-[90vh] flex items-center bg-[#080808] overflow-hidden">
      {/* Background Image with brutalist overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${displayImage}')`, filter: "brightness(0.3)" }} 
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      {/* Neo-brutalist accent elements */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-40 bg-[#8c110d] opacity-80 transform rotate-12" />
        <div className="absolute top-28 left-20 w-32 h-2 bg-[#8c110d] opacity-60 transform -rotate-12" />
        <div className="absolute bottom-32 right-16 w-2 h-28 bg-[#8c110d] opacity-70 transform -rotate-6" />
        <div className="absolute bottom-40 right-8 w-28 h-2 bg-[#8c110d] opacity-50 transform rotate-12" />
        <div className="absolute top-0 left-0 w-80 h-80 bg-[#8c110d] opacity-10 blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#8c110d] opacity-[0.08] blur-[100px]" />
        
        {/* Corner frame accents */}
        <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-[#8c110d]/40" />
        <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-[#8c110d]/40" />
        <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-[#8c110d]/40" />
        <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-[#8c110d]/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
        {/* Featured Tag — Brutalist */}
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 px-6 py-3 bg-[#8c110d] text-white text-xs font-black uppercase tracking-[0.3em]">
            <span className="w-2 h-2 bg-white animate-pulse" />
            {featuredEvent?.isExternal ? "Featured Event" : "Featured Tournament"}
          </span>
        </div>

        {/* Main Heading — Dramatic Typography */}
        <h1 className="text-5xl md:text-3xl lg:text-4xl xl:text-7xl font-black uppercase leading-none tracking-tight text-white mb-8 max-w-5xl">
          {renderTitle()}
        </h1>

        {/* Subtitle with brutalist accent */}
        <div className="relative max-w-2xl mb-12">
          <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-[#8c110d] to-transparent" />
          <p className="text-gray-300 text-lg md:text-xl pl-6 leading-relaxed">
            {featuredEvent?.isExternal 
              ? `Check out this premier external event. Join the wider community and experience the excitement!`
              : `Compete in the premier university esports league. Earn your spot among the legends and win from a pool of `}
            {!featuredEvent?.isExternal && <span className="font-black text-white">{displayPrize}</span>}
          </p>
        </div>

        {/* Countdown Timer — Brutalist Boxes */}
        <div className="flex gap-4 mb-12">
          <CountdownBox value={timeLeft.days} label="DAYS" />
          <CountdownBox value={timeLeft.hours} label="HRS" />
          <CountdownBox value={timeLeft.mins} label="MINS" />
        </div>

        {/* Buttons — Brutalist Style */}
        <div className="flex flex-col sm:flex-row gap-4">
          {featuredEvent?.isExternal ? (
            <a href={featuredEvent.externalUrl} target="_blank" rel="noopener noreferrer">
              <button className="group inline-flex items-center px-10 py-5 bg-gradient-to-r from-[#8c110d] to-[#b91c17] hover:from-[#b91c17] hover:to-[#8c110d] text-white font-black text-sm uppercase tracking-wider transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-[#8c110d]/50">
                <span>View Event</span>
                <svg className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </button>
            </a>
          ) : (
            <>
              {featuredEvent?.hasTickets && (
                <PurchaseTicketButton
                  eventId={featuredEvent.$id || ''}
                  eventTitle={featuredEvent.title}
                  eventSlug={featuredEvent.gameSlug}
                  variant="primary"
                  size="lg"
                />
              )}
              <Link href={featuredEvent?.registrationLink || "/tournament-registration"}>
                <button className="group inline-flex items-center px-10 py-5 bg-gradient-to-r from-[#8c110d] to-[#b91c17] hover:from-[#b91c17] hover:to-[#8c110d] text-white font-black text-sm uppercase tracking-wider transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-[#8c110d]/50">
                  <span>Register Now</span>
                  <svg className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </Link>
            </>
          )}
          
          {!featuredEvent?.isExternal && (
            <Link href={featuredEvent ? `/games/${featuredEvent.gameSlug}/information` : "#"}>
              <button className="inline-flex items-center px-10 py-5 bg-black border-2 border-gray-600 hover:border-[#8c110d] text-white font-black text-sm uppercase tracking-wider transition-all duration-300 transform hover:scale-105">
                View Details
              </button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

const CountdownBox = ({ value, label }: { value: number; label: string }) => (
  <div className="group relative">
    <div className="absolute -inset-1 border border-[#8c110d]/20 transform rotate-2 opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="relative border-2 border-gray-700 bg-black/60 backdrop-blur-sm p-4 w-20 h-20 md:w-24 md:h-24 flex flex-col items-center justify-center transition-all duration-300 group-hover:border-[#8c110d]">
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#8c110d]" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#8c110d]" />
      <span className="text-white text-3xl md:text-4xl font-black leading-none mb-1">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-[#8c110d] text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">{label}</span>
    </div>
  </div>
);
