import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
  typescript: true,
});

/**
 * GET /api/checkout_sessions/[session_id]
 * Retrieves the status and details of a specific checkout session
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ session_id: string }> }
) {
  try {
    const { session_id } = await params;

    // Validate session_id parameter
    if (!session_id || typeof session_id !== 'string') {
      return NextResponse.json(
        {
          error: 'Missing or invalid session_id parameter',
          status: null,
        },
        { status: 400 }
      );
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['line_items', 'payment_intent', 'customer'], // Expand related objects
    });

    // Extract relevant information
    const responseData = {
      session_id: session.id,
      status: session.status, // 'complete', 'expired', 'open'
      payment_status: session.payment_status, // 'paid', 'unpaid', 'no_payment_required'
      customer_email: session.customer_email,
      customer_details: session.customer_details,
      amount_total: session.amount_total,
      amount_subtotal: session.amount_subtotal,
      currency: session.currency,
      shipping_details: (session as any).shipping_details,
      shipping_cost: (session as any).shipping_cost,
      line_items: session.line_items?.data || [],
      created: session.created,
      expires_at: session.expires_at,
      metadata: session.metadata,
      payment_intent: session.payment_intent,

      // Additional computed fields
      is_complete: session.status === 'complete',
      is_paid: session.payment_status === 'paid',
      total_display: session.amount_total
        ? `${(session.amount_total / 100).toFixed(2)} ${session.currency?.toUpperCase() || 'USD'}`
        : null,
    };

    return NextResponse.json(responseData, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // Cache for 1 minute if complete, no cache if pending
        'Cache-Control': session.status === 'complete'
          ? 'public, max-age=60, s-maxage=60'
          : 'no-store, no-cache, must-revalidate',
      },
    });

  } catch (error) {
    console.error('Error retrieving checkout session:', error);

    // Handle specific Stripe errors
    if (error instanceof Stripe.errors.StripeError) {
      if (error.type === 'StripeInvalidRequestError') {
        return NextResponse.json(
          {
            error: 'Invalid session ID or session not found',
            status: null,
            type: error.type,
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          error: error.message,
          status: null,
          type: error.type,
        },
        { status: error.statusCode || 500 }
      );
    }

    // Generic error handling
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    return NextResponse.json(
      {
        error: errorMessage,
        status: null,
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/checkout_sessions/[session_id]
 * Optional: Update or expire a session (if needed)
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ session_id: string }> }
) {
  try {
    const { session_id } = await params;
    const body = await req.json();

    // Example: Expire a session
    if (body.action === 'expire') {
      const session = await stripe.checkout.sessions.expire(session_id);

      return NextResponse.json({
        success: true,
        session_id: session.id,
        status: session.status,
        message: 'Session expired successfully',
      });
    }

    return NextResponse.json(
      { error: 'Invalid action. Supported actions: expire' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error updating checkout session:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const statusCode = error instanceof Stripe.errors.StripeError ? error.statusCode || 500 : 500;

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}
