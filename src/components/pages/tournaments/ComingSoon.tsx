import React from "react";
import Link from "next/link";

export const ComingSoonSection = () => {
  

  return (
    <section className="w-full py-20 bg-black relative">
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
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Coming Soon Header */}
        <div className="mb-16 text-center">
          
          <p className="text-[#aaaaaa] text-[32px] max-w-4xl mx-auto">
             <Link href="/contact" className="text-red-600/50 underline">Contact Us</Link>
            <br /> If you wish a game to be added in the roster.
          </p>
        </div>

        
              
              

        
      </div>
    </section>
  );
};