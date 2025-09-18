import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const HeroSection = () => {
  return (
    <section className="relative w-full h-[700px] bg-[url('https://c.animaapp.com/mdsk3basnHuHuS/img/group-619.png')] bg-cover bg-center bg-black flex items-center justify-center">
      <div className="flex flex-col items-center justify-center text-center max-w-4xl">
        <div className="mt-25">
          <h1 className="font-['Hind',Helvetica] font-bold text-[54px] text-center tracking-[2.16px] leading-[70.2px] mt-60">
            <span className="text-white tracking-[1.17px]">NEED </span>
            <span className="text-[#961c18] tracking-[1.17px]">
              HELP?
            </span>
          </h1>
        </div>

        <div className="max-w-4xl mx-auto font-['Hind',Helvetica] text-white text-center">
          <div className="mt-10">
            <p className="font-bold text-[26px] leading-relaxed">
              If you have any questions about our tournaments or activities, or need to report a problem, firstly, check out our FAQ. You can also create a support ticket by clicking the button below. Our support team will respond as soon as possible.
            </p>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="relative mb-34 w-full h-[400px] flex items-center justify-center gap-8">
          {/* New Ticket Button - Polygon-shaped button with white border */}
          <Link href="/help/new-ticket" className="relative">
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
              className="relative bg-black/90 border-none rounded-none p-0 z-10 focus:outline-none focus:ring-0 overflow-visible"
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
                  NEW TICKET
                </span>
              </div>
            </Button>
          </Link>

          
        </div>
      </div>
    </section>
  );
};