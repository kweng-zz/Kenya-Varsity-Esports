import Stripe from 'stripe';
import { BasePaymentProvider } from './BasePaymentProvider';
import {
  PaymentProvider,
  PaymentIntent,
  PaymentResult,
  PaymentStatus,
  RefundRequest,
  RefundResult,
  PaymentProviderConfig,
  CreatePaymentIntentParams,
  PaymentMethod
} from './types';

export class StripePaymentProvider extends BasePaymentProvider {
  private stripe: Stripe;

  constructor(config: PaymentProviderConfig) {
    super(config);
    this.stripe = new Stripe(config.apiKey as string, {
      apiVersion: '2026-08-26.dahlia',
      typescript: true,
    });
  }

  getProviderInfo(): PaymentProvider {
    return {
      id: 'stripe',
      name: 'Stripe',
      displayName: 'Stripe (Card Payments)',
      supportedCurrencies: ['USD', 'EUR', 'GBP', 'KES', 'NGN', 'ZAR', 'GHS'],
      supportsRefunds: true,
      supportsPartialRefunds: true,
    };
  }

  async createPaymentIntent(params: CreatePaymentIntentParams): Promise<PaymentResult> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(params.amount * 100), // Convert to cents
        currency: params.currency.toLowerCase(),
        customer_email: params.customerEmail,
        description: params.description,
        metadata: params.metadata || {},
        automatic_payment_methods: {
          enabled: true,
        },
        return_url: params.returnUrl,
        setup_future_usage: 'off_session',
      } as Stripe.PaymentIntentCreateParams);

      return {
        success: true,
        paymentIntentId: paymentIntent.id,
        status: this.mapProviderStatusToStandard(paymentIntent.status),
        clientSecret: paymentIntent.client_secret ?? undefined,
        providerReference: paymentIntent.id,
        providerResponse: { paymentIntent },
      };
    } catch (error: unknown) {
      const err = error as Error;
      return {
        success: false,
        status: 'failed',
        error: err.message,
      };
    }
  }

  async confirmPayment(paymentIntentId: string, paymentMethodId?: string): Promise<PaymentResult> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.confirm(paymentIntentId, {
        payment_method: paymentMethodId,
      });

      return {
        success: true,
        paymentIntentId: paymentIntent.id,
        status: this.mapProviderStatusToStandard(paymentIntent.status),
        providerReference: paymentIntent.id,
        providerResponse: { paymentIntent },
      };
    } catch (error: unknown) {
      const err = error as Error;
      return {
        success: false,
        status: 'failed',
        error: err.message,
      };
    }
  }

  async getPaymentIntent(paymentIntentId: string): Promise<PaymentIntent | null> {
    try {
      const pi = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      return {
        id: pi.id,
        amount: pi.amount / 100,
        currency: pi.currency.toUpperCase(),
        status: this.mapProviderStatusToStandard(pi.status),
        clientSecret: pi.client_secret ?? undefined,
        paymentMethod: pi.payment_method as string | undefined,
        metadata: pi.metadata as Record<string, string>,
        createdAt: new Date(pi.created * 1000),
        updatedAt: new Date(),
      };
    } catch {
      return null;
    }
  }

  async cancelPayment(paymentIntentId: string): Promise<PaymentResult> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.cancel(paymentIntentId);
      return {
        success: true,
        paymentIntentId: paymentIntent.id,
        status: this.mapProviderStatusToStandard(paymentIntent.status),
        providerReference: paymentIntent.id,
      };
    } catch (error: unknown) {
      const err = error as Error;
      return {
        success: false,
        status: 'failed',
        error: err.message,
      };
    }
  }

  async processRefund(request: RefundRequest): Promise<RefundResult> {
    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: request.paymentIntentId,
        amount: request.amount ? Math.round(request.amount * 100) : undefined,
        reason: request.reason as Stripe.RefundCreateParams.Reason || 'requested_by_customer',
        metadata: request.metadata || {},
      });

      return {
        success: true,
        refundId: refund.id,
        status: refund.status === 'succeeded' ? 'refunded' : 'processing',
        amount: refund.amount / 100,
        providerResponse: { refund },
      };
    } catch (error: unknown) {
      const err = error as Error;
      return {
        success: false,
        status: 'failed',
        amount: request.amount || 0,
        error: err.message,
      };
    }
  }

  verifyWebhookSignature(payload: string | Buffer, signature: string): boolean {
    try {
      const webhookSecret = this.config.webhookSecret as string;
      this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
      return true;
    } catch {
      return false;
    }
  }

  parseWebhookEvent(payload: Record<string, unknown>): {
    type: string;
    paymentIntentId: string;
    status: PaymentStatus;
    data: Record<string, unknown>;
  } | null {
    try {
      const event = payload as unknown as Stripe.Event;
      if (event.type.startsWith('payment_intent.')) {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        return {
          type: event.type,
          paymentIntentId: paymentIntent.id,
          status: this.mapProviderStatusToStandard(paymentIntent.status),
          data: { paymentIntent: paymentIntent as unknown as Record<string, unknown> },
        };
      }
      if (event.type.startsWith('charge.')) {
        const charge = event.data.object as Stripe.Charge;
        return {
          type: event.type,
          paymentIntentId: charge.payment_intent as string,
          status: charge.status === 'succeeded' ? 'succeeded' : 'failed',
          data: { charge: charge as unknown as Record<string, unknown> },
        };
      }
      if (event.type === 'refund.created' || event.type === 'refund.updated') {
        const refund = event.data.object as Stripe.Refund;
        return {
          type: event.type,
          paymentIntentId: refund.payment_intent as string,
          status: refund.status === 'succeeded' ? 'refunded' : 'processing',
          data: { refund: refund as unknown as Record<string, unknown> },
        };
      }
      return null;
    } catch {
      return null;
    }
  }

  async createCustomer(email: string, name?: string, metadata?: Record<string, string>): Promise<Stripe.Customer | null> {
    try {
      return await this.stripe.customers.create({
        email,
        name,
        metadata,
      });
    } catch {
      return null;
    }
  }

  async createPaymentMethod(type: 'card', cardDetails: { number: string; exp_month: number; exp_year: number; cvc: string }): Promise<Stripe.PaymentMethod | null> {
    try {
      return await this.stripe.paymentMethods.create({
        type: 'card',
        card: cardDetails,
      });
    } catch {
      return null;
    }
  }

  async attachPaymentMethod(paymentMethodId: string, customerId: string): Promise<Stripe.PaymentMethod | null> {
    try {
      return await this.stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });
    } catch {
      return null;
    }
  }
}