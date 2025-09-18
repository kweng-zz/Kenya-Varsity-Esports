import { Metadata } from 'next';
import { Navigation } from '@/components/Navigation';
import { HeroBannerSection } from '@/components/pages/blogs/HeroBanner';
import { FooterSection } from '@/components/Footer';
import { BlogsOverviewSection } from '@/components/pages/blogs/BlogsOverview';

// Enable ISR - revalidate every 300 seconds (5 minutes)
export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Gaming Blog | Latest Esports News & Updates | KUER',
  description: 'Stay updated with the latest gaming and esports news, tournament coverage, game reviews, and community insights from Kenya\'s premier esports platform.',
  keywords: 'gaming blog, esports news, tournament coverage, game reviews, Kenya esports, gaming community, PUBG Mobile, Call of Duty, Free Fire, Fortnite',
  authors: [{ name: 'KUER Team' }],
  openGraph: {
    title: 'Gaming Blog | Latest Esports News & Updates | KUER',
    description: 'Stay updated with the latest gaming and esports news, tournament coverage, game reviews, and community insights from Kenya\'s premier esports platform.',
    url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://kuer.com'}/blogs`,
    siteName: 'KUER',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gaming Blog | Latest Esports News & Updates | KUER',
    description: 'Stay updated with the latest gaming and esports news, tournament coverage, game reviews, and community insights.',
    creator: '@kuer',
    site: '@kuer',
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://kuer.com'}/blogs`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function BlogsPage() {
  return (
    <main className="bg-black w-full min-h-screen">
      {/* Navigation at the top - full width across entire page */}
      <div className="w-full relative z-20">
        <Navigation />
      </div>

      {/* Hero Banner section - full width */}
      <HeroBannerSection />

      {/* Blogs Overview section - full width */}
      <BlogsOverviewSection />

      {/* Footer section - full width */}
      <FooterSection />
    </main>
  );
}