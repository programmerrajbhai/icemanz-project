import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import Stripe from 'stripe';
import nodemailer from 'nodemailer';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USERNAME || process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD || process.env.SMTP_PASS,
  },
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { action, totalAmount, message, deliveryTime, offerDiscount, tax, deliveryCost, totalWithTax, deliveryNotes } = body;

    const invoice = await prisma.invoiceRequest.findUnique({
      where: { id },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    if (action === 'APPROVE') {
      if (!totalAmount || isNaN(parseFloat(totalAmount))) {
        return NextResponse.json({ error: 'Valid total amount is required for approval' }, { status: 400 });
      }

      const amount = parseFloat(totalAmount);
      const finalTotalAmount = totalWithTax ? parseFloat(totalWithTax) : amount;

      // Determine the base URL for redirects and images
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

      // Create Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `Invoice for Project: ${invoice.projectName || 'Custom Project'}`,
                description: `Requested by ${invoice.fullName}`,
              },
              unit_amount: Math.round(finalTotalAmount * 100),
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${baseUrl}/completed-projects?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/request-invoice?canceled=true`,
        metadata: {
          invoiceId: invoice.id,
          customerName: invoice.fullName,
          customerEmail: invoice.email,
        },
      });

      const updatedInvoice = await prisma.invoiceRequest.update({
        where: { id },
        data: {
          status: 'APPROVED',
          totalAmount: amount,
          stripeSessionId: session.id,
          paymentLink: session.url,
          deliveryTime,
          offerDiscount,
          tax,
          deliveryCost,
          totalWithTax: finalTotalAmount,
          deliveryNotes,
        },
      });

      // Send Email with Payment Link
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          <div style="text-align: center; margin-bottom: 25px;">
            <img src="${baseUrl}/logo.png" alt="ICEMANZ Logo" style="max-width: 160px; height: auto;" />
          </div>
          
          <h2 style="color: #004a99; text-align: center; margin-top: 0; font-size: 24px; font-weight: bold;">Invoice Approved</h2>
          
          <div style="color: #334155; font-size: 16px; line-height: 1.6;">
            <p>Hello <strong>${invoice.fullName}</strong>,</p>
            <p>Great news! Your invoice request for the project <strong>${invoice.projectName || 'Custom Project'}</strong> has been reviewed and approved.</p>
          </div>
          
          <div style="background-color: #f8fafc; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #004a99;">
            <h3 style="margin-top: 0; margin-bottom: 20px; color: #0f172a; font-size: 18px;">Invoice Details</h3>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 15px;">
              <p style="margin: 0; font-size: 14px; color: #64748b;"><strong>Total Amount:</strong></p>
              <p style="margin: 0; font-size: 14px; text-align: right; font-weight: 600; color: #0f172a;">$${amount.toFixed(2)}</p>
              
              ${offerDiscount !== null && offerDiscount !== undefined ? `
                <p style="margin: 0; font-size: 14px; color: #64748b;"><strong>Offer/Discount:</strong></p>
                <p style="margin: 0; font-size: 14px; text-align: right; font-weight: 600; color: #059669;">-$${parseFloat(offerDiscount).toFixed(2)}</p>
              ` : ''}
              
              ${tax !== null && tax !== undefined ? `
                <p style="margin: 0; font-size: 14px; color: #64748b;"><strong>Tax:</strong></p>
                <p style="margin: 0; font-size: 14px; text-align: right; font-weight: 600; color: #0f172a;">$${parseFloat(tax).toFixed(2)}</p>
              ` : ''}
              
              ${deliveryCost !== null && deliveryCost !== undefined ? `
                <p style="margin: 0; font-size: 14px; color: #64748b;"><strong>Delivery Cost:</strong></p>
                <p style="margin: 0; font-size: 14px; text-align: right; font-weight: 600; color: #0f172a;">$${parseFloat(deliveryCost).toFixed(2)}</p>
              ` : ''}
              
              ${deliveryTime ? `
                <p style="margin: 0; font-size: 14px; color: #64748b;"><strong>Delivery Time:</strong></p>
                <p style="margin: 0; font-size: 14px; text-align: right; font-weight: 500; color: #0f172a;">${deliveryTime}</p>
              ` : ''}
            </div>
            
            <div style="border-top: 2px solid #e2e8f0; padding-top: 15px; margin-top: 10px;">
              <p style="margin: 0; font-size: 16px; color: #0f172a;"><strong>Grand Total:</strong></p>
              <p style="margin: 5px 0 0 0; font-size: 22px; font-weight: bold; color: #004a99;">$${finalTotalAmount.toFixed(2)}</p>
            </div>
            
            ${deliveryNotes ? `
              <div style="margin-top: 20px; padding-top: 15px; border-top: 1px dashed #cbd5e1;">
                <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 600; color: #475569;">Delivery Notes:</p>
                <p style="margin: 0; font-size: 14px; color: #334155;">${deliveryNotes}</p>
              </div>
            ` : ''}
            
            ${message ? `
              <div style="margin-top: 20px; padding-top: 15px; border-top: 1px dashed #cbd5e1;">
                <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 600; color: #475569;">Admin Note:</p>
                <p style="margin: 0; font-size: 14px; color: #334155;">${message}</p>
              </div>
            ` : ''}
          </div>

          <div style="text-align: center; margin: 35px 0;">
            <a href="${session.url}" style="background-color: #004a99; color: white; padding: 14px 40px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 2px 4px rgba(0,74,153,0.2);">Pay Invoice Now</a>
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
          to: invoice.email,
          subject: `Invoice Approved - Payment Required for ${invoice.projectName || 'Project'}`,
          html: emailHtml,
        });
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
      }

      return NextResponse.json(updatedInvoice);

    } else if (action === 'DECLINE') {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

      const updatedInvoice = await prisma.invoiceRequest.update({
        where: { id },
        data: { status: 'DECLINED' },
      });

      const emailHtml = `
       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
         <div style="text-align: center; margin-bottom: 25px;">
           <img src="${baseUrl}/logo.png" alt="ICEMANZ Logo" style="max-width: 160px; height: auto;" />
         </div>
         
         <h2 style="color: #dc2626; text-align: center; margin-top: 0; font-size: 24px; font-weight: bold;">Invoice Request Declined</h2>
         
         <div style="color: #334155; font-size: 16px; line-height: 1.6;">
           <p>Hello <strong>${invoice.fullName}</strong>,</p>
           <p>We regret to inform you that your invoice request for the project <strong>${invoice.projectName || 'Custom Project'}</strong> has been declined.</p>
         </div>
         
         ${message ? `
         <div style="background-color: #fef2f2; padding: 20px 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #dc2626;">
           <p style="margin: 0; font-size: 15px; color: #991b1b;"><strong>Reason:</strong> ${message}</p>
         </div>` : ''}

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
          to: invoice.email,
          subject: `Invoice Request Update - ${invoice.projectName || 'Project'}`,
          html: emailHtml,
        });
      } catch (emailError) {
        console.error("Failed to send decline email:", emailError);
      }

      return NextResponse.json(updatedInvoice);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error processing invoice request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
