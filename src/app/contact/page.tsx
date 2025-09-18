import React from "react";

import { Navigation } from "@/components/Navigation";
import { FooterSection } from "@/components/Footer";
import { HeroSection } from "@/components/pages/contact/Hero";
import { SocialLinksSection } from "@/components/pages/contact/Socials";

export default function ContactPage() {
  return (
    <main className="bg-black min-h-screen">
      <Navigation />
      <HeroSection />
      <SocialLinksSection />
      <FooterSection />
    </main>
  );
}