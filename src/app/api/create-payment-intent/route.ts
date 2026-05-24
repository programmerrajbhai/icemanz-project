import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { amount, items, email, fullName, phone, address } = await request.json();
    console.log("[CREATE-PAYMENT-INTENT] Received data:", { email, fullName, phone, address });

    // Determine the category from the cart items
    const category = items.some((item: any) => item.category === 'walk-in-cooler-freezer')
      ? 'walk-in-cooler-freezer'
      : 'refrigeration-equipment';

    // Create InvoiceRequest in database
    const invoiceRequest = await prisma.invoiceRequest.create({
      data: {
        email: email || 'customer@example.com',
        phone: phone || '',
        fullName: fullName || 'Customer',
        address: address || '',
        totalAmount: amount,
        totalWithTax: amount,
        products: items,
        category: category,
        status: 'PENDING'
      }
    });
    console.log("[CREATE-PAYMENT-INTENT] InvoiceRequest created with email:", invoiceRequest.email);

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe payment is not configured' },
        { status: 500 }
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // Create Stripe Payment Intent for inline payment
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      payment_method_types: ['card'],
      metadata: {
        invoiceId: invoiceRequest.id,
        customerName: fullName || 'Customer',
        customerEmail: email || 'customer@example.com',
      },
    });
    console.log("[CREATE-PAYMENT-INTENT] Stripe payment intent created with metadata:", paymentIntent.metadata);

    // Update invoiceRequest with paymentIntentId
    await prisma.invoiceRequest.update({
      where: { id: invoiceRequest.id },
      data: {
        stripeSessionId: paymentIntent.id,
        status: 'APPROVED'
      }
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error('Stripe error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
