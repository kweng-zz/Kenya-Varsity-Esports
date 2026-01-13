import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const HeroSection = () => {
  return (
    <section className="relative w-full h-[700px] bg-[url('https://c.animaapp.com/mdsk3basnHuHuS/img/group-619.png')] bg-cover bg-center bg-black flex items-center justify-center">
      <div className="flex flex-col items-center justify-center text-center max-w-4xl px-4">
        <div className="mt-25">
          <h1 className="font-['Hind',Helvetica] font-bold text-[54px] text-center tracking-[2.16px] leading-[70.2px]">
            <span className="text-white tracking-[1.17px]">NEED </span>
            <span className="text-[#961c18] tracking-[1.17px]">
              HELP?
            </span>
          </h1>
        </div>

        <div className="max-w-4xl mx-auto font-['Hind',Helvetica] text-white text-center mt-8 mb-12">
          <p className="font-bold text-[22px] md:text-[26px] leading-relaxed">
            If you have any questions about our tournaments or activities, or need to report a problem, firstly, check out our FAQ. You can also create a support ticket by clicking the button below. Our support team will respond as soon as possible.
          </p>
        </div>
        
        <div className="flex items-center justify-center">
          <Link href="/help/new-ticket">
            <Button 
              className="bg-[#961c18] hover:bg-[#b0221c] text-white font-['Hind'] font-bold text-xl md:text-2xl px-12 md:px-20 py-6 md:py-8 rounded-xl shadow-2xl shadow-red-900/40 transform transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-white/10 hover:border-white/30"
            >
              New Ticket
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
