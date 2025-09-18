'use client';

import React from "react";

import { LoginSection } from "@/components/pages/login/Form";
import { Navigation } from "@/components/Navigation";
import { FooterSection } from "@/components/Footer";

export default function LoginPage() {
  return (
    <main
      className="bg-black w-full min-h-screen"
      data-model-id="292:590"
    >
      {/* Navigation at the top - full width across entire page */}
      <div className="w-full relative z-20">
        <Navigation />
      </div>

      {/* Login section - full width */}
      <LoginSection />

      {/* Footer section - full width */}
      <FooterSection />
    </main>
  );
}