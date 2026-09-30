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

export abstract class BasePaymentProvider {
  protected config: PaymentProviderConfig;
  protected testMode: boolean;

  constructor(config: PaymentProviderConfig) {
    this.config = config;
    this.testMode = config.testMode ?? true;
  }

  abstract getProviderInfo(): PaymentProvider;
  
  abstract createPaymentIntent(params: CreatePaymentIntentParams): Promise<PaymentResult>;
  
  abstract confirmPayment(paymentIntentId: string, paymentMethodId?: string): Promise<PaymentResult>;
  
  abstract getPaymentIntent(paymentIntentId: string): Promise<PaymentIntent | null>;
  
  abstract cancelPayment(paymentIntentId: string): Promise<PaymentResult>;
  
  abstract processRefund(request: RefundRequest): Promise<RefundResult>;
  
  abstract verifyWebhookSignature(payload: string | Buffer, signature: string): boolean;
  
  abstract parseWebhookEvent(payload: Record<string, unknown>): {
    type: string;
    paymentIntentId: string;
    status: PaymentStatus;
    data: Record<string, unknown>;
  } | null;

  protected generatePaymentIntentId(prefix: string = 'pi'): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  protected generateRefundId(prefix: string = 're'): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  protected mapStatusToProvider(status: PaymentStatus): string {
    return status;
  }

  protected mapProviderStatusToStandard(providerStatus: string): PaymentStatus {
    const statusMap: Record<string, PaymentStatus> = {
      'pending': 'pending',
      'processing': 'processing',
      'requires_action': 'requires_action',
      'requires_payment_method': 'pending',
      'requires_confirmation': 'pending',
      'succeeded': 'succeeded',
      'paid': 'succeeded',
      'completed': 'succeeded',
      'failed': 'failed',
      'cancelled': 'cancelled',
      'canceled': 'cancelled',
      'refunded': 'refunded',
      'partially_refunded': 'partially_refunded',
    };
    return statusMap[providerStatus.toLowerCase()] || 'pending';
  }
}