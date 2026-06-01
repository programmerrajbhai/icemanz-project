import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getQboClient } from '@/lib/qbo';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const invoice = await prisma.invoiceRequest.findUnique({
      where: { id },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    if (!invoice.qboInvoiceId) {
      return NextResponse.json({ error: 'No QuickBooks invoice linked to this request' }, { status: 400 });
    }

    if (invoice.status === 'PAID') {
      return NextResponse.json({ message: 'Invoice is already marked as paid' }, { status: 200 });
    }

    // Check QBO status
    const { oauthClient, realmId } = await getQboClient();
    
    const invoiceRes = await oauthClient.makeApiCall({
      url: `https://${process.env.QBO_ENVIRONMENT === 'sandbox' ? 'sandbox-' : ''}quickbooks.api.intuit.com/v3/company/${realmId}/invoice/${invoice.qboInvoiceId}`,
      method: 'GET'
    });
    
    const invoiceData = typeof invoiceRes.body === 'string' ? JSON.parse(invoiceRes.body) : invoiceRes.body;
    const qboInvoice = invoiceData.Invoice;
    
    if (qboInvoice.Balance === 0) {
      // It's paid! Update status and create order
      await prisma.invoiceRequest.update({
        where: { id },
        data: { status: 'PAID' }
      });

      const newOrder = await prisma.order.create({
        data: {
          invoiceId: invoice.id,
          customerName: invoice.fullName,
          customerEmail: invoice.email,
          amountPaid: invoice.totalWithTax || invoice.totalAmount || qboInvoice.TotalAmt,
          currency: 'usd',
          stripeSessionId: `qbo_manual_${invoice.qboInvoiceId}_${Date.now()}`,
          stripePaymentId: `manual_verify_${Date.now()}`,
          status: 'PAID',
          category: invoice.category
        }
      });

      return NextResponse.json({ 
        message: 'Payment verified and order created',
        status: 'PAID',
        orderId: newOrder.id 
      });
    }

    return NextResponse.json({ 
      message: 'Invoice is still pending payment in QuickBooks',
      status: invoice.status 
    });

  } catch (error: any) {
    console.error('Verify Payment Error:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment', details: error.message },
      { status: 500 }
    );
  }
}
