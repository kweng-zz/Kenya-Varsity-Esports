"use client";

import React, { useState, useEffect } from 'react';
import { Navigation } from "@/components/Navigation";
import { FooterSection } from "@/components/Footer";
import { Ticket, CheckCircle, Calendar, Clock, MapPin, Download, Share2, Copy, AlertCircle, Loader2 } from 'lucide-react';
import { downloadTicketsPdf } from '@/lib/tickets/ticketPdf';

interface TicketDetailPageProps {
  params: Promise<{ eventId: string; purchaseId: string }>;
}

export default function TicketDetailPage({ params }: TicketDetailPageProps) {
  const [purchase, setPurchase] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchTicket();
  }, []);

  const fetchTicket = async () => {
    try {
      const { eventId, purchaseId } = await params;
      const response = await fetch(`/api/events/${eventId}/tickets/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ purchaseId }),
      });
      const data = await response.json();
      
      if (data.success) {
        setPurchase(data.data.purchase);
      } else {
        setError(data.error || 'Ticket not found');
      }
    } catch {
      setError('Failed to load ticket');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      setError('Failed to copy');
    }
  };

  const downloadTicket = async () => {
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

  const shareTicket = async () => {
    if (navigator.share && purchase) {
      try {
        await navigator.share({
          title: `Ticket: ${purchase.ticketCodes?.[0] || 'Event Ticket'}`,
          text: `My ticket for the event`,
          url: window.location.href,
        });
      } catch {
        // User cancelled or error
      }
    } else {
      copyToClipboard(window.location.href, 'Link');
    }
  };

  if (loading) {
    return (
      <main className="bg-black min-h-screen font-hind">
        <Navigation />
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <div className="w-12 h-12 border-2 border-[#8c110d] border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-gray-400 font-black text-sm uppercase tracking-wider">Loading ticket...</p>
        </div>
        <FooterSection />
      </main>
    );
  }

  if (error || !purchase) {
    return (
      <main className="bg-black min-h-screen font-hind">
        <Navigation />
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <div className="relative inline-block mb-6">
            <div className="absolute -inset-3 border border-[#8c110d]/20 transform rotate-1" />
            <div className="relative border-2 border-gray-800 p-12 bg-black">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#8c110d]" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#8c110d]" />
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <p className="text-gray-400 font-black text-lg uppercase tracking-tight mb-2">Ticket Not Found</p>
              <p className="text-gray-500 text-sm">{error || 'This ticket could not be found or has been cancelled.'}</p>
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
    pending: 'PENDING PAYMENT',
    cancelled: 'CANCELLED',
    refunded: 'REFUNDED',
  };

  const ticketCodes = purchase.ticketCodes || [];

  return (
    <main className="bg-black min-h-screen font-hind">
      <Navigation />
      
      <section className="relative bg-[#080808] w-full py-16 px-4 md:px-8 overflow-hidden">
        {/* Background accents */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-2 h-28 bg-[#8c110d] opacity-50 transform rotate-12" />
          <div className="absolute bottom-20 right-10 w-2 h-28 bg-[#8c110d] opacity-40 transform -rotate-6" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/KVE%20white%20no%20words.png"
              alt="KVE - Kenya Varsity Esports"
              className="h-20 w-auto mx-auto mb-5"
            />
            <span className="inline-flex items-center gap-2 px-6 py-3 bg-[#8c110d] text-white text-xs font-black uppercase tracking-[0.3em] mb-4">
              <Ticket className="w-4 h-4" />
              Event Ticket
            </span>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white leading-tight">
              {purchase.eventTitle || 'Event Ticket'}
            </h1>
          </div>

          {/* Ticket Cards */}
          <div className="space-y-6">
            {ticketCodes.length > 0 ? (
              ticketCodes.map((code: string, index: number) => (
                <TicketCard
                  key={code}
                  code={code}
                  purchase={purchase}
                  index={index}
                  total={ticketCodes.length}
                  onCopy={() => copyToClipboard(code, `Ticket ${index + 1}`)}
                  copied={copied === `Ticket ${index + 1}`}
                />
              ))
            ) : (
              <TicketCard
                code={purchase.confirmationCode || purchase.purchaseId}
                purchase={purchase}
                index={0}
                total={1}
                onCopy={() => copyToClipboard(purchase.confirmationCode || purchase.purchaseId, 'Confirmation')}
                copied={copied === 'Confirmation'}
              />
            )}
          </div>

          {/* Event Details */}
          <div className="mt-10">
            <div className="border-2 border-gray-800 bg-black p-6">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#8c110d]" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#8c110d]" />
              
              <h2 className="text-xl font-black uppercase text-white mb-6">Event Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#8c110d]/20 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-[#8c110d]" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider">Date</p>
                    <p className="text-white font-black">{purchase.eventDate ? formatDate(purchase.eventDate) : 'TBA'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#8c110d]/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-[#8c110d]" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider">Time</p>
                    <p className="text-white font-black">{purchase.eventTime ? formatTime(purchase.eventTime) : 'TBA'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#8c110d]/20 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-[#8c110d]" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider">Venue</p>
                    <p className="text-white font-black">{purchase.eventVenue || 'TBA'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#8c110d]/20 flex items-center justify-center">
                    <Ticket className="w-5 h-5 text-[#8c110d]" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider">Ticket Type</p>
                    <p className="text-white font-black">{purchase.ticketTypeName || 'Standard'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Purchase Info */}
          <div className="mt-6">
            <div className="border-2 border-gray-800 bg-black p-6">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#8c110d]" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#8c110d]" />
              
              <h2 className="text-xl font-black uppercase text-white mb-6">Purchase Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider">Confirmation Code</p>
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-white text-lg tracking-wider flex-1">{purchase.confirmationCode || purchase.purchaseId}</code>
                    <button
                      onClick={() => copyToClipboard(purchase.confirmationCode || purchase.purchaseId, 'Confirmation')}
                      className="p-2 hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
                      aria-label="Copy confirmation code"
                    >
                      {copied === 'Confirmation' ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider">Purchase Date</p>
                  <p className="text-white font-black">{formatDate(purchase.purchasedAt)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider">Amount Paid</p>
                  <p className="text-white font-black text-2xl text-[#8c110d]">
                    {new Intl.NumberFormat('en-KE', {
                      style: 'currency',
                      currency: purchase.currency || 'KES',
                      minimumFractionDigits: 0,
                    }).format(purchase.totalAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider">Payment Method</p>
                  <p className="text-white font-black capitalize">{purchase.paymentMethod || 'Unknown'}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-gray-400 text-xs uppercase tracking-wider">Status</p>
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded ${statusColors[purchase.status as keyof typeof statusColors] || statusColors.pending}`}>
                    <CheckCircle className="w-4 h-4" />
                    {statusLabels[purchase.status as keyof typeof statusLabels] || 'UNKNOWN'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <button
              onClick={downloadTicket}
              disabled={downloading}
              className="flex-1 py-4 bg-gradient-to-r from-[#8c110d] to-[#b91c17] text-white font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:from-[#b91c17] hover:to-[#8c110d] disabled:opacity-60 disabled:cursor-wait"
            >
              {downloading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Download Ticket
                </>
              )}
            </button>
            <button
              onClick={shareTicket}
              className="flex-1 py-4 border-2 border-gray-700 hover:border-[#8c110d] text-gray-300 hover:text-white font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
            >
              <Share2 className="w-5 h-5" />
              Share
            </button>
          </div>

          {/* Important Notice */}
          <div className="mt-10 p-5 bg-yellow-900/20 border border-yellow-800">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-yellow-300 font-black text-sm uppercase tracking-wider mb-2">Important:</p>
                <ul className="text-yellow-200 text-sm space-y-1">
                  <li>• Present the QR code or confirmation code at the event entrance</li>
                  <li>• A valid photo ID matching the purchaser name is required</li>
                  <li>• Tickets are non-transferable unless otherwise stated</li>
                  <li>• Screenshots of QR codes may not scan properly - use the original</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterSection />
    </main>
  );
}

