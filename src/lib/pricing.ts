export interface PricingBreakdown {
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  serviceFee: number;
  totalAmount: number;
  currency: string;
}

export interface PricingParams {
  price: number;
  originalPrice: number;
  quantity: number;
  taxRate: number;
  serviceFee: number;
  serviceFeeType: 'fixed' | 'percentage';
  currency: string;
}

/**
 * Calculate order total.
 * 
 * Rules:
 * - subtotal = price * quantity (price already reflects any discount)
 * - tax = subtotal * taxRate / 100
 * - serviceFee = fixed amount OR percentage of subtotal
 * - discountAmount = (originalPrice - price) * quantity (informational only, NOT subtracted)
 * - totalAmount = subtotal + tax + serviceFee (rounded to whole currency units)
 */
export function calculateOrderTotal(params: PricingParams): PricingBreakdown {
  const { price, originalPrice, quantity, taxRate, serviceFee, serviceFeeType, currency } = params;

  const subtotal = price * quantity;
  
  const taxAmount = (subtotal * taxRate) / 100;
  
  let fee = 0;
  if (serviceFeeType === 'percentage') {
    fee = (subtotal * serviceFee) / 100;
  } else {
    fee = serviceFee;
  }

  const discountAmount = originalPrice > price
    ? (originalPrice - price) * quantity
    : 0;

  const totalAmount = Math.max(0, Math.round(subtotal + taxAmount + fee));

  return {
    subtotal,
    discountAmount,
    taxAmount: Math.round(taxAmount),
    serviceFee: Math.round(fee),
    totalAmount,
    currency,
  };
}

/**
 * Convert amount to payment provider subunits (e.g., kobo for Paystack/Stripe)
 */
export function toSubunits(amount: number): number {
  return Math.round(amount * 100);
}

/**
 * Convert from payment provider subunits to main currency units
 */
export function fromSubunits(subunits: number): number {
  return subunits / 100;
}