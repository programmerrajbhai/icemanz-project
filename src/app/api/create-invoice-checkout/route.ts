import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';

// Ensure Stripe key exists
if (!process.env.STRIPE_SECRET_KEY) {
    console.warn('Warning: STRIPE_SECRET_KEY is not set in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
    apiVersion: '2026-03-25.dahlia',
});

export async function POST(req: NextRequest) {
    try {
        // Check if Stripe is properly configured
        if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_placeholder') {
            return NextResponse.json(
                { error: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to your environment variables.' },
                { status: 500 }
            );
        }

        const body = await req.json();
        const { invoiceId } = body;

        if (!invoiceId) {
            return NextResponse.json(
                { error: 'Invoice ID is required' },
                { status: 400 }
            );
        }

        // Get invoice from database
        const invoice = await prisma.invoiceRequest.findUnique({
            where: { id: invoiceId }
        });

        if (!invoice) {
            return NextResponse.json(
                { error: 'Invoice not found' },
                { status: 404 }
            );
        }

        if (invoice.status === 'PAID') {
            return NextResponse.json(
                { error: 'Invoice is already paid' },
                { status: 400 }
            );
        }

        // Parse products from JSON
        const products = Array.isArray(invoice.products) ? invoice.products : [];

        if (products.length === 0) {
            return NextResponse.json(
                { error: 'No products found in invoice' },
                { status: 400 }
            );
        }

        // Convert invoice products to Stripe line items
        const lineItems = products.map((item: any) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name || item.title,
                    images: item.image ? [item.image] : [],
                    description: `${item.brand || ''} - ${item.category || 'Product'}`.trim(),
                },
                unit_amount: Math.round((item.price || 0) * 100), // Convert to cents
            },
            quantity: item.quantity || 1,
        }));

        // Add delivery/shipping cost if exists
        if (invoice.deliveryCost && invoice.deliveryCost > 0) {
            lineItems.push({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Delivery & Shipping',
                        description: 'Freight and delivery charges',
                        images: [],
                    },
                    unit_amount: Math.round(invoice.deliveryCost * 100),
                },
                quantity: 1,
            });
        }

        // Add tax if exists
        if (invoice.tax && invoice.tax > 0) {
            lineItems.push({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Tax',
                        description: 'Sales tax',
                        images: [],
                    },
                    unit_amount: Math.round(invoice.tax * 100),
                },
                quantity: 1,
            });
        }

        // Create Stripe Checkout Session
        const sessionParams: Stripe.Checkout.SessionCreateParams = {
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}&invoice_id=${invoiceId}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout?canceled=true&invoice_id=${invoiceId}`,
            customer_email: invoice.email,
            metadata: {
                invoiceId: invoiceId,
                customerName: invoice.fullName,
                category: invoice.category || 'general',
            },
        };

        // Create checkout session
        const session = await stripe.checkout.sessions.create(sessionParams);

        // Update invoice with Stripe checkout URL
        await prisma.invoiceRequest.update({
            where: { id: invoiceId },
            data: {
                stripeCheckoutUrl: session.url,
                stripeSessionId: session.id,
            }
        });

        return NextResponse.json({
            sessionId: session.id,
            url: session.url
        });

    } catch (error: any) {
        console.error('Stripe invoice checkout session error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create checkout session' },
            { status: 500 }
        );
    }
}
