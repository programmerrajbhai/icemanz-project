import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';
import nodemailer from 'nodemailer';

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
        deliveryNotes: deliveryMethod === 'pickup' ? 'Customer will pick up from: 866 Newark Tpke, Kearny NJ 07032, United States' : undefined,
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
