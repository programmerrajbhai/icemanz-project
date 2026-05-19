'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronDown, Lock, HelpCircle, AlertCircle, RefreshCw, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { loadStripe } from '@stripe/stripe-js';
import {
    Elements,
    PaymentElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const { cartItems, subtotal } = useCart();

    const [email, setEmail] = useState('');
    const [shippingMethod, setShippingMethod] = useState<'ship' | 'pickup'>('ship');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/checkout/success`,
                receipt_email: email,
            },
        });

        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message ?? "An unexpected error occurred.");
            toast.error(error.message ?? "An unexpected error occurred.");
        } else {
            setMessage("An unexpected error occurred.");
            toast.error("An unexpected error occurred.");
        }

        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="min-h-screen bg-white flex flex-col lg:flex-row">
            {/* Left Side: Checkout Form */}
            <div className="flex-1 lg:max-w-[60%] px-6 md:px-12 lg:px-24 py-12 border-r border-gray-100">
                <div className="max-w-xl ml-auto w-full">
                    {/* Header/Breadcrumbs */}
                    <div className="mb-8">
                        <Link href="/">
                            <Image src="/logo.png" alt="ICEMANZ" width={150} height={40} className="mb-6 object-contain" />
                        </Link>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Link href="/cart" className="hover:text-primary transition-colors">Cart</Link>
                            <ChevronDown size={12} className="-rotate-90" />
                            <span className="font-semibold text-gray-900">Information</span>
                            <ChevronDown size={12} className="-rotate-90" />
                            <span>Shipping</span>
                            <ChevronDown size={12} className="-rotate-90" />
                            <span>Payment</span>
                        </div>
                    </div>

                    {/* Contact Section */}
                    <section className="mb-10">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Contact</h2>
                        </div>
                        <div className="space-y-4">
                            <input
                                type="email"
                                required
                                placeholder="Email"
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm shadow-sm transition-all"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <label className="flex items-center gap-3 cursor-pointer group mt-2">
                                <div className="relative flex items-center">
                                    <input type="checkbox" className="peer appearance-none w-5 h-5 border border-gray-300 rounded focus:ring-2 focus:ring-primary/20 checked:bg-primary checked:border-primary transition-all cursor-pointer" defaultChecked />
                                    <svg className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 left-0.5 top-0.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-sm text-gray-700 font-medium">Email me with news and offers</span>
                            </label>
                        </div>
                    </section>

                    {/* Delivery Section */}
                    <section className="mb-10">
                        <div className="space-y-4">
                            <div className="relative">
                                <select className="w-full px-4 py-3.5 pt-6 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm shadow-sm appearance-none transition-all">
                                    <option>United States</option>
                                </select>
                                <span className="absolute left-4 top-1.5 text-[11px] text-gray-500 transition-all">Country/Region</span>
                                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                            </div>

                            <div className="flex gap-4">
                                <input type="text" placeholder="First name" className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm shadow-sm transition-all" />
                                <input type="text" placeholder="Last name" className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm shadow-sm transition-all" />
                            </div>

                            <div className="relative">
                                <input type="text" placeholder="Address" className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm shadow-sm transition-all pr-10" />
                                <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>

                            <input type="text" placeholder="Apartment, suite, etc. (optional)" className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm shadow-sm transition-all" />

                            <div className="flex gap-4">
                                <input type="text" placeholder="City" className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm shadow-sm transition-all" />
                                <div className="relative flex-1">
                                    <select className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm shadow-sm appearance-none transition-all">
                                        <option>State</option>
                                    </select>
                                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                                </div>
                                <input type="text" placeholder="ZIP code" className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm shadow-sm transition-all" />
                            </div>

                            <div className="relative">
                                <input type="text" placeholder="Phone" className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm shadow-sm transition-all pr-10" />
                                <HelpCircle size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </section>

                    {/* Payment Section (Stripe PaymentElement) */}
                    <section className="mb-10">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Payment</h2>
                        <p className="text-sm text-gray-500 mb-6">All transactions are secure and encrypted.</p>

                        <div className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm">
                            <PaymentElement options={{ layout: 'tabs' }} />
                        </div>

                        {message && (
                            <div className="mt-4 flex items-center gap-2 text-red-600 text-sm font-medium bg-red-50 p-4 rounded-lg border border-red-100">
                                <AlertCircle size={18} />
                                {message}
                            </div>
                        )}
                    </section>

                    {/* Bottom Action */}
                    <div className="space-y-6 pt-4">
                        <button
                            disabled={isLoading || !stripe || !elements}
                            className={`w-full bg-primary cursor-pointer text-white py-4 rounded-lg font-bold text-lg transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-3 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-800 hover:shadow-lg'}`}
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Processing...
                                </>
                            ) : (
                                `Pay $${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                            )}
                        </button>

                        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 font-medium">
                            <Lock size={14} className="text-gray-400" />
                            Secure SSL Encrypted Payment
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Order Summary */}
            <div className="flex-1 lg:max-w-[40%] bg-gray-50 px-6 md:px-12 lg:px-16 py-12 border-l border-gray-200">
                <div className="max-w-md w-full sticky top-12">
                    {/* Cart Items List */}
                    <div className="space-y-6 mb-8 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                        {cartItems.map((item) => (
                            <div key={item.id} className="flex items-center gap-4">
                                <div className="relative w-16 h-16 bg-white border border-gray-200 rounded-lg shrink-0 overflow-hidden shadow-sm">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-contain p-2"
                                        sizes="64px"
                                    />
                                    <span className="absolute -top-2 -right-2 bg-gray-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm z-10">
                                        {item.quantity}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">{item.name}</h3>
                                    <p className="text-[11px] text-gray-500 font-bold uppercase mt-1">{item.brand}</p>
                                </div>
                                <div className="text-sm font-bold text-gray-900">
                                    ${(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary Calculations */}
                    <div className="space-y-4 pt-6 border-t border-gray-200 mb-6">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Subtotal • {cartItems.reduce((acc, item) => acc + item.quantity, 0)} items</span>
                            <span className="text-gray-900 font-semibold">${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-1 text-gray-600">
                                Shipping <HelpCircle size={14} className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors" />
                            </div>
                            <span className="text-gray-500 text-xs italic">Calculated at next step</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                        <span className="text-xl font-bold text-gray-900">Total</span>
                        <div className="text-right">
                            <div className="flex items-baseline gap-2">
                                <span className="text-xs font-bold text-gray-500 uppercase">USD</span>
                                <span className="text-3xl font-black text-gray-900">
                                    ${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

const CheckoutClient = () => {
    const { subtotal, cartItems } = useCart();
    const router = useRouter();
    const [clientSecret, setClientSecret] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [isInitializing, setIsInitializing] = useState(true);

    const initializePayment = useCallback(async () => {
        if (subtotal <= 0) {
            setIsInitializing(false);
            return;
        }

        setIsInitializing(true);
        setError(null);

        try {
            const response = await fetch('/api/create-payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: subtotal, items: cartItems }),
            });

            const data = await response.json();

            if (data.clientSecret) {
                setClientSecret(data.clientSecret);
            } else {
                const errorMsg = data.error || 'Failed to initialize payment';
                setError(errorMsg);
                toast.error(errorMsg);
            }
        } catch (err) {
            console.error('Payment initialization error:', err);
            const errorMsg = 'Could not connect to payment server. Please check your connection.';
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setIsInitializing(false);
        }
    }, [subtotal, cartItems]);

    useEffect(() => {
        initializePayment();
    }, [initializePayment]);

    // Handle empty cart
    useEffect(() => {
        if (!isInitializing && subtotal <= 0 && !clientSecret) {
            const timer = setTimeout(() => {
                router.push('/cart');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [subtotal, isInitializing, clientSecret, router]);

    const appearance = {
        theme: 'stripe' as const,
        variables: {
            colorPrimary: '#004a99',
            borderRadius: '8px',
            colorBackground: '#ffffff',
            colorText: '#1f2937',
            colorDanger: '#ef4444',
            spacingUnit: '4px',
        },
        rules: {
            '.Input': {
                border: '1px solid #d1d5db',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            },
            '.Input:focus': {
                border: '1px solid #004a99',
                boxShadow: '0 0 0 2px rgba(0, 74, 153, 0.2)',
            },
        }
    };

    const options = {
        clientSecret,
        appearance,
    };

    if (isInitializing) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-6 max-w-sm px-6 text-center">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-primary/10 border-t-primary rounded-full animate-spin"></div>
                        <Lock className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary/40" size={20} />
                    </div>
                    <div className="space-y-2">
                        <p className="text-xl font-bold text-gray-900">Initializing secure checkout</p>
                        <p className="text-gray-500 text-sm">Please wait while we prepare your secure payment environment...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (subtotal <= 0 && !clientSecret) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-6 max-w-sm px-6 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                        <ShoppingCart size={32} />
                    </div>
                    <div className="space-y-2">
                        <p className="text-xl font-bold text-gray-900">Your cart is empty</p>
                        <p className="text-gray-500 text-sm">You need items in your cart to proceed to checkout. Redirecting you back to cart...</p>
                    </div>
                    <Link
                        href="/cart"
                        className="bg-primary text-white px-8 py-3 rounded-sm font-bold hover:bg-blue-800 transition-colors"
                    >
                        Return to Cart
                    </Link>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-6 max-w-md px-6 text-center">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500">
                        <AlertCircle size={32} />
                    </div>
                    <div className="space-y-2">
                        <p className="text-xl font-bold text-gray-900">Checkout Initialization Failed</p>
                        <p className="text-gray-500 text-sm">{error}</p>
                    </div>
                    <div className="flex flex-col w-full gap-3">
                        <button
                            onClick={() => initializePayment()}
                            className="flex items-center justify-center gap-2 bg-primary text-white px-8 py-3 rounded-sm font-bold hover:bg-blue-800 transition-colors w-full"
                        >
                            <RefreshCw size={18} />
                            Try Again
                        </button>
                        <Link
                            href="/cart"
                            className="text-gray-600 font-medium hover:text-gray-900 transition-colors py-2"
                        >
                            Return to Cart
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Elements stripe={stripePromise} options={options}>
            <CheckoutForm />
        </Elements>
    );
};

export default CheckoutClient;
