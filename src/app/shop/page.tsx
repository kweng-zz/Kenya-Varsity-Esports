import React from "react";
import { Navigation } from "@/components/Navigation";
import { FooterSection } from "@/components/Footer";
import { HeroSection } from "@/components/pages/shop/Hero";
import ShopEventList from "@/components/pages/shop/ShopEventList";

export default function ShopPage() {
  return (
    <main className="bg-black min-h-screen font-hind">
      <Navigation />
      <HeroSection />
      <ShopEventList />
      <FooterSection />
    </main>
  );
}