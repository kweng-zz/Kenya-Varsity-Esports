"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { contentfulAPI, transformContentfulArticle, TransformedArticle } from '@/lib/contentful';

export const HeroBannerSection = () => {
  const [featuredArticle, setFeaturedArticle] = useState<TransformedArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedArticle();
  }, []);

  const loadFeaturedArticle = async () => {
    try {
      // Check if we're in fallback mode
      if (process.env.NEXT_PUBLIC_FALLBACK_MODE === 'true') {
        console.log('Fallback mode enabled, using fallback content');
        setFeaturedArticle(null);
        setLoading(false);
        return;
      }

      console.log('Loading featured article from Contentful...');
      const response = await contentfulAPI.getArticles({
        page: 1,
        pageSize: 1,
        featured: true
      });
      
      if (response.data.length > 0) {
        const article = response.data[0];
        console.log('Featured article loaded:', article);
        setFeaturedArticle(article);
      } else {
        console.log('No featured articles found');
        setFeaturedArticle(null);
      }
    } catch (error) {
      console.log('Contentful not available, using fallback content');
      setFeaturedArticle(null);
    } finally {
      setLoading(false);
    }
  };

  // Fallback data if no featured article is found
  const fallbackData = {
    title: 'KUER GAMING BLOG',
    subtitle: 'Stay updated with the latest gaming news, tournament coverage, and esports insights from Kenya\'s premier gaming community',
    backgroundImage: '/images/Join our tournaments.png'
  };

  if (loading) {
    return (
      <section className="relative bg-black min-h-screen flex items-center justify-center py-16">
        <div className="text-white text-xl">Loading...</div>
      </section>
    );
  }

  return (
    <section className="relative bg-black min-h-screen flex items-center justify-center py-16">
      {/* Left background image (Mask Group.png) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img
          className="absolute top-0 left-0 w-1/2 h-full object-cover opacity-40"
          alt="Background Left"
          src="/images/Mask Group.png"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      </div>

      {/* Background overlay if featured article has image */}
      {featuredArticle?.imageUrl && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${featuredArticle.imageUrl})` }}
          />
          <div className="absolute inset-0 bg-black opacity-70" />
        </>
      )}

      {/* Container for the entire hero section content */}
      <div className="relative w-full max-w-[1440px] mx-auto flex flex-col lg:flex-row h-auto items-center lg:items-stretch z-10 px-4">
        {/* Left side content - Title, Description, and CTA */}
        <div className="flex-1 flex flex-col justify-center p-4 md:p-8 text-center lg:text-left">
          <div className="w-full max-w-xl mx-auto lg:mx-20">
            <h1 className="font-['Hind',Helvetica] font-bold text-4xl sm:text-5xl md:text-[44px] leading-tight md:leading-[61.6px] tracking-[0.77px] mb-4 text-white">
              {featuredArticle ? (
                featuredArticle.title.includes('(MMUST)') ? (
                  <>
                    {featuredArticle.title.split('(MMUST)')[0]}
                    <span className="text-[#961c18]">(MMUST)</span>
                    {featuredArticle.title.split('(MMUST)')[1]}
                  </>
                ) : (
                  featuredArticle.title
                )
              ) : (
                fallbackData.title
              )}
            </h1>

            <p className="font-normal text-lg sm:text-xl mt-4 text-[#aaaaaa]">
              {featuredArticle ? featuredArticle.description : fallbackData.subtitle}
            </p>

            {/* Category and Date if featured article exists */}
            {featuredArticle && (
              <div className="flex flex-wrap gap-4 mt-4 text-sm">
                <span className="px-3 py-1 bg-[#961c18] text-white rounded-full">
                  {featuredArticle.category}
                </span>
                {featuredArticle.game && (
                  <span className="px-3 py-1 bg-gray-700 text-white rounded-full">
                    {featuredArticle.game}
                  </span>
                )}
                <span className="text-[#aaaaaa]">
                  {new Date(featuredArticle.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            )}

            {/* CTA Button */}
            {featuredArticle ? (
              <div className="mt-6">
                <Link
                  href={`/blogs/${featuredArticle.slug}`}
                  className="inline-block bg-[#961c18] hover:bg-[#7a1514] text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
                >
                  Read Full Article
                </Link>
              </div>
            ) : (
              <div className="mt-6">
                <Link
                  href="#articles"
                  className="inline-block bg-[#961c18] hover:bg-[#7a1514] text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
                >
                  Explore Articles
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right side image container */}
        <div className="relative flex-1 flex items-center justify-center p-0 md:p-12">
          <img
            className="w-full h-auto max-w-[450px] object-contain"
            alt={featuredArticle ? featuredArticle.title : "KUER Gaming Blog"}
            src={featuredArticle?.imageUrl || fallbackData.backgroundImage}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = fallbackData.backgroundImage;
            }}
          />
        </div>
      </div>
    </section>
  );
};