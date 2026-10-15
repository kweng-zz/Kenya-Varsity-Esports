"use client";

import React, { useEffect, useState } from 'react';
import { Navigation } from "@/components/Navigation";
import { FooterSection } from "@/components/Footer";
import { CheckCircle, Loader2, Ticket, ArrowRight, Download } from 'lucide-react';
import Link from "next/link";
import { downloadTicketsPdf } from '@/lib/tickets/ticketPdf';

export default function TicketSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ eventId: string }>;
  searchParams: Promise<{ purchaseId: string }>;
}) {
  const [purchase, setPurchase] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    verifyPurchase();
  }, []);

  const verifyPurchase = async () => {
    try {
      const [{ eventId }, { purchaseId }] = await Promise.all([params, searchParams]);
      
      if (!purchaseId) {
        setLoading(false);
        return;
      }

      setVerifying(true);
      const response = await fetch(`/api/events/${eventId}/tickets/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ purchaseId }),
      });
      const data = await response.json();
      
      if (data.success) {
        setPurchase(data.data.purchase);
      }
    } catch (error) {
      console.error('Verification error:', error);
    } finally {
      setLoading(false);
      setVerifying(false);
    }
  };

  const downloadTicketPdf = async () => {
    if (!purchase) return;
    setDownloading(true);
    try {
      const codes: string[] =
        purchase.ticketCodes && purchase.ticketCodes.length > 0
          ? purchase.ticketCodes
          : [purchase.confirmationCode || purchase.purchaseId];
      await downloadTicketsPdf(purchase, codes);
    } catch (err) {
      console.error('Failed to generate ticket PDF:', err);
      alert('Failed to generate the ticket PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <main className="bg-black min-h-screen font-hind">
        <Navigation />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="w-12 h-12 border-2 border-[#8c110d] border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-gray-400 font-black text-sm uppercase tracking-wider">Verifying your purchase...</p>
        </div>
        <FooterSection />
      </main>
    );
  }

  if (!purchase) {
    return (
      <main className="bg-black min-h-screen font-hind">
        <Navigation />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="relative inline-block mb-6">
            <div className="absolute -inset-3 border border-[#8c110d]/20 transform rotate-1" />
            <div className="relative border-2 border-gray-800 p-12 bg-black">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#8c110d]" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#8c110d]" />
              <Loader2 className="w-16 h-16 text-yellow-500 mx-auto mb-4 animate-spin" />
              <p className="text-gray-400 font-black text-lg uppercase tracking-tight mb-2">Verifying Payment</p>
              <p className="text-gray-500 text-sm mb-6">We're confirming your payment. This may take a moment.</p>
              <button
                onClick={verifyPurchase}
                disabled={verifying}
                className="px-6 py-3 bg-gradient-to-r from-[#8c110d] to-[#b91c17] text-white font-black uppercase tracking-wider transition-all hover:from-[#b91c17] hover:to-[#8c110d]"
              >
                {verifying ? 'Checking...' : 'Check Again'}
              </button>
            </div>
          </div>
        </div>
        <FooterSection />
      </main>
    );
  }

  const statusColors = {
    confirmed: 'bg-green-900/30 border-green-800 text-green-400',
    pending: 'bg-yellow-900/30 border-yellow-800 text-yellow-400',
    cancelled: 'bg-red-900/30 border-red-800 text-red-400',
    refunded: 'bg-gray-900/30 border-gray-800 text-gray-400',
  };

  const statusLabels = {
    confirmed: 'CONFIRMED',
    pending: 'PENDING',
    cancelled: 'CANCELLED',
    refunded: 'REFUNDED',
  };

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <main className="bg-black min-h-screen font-hind">
      <Navigation />
      
      <section className="relative bg-[#080808] w-full py-16 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-2 h-28 bg-[#8c110d] opacity-50 transform rotate-12" />
          <div className="absolute bottom-20 right-10 w-2 h-28 bg-[#8c110d] opacity-40 transform -rotate-6" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          {/* Success Animation */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 bg-green-900/30 rounded-full flex items-center justify-center border-2 border-green-800">
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mb-4">
              Purchase Successful!
            </h1>
            <p className="text-gray-400 text-lg">
              Your tickets have been confirmed. Download your e-tickets below and keep them safe.
            </p>
          </div>

          {/* Status Badge */}
          <div className={`inline-flex items-center gap-2 px-6 py-3 rounded ${statusColors[purchase.status as keyof typeof statusColors] || statusColors.pending} mb-8`}>
            <CheckCircle className="w-5 h-5" />
            <span className="font-black text-sm uppercase tracking-wider">
              {statusLabels[purchase.status as keyof typeof statusLabels] || 'PROCESSING'}
            </span>
          </div>

          {/* Ticket Preview */}
          <div className="border-2 border-gray-800 bg-black p-6 mb-8 text-left">
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#8c110d]" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#8c110d]" />
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Ticket className="w-6 h-6 text-[#8c110d]" />
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider">Confirmation</p>
                  <p className="font-mono text-white text-lg tracking-wider">{purchase.confirmationCode || purchase.purchaseId}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-xs uppercase tracking-wider">Amount Paid</p>
                <p className="text-[#8c110d] font-black text-2xl">{formatPrice(purchase.totalAmount, purchase.currency)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider">Tickets</p>
                <p className="text-white font-black">{purchase.quantity}x {purchase.ticketTypeName || 'Standard'}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider">Payment Method</p>
                <p className="text-white font-black capitalize">{purchase.paymentMethod}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4">
            <button
              onClick={downloadTicketPdf}
              disabled={downloading}
              className="w-full py-4 bg-gradient-to-r from-[#8c110d] to-[#b91c17] text-white font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:from-[#b91c17] hover:to-[#8c110d] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {downloading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Download className="w-5 h-5" />
              )}
              {downloading ? 'Generating PDF...' : 'Download Tickets (PDF)'}
            </button>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/events/${purchase.eventId}/tickets/${purchase.purchaseId}`} className="flex-1">
                <button className="w-full py-4 border-2 border-gray-700 hover:border-[#8c110d] text-gray-300 hover:text-white font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all">
                  <Ticket className="w-5 h-5" />
                  View My Tickets
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <Link href="/events" className="flex-1">
                <button className="w-full py-4 border-2 border-gray-700 hover:border-[#8c110d] text-gray-300 hover:text-white font-black uppercase tracking-wider transition-all">
                  Browse More Events
                </button>
              </Link>
            </div>
          </div>

          {/* Next Steps */}
          <div className="mt-12 p-5 bg-gray-900/50 border border-gray-800 text-left">
            <h3 className="text-lg font-black uppercase text-white mb-4 flex items-center gap-2">
              <Ticket className="w-5 h-5 text-[#8c110d]" />
              What's Next?
            </h3>
            <ol className="space-y-3 text-gray-300 text-sm">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-[#8c110d] text-white text-xs font-black flex items-center justify-center rounded">1</span>
                <span>Download your e-tickets and save the PDF to your phone</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-[#8c110d] text-white text-xs font-black flex items-center justify-center rounded">2</span>
                <span>Each ticket has a unique QR code - it scans once at the entrance</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-[#8c110d] text-white text-xs font-black flex items-center justify-center rounded">3</span>
                <span>Bring a valid photo ID matching the purchaser name to the event</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-[#8c110d] text-white text-xs font-black flex items-center justify-center rounded">4</span>
                <span>Arrive early for smooth entry - gates open 1 hour before start time</span>
              </li>
            </ol>
          </div>
        </div>
      </section>

      <FooterSection />
    </main>
  );
}