import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
});

export async function POST(request: Request) {
  try {
    const { amount, currency, address } = await request.json();

    // Create a Tax Calculation using Stripe Tax
    const taxCalculation = await stripe.tax.calculations.create({
      currency: currency.toLowerCase(),
      line_items: [
        {
          amount: Math.round(amount * 100), // Convert to cents
          reference: 'product',
        },
      ],
      customer_details: {
        address: {
          line1: address.line1,
          line2: address.line2 || undefined,
          city: address.city,
          state: address.state,
          postal_code: address.postal_code,
          country: address.country,
        },
        address_source: 'shipping',
      },
    });

    return NextResponse.json({
      tax: taxCalculation.tax_amount_exclusive,
      taxRate: taxCalculation.tax_breakdown?.[0]?.tax_rate_details?.percentage_decimal || 0,
      breakdown: taxCalculation.tax_breakdown,
    });
  } catch (error: any) {
    console.error('Tax calculation error:', error);
    
    // Return 0 tax as fallback
    return NextResponse.json(
      { 
        tax: 0,
        taxRate: 0,
        error: error.message 
      },
      { status: 200 } // Return 200 so frontend doesn't break
    );
  }
}
