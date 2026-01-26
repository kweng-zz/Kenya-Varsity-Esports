"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Zap } from "lucide-react";
import { eventsService, Event } from "@/lib/services/eventsService";

export default function EventsHero() {
  const [featuredEvent, setFeaturedEvent] = useState<Event | null>(null);
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
      // Parse date like "JANUARY 20, 2026" and time like "18:00"
      const eventDate = new Date(`${featuredEvent.date} ${featuredEvent.time}`);
      const now = new Date();
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

  // Use featured event data or fall back to static if none found
  const displayTitle = featuredEvent ? featuredEvent.title : "Join Your Institution's Esports Legacy";
  const displayImage = featuredEvent ? featuredEvent.image : "/images/hero-bg.jpg";
  const displayPrize = featuredEvent ? featuredEvent.prizePool : "KSH 500,000+";
  const displaySubtitle = featuredEvent 
    ? `Compete in the premier university esports league. Earn your spot among the legends and win from a pool of `
    : `Compete in the premier university esports league. Earn your spot among the legends and win from a pool of `;

  // Format title if it's the custom one (splitting into spans)
  const renderTitle = () => {
    if (featuredEvent) {
      const parts = displayTitle.split(':');
      if (parts.length > 1) {
        return (
          <>
            <span className="block">{parts[0]}</span>
            <span className="block text-[#E73138]">{parts[1]}</span>
          </>
        );
      }
      return <span className="block">{displayTitle}</span>;
    }
    return (
      <>
        <span className="block">Join Your</span>
        <span className="block text-[#E73138]">Institution's</span>
        <span className="block">Esports</span>
        <span className="block">Legacy</span>
      </>
    );
  };

  return (
    <section className="relative w-full min-h-[85vh] flex items-center bg-black overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${displayImage}')`, filter: "brightness(0.4)" }} 
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
      </div>

      <div className="container relative z-10 mx-auto px-2 sm:px-4 lg:px-6 flex flex-col justify-center h-full pt-20 left-0">
        
        {/* Featured Tag */}
        <div className="mb-6">
          <span className="bg-[#E73138] text-white text-xs font-bold px-3 py-1 uppercase tracking-wider transform -skew-x-12 inline-block">
            Featured Tournament
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-white text-5xl md:text-7xl lg:text-8xl font-bold uppercase leading-none tracking-tight mb-6 max-w-4xl">
          {renderTitle()}
        </h1>

        {/* Subtitle */}
        <p className="text-gray-300 text-lg md:text-xl max-w-2xl mb-10 font-light">
          {displaySubtitle} <span className="font-bold text-white">{displayPrize}</span>.
        </p>

        {/* Countdown Timer */}
        <div className="flex gap-4 mb-10">
          <CountdownBox value={timeLeft.days} label="DAYS" />
          <CountdownBox value={timeLeft.hours} label="HRS" />
          <CountdownBox value={timeLeft.mins} label="MINS" />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href={featuredEvent?.registrationLink || "/tournament-registration"}>
            <Button className="h-12 px-8 bg-[#E73138] hover:bg-[#c42127] text-white font-bold uppercase tracking-wider skew-x-[-10deg] rounded-none group transition-all">
              <div className="skew-x-[10deg] flex items-center gap-2">
                Register Now <Zap size={18} fill="currentColor" />
              </div>
            </Button>
          </Link>
          <Link href={featuredEvent ? `/games/${featuredEvent.gameSlug}/information` : "#"}>
            <Button variant="outline" className="h-12 px-8 border-gray-500 text-white hover:bg-white/10 hover:text-white hover:border-white font-bold uppercase tracking-wider skew-x-[-10deg] rounded-none bg-transparent whitespace-nowrap">
               <div className="skew-x-[10deg]">View Details</div>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

const CountdownBox = ({ value, label }: { value: number; label: string }) => (
  <div className="border border-white/20 bg-black/40 backdrop-blur-sm p-3 w-16 h-16 md:w-20 md:h-20 flex flex-col items-center justify-center">
    <span className="text-white text-2xl md:text-3xl font-bold leading-none mb-1">
      {value.toString().padStart(2, '0')}
    </span>
    <span className="text-gray-400 text-[10px] md:text-xs uppercase tracking-wider">{label}</span>
  </div>
);
