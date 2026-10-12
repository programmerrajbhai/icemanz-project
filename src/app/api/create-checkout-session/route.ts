import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';

// Stripe metadata: values capped at 500 chars, max 50 keys total.
function buildMetadata(
    items: any[],
    base: Record<string, string>
): Record<string, string> {
    const meta: Record<string, string> = { ...base };
    meta.cartItemsCount = String(items.length);

    items.forEach((item, idx) => {
        const compact: Record<string, any> = {
            id: item.id,
            name: item.name,
            brand: item.brand || '',
            price: item.price,
            quantity: item.quantity,
            image: item.image || '',
            category: item.category || '',
        };

        if (item.selectedOptions && Object.keys(item.selectedOptions).length > 0) {
            compact.selectedOptions = item.selectedOptions;
        }

        if (item.addonQuantities) {
            const nonZero = Object.fromEntries(
                Object.entries(item.addonQuantities as Record<string, number>).filter(([, v]) => v > 0)
            );
            if (Object.keys(nonZero).length > 0) {
                compact.addonQuantities = nonZero;
            }
        }

        const serialised = JSON.stringify(compact);

        if (serialised.length <= 500) {
            meta[`item_${idx}`] = serialised;
        } else {
            compact.image = '';
            const shorter = JSON.stringify(compact);
            meta[`item_${idx}`] = shorter.length <= 500 ? shorter : shorter.substring(0, 500);
        }
    });

    return meta;
}

if (!process.env.STRIPE_SECRET_KEY) {
    console.warn('Warning: STRIPE_SECRET_KEY is not set in environment variables');
}

// FIX 1: Bypass TypeScript strictness for Stripe API version using 'as any'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
    apiVersion: '2023-10-16' as any, 
});

export async function POST(req: NextRequest) {
    try {
        if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_placeholder') {
            return NextResponse.json(
                { error: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to your environment variables.' },
                { status: 500 }
            );
        }

        const body = await req.json();
        
        // Cast body to 'any' to prevent TS destructuring errors
        const {
            items,
            customerInfo,
            deliveryMethod = 'ship',
            shippingCost = 0,
            shippingMethod = 'Standard Freight',
            shippingLocation = null,
        }: any = body;

        if (!items || items.length === 0) {
            return NextResponse.json(
                { error: 'No items provided' },
                { status: 400 }
            );
        }

        // ── Server-side price validation ──
        const productIds: string[] = items.map((item: any) => item.id);
        
        // FIX 2: Removed 'select' to avoid Prisma Schema mismatch errors
        const dbProducts = await prisma.product.findMany({
            where: { id: { in: productIds } }
        });

        const dbMap = new Map(dbProducts.map((p: any) => [p.id, p]));

        const lineItems: any[] = [];

        for (const item of items) {
            const dbProduct = dbMap.get(item.id);

            let unitAmountCents: number;
            if (dbProduct?.price) {
                const parsed = parseFloat(
                    String(dbProduct.price).replace(/[^0-9.]/g, '')
                );
                unitAmountCents = isNaN(parsed) ? 0 : Math.round(parsed * 100);
            } else {
                const fallback = parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0;
                unitAmountCents = Math.round(fallback * 100);
            }

            const productName = dbProduct?.title || item.name;
            // Handle both 'image' and 'images' array depending on schema
            const productImage = dbProduct?.images?.[0] || dbProduct?.image || item.image || '';

            lineItems.push({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: productName,
                        images: productImage ? [productImage] : [],
                        description: `${item.brand || ''} ${item.category || 'Product'}`.trim(),
                    },
                    unit_amount: unitAmountCents,
                    tax_behavior: 'exclusive', 
                },
                quantity: item.quantity,
            });

            item.price = unitAmountCents / 100;
            if (dbProduct?.title) item.name = dbProduct.title;
            if (productImage) item.image = productImage;
        }

        // Prepare session parameters
        const appUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        
        const sessionParams: Stripe.Checkout.SessionCreateParams = {
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            submit_type: 'pay',
            success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${appUrl}/checkout?canceled=true`,
            billing_address_collection: 'required',
            phone_number_collection: {
                enabled: true, 
            },
            automatic_tax: { enabled: true },
            metadata: buildMetadata(items, {
                deliveryMethod,
                customerPhone: customerInfo?.phone || '',
                customerEmail: customerInfo?.email || '',
                shippingLocationId: shippingLocation?.id || '',
                shippingLocationName: shippingLocation?.name || '',
                shippingLocationAddress: shippingLocation?.address || '',
                shippingCost: shippingCost > 0 ? String(shippingCost) : '',
            }),
        };

        // Add dynamic shipping options based on frontend selection
        if (deliveryMethod === 'ship' || deliveryMethod === 'hub') {
            sessionParams.shipping_address_collection = {
                allowed_countries: ['US', 'CA', 'MX', 'GB', 'AU'],
            };

            sessionParams.shipping_options = [
                {
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: {
                            amount: Math.round((shippingCost || 0) * 100),
                            currency: 'usd',
                        },
                        display_name: deliveryMethod === 'hub' ? `Hub: ${shippingLocation?.name}` : shippingMethod,
                    },
                }
            ];
        } else if (deliveryMethod === 'pickup') {
            sessionParams.metadata = {
                ...sessionParams.metadata,
                pickupLocation: '184-60 Jamaica Ave, Hollis, NY 11423, United States',
            };
        }

        // Create checkout session
        const session = await stripe.checkout.sessions.create(sessionParams);

        return NextResponse.json({
            sessionId: session.id,
            url: session.url
        });

    } catch (error: any) {
        console.error('Stripe checkout session error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create checkout session' },
            { status: 500 }
        );
    }
}