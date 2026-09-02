import Stripe from 'stripe';

/**
 * Type definitions for Stripe Checkout
 */

export interface CreateCheckoutSessionRequest {
  lineItems?: any[];
  customerEmail?: string;
  successUrl?: string;
  cancelUrl?: string;
  metadata?: Record<string, string>;
}

export interface CreateCheckoutSessionResponse {
  clientSecret: string;
  sessionId: string;
}

export interface CheckoutSessionStatus {
  session_id: string;
  status: string | null;
  payment_status: string | null;
  customer_email: string | null;
  customer_details: any | null;
  amount_total: number | null;
  amount_subtotal: number | null;
  currency: string | null;
  shipping_details: any | null;
  shipping_cost: any | null;
  line_items: any[];
  created: number;
  expires_at: number | null;
  metadata: Stripe.Metadata;
  payment_intent: string | Stripe.PaymentIntent | null;
  is_complete: boolean;
  is_paid: boolean;
  total_display: string | null;
}

export interface StripeErrorResponse {
  error: string;
  details?: string;
  type?: string;
  status?: null;
}

/**
 * Product line item for checkout
 */
export interface CheckoutLineItem {
  price_data: {
    currency: string;
    product_data: {
      name: string;
      description?: string;
      images?: string[];
      metadata?: Record<string, string>;
    };
    unit_amount: number; // Amount in cents
  };
  quantity: number;
  adjustable_quantity?: {
    enabled: boolean;
    minimum?: number;
    maximum?: number;
  };
}

/**
 * Checkout session state for client components
 */
export interface CheckoutState {
  clientSecret: string | null;
  sessionId: string | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Return page session info
 */
export interface ReturnPageSessionInfo extends CheckoutSessionStatus {
  // Additional client-side computed fields can be added here
}

/**
 * Utility type for payment status
 */
export type PaymentStatus = 'paid' | 'unpaid' | 'no_payment_required';

/**
 * Utility type for checkout session status
 */
export type CheckoutStatus = 'complete' | 'expired' | 'open';

/**
 * Customer information from checkout
 */
export interface CheckoutCustomerInfo {
  name: string | null;
  email: string | null;
  phone: string | null;
  address: Stripe.Address | null;
}

/**
 * Shipping information from checkout
 */
export interface CheckoutShippingInfo {
  name: string | null;
  address: Stripe.Address | null;
  carrier: string | null;
  tracking_number: string | null;
  phone: string | null;
}

/**
 * Payment Intent request for custom checkout
 */
export interface CreatePaymentIntentRequest {
  amount: number;
  currency: 'usd' | 'bdt';
  email?: string;
  fullName?: string;
  phone?: string;
  metadata?: Record<string, string>;
}

/**
 * Payment Intent response for custom checkout
 */
export interface CreatePaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

/**
 * Custom checkout form props
 */
export interface CustomCheckoutFormProps {
  initialAmount: number;
  initialCurrency: 'usd' | 'bdt';
  productInfo?: {
    image: string;
    title: string;
    description: string;
    quantity: number;
  };
}
