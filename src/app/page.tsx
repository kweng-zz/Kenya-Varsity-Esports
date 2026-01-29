'use client';

import { useState } from 'react';
import { FooterSection } from "@/components/Footer";
import  { Navigation } from "@/components/Navigation";
import { HeroBanner } from "@/components/pages/landing/Banner";
import { TopHighlightSection } from "@/components/pages/landing/Highlights";
import LatestNews from "@/components/pages/landing/News";
import { NewsletterSection } from "@/components/pages/landing/NewsLetter";
import { ShopSection } from "@/components/pages/landing/Shop";
import SeasonStatistics from "@/components/pages/landing/Statistics";
import { MeetTheTeamSection } from "@/components/pages/landing/Team";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import SponsorTiers from '@/components/pages/landing/Sponsorship';
import { SponsorLogos } from '@/components/pages/landing/SponsorLogos';




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
      setSubmitStatus('error');
      // You might want to set a specific error message state here if you have one
      setTimeout(() => setSubmitStatus('idle'), 3000);
      return;
    }

    if (formData.name.trim().length < 2) {
       alert('Name must be at least 2 characters long'); // Simple feedback since UI doesn't have error state for text
       return;
    }

    if (formData.message.trim().length < 10) {
       alert('Message must be at least 10 characters long');
       return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setSubmitStatus('idle'), 3000);
      } else {
        console.error('Server validation error:', result);
        setSubmitStatus('error');
        if (result.details && Array.isArray(result.details)) {
            // Show first validation error
            alert(result.details[0].message);
        } else if (result.error) {
            alert(result.error);
        }
        setTimeout(() => setSubmitStatus('idle'), 3000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
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