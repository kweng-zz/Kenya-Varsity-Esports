"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Zap } from "lucide-react";

export default function EventsHero() {
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    mins: 45,
  });

  useEffect(() => {
    // Simple countdown simulation or real calculation
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.mins > 0) return { ...prev, mins: prev.mins - 1 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, mins: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, mins: 59 };
        return prev;
      });
    }, 60000); // Update every minute to avoid too many renders for seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full min-h-[85vh] flex items-center bg-black overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/hero-bg.jpg')", filter: "brightness(0.4)" }} 
      >
        {/* Placeholder for actual background if not available, falling back to dark color */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
      </div>

      <div className="container relative z-10 mx-auto px-2 sm:px-4 lg:px-6 flex flex-col justify-center h-full pt-20 left-0">
        
        {/* Featured Tag */}
        <div className="mb-6">
          <span className="bg-[#E73138] text-white text-xs font-bold px-3 py-1 uppercase tracking-wider italic transform -skew-x-12 inline-block">
            Featured Tournament
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="font-['Hind',Helvetica] text-white text-5xl md:text-7xl lg:text-8xl font-black italic uppercase leading-none tracking-tighter mb-6 max-w-4xl">
          <span className="block">Join Your</span>
          <span className="block text-[#E73138]">Institution's</span>
          <span className="block">Esports</span>
          <span className="block">Legacy</span>
        </h1>

        {/* Subtitle */}
        <p className="text-gray-300 text-lg md:text-xl max-w-2xl mb-10 font-light">
          Compete in the premier university esports league. Earn your spot among the legends and win from a pool of <span className="font-bold text-white">KSH 500,000+</span>.
        </p>

        {/* Countdown Timer */}
        <div className="flex gap-4 mb-10">
          <CountdownBox value={timeLeft.days} label="DAYS" />
          <CountdownBox value={timeLeft.hours} label="HRS" />
          <CountdownBox value={timeLeft.mins} label="MINS" />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button className="h-12 px-8 bg-[#E73138] hover:bg-[#c42127] text-white font-bold uppercase tracking-wider skew-x-[-10deg] rounded-none group transition-all">
            <div className="skew-x-[10deg] flex items-center gap-2">
              Register Now <Zap size={18} fill="currentColor" />
            </div>
          </Button>
          <Button variant="outline" className="h-12 px-8 border-gray-500 text-white hover:bg-white/10 hover:text-white hover:border-white font-bold uppercase tracking-wider skew-x-[-10deg] rounded-none bg-transparent">
             <div className="skew-x-[10deg]">View Bracket</div>
          </Button>
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
