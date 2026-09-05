import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';
import nodemailer from 'nodemailer';
import { logoAttachment } from '@/lib/logo';
import { generateOrderReceiptEmailHtml } from '@/lib/orderEmailTemplate';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USERNAME || process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD || process.env.SMTP_PASS,
  },
});

export async function POST(req: Request) {
  try {
    const { paymentIntentId } = await req.json();

    if (!paymentIntentId) {
      return NextResponse.json({ error: 'Missing paymentIntentId' }, { status: 400 });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe is not configured' },
        { status: 500 }
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // Retrieve the payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json({ error: 'Payment not successful yet' }, { status: 400 });
    }

    const invoiceId = paymentIntent.metadata?.invoiceId;
    const customerName = paymentIntent.metadata?.customerName || 'Customer';
    const customerEmail = paymentIntent.metadata?.customerEmail || '';
    const amountPaid = paymentIntent.amount / 100;
    const currency = paymentIntent.currency;
    const stripePaymentId = paymentIntent.id;
    const stripeSessionId = paymentIntent.id;

    if (!invoiceId) {
      return NextResponse.json({ error: 'No invoiceId in metadata' }, { status: 400 });
    }

    // Check if order already exists
    const existingOrder = await prisma.order.findUnique({
      where: { invoiceId }
    });

    if (existingOrder) {
      return NextResponse.json({ success: true, message: 'Order already processed', orderId: existingOrder.id });
    }

    // Determine the base URL for redirects and images - use a public URL for emails
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://icemanz.com');

    // Update InvoiceRequest status to PAID
    await prisma.invoiceRequest.update({
      where: { id: invoiceId },
      data: { status: 'PAID' }
    });

    // Get the invoice to get the category
    const invoice = await prisma.invoiceRequest.findUnique({
      where: { id: invoiceId }
    });

    // Create Order entry
    const newOrder = await prisma.order.create({
      data: {
        invoiceId,
        customerName,
        customerEmail,
        amountPaid,
        currency,
        stripeSessionId,
        stripePaymentId,
        status: 'PAID',
        category: invoice?.category
      }
    });

    // Parse invoice products if available
    let invoiceProducts: any[] = [];
    if (invoice?.products) {
      if (Array.isArray(invoice.products)) {
        invoiceProducts = invoice.products;
      } else if (typeof invoice.products === 'string') {
        try {
          invoiceProducts = JSON.parse(invoice.products);
        } catch (e) {}
      }
    }

    const emailHtml = generateOrderReceiptEmailHtml({
      orderId: newOrder.id,
      customerName,
      customerEmail,
      amountPaid,
      currency,
      deliveryCost: invoice?.deliveryCost,
      tax: invoice?.tax,
      subtotal: invoice?.totalAmount,
      products: invoiceProducts,
      invoiceDetails: {
        projectName: invoice?.projectName || undefined,
        description: invoice?.description || undefined,
        deliveryTime: invoice?.deliveryTime || undefined,
        deliveryNotes: invoice?.deliveryNotes || undefined,
      }
    });

    console.log("Attempting to send email to:", customerEmail);

    try {
      const info = await transporter.sendMail({
        from: `"ICEMANZ Support" <${process.env.SMTP_FROM || process.env.SMTP_USERNAME || process.env.SMTP_USER}>`,
        to: customerEmail,
        subject: `Payment Receipt & Order Confirmation - Order #${newOrder.id}`,
        html: emailHtml,
        attachments: [logoAttachment]
      });
      console.log("Email sent successfully! Message ID:", info.messageId);
    } catch (emailError) {
      console.error("Failed to send receipt email:", emailError);
    }

    return NextResponse.json({ success: true, orderId: newOrder.id });
  } catch (error: any) {
    console.error('Error processing confirm-payment:', error);
    return NextResponse.json({ error: 'Confirmation handler failed' }, { status: 500 });
  }
}
