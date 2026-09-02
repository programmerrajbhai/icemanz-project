import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-03-25.dahlia',
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const invoice = await prisma.invoiceRequest.findUnique({
      where: { id },
      include: { order: true }
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    if (invoice.status === 'PAID') {
      return NextResponse.json({
        message: 'Invoice is already marked as paid',
        status: 'PAID',
        orderId: invoice.order?.id
      }, { status: 200 });
    }

    if (!invoice.stripeSessionId) {
      return NextResponse.json({
        error: 'No Stripe session linked to this invoice. Please approve the invoice first to generate a payment link.'
      }, { status: 400 });
    }

    // Check Stripe session status
    try {
      const session = await stripe.checkout.sessions.retrieve(invoice.stripeSessionId);

      if (session.payment_status === 'paid') {
        // Payment is confirmed! Update status and create order if not exists
        await prisma.invoiceRequest.update({
          where: { id },
          data: { status: 'PAID' }
        });

        let order = invoice.order;
        if (!order) {
          order = await prisma.order.create({
            data: {
              invoiceId: invoice.id,
              customerName: invoice.fullName,
              customerEmail: invoice.email,
              amountPaid: session.amount_total ? session.amount_total / 100 : (invoice.totalWithTax || invoice.totalAmount || 0),
              currency: session.currency || 'usd',
              stripeSessionId: session.id,
              stripePaymentId: session.payment_intent as string || `manual_${Date.now()}`,
              status: 'PAID',
              category: invoice.category
            }
          });
        }

        return NextResponse.json({
          message: 'Payment verified and order created',
          status: 'PAID',
          orderId: order.id,
          amountPaid: session.amount_total ? session.amount_total / 100 : 0
        });
      } else {
        return NextResponse.json({
          message: `Payment status: ${session.payment_status}`,
          status: invoice.status,
          paymentStatus: session.payment_status
        });
      }
    } catch (stripeError: any) {
      console.error('Stripe verification error:', stripeError);
      return NextResponse.json({
        error: 'Failed to verify payment with Stripe',
        details: stripeError.message
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Verify Payment Error:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment', details: error.message },
      { status: 500 }
    );
  }
}
