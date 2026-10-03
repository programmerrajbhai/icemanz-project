import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';

// Stripe metadata: values capped at 500 chars, max 50 keys total.
// We store each cart item as a separate key "item_0", "item_1", …
// Only the fields the admin dashboard needs are included.
function buildMetadata(
    items: any[],
    base: Record<string, string>
): Record<string, string> {
    const meta: Record<string, string> = { ...base };
    meta.cartItemsCount = String(items.length);

    items.forEach((item, idx) => {
        // Build a compact object with only what we need
        const compact: Record<string, any> = {
            id: item.id,
            name: item.name,
            brand: item.brand || '',
            price: item.price,
            quantity: item.quantity,
            image: item.image || '',
            category: item.category || '',
        };

        // Include selectedOptions if present
        if (item.selectedOptions && Object.keys(item.selectedOptions).length > 0) {
            compact.selectedOptions = item.selectedOptions;
        }

        // Include addonQuantities if any qty > 0
        if (item.addonQuantities) {
            const nonZero = Object.fromEntries(
                Object.entries(item.addonQuantities as Record<string, number>).filter(([, v]) => v > 0)
            );
            if (Object.keys(nonZero).length > 0) {
                compact.addonQuantities = nonZero;
            }
        }

        const serialised = JSON.stringify(compact);

        // If the JSON fits in 500 chars, store directly; otherwise strip image
        if (serialised.length <= 500) {
            meta[`item_${idx}`] = serialised;
        } else {
            // Drop image to save space
            compact.image = '';
            const shorter = JSON.stringify(compact);
            meta[`item_${idx}`] = shorter.length <= 500 ? shorter : shorter.substring(0, 500);
        }
    });

    return meta;
}

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
        const {
            items,
            customerInfo,
            deliveryMethod = 'ship',
            shippingCost = 0,
            shippingLocation = null,
        } = body;

        if (!items || items.length === 0) {
            return NextResponse.json(
                { error: 'No items provided' },
                { status: 400 }
            );
        }

        // ── Server-side price validation ────────────────────────────────────
        // Fetch fresh prices from the database — never trust the client price.
        const productIds: string[] = items.map((item: any) => item.id);
        const dbProducts = await prisma.product.findMany({
            where: { id: { in: productIds } },
            select: { id: true, title: true, price: true, images: true },
        });

        const dbMap = new Map(dbProducts.map((p) => [p.id, p]));

        // Build validated line items using DB price
        const lineItems: any[] = [];

        for (const item of items) {
            const dbProduct = dbMap.get(item.id);

            // Parse DB price string (e.g. "$3,490.00" or "3490") → cents
            let unitAmountCents: number;
            if (dbProduct?.price) {
                const parsed = parseFloat(
                    String(dbProduct.price).replace(/[^0-9.]/g, '')
                );
                unitAmountCents = isNaN(parsed) ? 0 : Math.round(parsed * 100);
            } else {
                // Product not found in DB — fall back to client price as last resort
                // (handles products without a DB record, e.g. add-ons)
                const fallback = parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0;
                unitAmountCents = Math.round(fallback * 100);
            }

            const productName = dbProduct?.title || item.name;
            const productImage = dbProduct?.images?.[0] || item.image || '';

            lineItems.push({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: productName,
                        images: productImage ? [productImage] : [],
                        description: `${item.brand || ''} - ${item.category || 'Product'}`,
                    },
                    unit_amount: unitAmountCents,
                    tax_behavior: 'exclusive', // Tells Stripe: price does NOT include tax, add it on top
                },
                quantity: item.quantity,
            });

            // Update the item's price to DB price so metadata is also accurate
            item.price = unitAmountCents / 100;
            if (dbProduct?.title) item.name = dbProduct.title;
            if (productImage) item.image = productImage;
        }
        // ────────────────────────────────────────────────────────────────────

        // Add fixed shipping as a Stripe line item when a location is pre-selected
        if (shippingCost > 0 && shippingLocation) {
            lineItems.push({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `Freight Shipping — ${shippingLocation.name}`,
                        images: [],
                        description: shippingLocation.address,
                    },
                    unit_amount: Math.round(shippingCost * 100),
                    tax_behavior: 'exclusive',
                },
                quantity: 1,
            });
        }

        // Prepare session parameters
        const sessionParams: Stripe.Checkout.SessionCreateParams = {
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            submit_type: 'pay', // Simple pay button
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout?canceled=true`,
            billing_address_collection: 'required',
            phone_number_collection: {
                enabled: true, // Make phone number required
            },
            // Stripe automatic_tax — address priority:
            //   1. Shipping address (if collected) → used for SHIP mode
            //   2. Billing address                → used for PICKUP mode (no shipping collected)
            //   3. IP geolocation (fallback)
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

        // Add shipping options if delivery method is 'ship'
        if (deliveryMethod === 'ship') {
            sessionParams.shipping_address_collection = {
                allowed_countries: ['US', 'CA', 'MX', 'GB', 'AU'],
            };

            sessionParams.shipping_options = [
                {
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: {
                            amount: 0,
                            currency: 'usd',
                        },
                        display_name: 'Standard Shipping',
                        delivery_estimate: {
                            minimum: {
                                unit: 'business_day',
                                value: 5,
                            },
                            maximum: {
                                unit: 'business_day',
                                value: 10,
                            },
                        },
                    },
                },
                {
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: {
                            amount: 15000, // $150
                            currency: 'usd',
                        },
                        display_name: 'Express Shipping',
                        delivery_estimate: {
                            minimum: {
                                unit: 'business_day',
                                value: 2,
                            },
                            maximum: {
                                unit: 'business_day',
                                value: 3,
                            },
                        },
                    },
                },
            ];
        } else if (deliveryMethod === 'pickup') {
            // For pickup: explicitly DO NOT provide shipping_options or
            // shipping_address_collection. This forces Stripe's automatic_tax
            // to fall back to the Billing Address for tax calculation.
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
