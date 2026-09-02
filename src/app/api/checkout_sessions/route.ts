import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
  typescript: true,
});

/**
 * POST /api/checkout_sessions
 * Creates a new Stripe Checkout Session with embedded UI mode
 */
export async function POST(req: NextRequest) {
  try {
    // Get the origin from request headers for dynamic return URL
    const origin = req.headers.get('origin') || req.headers.get('referer')?.split('/').slice(0, 3).join('/') || 'http://localhost:3000';

    // Parse request body for custom line items (optional)
    let lineItems: any[] = [];

    try {
      const body = await req.json();
      if (body.lineItems && Array.isArray(body.lineItems)) {
        lineItems = body.lineItems;
      }
    } catch {
      // Use default line items if no body or parsing fails
    }

    // Default line items if none provided
    if (lineItems.length === 0) {
      lineItems = [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Sample Product',
              description: 'Premium quality product with excellent features',
              images: ['https://via.placeholder.com/300'],
            },
            unit_amount: 4999, // $49.99
          },
          quantity: 1,
        },
      ];
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',

      // Enable shipping address collection
      shipping_address_collection: {
        allowed_countries: [
          'US', 'CA', 'GB', 'AU', 'BD', 'IN', 'PK', 'AE', 'SA',
          'DE', 'FR', 'ES', 'IT', 'NL', 'BE', 'CH', 'AT', 'SE',
          'NO', 'DK', 'FI', 'PT', 'IE', 'PL', 'CZ', 'GR', 'JP',
          'SG', 'MY', 'TH', 'PH', 'ID', 'VN', 'NZ', 'ZA', 'BR',
          'MX', 'AR', 'CL', 'CO', 'PE', 'CR', 'PA', 'DO', 'JM',
        ],
      },

      // Enable promotion codes
      allow_promotion_codes: true,

      // Billing address collection
      billing_address_collection: 'required',

      // Return URL after checkout completion
      return_url: `${origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,

      // Additional metadata for tracking
      metadata: {
        created_at: new Date().toISOString(),
      },

      // Automatic tax calculation (optional, requires Stripe Tax setup)
      // automatic_tax: { enabled: true },

      // Payment method types
      payment_method_types: ['card'],

      // Customer email (optional - can be pre-filled if user is logged in)
      // customer_email: 'user@example.com',

      // Success and cancel URLs (not used in embedded mode, but good for fallback)
      // success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      // cancel_url: `${origin}/checkout/cancelled`,
    });

    // Return the client secret for embedded checkout
    return NextResponse.json(
      {
        clientSecret: session.client_secret,
        sessionId: session.id,
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error('Error creating checkout session:', error);

    // Type-safe error handling
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const statusCode = error instanceof Stripe.errors.StripeError ? error.statusCode || 500 : 500;

    return NextResponse.json(
      {
        error: errorMessage,
        details: error instanceof Stripe.errors.StripeError ? error.type : 'internal_error',
      },
      {
        status: statusCode,
      }
    );
  }
}

/**
 * GET /api/checkout_sessions
 * Optional: List recent sessions (for admin purposes)
 */
export async function GET() {
  return NextResponse.json(
    {
      message: 'Use POST to create a new checkout session',
      endpoints: {
        create: 'POST /api/checkout_sessions',
        retrieve: 'GET /api/checkout_sessions/[session_id]',
      },
    },
    { status: 200 }
  );
}
