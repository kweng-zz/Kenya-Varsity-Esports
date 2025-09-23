import React from 'react';
import { tournamentServiceSSR } from '@/lib/services/tournamentServiceSSR';
import { TournamentInformationContent } from '@/components/pages/tournaments/TournamentInformationContent';
import { tournamentNavItems } from '@/lib/tournamentNavigation';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { FooterSection } from '@/components/Footer';
// Disable caching for this page to ensure fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;
// Generate metadata for SEO - only use tournament data from CMS
export async function generateMetadata({ params }) {
    const { slug } = await params;
    // Only fetch tournament data from CMS
    const tournamentData = await tournamentServiceSSR.getTournamentBySlug(slug);
    if (!tournamentData) {
        return {
            title: 'Tournament Not Configured | Kuer',
            description: 'This tournament has not been configured in the CMS yet.',
        };
    }
    // Use only tournament data for metadata
    const title = tournamentData.gameName || 'Tournament';
    const description = tournamentData.description || tournamentData.detailedDescription || 'Tournament information and details';
    const category = tournamentData.category || '';
    const ogImageUrl = tournamentData.featuredImageUrl;
    return {
        title: `${title} Tournament Information | Kuer`,
        description: description,
        keywords: `${title}, tournament, esports, gaming, Kenya, university, competition, ${category}`,
        openGraph: {
            title: `${title} Tournament Information`,
            description: description,
            type: 'website',
            url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://kuer.com'}/games/${slug}/information`,
            images: ogImageUrl ? [{ url: ogImageUrl, width: 1200, height: 630, alt: title }] : undefined,
        },
        twitter: {
            card: 'summary_large_image',
            title: `${title} Tournament Information`,
            description: description,
            images: ogImageUrl ? [ogImageUrl] : undefined,
        },
    };
}
export default async function TournamentInformationPage({ params }) {
    const { slug } = await params;
    // Add debug logging
    console.log(`🔍 Loading tournament page for slug: ${slug}`);
    // Only fetch tournament data from CMS - no static data fallbacks
    let tournamentData = null;
    try {
        console.log(`🔄 Attempting to fetch tournament by slug: ${slug}`);
        tournamentData = await tournamentServiceSSR.getTournamentBySlug(slug);
        console.log(`📊 Tournament data for ${slug}:`, {
            found: !!tournamentData,
            data: tournamentData,
            awards: tournamentData?.awards,
            slug: tournamentData?.slug,
            gameName: tournamentData?.gameName
        });
    }
    catch (error) {
        console.error(`❌ Error fetching tournament data for ${slug}:`, error);
    }
    // If no tournament found, try to get all tournaments and find by slug
    if (!tournamentData) {
        try {
            console.log(`🔄 No direct match, searching all tournaments for slug: ${slug}`);
            const allTournaments = await tournamentServiceSSR.getPublishedTournaments();
            console.log(`📋 All tournaments:`, allTournaments.map(t => ({ slug: t.slug, gameName: t.gameName, id: t.id })));
            tournamentData = allTournaments.find(t => t.slug === slug) || null;
            console.log(`📊 Found tournament in all tournaments for ${slug}:`, {
                found: !!tournamentData,
                matchingTournament: tournamentData ? { slug: tournamentData.slug, gameName: tournamentData.gameName } : null
            });
        }
        catch (error) {
            console.error(`❌ Error fetching all tournaments for ${slug}:`, error);
        }
    }
    console.log(`🎮 Using ${tournamentData ? 'CMS tournament data' : 'no data - will show not configured message'} for ${slug}`);
    const currentPath = `/games/${slug}/information`;
    // Determine hero background image - only use tournament image or default
    const getHeroImage = () => {
        // Use tournament featured image if available
        if (tournamentData?.featuredImageUrl) {
            return tournamentData.featuredImageUrl;
        }
        // Fallback to default image
        return '/images/Mask Group.png';
    };
    return (<div className="relative w-full min-h-screen bg-black overflow-hidden">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative w-full h-[560px] bg-black mt-0">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${getHeroImage()})` }}></div>

        <div className="absolute inset-0 bg-[#0F0F13] opacity-0"></div>

        <div className="absolute inset-0" style={{
            background: 'linear-gradient(182.1deg, #0F0F13 22.17%, rgba(12, 14, 17, 0) 74.51%)',
        }}></div>

        <div className="absolute inset-0" style={{
            background: 'linear-gradient(0deg, rgba(15, 15, 19, 0.9) 22.17%, rgba(12, 14, 17, 0) 74.51%)',
        }}></div>

        <div className="absolute inset-0 overflow-hidden">
          <img className="absolute top-105 left-19 w-2/4 h-2/4 object-contain -translate-x-1/2 -translate-y-1/2" alt="Background Left" src="/images/Mask Group.png"/>
          
          <img className="absolute top-105 right-19 w-2/4 h-2/4 object-contain translate-x-1/2 -translate-y-1/2 scale-x-[-1]" alt="Background Right" src="/images/Mask Group.png"/>
        </div>
      </section>

      {/* Tournament Navigation Section */}
      <section className="relative bg-black h-[100px]">
        <img className="absolute w-full h-full object-cover opacity-20" alt="Background" src="https://c.animaapp.com/md6ebassseX7AK/img/group-44.png"/>

        <div className="absolute bottom-1 left-0 w-full h-[0.5px] bg-white/50 z-5"></div>

        <div className="relative z-10 h-full">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex space-x-12">
            {tournamentNavItems.map((item, index) => {
            const itemHref = item.href.replace('[slug]', slug);
            const isActive = currentPath === itemHref;
            return (<div key={`tournament-nav-${index}`} className="relative">
                  <Link href={itemHref} className={`text-xl font-bold font-hind tracking-wide transition-colors ${isActive
                    ? 'text-[#8c110d]'
                    : 'text-[#8c110d] hover:text-[#b91c17]'}`}>
                    {item.name}
                  </Link>
                  {isActive && (<div className="absolute -bottom-2 left-0 w-full h-[3px] bg-[#8e130e]"/>)}
                </div>);
        })}
          </div>
        </div>
      </section>

      {/* Tournament Information Content */}
      <TournamentInformationContent tournamentData={tournamentData} slug={slug}/>

      <FooterSection />
    </div>);
}