function TicketCard({ code, purchase, index, total, onCopy, copied }: {
  code: string;
  purchase: any;
  index: number;
  total: number;
  onCopy: () => void;
  copied: boolean;
}) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const QRCode = await import('qrcode');
        const url = await QRCode.toDataURL(code, { width: 256, margin: 1 });
        if (!cancelled) setQrDataUrl(url);
      } catch (err) {
        console.error('Failed to render QR code:', err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [code]);

  return (
    <div className="relative border-2 border-gray-800 bg-black overflow-hidden group">
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#8c110d]" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#8c110d]" />
      
      {/* Side accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#8c110d] to-[#b91c17]" />
      
      {/* Perforation line */}
      {index < total - 1 && (
        <div className="absolute bottom-0 left-8 right-8 h-px bg-dashed bg-gray-700" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 10px, gray 10px, gray 20px)' }} />
      )}

      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Ticket className="w-6 h-6 text-[#8c110d]" />
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider">Ticket {index + 1} of {total}</p>
                <h3 className="text-xl font-black text-white uppercase">{purchase.ticketTypeName || 'Standard Admission'}</h3>
              </div>
            </div>
            <p className="text-gray-300">{purchase.eventTitle || 'Event'}</p>
          </div>

          <div className="flex flex-col items-end gap-3 md:w-64">
            <div className="text-center p-4 bg-gray-900/50 border border-gray-800">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Confirmation</p>
              <code className="font-mono text-white text-base tracking-wider break-all">{code}</code>
            </div>
            
            <button
              onClick={onCopy}
              className="w-full py-2 px-4 border-2 border-gray-700 hover:border-[#8c110d] text-gray-300 hover:text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Code
                </>
              )}
            </button>
          </div>
        </div>

        {/* QR Code */}
        <div className="mt-6 pt-6 border-t border-gray-800">
          <div className="flex items-center justify-center gap-8">
            <div className="w-32 h-32 bg-white flex items-center justify-center p-1.5">
              {qrDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={qrDataUrl} alt={`QR code for ticket ${code}`} className="w-full h-full" />
              ) : (
                <div className="w-full h-full bg-gray-200 animate-pulse" />
              )}
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Scan at Entry</p>
              <p className="text-white font-mono text-sm break-all">{code}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}