import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const HeroSection = () => {
  return (
    <section className="relative w-full h-[700px] bg-[url('https://c.animaapp.com/mdsk3basnHuHuS/img/group-619.png')] bg-cover bg-center bg-black flex items-center justify-center">
      <div className="flex flex-col items-center justify-center text-center max-w-4xl">
        <div className="mt-25">
          <h1 className="font-['Hind',Helvetica] font-bold text-[54px] text-center tracking-[2.16px] leading-[70.2px] mt-60">
            <span className="text-[#961c18] tracking-[1.17px]">WANT TO BUY GAMING STUFF AND LEVEL UP </span>
            <span className="text-white tracking-[1.17px]">
              YOUR GAMING EXPERIENCE?
            </span>
          </h1>
        </div>

        
        
        {/* Spacer to maintain proper layout height */}
        <div className="relative mb-10 w-full h-[400px] flex items-center justify-center">
          {/* Polygon-shaped button with white border */}
          <div className="relative">
            {/* White border outline */}
            <div 
              className="absolute bg-white"
              style={{
                width: '140.34px',
                height: '568px',
                transform: 'rotate(90deg)',
                clipPath: 'polygon(0% 8%, 50% 0%, 100% 8%, 100% 92%, 50% 100%, 0% 92%)',
                top: '-2px',
                left: '-2px'
              }}
            ></div>
            
            {/* Inner button content */}
            <Button 
              className="relative bg-black border-none rounded-none p-0 z-10 focus:outline-none focus:ring-0 overflow-visible"
              style={{
                width: '136.34px',
                height: '564px',
                opacity: 1,
                transform: 'rotate(90deg)',
                clipPath: 'polygon(0% 8%, 50% 0%, 100% 8%, 100% 92%, 50% 100%, 0% 92%)'
              }}
            >
              {/* Text container with isolated hover effects */}
              <div className="relative z-50 flex items-center justify-center h-full w-full overflow-visible">
                <span className="text-red-900 text-[36px] md:text-[42px] lg:text-[48px] font-['Hind',Helvetica] font-bold tracking-[2px] [text-shadow:0px_2px_4px_#000000] whitespace-nowrap transition-all duration-300 hover:scale-110 hover:text-white hover:[text-shadow:0px_0px_8px_rgba(150,28,24,0.8)] cursor-pointer origin-center"
                  style={{ transform: 'rotate(-90deg)' }}
                >
                  SHOP TODAY!
                </span>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};