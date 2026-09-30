export interface PaymentProvider {
  id: string;
  name: string;
  displayName: string;
  supportedCurrencies: string[];
  supportsRefunds: boolean;
  supportsPartialRefunds: boolean;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  clientSecret?: string;
  paymentMethod?: string;
  metadata?: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
  providerReference?: string;
  providerResponse?: Record<string, unknown>;
}

export interface PaymentResult {
  success: boolean;
  paymentIntentId?: string;
  status: PaymentStatus;
  providerReference?: string;
  providerResponse?: Record<string, unknown>;
  error?: string;
  redirectUrl?: string;
  clientSecret?: string;
}

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'requires_action'
  | 'succeeded'
  | 'failed'
  | 'cancelled'
  | 'refunded'
  | 'partially_refunded';

export interface RefundRequest {
  paymentIntentId: string;
  amount?: number;
  reason?: string;
  metadata?: Record<string, string>;
}

export interface RefundResult {
  success: boolean;
  refundId?: string;
  status: PaymentStatus;
  amount: number;
  error?: string;
  providerResponse?: Record<string, unknown>;
}

export interface PaymentProviderConfig {
  apiKey: string;
  secretKey?: string;
  webhookSecret?: string;
  testMode?: boolean;
  [key: string]: unknown;
}

export interface CreatePaymentIntentParams {
  amount: number;
  currency: string;
  customerEmail?: string;
  customerName?: string;
  description?: string;
  metadata?: Record<string, string>;
  paymentMethodTypes?: string[];
  returnUrl?: string;
  cancelUrl?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'mobile_money' | 'bank_transfer' | 'wallet' | 'cash';
  brand?: string;
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  country?: string;
}