"use client";

import React, { useRef, useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

export const ShopSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  // Shop items data - expanded for better scrolling effect
  const shopItems = [
    { name: "GAMING MOUSE", price: "8K" },
    { name: "KEYBOARD PRO", price: "12K" },
    { name: "RAZOR HEADPHONE", price: "10K" },
    { name: "GAMING CHAIR", price: "25K" },
    { name: "MONITOR 27\"", price: "30K" },
    { name: "VR HEADSET", price: "50K" },
    { name: "WEBCAM HD", price: "5K" },
    { name: "CONTROLLER", price: "15K" },
  ];

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setIsAtStart(scrollLeft <= 0);
      setIsAtEnd(scrollLeft >= scrollWidth - clientWidth - 1); // -1 for rounding errors
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      checkScrollPosition();
      container.addEventListener('scroll', checkScrollPosition);
      return () => container.removeEventListener('scroll', checkScrollPosition);
    }
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="w-full py-24 bg-[#0c0e11e6] flex justify-center items-center">
      <div className="container mx-auto px-4 max-w-7xl">
        <header className="mb-16 text-center">
          <h2 className="font-['Hind',Helvetica] font-bold text-white text-3xl sm:text-[46px] tracking-[1.84px] mb-4">
            VISIT OUR SHOP
          </h2>
          <p className="font-['Hind',Helvetica] text-white text-base tracking-[0.64px]">
            Upgrade your gaming setup or your gaming account
          </p>
        </header>

        {/* Scrollable container with navigation */}
        <div className="relative">
          {/* Horizontal scrolling container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {shopItems.map((item, index) => (
              <div
                key={index}
                className="relative h-[250px] w-[250px] flex-shrink-0 overflow-hidden group cursor-pointer transition-transform duration-300 hover:scale-105"
              >
                {/* Default State (Grey background) - on mobile the details layer below is shown instead */}
                <div className="absolute inset-0 bg-[#c4c4c4] transition-opacity duration-300 opacity-0 md:opacity-100 md:group-hover:opacity-0">
                  {/* Default state background */}
                </div>

                {/* Hover State (Red background with product details) - Full card coverage */}
                <div className="absolute inset-0 bg-[#961c18] transition-opacity duration-300 flex flex-col items-center justify-center text-center p-4 opacity-100 md:opacity-0 md:group-hover:opacity-100">
                  <h3 className="font-['Hind',Helvetica] font-semibold text-white text-xl tracking-[0.96px] mb-2">
                    {item.name}
                  </h3>
                  <p className="font-['Hind',Helvetica] font-medium text-[#e3edf0] text-lg tracking-[0.72px]">
                    {item.price}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation buttons centered below cards */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={scrollLeft}
              className={`p-3 border border-transparent transition-all duration-300 backdrop-blur-sm ${
                isAtStart 
                  ? 'bg-red-800/30 text-gray-700 cursor-not-allowed' 
                  : 'bg-red-800/30 hover:bg-black/70 text-white hover:border-white/40 hover:scale-110'
              }`}
              aria-label="Scroll left"
              disabled={isAtStart}
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>

            <button
              onClick={scrollRight}
              className={`p-3 border border-transparent transition-all duration-300 backdrop-blur-sm ${
                isAtEnd 
                  ? 'bg-red-800/30 text-gray-700 cursor-not-allowed' 
                  : 'bg-red-800/30 hover:bg-black/70 text-white hover:border-white/40 hover:scale-110'
              }`}
              aria-label="Scroll right"
              disabled={isAtEnd}
            >
              <ChevronRightIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* View All Button 
        <div className="text-center mt-12">
          <button className="bg-[#961c18] hover:bg-[#7a1514] text-white font-bold py-3 px-8 rounded-md transition-all duration-300 hover:shadow-lg hover:shadow-red-500/30 hover:-translate-y-1">
            <span className="font-['Hind',Helvetica] font-semibold text-base">
              View All Products
            </span>
          </button>
        </div> */}
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};