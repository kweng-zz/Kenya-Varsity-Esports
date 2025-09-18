import { FooterSection, Navigation } from "@/components";
import { HeroSection } from "@/components/pages/help/Justwork";
import React from "react";


export default function HelpPage() {
  return (
    <main className="bg-black min-h-screen">
      {/* Navigation */}
      <Navigation />
      
      {/* Hero Section with NEW TICKET button */}
      <HeroSection />

      {/* Footer */}
      <FooterSection />
    </main>
  );
}