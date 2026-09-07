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

    // Check if order already exists
    const existingOrder = await prisma.order.findFirst({
      where: { stripePaymentId: paymentIntent.id }
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

    // Extract cart items from metadata
    let cartItemsData = [];
    try {
      const cartItemsStr = paymentIntent.metadata?.cartItems;
      if (cartItemsStr) {
        cartItemsData = JSON.parse(cartItemsStr);
        console.log('[CREATE-ORDER] Cart items:', cartItemsData.length, 'items');
      }
    } catch (err) {
      console.error('[CREATE-ORDER] Failed to parse cart items:', err);
    }

    console.log('[CREATE-ORDER] Customer:', { customerName, customerEmail, customerPhone });
    console.log('[CREATE-ORDER] Shipping:', { deliveryMethod, shippingAddress, shippingCity, shippingState });

    // Create invoice request
    const tempInvoice = await prisma.invoiceRequest.create({
      data: {
        email: customerEmail,
        fullName: customerName,
        phone: customerPhone,
        status: 'PAID',
        totalAmount: amountPaid,
        totalWithTax: amountPaid,
        stripeSessionId: paymentIntent.id,
        products: cartItemsData,
        category,
        address: shippingAddress ? `${shippingAddress}, ${shippingCity}, ${shippingState} ${shippingZip}, ${shippingCountry}` : undefined,
        deliveryNotes: deliveryMethod === 'pickup' ? 'Customer will pick up from: 184-60 Jamaica Ave, Hollis, NY 11423, United States' : undefined,
      }
    });

    console.log('[CREATE-ORDER] Invoice request created:', tempInvoice.id);

    // Create order
    const newOrder = await prisma.order.create({
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
