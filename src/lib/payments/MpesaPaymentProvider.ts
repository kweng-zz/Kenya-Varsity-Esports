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

interface MpesaConfig extends PaymentProviderConfig {
  consumerKey: string;
  consumerSecret: string;
  shortcode: string;
  passkey: string;
  callbackUrl: string;
  environment: 'sandbox' | 'production';
}

interface MpesaAccessTokenResponse {
  access_token: string;
  expires_in: string;
}

interface MpesaSTKPushResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

interface MpesaCallbackData {
  Body: {
    stkCallback: {
      MerchantRequestID: string;
      CheckoutRequestID: string;
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata?: {
        Item: Array<{
          Name: string;
          Value: string | number;
        }>;
      };
    };
  };
}

export class MpesaPaymentProvider extends BasePaymentProvider {
  private mpesaConfig: MpesaConfig;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(config: PaymentProviderConfig) {
    super(config);
    this.mpesaConfig = config as MpesaConfig;
  }

  getProviderInfo(): PaymentProvider {
    return {
      id: 'mpesa',
      name: 'M-Pesa',
      displayName: 'M-Pesa (Mobile Money)',
      supportedCurrencies: ['KES'],
      supportsRefunds: false,
      supportsPartialRefunds: false,
    };
  }

  private async getAccessToken(): Promise<string> {
    const now = Date.now();
    if (this.accessToken && now < this.tokenExpiry) {
      return this.accessToken;
    }

    const auth = Buffer.from(
      `${this.mpesaConfig.consumerKey}:${this.mpesaConfig.consumerSecret}`
    ).toString('base64');

    const baseUrl = this.mpesaConfig.environment === 'production'
      ? 'https://api.safaricom.co.ke'
      : 'https://sandbox.safaricom.co.ke';

    const response = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
      },
    });

    const data = await response.json() as MpesaAccessTokenResponse;
    this.accessToken = data.access_token;
    this.tokenExpiry = now + (parseInt(data.expires_in) - 60) * 1000;
    return this.accessToken;
  }

  private generatePassword(): { password: string; timestamp: string } {
    const timestamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
    const password = Buffer.from(
      `${this.mpesaConfig.shortcode}${this.mpesaConfig.passkey}${timestamp}`
    ).toString('base64');
    return { password, timestamp };
  }

  async createPaymentIntent(params: CreatePaymentIntentParams): Promise<PaymentResult> {
    try {
      const token = await this.getAccessToken();
      const { password, timestamp } = this.generatePassword();

      const baseUrl = this.mpesaConfig.environment === 'production'
        ? 'https://api.safaricom.co.ke'
        : 'https://sandbox.safaricom.co.ke';

      const phoneNumber = params.metadata?.phoneNumber || '';
      if (!phoneNumber) {
        return {
          success: false,
          status: 'failed',
          error: 'Phone number is required for M-Pesa payments',
        };
      }

      const formattedPhone = phoneNumber.startsWith('254') 
        ? phoneNumber 
        : phoneNumber.startsWith('0') 
          ? '254' + phoneNumber.slice(1) 
          : '254' + phoneNumber;

      const payload = {
        BusinessShortCode: this.mpesaConfig.shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.round(params.amount),
        PartyA: formattedPhone,
        PartyB: this.mpesaConfig.shortcode,
        PhoneNumber: formattedPhone,
        CallBackURL: this.mpesaConfig.callbackUrl,
        AccountReference: params.metadata?.accountReference || `EVT-${Date.now()}`,
        TransactionDesc: params.description || 'Event Ticket Purchase',
      };

      const response = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json() as MpesaSTKPushResponse;

      if (data.ResponseCode === '0') {
        const paymentIntentId = `mpesa_${data.CheckoutRequestID}`;
        return {
          success: true,
          paymentIntentId,
          status: 'pending',
          providerReference: data.CheckoutRequestID,
          providerResponse: data as unknown as Record<string, unknown>,
        };
      } else {
        return {
          success: false,
          status: 'failed',
          error: data.ResponseDescription,
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
    return {
      success: false,
      status: 'failed',
      error: 'M-Pesa payments are confirmed via callback, not direct confirmation',
    };
  }

  async getPaymentIntent(paymentIntentId: string): Promise<PaymentIntent | null> {
    const checkoutRequestId = paymentIntentId.replace('mpesa_', '');
    
    try {
      const token = await this.getAccessToken();
      const { password, timestamp } = this.generatePassword();

      const baseUrl = this.mpesaConfig.environment === 'production'
        ? 'https://api.safaricom.co.ke'
        : 'https://sandbox.safaricom.co.ke';

      const payload = {
        BusinessShortCode: this.mpesaConfig.shortcode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId,
      };

      const response = await fetch(`${baseUrl}/mpesa/stkpushquery/v1/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (data.ResponseCode === '0') {
        const statusMap: Record<string, PaymentStatus> = {
          '0': 'succeeded',
          '1': 'failed',
          '1032': 'cancelled',
        };
        return {
          id: paymentIntentId,
          amount: 0,
          currency: 'KES',
          status: statusMap[data.ResultCode] || 'pending',
          providerReference: checkoutRequestId,
          providerResponse: data as unknown as Record<string, unknown>,
          createdAt: new Date(),
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
      error: 'M-Pesa payments cannot be cancelled once initiated',
    };
  }

  async processRefund(request: RefundRequest): Promise<RefundResult> {
    return {
      success: false,
      status: 'failed',
      amount: request.amount || 0,
      error: 'M-Pesa refunds must be processed manually through Safaricom',
    };
  }

  verifyWebhookSignature(payload: string | Buffer, signature: string): boolean {
    return true;
  }

  parseWebhookEvent(payload: Record<string, unknown>): {
    type: string;
    paymentIntentId: string;
    status: PaymentStatus;
    data: Record<string, unknown>;
  } | null {
    try {
      const callback = payload as unknown as MpesaCallbackData;
      const stkCallback = callback.Body.stkCallback;
      const checkoutRequestId = stkCallback.CheckoutRequestID;
      const paymentIntentId = `mpesa_${checkoutRequestId}`;

      let status: PaymentStatus = 'pending';
      if (stkCallback.ResultCode === 0) {
        status = 'succeeded';
      } else if (stkCallback.ResultCode === 1) {
        status = 'failed';
      } else if (stkCallback.ResultCode === 1032) {
        status = 'cancelled';
      }

      return {
        type: 'mpesa.stk_callback',
        paymentIntentId,
        status,
        // `amount` is in main currency units (M-Pesa reports KES directly)
        data: {
          callback: stkCallback as unknown as Record<string, unknown>,
          amount: this.extractAmountFromCallback(payload as unknown as MpesaCallbackData),
        },
      };
    } catch {
      return null;
    }
  }

  extractAmountFromCallback(callback: MpesaCallbackData): number {
    try {
      const metadata = callback.Body.stkCallback.CallbackMetadata?.Item;
      if (metadata) {
        const amountItem = metadata.find(item => item.Name === 'Amount');
        if (amountItem) {
          return Number(amountItem.Value);
        }
      }
    } catch {}
    return 0;
  }
}