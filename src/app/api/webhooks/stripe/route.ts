import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import prisma from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
  typescript: true,
});

// This is your Stripe webhook secret (get it from Stripe Dashboard)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

/**
 * POST /api/webhooks/stripe
 * Handles Stripe webhook events
 * 
 * Important: You need to configure this webhook URL in your Stripe Dashboard:
 * https://dashboard.stripe.com/webhooks
 * 
 * Webhook URL: https://yourdomain.com/api/webhooks/stripe
 * 
 * Select events to listen for:
 * - checkout.session.completed
 * - checkout.session.expired
 * - payment_intent.succeeded
 * - payment_intent.payment_failed
 */
export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    console.error('No Stripe signature found');
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: `Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}` },
      { status: 400 }
    );
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('✅ Checkout session completed:', session.id);

        // TODO: Fulfill the order
        // - Save order to database
        // - Send confirmation email
        // - Update inventory
        // - Trigger fulfillment process

        await handleCheckoutSessionCompleted(session);
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('⏰ Checkout session expired:', session.id);

        // TODO: Handle expired sessions
        // - Clean up any pending orders
        // - Release reserved inventory

        await handleCheckoutSessionExpired(session);
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('💰 Payment succeeded:', paymentIntent.id);

        // TODO: Additional payment processing
        // - Update payment status in database
        // - Trigger fulfillment if not already done

        await handlePaymentIntentSucceeded(paymentIntent);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('❌ Payment failed:', paymentIntent.id);

        // TODO: Handle failed payments
        // - Notify customer
        // - Update order status
        // - Log for retry or investigation

        await handlePaymentIntentFailed(paymentIntent);
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        console.log('💸 Charge refunded:', charge.id);

        // TODO: Handle refunds
        // - Update order status
        // - Restore inventory
        // - Send refund confirmation email

        await handleChargeRefunded(charge);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    return NextResponse.json({ received: true, type: event.type }, { status: 200 });

  } catch (err) {
    console.error('Error handling webhook event:', err);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

/**
 * Handle completed checkout sessions
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Processing completed session:', {
    sessionId: session.id,
    customerEmail: session.customer_email,
    amountTotal: session.amount_total,
    currency: session.currency,
    paymentStatus: session.payment_status,
  });

  try {
    // Retrieve the PaymentIntent to get metadata
    const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent as string);

    console.log('PaymentIntent metadata:', paymentIntent.metadata);

    // Check if this is a checkout order (not invoice)
    if (paymentIntent.metadata.orderType === 'checkout' && paymentIntent.metadata.cartItems) {
      const cartItems = JSON.parse(paymentIntent.metadata.cartItems);
      const category = paymentIntent.metadata.category || 'refrigeration-equipment';

      // Get customer details from session
      const customerDetails = session.customer_details;
      const shippingDetails = (session as any).shipping_details;

      // Create a temporary invoice request for the order
      const invoiceRequest = await prisma.invoiceRequest.create({
        data: {
          email: customerDetails?.email || 'unknown@email.com',
          phone: customerDetails?.phone || shippingDetails?.phone || '',
          fullName: customerDetails?.name || shippingDetails?.name || 'Customer',
          address: shippingDetails?.address
            ? `${shippingDetails.address.line1}${shippingDetails.address.line2 ? ', ' + shippingDetails.address.line2 : ''}, ${shippingDetails.address.city}, ${shippingDetails.address.state} ${shippingDetails.address.postal_code}, ${shippingDetails.address.country}`
            : '',
          totalAmount: (session.amount_total || 0) / 100,
          totalWithTax: (session.amount_total || 0) / 100,
          products: cartItems,
          projectName: `Order from ${customerDetails?.name || 'Customer'}`,
          category: category,
          status: 'PAID',
        },
      });

      console.log('✅ Invoice request created:', invoiceRequest.id);

      // Create the order
      const order = await prisma.order.create({
        data: {
          invoiceId: invoiceRequest.id,
          customerName: customerDetails?.name || shippingDetails?.name || 'Customer',
          customerEmail: customerDetails?.email || 'unknown@email.com',
          customerPhone: customerDetails?.phone || shippingDetails?.phone || '',
          amountPaid: (session.amount_total || 0) / 100,
          currency: session.currency || 'usd',
          stripeSessionId: session.id,
          stripePaymentId: paymentIntent.id,
          status: 'PAID',
          category: category,
          // Shipping address details
          shippingName: shippingDetails?.name || customerDetails?.name || '',
          shippingAddress: shippingDetails?.address?.line1 || '',
          shippingCity: shippingDetails?.address?.city || '',
          shippingState: shippingDetails?.address?.state || '',
          shippingZip: shippingDetails?.address?.postal_code || '',
          shippingCountry: shippingDetails?.address?.country || '',
          deliveryMethod: shippingDetails ? 'ship' : 'pickup',
        },
      });

      console.log('✅ Order created successfully:', order.id, 'Category:', category);

      // TODO: Send order confirmation email
      // TODO: Notify admin of new order

      return order;
    }

    console.log('⚠️ Not a checkout order or no cart items in metadata');
  } catch (error) {
    console.error('❌ Error creating order:', error);
    throw error;
  }
}

/**
 * Handle expired checkout sessions
 */
async function handleCheckoutSessionExpired(session: Stripe.Checkout.Session) {
  console.log('Processing expired session:', session.id);

  // TODO: Implement cleanup logic
  // - Release reserved inventory
  // - Clean up pending orders
  // - Update analytics
}

/**
 * Handle successful payment intents
 */
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('Processing successful payment:', {
    paymentIntentId: paymentIntent.id,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
    status: paymentIntent.status,
    metadata: paymentIntent.metadata,
  });

  try {
    // Check if this is a checkout order and if order doesn't already exist
    if (paymentIntent.metadata.orderType === 'checkout' && paymentIntent.metadata.cartItems) {
      // Check if order already exists
      const existingOrder = await prisma.order.findFirst({
        where: {
          stripePaymentId: paymentIntent.id,
        },
      });

      if (existingOrder) {
        console.log('⚠️ Order already exists for this payment intent:', existingOrder.id);
        return;
      }

      const cartItems = JSON.parse(paymentIntent.metadata.cartItems);
      const category = paymentIntent.metadata.category || 'refrigeration-equipment';

      // Get customer email from charges (if available)
      const paymentIntentWithCharges = paymentIntent as any;
      const charges = paymentIntentWithCharges.charges?.data || [];
      const customerEmail = charges[0]?.billing_details?.email || 'unknown@email.com';
      const customerName = charges[0]?.billing_details?.name || 'Customer';
      const customerPhone = charges[0]?.billing_details?.phone || '';
      const billingAddress = charges[0]?.billing_details?.address;

      // Create invoice request
      const invoiceRequest = await prisma.invoiceRequest.create({
        data: {
          email: customerEmail,
          phone: customerPhone,
          fullName: customerName,
          address: billingAddress
            ? `${billingAddress.line1 || ''}${billingAddress.line2 ? ', ' + billingAddress.line2 : ''}, ${billingAddress.city || ''}, ${billingAddress.state || ''} ${billingAddress.postal_code || ''}, ${billingAddress.country || ''}`
            : '',
          totalAmount: paymentIntent.amount / 100,
          totalWithTax: paymentIntent.amount / 100,
          products: cartItems,
          projectName: `Order from ${customerName}`,
          category: category,
          status: 'PAID',
        },
      });

      // Create order
      const order = await prisma.order.create({
        data: {
          invoiceId: invoiceRequest.id,
          customerName: customerName,
          customerEmail: customerEmail,
          customerPhone: customerPhone,
          amountPaid: paymentIntent.amount / 100,
          currency: paymentIntent.currency,
          stripeSessionId: `pi_${paymentIntent.id}`, // Fallback session ID
          stripePaymentId: paymentIntent.id,
          status: 'PAID',
          category: category,
          shippingName: customerName,
          shippingAddress: billingAddress?.line1 || '',
          shippingCity: billingAddress?.city || '',
          shippingState: billingAddress?.state || '',
          shippingZip: billingAddress?.postal_code || '',
          shippingCountry: billingAddress?.country || '',
          deliveryMethod: 'ship',
        },
      });

      console.log('✅ Order created from payment_intent.succeeded:', order.id, 'Category:', category);
    }
  } catch (error) {
    console.error('❌ Error in handlePaymentIntentSucceeded:', error);
  }
}

/**
 * Handle failed payment intents
 */
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('Processing failed payment:', {
    paymentIntentId: paymentIntent.id,
    lastPaymentError: paymentIntent.last_payment_error?.message,
  });

  // TODO: Handle failed payments
  // - Notify customer
  // - Update order status
  // - Log for investigation
}

/**
 * Handle refunded charges
 */
async function handleChargeRefunded(charge: Stripe.Charge) {
  console.log('Processing refund:', {
    chargeId: charge.id,
    amount: charge.amount_refunded,
    refunded: charge.refunded,
  });

  // TODO: Handle refunds
  // - Update order status
  // - Restore inventory
  // - Send confirmation email
}

/**
 * GET handler - Returns webhook configuration info
 */
export async function GET() {
  return NextResponse.json({
    message: 'Stripe Webhook Endpoint',
    configured: !!webhookSecret,
    note: 'This endpoint should be configured in your Stripe Dashboard',
    events: [
      'checkout.session.completed',
      'checkout.session.expired',
      'payment_intent.succeeded',
      'payment_intent.payment_failed',
      'charge.refunded',
    ],
  });
}
