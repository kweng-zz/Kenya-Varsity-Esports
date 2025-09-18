"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface SubscriptionState {
  loading: boolean;
  success: boolean;
  error: string | null;
  message: string;
}

export const NewsletterSection = () => {
  const [isClient, setIsClient] = useState(false);
  const [email, setEmail] = useState("");
  const [subscriptionState, setSubscriptionState] = useState<SubscriptionState>({
    loading: false,
    success: false,
    error: null,
    message: ""
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setSubscriptionState({
        loading: false,
        success: false,
        error: "EMAIL_REQUIRED",
        message: "Please enter your email address"
      });
      return;
    }

    setSubscriptionState({
      loading: true,
      success: false,
      error: null,
      message: ""
    });

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          tags: ['website-newsletter', 'kuer-updates']
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubscriptionState({
          loading: false,
          success: true,
          error: null,
          message: result.message
        });
        setEmail(""); // Clear email on success
      } else {
        setSubscriptionState({
          loading: false,
          success: false,
          error: result.error || "SUBSCRIPTION_ERROR",
          message: result.message
        });
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setSubscriptionState({
        loading: false,
        success: false,
        error: "NETWORK_ERROR",
        message: "Network error. Please check your connection and try again."
      });
    }
  };

  const resetState = () => {
    setSubscriptionState({
      loading: false,
      success: false,
      error: null,
      message: ""
    });
  };

  useEffect(() => {
    if (subscriptionState.success || subscriptionState.error) {
      const timer = setTimeout(() => {
        resetState();
      }, 5000); // Clear message after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [subscriptionState.success, subscriptionState.error]);

  if (!isClient) {
    return (
      <section className="w-full py-24 relative overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url(https://c.animaapp.com/md6ebassseX7AK/img/group-219.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: 0.15,
          }}
        ></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center justify-center text-center mb-12">
            <span className="font-['Hind',Helvetica] text-lg text-[#961c18] mb-2 uppercase">
              NEWSLETTER
            </span>
            <h2 className="font-['Hind',Helvetica] font-bold text-white text-[46px] tracking-[1.84px] uppercase">
              SUBSCRIBE TO OUR NEWSLETTER
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row max-w-3xl mx-auto gap-0">
            <div className="flex-grow relative overflow-hidden">
              <div className="h-[70px] w-full bg-[#4a4a4a] flex items-center px-6">
                <span className="text-white font-['Hind',Helvetica] font-semibold">YOUR EMAIL</span>
              </div>
            </div>
            <div className="h-[70px] w-60 bg-[#961c18] flex items-center justify-center">
              <span className="text-white font-['Hind',Helvetica] font-semibold uppercase">SUBSCRIBE</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-24 relative overflow-hidden">
      {/* Background image layer for subtle geometric patterns */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url(https://c.animaapp.com/md6ebassseX7AK/img/group-219.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.15,
        }}
      ></div>

      {/* Main content container */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center justify-center text-center mb-12">
          <span className="font-['Hind',Helvetica] text-lg text-[#961c18] mb-2 uppercase">
            NEWSLETTER
          </span>
          <h2 className="font-['Hind',Helvetica] font-bold text-white text-[46px] tracking-[1.84px] uppercase">
            SUBSCRIBE TO OUR NEWSLETTER
          </h2>
        </div>

        {/* Status Messages */}
        {(subscriptionState.success || subscriptionState.error) && (
          <div className="max-w-3xl mx-auto mb-6">
            <div className={`flex items-center justify-center gap-2 p-4 rounded-lg ${
              subscriptionState.success 
                ? 'bg-green-900/50 border border-green-700 text-green-200' 
                : 'bg-red-900/50 border border-red-700 text-red-200'
            }`}>
              {subscriptionState.success ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <span className="font-['Hind',Helvetica] font-medium text-center">
                {subscriptionState.message}
              </span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row max-w-3xl mx-auto gap-0">
          <div className="flex-grow relative overflow-hidden">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={subscriptionState.loading}
              className="h-[70px] w-full rounded-none bg-[#4a4a4a] border-none text-white px-6 py-5
                         font-['Hind',Helvetica] font-semibold placeholder:text-white/70
                         focus:ring-0 focus:ring-offset-0 focus:bg-[#5a5a5a]
                         disabled:opacity-50 disabled:cursor-not-allowed
                         newsletter-input-slant"
              placeholder="YOUR EMAIL"
              required
            />
          </div>
          <Button
            type="submit"
            disabled={subscriptionState.loading || !email.trim()}
            className="h-[70px] w-60 rounded-none bg-[#961c18] hover:bg-[#7a1714] text-white
                       font-['Hind',Helvetica] font-semibold uppercase
                       relative overflow-hidden
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#961c18]
                       newsletter-button-slant"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {subscriptionState.loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  SUBSCRIBING...
                </>
              ) : (
                'SUBSCRIBE'
              )}
            </span>
          </Button>
        </form>
      </div>
    </section>
  );
};