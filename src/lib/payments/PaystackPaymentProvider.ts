import { createHmac } from 'node:crypto';
import { BasePaymentProvider } from './BasePaymentProvider';
import {
  PaymentProvider,
  PaymentIntent,
  PaymentResult,
  PaymentStatus,
  RefundRequest,
  RefundResult,
  PaymentProviderConfig,
  CreatePaymentIntentParams
} from './types';

interface PaystackConfig extends PaymentProviderConfig {
  publicKey: string;
  secretKey: string;
  callbackUrl: string;
}

interface PaystackInitializeResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    reference: string;
    amount: number;
    currency: string;
    status: string;
    gateway_response: string;
    paid_at: string;
    channel: string;
    customer: {
      email: string;
      first_name: string;
      last_name: string;
      phone: string;
    };
    metadata: Record<string, unknown>;
  };
}

interface PaystackRefundResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    transaction: {
      reference: string;
    };
    amount: number;
    currency: string;
    status: string;
  };
}

export class PaystackPaymentProvider extends BasePaymentProvider {
  private paystackConfig: PaystackConfig;

  constructor(config: PaymentProviderConfig) {
    super(config);
    this.paystackConfig = config as PaystackConfig;
  }

  getProviderInfo(): PaymentProvider {
    return {
      id: 'paystack',
      name: 'Paystack',
      displayName: 'Paystack (Cards, Bank Transfer, Mobile Money)',
      supportedCurrencies: ['NGN', 'USD', 'GHS', 'ZAR', 'KES'],
      supportsRefunds: true,
      supportsPartialRefunds: true,
    };
  }

  async createPaymentIntent(params: CreatePaymentIntentParams): Promise<PaymentResult> {
    try {
      const payload = {
        email: params.customerEmail,
        amount: Math.round(params.amount * 100), // Paystack expects amount in kobo
        currency: params.currency,
        callback_url: params.returnUrl || this.paystackConfig.callbackUrl,
        metadata: {
          ...params.metadata,
          cancel_action: params.cancelUrl,
        },
        channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
      };

      const response = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.paystackConfig.secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json() as PaystackInitializeResponse;

      if (data.status && data.data) {
        return {
          success: true,
          paymentIntentId: data.data.reference,
          status: 'pending',
          redirectUrl: data.data.authorization_url,
          providerReference: data.data.reference,
          providerResponse: data as unknown as Record<string, unknown>,
        };
      } else {
        return {
          success: false,
          status: 'failed',
          error: data.message,
          providerResponse: data as unknown as Record<string, unknown>,
        };
      }
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
    const verification = await this.getPaymentIntent(paymentIntentId);
    if (verification) {
      return {
        success: true,
        paymentIntentId: verification.id,
        status: verification.status,
        providerReference: verification.providerReference,
      };
    }
    return {
      success: false,
      status: 'failed',
      error: 'Payment not found',
    };
  }

  async getPaymentIntent(paymentIntentId: string): Promise<PaymentIntent | null> {
    try {
      const response = await fetch(
        `https://api.paystack.co/transaction/verify/${paymentIntentId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.paystackConfig.secretKey}`,
          },
        }
      );

      const data = await response.json() as PaystackVerifyResponse;

      if (data.status && data.data) {
        const tx = data.data;
        return {
          id: tx.reference,
          amount: tx.amount / 100,
          currency: tx.currency,
          status: this.mapProviderStatusToStandard(tx.status),
          providerReference: tx.reference,
          providerResponse: data as unknown as Record<string, unknown>,
          createdAt: new Date(tx.paid_at || Date.now()),
          updatedAt: new Date(),
        };
      }
      return null;
    } catch {
      return null;
    }
  }

  async cancelPayment(paymentIntentId: string): Promise<PaymentResult> {
    return {
      success: false,
      status: 'failed',
      error: 'Paystack payments cannot be cancelled once initiated',
    };
  }

  async processRefund(request: RefundRequest): Promise<RefundResult> {
    try {
      const payload = {
        transaction: request.paymentIntentId,
        amount: request.amount ? Math.round(request.amount * 100) : undefined,
        // Paystack defaults the refund currency to NGN - use the store currency
        // (KES) unless the caller specifies otherwise via metadata.
        currency: request.metadata?.currency || 'KES',
        customer_note: request.reason,
        merchant_note: request.metadata?.merchant_note,
      };

      const response = await fetch('https://api.paystack.co/refund', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.paystackConfig.secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json() as PaystackRefundResponse;

      if (data.status && data.data) {
        return {
          success: true,
          refundId: `ref_${data.data.id}`,
          status: data.data.status === 'success' ? 'refunded' : 'processing',
          amount: data.data.amount / 100,
          providerResponse: data as unknown as Record<string, unknown>,
        };
      } else {
        return {
          success: false,
          status: 'failed',
          amount: request.amount || 0,
          error: data.message,
        };
      }
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
    const hash = createHmac('sha512', this.paystackConfig.secretKey)
      .update(payload)
      .digest('hex');
    return hash === signature;
  }

  parseWebhookEvent(payload: Record<string, unknown>): {
    type: string;
    paymentIntentId: string;
    status: PaymentStatus;
    data: Record<string, unknown>;
  } | null {
    try {
      const event = payload as unknown as { event: string; data: PaystackVerifyResponse['data'] | PaystackRefundResponse['data'] };
      
      if (event.event === 'charge.success' || event.event === 'charge.failed') {
        const tx = event.data as PaystackVerifyResponse['data'];
        return {
          type: event.event,
          paymentIntentId: tx.reference,
          status: this.mapProviderStatusToStandard(tx.status),
          // `amount` is in main currency units (Paystack sends kobo/cents subunits)
          data: { transaction: tx as unknown as Record<string, unknown>, amount: tx.amount / 100 },
        };
      }
      
      if (event.event === 'refund.success' || event.event === 'refund.failed') {
        const refundData = event.data as PaystackRefundResponse['data'];
        return {
          type: event.event,
          paymentIntentId: refundData.transaction.reference,
          status: refundData.status === 'success' ? 'refunded' : 'failed',
          data: { refund: refundData as unknown as Record<string, unknown>, amount: refundData.amount / 100 },
        };
      }
      
      return null;
    } catch {
      return null;
    }
  }
}