import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const paymentIntentId = searchParams.get('pi');

  if (!paymentIntentId) {
    return NextResponse.json({ error: 'Pass ?pi=pi_xxx' }, { status: 400 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const pi = await stripe.paymentIntents.retrieve(paymentIntentId);

  return NextResponse.json({
    id: pi.id,
    status: pi.status,
    metadata: pi.metadata,
    amount: pi.amount / 100,
  });
}
