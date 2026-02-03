"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image'; // Import Next.js Image component
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSeason } from '@/hooks/useSeason';



// Define an interface for the TimeLeft object to give it a clear structure
interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const HeroSection: React.FC = () => {
// Array of images for the hero banner
  const bannerImages = [
    {
      src: "/images/eFOOTBALL-CTA-Rankings.webp",
      alt: "Join Your University",
    },
    {
      src: "/images/Tournament-page.webp",
      alt: "Join Your University",
    },
    
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handlePreviousImage = () => {
    if (isTransitioning) return; // Prevent rapid clicking
    
    setIsTransitioning(true);
    setTimeout(() => {
      if (currentImageIndex > 0 && bannerImages.length > 1) {
        setCurrentImageIndex((prev) => 
          prev === 0 ? bannerImages.length - 1 : prev - 1
        );
      }
      setIsTransitioning(false);
    }, 150);
  };

  const handleNextImage = () => {
    if (isTransitioning) return; // Prevent rapid clicking
    
    setIsTransitioning(true);
    setTimeout(() => {
      if (currentImageIndex < bannerImages.length - 1 && bannerImages.length > 1) {
        setCurrentImageIndex((prev) => 
          prev === bannerImages.length - 1 ? 0 : prev + 1
        );
      }
      setIsTransitioning(false);
    }, 150);
  };

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    if (bannerImages.length <= 1) return;
    
    const autoRotate = setInterval(() => {
      if (!isTransitioning) {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentImageIndex((prev) => 
            prev === bannerImages.length - 1 ? 0 : prev + 1
          );
          setIsTransitioning(false);
        }, 150);
      }
    }, 10000);

    return () => clearInterval(autoRotate);
  }, [bannerImages.length, isTransitioning]);

  // Countdown timer logic (for "SEASON 3 IN" section)
  const calculateTimeLeft = (targetDate: string | Date): TimeLeft => { // Explicitly define return type
    const difference = +new Date(targetDate) - +new Date(); // Target for January Season Registration
    let timeLeft: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 }; // Initialize with default values

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  // Initialize useState with default values to prevent hydration mismatch
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const { registrationStartDate, currentSeason, loading: seasonLoading } = useSeason();

  useEffect(() => {
    // Set client flag and initial time
    setIsClient(true);
    
    const targetDate = registrationStartDate || "2026-02-01T00:00:00";
    setTimeLeft(calculateTimeLeft(targetDate));

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [registrationStartDate]); // Depend on registrationStartDate

  return (
    <section className="w-full bg-black py-16 md:py-24 relative">
      {/* Background images */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Left background image */}
        <img
          className="absolute top-105 left-20 w-2/4 h-2/4 object-contain -translate-x-1/2 -translate-y-1/2"
          alt="Background Left"
          src="/images/Mask Group.png"
        />
        
        {/* Right background image - inverted */}
        <img
          className="absolute top-105 right-20 w-2/4 h-2/4 object-contain translate-x-1/2 -translate-y-1/2 scale-x-[-1]"
          alt="Background Right"
          src="/images/Mask Group.png"
        />
      </div>
      
      <div className="container mx-auto px-4 flex flex-col items-center relative z-10">
        {/* Main Hero Image Section with Navigation */}
        <div className="relative w-full max-w-4xl rounded-lg overflow-hidden shadow-xl mb-16">
          {/* Image Container with Fade Animation */}
          <div className="relative">
            {bannerImages.map((image, index) => (
              <Image
                key={index}
                src={image.src}
                alt={image.alt}
                width={1200}
                height={600}
                className={`w-full h-auto transition-all duration-700 ease-in-out transform ${
                  index === currentImageIndex 
                    ? 'opacity-100 scale-100' 
                    : 'opacity-0 scale-105 absolute inset-0'
                }`}
                quality={90}
                priority={index === 0}
              />
            ))}
            
            {/* Transition Overlay */}
            <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${
              isTransitioning ? 'opacity-20' : 'opacity-0'
            }`} />
          </div>
          
          {/* Navigation Chevrons - Bottom Left Corner */}
          <div className="absolute bottom-4 left-4 flex gap-2">
            <button
              onClick={handlePreviousImage}
              className={`w-10 h-10 border-2 border-transparent flex items-center justify-center transition-colors duration-200 ${
                currentImageIndex === 0 || bannerImages.length === 1
                  ? 'bg-gray-700/50 cursor-not-allowed'
                  : 'bg-black/50 hover:bg-black/70'
              }`}
              aria-label="Previous image"
              disabled={currentImageIndex === 0 || bannerImages.length === 1}
            >
              <ChevronLeft className={`w-5 h-5 ${
                currentImageIndex === 0 || bannerImages.length === 1
                  ? 'text-gray-700'
                  : 'text-white'
              }`} />
            </button>
            <button
              onClick={handleNextImage}
              className={`w-10 h-10 border-2 border-transparent flex items-center justify-center transition-colors duration-200 ${
                currentImageIndex === bannerImages.length - 1 || bannerImages.length === 1
                  ? 'bg-gray-700/50 cursor-not-allowed'
                  : 'bg-black/50 hover:bg-black/70'
              }`}
              aria-label="Next image"
              disabled={currentImageIndex === bannerImages.length - 1 || bannerImages.length === 1}
            >
              <ChevronRight className={`w-5 h-5 ${
                currentImageIndex === bannerImages.length - 1 || bannerImages.length === 1
                  ? 'text-gray-700'
                  : 'text-white'
              }`} />
            </button>
          </div>
        </div>

        {/* Bottom Section: KVE ESPORTS RANKINGS & Countdown */}
        <div className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-between mt-8 ">
          {/* Left: KVE Logo and Text */}
          <div className="flex items-center mb-8 md:mb-0">
            <div className="w-32 h-32 mr-4">
              <Image
                src="/images/KVE white no words.png"
                alt="KVE Logo"
                width={80}
                height={80}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <p className="text-red-600/50 text-2xl font-bold tracking-wide">KENYA VARSITY ESPORTS</p>
             
              <p className="text-[#AAAAAA] text-sm">Founded August 2024</p>
            </div>
          </div>

          {/* Vertical Separator */}
          <div className="hidden md:block w-px h-20 bg-gray-600 mx-8"></div>

          {/* Right: SEASON 3 IN Countdown */}
          <div className="text-center md:text-right">
            <h2 className="text-white text-[32px] font-bold tracking-wider mb-2 mr-8">
              S{currentSeason || 3} REGISTERING
            </h2>
            <div className="flex justify-center md:justify-end">
              {/* Only render timer after client hydration */}
              {!isClient ? (
                <div className="flex">
                  <div className="flex flex-col items-center mx-2">
                    <span className="text-red-600/50 text-[40px] font-bold">--</span>
                    <span className="text-[#AAAAAA] text-sm uppercase">Days</span>
                  </div>
                  <div className="flex flex-col items-center mx-2">
                    <span className="text-red-600/50 text-[40px] font-bold">--</span>
                    <span className="text-[#AAAAAA] text-sm uppercase">Hours</span>
                  </div>
                  <div className="flex flex-col items-center mx-2">
                    <span className="text-red-600/50 text-[40px] font-bold">--</span>
                    <span className="text-[#AAAAAA] text-sm uppercase">Minutes</span>
                  </div>
                  <div className="flex flex-col items-center mx-2">
                    <span className="text-red-600/50 text-[40px] font-bold">--</span>
                    <span className="text-[#AAAAAA] text-sm uppercase">Seconds</span>
                  </div>
                </div>
              ) : Object.values(timeLeft).every(val => val === 0) ? (
                <span className="text-[#db2c2c] text-3xl font-bold">Time&apos;s up!</span>
              ) : (
                <>
                  <div className="flex flex-col items-center mx-2">
                    <span className="text-red-600/50 text-[40px] font-bold">{String(timeLeft.days).padStart(2, '0')}</span>
                    <span className="text-[#AAAAAA] text-sm uppercase">Days</span>
                  </div>
                  <div className="flex flex-col items-center mx-2">
                    <span className="text-red-600/50 text-[40px] font-bold">{String(timeLeft.hours).padStart(2, '0')}</span>
                    <span className="text-[#AAAAAA] text-sm uppercase">Hours</span>
                  </div>
                  <div className="flex flex-col items-center mx-2">
                    <span className="text-red-600/50 text-[40px] font-bold">{String(timeLeft.minutes).padStart(2, '0')}</span>
                    <span className="text-[#AAAAAA] text-sm uppercase">Minutes</span>
                  </div>
                  <div className="flex flex-col items-center mx-2">
                    <span className="text-red-600/50 text-[40px] font-bold">{String(timeLeft.seconds).padStart(2, '0')}</span>
                    <span className="text-[#AAAAAA] text-sm uppercase">Seconds</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;