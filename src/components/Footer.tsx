"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button"; // Assuming you have this Button component
import { Separator } from "@/components/ui/separator";

export const FooterSection = () => {

  interface SocialLinkData {
    url: string;
    alt: string;
    icon: string;
  }
  
  const currentYear = 2025;

  const socialLinks: SocialLinkData[] = [
    {
      icon: "https://c.animaapp.com/md6ebassseX7AK/img/vector-3.svg",
      alt: "Facebook",
      url: "https://www.facebook.com/people/Kenya-University-Esports-Rankings/61564114237402/?mibextid=LQQJ4d",
    },
    {
      icon: "https://c.animaapp.com/md6ebassseX7AK/img/vector-7.svg",
      alt: "Instagram",
      url: "https://www.instagram.com/keuniesportsrankings/?igsh=MXRmNHZtOTVqZDh5dQ%3D%3D&utm_source=qr",
    },
    {
      icon: "https://c.animaapp.com/md6ebassseX7AK/img/linkedin-1-1.png",
      alt: "LinkedIn",
      url: "https://www.linkedin.com/company/kenya-university-esports-rankings",
    },
    {
      // FIX: Swapped icon URL with Discord's for the correct YouTube icon.
      icon: "https://c.animaapp.com/md6ebassseX7AK/img/vector-12.svg",
      alt: "YouTube",
      url: "https://www.youtube.com/@kenyauniversityesportsrankings",
    },
    {
      icon: "https://c.animaapp.com/md6ebassseX7AK/img/whattsapp-1-1.png",
      alt: "WhatsApp",
      url: "https://www.whatsapp.com/channel/0029VafLdwE96H4XI1gb3X3Z",
    },
    {
      icon: "https://c.animaapp.com/md6ebassseX7AK/img/tiktox-1-1.png",
      alt: "TikTok",
      url: "https://www.tiktok.com/@kenyauniesportsrankings",
    },
    {
      icon: "https://c.animaapp.com/md6ebassseX7AK/img/x-1-1.png",
      alt: "X",
      url: "https://x.com/keunierankings?s=21",
    },
    {
      // FIX: Swapped icon URL with YouTube's for the correct Discord icon.
      icon: "https://c.animaapp.com/md6ebassseX7AK/img/vector-13.svg",
      alt: "Twitch",
      url: "https://www.twitch.tv/kenyauniesportsrankings",
    },
  ];

  const handleNavLinkClick = (linkName: string) => {
    console.log(`Navigating to: ${linkName}`);
  };

  const handleDonateClick = () => {
    console.log("Donate Now button clicked!");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full relative">
      {/* Background Image for entire footer */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/images/footer.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>

      {/* Main footer content - top section */}
      <div className="w-full pt-6 pb-8 relative z-10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 sm:gap-x-12 lg:gap-x-[120px] gap-y-8 sm:gap-y-10">
          {/* Logo section */}
          <div className="flex flex-col items-center sm:items-start pt-2 col-span-1 sm:col-span-2 lg:col-span-1">
            <Image
              className="w-30 sm:w-35 h-32.5 sm:h-37.5 object-cover mb-4 sm:mb-0 sm:ml-6"
              alt="Kuer transparent"
              src="/images/KVE white no words.png"
              width={140}
              height={150}
            />

            {/* Social media icons */}
            <div className="flex flex-wrap gap-1 justify-center sm:justify-start sm:ml-6">
              {socialLinks.map((link: SocialLinkData, index: number) => (
                <a
                  key={`social-${index}`}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.alt}
                  className="hover:scale-110 transition-transform"
                >
                  <Image
                    className="w-[17px] h-[17px] object-cover"
                    alt={link.alt}
                    src={link.icon}
                    width={17}
                    height={17}
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Information section */}
          <div className="flex flex-col">
            <h3 className="font-semibold text-white text-xl uppercase tracking-wider">INFORMATION</h3>
            <Separator className="w-[50px] h-0.5 mt-2 mb-4 bg-[#961C18]" />

            <div className="space-y-4">
              <Link
                href="/terms"
                className="flex items-center gap-2 text-left w-full cursor-pointer text-[#AAAAAA] hover:text-white transition-colors"
              >
                <div className="w-3.5 h-[11px] bg-[url(https://c.animaapp.com/md6ebassseX7AK/img/vector.svg)] bg-cover bg-center" />
                <span className="font-normal text-base">
                  Terms and Conditions
                </span>
              </Link>

              <Link
                href="/privacy"
                className="flex items-center gap-2 text-left w-full cursor-pointer text-[#AAAAAA] hover:text-white transition-colors"
              >
                <div className="w-3.5 h-3.5 bg-[url(https://c.animaapp.com/md6ebassseX7AK/img/vector-4.svg)] bg-cover bg-center" />
                <span className="font-normal text-base">
                  Privacy Policy
                </span>
              </Link>
            </div>
          </div>

          {/* Help section */}
          <div className="flex flex-col">
            <h3 className="font-semibold text-white text-xl uppercase tracking-wider">HELP</h3>
            <Separator className="w-[50px] h-0.5 mt-2 mb-4 bg-[#961C18]" />

            <div className="space-y-4">
              <Link
                href="/help"
                onClick={() => handleNavLinkClick("Help")}
                className="font-normal text-[#AAAAAA] text-base block w-full text-left cursor-pointer hover:text-white transition-colors"
              >
                Help
              </Link>
              <Link
                href="/faq"
                onClick={() => handleNavLinkClick("Help")}
                className="font-normal text-[#AAAAAA] text-base block w-full text-left cursor-pointer hover:text-white transition-colors"
              >
                Frequently Asked Questions - FAQs
              </Link>
              <Link
                href="/contact"
                onClick={() => handleNavLinkClick("Help")}
                className="font-normal text-[#AAAAAA] text-base block w-full text-left cursor-pointer hover:text-white transition-colors"
              >
                Contact
              </Link>

              <Link
                href="/blogs"
                className="flex items-center text-left cursor-pointer text-[#961C18] hover:text-[#D13431] transition-colors mt-4"
              >
                <span className="font-normal text-base mr-1">
                  View all news here
                </span>
                <Image
                  className="w-4 h-[15px] object-contain"
                  alt="Arrow"
                  src="https://c.animaapp.com/md6ebassseX7AK/img/arrow-2.svg"
                  width={16}
                  height={15}
                />
              </Link>
            </div>
          </div>

          {/* Links of interest section */}
          <div className="flex flex-col">
            <h3 className="font-semibold text-white text-xl uppercase tracking-wider">
              LINKS OF INTEREST
            </h3>
            <Separator className="w-[50px] h-0.5 mt-2 mb-4 bg-[#961C18]" />

            <div className="space-y-4">
              <button
              onClick={() => window.location.href = "https://tunzaesports.org/"}
              className="font-normal text-[#AAAAAA] text-base block w-full text-left cursor-pointer hover:text-white transition-colors"
            >
              TUNZA ESPORTS
            </button>

            </div>
          </div>
        </div>
      </div>

      {/* Middle section with address */}
      <div className="w-full min-h-[130px] bg-[#07080A] border-t border-[#212121] flex items-center relative py-4 sm:py-0">
        <div className="relative w-full max-w-[1200px] mx-auto h-full flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 gap-6 sm:gap-4">
          {/* Left: Nairobi, Kenya Address */}
          <div className="flex items-start gap-0 order-2 sm:order-1">
            <Image
              className="w-[13px] h-4 object-cover mt-0.5"
              alt="Location pin"
              src="https://c.animaapp.com/md6ebassseX7AK/img/vector-6.svg"
              width={13}
              height={16}
            />
            <div className="flex flex-col gap-0.5 items-start ml-[30px]">
              <span className="font-medium text-white text-base sm:text-lg">
                Nairobi, Kenya
              </span>
              <span className="text-[#AAAAAA] text-sm">
                P.O BOX 45085-00100
              </span>
            </div>
          </div>

          {/* Donate Now section */}
          <div className="flex flex-col items-center justify-center text-center order-1 sm:order-2">
            <span className="font-medium text-white text-sm sm:text-base lg:text-lg leading-tight">
              Support the Movement:
            </span>
            <span className="font-medium text-white text-sm sm:text-base lg:text-lg leading-tight mb-3 sm:mb-4">
              Fuel the Future of Kenyan Esports!
            </span>

            <Button
              onClick={handleDonateClick}
              className="w-[120px] sm:w-[140px] h-[45px] sm:h-[50px] bg-[#961C18] rounded-md text-white font-medium text-base sm:text-lg hover:bg-[#D13431] transition-colors"
            >
              Donate Now
            </Button>
          </div>
        </div>

        {/* Scroll to top button */}
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top of page"
          className="w-[50px] h-[50px] rounded-none flex items-center justify-center bg-white shadow-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 absolute right-4 bottom-0 transform translate-y-1/2 z-30"
          title="Back to top"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px] text-black">
            <path d="M12 18L12 6M12 6L7 11M12 6L17 11" stroke="#961c18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Bottom copyright section */}
      <div className="w-full min-h-[59px] bg-[#961C18] flex items-center justify-center px-4 sm:px-6 py-3 relative z-20">
        <div className="text-center sm:text-left max-w-[1200px] w-full">
          <span className="font-medium text-white text-xs sm:text-sm leading-relaxed">
            KENYA UNIVERSITY ESPORTS RANKINGS (KUER) COPYRIGHTS ALL RESERVED{" "}
            {currentYear}
          </span>
        </div>
      </div>
    </footer>
  );
};