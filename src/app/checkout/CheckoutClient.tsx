'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronDown, Lock, AlertCircle, RefreshCw, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CheckoutForm = ({
    clientSecret,
    subtotal,
    cartItems,
    email,
    firstName,
    lastName,
    address,
    city,
    state,
    zipCode,
    phone,
    clearCart
}: any) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const [useShippingAsBilling, setUseShippingAsBilling] = useState(true);
    const [billingFirstName, setBillingFirstName] = useState('');
    const [billingLastName, setBillingLastName] = useState('');
    const [billingAddress, setBillingAddress] = useState('');
    const [billingCity, setBillingCity] = useState('');
    const [billingState, setBillingState] = useState('');
    const [billingZipCode, setBillingZipCode] = useState('');
    const [billingPhone, setBillingPhone] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        const billingDetails = useShippingAsBilling ? {
            name: `${firstName} ${lastName}`,
            phone: phone,
            address: {
                line1: address,
                city: city,
                state: state,
                postal_code: zipCode,
                country: 'US',
            }
        } : {
            name: `${billingFirstName} ${billingLastName}`,
            phone: billingPhone,
            address: {
                line1: billingAddress,
                city: billingCity,
                state: billingState,
                postal_code: billingZipCode,
                country: 'US',
            }
        };

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/checkout/success`,
                receipt_email: email,
                payment_method_data: {
                    billing_details: billingDetails
                }
            },
            redirect: 'if_required'
        });

        if (error) {
            toast.error(error.message || 'Payment failed');
            setIsLoading(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            try {
                await fetch('/api/confirm-payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ paymentIntentId: paymentIntent.id }),
                });
            } catch (err) {
                console.error('Failed to confirm payment via API', err);
            }
            toast.success('Payment successful!');
            clearCart();
            router.push(`/checkout/success?payment_intent=${paymentIntent.id}`);
        }
    };

    return (
        <div className="space-y-6">
            {/* Credit Card Option */}
            <div className="border border-gray-200 rounded-md overflow-hidden">
                <div className="bg-blue-50 p-4 flex items-center justify-between border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                        </div>
                        <span className="text-lg font-bold">Credit card</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="bg-white px-2 py-1 rounded border border-gray-200">
                            <svg width="32" height="20" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="32" height="20" rx="3" fill="white" />
                                <path d="M8 5H24V15H8V5Z" fill="#003087" />
                                <path d="M16 10L8 5V15L16 10Z" fill="#003087" />
                                <path d="M16 10L24 5V15L16 10Z" fill="#F21000" />
                                <path d="M16 10L8 15L16 20L24 15L16 10Z" fill="#FFB200" />
                            </svg>
                        </div>
                        <div className="bg-white px-2 py-1 rounded border border-gray-200">
                            <svg width="32" height="20" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="32" height="20" rx="3" fill="white" />
                                <circle cx="16" cy="10" r="6" fill="url(#grad2)" />
                                <defs>
                                    <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#EB001B" />
                                        <stop offset="100%" stopColor="#F79E1B" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <div className="bg-white px-2 py-1 rounded border border-gray-200">
                            <svg width="32" height="20" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="32" height="20" rx="3" fill="white" />
                                <text x="16" y="13" textAnchor="middle" fontSize="8" fill="#006FCF" fontFamily="Arial, sans-serif" fontWeight="bold">DI</text>
                            </svg>
                        </div>
                        <div className="bg-white px-2 py-1 rounded border border-gray-200 text-blue-600 font-bold text-xs">
                            +4
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-gray-100 space-y-4">
                    <PaymentElement />

                    <label className="flex items-center gap-3 cursor-pointer">
                        <div className="relative">
                            <input
                                type="checkbox"
                                checked={useShippingAsBilling}
                                onChange={(e) => setUseShippingAsBilling(e.target.checked)}
                                className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded cursor-pointer transition-colors"
                                style={{ backgroundColor: useShippingAsBilling ? '#2563eb' : 'white', borderColor: useShippingAsBilling ? '#2563eb' : '#d1d5db' }}
                            />
                            {useShippingAsBilling && (
                                <svg className="absolute w-3 h-3 text-white top-1 left-1 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            )}
                        </div>
                        <span className="text-lg">Use shipping address as billing address</span>
                    </label>

                    {!useShippingAsBilling && (
                        <div className="space-y-6 pt-6 border-t border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900">Billing address</h3>

                            <div className="relative">
                                <select className="w-full px-4 py-2 pt-6 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-semibold text-sm appearance-none transition-all">
                                    <option>United States</option>
                                </select>
                                <span className="absolute left-4 top-1.5 text-sm text-gray-500 transition-all">Country/Region</span>
                                <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                            </div>

                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    placeholder="First name"
                                    className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2  placeholder:text-sm focus:ring-primary/20 focus:border-primary text-lg transition-all"
                                    value={billingFirstName}
                                    onChange={(e) => setBillingFirstName(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Last name"
                                    className="flex-1 px-4 py-2 bg-white  border placeholder:text-sm border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-lg transition-all"
                                    value={billingLastName}
                                    onChange={(e) => setBillingLastName(e.target.value)}
                                />
                            </div>

                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Address"
                                    className="w-full px-4 py-2  placeholder:text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-lg transition-all pr-10"
                                    value={billingAddress}
                                    onChange={(e) => setBillingAddress(e.target.value)}
                                />
                            </div>

                            <input
                                type="text"
                                placeholder="Apartment, suite, etc. (optional)"
                                className="w-full px-4 py-2 bg-white  border placeholder:text-sm border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-lg transition-all"
                            />

                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    placeholder="City"
                                    className="w-full px-4 py-2  placeholder:text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-lg transition-all"
                                    value={billingCity}
                                    onChange={(e) => setBillingCity(e.target.value)}
                                />

                                <div className="relative w-full">
                                    <select
                                        className="px-4 py-3 w-full text-sm  placeholder:text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none transition-all pr-10"
                                        value={billingState}
                                        onChange={(e) => setBillingState(e.target.value)}
                                    >
                                        <option value="">State</option>
                                        <option value="AL">Alabama</option>
                                        <option value="AK">Alaska</option>
                                        <option value="AZ">Arizona</option>
                                        <option value="AR">Arkansas</option>
                                        <option value="CA">California</option>
                                        <option value="CO">Colorado</option>
                                        <option value="CT">Connecticut</option>
                                        <option value="DE">Delaware</option>
                                        <option value="FL">Florida</option>
                                        <option value="GA">Georgia</option>
                                        <option value="HI">Hawaii</option>
                                        <option value="ID">Idaho</option>
                                        <option value="IL">Illinois</option>
                                        <option value="IN">Indiana</option>
                                        <option value="IA">Iowa</option>
                                        <option value="KS">Kansas</option>
                                        <option value="KY">Kentucky</option>
                                        <option value="LA">Louisiana</option>
                                        <option value="ME">Maine</option>
                                        <option value="MD">Maryland</option>
                                        <option value="MA">Massachusetts</option>
                                        <option value="MI">Michigan</option>
                                        <option value="MN">Minnesota</option>
                                        <option value="MS">Mississippi</option>
                                        <option value="MO">Missouri</option>
                                        <option value="MT">Montana</option>
                                        <option value="NE">Nebraska</option>
                                        <option value="NV">Nevada</option>
                                        <option value="NH">New Hampshire</option>
                                        <option value="NJ">New Jersey</option>
                                        <option value="NM">New Mexico</option>
                                        <option value="NY">New York</option>
                                        <option value="NC">North Carolina</option>
                                        <option value="ND">North Dakota</option>
                                        <option value="OH">Ohio</option>
                                        <option value="OK">Oklahoma</option>
                                        <option value="OR">Oregon</option>
                                        <option value="PA">Pennsylvania</option>
                                        <option value="RI">Rhode Island</option>
                                        <option value="SC">South Carolina</option>
                                        <option value="SD">South Dakota</option>
                                        <option value="TN">Tennessee</option>
                                        <option value="TX">Texas</option>
                                        <option value="UT">Utah</option>
                                        <option value="VT">Vermont</option>
                                        <option value="VA">Virginia</option>
                                        <option value="WA">Washington</option>
                                        <option value="WV">West Virginia</option>
                                        <option value="WI">Wisconsin</option>
                                        <option value="WY">Wyoming</option>
                                    </select>
                                    <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                                </div>

                                <input
                                    type="text"
                                    placeholder="ZIP code"
                                    className="flex-1 px-4 py-2  placeholder:text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-lg transition-all"
                                    value={billingZipCode}
                                    onChange={(e) => setBillingZipCode(e.target.value)}
                                />
                            </div>

                            <div className="relative">
                                <input
                                    type="tel"
                                    placeholder="Phone (optional)"
                                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2  placeholder:text-sm focus:ring-primary/20 focus:border-primary text-lg transition-all pr-10"
                                    value={billingPhone}
                                    onChange={(e) => setBillingPhone(e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Save info section */}
            <div className="mb-6">
                <p className="text-md mb-2">Save my information for a faster checkout</p>
                <p className="text-xs text-gray-500">
                    By paying, you agree to create a Shop account subject to Shop's <a href="#" className="text-blue-600 underline">Terms and Privacy Policy</a>.
                    <span className="text-blue-600 text-xs ml-3 cursor-pointer">Not now</span>
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <button
                    disabled={isLoading || !stripe || !elements}
                    type="submit"
                    className={`w-full bg-primary cursor-pointer text-white py-3 rounded-md font-bold text-lg transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-800 hover:shadow-lg'}`}
                >
                    {isLoading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Processing...
                        </>
                    ) : (
                        `Pay now`
                    )}
                </button>
            </form>
        </div>
    );
};

