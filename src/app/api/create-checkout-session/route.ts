import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

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
            deliveryMethod = 'ship'
        } = body;

        if (!items || items.length === 0) {
            return NextResponse.json(
                { error: 'No items provided' },
                { status: 400 }
            );
        }

        // Convert cart items to Stripe line items
        const lineItems = items.map((item: any) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name,
                    images: [item.image],
                    description: `${item.brand || ''} - ${item.category || 'Product'}`,
                },
                unit_amount: Math.round(item.price * 100), // Convert to cents
            },
            quantity: item.quantity,
        }));

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
            metadata: {
                deliveryMethod: deliveryMethod,
                customerPhone: customerInfo?.phone || '',
                customerEmail: customerInfo?.email || '',
            },
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
            // For pickup, add metadata but no shipping options
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
