'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SocialIcon } from 'react-social-icons';
import { useAuth } from '@/contexts/AuthContext';
import TicketNotifications from './TicketNotifications';

interface NavItem {
  name: string;
  href: string;
  protected?: boolean;
}

interface SocialIconData {
  url: string;
  alt: string;
}

export function Navigation() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const pathname = usePathname();

  const { user, profile, loading, signOut } = useAuth();
  const isAdmin = profile?.isAdmin;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isProfileDropdownOpen && !target.closest('.profile-dropdown')) {
        setIsProfileDropdownOpen(false);
      }
      if (isSearchOpen && !target.closest('.search-dropdown')) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileDropdownOpen, isSearchOpen]);

  const navItems: NavItem[] = [
    { name: "HOME", href: "/" },
    { name: "ABOUT US", href: "/about" },
    { name: "BLOGS", href: "/blogs" },
    { name: "TOURNAMENTS", href: "/tournaments", protected: true },
    { name: "RANKINGS", href: "/rankings" },
    { name: "SHOP", href: "/shop" },
  ];

  const socialIcons: SocialIconData[] = [
    { url: "https://www.facebook.com/people/Kenya-University-Esports-Rankings/61564114237402/?mibextid=LQQJ4d", alt: "Facebook" },
    { url: "https://www.instagram.com/keuniesportsrankings/?igsh=MXRmNHZtOTVqZDh5dQ%3D%3D&utm_source=qr", alt: "Instagram" },
    { url: "https://www.linkedin.com/company/kenya-university-esports-rankings", alt: "LinkedIn" },
    { url: "https://www.twitch.tv/kenyauniesportsrankings", alt: "Twitch" },
    { url: "https://www.whatsapp.com/channel/0029VafLdwE96H4XI1gb3X3Z", alt: "WhatsApp" },
    { url: "https://www.tiktok.com/@kenyauniesportsrankings", alt: "TikTok" },
    { url: "https://x.com/keunierankings?s=21", alt: "Twitter" },
    { url: "https://www.youtube.com/@kenyauniversityesportsrankings", alt: "YouTube" },
  ];

  const isActiveRoute = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  const renderAuthButtons = (isMobile?: boolean) => {
    if (loading) return null;

    if (user) {
      if (isMobile) {
        return (
          <div className="flex flex-col items-center space-y-3">
            {isAdmin && (
              <Link
                href="/admin"
                className="px-4 py-2 bg-[#961c18] hover:bg-[#7a1514] text-white font-medium text-sm rounded transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin Panel
              </Link>
            )}
            <Link
              href="/tournament-registration"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Register for Tournament
            </Link>
            <button
              onClick={signOut}
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Logout
            </button>
          </div>
        );
      }

      return (
        <div className="flex items-center space-x-4">
          {isAdmin && <TicketNotifications />}
          {isAdmin && (
            <Link
              href="/admin"
              className="px-4 py-2 bg-[#961c18] hover:bg-[#7a1514] text-white font-medium text-sm rounded transition-colors"
            >
              Admin Panel
            </Link>
          )}
          <div className="relative profile-dropdown">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center justify-center w-10 h-10 bg-[#961c18] hover:bg-[#7a1514] text-white rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
            {isProfileDropdownOpen && (
              <div className="absolute top-12 right-0 bg-white border border-gray-300 rounded-lg shadow-lg py-2 w-48 z-50">
                <div className="px-4 py-2 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">{profile?.fullname}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <Link
                  href="/tournament-registration"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsProfileDropdownOpen(false)}
                >
                  Register for Tournament
                </Link>
                <button
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    signOut();
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className={`flex ${isMobile ? 'flex-col items-center space-y-3' : 'items-center space-x-4'}`}>
        <Link
          href="/login"
          className="px-4 py-2 bg-[#961c18] rounded text-white font-medium text-base hover:bg-[#7a1514] transition-colors"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="px-4 py-2 rounded-lg bg-transparent border border-[#961c18] text-[#961c18] font-medium text-base hover:bg-[#961c18] hover:text-white transition-colors"
        >
          Register
        </Link>
      </div>
    );
  };

  return (
    <header className="relative w-full bg-black z-50">
      {/* Top social bar (desktop only) */}
      <div className="hidden md:flex justify-between items-center px-6 h-[70px] border-b border-white">
        <div className="flex items-center space-x-4">
          <span className="text-[#8d130e] text-base font-normal">Follow us on</span>
          <div className="flex space-x-2">
            {socialIcons.map((icon, idx) => (
              <SocialIcon
                key={idx}
                url={icon.url}
                style={{ width: 30, height: 30 }}
                fgColor="white"
                bgColor="transparent"
                target="_blank"
                rel="noopener noreferrer"
              />
            ))}
          </div>
        </div>
        {renderAuthButtons()}
      </div>

      {/* Main nav */}
      <div className="relative h-[120px] md:h-[100px]">
        <Image
          src="https://c.animaapp.com/md6ebassseX7AK/img/group-44.png"
          alt="Background"
          fill
          className="object-cover opacity-20 pointer-events-none"
          priority
        />

        {/* Mobile nav top bar */}
        <div className="md:hidden relative z-20 flex justify-between items-center px-4 h-full">
          <Link href="/">
            <img
              src="https://c.animaapp.com/md7xc8iywLDvVn/img/kuer-transparent-1.png"
              alt="Kuer Logo"
              className="w-12 h-12 object-cover"
            />
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-[#8c110d] hover:text-[#b91c17]"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex justify-between items-center relative z-30 h-full px-12">
          {/* Left nav items */}
          <div className="flex space-x-10">
            {navItems.slice(0, 3).map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className={`text-xl font-bold tracking-wide transition-colors ${
                  isActiveRoute(item.href)
                    ? 'text-[#8c110d]'
                    : 'text-white hover:text-[#b91c17]'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Center logos */}
          <img
            className="absolute w-[220px] h-[220px] top-10 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
            alt="Group"
            src="https://c.animaapp.com/md7xc8iywLDvVn/img/group-151.png"
          />
          <img
            className="absolute w-[175px] h-[187px] top-6 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover z-30"
            alt="Kuer transparent"
            src="https://c.animaapp.com/md7xc8iywLDvVn/img/kuer-transparent-1.png"
          />

          {/* Right nav items + search */}
          <div className="flex items-center space-x-10">
            {navItems.slice(3).map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className={`text-xl font-bold tracking-wide transition-colors ${
                  isActiveRoute(item.href)
                    ? 'text-[#8c110d]'
                    : 'text-white hover:text-[#b91c17]'
                }`}
              >
                {item.name}
              </Link>
            ))}

            <div className="relative search-dropdown">
              <button
                onClick={toggleSearch}
                className="w-6 h-6 flex items-center justify-center hover:text-[#8c110d]"
              >
                <svg className="w-5 h-5 text-gray-400 hover:text-[#8c110d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              {isSearchOpen && (
                <div className="absolute top-10 right-0 bg-white border border-gray-300 rounded-lg shadow-lg p-3 w-[250px] z-50">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#961c18] text-black"
                    autoFocus
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-[0.5px] bg-white/50" />
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-95 z-50 flex flex-col items-center justify-center space-y-6">
          {navItems.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="text-2xl font-bold text-white hover:text-[#961c18]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}

          {renderAuthButtons(true)}

          {/* Optional: social icons at the bottom of mobile menu */}
          <div className="flex space-x-4 mt-6">
            {socialIcons.map((icon, idx) => (
              <SocialIcon
                key={idx}
                url={icon.url}
                style={{ width: 30, height: 30 }}
                fgColor="white"
                bgColor="transparent"
                target="_blank"
                rel="noopener noreferrer"
              />
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
