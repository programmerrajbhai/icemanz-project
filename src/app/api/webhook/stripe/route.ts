import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';
import nodemailer from 'nodemailer';

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

          // Send confirmation email to customer
          const shippingInfo = deliveryMethod === 'ship' && shippingAddress
            ? `
              <div style="background-color: #eff6ff; padding: 20px 25px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
                <h3 style="margin-top: 0; margin-bottom: 15px; color: #0f172a; font-size: 18px;">Shipping Information</h3>
                <p style="margin: 0 0 8px 0; font-size: 15px; color: #475569;"><strong>Name:</strong> <span style="color: #0f172a;">${shippingName || customerName}</span></p>
                <p style="margin: 0 0 8px 0; font-size: 15px; color: #475569;"><strong>Address:</strong> <span style="color: #0f172a;">${shippingAddress}</span></p>
                <p style="margin: 0 0 8px 0; font-size: 15px; color: #475569;"><strong>City:</strong> <span style="color: #0f172a;">${shippingCity}</span></p>
                <p style="margin: 0 0 8px 0; font-size: 15px; color: #475569;"><strong>State:</strong> <span style="color: #0f172a;">${shippingState}</span></p>
                <p style="margin: 0 0 8px 0; font-size: 15px; color: #475569;"><strong>Zip:</strong> <span style="color: #0f172a;">${shippingZip}</span></p>
                <p style="margin: 0; font-size: 15px; color: #475569;"><strong>Country:</strong> <span style="color: #0f172a;">${shippingCountry}</span></p>
              </div>
            `
            : deliveryMethod === 'pickup'
              ? `
                <div style="background-color: #f0fdf4; padding: 20px 25px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
                  <h3 style="margin-top: 0; margin-bottom: 15px; color: #0f172a; font-size: 18px;">Pickup Information</h3>
                  <p style="margin: 0 0 8px 0; font-size: 15px; color: #475569;"><strong>Pickup Location:</strong></p>
                  <p style="margin: 0 0 8px 0; font-size: 15px; color: #0f172a;">866 Newark Tpke, Kearny NJ 07032, United States</p>
                  <p style="margin: 0; font-size: 14px; color: #059669; font-weight: 600;">✓ Usually ready in 2-4 days</p>
                </div>
              `
              : '';

          const contactInfo = customerPhone
            ? `<p style="margin: 0; font-size: 15px; color: #475569;"><strong>Phone:</strong> <span style="color: #0f172a;">${customerPhone}</span></p>`
            : '';

          const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
              <div style="text-align: center; margin-bottom: 25px;">
                <h1 style="color: #2563eb; margin: 0; font-size: 32px; font-weight: bold;">ICEMANZ</h1>
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
                ${contactInfo}
                <p style="margin: 0; font-size: 15px; color: #475569;"><strong>Status:</strong> <span style="color: #10b981; font-weight: bold;">Paid</span></p>
              </div>

              ${shippingInfo}

              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />

              <p style="color: #64748b; font-size: 13px; text-align: center; margin-bottom: 0; line-height: 1.5;">
                Our team will start processing your order right away. You will receive further updates soon.<br/><br/>
                If you have any questions, please contact our support team.<br/>
                &copy; ${new Date().getFullYear()} ICEMANZ. All rights reserved.
              </p>
            </div>
          `;

          console.log("[WEBHOOK] Attempting to send email to:", customerEmail);
          console.log("[WEBHOOK] SMTP config:", {
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_SECURE,
            user: process.env.SMTP_USERNAME || process.env.SMTP_USER,
            from: process.env.SMTP_FROM || process.env.SMTP_USERNAME || process.env.SMTP_USER
          });

          try {
            const info = await transporter.sendMail({
              from: `"ICEMANZ Support" <${process.env.SMTP_FROM || process.env.SMTP_USERNAME || process.env.SMTP_USER}>`,
              to: customerEmail,
              subject: `Payment Receipt - Order #${newOrder.id}`,
              html: emailHtml,
            });
            console.log("[WEBHOOK] Email sent successfully! Message ID:", info.messageId);
          } catch (emailError) {
            console.error("[WEBHOOK] Failed to send receipt email:", emailError);
          }
        } else {
          // Payment from direct checkout (cart flow without invoice)
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          console.log('[WEBHOOK] Direct checkout payment received (no invoiceId)');
          console.log('[WEBHOOK] Customer:', { customerName, customerEmail, customerPhone });
          console.log('[WEBHOOK] Shipping:', { deliveryMethod, shippingName, shippingAddress, shippingCity, shippingState, shippingZip, shippingCountry });

          // Extract cart items from metadata
          let cartItemsData = [];
          try {
            const cartItemsStr = paymentIntent.metadata?.cartItems;
            if (cartItemsStr) {
              cartItemsData = JSON.parse(cartItemsStr);
              console.log('[WEBHOOK] Cart items:', cartItemsData.length, 'items');
            }
          } catch (err) {
            console.error('[WEBHOOK] Failed to parse cart items:', err);
          }

          // Create invoice request for direct checkout
          console.log('[WEBHOOK] Creating invoice request for direct checkout order');
          const tempInvoice = await prisma.invoiceRequest.create({
            data: {
              email: customerEmail,
              fullName: customerName,
              phone: customerPhone,
              status: 'PAID',
              totalAmount: amountPaid,
              totalWithTax: amountPaid,
              stripeSessionId,
              products: cartItemsData,
              category,
              address: shippingAddress ? `${shippingAddress}, ${shippingCity}, ${shippingState} ${shippingZip}, ${shippingCountry}` : undefined,
              deliveryNotes: deliveryMethod === 'pickup' ? 'Customer will pick up from: 866 Newark Tpke, Kearny NJ 07032, United States' : undefined,
            }
          });

          console.log('[WEBHOOK] Invoice request created:', tempInvoice.id);

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

          // Send confirmation email
          const shippingInfo = deliveryMethod === 'ship' && shippingAddress
            ? `
              <div style="background-color: #eff6ff; padding: 20px 25px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
                <h3 style="margin-top: 0; margin-bottom: 15px; color: #0f172a; font-size: 18px;">Shipping Information</h3>
                <p style="margin: 0 0 8px 0; font-size: 15px; color: #475569;"><strong>Name:</strong> <span style="color: #0f172a;">${shippingName || customerName}</span></p>
                <p style="margin: 0 0 8px 0; font-size: 15px; color: #475569;"><strong>Address:</strong> <span style="color: #0f172a;">${shippingAddress}</span></p>
                <p style="margin: 0 0 8px 0; font-size: 15px; color: #475569;"><strong>City:</strong> <span style="color: #0f172a;">${shippingCity}</span></p>
                <p style="margin: 0 0 8px 0; font-size: 15px; color: #475569;"><strong>State:</strong> <span style="color: #0f172a;">${shippingState}</span></p>
                <p style="margin: 0 0 8px 0; font-size: 15px; color: #475569;"><strong>Zip:</strong> <span style="color: #0f172a;">${shippingZip}</span></p>
                <p style="margin: 0; font-size: 15px; color: #475569;"><strong>Country:</strong> <span style="color: #0f172a;">${shippingCountry}</span></p>
              </div>
            `
            : deliveryMethod === 'pickup'
              ? `
                <div style="background-color: #f0fdf4; padding: 20px 25px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
                  <h3 style="margin-top: 0; margin-bottom: 15px; color: #0f172a; font-size: 18px;">Pickup Information</h3>
                  <p style="margin: 0 0 8px 0; font-size: 15px; color: #475569;"><strong>Pickup Location:</strong></p>
                  <p style="margin: 0 0 8px 0; font-size: 15px; color: #0f172a;">866 Newark Tpke, Kearny NJ 07032, United States</p>
                  <p style="margin: 0; font-size: 14px; color: #059669; font-weight: 600;">✓ Usually ready in 2-4 days</p>
                </div>
              `
              : '';

          const contactInfo = customerPhone
            ? `<p style="margin: 0 0 10px 0; font-size: 15px; color: #475569;"><strong>Phone:</strong> <span style="color: #0f172a;">${customerPhone}</span></p>`
            : '';

          const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
              <div style="text-align: center; margin-bottom: 25px;">
                <h1 style="color: #2563eb; margin: 0; font-size: 32px; font-weight: bold;">ICEMANZ</h1>
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
                ${contactInfo}
                <p style="margin: 0; font-size: 15px; color: #475569;"><strong>Status:</strong> <span style="color: #10b981; font-weight: bold;">Paid</span></p>
              </div>

              ${shippingInfo}

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
              from: `"ICEMANZ Support" <${process.env.SMTP_FROM || process.env.SMTP_USERNAME || process.env.SMTP_USER}>`,
              to: customerEmail,
              subject: `Payment Receipt - Order #${newOrder.id}`,
              html: emailHtml,
            });
            console.log("[WEBHOOK] Email sent successfully for direct checkout");
          } catch (emailError) {
            console.error("[WEBHOOK] Failed to send receipt email:", emailError);
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
