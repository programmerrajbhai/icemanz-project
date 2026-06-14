import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import nodemailer from 'nodemailer';
import { logoAttachment } from '@/lib/logo';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { formData, addedProducts } = body;

    const newRequest = await prisma.invoiceRequest.create({
      data: {
        projectName: formData.projectName,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        description: formData.description,
        width: formData.width,
        length: formData.length,
        height: formData.height,
        tempRange: formData.tempRange,
        customTemp: formData.customTemp,
        quantity: formData.quantity,
        additionalWarranty: formData.additionalWarranty || false,
        products: addedProducts,
        category: 'refrigeration-equipment', // Usually comes from this flow
        status: 'PENDING',
      },
    });

    // Call the QBO callback API to sync and create an invoice in QuickBooks automatically
    const baseUrl = process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'));

    try {
      console.log(`[INVOICE API] Calling sync to QuickBooks at ${baseUrl}/api/admin/invoices/${newRequest.id}/approve`);
      // Internal call to approve endpoint to generate QBO invoice
      const syncResponse = await fetch(`${baseUrl}/api/admin/invoices/${newRequest.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'SYNC_QBO' }),
      });
      if (!syncResponse.ok) {
        console.error("Failed to auto-sync with QuickBooks on invoice request. Status:", syncResponse.status);
      } else {
        console.log("Successfully synced with QuickBooks on invoice request");
      }
    } catch (syncError) {
      console.error("Error auto-syncing with QuickBooks:", syncError);
    }

    // Send email confirmation to the customer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USERNAME || process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD || process.env.SMTP_PASS,
      },
    });

    const productsList = addedProducts.map((p: any) => `
      <div style="margin-bottom: 15px; display: flex; align-items: center; gap: 15px;">
        ${p.image ? `<img src="${p.image}" alt="${p.title}" style="width: 80px; height: 80px; object-fit: contain; border: 1px solid #e2e8f0; border-radius: 6px; padding: 4px; background-color: #fff;" />` : ''}
        <div>
          <p style="margin: 0 0 5px 0; font-size: 15px; color: #0f172a;"><strong>Name:</strong> ${p.title}</p>
        </div>
      </div>
    `).join('');

    const totalAmount = addedProducts.reduce((sum: number, p: any) => {
      let price = 0;
      if (typeof p.price === 'string') {
        price = parseFloat(p.price.replace(/[^0-9.]/g, '')) || 0;
      } else if (typeof p.price === 'number') {
        price = p.price;
      }
      const qty = p.quantity ? parseInt(p.quantity, 10) : 1;
      return sum + (price * qty);
    }, 0);

    const productTitle = addedProducts && addedProducts.length > 0 ? (addedProducts[0].title || addedProducts[0].name) : 'Custom Project';
    const category = 'refrigeration-equipment'; // Usually comes from this flow

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
        <div style="text-align: center; margin-bottom: 25px;">
          <img src="cid:icemanz-logo" alt="ICEMANZ Logo" style="max-width: 160px; height: auto; margin-bottom: 15px;" />
          <h1 style="color: #004a99; margin: 0; font-size: 26px; font-weight: bold;">Thank You for Your Invoice Request!</h1>
        </div>
        
        <div style="color: #334155; font-size: 16px; line-height: 1.6;">
          <p>Hello <strong>${formData.fullName}</strong>,</p>
          <p>We have successfully received your invoice request. Our team is currently reviewing it.</p>
          ${category !== 'refrigeration-equipment' ? `<p style="font-size: 18px; font-weight: bold; color: #0f172a; margin: 20px 0;">Invoice Total: $${totalAmount.toFixed(2)}</p>` : ''}
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

        <p style="color: #64748b; font-size: 13px; text-align: center; margin-bottom: 0; line-height: 1.5;">
          &copy; ${new Date().getFullYear()} ICEMANZ. All rights reserved.
        </p>
      </div>
    `;

    console.log("[INVOICE API] Attempting to send email to:", formData.email);

    try {
      const info = await transporter.sendMail({
        from: `"ICEMANZ Support" <${process.env.SMTP_FROM || process.env.SMTP_USERNAME || process.env.SMTP_USER}>`,
        to: formData.email,
        subject: `Invoice Request Received - ${productTitle}`,
        html: emailHtml,
        attachments: [logoAttachment]
      });
      console.log("[INVOICE API] Email sent successfully! Message ID:", info.messageId);
    } catch (emailError) {
      console.error("[INVOICE API] Failed to send receipt email:", emailError);
    }

    return NextResponse.json(
      { message: 'Invoice request created successfully', request: newRequest },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Invoice Request Error:', error);
    return NextResponse.json(
      { error: 'Failed to submit request', details: error.message },
      { status: 500 }
    );
  }
}
