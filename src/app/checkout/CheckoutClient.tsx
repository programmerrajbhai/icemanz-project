'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, Lock, ShoppingCart, User, MapPin, FileText, Send, Clock, Headphones, ShieldCheck, CheckCircle2, ShoppingCart as ShoppingCartIcon, Info, ArrowRightLeft } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import toast from 'react-hot-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const CheckoutClient = () => {
    const { subtotal, cartItems, clearCart } = useCart();
    const router = useRouter();
    const searchParams = useSearchParams();
    const invoiceId = searchParams.get('invoiceId');

    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [contactPersonRole, setContactPersonRole] = useState('');
    const [businessType, setBusinessType] = useState('');
    const [purchaseTimeline, setPurchaseTimeline] = useState('');
    const [numberLocations, setNumberLocations] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [country, setCountry] = useState('United States');
    const [phone, setPhone] = useState('');
    const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
    const [billingAddress, setBillingAddress] = useState('');
    const [billingCity, setBillingCity] = useState('');
    const [billingState, setBillingState] = useState('');
    const [billingZipCode, setBillingZipCode] = useState('');
    const [billingCountry, setBillingCountry] = useState('United States');
    const [loadingDock, setLoadingDock] = useState(false);
    const [forklift, setForklift] = useState(false);
    const [residentialDelivery, setResidentialDelivery] = useState(false);
    const [projectDetails, setProjectDetails] = useState('');
    const [additionalInfo, setAdditionalInfo] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [isSuccess, setIsSuccess] = useState(false);

    // Initial fetch if invoiceId is present
    useEffect(() => {
        if (invoiceId) {
            setIsLoading(true);
            const fetchInvoiceDetails = async () => {
                try {
                    const response = await fetch(`/api/invoice/${invoiceId}`);
                    if (response.ok) {
                        const data = await response.json();
                        if (data.qboPaymentLink || data.paymentLink) {
                            window.location.href = data.qboPaymentLink || data.paymentLink;
                            return;
                        }

                        if (data.email) setEmail(data.email);
                        if (data.phone) setPhone(data.phone);
                        if (data.fullName) {
                            const parts = data.fullName.split(' ');
                            setFirstName(parts[0] || '');
                            setLastName(parts.slice(1).join(' ') || '');
                        }
                    }
                } catch (error) {
                    console.error("Error fetching invoice details:", error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchInvoiceDetails();
        }
    }, [invoiceId]);

    const handleCheckoutSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (subtotal <= 0) {
            return;
        }

        if (!email || !firstName || !lastName || !companyName || !businessType || !address || !city || !state || !zipCode || !phone) {
            toast.error("Please fill in all required fields.");
            return;
        }

        if (!billingSameAsShipping && (!billingAddress || !billingCity || !billingState || !billingZipCode)) {
            toast.error("Please fill in all required billing fields.");
            return;
        }

        setIsLoading(true);

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
                    address: `${address}, ${city}, ${state} ${zipCode}, ${country}`,
                    companyName,
                    contactPersonRole,
                    businessType,
                    purchaseTimeline,
                    numberLocations,
                    billingSameAsShipping,
                    billingAddress,
                    billingCity,
                    billingState,
                    billingZipCode,
                    billingCountry,
                    deliveryRequirements: {
                        loadingDock,
                        forklift,
                        residentialDelivery
                    },
                    projectDetails
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                clearCart();
                setIsSuccess(true);
                setIsLoading(false);
                return;
            }

            if (data.clientSecret) {
                toast.error("Stripe is not supported in this flow. Please use QuickBooks.");
                setIsLoading(false);
            } else {
                const errorMsg = data.error || 'Failed to initialize payment';
                setError(errorMsg);
                toast.error(errorMsg);
                setIsLoading(false);
            }
        } catch (err) {
            console.error('Payment initialization error:', err);
            const errorMsg = 'Could not connect to payment server. Please check your connection.';
            setError(errorMsg);
            toast.error(errorMsg);
            setIsLoading(false);
        }
    };

    // Handle empty cart
    useEffect(() => {
        if (!invoiceId && subtotal <= 0 && !isSuccess) {
            const timer = setTimeout(() => {
                router.push('/cart');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [subtotal, router, invoiceId, isSuccess]);

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-[#f9fafb] flex flex-col">
                <Header />
                <main className="grow flex items-center justify-center bg-white pt-32">
                    <div className="flex flex-col items-center gap-6 max-w-md px-6 text-center">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-2">
                            <CheckCircle2 size={40} />
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-3xl font-black text-[#003366] tracking-tight">Request Received!</h2>
                            <p className="text-gray-600 text-base leading-relaxed">
                                Thank you for your request. We have sent a confirmation to <span className="font-bold text-gray-900">{email}</span>.
                            </p>
                            <p className="text-gray-500 text-sm">
                                Our team will review your selected equipment and send you an invoice with final pricing shortly.
                            </p>
                        </div>
                        <Link
                            href="/"
                            className="mt-4 bg-[#004a99] text-white px-8 py-3.5 rounded-md font-bold hover:bg-[#003366] transition-colors shadow-md w-full"
                        >
                            Return to Home
                        </Link>
                    </div>
                </main>

            </div>
        );
    }

    if (!invoiceId && subtotal <= 0) {
        return (
            <div className="min-h-screen bg-[#f9fafb] flex flex-col">
                <Header />
                <main className="grow flex items-center justify-center bg-white pt-32">
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
                            className="bg-[#004a99] text-white px-8 py-3 rounded-sm font-bold hover:bg-[#003366] transition-colors"
                        >
                            Return to Cart
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (invoiceId && isLoading) {
        return (
            <div className="min-h-screen bg-[#f9fafb] flex flex-col">
                <Header />
                <main className="grow flex items-center justify-center bg-white pt-32">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-8 h-8 border-4 border-[#004a99]/30 border-t-[#004a99] rounded-full animate-spin"></div>
                        <p className="text-gray-500 font-medium">Redirecting to secure payment...</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Header />
            <main className="grow max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 pt-32 pb-20">

                {/* Header Title */}
                <div className="mb-8 lg:mb-12 max-w-2xl pt-12">
                    <h1 className="text-3xl lg:text-4xl font-extrabold text-[#003366] mb-3 tracking-tight">Request Your Invoice</h1>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        Complete your details below. Our team will review your selected equipment, confirm shipping details, and send you an invoice with final pricing.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

                    {/* Left Side: Checkout Form */}
                    <div className="flex-1 lg:max-w-[65%]">
                        <form onSubmit={handleCheckoutSubmit} className="space-y-8">

                            {/* Contact & Business Information */}
                            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#004a99] shrink-0 border border-blue-100">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-[#003366]">1. Contact & Business Information</h2>
                                        <p className="text-sm text-gray-500 mt-0.5">Tell us about you and your business.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-[#003366] mb-1.5">First Name <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Enter your first name"
                                            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004a99]/20 focus:border-[#004a99] text-sm transition-all"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-[#003366] mb-1.5">Last Name <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Enter your last name"
                                            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004a99]/20 focus:border-[#004a99] text-sm transition-all"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-[#003366] mb-1.5">Email Address <span className="text-red-500">*</span></label>
                                        <input
                                            type="email"
                                            required
                                            placeholder="name@company.com"
                                            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004a99]/20 focus:border-[#004a99] text-sm transition-all"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-[#003366] mb-1.5">Phone Number <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="(123) 456-7890"
                                            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004a99]/20 focus:border-[#004a99] text-sm transition-all"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-[#003366] mb-1.5">Company Name <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Enter your company name"
                                            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004a99]/20 focus:border-[#004a99] text-sm transition-all"
                                            value={companyName}
                                            onChange={(e) => setCompanyName(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-[#003366] mb-1.5">Contact Person Role</label>
                                        <div className="relative">
                                            <select
                                                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004a99]/20 focus:border-[#004a99] text-sm appearance-none transition-all text-gray-600"
                                                value={contactPersonRole}
                                                onChange={(e) => setContactPersonRole(e.target.value)}
                                            >
                                                <option value="">e.g. Owner, Manager, Buyer</option>
                                                <option value="Owner">Owner</option>
                                                <option value="Manager">Manager</option>
                                                <option value="Buyer">Buyer</option>
                                                <option value="Other">Other</option>
                                            </select>
                                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-[#003366] mb-1.5">Business Type <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <select
                                                required
                                                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004a99]/20 focus:border-[#004a99] text-sm appearance-none transition-all text-gray-600"
                                                value={businessType}
                                                onChange={(e) => setBusinessType(e.target.value)}
                                            >
                                                <option value="">Select your business type</option>
                                                <option value="Restaurant">Restaurant</option>
                                                <option value="Supermarket">Supermarket</option>
                                                <option value="Convenience Store">Convenience Store</option>
                                                <option value="Warehouse">Warehouse</option>
                                                <option value="Other">Other</option>
                                            </select>
                                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-[#003366] mb-1.5">Purchase Timeline</label>
                                        <div className="relative">
                                            <select
                                                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004a99]/20 focus:border-[#004a99] text-sm appearance-none transition-all text-gray-600"
                                                value={purchaseTimeline}
                                                onChange={(e) => setPurchaseTimeline(e.target.value)}
                                            >
                                                <option value="">Select timeline</option>
                                                <option value="Immediately">Immediately</option>
                                                <option value="Within 1 month">Within 1 month</option>
                                                <option value="1-3 months">1-3 months</option>
                                                <option value="3+ months">3+ months</option>
                                            </select>
                                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-[#003366] mb-1.5">Number of Locations</label>
                                        <div className="relative">
                                            <select
                                                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004a99]/20 focus:border-[#004a99] text-sm appearance-none transition-all text-gray-600"
                                                value={numberLocations}
                                                onChange={(e) => setNumberLocations(e.target.value)}
                                            >
                                                <option value="">Select number of locations</option>
                                                <option value="1">1</option>
                                                <option value="2-5">2-5</option>
                                                <option value="6-10">6-10</option>
                                                <option value="10+">10+</option>
                                            </select>
                                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Information */}
                            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#004a99] shrink-0 border border-blue-100">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-[#003366]">2. Delivery Information</h2>
                                        <p className="text-sm text-gray-500 mt-0.5">Where should we deliver your equipment?</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mb-6">
                                    <input
                                        type="checkbox"
                                        id="billingSame"
                                        className="w-4 h-4 text-[#004a99] border-gray-300 rounded focus:ring-[#004a99]"
                                        checked={billingSameAsShipping}
                                        onChange={(e) => setBillingSameAsShipping(e.target.checked)}
                                    />
                                    <label htmlFor="billingSame" className="text-sm font-semibold text-[#003366] cursor-pointer">
                                        Billing address same as shipping address
                                    </label>
                                </div>

                                <div className={`grid grid-cols-1 gap-6 items-start transition-all duration-300 ${!billingSameAsShipping ? 'lg:grid-cols-[1fr_auto_1fr]' : ''}`}>

                                    {/* Shipping Address Container */}
                                    <div className={`space-y-5 ${!billingSameAsShipping ? 'bg-white border border-gray-200 rounded-xl p-5 shadow-sm' : ''}`}>
                                        {!billingSameAsShipping && <h3 className="text-base font-bold text-[#003366] mb-4 pb-2 border-b border-gray-100">Shipping Address</h3>}

                                        <div>
                                            <label className="block text-sm font-semibold text-[#003366] mb-1.5">Street Address <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Enter street address"
                                                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004a99]/20 focus:border-[#004a99] text-sm transition-all"
                                                value={address}
                                                onChange={(e) => setAddress(e.target.value)}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
                                            <div>
                                                <label className="block text-sm font-semibold text-[#003366] mb-1.5">City <span className="text-red-500">*</span></label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="City"
                                                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004a99]/20 focus:border-[#004a99] text-sm transition-all"
                                                    value={city}
                                                    onChange={(e) => setCity(e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-[#003366] mb-1.5">State / Province <span className="text-red-500">*</span></label>
                                                <div className="relative">
                                                    <select
                                                        required
                                                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004a99]/20 focus:border-[#004a99] text-sm appearance-none transition-all text-gray-600"
                                                        value={state}
                                                        onChange={(e) => setState(e.target.value)}
                                                    >
                                                        <option value="">Select state</option>
                                                        <option value="AL">Alabama</option>
                                                        <option value="AK">Alaska</option>
                                                        <option value="AZ">Arizona</option>
                                                        <option value="CA">California</option>
                                                        <option value="CO">Colorado</option>
                                                        <option value="FL">Florida</option>
                                                        <option value="GA">Georgia</option>
                                                        <option value="IL">Illinois</option>
                                                        <option value="NY">New York</option>
                                                        <option value="TX">Texas</option>
                                                    </select>
                                                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
                                            <div>
                                                <label className="block text-sm font-semibold text-[#003366] mb-1.5">ZIP / Postal Code <span className="text-red-500">*</span></label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="ZIP / Postal code"
                                                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004a99]/20 focus:border-[#004a99] text-sm transition-all"
                                                    value={zipCode}
                                                    onChange={(e) => setZipCode(e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-[#003366] mb-1.5">Country <span className="text-red-500">*</span></label>
                                                <div className="relative">
                                                    <select
                                                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004a99]/20 focus:border-[#004a99] text-sm appearance-none transition-all text-gray-600"
                                                        value={country}
                                                        onChange={(e) => setCountry(e.target.value)}
                                                    >
                                                        <option value="United States">United States</option>
                                                    </select>
                                                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Center Icon */}
                                    {!billingSameAsShipping && (
                                        <div className="hidden lg:flex mt-32 justify-center">
                                            <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center bg-gray-50 text-gray-400 shadow-sm">
                                                <ArrowRightLeft size={18} />
                                            </div>
                                        </div>
                                    )}

                                    {/* Billing Address Container */}
                                    {!billingSameAsShipping && (
                                        <div className="space-y-5 bg-white border border-gray-200 rounded-xl p-5 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
                                            <h3 className="text-base font-bold text-[#003366] mb-4 pb-2 border-b border-gray-100">Billing Address</h3>
                                            <div>
                                                <label className="block text-sm font-semibold text-[#003366] mb-1.5">Street Address <span className="text-red-500">*</span></label>
                                                <input
                                                    type="text"
                                                    required={!billingSameAsShipping}
                                                    placeholder="Enter street address"
                                                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004a99]/20 focus:border-[#004a99] text-sm transition-all"
                                                    value={billingAddress}
                                                    onChange={(e) => setBillingAddress(e.target.value)}
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
                                                <div>
                                                    <label className="block text-sm font-semibold text-[#003366] mb-1.5">City <span className="text-red-500">*</span></label>
                                                    <input
                                                        type="text"
                                                        required={!billingSameAsShipping}
                                                        placeholder="City"
                                                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004a99]/20 focus:border-[#004a99] text-sm transition-all"
                                                        value={billingCity}
                                                        onChange={(e) => setBillingCity(e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-[#003366] mb-1.5">State / Province <span className="text-red-500">*</span></label>
                                                    <div className="relative">
                                                        <select
                                                            required={!billingSameAsShipping}
                                                            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004a99]/20 focus:border-[#004a99] text-sm appearance-none transition-all text-gray-600"
                                                            value={billingState}
                                                            onChange={(e) => setBillingState(e.target.value)}
                                                        >
                                                            <option value="">Select state</option>
                                                            <option value="AL">Alabama</option>
                                                            <option value="AK">Alaska</option>
                                                            <option value="AZ">Arizona</option>
                                                            <option value="CA">California</option>
                                                            <option value="CO">Colorado</option>
                                                            <option value="FL">Florida</option>
                                                            <option value="GA">Georgia</option>
                                                            <option value="IL">Illinois</option>
                                                            <option value="NY">New York</option>
                                                            <option value="TX">Texas</option>
                                                        </select>
                                                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
                                                <div>
                                                    <label className="block text-sm font-semibold text-[#003366] mb-1.5">ZIP / Postal Code <span className="text-red-500">*</span></label>
                                                    <input
                                                        type="text"
                                                        required={!billingSameAsShipping}
                                                        placeholder="ZIP / Postal code"
                                                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004a99]/20 focus:border-[#004a99] text-sm transition-all"
                                                        value={billingZipCode}
                                                        onChange={(e) => setBillingZipCode(e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-[#003366] mb-1.5">Country <span className="text-red-500">*</span></label>
                                                    <div className="relative">
                                                        <select
                                                            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004a99]/20 focus:border-[#004a99] text-sm appearance-none transition-all text-gray-600"
                                                            value={billingCountry}
                                                            onChange={(e) => setBillingCountry(e.target.value)}
                                                        >
                                                            <option value="United States">United States</option>
                                                        </select>
                                                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 bg-[#f8fbff] rounded-lg p-5 border border-blue-100">
                                    <h3 className="text-sm font-semibold text-[#003366] mb-1">Delivery Requirements (optional)</h3>
                                    <p className="text-xs text-gray-500 mb-4">This helps us prepare the best delivery experience.</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 text-[#004a99] border-gray-300 rounded focus:ring-[#004a99]"
                                                checked={loadingDock}
                                                onChange={(e) => setLoadingDock(e.target.checked)}
                                            />
                                            <span className="text-sm text-gray-700">Loading dock available</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 text-[#004a99] border-gray-300 rounded focus:ring-[#004a99]"
                                                checked={forklift}
                                                onChange={(e) => setForklift(e.target.checked)}
                                            />
                                            <span className="text-sm text-gray-700">Forklift available</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 text-[#004a99] border-gray-300 rounded focus:ring-[#004a99]"
                                                checked={residentialDelivery}
                                                onChange={(e) => setResidentialDelivery(e.target.checked)}
                                            />
                                            <span className="text-sm text-gray-700">Residential delivery</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Information */}
                            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#004a99] shrink-0 border border-blue-100">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-[#003366]">3. Additional Information (Optional)</h2>
                                        <p className="text-sm text-gray-500 mt-0.5">Any additional details that help us serve you better.</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-[#003366] mb-1.5">Project Details / Notes</label>
                                    <textarea
                                        rows={4}
                                        placeholder="Tell us about your project, specific requirements, or any questions..."
                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004a99]/20 focus:border-[#004a99] text-sm transition-all resize-none"
                                        value={projectDetails}
                                        onChange={(e) => setProjectDetails(e.target.value)}
                                    ></textarea>
                                </div>
                                <div className="mt-4 flex items-center gap-2 text-gray-500 text-xs">
                                    <Lock size={14} />
                                    <span>Your information is secure and will only be used to process your request.</span>
                                </div>
                            </div>

                            {/* Submit Button & Trust Badges */}
                            <div>
                                <button
                                    disabled={isLoading}
                                    type="submit"
                                    className={`w-full bg-[#004a99] cursor-pointer text-white py-4 rounded-xl font-bold text-lg transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-3 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#003366] hover:shadow-lg'}`}
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={20} />
                                            Request Invoice & Pricing
                                        </>
                                    )}
                                </button>

                                <p className="text-center text-xs text-gray-500 mt-4">
                                    Our team will review and email your invoice within 1 business day.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 border-t border-gray-100 pt-6">
                                    <div className="flex items-center gap-3 justify-center md:justify-start">
                                        <CheckCircle2 className="text-[#004a99] shrink-0" size={20} />
                                        <div>
                                            <p className="text-xs font-bold text-gray-800">No payment required</p>
                                            <p className="text-[10px] text-gray-500">You will not be charged yet.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 justify-center md:justify-start">
                                        <ShieldCheck className="text-[#004a99] shrink-0" size={20} />
                                        <div>
                                            <p className="text-xs font-bold text-gray-800">Pricing confirmed</p>
                                            <p className="text-[10px] text-gray-500">We confirm final pricing before payment.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 justify-center md:justify-start">
                                        <Lock className="text-[#004a99] shrink-0" size={20} />
                                        <div>
                                            <p className="text-xs font-bold text-gray-800">Secure & Private</p>
                                            <p className="text-[10px] text-gray-500">Your information is safe with us.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Right Side: Order Summary */}
                    <div className="flex-1 lg:max-w-[35%] space-y-6">
                        {/* 1. Selected Equipment Card */}
                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                            {/* Summary Header */}
                            <div className="p-5 flex items-center gap-3">
                                <ShoppingCartIcon className="text-[#004a99]" size={22} />
                                <h2 className="text-lg font-bold text-[#003366]">Selected Equipment</h2>
                            </div>

                            <div className="px-5 pb-5">
                                {/* Cart Items */}
                                <div className="space-y-6 mb-6 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex gap-4 items-center">
                                            <div className="relative w-24 h-24 bg-white border border-gray-200 rounded-lg shrink-0 overflow-hidden shadow-sm flex items-center justify-center">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-contain p-2"
                                                    sizes="96px"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-3 mb-1">{item.name}</h3>
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">{item.brand}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Totals */}
                                <div className="space-y-3 pt-6 border-t border-gray-100">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600 font-medium">Quantity</span>
                                        <span className="text-gray-900 font-bold">{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600 font-medium">Equipment Price</span>
                                        <span className="text-gray-900 font-bold">${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                    </div>
                                </div>

                                {/* Grand Total */}
                                <div className="flex justify-between items-center pt-6 pb-6 mt-4 border-t border-gray-100">
                                    <span className="text-sm font-bold text-gray-900">Estimated Project Cost</span>
                                    <div className="text-right flex items-baseline gap-1.5">
                                        <span className="text-xl font-black text-[#004a99]">
                                            ${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}+
                                        </span>
                                    </div>
                                </div>

                                {/* Important Note Box */}
                                <div className="bg-[#f0f7ff] border border-[#d6e8ff] rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <Info className="text-[#004a99] shrink-0 mt-0.5" size={18} />
                                        <div>
                                            <h4 className="text-sm font-bold text-[#003366] mb-1">Important Note</h4>
                                            <p className="text-xs text-[#004a99]/80 leading-relaxed">
                                                Shipping, installation, and any applicable taxes will be calculated after reviewing your delivery requirements.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. What Happens Next Card */}
                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-bold text-[#003366] mb-6">What Happens Next?</h2>

                            <div className="space-y-6 relative">
                                {/* Vertical line connecting the steps */}
                                <div className="absolute left-[19px] top-8 bottom-8 w-px bg-gray-200"></div>

                                <div className="flex gap-4 relative z-10">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#004a99] shrink-0">
                                        <User size={18} />
                                    </div>
                                    <div className="pt-1">
                                        <h4 className="text-sm font-bold text-[#003366] mb-1">We Review Your Request</h4>
                                        <p className="text-xs text-gray-500 leading-relaxed">
                                            Our equipment specialist will review your requirements.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4 relative z-10">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#004a99] shrink-0">
                                        <FileText size={18} />
                                    </div>
                                    <div className="pt-1">
                                        <h4 className="text-sm font-bold text-[#003366] mb-1">We Prepare Your Invoice</h4>
                                        <p className="text-xs text-gray-500 leading-relaxed">
                                            You'll receive a detailed invoice with final pricing via email.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4 relative z-10">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#004a99] shrink-0">
                                        <Clock size={18} />
                                    </div>
                                    <div className="pt-1">
                                        <h4 className="text-sm font-bold text-[#003366] mb-1">You Confirm & We Deliver</h4>
                                        <p className="text-xs text-gray-500 leading-relaxed">
                                            Once confirmed, we schedule production and delivery.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Why Choose Icemanz Card */}
                        <div className="bg-[#f8fbff] border border-blue-100 rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-bold text-[#003366] mb-5">Why Choose Icemanz?</h2>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="text-[#004a99] shrink-0" size={18} />
                                    <p className="text-sm text-gray-700">Commercial-grade quality equipment</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="text-[#004a99] shrink-0" size={18} />
                                    <p className="text-sm text-gray-700">Nationwide delivery & support</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="text-[#004a99] shrink-0" size={18} />
                                    <p className="text-sm text-gray-700">Dedicated equipment specialists</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="text-[#004a99] shrink-0" size={18} />
                                    <p className="text-sm text-gray-700">Quick response within 1 business day</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </main >
        </div >
    );
};

export default CheckoutClient;