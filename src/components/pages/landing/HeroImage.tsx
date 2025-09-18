"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HeroImageSectionProps {
  imageSrc: string;
  alt: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  onPrevious?: () => void;
  onNext?: () => void;
  showNavigation?: boolean;
}

export const HeroImageSection = ({ 
  imageSrc, 
  alt,
  title,
  subtitle,
  ctaText,
  ctaLink,
  onPrevious, 
  onNext, 
  showNavigation = false 
}: HeroImageSectionProps) => {
  return (
    <div className="relative w-full max-w-6xl mx-auto mb-8 sm:mb-12 px-4 sm:px-0">
      {/* Main Hero Image */}
      <div className="relative group">
        {ctaLink ? (
          <Link href={ctaLink} className="block relative">
            <Image
              src={imageSrc}
              alt={alt}
              width={1200}
              height={600}
              className="w-full h-auto object-contain rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
              priority
            />
            
            {/* CTA Overlay */}
            {(title || subtitle || ctaText) && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                <div className="text-center text-white p-6">
                  {title && (
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                      {title}
                    </h2>
                  )}
                  {subtitle && (
                    <p className="text-lg sm:text-xl mb-4 text-white/90">
                      {subtitle}
                    </p>
                  )}
                  {ctaText && (
                    <div className="inline-block px-6 py-3 bg-[#961c18] hover:bg-[#7a1614] text-white font-semibold rounded-lg transition-colors duration-200">
                      {ctaText}
                    </div>
                  )}
                </div>
              </div>
            )}
          </Link>
        ) : (
          <Image
            src={imageSrc}
            alt={alt}
            width={1200}
            height={600}
            className="w-full h-auto object-contain rounded-lg"
            priority
          />
        )}
        
        {/* Navigation Chevrons */}
        {showNavigation && (
          <>
            <button
              onClick={onPrevious}
              className="absolute left-2 sm:left-4 bottom-2 sm:bottom-4 w-10 h-10 sm:w-14 sm:h-14 bg-black/70 hover:bg-black/90 flex items-center justify-center transition-all duration-200 z-30 border-2 border-white/20 hover:border-white/40 shadow-lg"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            </button>
            <button
              onClick={onNext}
              className="absolute left-14 sm:left-20 bottom-2 sm:bottom-4 w-10 h-10 sm:w-14 sm:h-14 bg-black/70 hover:bg-black/90 flex items-center justify-center transition-all duration-200 z-30 border-2 border-white/20 hover:border-white/40 shadow-lg"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};