import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import nodemailer from 'nodemailer';

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
      },
    });

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

    const productsList = addedProducts.map((p: any) => `<li>${p.title} - ${p.price}</li>`).join('');

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
        <div style="text-align: center; margin-bottom: 25px;">
          <h1 style="color: #2563eb; margin: 0; font-size: 32px; font-weight: bold;">ICEMANZ</h1>
        </div>
        
        <h2 style="color: #10b981; text-align: center; margin-top: 0; font-size: 24px; font-weight: bold;">Invoice Request Received!</h2>
        
        <div style="color: #334155; font-size: 16px; line-height: 1.6;">
          <p>Hello <strong>${formData.fullName}</strong>,</p>
          <p>Thank you for your invoice request! We've received your details and will review them shortly.</p>
        </div>
        
        <div style="background-color: #f8fafc; padding: 20px 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #10b981;">
          <h3 style="margin-top: 0; margin-bottom: 15px; color: #0f172a; font-size: 18px;">Request Details</h3>
          <p style="margin: 0 0 10px 0; font-size: 15px; color: #475569;"><strong>Request ID:</strong> <span style="color: #0f172a;">${newRequest.id}</span></p>
          <p style="margin: 0 0 10px 0; font-size: 15px; color: #475569;"><strong>Project Name:</strong> <span style="color: #0f172a;">${formData.projectName}</span></p>
          <p style="margin: 0 0 10px 0; font-size: 15px; color: #475569;"><strong>Dimensions:</strong> <span style="color: #0f172a;">${formData.width}′ W × ${formData.length}′ L × ${formData.height}′ H</span></p>
          <p style="margin: 0 0 10px 0; font-size: 15px; color: #475569;"><strong>Temperature:</strong> <span style="color: #0f172a;">${formData.tempRange}</span></p>
          <p style="margin: 0 0 10px 0; font-size: 15px; color: #475569;"><strong>Products:</strong></p>
          <ul style="margin: 0 0 10px 0; padding-left: 20px;">${productsList}</ul>
        </div>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />

        <p style="color: #64748b; font-size: 13px; text-align: center; margin-bottom: 0; line-height: 1.5;">
          Our team will review your request and send a tailored invoice to your email within 1–2 business days.<br/><br/>
          If you have any questions, please contact our support team.<br/>
          &copy; ${new Date().getFullYear()} ICEMANZ. All rights reserved.
        </p>
      </div>
    `;

    console.log("[INVOICE API] Attempting to send email to:", formData.email);

    try {
      const info = await transporter.sendMail({
        from: `"ICEMANZ Support" <${process.env.SMTP_FROM || process.env.SMTP_USERNAME || process.env.SMTP_USER}>`,
        to: formData.email,
        subject: `Invoice Request Received - ${newRequest.id}`,
        html: emailHtml,
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
