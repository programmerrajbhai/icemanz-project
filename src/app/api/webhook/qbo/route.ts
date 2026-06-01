import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { getQboClient } from '@/lib/qbo';
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
  try {
    const signature = req.headers.get('intuit-signature');
    const payload = await req.text();

    if (process.env.QBO_WEBHOOK_TOKEN && signature) {
      const hash = crypto
        .createHmac('sha256', process.env.QBO_WEBHOOK_TOKEN)
        .update(payload)
        .digest('base64');
      
      if (hash !== signature) {
        console.error('[QBO Webhook] Signature mismatch');
        return NextResponse.json({ error: 'Signature mismatch' }, { status: 401 });
      }
    }

    const data = JSON.parse(payload);
    
    if (data.eventNotifications && data.eventNotifications.length > 0) {
      for (const notification of data.eventNotifications) {
        const entities = notification.dataChangeEvent?.entities || [];
        
        for (const entity of entities) {
          // Listen for Payment creation or Invoice update
          if ((entity.name === 'Payment' && entity.operation === 'Create') || 
              (entity.name === 'Invoice' && entity.operation === 'Update')) {
            
            try {
              const { oauthClient, realmId } = await getQboClient();
              let qboInvoiceId = null;
              let amountPaid = 0;
              
              if (entity.name === 'Payment') {
                const paymentRes = await oauthClient.makeApiCall({
                  url: `https://${process.env.QBO_ENVIRONMENT === 'sandbox' ? 'sandbox-' : ''}quickbooks.api.intuit.com/v3/company/${realmId}/payment/${entity.id}`,
                  method: 'GET'
                });
                const paymentData = typeof paymentRes.body === 'string' ? JSON.parse(paymentRes.body) : paymentRes.body;
                const payment = paymentData.Payment;
                amountPaid = payment.TotalAmt;
                
                // Find the linked invoice
                if (payment.Line && payment.Line.length > 0) {
                  for (const line of payment.Line) {
                    if (line.LinkedTxn && line.LinkedTxn.length > 0) {
                      for (const txn of line.LinkedTxn) {
                        if (txn.TxnType === 'Invoice') {
                          qboInvoiceId = txn.TxnId;
                          break;
                        }
                      }
                    }
                    if (qboInvoiceId) break;
                  }
                }
              } else if (entity.name === 'Invoice') {
                const invoiceRes = await oauthClient.makeApiCall({
                  url: `https://${process.env.QBO_ENVIRONMENT === 'sandbox' ? 'sandbox-' : ''}quickbooks.api.intuit.com/v3/company/${realmId}/invoice/${entity.id}`,
                  method: 'GET'
                });
                const invoiceData = typeof invoiceRes.body === 'string' ? JSON.parse(invoiceRes.body) : invoiceRes.body;
                const invoice = invoiceData.Invoice;
                
                // Check if fully paid
                if (invoice.Balance === 0) {
                  qboInvoiceId = invoice.Id;
                  amountPaid = invoice.TotalAmt;
                }
              }

              if (qboInvoiceId) {
                // Find the invoice request in our DB
                const invoiceReq = await prisma.invoiceRequest.findFirst({
                  where: { qboInvoiceId: qboInvoiceId }
                });

                if (invoiceReq && invoiceReq.status !== 'PAID') {
                  // Update status
                  await prisma.invoiceRequest.update({
                    where: { id: invoiceReq.id },
                    data: { status: 'PAID' }
                  });

                  // Create Order
                  const newOrder = await prisma.order.create({
                    data: {
                      invoiceId: invoiceReq.id,
                      customerName: invoiceReq.fullName,
                      customerEmail: invoiceReq.email,
                      amountPaid: amountPaid,
                      currency: 'usd',
                      stripeSessionId: `qbo_${qboInvoiceId}_${Date.now()}`, // Using qbo prefix for unique constraint
                      stripePaymentId: entity.id, // storing QBO payment/invoice ID here
                      status: 'PAID',
                      category: invoiceReq.category
                    }
                  });

                  // Send confirmation email
                  const emailHtml = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                      <div style="text-align: center; margin-bottom: 25px;">
                        <h1 style="color: #004a99; margin: 0; font-size: 32px; font-weight: bold;">ICEMANZ</h1>
                      </div>
                      
                      <h2 style="color: #10b981; text-align: center; margin-top: 0; font-size: 24px; font-weight: bold;">Payment Successful!</h2>
                      
                      <div style="color: #334155; font-size: 16px; line-height: 1.6;">
                        <p>Hello <strong>${invoiceReq.fullName}</strong>,</p>
                        <p>We have successfully received your payment of <strong>$${amountPaid.toFixed(2)}</strong>.</p>
                      </div>
                      
                      <div style="background-color: #f8fafc; padding: 20px 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #10b981;">
                        <h3 style="margin-top: 0; margin-bottom: 15px; color: #0f172a; font-size: 18px;">Order Details</h3>
                        <p style="margin: 0 0 10px 0; font-size: 15px; color: #475569;"><strong>Order ID:</strong> <span style="color: #0f172a;">${newOrder.id}</span></p>
                        <p style="margin: 0 0 10px 0; font-size: 15px; color: #475569;"><strong>Amount Paid:</strong> <span style="color: #0f172a; font-weight: bold;">$${amountPaid.toFixed(2)}</span></p>
                        <p style="margin: 0; font-size: 15px; color: #475569;"><strong>Status:</strong> <span style="color: #10b981; font-weight: bold;">Paid</span></p>
                      </div>

                      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />

                      <p style="color: #64748b; font-size: 13px; text-align: center; margin-bottom: 0; line-height: 1.5;">
                        Our team will start processing your order right away. You will receive further updates soon.<br/><br/>
                        If you have any questions, please contact our support team.<br/>
                        &copy; ${new Date().getFullYear()} ICEMANZ. All rights reserved.
                      </p>
                    </div>
                  `;

                  await transporter.sendMail({
                    from: `"ICEMANZ Support" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
                    to: invoiceReq.email,
                    subject: `Payment Receipt - Order #${newOrder.id}`,
                    html: emailHtml,
                  });
                }
              }
            } catch (err) {
              console.error('[QBO Webhook] Error processing entity:', err);
            }
          }
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[QBO Webhook] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}