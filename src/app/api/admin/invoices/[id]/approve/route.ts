import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import Stripe from 'stripe';
import nodemailer from 'nodemailer';
import { getQboClient } from '@/lib/qbo';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USERNAME || process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD || process.env.SMTP_PASS,
  },
});

async function withRetry(fn: any, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      console.warn(`[RETRY] Attempt ${i + 1} failed. Retrying in ${delay}ms...`);
      if (i === retries - 1) throw error;
      await new Promise(res => setTimeout(res, delay));
    }
  }
}

async function getFirstIncomeAccount(oauthClient: any, realmId: string) {
  try {
    const accountQuery = `SELECT * FROM Account WHERE AccountType = 'Income' MAXRESULTS 1`;
    const accountResponse = await oauthClient.makeApiCall({
      url: `https://${process.env.QBO_ENVIRONMENT === 'sandbox' ? 'sandbox-' : ''}quickbooks.api.intuit.com/v3/company/${realmId}/query?query=${encodeURIComponent(accountQuery)}`,
      method: 'GET',
    });

    const accountBody = typeof accountResponse.body === 'string' ? JSON.parse(accountResponse.body) : accountResponse.body;
    const accounts = accountBody?.QueryResponse?.Account;

    if (accounts && accounts.length > 0) {
      return { value: accounts[0].Id, name: accounts[0].Name };
    }

    throw new Error('No income accounts found in QuickBooks');
  } catch (error) {
    console.error('getFirstIncomeAccount: Error:', error);
    throw error;
  }
}

async function getOrCreateQboItem(oauthClient: any, realmId: string, item: any) {
  try {
    const itemName = (item.name || item.title || 'Custom Item').substring(0, 100).replace(/:/g, '');
    const itemQuery = `SELECT * FROM Item WHERE Name = '${itemName.replace(/'/g, "\\'")}' MAXRESULTS 1`;

    const itemResponse = await oauthClient.makeApiCall({
      url: `https://${process.env.QBO_ENVIRONMENT === 'sandbox' ? 'sandbox-' : ''}quickbooks.api.intuit.com/v3/company/${realmId}/query?query=${encodeURIComponent(itemQuery)}`,
      method: 'GET',
    });

    const itemBody = typeof itemResponse.body === 'string' ? JSON.parse(itemResponse.body) : itemResponse.body;
    const items = itemBody?.QueryResponse?.Item;

    if (items && items.length > 0) {
      return { value: items[0].Id, name: items[0].Name };
    }

    const incomeAccountRef = await getFirstIncomeAccount(oauthClient, realmId);

    const itemData = {
      Name: itemName,
      Sku: item.sku || '',
      Type: 'Service',
      IncomeAccountRef: incomeAccountRef
    };

    const createItemResponse = await oauthClient.makeApiCall({
      url: `https://${process.env.QBO_ENVIRONMENT === 'sandbox' ? 'sandbox-' : ''}quickbooks.api.intuit.com/v3/company/${realmId}/item`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemData),
    });

    const createItemBody = typeof createItemResponse.body === 'string' ? JSON.parse(createItemResponse.body) : createItemResponse.body;
    return { value: createItemBody?.Item?.Id, name: createItemBody?.Item?.Name };
  } catch (error) {
    console.error('Error in getOrCreateQboItem:', error);
    // Fallback to a default item if creation fails
    return { value: '1', name: 'Services' };
  }
}

