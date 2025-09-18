import React from "react";
import { Navigation } from "@/components/Navigation";
import { FooterSection } from "@/components/Footer";
import { HeroSection } from "@/components/pages/shop/Hero";

export default function ShopPage() {
  return (
    <main className="bg-black min-h-screen">
      <Navigation />
      <HeroSection />
      <FooterSection />
    </main>
  );
}