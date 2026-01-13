import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const HeroSection = () => {
  return (
    <section className="relative w-full h-[700px] bg-[url('https://c.animaapp.com/mdsk3basnHuHuS/img/group-619.png')] bg-cover bg-center bg-black flex items-center justify-center">
      <div className="flex flex-col items-center justify-center text-center max-w-4xl">
        <div className="z-10 px-4">
          <h1 className="font-['Hind',Helvetica] font-bold text-[36px] md:text-[54px] text-center tracking-tight leading-tight md:leading-[70.2px] mb-12 max-w-5xl">
            <span className="text-[#961c18]">WANT TO BUY GAMING STUFF AND LEVEL UP </span>
            <span className="text-white">
              YOUR GAMING EXPERIENCE?
            </span>
          </h1>

          <div className="flex items-center justify-center">
            <Button 
              className="bg-[#961c18] hover:bg-[#b0221c] text-white font-['Hind'] font-bold text-xl md:text-2xl px-12 md:px-20 py-6 md:py-8 rounded-xl shadow-2xl shadow-red-900/40 transform transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-white/10 hover:border-white/30"
            >
              SHOP TODAY!
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};