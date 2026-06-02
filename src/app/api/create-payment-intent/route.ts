import { NextResponse } from 'next/server';
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

export async function POST(request: Request) {
  try {
    const { amount, items, email, fullName, phone, address } = await request.json();
    console.log("[CREATE-PAYMENT-INTENT] Received order request data:", { email, fullName, phone, address });

    // Determine the category from the cart items
    const category = items.some((item: any) => item.category === 'walk-in-cooler-freezer')
      ? 'walk-in-cooler-freezer'
      : 'refrigeration-equipment';

    // Create InvoiceRequest in database with PENDING status
    const invoiceRequest = await prisma.invoiceRequest.create({
      data: {
        email: email || 'customer@example.com',
        phone: phone || '',
        fullName: fullName || 'Customer',
        address: address || '',
        totalAmount: amount,
        totalWithTax: amount,
        products: items,
        category: category,
        status: 'PENDING'
      }
    });

    console.log("[CREATE-PAYMENT-INTENT] Order Request created with ID:", invoiceRequest.id);

    // Send simple "Thank You" email without generating/syncing QBO invoice
    const baseUrl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'));

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 25px;">
          <img src="${baseUrl}/logo.png" alt="ICEMANZ Logo" style="max-width: 160px; height: auto;" />
        </div>
        
        <h2 style="color: #004a99; text-align: center; margin-top: 0; font-size: 24px; font-weight: bold;">Thank You For Your Request!</h2>
        
        <div style="color: #334155; font-size: 16px; line-height: 1.6;">
          <p>Hello <strong>${invoiceRequest.fullName}</strong>,</p>
          <p>We have successfully received your order request. Our team is currently reviewing it.</p>
          <p>We will contact you shortly with the final invoice and payment details.</p>
        </div>
        
        <div style="background-color: #f8fafc; padding: 20px 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #004a99;">
          <p style="margin: 0 0 10px 0; font-size: 15px; color: #475569;"><strong>Request ID:</strong> <span style="color: #0f172a;">${invoiceRequest.id}</span></p>
          <p style="margin: 0; font-size: 15px; color: #475569;"><strong>Status:</strong> <span style="color: #eab308; font-weight: bold;">Pending Review</span></p>
        </div>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />

        <p style="color: #64748b; font-size: 13px; text-align: center; margin-bottom: 0; line-height: 1.5;">
          If you have any questions, please contact our support team.<br/>
          &copy; ${new Date().getFullYear()} ICEMANZ. All rights reserved.
        </p>
      </div>
    `;

    try {
      await transporter.sendMail({
        from: `"ICEMANZ Support" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: invoiceRequest.email,
        subject: `Order Request Received - #${invoiceRequest.id}`,
        html: emailHtml,
      });
      console.log('Thank you email sent successfully to:', invoiceRequest.email);
    } catch (emailError) {
      console.error('Error sending thank you email:', emailError);
    }

    return NextResponse.json({
      success: true,
      invoiceId: invoiceRequest.id,
      isQuickBooks: false
    });
  } catch (error: any) {
    console.error('Order request error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
