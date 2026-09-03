'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, Package, Truck, Mail, ArrowRight, Home } from 'lucide-react';
import { useCart } from '@/context/CartContext';

function SuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { clearCart } = useCart();
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [orderCreated, setOrderCreated] = useState(false);

    useEffect(() => {
        const payment_intent = searchParams.get('payment_intent');
        const payment_intent_client_secret = searchParams.get('payment_intent_client_secret');
        const redirect_status = searchParams.get('redirect_status');

        console.log('[SUCCESS] Payment Intent:', payment_intent);
        console.log('[SUCCESS] Redirect Status:', redirect_status);

        if (payment_intent && redirect_status === 'succeeded' && !orderCreated) {
            setSessionId(payment_intent);

            // Create order from payment intent
            fetch('/api/create-order-from-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentIntentId: payment_intent })
            })
                .then(res => res.json())
                .then(data => {
                    console.log('[SUCCESS] Order creation response:', data);
                    if (data.success) {
                        console.log('[SUCCESS] Order created successfully:', data.orderId);
                        setOrderCreated(true);
                        // Clear the cart after successful order creation
                        clearCart();
                    } else {
                        console.error('[SUCCESS] Order creation failed:', data.error);
                    }
                })
                .catch(error => {
                    console.error('[SUCCESS] Failed to create order:', error);
                });
        } else if (!payment_intent) {
            // If no payment_intent, redirect to home
            setTimeout(() => {
                router.push('/');
            }, 3000);
        }
    }, [searchParams, clearCart, router, orderCreated]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-gray-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                {/* Success Card */}
                <div className="bg-white rounded-2xl border-2 border-green-200 p-8 md:p-12 text-center shadow-xl">
                    {/* Success Icon */}
                    <div className="relative mb-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                            <CheckCircle2 size={48} className="text-white" />
                        </div>
                        <div className="absolute inset-0 w-24 h-24 bg-green-400 rounded-full mx-auto animate-ping opacity-20"></div>
                    </div>

                    {/* Success Message */}
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        Payment Successful!
                    </h1>
                    <p className="text-lg text-gray-600 mb-8">
                        Thank you for your order. Your payment has been processed successfully.
                    </p>

                    {sessionId && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-8">
                            <p className="text-sm text-gray-600 mb-1">Order Reference</p>
                            <p className="text-xs font-mono text-gray-800 break-all">{sessionId}</p>
                        </div>
                    )}

                    {/* What Happens Next */}
                    <div className="bg-blue-50 rounded-xl p-6 mb-8 text-left">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Mail size={24} className="text-blue-600" />
                            What happens next?
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                                    1
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">Confirmation Email</p>
                                    <p className="text-sm text-gray-600">You'll receive an order confirmation email shortly with all the details.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                                    2
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">Order Processing</p>
                                    <p className="text-sm text-gray-600">Our team will prepare your order for shipment or pickup.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                                    3
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">Shipping Notification</p>
                                    <p className="text-sm text-gray-600">You'll get tracking information when your order ships.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
                        >
                            <Home size={20} />
                            Back to Home
                        </Link>
                        <Link
                            href="/walk-in-cooler-freezer"
                            className="inline-flex items-center justify-center gap-2 bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all"
                        >
                            Continue Shopping
                            <ArrowRight size={20} />
                        </Link>
                    </div>

                    {/* Contact Support */}
                    <p className="text-sm text-gray-500 mt-8">
                        Need help?{' '}
                        <Link href="/support" className="text-blue-600 hover:underline font-medium">
                            Contact our support team
                        </Link>
                    </p>
                </div>

                {/* Additional Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="bg-white rounded-lg border border-gray-200 p-5 flex items-start gap-3">
                        <Package size={24} className="text-blue-600 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-1">Track Your Order</h3>
                            <p className="text-sm text-gray-600">Check your email for tracking updates</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-5 flex items-start gap-3">
                        <Truck size={24} className="text-green-600 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-1">Fast Delivery</h3>
                            <p className="text-sm text-gray-600">Your order will be processed promptly</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutSuccess() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}
