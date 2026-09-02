import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import Stripe from 'stripe';
import nodemailer from 'nodemailer';
import { logoAttachment } from '@/lib/logo';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USERNAME || process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD || process.env.SMTP_PASS,
  },
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-03-25.dahlia',
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { action, totalAmount, message, deliveryTime, offerDiscount, tax, deliveryCost, totalWithTax, deliveryNotes } = body;

    const invoice = await prisma.invoiceRequest.findUnique({
      where: { id },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const baseUrl = process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'));

    if (action === 'APPROVE_INVOICE' || !action) {
      // Update invoice with final amounts and create Stripe payment link
      const finalTotalAmount = totalWithTax ? parseFloat(totalWithTax) : (invoice.totalAmount || 0);

      // Create Stripe Checkout Session for this invoice
      let stripeCheckoutUrl = null;
      let stripeSessionId = null;

      try {
        // Parse products from invoice
        const products = Array.isArray(invoice.products) ? invoice.products : [];

        if (products.length > 0) {
          // Convert invoice products to Stripe line items
          const lineItems = products.map((item: any) => ({
            price_data: {
              currency: 'usd',
              product_data: {
                name: item.name || item.title || 'Product',
                images: item.image ? [item.image] : [],
                description: `${item.brand || ''} - ${item.category || 'Product'}`.trim(),
              },
              unit_amount: Math.round((item.price || 0) * 100), // Convert to cents
            },
            quantity: item.quantity || 1,
          }));

          // Add delivery/shipping cost if exists
          if (deliveryCost && deliveryCost > 0) {
            lineItems.push({
              price_data: {
                currency: 'usd',
                product_data: {
                  name: 'Delivery & Shipping',
                  description: 'Freight and delivery charges',
                  images: [],
                },
                unit_amount: Math.round(deliveryCost * 100),
              },
              quantity: 1,
            });
          }

          // Add tax if exists
          if (tax && tax > 0) {
            lineItems.push({
              price_data: {
                currency: 'usd',
                product_data: {
                  name: 'Tax',
                  description: 'Sales tax',
                  images: [],
                },
                unit_amount: Math.round(tax * 100),
              },
              quantity: 1,
            });
          }

          // Create Stripe Checkout Session
          const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&invoice_id=${id}`,
            cancel_url: `${baseUrl}/checkout?canceled=true&invoice_id=${id}`,
            customer_email: invoice.email,
            metadata: {
              invoiceId: id,
              customerName: invoice.fullName,
              category: invoice.category || 'general',
            },
          });

          stripeCheckoutUrl = session.url;
          stripeSessionId = session.id;
        }
      } catch (stripeError) {
        console.error('Failed to create Stripe checkout session:', stripeError);
        // Continue even if Stripe fails - admin can manually send payment link later
      }

      const updatedInvoice = await prisma.invoiceRequest.update({
        where: { id },
        data: {
          status: 'INVOICED',
          totalAmount: finalTotalAmount > 0 ? finalTotalAmount : invoice.totalAmount,
          totalWithTax: finalTotalAmount > 0 ? finalTotalAmount : invoice.totalWithTax,
          deliveryTime: deliveryTime || invoice.deliveryTime,
          offerDiscount: offerDiscount !== undefined ? offerDiscount : invoice.offerDiscount,
          tax: tax !== undefined ? tax : invoice.tax,
          deliveryCost: deliveryCost !== undefined ? deliveryCost : invoice.deliveryCost,
          deliveryNotes: deliveryNotes || invoice.deliveryNotes,
          stripeCheckoutUrl,
          stripeSessionId,
        },
      });

      return NextResponse.json({
        ...updatedInvoice,
        stripeCheckoutUrl,
      });

    } else if (action === 'APPROVE_ORDER') {
      // This is called AFTER payment is made (or manually to just approve).
      const updatedInvoice = await prisma.invoiceRequest.update({
        where: { id },
        data: { status: 'APPROVED' },
      });

      const amount = updatedInvoice.totalAmount || 0;

      try {
        // Check if order already exists
        const existingOrder = await prisma.order.findUnique({
          where: { invoiceId: id },
        });

        if (!existingOrder) {
          // Create order entry
          await prisma.order.create({
            data: {
              invoiceId: id,
              customerName: updatedInvoice.fullName,
              customerEmail: updatedInvoice.email,
              amountPaid: amount,
              currency: 'usd',
              stripeSessionId: updatedInvoice.stripeSessionId || `manual_${id}_${Date.now()}`,
              stripePaymentId: `manual_${id}`,
              status: 'PAID',
              category: updatedInvoice.category
            }
          });
        }
      } catch (orderError) {
        console.error('Error creating order:', orderError);
        // Continue even if order creation fails
      }

      return NextResponse.json(updatedInvoice);

    } else if (action === 'SEND_INVOICE') {
      // Send invoice email with Stripe payment link
      if (!invoice.stripeCheckoutUrl) {
        return NextResponse.json({
          error: 'No payment link available. Please approve the invoice first.'
        }, { status: 400 });
      }

      const emailSubject = `Invoice - ${invoice.fullName}`;
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2563eb;">ICEMANZ Invoice</h1>
          <p>Dear ${invoice.fullName},</p>
          <p>Your invoice is ready. Please review the details below:</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Invoice Details</h3>
            <p><strong>Total Amount:</strong> $${(invoice.totalWithTax || invoice.totalAmount || 0).toFixed(2)}</p>
            ${invoice.deliveryTime ? `<p><strong>Delivery Time:</strong> ${invoice.deliveryTime}</p>` : ''}
            ${invoice.deliveryNotes ? `<p><strong>Delivery Notes:</strong> ${invoice.deliveryNotes}</p>` : ''}
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${invoice.stripeCheckoutUrl}" 
               style="background-color: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Pay Invoice Now
            </a>
          </div>

          ${message ? `<div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Message from ICEMANZ:</strong></p>
            <p style="margin: 10px 0 0 0;">${message}</p>
          </div>` : ''}

          <p>If you have any questions, please don't hesitate to contact us.</p>
          <p>Best regards,<br>The ICEMANZ Team</p>
        </div>
      `;

      await transporter.sendMail({
        from: `"ICEMANZ" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: invoice.email,
        subject: emailSubject,
        html: emailHtml,
        attachments: [logoAttachment]
      });

      return NextResponse.json({ success: true, message: 'Invoice email sent successfully' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Approve invoice error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process invoice' },
      { status: 500 }
    );
  }
}
