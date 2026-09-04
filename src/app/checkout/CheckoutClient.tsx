'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { MapPin, CreditCard, Lock, Truck, CheckCircle2, Info, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import toast from 'react-hot-toast';

// Main Checkout Component
const CheckoutClient = () => {
    const { subtotal, cartItems, clearCart } = useCart();
    const router = useRouter();
    const searchParams = useSearchParams();
    const sidebarRef = useRef<HTMLDivElement>(null);
    const [isFixed, setIsFixed] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [deliveryMethod, setDeliveryMethod] = useState<'ship' | 'pickup'>('ship');
    const [discountCode, setDiscountCode] = useState('');
    const [country, setCountry] = useState('US');

    // Shipping address fields
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [apartment, setApartment] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');

    // Handle sticky sidebar on scroll
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            // Make sidebar fixed after scrolling 250px
            if (scrollPosition > 250) {
                setIsFixed(true);
            } else {
                setIsFixed(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Check if user canceled checkout
    useEffect(() => {
        if (searchParams.get('canceled') === 'true') {
            toast.error('Checkout was canceled. Please try again.');
        }
    }, [searchParams]);

    // Handle Stripe Checkout
    const handleCheckout = async () => {
        if (!email) {
            toast.error('Please enter your email address');
            return;
        }

        if (!phone) {
            toast.error('Please enter your phone number');
            return;
        }

        setIsProcessing(true);

        try {
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cartItems,
                    customerInfo: {
                        email,
                        phone,
                        country,
                    },
                    deliveryMethod,
                }),
            });

            const data = await response.json();

            if (data.error) {
                toast.error(data.error);
                setIsProcessing(false);
                return;
            }

            // Redirect to Stripe Checkout
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error('Checkout error:', error);
            toast.error('Failed to start checkout. Please try again.');
            setIsProcessing(false);
        }
    };

    // Empty Cart State
    if (subtotal <= 0 || cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl border-2 border-gray-200 p-8 text-center shadow-lg">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShoppingBag size={36} className="text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                    <p className="text-gray-600 mb-6">Add items to your cart to proceed to checkout.</p>
                    <Link
                        href="/walk-in-cooler-freezer"
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all hover:gap-3"
                    >
                        Continue Shopping
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Custom Styles */}
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f5f9;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
            `}</style>

            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm backdrop-blur-sm bg-white/95">
                <div className="max-w-[1200px] mx-auto px-6 py-5 flex items-center justify-between">
                    <Link href="/" className="flex items-center">
                        <Image src="/logo.png" alt="ICEMANZ" width={140} height={40} className="h-10 w-auto" />
                    </Link>
                    <Link href="/cart" className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-2 hover:gap-3 transition-all">
                        <CreditCard size={18} />
                        <span className="hidden sm:inline">View Cart</span>
                    </Link>
                </div>
            </header>

            <main className="max-w-[1200px] mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-12">
                    {/* Left Column - Form */}
                    <div className="space-y-8 pb-12">
                        {/* Contact Section */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-xl font-bold text-gray-900">Contact</h2>
                                <Link href="/login" className="text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium">Sign in</Link>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none text-[15px] transition-all"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="emailNews"
                                        defaultChecked
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                    />
                                    <label htmlFor="emailNews" className="text-sm text-gray-700">
                                        Email me with news and offers
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Section */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                            <h2 className="text-xl font-bold text-gray-900 mb-5">Delivery Method</h2>

                            {/* Ship / Pickup Toggle */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <button
                                    type="button"
                                    onClick={() => setDeliveryMethod('ship')}
                                    className={`py-4 px-4 rounded-xl border-2 font-semibold text-[15px] transition-all ${deliveryMethod === 'ship'
                                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md scale-[1.02]'
                                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                                        }`}
                                >
                                    <Truck size={20} className="inline mr-2 -mt-0.5" />
                                    Ship to Address
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setDeliveryMethod('pickup')}
                                    className={`py-4 px-4 rounded-xl border-2 font-semibold text-[15px] transition-all ${deliveryMethod === 'pickup'
                                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md scale-[1.02]'
                                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                                        }`}
                                >
                                    <MapPin size={20} className="inline mr-2 -mt-0.5" />
                                    Store Pickup
                                </button>
                            </div>

                            {deliveryMethod === 'pickup' && (
                                <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                                            <MapPin size={20} className="text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-600 mb-2">Pickup Location</p>
                                            <p className="font-bold text-gray-900 text-base">899 NEWARK TPKE</p>
                                            <p className="text-sm text-gray-600 mt-1">866 Newark Tpke, Kearny NJ 07032, United States</p>
                                            <div className="flex items-center gap-2 mt-3">
                                                <span className="text-xs font-semibold text-green-700 bg-green-100 px-3 py-1.5 rounded-full">FREE</span>
                                                <span className="text-xs text-gray-600">⏱ Usually ready in 2-4 days</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {deliveryMethod === 'ship' && (
                                <div className="space-y-4">
                                    <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Truck size={20} className="text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-gray-900 text-base mb-1">Shipping Information</p>
                                                <p className="text-sm text-gray-600 leading-relaxed">
                                                    Shipping address and options will be collected on the next step through our secure Stripe checkout.
                                                </p>
                                                <p className="text-xs text-gray-500 mt-3 leading-relaxed">
                                                    <strong>Note:</strong> Any unexpected extra surcharges (limited access, inside delivery, residential address, lift gate, etc.) identified by the freight company will be added to your invoice.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Country/Region</label>
                                        <select
                                            value={country}
                                            onChange={(e) => setCountry(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none text-[15px] transition-all bg-white"
                                        >
                                            <option value="US">United States</option>
                                            <option value="CA">Canada</option>
                                            <option value="MX">Mexico</option>
                                            <option value="GB">United Kingdom</option>
                                            <option value="AU">Australia</option>
                                            <option value="OTHER">Other</option>
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Payment Section */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                            <h2 className="text-xl font-bold text-gray-900 mb-3">Payment</h2>
                            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                                Click the button below to proceed to our secure Stripe checkout where you can enter your payment details and complete your purchase.
                            </p>

                            <div className="flex items-center justify-center gap-3 p-4 bg-gray-50 rounded-lg mb-6 flex-wrap">
                                <div className="flex items-center gap-2">
                                    <Lock size={18} className="text-gray-600" />
                                    <span className="text-sm text-gray-700 font-medium">Secure Payment</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="h-6" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="48" height="48" rx="4" fill="#1434CB" />
                                        <path d="M21.5 28L16 20H18.5L22 25L25.5 20H28L22.5 28V32H21.5V28Z" fill="white" />
                                    </svg>
                                    <svg className="h-6" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="18" cy="24" r="12" fill="#EB001B" />
                                        <circle cx="30" cy="24" r="12" fill="#FF5F00" />
                                    </svg>
                                    <svg className="h-6" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="48" height="48" rx="4" fill="#006FCF" />
                                        <path d="M20 14H16V34H20V14Z" fill="white" />
                                        <path d="M30 20L26 16V32L30 28V20Z" fill="white" />
                                    </svg>
                                    <svg className="h-6" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="48" height="48" rx="4" fill="#FF6600" />
                                        <circle cx="24" cy="24" r="10" fill="white" />
                                        <circle cx="24" cy="24" r="6" fill="#FF6600" />
                                    </svg>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={isProcessing || !email}
                                className={`w-full py-4 rounded-xl font-bold text-white text-base transition-all flex items-center justify-center gap-2 ${isProcessing || !email
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 active:scale-[0.98] shadow-lg hover:shadow-xl'
                                    }`}
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Continue to Payment
                                        <ArrowRight size={20} />
                                    </>
                                )}
                            </button>

                            <p className="text-xs text-center text-gray-500 mt-4 leading-relaxed">
                                By continuing, you agree to our{' '}
                                <Link href="/terms-and-conditions" className="text-blue-600 hover:underline">Terms of Service</Link>
                                {' '}and{' '}
                                <Link href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link>
                            </p>
                        </div>

                        {/* Footer Links */}
                        <div className="flex flex-wrap gap-4 justify-center text-[13px] text-gray-600 pt-4 border-t border-gray-200">
                            <Link href="/refund-policy" className="hover:text-blue-600 hover:underline transition-colors">Refund policy</Link>
                            <Link href="/shipping" className="hover:text-blue-600 hover:underline transition-colors">Shipping</Link>
                            <Link href="/privacy-policy" className="hover:text-blue-600 hover:underline transition-colors">Privacy policy</Link>
                            <Link href="/terms-and-conditions" className="hover:text-blue-600 hover:underline transition-colors">Terms of service</Link>
                            <Link href="/support" className="hover:text-blue-600 hover:underline transition-colors">Contact</Link>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:border-l lg:border-gray-200 lg:pl-12">
                        <div
                            ref={sidebarRef}
                            className={`space-y-6 transition-all duration-300 ${isFixed
                                ? 'lg:fixed lg:top-6 lg:w-[calc(480px-3rem)]'
                                : 'lg:relative'
                                }`}
                        >
                            {/* Cart Items */}
                            <div className="space-y-5 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <h2 className="text-lg font-bold text-gray-900 pb-2 border-b border-gray-200">Order Summary</h2>
                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg border border-gray-200/80 hover:bg-gray-100/80 transition-colors">
                                            <div className="relative w-16 h-16 bg-white rounded-md border border-gray-200 flex-shrink-0 p-1 shadow-sm">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name || 'Product Image'}
                                                    fill
                                                    className="object-contain p-0.5 rounded-md"
                                                />
                                                <div className="absolute -top-2 -right-2 w-5 h-5 bg-blue-600 text-white text-[10px] rounded-full flex items-center justify-center font-bold shadow-md border-2 border-white">
                                                    {item.quantity}
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-xs font-semibold text-gray-900 leading-snug break-words line-clamp-2">{item.name}</h3>
                                                {item.brand && <p className="text-[11px] text-gray-400 mt-0.5">{item.brand}</p>}
                                                <p className="text-[11px] text-gray-400">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="text-sm font-bold text-gray-900 flex-shrink-0 text-right">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Discount Code */}
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Discount code or gift card"
                                    value={discountCode}
                                    onChange={(e) => setDiscountCode(e.target.value)}
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none text-[15px] transition-all"
                                />
                                <button
                                    type="button"
                                    className="px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 active:scale-95 transition-all text-[15px] shadow-sm"
                                >
                                    Apply
                                </button>
                            </div>

                            {/* Totals */}
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                                <div className="flex justify-between text-[15px]">
                                    <span className="text-gray-600 font-medium">Subtotal</span>
                                    <span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-[15px]">
                                    <span className="text-gray-600 font-medium flex items-center gap-1">
                                        Shipping
                                        <Info size={15} className="text-gray-400" />
                                    </span>
                                    <span className="text-gray-500 text-sm italic">Calculated at checkout</span>
                                </div>
                                <div className="flex justify-between text-[15px] pb-4 border-b border-gray-200">
                                    <span className="text-gray-600 font-medium flex items-center gap-1">
                                        Tax
                                        <Info size={15} className="text-gray-400" />
                                    </span>
                                    <span className="text-gray-500 text-sm italic">Calculated at checkout</span>
                                </div>

                                {/* Grand Total */}
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-lg font-bold text-gray-900">Total</span>
                                    <div className="text-right">
                                        <div className="text-xs text-gray-500 mb-1 font-medium">USD</div>
                                        <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">${subtotal.toFixed(2)}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-3 gap-2">
                                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                                    <CheckCircle2 size={18} className="text-green-600 flex-shrink-0" />
                                    <span className="text-xs font-medium text-green-700">Secure Payment</span>
                                </div>
                                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <Lock size={18} className="text-blue-600 flex-shrink-0" />
                                    <span className="text-xs font-medium text-blue-700">SSL Encrypted</span>
                                </div>
                                <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                                    <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
                                    <span className="text-xs font-medium text-emerald-700">PCI Compliant</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CheckoutClient;
