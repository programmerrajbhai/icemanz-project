import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';
import nodemailer from 'nodemailer';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(req: Request) {
  const payload = await req.text();
  const signature = req.headers.get('stripe-signature');

  let event: Stripe.Event;

  try {
    if (!signature || !webhookSecret) {
      throw new Error('Missing stripe signature or webhook secret');
    }
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        // Retrieve metadata we set during session creation
        const invoiceId = session.metadata?.invoiceId;
        const customerName = session.metadata?.customerName || 'Customer';
        const customerEmail = session.metadata?.customerEmail || session.customer_details?.email || '';
        const amountPaid = session.amount_total ? session.amount_total / 100 : 0;

        if (invoiceId) {
          // Determine the base URL for redirects and images
          const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

          // Update InvoiceRequest status to PAID
          await prisma.invoiceRequest.update({
            where: { id: invoiceId },
            data: { status: 'PAID' }
          });

          // Create Order entry
          const newOrder = await prisma.order.create({
            data: {
              invoiceId,
              customerName,
              customerEmail,
              amountPaid,
              currency: session.currency || 'usd',
              stripeSessionId: session.id,
              stripePaymentId: session.payment_intent as string,
              status: 'PAID'
            }
          });

          // Send confirmation email to customer
          const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
              <div style="text-align: center; margin-bottom: 25px;">
                <img src="${baseUrl}/logo.png" alt="ICEMANZ Logo" style="max-width: 160px; height: auto;" />
              </div>
              
              <h2 style="color: #10b981; text-align: center; margin-top: 0; font-size: 24px; font-weight: bold;">Payment Successful!</h2>
              
              <div style="color: #334155; font-size: 16px; line-height: 1.6;">
                <p>Hello <strong>${customerName}</strong>,</p>
                <p>We have successfully received your payment of <strong>$${amountPaid.toFixed(2)}</strong>.</p>
              </div>
              
              <div style="background-color: #f8fafc; padding: 20px 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #10b981;">
                <h3 style="margin-top: 0; margin-bottom: 15px; color: #0f172a; font-size: 18px;">Order Details</h3>
                <p style="margin: 0 0 10px 0; font-size: 15px; color: #475569;"><strong>Order ID:</strong> <span style="color: #0f172a;">${newOrder.id}</span></p>
                <p style="margin: 0 0 10px 0; font-size: 15px; color: #475569;"><strong>Amount Paid:</strong> <span style="color: #0f172a; font-weight: bold;">$${amountPaid.toFixed(2)}</span></p>
                <p style="margin: 0; font-size: 15px; color: #475569;"><strong>Status:</strong> <span style="color: #10b981; font-weight: bold;">Paid</span></p>
              </div>

              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />

              <p style="color: #64748b; font-size: 13px; text-align: center; margin-bottom: 0; line-height: 1.5;">
                Our team will start processing your order right away. You will receive further updates soon.<br/><br/>
                If you have any questions, please contact our support team.<br/>
                &copy; ${new Date().getFullYear()} ICEMANZ. All rights reserved.
              </p>
            </div>
          `;

          try {
            await transporter.sendMail({
              from: `"ICEMANZ Support" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
              to: customerEmail,
              subject: `Payment Receipt - Order #${newOrder.id}`,
              html: emailHtml,
            });
          } catch (emailError) {
            console.error("Failed to send receipt email:", emailError);
          }
        }
        break;
      }
      // Handle other event types if necessary
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
