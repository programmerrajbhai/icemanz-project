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

    const productsTableRows = addedProducts.map((p: any) => {
      const qty = p.quantity ? parseInt(p.quantity, 10) : 1;
      const priceNum = typeof p.price === 'string'
        ? parseFloat(p.price.replace(/[^0-9.]/g, '')) || 0
        : (typeof p.price === 'number' ? p.price : 0);
      const priceDisplay = priceNum > 0 ? `$${priceNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'Price on Request';
      return `
        <tr>
          <td style="padding: 12px 10px; border-bottom: 1px solid #e2e8f0; vertical-align: middle;">
            <table cellpadding="0" cellspacing="0" border="0" style="border: none;">
              <tr>
                ${p.image ? `<td style="vertical-align: middle; padding-right: 12px;"><img src="${p.image}" alt="${p.title || p.name}" style="width: 64px; height: 64px; object-fit: contain; border: 1px solid #e2e8f0; border-radius: 6px; padding: 4px; background-color: #fff; display: block;" /></td>` : ''}
                <td style="vertical-align: middle;">
                  ${p.brand ? `<p style="margin: 0 0 3px 0; font-size: 11px; font-weight: 700; color: #004a99; text-transform: uppercase; letter-spacing: 0.05em;">${p.brand}</p>` : ''}
                  <p style="margin: 0; font-size: 14px; font-weight: 600; color: #0f172a; line-height: 1.4;">${p.title || p.name || 'Product'}</p>
                </td>
              </tr>
            </table>
          </td>
          <td style="padding: 12px 10px; border-bottom: 1px solid #e2e8f0; text-align: center; vertical-align: middle; font-size: 14px; font-weight: 700; color: #0f172a; white-space: nowrap;">${qty}</td>
          <td style="padding: 12px 10px; border-bottom: 1px solid #e2e8f0; text-align: right; vertical-align: middle; font-size: 14px; font-weight: 600; color: #004a99; white-space: nowrap;">${priceDisplay}</td>
        </tr>
      `;
    }).join('');

    const productsList = `
      <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif;">
        <thead>
          <tr style="background-color: #004a99;">
            <th style="padding: 10px 10px; text-align: left; font-size: 12px; font-weight: 700; color: #ffffff; text-transform: uppercase; letter-spacing: 0.08em;">Product</th>
            <th style="padding: 10px 10px; text-align: center; font-size: 12px; font-weight: 700; color: #ffffff; text-transform: uppercase; letter-spacing: 0.08em; white-space: nowrap;">Qty</th>
            <th style="padding: 10px 10px; text-align: right; font-size: 12px; font-weight: 700; color: #ffffff; text-transform: uppercase; letter-spacing: 0.08em; white-space: nowrap;">Unit Price</th>
          </tr>
        </thead>
        <tbody>
          ${productsTableRows}
        </tbody>
      </table>
    `;

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
          <h3 style="margin-top: 0; margin-bottom: 16px; color: #0f172a; font-size: 17px; font-weight: 700; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Requested Products</h3>
          ${productsList}
        </div>

        <div style="background-color: #f8fafc; padding: 20px 25px; border-radius: 8px; margin: 25px 0; border: 1px solid #e2e8f0;">
          <h3 style="margin-top: 0; margin-bottom: 16px; color: #0f172a; font-size: 17px; font-weight: 700; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Project Details</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #334155;">
            ${formData.projectName ? `<tr><td style="padding: 6px 0; font-weight: 600; width: 160px;">Project Name</td><td style="padding: 6px 0;">${formData.projectName}</td></tr>` : ''}
            ${formData.address ? `<tr><td style="padding: 6px 0; font-weight: 600;">Address</td><td style="padding: 6px 0;">${formData.address}</td></tr>` : ''}
            ${(formData.width && formData.length && formData.height) ? `<tr><td style="padding: 6px 0; font-weight: 600;">Dimensions</td><td style="padding: 6px 0;">${formData.width}W × ${formData.length}L × ${formData.height}H (ft)</td></tr>` : ''}
            ${formData.tempRange ? `<tr><td style="padding: 6px 0; font-weight: 600;">Temperature Range</td><td style="padding: 6px 0;">${formData.tempRange}${formData.customTemp ? ` (${formData.customTemp})` : ''}</td></tr>` : ''}
            ${formData.quantity ? `<tr><td style="padding: 6px 0; font-weight: 600;">Unit Quantity</td><td style="padding: 6px 0;">${formData.quantity}</td></tr>` : ''}
            ${formData.additionalWarranty ? `<tr><td style="padding: 6px 0; font-weight: 600;">Additional Warranty</td><td style="padding: 6px 0;">Yes — 4-year extended warranty</td></tr>` : ''}
            ${formData.description ? `<tr><td style="padding: 6px 0; font-weight: 600; vertical-align: top;">Description</td><td style="padding: 6px 0;">${formData.description}</td></tr>` : ''}
          </table>
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