const CheckoutClient = () => {
    const { subtotal, cartItems, clearCart } = useCart();
    const router = useRouter();
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [shippingMethod, setShippingMethod] = useState<'ship' | 'pickup'>('ship');

    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [phone, setPhone] = useState('');

    const [useShippingAsBilling, setUseShippingAsBilling] = useState(true);
    const [billingFirstName, setBillingFirstName] = useState('');
    const [billingLastName, setBillingLastName] = useState('');
    const [billingAddress, setBillingAddress] = useState('');
    const [billingCity, setBillingCity] = useState('');
    const [billingState, setBillingState] = useState('');
    const [billingZipCode, setBillingZipCode] = useState('');
    const [billingPhone, setBillingPhone] = useState('');

    const initializePayment = useCallback(async () => {
        if (subtotal <= 0) {
            return;
        }

        try {
            const response = await fetch('/api/create-payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: subtotal,
                    items: cartItems,
                    email,
                    fullName: `${firstName} ${lastName}`,
                    phone,
                    address: `${address}, ${city}, ${state} ${zipCode}`
                }),
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
        }
    }, [subtotal, cartItems, email, firstName, lastName, phone, address, city, state, zipCode]);

    // Initialize payment when cart has items
    useEffect(() => {
        if (subtotal > 0) {
            initializePayment();
        }
    }, [subtotal, initializePayment]);

    // Handle empty cart
    useEffect(() => {
        if (subtotal <= 0) {
            const timer = setTimeout(() => {
                router.push('/cart');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [subtotal, router]);

    if (subtotal <= 0) {
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

    if (error && !clientSecret) {
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
        <div className="min-h-screen bg-white flex flex-col lg:flex-row">
            {/* Left Side: Checkout Form */}
            <div className="flex-1 lg:max-w-[60%] px-6 md:px-12 lg:px-24 py-12 border-r border-gray-100">
                <div className="max-w-xl ml-auto w-full">
                    {/* Header/Breadcrumbs */}
                    <div className="mb-8">
                        <Link href="/">
                            <Image src="/logo.png" alt="ICEMANZ" width={150} height={40} className="mb-6 object-contain" />
                        </Link>
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
                                className="w-full px-4 py-3 placeholder:text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </section>

                    {/* Delivery Section */}
                    <section className="mb-10">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Delivery</h2>

                        {/* Shipping Method Toggle */}
                        <div className="flex gap-2 bg-gray-100 p-2 rounded-xl mb-8">
                            <button
                                type="button"
                                onClick={() => setShippingMethod('ship')}
                                className={`flex-1 py-2 cursor-pointer rounded-md font-semibold text-md flex items-center justify-center gap-2 transition-all ${shippingMethod === 'ship' ? 'bg-white text-black shadow-md' : 'text-gray-700 hover:text-gray-900'}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 17V7h4v10" /><path d="M12 7V4" /><path d="M7 17h10" /><path d="M5 17h2" /><path d="M17 17h2" /><rect x="3" y="4" width="18" height="13" rx="2" /></svg>
                                Ship
                            </button>
                            <button
                                type="button"
                                onClick={() => setShippingMethod('pickup')}
                                className={`flex-1 py-2 cursor-pointer rounded-md font-semibold text-md flex items-center justify-center gap-3 transition-all ${shippingMethod === 'pickup' ? 'bg-white text-black shadow-md' : 'text-gray-700 hover:text-gray-900'}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                                Pickup
                            </button>
                        </div>

                        {shippingMethod === 'ship' && (
                            <div className="space-y-6">
                                <div className="relative">
                                    <select className="w-full px-4 py-2 pt-6 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-semibold text-sm appearance-none transition-all">
                                        <option>United States</option>
                                    </select>
                                    <span className="absolute left-4 top-1.5 text-sm text-gray-500 transition-all">Country/Region</span>
                                    <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                                </div>

                                <div className="flex gap-4">
                                    <input
                                        type="text"
                                        placeholder="First name"
                                        className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 placeholder:text-sm focus:ring-primary/20 focus:border-primary text-lg transition-all"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Last name"
                                        className="flex-1 px-4 py-2 bg-white border placeholder:text-sm border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-lg transition-all"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </div>

                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Address"
                                        className="w-full px-4 py-2 placeholder:text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-lg transition-all pr-10"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                    />
                                </div>

                                <input
                                    type="text"
                                    placeholder="Apartment, suite, etc. (optional)"
                                    className="w-full px-4 py-2 bg-white border placeholder:text-sm border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-lg transition-all"
                                />

                                <div className="flex gap-4">
                                    <input
                                        type="text"
                                        placeholder="City"
                                        className="w-full px-4 py-2 placeholder:font-semibold placeholder:text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-lg transition-all"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                    />

                                    <div className="relative w-full">
                                        <select
                                            className="px-4 py-3 w-full text-sm placeholder:text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none transition-all pr-10"
                                            value={state}
                                            onChange={(e) => setState(e.target.value)}
                                        >
                                            <option value="">State</option>
                                            <option value="AL">Alabama</option>
                                            <option value="AK">Alaska</option>
                                            <option value="AZ">Arizona</option>
                                            <option value="AR">Arkansas</option>
                                            <option value="CA">California</option>
                                            <option value="CO">Colorado</option>
                                            <option value="CT">Connecticut</option>
                                            <option value="DE">Delaware</option>
                                            <option value="FL">Florida</option>
                                            <option value="GA">Georgia</option>
                                            <option value="HI">Hawaii</option>
                                            <option value="ID">Idaho</option>
                                            <option value="IL">Illinois</option>
                                            <option value="IN">Indiana</option>
                                            <option value="IA">Iowa</option>
                                            <option value="KS">Kansas</option>
                                            <option value="KY">Kentucky</option>
                                            <option value="LA">Louisiana</option>
                                            <option value="ME">Maine</option>
                                            <option value="MD">Maryland</option>
                                            <option value="MA">Massachusetts</option>
                                            <option value="MI">Michigan</option>
                                            <option value="MN">Minnesota</option>
                                            <option value="MS">Mississippi</option>
                                            <option value="MO">Missouri</option>
                                            <option value="MT">Montana</option>
                                            <option value="NE">Nebraska</option>
                                            <option value="NV">Nevada</option>
                                            <option value="NH">New Hampshire</option>
                                            <option value="NJ">New Jersey</option>
                                            <option value="NM">New Mexico</option>
                                            <option value="NY">New York</option>
                                            <option value="NC">North Carolina</option>
                                            <option value="ND">North Dakota</option>
                                            <option value="OH">Ohio</option>
                                            <option value="OK">Oklahoma</option>
                                            <option value="OR">Oregon</option>
                                            <option value="PA">Pennsylvania</option>
                                            <option value="RI">Rhode Island</option>
                                            <option value="SC">South Carolina</option>
                                            <option value="SD">South Dakota</option>
                                            <option value="TN">Tennessee</option>
                                            <option value="TX">Texas</option>
                                            <option value="UT">Utah</option>
                                            <option value="VT">Vermont</option>
                                            <option value="VA">Virginia</option>
                                            <option value="WA">Washington</option>
                                            <option value="WV">West Virginia</option>
                                            <option value="WI">Wisconsin</option>
                                            <option value="WY">Wyoming</option>
                                        </select>
                                        <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                                    </div>

                                    <input
                                        type="text"
                                        placeholder="ZIP code"
                                        className="px-4 w-full py-2 placeholder:text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-lg transition-all"
                                        value={zipCode}
                                        onChange={(e) => setZipCode(e.target.value)}
                                    />
                                </div>

                                <div className="flex justify-center items-center gap-4">
                                    <input
                                        type="text"
                                        placeholder="Phone"
                                        className="px-4 py-2.5 w-full placeholder:text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all pr-10"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>

                                {/* Shipping Method Info */}
                                <div className="mt-10">
                                    <h3 className="text-md font-bold text-gray-900 mb-4">Shipping method</h3>
                                    <p className="text-sm leading-relaxed mb-4">
                                        Please be advised that any unexpected extra or surcharges (such as limited access, inside delivery, residential address, lift gate, etc.) identified by the freight company at the time of delivery, will be added to the customer's invoice.
                                    </p>
                                    <div className="bg-gray-100 rounded-md p-5 text-center">
                                        <p className="text-sm text-gray-500">Enter your shipping address to view available shipping methods.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Payment Section */}
                    <section className="mb-10">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Payment</h2>
                        <p className="text-lg text-gray-500 mb-6">All transactions are secure and encrypted.</p>

                        {clientSecret ? (
                            <Elements stripe={stripePromise} options={{ clientSecret }}>
                                <CheckoutForm
                                    clientSecret={clientSecret}
                                    subtotal={subtotal}
                                    cartItems={cartItems}
                                    email={email}
                                    firstName={firstName}
                                    lastName={lastName}
                                    address={address}
                                    city={city}
                                    state={state}
                                    zipCode={zipCode}
                                    phone={phone}
                                    clearCart={clearCart}
                                />
                            </Elements>
                        ) : (
                            <div className="p-6 bg-gray-50 rounded-md text-center animate-pulse">
                                <p className="text-gray-500">Loading payment options...</p>
                            </div>
                        )}
                    </section>
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
                    </div>

                    <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                        <span className="text-xl font-bold text-gray-900">Total</span>
                        <div className="text-right">
                            <div className="flex items-baseline gap-2">
                                <span className="text-xs font-bold text-gray-500 uppercase">USD</span>
                                <span className="text-xl font-semibold text-gray-900">
                                    ${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutClient;
