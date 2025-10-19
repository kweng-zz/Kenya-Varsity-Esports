"use client";

import React from "react"



import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { FooterSection, Navigation } from "@/components";
import { HeroSection } from "@/components/pages/rankings/HeroSection";
import { GamePackageSection } from "@/components/pages/rankings/Packages";
import { CategorySection } from "@/components/pages/rankings/CategorySections";
import { ContactForm } from "@/components/ContactForm";





export default function RankingsPage() {
    return (

            <main className="bg-[url(https://c.animaapp.com/mdpqpsw8vIfLwh/img/group-677.png)] bg-cover bg-center w-full min-h-screen">
          {/* Navigation at the top - full width across entire page */}
          <div className="w-full relative z-20">
            <Navigation />
          </div>
          
          {/* Hero Section - no spacing */}
          <HeroSection />
          {/* Package Section - no spacing */}
          <GamePackageSection />
          <CategorySection />
          {/* Community section - full width */}
      <section className="w-full bg-[#0c0e11e6] py-8 md:py-12 lg:py-16 mb-0">
      <div className="flex flex-col lg:flex-row w-full rounded-none overflow-hidden shadow-2xl">
        {/* Left side - Image background section */}
        <div className="w-full lg:w-1/2 bg-[url('/images/IMG_8992.jpg')] bg-cover bg-center min-h-[300px] lg:min-h-[500px] flex items-center justify-center p-8">
          {/* Content can be placed here over the background image if needed */}
        </div>

        {/* Right side - Red section with transparent rectangles */}
        <div className="w-full lg:w-1/2 bg-[#B33F40] relative min-h-[300px] lg:min-h-[500px] flex items-center justify-center overflow-hidden p-8 sm:p-12 md:p-16">
          {/* Background pattern of transparent rectangles - sized relative to container */}
          <div className="absolute inset-0 z-0">
            {/* Top row */}
            <div className="absolute w-[15%] h-[10%] bg-white opacity-10 top-[5%] left-[5%]"></div>
            <div className="absolute w-[20%] h-[12%] bg-white opacity-10 top-[8%] left-[30%]"></div>
            <div className="absolute w-[12%] h-[9%] bg-white opacity-10 top-[3%] right-[15%]"></div>

            {/* Middle row */}
            <div className="absolute w-[25%] h-[18%] bg-white opacity-10 top-[25%] left-[2%]"></div>
            <div className="absolute w-[16%] h-[12%] bg-white opacity-10 top-[30%] left-[55%]"></div>
            <div className="absolute w-[22%] h-[15%] bg-white opacity-10 top-[20%] right-[5%]"></div>

            {/* Bottom row */}
            <div className="absolute w-[13%] h-[9%] bg-white opacity-10 bottom-[6%] left-[10%]"></div>
            <div className="absolute w-[18%] h-[12%] bg-white opacity-10 bottom-[12%] left-[45%]"></div>
            <div className="absolute w-[15%] h-[10%] bg-white opacity-10 bottom-[2%] right-[10%]"></div>
            <div className="absolute w-[10%] h-[7%] bg-white opacity-10 bottom-[16%] right-[30%]"></div>
          </div>

          {/* Content (text and button) */}
          <div className="relative z-10 flex flex-col items-center text-center">
            <h2 className="font-['Hind',Helvetica] font-bold text-white text-3xl md:text-4xl lg:text-[46px] leading-tight tracking-[1.84px] uppercase mb-8">
              WANT TO HELP US GROW?
              <br />
              SPONSOR US!
            </h2>

            {/* Become A Sponsor button */}
           <Link href="/community">
              <Button className="w-[220px] h-[60px] bg-[#121315] rounded-none hover:bg-[#2a2d30] transition-colors duration-300 text-white">
                <span className="font-['Hind',Helvetica] font-semibold text-base">
                  Become A Sponsor
                </span>
              </Button>
            </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Sponsor section - full width */}
      <section
        className="relative w-full py-24 bg-cover bg-center -mt-8 md:-mt-12 lg:-mt-16"
        style={{
          backgroundImage:
            "url(https://c.animaapp.com/md6ebassseX7AK/img/group-219-1.png)",
        }}
      >
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row gap-12 px-4">
          <div className="md:w-1/2">
            <h2 className="font-['Hind',Helvetica] font-bold text-4xl tracking-wider">
              <span className="text-white">
                CONTACT US ABOUT POTENTIAL <span className="text-red-800">PARTNERSHIP</span> AND <span className="text-red-800">PRESS MATTERS</span>{" "}
              </span>
            </h2>
          </div>

          <div className="md:w-1/2">
            <ContactForm />
          </div>
        </div>
      </section>
          {/* Footer section - full width */}
          <FooterSection />
        </main>
        
      );
}