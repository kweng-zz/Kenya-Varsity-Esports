import { BasePaymentProvider } from './BasePaymentProvider';
import { StripePaymentProvider } from './StripePaymentProvider';
import { MpesaPaymentProvider } from './MpesaPaymentProvider';
import { PaystackPaymentProvider } from './PaystackPaymentProvider';
import {
  PaymentProvider,
  PaymentProviderConfig,
  CreatePaymentIntentParams,
  PaymentResult,
  PaymentIntent,
  PaymentStatus,
  RefundRequest,
  RefundResult
} from './types';

export type SupportedProvider = 'stripe' | 'mpesa' | 'paystack';

export class PaymentProviderFactory {
  private providers: Map<string, BasePaymentProvider> = new Map();
  private defaultProvider: SupportedProvider = 'stripe';

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders(): void {
    // Stripe
    if (process.env.STRIPE_SECRET_KEY) {
      this.providers.set('stripe', new StripePaymentProvider({
        apiKey: process.env.STRIPE_SECRET_KEY,
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
        testMode: process.env.STRIPE_TEST_MODE !== 'false',
      }));
    }

    // M-Pesa
    if (process.env.MPESA_CONSUMER_KEY && process.env.MPESA_CONSUMER_SECRET) {
      this.providers.set('mpesa', new MpesaPaymentProvider({
        apiKey: process.env.MPESA_CONSUMER_KEY,
        secretKey: process.env.MPESA_CONSUMER_SECRET,
        testMode: process.env.MPESA_ENVIRONMENT !== 'production',
        consumerKey: process.env.MPESA_CONSUMER_KEY,
        consumerSecret: process.env.MPESA_CONSUMER_SECRET,
        shortcode: process.env.MPESA_SHORTCODE || '',
        passkey: process.env.MPESA_PASSKEY || '',
        callbackUrl: process.env.MPESA_CALLBACK_URL || '',
        environment: (process.env.MPESA_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox',
      }));
    }

    // Paystack
    if (process.env.PAYSTACK_SECRET_KEY) {
      this.providers.set('paystack', new PaystackPaymentProvider({
        apiKey: process.env.PAYSTACK_SECRET_KEY,
        secretKey: process.env.PAYSTACK_SECRET_KEY,
        testMode: process.env.PAYSTACK_TEST_MODE !== 'false',
        publicKey: process.env.PAYSTACK_PUBLIC_KEY || '',
        callbackUrl: process.env.PAYSTACK_CALLBACK_URL || '',
      }));
    }

    // Set default provider based on availability
    if (this.providers.has('stripe')) {
      this.defaultProvider = 'stripe';
    } else if (this.providers.has('paystack')) {
      this.defaultProvider = 'paystack';
    } else if (this.providers.has('mpesa')) {
      this.defaultProvider = 'mpesa';
    }
  }

  getProvider(providerId?: SupportedProvider): BasePaymentProvider | null {
    const id = providerId || this.defaultProvider;
    return this.providers.get(id) || null;
  }

  getAllProviders(): PaymentProvider[] {
    return Array.from(this.providers.values()).map(p => p.getProviderInfo());
  }

  getAvailableProviders(): SupportedProvider[] {
    return Array.from(this.providers.keys()) as SupportedProvider[];
  }

  hasProvider(providerId: SupportedProvider): boolean {
    return this.providers.has(providerId);
  }

  setDefaultProvider(providerId: SupportedProvider): void {
    if (this.providers.has(providerId)) {
      this.defaultProvider = providerId;
    }
  }

  getDefaultProvider(): SupportedProvider {
    return this.defaultProvider;
  }

  async createPaymentIntent(
    params: CreatePaymentIntentParams,
    providerId?: SupportedProvider
  ): Promise<PaymentResult> {
    const provider = this.getProvider(providerId);
    if (!provider) {
      return {
        success: false,
        status: 'failed',
        error: `Payment provider ${providerId || this.defaultProvider} not configured`,
      };
    }
    return provider.createPaymentIntent(params);
  }

  async confirmPayment(
    paymentIntentId: string,
    providerId?: SupportedProvider
  ): Promise<PaymentResult> {
    const provider = this.getProvider(providerId);
    if (!provider) {
      return {
        success: false,
        status: 'failed',
        error: 'Payment provider not configured',
      };
    }
    return provider.confirmPayment(paymentIntentId);
  }

  async getPaymentIntent(
    paymentIntentId: string,
    providerId?: SupportedProvider
  ): Promise<PaymentIntent | null> {
    const provider = this.getProvider(providerId);
    if (!provider) {
      return null;
    }
    return provider.getPaymentIntent(paymentIntentId);
  }

  async cancelPayment(
    paymentIntentId: string,
    providerId?: SupportedProvider
  ): Promise<PaymentResult> {
    const provider = this.getProvider(providerId);
    if (!provider) {
      return {
        success: false,
        status: 'failed',
        error: 'Payment provider not configured',
      };
    }
    return provider.cancelPayment(paymentIntentId);
  }

  async processRefund(
    request: RefundRequest,
    providerId?: SupportedProvider
  ): Promise<RefundResult> {
    const provider = this.getProvider(providerId);
    if (!provider) {
      return {
        success: false,
        status: 'failed',
        amount: request.amount || 0,
        error: 'Payment provider not configured',
      };
    }
    return provider.processRefund(request);
  }

  verifyWebhookSignature(
    payload: string | Buffer,
    signature: string,
    providerId: SupportedProvider
  ): boolean {
    const provider = this.getProvider(providerId);
    if (!provider) {
      return false;
    }
    return provider.verifyWebhookSignature(payload, signature);
  }

  parseWebhookEvent(
    payload: Record<string, unknown>,
    providerId: SupportedProvider
  ): {
    type: string;
    paymentIntentId: string;
    status: PaymentStatus;
    data: Record<string, unknown>;
  } | null {
    const provider = this.getProvider(providerId);
    if (!provider) {
      return null;
    }
    return provider.parseWebhookEvent(payload);
  }
}

export const paymentProviderFactory = new PaymentProviderFactory();