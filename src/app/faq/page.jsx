import React from "react";
import { Navigation } from "@/components/Navigation";
import { FooterSection } from "@/components/Footer";
import { HeroSection } from "@/components/pages/faqs/Hero";
import { FAQSection } from "@/components/pages/faqs/Questions";
export default function FAQPage() {
    return (<main className="bg-black min-h-screen">
      <Navigation />
      <HeroSection />
      <FAQSection />
      <FooterSection />
    </main>);
}
