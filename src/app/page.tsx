'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const FooterSection = dynamic(() => import("@/components/Footer").then(mod => mod.FooterSection));
const TopHighlightSection = dynamic(() => import("@/components/pages/landing/Highlights").then(mod => mod.TopHighlightSection));
const LatestNews = dynamic(() => import("@/components/pages/landing/News"));
const NewsletterSection = dynamic(() => import("@/components/pages/landing/NewsLetter").then(mod => mod.NewsletterSection));
const ShopSection = dynamic(() => import("@/components/pages/landing/Shop").then(mod => mod.ShopSection));
const SeasonStatistics = dynamic(() => import("@/components/pages/landing/Statistics"), {
  loading: () => <div className="min-h-[400px] bg-black" />
});
const MeetTheTeamSection = dynamic(() => import("@/components/pages/landing/Team").then(mod => mod.MeetTheTeamSection));
const SponsorTiers = dynamic(() => import('@/components/pages/landing/Sponsorship'));
const SponsorLogos = dynamic(() => import('@/components/pages/landing/SponsorLogos').then(mod => mod.SponsorLogos));

import { Navigation } from "@/components/Navigation";
import { HeroBanner } from "@/components/pages/landing/Banner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";





export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Client-side validation to match server rules
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      alert('Please fill in all fields');
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 3000);
      return;
    }

    if (formData.name.trim().length < 2) {
       alert('Name must be at least 2 characters long');
       return;
    }

    if (formData.message.trim().length < 10) {
       alert('Message must be at least 10 characters long');
       return;
    }

    if (formData.message.trim().length > 1000) {
       alert('Message must be less than 1000 characters');
       return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      alert('Please enter a valid email address');
      return;
    }

    // Additional validation to prevent spam
    const spamKeywords = ['http', 'www', 'link', 'click', 'offer', 'promotion', 'discount', 'free', 'win', 'prize', 'lottery', 'casino', 'viagra', 'cialis'];
    const messageLower = formData.message.toLowerCase();
    const hasSpamKeywords = spamKeywords.some(keyword => messageLower.includes(keyword));
    
    if (hasSpamKeywords) {
      alert('Message contains content that may be flagged as spam. Please remove any promotional links or suspicious content.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      console.log('📤 Submitting contact form via API...');
      
      // Use our API endpoint with cPanel SMTP
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          message: formData.message.trim(),
          subject: `Contact Form: ${formData.name.trim()}`
        })
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        console.log('✅ Email sent successfully via API');
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setSubmitStatus('idle'), 5000);
      } else {
        throw new Error(result.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('❌ Contact form error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      // Provide helpful error messages
      if (errorMessage.includes('spam')) {
        alert('Your message was flagged as potential spam. Please try rephrasing your message with simpler content.');
      } else {
        alert(errorMessage || 'Failed to send message. Please try again or contact us directly at events@tunzaesports.com');
      }
      
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-black w-full min-h-screen" data-model-id="1:2">
      <div className="w-full relative z-20">
        <Navigation />  
      </div>
      <HeroBanner />
      <SponsorLogos />
      <SeasonStatistics />
      <TopHighlightSection />
      <LatestNews />
      <MeetTheTeamSection />
      <SponsorTiers />

      
      {/* Sponsor section - full width */}
      <section
        className="relative w-full py-12 sm:py-16 md:py-20 lg:py-24 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://c.animaapp.com/md6ebassseX7AK/img/group-219-1.png)",
        }}
      >
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row gap-8 sm:gap-10 md:gap-12 px-4 sm:px-6">
          <div className="md:w-1/2">
            <h2 className="font-['Hind',Helvetica] font-bold text-2xl sm:text-3xl md:text-4xl tracking-wider leading-tight">
              <span className="text-white">
                CONTACT US ABOUT POTENTIAL <span className="text-red-800">PARTNERSHIP</span> AND <span className="text-red-800">PRESS MATTERS</span>
              </span>
            </h2>
          </div>

          <div className="md:w-1/2">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <Textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className="w-full h-24 sm:h-32 bg-transparent border border-white/20 rounded-none text-white font-['Hind',Helvetica] font-semibold p-3 sm:p-5 placeholder:text-white text-sm sm:text-base"
                placeholder="WRITE MESSAGE"
              />

              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border border-white/20 rounded-none text-white font-['Hind',Helvetica] font-semibold p-3 sm:p-5 placeholder:text-white text-sm sm:text-base"
                  placeholder="YOUR NAME"
                />

                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border border-white/20 rounded-none text-white font-['Hind',Helvetica] font-semibold p-3 sm:p-5 placeholder:text-white text-sm sm:text-base"
                  placeholder="YOUR EMAIL"
                />
              </div>

              {submitStatus === 'success' && (
                <div className="text-green-400 text-sm font-semibold">
                  Message sent successfully!
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="text-red-400 text-sm font-semibold">
                  {!formData.name || !formData.email || !formData.message 
                    ? 'Please fill in all fields'
                    : 'Failed to send message. Please try again.'}
                </div>
              )}

              <div className="flex justify-center sm:justify-end">
                <Button
                  className="bg-[#961c18] hover:bg-[#7a1714] text-white font-['Hind',Helvetica] font-semibold px-8 sm:px-10 py-4 sm:py-6 rounded-none relative overflow-hidden skewed-button text-sm sm:text-base disabled:opacity-50"
                  type="submit"
                  disabled={isSubmitting}
                >
                  <span className="relative z-10">{isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
      <ShopSection />
      <NewsletterSection />
      <FooterSection />
    </div>
  )
}