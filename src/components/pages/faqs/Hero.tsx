import React from "react";

export const HeroSection = () => {
  return (
    <section className="relative w-full h-[500px] bg-[url('https://c.animaapp.com/mdsk3basnHuHuS/img/group-619.png')] bg-cover bg-center bg-black flex items-center justify-center">
      <div className="flex flex-col items-center justify-center text-center max-w-4xl px-4">
        <h1 className="font-['Hind',Helvetica] font-bold text-[54px] text-center tracking-[2.16px] leading-[70.2px] mb-6">
          <span className="text-white tracking-[1.17px]">Frequently Asked </span>
          <span className="text-[#961c18] tracking-[1.17px]">
            Questions
          </span>
        </h1>
        <p className="font-['Hind',Helvetica] font-normal text-white text-xl max-w-2xl leading-relaxed">
          Find answers to common questions about KVE tournaments, registration, rankings, and more
        </p>
      </div>
    </section>
  );
};