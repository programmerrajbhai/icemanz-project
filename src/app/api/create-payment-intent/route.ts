import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';
import { getQboClient } from '@/lib/qbo';

async function syncInvoiceToQuickBooks(invoice: any, finalTotalAmount: number) {
  try {
    const { oauthClient, realmId } = await getQboClient();

    let customerRef;
    try {
      const customerQuery = `SELECT * FROM Customer WHERE PrimaryEmailAddr = '${invoice.email}' MAXRESULTS 1`;
      const customerResponse = await oauthClient.makeApiCall({
        url: `https://${process.env.QBO_ENVIRONMENT === 'sandbox' ? 'sandbox-' : ''}quickbooks.api.intuit.com/v3/company/${realmId}/query?query=${encodeURIComponent(customerQuery)}`,
        method: 'GET',
      });

      const customerBody = typeof customerResponse.body === 'string' ? JSON.parse(customerResponse.body) : customerResponse.body;
      const customers = customerBody?.QueryResponse?.Customer;
      if (customers && customers.length > 0) {
        customerRef = { value: customers[0].Id, name: customers[0].DisplayName };
      } else {
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
        customerRef = { value: newCustomer.Id, name: newCustomer.DisplayName };
      }
    } catch (customerError) {
      console.error('Error with customer:', customerError);
    }

    if (!customerRef) {
      return null;
    }

    const lineItems = [
      {
        DetailType: 'SalesItemLineDetail',
        SalesItemLineDetail: {
          ItemRef: { value: '1', name: 'Services' },
          Qty: 1,
          UnitPrice: finalTotalAmount,
        },
        Amount: finalTotalAmount,
        Description: `Online Order`,
      },
    ];

    const invoiceData = {
      CustomerRef: customerRef,
      Line: lineItems,
      EmailStatus: 'NotSet',
      BillEmail: { Address: invoice.email },
    };

    const createInvoiceResponse = await oauthClient.makeApiCall({
      url: `https://${process.env.QBO_ENVIRONMENT === 'sandbox' ? 'sandbox-' : ''}quickbooks.api.intuit.com/v3/company/${realmId}/invoice`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoiceData),
    });

    const createInvoiceBody = typeof createInvoiceResponse.body === 'string' ? JSON.parse(createInvoiceResponse.body) : createInvoiceResponse.body;
    const qboInvoice = createInvoiceBody?.Invoice;

    let qboPaymentLink = qboInvoice?.InvoiceLink || null;
    if (!qboPaymentLink && qboInvoice?.Id) {
      console.warn('create-payment-intent: InvoiceLink not found. This usually means QuickBooks Payments is not enabled for this company.');
    }

    return {
      qboInvoiceId: qboInvoice?.Id,
      qboCustomerId: customerRef.value,
      qboPaymentLink,
    };
  } catch (error) {
    console.error('Error syncing to QuickBooks:', error);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const { amount, items, email, fullName, phone, address } = await request.json();
    console.log("[CREATE-PAYMENT-INTENT] Received data:", { email, fullName, phone, address });

    // Determine the category from the cart items
    const category = items.some((item: any) => item.category === 'walk-in-cooler-freezer')
      ? 'walk-in-cooler-freezer'
      : 'refrigeration-equipment';

    // Create InvoiceRequest in database
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
    console.log("[CREATE-PAYMENT-INTENT] InvoiceRequest created with email:", invoiceRequest.email);

    // If Stripe is not configured, try to use QuickBooks
    if (!process.env.STRIPE_SECRET_KEY) {
      console.log("[CREATE-PAYMENT-INTENT] Stripe is not configured, trying QuickBooks...");
      const qboData = await syncInvoiceToQuickBooks(invoiceRequest, amount);

      if (qboData && qboData.qboPaymentLink) {
        await prisma.invoiceRequest.update({
          where: { id: invoiceRequest.id },
          data: {
            status: 'APPROVED',
            qboInvoiceId: qboData.qboInvoiceId,
            qboCustomerId: qboData.qboCustomerId,
            qboPaymentLink: qboData.qboPaymentLink,
            paymentLink: qboData.qboPaymentLink,
          }
        });

        return NextResponse.json({
          isQuickBooks: true,
          paymentLink: qboData.qboPaymentLink,
          invoiceId: invoiceRequest.id
        });
      } else {
        return NextResponse.json(
          { error: 'Payment configuration missing (neither Stripe nor QuickBooks is fully set up)' },
          { status: 500 }
        );
      }
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // Create Stripe Payment Intent for inline payment
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      payment_method_types: ['card'],
      metadata: {
        invoiceId: invoiceRequest.id,
        customerName: fullName || 'Customer',
        customerEmail: email || 'customer@example.com',
      },
    });
    console.log("[CREATE-PAYMENT-INTENT] Stripe payment intent created with metadata:", paymentIntent.metadata);

    // Update invoiceRequest with paymentIntentId
    await prisma.invoiceRequest.update({
      where: { id: invoiceRequest.id },
      data: {
        stripeSessionId: paymentIntent.id,
        status: 'APPROVED'
      }
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      isQuickBooks: false
    });
  } catch (error: any) {
    console.error('Payment intent error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
