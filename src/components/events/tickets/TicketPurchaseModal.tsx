"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CreditCard, Smartphone, Loader2, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { calculateOrderTotal } from '@/lib/pricing';

interface TicketType {
  $id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice: number;
  quantityTotal: number;
  quantitySold: number;
  quantityReserved: number;
  maxPerOrder: number;
  minPerOrder: number;
  benefits: string[];
  color: string;
  isFeatured: boolean;
}

interface EventTicket {
  $id: string;
  eventId: string;
  eventTitle: string;
  eventSlug: string;
  currency: string;
  taxRate: number;
  serviceFee: number;
  serviceFeeType: 'fixed' | 'percentage';
  maxTicketsPerUser: number;
  requiresApproval: boolean;
}

interface PurchaseCalculation {
  subtotal: number;
  taxAmount: number;
  serviceFee: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
}

interface EventTicketData {
  eventTicket: EventTicket;
  ticketTypes: TicketType[];
  availability: Array<{
    ticketType: TicketType;
    available: number;
    isAvailable: boolean;
    isOnSale: boolean;
    saleMessage?: string;
  }>;
  paymentProviders: string[];
}

interface TicketPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventTitle: string;
  userId: string;
  userEmail: string;
  userName: string;
  userPhone?: string;
  onSuccess?: (purchaseId: string) => void;
}