async function syncInvoiceToQuickBooks(invoice: any, finalTotalAmountParam: number) {
  try {
    const { oauthClient, realmId } = await getQboClient();
    let finalTotalAmount = finalTotalAmountParam;

    // First, create or get customer
    let customerRef;
    try {
      customerRef = await withRetry(async () => {
        // Intuit QBO uses PrimaryEmailAddr LIKE '%email%' as a workaround for nested queries
        const customerQuery = `SELECT * FROM Customer WHERE PrimaryEmailAddr LIKE '%${invoice.email}%' MAXRESULTS 1`;
        const customerResponse = await oauthClient.makeApiCall({
          url: `https://${process.env.QBO_ENVIRONMENT === 'sandbox' ? 'sandbox-' : ''}quickbooks.api.intuit.com/v3/company/${realmId}/query?query=${encodeURIComponent(customerQuery)}`,
          method: 'GET',
        });

        const customerBody = typeof customerResponse.body === 'string' ? JSON.parse(customerResponse.body) : customerResponse.body;
        const customers = customerBody?.QueryResponse?.Customer;
        if (customers && customers.length > 0) {
          return { value: customers[0].Id, name: customers[0].DisplayName };
        } else {
          // Create new customer
          const customerData = {
            DisplayName: invoice.fullName,
            PrimaryEmailAddr: { Address: invoice.email },
            ...(invoice.phone ? { PrimaryPhone: { FreeFormNumber: invoice.phone } } : {}),
            ...(invoice.address ? { BillAddr: { Line1: invoice.address } } : {}),
          };

          const createCustomerResponse = await oauthClient.makeApiCall({
            url: `https://${process.env.QBO_ENVIRONMENT === 'sandbox' ? 'sandbox-' : ''}quickbooks.api.intuit.com/v3/company/${realmId}/customer`,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(customerData),
          });

          const createCustomerBody = typeof createCustomerResponse.body === 'string' ? JSON.parse(createCustomerResponse.body) : createCustomerResponse.body;
          const newCustomer = createCustomerBody?.Customer;
          if (!newCustomer) throw new Error('Failed to create customer in QBO');
          return { value: newCustomer.Id, name: newCustomer.DisplayName };
        }
      });
    } catch (customerError) {
      console.error('Error with customer:', customerError);
      throw customerError;
    }

    if (!customerRef) return null;

    let lineItems = [];
    let calculatedTotal = 0;
    if (invoice.products && invoice.products.length > 0) {
      lineItems = await Promise.all(invoice.products.map(async (item: any) => {
        const itemRef = await getOrCreateQboItem(oauthClient, realmId, item);
        const priceValue = typeof item.price === 'string' ? parseFloat(item.price.replace(/[^0-9.]/g, '')) : (item.price || 0);
        const qty = item.quantity ? parseInt(item.quantity, 10) : 1;
        const lineAmount = priceValue * qty;
        calculatedTotal += lineAmount;

        return {
          DetailType: 'SalesItemLineDetail',
          SalesItemLineDetail: {
            ItemRef: itemRef,
            Qty: qty,
            UnitPrice: priceValue,
          },
          Amount: lineAmount,
          Description: `${item.name || item.title} ${item.sku ? `(SKU: ${item.sku})` : ''}`,
        };
      }));

      if (finalTotalAmount === 0 && calculatedTotal > 0) {
        finalTotalAmount = calculatedTotal;
      }
    } else {
      // Default line item if no products array
      const itemRef = await getOrCreateQboItem(oauthClient, realmId, { name: 'Custom Project' });
      lineItems = [{
        DetailType: 'SalesItemLineDetail',
        SalesItemLineDetail: {
          ItemRef: itemRef,
          Qty: 1,
          UnitPrice: finalTotalAmount,
        },
        Amount: finalTotalAmount,
        Description: `Invoice for Project: ${invoice.projectName || 'Custom Project'}`,
      }];
    }

    const invoiceData = {
      CustomerRef: customerRef,
      Line: lineItems,
      PrivateNote: invoice.deliveryNotes || '',
      EmailStatus: 'NotSet',
      BillEmail: { Address: invoice.email },
    };

    const qboInvoice = await withRetry(async () => {
      const createInvoiceResponse = await oauthClient.makeApiCall({
        url: `https://${process.env.QBO_ENVIRONMENT === 'sandbox' ? 'sandbox-' : ''}quickbooks.api.intuit.com/v3/company/${realmId}/invoice`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoiceData),
      });

      const createInvoiceBody = typeof createInvoiceResponse.body === 'string' ? JSON.parse(createInvoiceResponse.body) : createInvoiceResponse.body;
      return createInvoiceBody?.Invoice;
    });

    if (!qboInvoice) throw new Error('Failed to create invoice in QBO');

    let qboPaymentLink = qboInvoice?.InvoiceLink || null;
    if (!qboPaymentLink && qboInvoice?.Id) {
      const qboBaseUrl = process.env.QBO_ENVIRONMENT === 'sandbox' ? 'https://sandbox.qbo.intuit.com' : 'https://qbo.intuit.com';
      qboPaymentLink = `${qboBaseUrl}/app/pay?companyId=${realmId}&txnId=${qboInvoice.Id}`;
    }

    return {
      qboInvoiceId: qboInvoice?.Id,
      qboCustomerId: customerRef.value,
      qboPaymentLink,
      calculatedTotal: finalTotalAmount,
    };
  } catch (error) {
    console.error('Error syncing to QuickBooks:', error);
    return null;
  }
}

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

    const baseUrl = process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'));

    if (action === 'SYNC_QBO' || (!action && req.method === 'POST')) {
      // Allow syncing from checkout page which might just call POST without action payload
      const finalTotalAmount = totalWithTax ? parseFloat(totalWithTax) : (invoice.totalAmount || 0);

      // Sync to QuickBooks if connected
      let qboData = null;
      try {
        console.log('Starting QBO sync for invoice:', invoice.id, 'with amount:', finalTotalAmount);
        qboData = await syncInvoiceToQuickBooks(invoice, finalTotalAmount);
        console.log('QBO sync result:', qboData);
      } catch (qboError) {
        console.error('QBO sync failed with error:', qboError);
        return NextResponse.json({ error: 'Failed to create invoice in QuickBooks' }, { status: 500 });
      }

      if (!qboData) {
        return NextResponse.json({ error: 'Failed to create invoice in QuickBooks' }, { status: 500 });
      }

      const updatedInvoice = await prisma.invoiceRequest.update({
        where: { id },
        data: {
          status: 'INVOICED',
          paymentLink: qboData.qboPaymentLink,
          qboInvoiceId: qboData.qboInvoiceId,
          qboCustomerId: qboData.qboCustomerId,
          qboPaymentLink: qboData.qboPaymentLink,
          ...(qboData.calculatedTotal > 0 && (invoice.totalAmount === null || invoice.totalAmount === 0) ? {
            totalAmount: qboData.calculatedTotal,
            totalWithTax: qboData.calculatedTotal,
          } : {})
        },
      });

      // No email is sent here. The admin manually sends it from QuickBooks.
      return NextResponse.json(updatedInvoice);

    } else if (action === 'APPROVE_ORDER') {
      // This is called AFTER payment is made (or manually to just approve).
      const updatedInvoice = await prisma.invoiceRequest.update({
        where: { id },
        data: { status: 'APPROVED' },
      });

      const amount = updatedInvoice.totalAmount || 0;
      const finalTotalAmount = updatedInvoice.totalWithTax || amount;

      // Send Email Confirmation
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          <div style="text-align: center; margin-bottom: 25px;">
            <img src="${baseUrl}/logo.png" alt="ICEMANZ Logo" style="max-width: 160px; height: auto;" />
          </div>
          
          <h2 style="color: #004a99; text-align: center; margin-top: 0; font-size: 24px; font-weight: bold;">Order Approved!</h2>
          
          <div style="color: #334155; font-size: 16px; line-height: 1.6;">
            <p>Hello <strong>${invoice.fullName}</strong>,</p>
            <p>Great news! Your payment has been received and your order for <strong>${invoice.projectName || 'Custom Project'}</strong> has been officially <strong>approved</strong>.</p>
            <p>Our team is now processing your order and preparing it for delivery.</p>
          </div>
          
          <div style="background-color: #f8fafc; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #004a99;">
            <h3 style="margin-top: 0; margin-bottom: 20px; color: #0f172a; font-size: 18px;">Order Summary</h3>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 15px;">
              <p style="margin: 0; font-size: 14px; color: #64748b;"><strong>Total Amount:</strong></p>
              <p style="margin: 0; font-size: 14px; text-align: right; font-weight: 600; color: #0f172a;">$${amount.toFixed(2)}</p>
              
              ${updatedInvoice.offerDiscount !== null && updatedInvoice.offerDiscount !== undefined ? `
                <p style="margin: 0; font-size: 14px; color: #64748b;"><strong>Offer/Discount:</strong></p>
                <p style="margin: 0; font-size: 14px; text-align: right; font-weight: 600; color: #059669;">-$${Number(updatedInvoice.offerDiscount).toFixed(2)}</p>
              ` : ''}
              
              ${updatedInvoice.tax !== null && updatedInvoice.tax !== undefined ? `
                <p style="margin: 0; font-size: 14px; color: #64748b;"><strong>Tax:</strong></p>
                <p style="margin: 0; font-size: 14px; text-align: right; font-weight: 600; color: #0f172a;">$${Number(updatedInvoice.tax).toFixed(2)}</p>
              ` : ''}
              
              ${updatedInvoice.deliveryCost !== null && updatedInvoice.deliveryCost !== undefined ? `
                <p style="margin: 0; font-size: 14px; color: #64748b;"><strong>Delivery Cost:</strong></p>
                <p style="margin: 0; font-size: 14px; text-align: right; font-weight: 600; color: #0f172a;">$${Number(updatedInvoice.deliveryCost).toFixed(2)}</p>
              ` : ''}
              
              ${updatedInvoice.deliveryTime ? `
                <p style="margin: 0; font-size: 14px; color: #64748b;"><strong>Delivery Time:</strong></p>
                <p style="margin: 0; font-size: 14px; text-align: right; font-weight: 500; color: #0f172a;">${updatedInvoice.deliveryTime}</p>
              ` : ''}
            </div>
            
            <div style="border-top: 2px solid #e2e8f0; padding-top: 15px; margin-top: 10px;">
              <p style="margin: 0; font-size: 16px; color: #0f172a;"><strong>Grand Total Paid:</strong></p>
              <p style="margin: 5px 0 0 0; font-size: 22px; font-weight: bold; color: #004a99;">$${finalTotalAmount.toFixed(2)}</p>
            </div>
            
            ${updatedInvoice.deliveryNotes ? `
              <div style="margin-top: 20px; padding-top: 15px; border-top: 1px dashed #cbd5e1;">
                <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 600; color: #475569;">Delivery Notes:</p>
                <p style="margin: 0; font-size: 14px; color: #334155;">${updatedInvoice.deliveryNotes}</p>
              </div>
            ` : ''}
          </div>

          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />

          <p style="color: #64748b; font-size: 13px; text-align: center; margin-bottom: 0; line-height: 1.5;">
            Thank you for choosing ICEMANZ!<br/>
            &copy; ${new Date().getFullYear()} ICEMANZ. All rights reserved.
          </p>
        </div>
      `;

      try {
        await transporter.sendMail({
          from: `"ICEMANZ Support" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
          to: invoice.email,
          subject: `Order Approved & Processing - ${invoice.projectName || 'Project'}`,
          html: emailHtml,
        });
      } catch (emailError) {
        console.error("Failed to send approval email:", emailError);
      }

      return NextResponse.json(updatedInvoice);

    } else if (action === 'DECLINE') {
      const baseUrl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'));

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
