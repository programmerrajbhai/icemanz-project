import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';
import nodemailer from 'nodemailer';
import { buildOrderEmailAttachments, generateOrderReceiptEmailHtml, generateOrderReceiptEmailText } from '@/lib/orderEmailTemplate';
import { buildAdminOrderEmailHtml } from '@/lib/adminEmailTemplate';

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
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: 'Stripe webhook is not configured' },
      { status: 500 }
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  const payload = await req.text();
  const signature = req.headers.get('stripe-signature');

  let event: Stripe.Event;

  try {
    if (!signature) {
      throw new Error('Missing stripe signature');
    }
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
      case 'payment_intent.succeeded': {
        let invoiceId: string | undefined;
        let customerName: string = 'Customer';
        let customerEmail: string = '';
        let amountPaid: number = 0;
        let currency: string = 'usd';
        let stripeSessionId: string = '';
        let stripePaymentId: string = '';
        let category: string = 'general';
        let customerPhone: string = '';
        let shippingName: string = '';
        let shippingAddress: string = '';
        let shippingCity: string = '';
        let shippingState: string = '';
        let shippingZip: string = '';
        let shippingCountry: string = '';
        let deliveryMethod: string = '';

        if (event.type === 'checkout.session.completed') {
          const session = event.data.object as Stripe.Checkout.Session;
          invoiceId = session.metadata?.invoiceId;
          customerName = session.metadata?.customerName || session.customer_details?.name || 'Customer';
          customerEmail = session.customer_details?.email || session.metadata?.customerEmail || '';
          customerPhone = session.customer_details?.phone || session.metadata?.customerPhone || '';
          amountPaid = session.amount_total ? session.amount_total / 100 : 0;
          currency = session.currency || 'usd';
          stripeSessionId = session.id;
          stripePaymentId = session.payment_intent as string;
          category = session.metadata?.category || 'general';
          deliveryMethod = session.metadata?.deliveryMethod || '';

          // Extract shipping details if available
          const sessionWithShipping = session as any;
          if (sessionWithShipping.shipping_details) {
            shippingName = sessionWithShipping.shipping_details.name || '';
            shippingAddress = sessionWithShipping.shipping_details.address?.line1
              ? `${sessionWithShipping.shipping_details.address.line1}${sessionWithShipping.shipping_details.address.line2 ? ', ' + sessionWithShipping.shipping_details.address.line2 : ''}`
              : '';
            shippingCity = sessionWithShipping.shipping_details.address?.city || '';
            shippingState = sessionWithShipping.shipping_details.address?.state || '';
            shippingZip = sessionWithShipping.shipping_details.address?.postal_code || '';
            shippingCountry = sessionWithShipping.shipping_details.address?.country || '';
          }
        } else {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          invoiceId = paymentIntent.metadata?.invoiceId;

          // Get customer information from billing_details if available
          let billingDetails: any = null;
          let shippingDetails: any = null;

          // Fetch full payment intent to get payment_method details
          try {
            const fullPaymentIntent = await stripe.paymentIntents.retrieve(paymentIntent.id, {
              expand: ['payment_method', 'shipping']
            });

            if (fullPaymentIntent.payment_method && typeof fullPaymentIntent.payment_method === 'object') {
              billingDetails = fullPaymentIntent.payment_method.billing_details;
            }

            if (fullPaymentIntent.shipping) {
              shippingDetails = fullPaymentIntent.shipping;
            }
          } catch (err) {
            console.error('[WEBHOOK] Failed to retrieve full payment intent:', err);
          }

          // Extract customer info from billing details
          customerName = billingDetails?.name || paymentIntent.metadata?.customerName || 'Customer';
          customerEmail = billingDetails?.email || paymentIntent.metadata?.customerEmail || '';
          customerPhone = billingDetails?.phone || paymentIntent.metadata?.customerPhone || '';

          amountPaid = paymentIntent.amount / 100;
          currency = paymentIntent.currency;
          stripePaymentId = paymentIntent.id;
          stripeSessionId = paymentIntent.id;
          category = paymentIntent.metadata?.category || 'general';
          deliveryMethod = paymentIntent.metadata?.deliveryMethod || '';

          // Extract shipping details if available
          if (shippingDetails) {
            shippingName = shippingDetails.name || '';
            shippingAddress = shippingDetails.address?.line1
              ? `${shippingDetails.address.line1}${shippingDetails.address.line2 ? ', ' + shippingDetails.address.line2 : ''}`
              : '';
            shippingCity = shippingDetails.address?.city || '';
            shippingState = shippingDetails.address?.state || '';
            shippingZip = shippingDetails.address?.postal_code || '';
            shippingCountry = shippingDetails.address?.country || '';

            // Infer delivery method from presence of shipping address
            if (shippingAddress) {
              deliveryMethod = 'ship';
            }
          }

          // If no shipping address, assume pickup
          if (!deliveryMethod && !shippingAddress) {
            deliveryMethod = 'pickup';
          }
        }

        if (invoiceId) {
          // Payment from invoice flow
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
              customerPhone,
              amountPaid,
              currency,
              stripeSessionId,
              stripePaymentId,
              status: 'PAID',
              category: invoice?.category,
              deliveryMethod,
              shippingName,
              shippingAddress,
              shippingCity,
              shippingState,
              shippingZip,
              shippingCountry,
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
              } catch (e) { }
            }
          }

          const emailParams = {
            orderId: newOrder.id,
            customerName,
            customerEmail,
            customerPhone,
            amountPaid,
            currency,
            deliveryMethod,
            shippingName,
            shippingAddress,
            shippingCity,
            shippingState,
            shippingZip,
            shippingCountry,
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
          };

          const { attachments, imageCidMap } = buildOrderEmailAttachments(invoiceProducts);
          const emailHtml = generateOrderReceiptEmailHtml(emailParams, imageCidMap);
          const emailText = generateOrderReceiptEmailText(emailParams);

          console.log("[WEBHOOK] Attempting to send email to:", customerEmail);

          try {
            const info = await transporter.sendMail({
              from: `"ICEMANZ Support" <${process.env.SMTP_FROM || process.env.SMTP_USERNAME || process.env.SMTP_USER}>`,
              to: customerEmail,
              subject: `ICEMANZ Order Summary - #${newOrder.id}`,
              text: emailText,
              html: emailHtml,
              attachments
            });
            console.log("[WEBHOOK] Email sent successfully! Message ID:", info.messageId);
          } catch (emailError) {
            console.error("[WEBHOOK] Failed to send receipt email:", emailError);
          }

          // Send admin notification
          if (process.env.ADMIN_EMAIL) {
            try {
              const adminHtml = buildAdminOrderEmailHtml({
                orderId: newOrder.id,
                customerName, customerEmail, customerPhone,
                amountPaid, deliveryMethod,
                shippingName, shippingAddress, shippingCity, shippingState, shippingZip, shippingCountry,
                products: invoiceProducts,
                subtotal: invoice?.totalAmount ?? amountPaid,
                shippingCost: invoice?.deliveryCost ?? 0,
                tax: invoice?.tax ?? 0,
              });
              await transporter.sendMail({
                from: `"ICEMANZ Orders" <${process.env.SMTP_FROM || process.env.SMTP_USERNAME}>`,
                to: process.env.ADMIN_EMAIL,
                subject: `🛒 New Order #${newOrder.id.slice(0, 8).toUpperCase()} - $${amountPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })} - ${customerName}`,
                html: adminHtml,
              });
              console.log("[WEBHOOK] Admin notification sent to:", process.env.ADMIN_EMAIL);
            } catch (adminEmailError) {
              console.error("[WEBHOOK] Failed to send admin notification:", adminEmailError);
            }
          }
        } else {
          // Payment from direct checkout (cart flow without invoice)
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          console.log('[WEBHOOK] Direct checkout payment received (no invoiceId)');
          console.log('[WEBHOOK] Customer:', { customerName, customerEmail, customerPhone });
          console.log('[WEBHOOK] Shipping:', { deliveryMethod, shippingName, shippingAddress, shippingCity, shippingState, shippingZip, shippingCountry });

          // Extract cart items from metadata
          let cartItemsData = [];
          const preCreatedInvoiceId = (event.data.object as any).metadata?.invoiceRequestId;

          // ── Read shipping/tax breakdown from PaymentIntent metadata ─────────
          // update-payment-intent stores these after the customer enters their address
          const metaShipping = parseFloat((event.data.object as any).metadata?.shippingCharge || '0') || 0;
          const metaTax = parseFloat((event.data.object as any).metadata?.taxAmount || '0') || 0;
          const metaSubtotal = parseFloat((event.data.object as any).metadata?.subtotal || '0') || 0;
          // amountPaid is the ground-truth total from Stripe (subtotal + shipping + tax)
          const derivedSubtotal = metaSubtotal > 0 ? metaSubtotal : amountPaid - metaShipping - metaTax;
          // ────────────────────────────────────────────────────────────────────

          // Try to use pre-created invoice (with full product data incl. selectedOptions)
          let tempInvoice: any = null;
          if (preCreatedInvoiceId) {
            tempInvoice = await prisma.invoiceRequest.findUnique({ where: { id: preCreatedInvoiceId } });
            if (tempInvoice && Array.isArray(tempInvoice.products)) {
              cartItemsData = tempInvoice.products as any[];
              console.log('[WEBHOOK] Using pre-created invoice products:', cartItemsData.length, 'items');
            }
          }

          if (!tempInvoice) {
            // Fallback: parse stripped cartItems from Stripe metadata
            try {
              const cartItemsStr = (event.data.object as any).metadata?.cartItems;
              if (cartItemsStr) {
                cartItemsData = JSON.parse(cartItemsStr);
                console.log('[WEBHOOK] Cart items from metadata:', cartItemsData.length, 'items');
              }
            } catch (err) {
              console.error('[WEBHOOK] Failed to parse cart items:', err);
            }

            // Create invoice request for direct checkout
            console.log('[WEBHOOK] Creating invoice request for direct checkout order');
            tempInvoice = await prisma.invoiceRequest.create({
              data: {
                email: customerEmail,
                fullName: customerName,
                phone: customerPhone,
                status: 'PAID',
                totalAmount: derivedSubtotal > 0 ? derivedSubtotal : amountPaid,
                totalWithTax: amountPaid,
                deliveryCost: metaShipping,
                tax: metaTax,
                stripeSessionId,
                products: cartItemsData,
                category,
                address: shippingAddress ? `${shippingAddress}, ${shippingCity}, ${shippingState} ${shippingZip}, ${shippingCountry}` : undefined,
                deliveryNotes: deliveryMethod === 'pickup' ? 'Customer will pick up from: 184-60 Jamaica Ave, Hollis, NY 11423, United States' : undefined,
              }
            });
          } else {
            // Update pre-created invoice with confirmed customer/shipping info + breakdown
            await prisma.invoiceRequest.update({
              where: { id: preCreatedInvoiceId },
              data: {
                email: customerEmail || tempInvoice.email,
                fullName: customerName || tempInvoice.fullName,
                phone: customerPhone || tempInvoice.phone,
                status: 'PAID',
                totalAmount: derivedSubtotal > 0 ? derivedSubtotal : amountPaid,
                totalWithTax: amountPaid,
                deliveryCost: metaShipping,
                tax: metaTax,
                stripeSessionId,
                category,
                address: shippingAddress ? `${shippingAddress}, ${shippingCity}, ${shippingState} ${shippingZip}, ${shippingCountry}` : tempInvoice.address,
                deliveryNotes: deliveryMethod === 'pickup' ? 'Customer will pick up from: 184-60 Jamaica Ave, Hollis, NY 11423, United States' : undefined,
              }
            });
          }

          console.log('[WEBHOOK] Invoice request ready:', tempInvoice.id);

          // Now create order with the invoice
          const newOrder = await prisma.order.create({
            data: {
              invoiceId: tempInvoice.id,
              customerName,
              customerEmail,
              customerPhone,
              amountPaid,
              currency,
              stripeSessionId,
              stripePaymentId,
              status: 'PAID',
              category,
              deliveryMethod,
              shippingName,
              shippingAddress,
              shippingCity,
              shippingState,
              shippingZip,
              shippingCountry,
            }
          });

          console.log('[WEBHOOK] Order created:', newOrder.id);

          const emailParams = {
            orderId: newOrder.id,
            customerName,
            customerEmail,
            customerPhone,
            amountPaid,
            currency,
            deliveryMethod,
            shippingName,
            shippingAddress,
            shippingCity,
            shippingState,
            shippingZip,
            shippingCountry,
            subtotal: derivedSubtotal > 0 ? derivedSubtotal : amountPaid,
            deliveryCost: metaShipping,
            tax: metaTax,
            products: cartItemsData,
          };

          const { attachments, imageCidMap } = buildOrderEmailAttachments(cartItemsData);
          const emailHtml = generateOrderReceiptEmailHtml(emailParams, imageCidMap);
          const emailText = generateOrderReceiptEmailText(emailParams);

          try {
            await transporter.sendMail({
              from: `"ICEMANZ Support" <${process.env.SMTP_FROM || process.env.SMTP_USERNAME || process.env.SMTP_USER}>`,
              to: customerEmail,
              subject: `ICEMANZ Order Summary - #${newOrder.id}`,
              text: emailText,
              html: emailHtml,
              attachments
            });
            console.log("[WEBHOOK] Email sent successfully for direct checkout");
          } catch (emailError) {
            console.error("[WEBHOOK] Failed to send receipt email:", emailError);
          }

          // Send admin notification for direct checkout
          // Send admin notification for direct checkout
          if (process.env.ADMIN_EMAIL) {
            try {
              const adminHtml = buildAdminOrderEmailHtml({
                orderId: newOrder.id,
                customerName, customerEmail, customerPhone,
                amountPaid, deliveryMethod,
                shippingName, shippingAddress, shippingCity, shippingState, shippingZip, shippingCountry,
                products: cartItemsData,
                subtotal: derivedSubtotal > 0 ? derivedSubtotal : amountPaid,
                shippingCost: metaShipping,
                tax: metaTax,
              });
              await transporter.sendMail({
                from: `"ICEMANZ Orders" <${process.env.SMTP_FROM || process.env.SMTP_USERNAME}>`,
                to: process.env.ADMIN_EMAIL,
                subject: `🛒 New Order #${newOrder.id.slice(0, 8).toUpperCase()} - $${amountPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })} - ${customerName}`,
                html: adminHtml,
              });
              console.log("[WEBHOOK] Admin notification sent to:", process.env.ADMIN_EMAIL);
            } catch (adminEmailError) {
              console.error("[WEBHOOK] Failed to send admin notification:", adminEmailError);
            }
          }
        } // end else (direct checkout)
      }
        break;
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