export default function TicketPurchaseModal({
  isOpen,
  onClose,
  eventId,
  eventTitle,
  userId,
  userEmail,
  userName,
  userPhone,
  onSuccess,
}: TicketPurchaseModalProps) {
  const [step, setStep] = useState<'select' | 'payment' | 'success' | 'error'>('select');
  const [ticketData, setTicketData] = useState<EventTicketData | null>(null);
  const [selectedTicketType, setSelectedTicketType] = useState<TicketType | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedProvider, setSelectedProvider] = useState<string>('stripe');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [calculation, setCalculation] = useState<PurchaseCalculation | null>(null);
  const [purchaseResult, setPurchaseResult] = useState<{
    purchaseId: string;
    paymentIntentId: string;
    clientSecret?: string;
    redirectUrl?: string;
  } | null>(null);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      fetchTicketData();
      setStep('select');
      setSelectedTicketType(null);
      setQuantity(1);
      setError(null);
      setPurchaseResult(null);
    }
  }, [isOpen]);

  const fetchTicketData = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}/tickets`);
      const data = await response.json();
      if (data.success) {
        setTicketData(data.data);
        // Auto-select first available ticket type
        const firstAvailable = data.data.availability.find((a: any) => a.isAvailable);
        if (firstAvailable) {
          setSelectedTicketType(firstAvailable.ticketType);
          setQuantity(firstAvailable.ticketType.minPerOrder);
        }
        setSelectedProvider(data.data.paymentProviders[0] || 'stripe');
      } else {
        setError(data.error || 'Failed to load ticket information');
      }
    } catch {
      setError('Failed to load ticket information');
    }
  };

  const calculateTotal = () => {
    if (!selectedTicketType || !ticketData) return;
    
    const result = calculateOrderTotal({
      price: selectedTicketType.price,
      originalPrice: selectedTicketType.originalPrice,
      quantity,
      taxRate: ticketData.eventTicket.taxRate,
      serviceFee: ticketData.eventTicket.serviceFee,
      serviceFeeType: ticketData.eventTicket.serviceFeeType,
      currency: ticketData.eventTicket.currency,
    });

    setCalculation({
      subtotal: result.subtotal,
      taxAmount: result.taxAmount,
      serviceFee: result.serviceFee,
      discountAmount: result.discountAmount,
      totalAmount: result.totalAmount,
      currency: result.currency,
    });
  };

  useEffect(() => {
    calculateTotal();
  }, [selectedTicketType, quantity, ticketData]);

  const getAvailability = (ticketTypeId: string) => {
    return ticketData?.availability.find(a => a.ticketType.$id === ticketTypeId);
  };

  const handlePurchase = async () => {
    if (!selectedTicketType || !calculation) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/events/${eventId}/tickets/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketTypeId: selectedTicketType.$id,
          quantity,
          userId,
          userEmail,
          userName,
          userPhone,
          paymentMethod: selectedProvider,
          metadata: {
            ticketTypeName: selectedTicketType.name,
            eventTitle,
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPurchaseResult(data.data.payment);
        setStep('payment');
        
        // Handle redirect-based payments (Paystack, M-Pesa)
        if (data.data.payment.redirectUrl) {
          window.location.href = data.data.payment.redirectUrl;
        }
      } else {
        setError(data.error || 'Failed to process purchase');
        setStep('error');
      }
    } catch {
      setError('An error occurred during purchase');
      setStep('error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async () => {
    if (!purchaseResult) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/events/${eventId}/tickets/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          purchaseId: purchaseResult.purchaseId,
          paymentIntentId: purchaseResult.paymentIntentId,
          paymentMethod: selectedProvider,
        }),
      });

      const data = await response.json();

      if (data.success && data.data.purchase.status === 'confirmed') {
        setStep('success');
        onSuccess?.(data.data.purchase.purchaseId);
      } else {
        setStep('error');
        setError('Payment verification failed. Please contact support.');
      }
    } catch {
      setError('Failed to verify payment');
      setStep('error');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!isOpen || !mounted) return null;

  return createPortal((
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center sm:p-4" role="dialog" aria-modal="true">
      {/* Backdrop - single layer */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-md" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      <div className="relative z-10 flex flex-col w-full sm:max-w-2xl max-h-[100dvh] sm:max-h-[90dvh] bg-gray-950 border-2 border-gray-700 shadow-2xl shadow-black/50">
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#8c110d]" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#8c110d]" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#8c110d]" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#8c110d]" />
        
        {/* Header */}
        <div className="shrink-0 relative p-6 border-b border-gray-800 flex items-center justify-between">
          <div>
            <span className="text-[#8c110d] font-black text-xs uppercase tracking-[0.2em] block mb-1">
              Purchase Tickets
            </span>
            <h2 className="text-2xl font-black uppercase text-white">{eventTitle}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Step indicator */}
        <div className="shrink-0 px-6 py-4 border-b border-gray-800">
          <div className="flex items-center justify-center gap-2">
            {['select', 'payment', 'success'].map((s, i) => (
              <React.Fragment key={s}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-all ${
                  ['select', 'payment', 'success'].indexOf(step) >= i
                    ? 'bg-[#8c110d] text-white'
                    : 'bg-gray-800 text-gray-500'
                }`}>
                  {['select', 'payment', 'success'].indexOf(step) > i ? (
                    <CheckCircle size={16} />
                  ) : (
                    i + 1
                  )}
                </div>
                {i < 2 && (
                  <div className={`w-16 h-0.5 transition-all ${
                    ['select', 'payment', 'success'].indexOf(step) > i
                      ? 'bg-[#8c110d]'
                      : 'bg-gray-800'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-center gap-8 mt-2 text-xs font-black uppercase tracking-wider">
            <span className={step === 'select' ? 'text-[#8c110d]' : 'text-gray-500'}>Select Tickets</span>
            <span className={step === 'payment' ? 'text-[#8c110d]' : 'text-gray-500'}>Payment</span>
            <span className={step === 'success' ? 'text-[#8c110d]' : 'text-gray-500'}>Confirmed</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-6">
          {error && step !== 'success' && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-800 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Step 1: Ticket Selection */}
          {step === 'select' && ticketData && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-black uppercase text-white mb-4">Select Ticket Type</h3>
                <div className="space-y-4">
                  {ticketData.ticketTypes.map((ticketType) => {
                    const avail = getAvailability(ticketType.$id);
                    const isSelected = selectedTicketType?.$id === ticketType.$id;
                    const isAvailable = avail?.isAvailable && avail?.isOnSale;
                    
                    return (
                      <button
                        key={ticketType.$id}
                        onClick={() => isAvailable && setSelectedTicketType(ticketType)}
                        disabled={!isAvailable}
                        className={`relative w-full text-left p-5 border-2 transition-all duration-300 ${
                          isSelected
                            ? 'border-[#8c110d] bg-[#8c110d]/10'
                            : 'border-gray-800 hover:border-gray-700'
                        } ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
                        style={{ borderColor: isSelected ? ticketType.color : undefined }}
                      >
                        {/* Featured badge */}
                        {ticketType.isFeatured && (
                          <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-[#8c110d] text-white text-[10px] font-black uppercase tracking-[0.1em]">
                            Popular
                          </span>
                        )}
                        
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-black text-white text-lg uppercase">{ticketType.name}</h4>
                              {ticketType.originalPrice > ticketType.price && (
                                <span className="text-green-400 text-xs font-black uppercase tracking-[0.1em]">
                                  Save {formatPrice(ticketType.originalPrice - ticketType.price, ticketData.eventTicket.currency)}
                                </span>
                              )}
                            </div>
                            {ticketType.description && (
                              <p className="text-gray-400 text-sm mb-3">{ticketType.description}</p>
                            )}
                            {ticketType.benefits.length > 0 && (
                              <ul className="space-y-1 text-sm text-gray-300">
                                {ticketType.benefits.map((benefit, idx) => (
                                  <li key={idx} className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-[#8c110d] flex-shrink-0" />
                                    {benefit}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                          
                          <div className="flex flex-col items-end gap-2">
                            <div className="text-right">
                              <span className="text-2xl font-black text-white">
                                {formatPrice(ticketType.price, ticketData.eventTicket.currency)}
                              </span>
                              {ticketType.originalPrice > ticketType.price && (
                                <div className="text-xs text-gray-500 line-through">
                                  {formatPrice(ticketType.originalPrice, ticketData.eventTicket.currency)}
                                </div>
                              )}
                              <span className="text-xs text-gray-500">per ticket</span>
                            </div>
                            
                            <div className="text-xs text-gray-400">
                              {avail?.available !== undefined ? (
                                avail.available > 0
                                  ? `${avail.available} left`
                                  : 'Sold out'
                              ) : (
                                'Checking...'
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {isSelected && (
                          <div className="absolute inset-0 border-2 pointer-events-none" style={{ borderColor: ticketType.color }} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedTicketType && (
                <div className="border-2 border-gray-800 p-5">
                  <h4 className="font-black text-white uppercase mb-4">Quantity</h4>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(selectedTicketType.minPerOrder, quantity - 1))}
                      disabled={quantity <= selectedTicketType.minPerOrder}
                      className="w-12 h-12 border-2 border-gray-700 hover:border-[#8c110d] text-white font-black text-xl flex items-center justify-center transition-colors disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="w-20 text-center text-2xl font-black text-white">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(selectedTicketType.maxPerOrder, quantity + 1))}
                      disabled={quantity >= selectedTicketType.maxPerOrder || (getAvailability(selectedTicketType.$id)?.available !== undefined && quantity >= (getAvailability(selectedTicketType.$id)?.available || 0))}
                      className="w-12 h-12 border-2 border-gray-700 hover:border-[#8c110d] text-white font-black text-xl flex items-center justify-center transition-colors disabled:opacity-50"
                    >
                      +
                    </button>
                    <span className="text-gray-400 text-sm ml-auto">
                      Max {selectedTicketType.maxPerOrder} per order
                    </span>
                  </div>
                </div>
              )}

              {calculation && (
                <div className="bg-gray-900/50 border border-gray-800 p-5">
                  <h4 className="font-black text-white uppercase mb-4">Order Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">{quantity}x {selectedTicketType?.name}</span>
                      <span className="text-white">{formatPrice(calculation.subtotal, calculation.currency)}</span>
                    </div>
                    {calculation.discountAmount > 0 && (
                      <div className="flex justify-between text-green-400">
                        <span>Discount</span>
                        <span>-{formatPrice(calculation.discountAmount, calculation.currency)}</span>
                      </div>
                    )}
                    {calculation.taxAmount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Tax ({ticketData?.eventTicket.taxRate}%)</span>
                        <span className="text-white">{formatPrice(calculation.taxAmount, calculation.currency)}</span>
                      </div>
                    )}
                    {calculation.serviceFee > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Service Fee</span>
                        <span className="text-white">{formatPrice(calculation.serviceFee, calculation.currency)}</span>
                      </div>
                    )}
                    <div className="h-px bg-gray-800 my-2" />
                    <div className="flex justify-between text-lg font-black">
                      <span className="text-white">Total</span>
                      <span className="text-[#8c110d]">{formatPrice(calculation.totalAmount, calculation.currency)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Fixed footer for Step 1: Proceed to Payment button */}
          {step === 'select' && selectedTicketType && (
            <div className="shrink-0 border-t border-gray-800 bg-gray-950 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <button
                onClick={handlePurchase}
                disabled={loading || !calculation}
                className="w-full py-4 bg-gradient-to-r from-[#8c110d] to-[#b91c17] hover:from-[#b91c17] hover:to-[#8c110d] text-white font-black uppercase tracking-wider transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Proceed to Payment — ${formatPrice(calculation?.totalAmount || 0, calculation?.currency || 'KES')}`
                )}
              </button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 'payment' && purchaseResult && (
            <div className="space-y-6 text-center">
              <div className="py-8">
                <div className="w-20 h-20 mx-auto mb-4 bg-[#8c110d]/20 rounded-full flex items-center justify-center">
                  <Loader2 className="w-10 h-10 text-[#8c110d] animate-spin" />
                </div>
                <h3 className="text-xl font-black uppercase text-white mb-2">Processing Payment</h3>
                <p className="text-gray-400">
                  {selectedProvider === 'stripe' ? 'Complete payment with your card' :
                   selectedProvider === 'mpesa' ? 'Complete payment on your phone (M-Pesa)' :
                   'Complete payment via Paystack'}
                </p>
              </div>

              {purchaseResult.redirectUrl && (
                <a
                  href={purchaseResult.redirectUrl}
                  className="block w-full py-4 bg-gradient-to-r from-[#8c110d] to-[#b91c17] text-white font-black uppercase tracking-wider transition-all hover:from-[#b91c17] hover:to-[#8c110d]"
                >
                  {selectedProvider === 'mpesa' ? 'Pay with M-Pesa' : 'Continue to Payment'}
                </a>
              )}

              <button
                onClick={handleVerifyPayment}
                disabled={loading}
                className="w-full py-4 border-2 border-gray-700 hover:border-[#8c110d] text-gray-300 hover:text-white font-black uppercase tracking-wider transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                    Verifying...
                  </>
                ) : (
                  'I\'ve Completed Payment — Verify'
                )}
              </button>

              <button
                onClick={() => setStep('select')}
                className="w-full py-3 text-gray-400 hover:text-white font-black uppercase tracking-wider text-sm"
              >
                Change Ticket Selection
              </button>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 'success' && purchaseResult && (
            <div className="space-y-6 text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-green-900/30 rounded-full flex items-center justify-center border-2 border-green-800">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <h3 className="text-2xl font-black uppercase text-white mb-2">Purchase Confirmed!</h3>
              <p className="text-gray-400 mb-6">
                Your tickets have been confirmed. A confirmation email has been sent to {userEmail}.
              </p>
              
              <div className="bg-gray-900/50 border border-gray-800 p-5 text-left">
                <h4 className="font-black text-white uppercase mb-3">Purchase Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Confirmation Code</span>
                    <span className="font-mono text-white text-lg tracking-wider">{purchaseResult.purchaseId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Amount Paid</span>
                    <span className="text-white">{formatPrice(calculation?.totalAmount || 0, calculation?.currency || 'KES')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tickets</span>
                    <span className="text-white">{quantity}x {selectedTicketType?.name}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    onClose();
                    window.location.href = `/events/${eventId}/tickets/${purchaseResult.purchaseId}`;
                  }}
                  className="flex-1 py-4 bg-gradient-to-r from-[#8c110d] to-[#b91c17] text-white font-black uppercase tracking-wider transition-all hover:from-[#b91c17] hover:to-[#8c110d]"
                >
                  View Tickets
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-4 border-2 border-gray-700 hover:border-[#8c110d] text-gray-300 hover:text-white font-black uppercase tracking-wider transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {/* Error state */}
          {step === 'error' && (
            <div className="space-y-6 text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-red-900/30 rounded-full flex items-center justify-center border-2 border-red-800">
                <XCircle className="w-10 h-10 text-red-400" />
              </div>
              <h3 className="text-2xl font-black uppercase text-white mb-2">Purchase Failed</h3>
              <p className="text-gray-400 mb-6">{error || 'An error occurred during purchase'}</p>
              
              <div className="flex gap-4">
                <button
                  onClick={() => setStep('select')}
                  className="flex-1 py-4 bg-gradient-to-r from-[#8c110d] to-[#b91c17] text-white font-black uppercase tracking-wider transition-all hover:from-[#b91c17] hover:to-[#8c110d]"
                >
                  Try Again
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-4 border-2 border-gray-700 hover:border-[#8c110d] text-gray-300 hover:text-white font-black uppercase tracking-wider transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  ), document.body);
}