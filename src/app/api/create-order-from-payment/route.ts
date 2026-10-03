import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';
import nodemailer from 'nodemailer';
import { buildOrderEmailAttachments, generateOrderReceiptEmailHtml, generateOrderReceiptEmailText } from '@/lib/orderEmailTemplate';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
});

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
      return NextResponse.json({ error: 'Payment Intent ID is required' }, { status: 400 });
    }

    console.log('[CREATE-ORDER] Processing payment intent:', paymentIntentId);

    // Retrieve the payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
      expand: ['payment_method', 'shipping']
    });

    console.log('[CREATE-ORDER] Payment Intent status:', paymentIntent.status);

    // Only create order if payment succeeded
    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
    }

    // Get the invoice ID early so we can check for duplicates
    const preCreatedInvoiceId = paymentIntent.metadata?.invoiceRequestId;

    // Check if order already exists (by payment ID or invoice ID)
    const existingOrder = await prisma.order.findFirst({
      where: {
        OR: [
          { stripePaymentId: paymentIntent.id },
          ...(preCreatedInvoiceId ? [{ invoiceId: preCreatedInvoiceId }] : [])
        ]
      }
    });

    console.log('[CREATE-ORDER] Checking for existing order:', {
      stripePaymentId: paymentIntent.id,
      invoiceId: preCreatedInvoiceId,
      found: !!existingOrder,
    });

    if (existingOrder) {
      console.log('[CREATE-ORDER] Order already exists:', existingOrder.id);
      return NextResponse.json({
        success: true,
        orderId: existingOrder.id,
        message: 'Order already created'
      });
    }

    // Extract customer and payment information
    let customerName = 'Customer';
    let customerEmail = '';
    let customerPhone = '';
    let shippingName = '';
    let shippingAddress = '';
    let shippingCity = '';
    let shippingState = '';
    let shippingZip = '';
    let shippingCountry = '';
    let deliveryMethod = '';

    // Get billing details from payment method
    if (paymentIntent.payment_method && typeof paymentIntent.payment_method === 'object') {
      const billingDetails = paymentIntent.payment_method.billing_details;
      customerName = billingDetails?.name || 'Customer';
      customerEmail = billingDetails?.email || '';
      customerPhone = billingDetails?.phone || '';
    }

    // Get shipping details if available
    if (paymentIntent.shipping) {
      const shipping = paymentIntent.shipping as any;
      shippingName = shipping.name || '';
      shippingAddress = shipping.address?.line1
        ? `${shipping.address.line1}${shipping.address.line2 ? ', ' + shipping.address.line2 : ''}`
        : '';
      shippingCity = shipping.address?.city || '';
      shippingState = shipping.address?.state || '';
      shippingZip = shipping.address?.postal_code || '';
      shippingCountry = shipping.address?.country || '';
      deliveryMethod = 'ship';
    } else {
      deliveryMethod = 'pickup';
    }

    const amountPaid = paymentIntent.amount / 100;
    const currency = paymentIntent.currency;
    const category = paymentIntent.metadata?.category || 'walk-in-cooler-freezer';

    // ── Step 1: Try to get full cart data from pre-created invoice ──────────
    let cartItemsData: any[] = [];
    let existingInvoice: any = null;

    if (preCreatedInvoiceId) {
      existingInvoice = await prisma.invoiceRequest.findUnique({ where: { id: preCreatedInvoiceId } });
      if (existingInvoice) {
        const prods = existingInvoice.products;
        const parsed: any[] = Array.isArray(prods) ? prods : [];
        if (parsed.length > 0) {
          cartItemsData = parsed;
          console.log('[CREATE-ORDER] Using pre-created invoice products:', cartItemsData.length, 'items');
          console.log('[CREATE-ORDER] First item selectedOptions:', cartItemsData[0]?.selectedOptions);
        }
      }
    }

    // ── Step 2: Fallback — parse from Stripe metadata ─────────────────────
    if (cartItemsData.length === 0) {
      try {
        // New format: item_0, item_1, … keys
        const count = parseInt(paymentIntent.metadata?.cartItemsCount || '0', 10);
        if (count > 0) {
          for (let i = 0; i < count; i++) {
            const raw = paymentIntent.metadata?.[`item_${i}`];
            if (raw) {
              try { cartItemsData.push(JSON.parse(raw)); } catch { /* skip */ }
            }
          }
        }
        // Legacy single cartItems key
        if (cartItemsData.length === 0) {
          const cartItemsStr = paymentIntent.metadata?.cartItems;
          if (cartItemsStr) cartItemsData = JSON.parse(cartItemsStr);
        }
        console.log('[CREATE-ORDER] Cart items from metadata:', cartItemsData.length, 'items');
      } catch (err) {
        console.error('[CREATE-ORDER] Failed to parse cart items from metadata:', err);
      }
    }

    console.log('[CREATE-ORDER] Customer:', { customerName, customerEmail, customerPhone });
    console.log('[CREATE-ORDER] Shipping:', { deliveryMethod, shippingAddress, shippingCity, shippingState });

    // ── Read shipping/tax breakdown from PaymentIntent metadata ─────────────
    // update-payment-intent stores these after the customer enters their address
    const metaShipping = parseFloat(paymentIntent.metadata?.shippingCharge || '0') || 0;
    const metaTax = parseFloat(paymentIntent.metadata?.taxAmount || '0') || 0;
    const metaSubtotal = parseFloat(paymentIntent.metadata?.subtotal || '0') || 0;
    const derivedSubtotal = metaSubtotal > 0 ? metaSubtotal : amountPaid - metaShipping - metaTax;

    // ── Step 3: Create or update the InvoiceRequest ───────────────────────
    let tempInvoice: any;
    if (existingInvoice) {
      // Update the pre-created invoice with confirmed shipping/payment info
      tempInvoice = await prisma.invoiceRequest.update({
        where: { id: existingInvoice.id },
        data: {
          email: customerEmail || existingInvoice.email,
          fullName: customerName || existingInvoice.fullName,
          phone: customerPhone || existingInvoice.phone,
          status: 'PAID',
          totalAmount: derivedSubtotal > 0 ? derivedSubtotal : amountPaid,
          totalWithTax: amountPaid,
          deliveryCost: metaShipping,
          tax: metaTax,
          stripeSessionId: paymentIntent.id,
          address: shippingAddress
            ? `${shippingAddress}, ${shippingCity}, ${shippingState} ${shippingZip}, ${shippingCountry}`
            : existingInvoice.address,
          deliveryNotes: deliveryMethod === 'pickup'
            ? 'Customer will pick up from: 184-60 Jamaica Ave, Hollis, NY 11423, United States'
            : undefined,
        }
      });
      console.log('[CREATE-ORDER] Updated pre-created invoice:', tempInvoice.id);
    } else {
      // No pre-created invoice — create a new one
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
          stripeSessionId: paymentIntent.id,
          products: cartItemsData,
          category,
          address: shippingAddress
            ? `${shippingAddress}, ${shippingCity}, ${shippingState} ${shippingZip}, ${shippingCountry}`
            : undefined,
          deliveryNotes: deliveryMethod === 'pickup'
            ? 'Customer will pick up from: 184-60 Jamaica Ave, Hollis, NY 11423, United States'
            : undefined,
        }
      });
      console.log('[CREATE-ORDER] Created new invoice:', tempInvoice.id);
    }

    console.log('[CREATE-ORDER] Invoice request ready:', tempInvoice.id);

    // ── Create order — skip gracefully if webhook already created it ─────────
    // The webhook (payment_intent.succeeded) may fire concurrently and create
    // the order first, causing a unique constraint error on invoiceId.
    // Check right before inserting to handle the race condition safely.
    const orderAlreadyCreated = await prisma.order.findFirst({
      where: {
        OR: [
          { stripePaymentId: paymentIntent.id },
          { invoiceId: tempInvoice.id },
        ]
      }
    });

    let newOrder: any;
    if (orderAlreadyCreated) {
      console.log('[CREATE-ORDER] Order already created (likely by webhook):', orderAlreadyCreated.id);
      newOrder = orderAlreadyCreated;
    } else {
      try {
        newOrder = await prisma.order.create({
          data: {
            invoiceId: tempInvoice.id,
            customerName,
            customerEmail,
            customerPhone,
            amountPaid,
            currency,
            stripeSessionId: paymentIntent.id,
            stripePaymentId: paymentIntent.id,
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
        console.log('[CREATE-ORDER] Order created:', newOrder.id);
      } catch (createErr: any) {
        // Concurrent request beat us to the insert — fetch the winner
        if (createErr?.code === 'P2002') {
          console.log('[CREATE-ORDER] Concurrent create detected, fetching existing order...');
          const raceOrder = await prisma.order.findFirst({
            where: { OR: [{ stripePaymentId: paymentIntent.id }, { invoiceId: tempInvoice.id }] }
          });
          if (!raceOrder) throw createErr;
          newOrder = raceOrder;
          console.log('[CREATE-ORDER] Using race-winner order:', newOrder.id);
        } else {
          throw createErr;
        }
      }
    }

    // Send confirmation email
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
      console.log('[CREATE-ORDER] Email sent successfully');
    } catch (emailError) {
      console.error('[CREATE-ORDER] Failed to send email:', emailError);
    }

    return NextResponse.json({
      success: true,
      orderId: newOrder.id,
      invoiceId: tempInvoice.id
    });

  } catch (error: any) {
    console.error('[CREATE-ORDER] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}
