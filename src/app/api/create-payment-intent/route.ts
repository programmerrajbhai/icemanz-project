import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import nodemailer from 'nodemailer';
import { logoBase64 } from '@/lib/logo';

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

    // Call the QBO callback API to sync and create an invoice in QuickBooks automatically
    const baseUrl = process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'));

    try {
      console.log(`[CREATE-PAYMENT-INTENT] Calling sync to QuickBooks at ${baseUrl}/api/admin/invoices/${invoiceRequest.id}/approve`);
      // Internal call to approve endpoint to generate QBO invoice
      const syncResponse = await fetch(`${baseUrl}/api/admin/invoices/${invoiceRequest.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'SYNC_QBO' }),
      });
      if (!syncResponse.ok) {
        console.error("Failed to auto-sync with QuickBooks on checkout. Status:", syncResponse.status);
        try {
          const errBody = await syncResponse.text();
          console.error("Sync error body:", errBody);
        } catch (e) {
          // ignore
        }
      } else {
        console.log("Successfully synced with QuickBooks on checkout");
      }
    } catch (syncError) {
      console.error("Error auto-syncing with QuickBooks:", syncError);
    }

    // Generate product list HTML
    const productsList = items.map((p: any) => `
      <div style="margin-bottom: 15px; display: flex; align-items: center; gap: 15px;">
        ${p.image ? `<img src="${p.image}" alt="${p.title || p.name}" style="width: 80px; height: 80px; object-fit: contain; border: 1px solid #e2e8f0; border-radius: 6px; padding: 4px; background-color: #fff;" />` : ''}
        <div>
          <p style="margin: 0 0 5px 0; font-size: 15px; color: #0f172a;"><strong>Name:</strong> ${p.title || p.name}</p>
        </div>
      </div>
    `).join('');

    // Determine email content based on category
    const isWalkInCooler = category === 'walk-in-cooler-freezer';
    const productTitle = items && items.length > 0 ? (items[0].title || items[0].name) : 'Custom Project';
    const emailSubject = isWalkInCooler
      ? `Invoice Request Received - ${productTitle}`
      : `Order Received - ${productTitle}`;
    const emailHeading = isWalkInCooler
      ? `Thank You for Your Invoice Request!`
      : `Thank You for Your Order!`;
    const requestTypeText = isWalkInCooler
      ? `invoice request`
      : `order request`;

    // Send a Thank You email
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 25px;">
          <img src="${logoBase64}" alt="ICEMANZ Logo" style="max-width: 160px; height: auto;" />
        </div>
        <h2 style="color: #004a99; text-align: center; font-size: 24px; font-weight: bold;">${emailHeading}</h2>
        <div style="color: #334155; font-size: 16px; line-height: 1.6;">
          <p>Hello <strong>${fullName}</strong>,</p>
          <p>We have successfully received your ${requestTypeText}. Our team is currently reviewing it.</p>
          ${category !== 'refrigeration-equipment' ? `<p style="font-size: 18px; font-weight: bold; color: #0f172a; margin: 20px 0;">Order Total: $${amount.toFixed(2)}</p>` : ''}
          <p>You will receive an official invoice with payment instructions shortly. If you have any questions, feel free to reply to this email.</p>
        </div>
        
        <div style="background-color: #f8fafc; padding: 20px 25px; border-radius: 8px; margin: 25px 0; border: 1px solid #e2e8f0;">
          <h3 style="margin-top: 0; margin-bottom: 20px; color: #0f172a; font-size: 18px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Requested Product Details</h3>
          ${productsList}
        </div>

        <p style="color: #334155; font-size: 16px; font-weight: 500; margin-top: 25px;">
          Thank you for choosing us.
        </p>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
        <p style="color: #64748b; font-size: 13px; text-align: center;">
          &copy; ${new Date().getFullYear()} ICEMANZ. All rights reserved.
        </p>
      </div>
    `;

    try {
      await transporter.sendMail({
        from: `"ICEMANZ Support" <${process.env.SMTP_USERNAME || process.env.SMTP_USER}>`,
        to: email,
        subject: emailSubject,
        html: emailHtml,
      });
      console.log("[CREATE-PAYMENT-INTENT] Thank you email sent to:", email);
    } catch (emailError) {
      console.error("[CREATE-PAYMENT-INTENT] Failed to send thank you email:", emailError);
    }

    return NextResponse.json({
      success: true,
      invoiceId: invoiceRequest.id,
      isQuickBooks: true
    });
  } catch (error: any) {
    console.error('Order request error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
