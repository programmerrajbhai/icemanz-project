'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
    MapPin, CreditCard, Lock, Truck, CheckCircle2, Info, 
    ShoppingBag, ArrowRight, Building, Package, ShieldCheck 
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import toast from 'react-hot-toast';

// ─── Astra shipping locations (Regional Hubs) ────────────────────────────────
interface ShippingLocation {
    id: string;
    state: string;
    stateCode: string;
    city: string;
    name: string;
    address: string;
    cost: number;
}

const ASTRA_SHIPPING_LOCATIONS: ShippingLocation[] = [
    { id: 'ct-hartford', state: 'Connecticut', stateCode: 'CT', city: 'Hartford', name: 'Hartford City Hall', address: '550 Main Street, Hartford, CT 06103', cost: 1375 },
    { id: 'ct-new-haven', state: 'Connecticut', stateCode: 'CT', city: 'New Haven', name: 'New Haven City Hall', address: '165 Church Street, New Haven, CT 06510', cost: 1125 },
    { id: 'pa-philadelphia', state: 'Pennsylvania', stateCode: 'PA', city: 'Philadelphia', name: 'Philadelphia City Hall', address: 'Philadelphia, PA 19107', cost: 1125 },
    { id: 'pa-pittsburgh', state: 'Pennsylvania', stateCode: 'PA', city: 'Pittsburgh', name: 'Pittsburgh City-County Building', address: '414 Grant Street, Pittsburgh, PA 15219', cost: 1750 },
];

const LOCATIONS_BY_STATE = ASTRA_SHIPPING_LOCATIONS.reduce<Record<string, ShippingLocation[]>>((acc, loc) => {
    if (!acc[loc.state]) acc[loc.state] = [];
    acc[loc.state].push(loc);
    return acc;
}, {});

// ─── Direct Freight Options (B2B Logic) ──────────────────────────────────────
type FreightOption = {
    id: string;
    label: string;
    description: string;
    price: number;
    icon: React.ReactNode;
};

// Main Checkout Component
const CheckoutClient = () => {
    const { subtotal, cartItems, clearCart } = useCart();
    const router = useRouter();
    const searchParams = useSearchParams();
    const sidebarRef = useRef<HTMLDivElement>(null);
    const [isFixed, setIsFixed] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Contact Info
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [company, setCompany] = useState('');

    // Delivery Info
    const [deliveryMethod, setDeliveryMethod] = useState<'ship' | 'hub' | 'pickup'>('ship');
    const [address, setAddress] = useState('');
    const [apartment, setApartment] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [country, setCountry] = useState('US');

    // Extras
    const [discountCode, setDiscountCode] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Shipping Selections
    const [selectedShippingLocation, setSelectedShippingLocation] = useState<ShippingLocation | null>(null);
    const [selectedFreight, setSelectedFreight] = useState<string>('freight_dock');
    const [freightOptions, setFreightOptions] = useState<FreightOption[]>([]);
    const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);

    const hasAstraItems = cartItems.some(item => item.category === 'walk-in-cooler-freezer');
    const isOversized = cartItems.some(item => typeof item.price === 'number' ? item.price >= 5000 : parseFloat(String(item.price).replace(/[^0-9.]/g, '')) >= 5000);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Sticky Sidebar Logic
    useEffect(() => {
        const handleScroll = () => {
            setIsFixed(window.scrollY > 250);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Calculate Dynamic Freight Options
    useEffect(() => {
        if (cartItems.length === 0) return;
        setIsCalculatingShipping(true);
        
        // Simulate API call for freight calculation based on ZIP
        setTimeout(() => {
            let options: FreightOption[] = [];
            if (isOversized) {
                options = [
                    { id: 'freight_dock', label: 'Standard Freight (Dock-to-Dock)', description: 'Customer must have a loading dock or forklift.', price: 350.00, icon: <Truck size={20}/> },
                    { id: 'freight_liftgate', label: 'Freight with Liftgate Service', description: 'Driver lowers equipment to the ground.', price: 550.00, icon: <Package size={20}/> },
                    { id: 'freight_inside', label: 'Inside Delivery', description: 'Driver brings equipment inside the first set of doors.', price: 750.00, icon: <Building size={20}/> }
                ];
                if (!options.find(o => o.id === selectedFreight)) setSelectedFreight('freight_dock');
            } else {
                options = [
                    { id: 'standard', label: 'Standard Shipping', description: '5-7 business days', price: subtotal > 2000 ? 0 : 150.00, icon: <Truck size={20}/> },
                    { id: 'expedited', label: 'Expedited Freight', description: '3-4 business days', price: 250.00, icon: <Package size={20}/> }
                ];
                if (!options.find(o => o.id === selectedFreight)) setSelectedFreight('standard');
            }
            setFreightOptions(options);
            setIsCalculatingShipping(false);
        }, 500);
    }, [cartItems, zipCode, subtotal, isOversized]);

    // Active Shipping Cost Logic
    let activeShippingPrice = 0;
    if (deliveryMethod === 'ship') {
        activeShippingPrice = freightOptions.find(opt => opt.id === selectedFreight)?.price || 0;
    } else if (deliveryMethod === 'hub' && selectedShippingLocation) {
        activeShippingPrice = selectedShippingLocation.cost;
    } else if (deliveryMethod === 'pickup') {
        activeShippingPrice = 0;
    }

    const grandTotal = subtotal + activeShippingPrice;

    // Validation
    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!email) newErrors.email = 'Email is required';
        if (!firstName) newErrors.firstName = 'First name is required';
        if (!lastName) newErrors.lastName = 'Last name is required';
        if (!phone) newErrors.phone = 'Phone is required';
        
        if (deliveryMethod === 'ship') {
            if (!address) newErrors.address = 'Address is required';
            if (!city) newErrors.city = 'City is required';
            if (!state) newErrors.state = 'State is required';
            if (!zipCode) newErrors.zipCode = 'ZIP code is required';
        }

        if (deliveryMethod === 'hub' && !selectedShippingLocation) {
            toast.error('Please select a Regional Hub location');
            return false;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

const handleCheckout = async () => {
        if (!validateForm()) {
            toast.error('Please fill in all required fields properly.');
            return;
        }

        setIsProcessing(true); // লোডিং শুরু

        try {
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cartItems,
                    customerInfo: {
                        email,
                        phone,
                        firstName,
                        lastName,
                        company,
                        address: deliveryMethod === 'ship' ? address : '',
                        apartment: deliveryMethod === 'ship' ? apartment : '',
                        city: deliveryMethod === 'ship' ? city : '',
                        state: deliveryMethod === 'ship' ? state : '',
                        zipCode: deliveryMethod === 'ship' ? zipCode : '',
                        country
                    },
                    deliveryMethod,
                    shippingCost: activeShippingPrice,
                    shippingMethod: deliveryMethod === 'ship' ? (freightOptions.find(o => o.id === selectedFreight)?.label || 'Freight') : (deliveryMethod === 'hub' ? 'Regional Hub' : 'Store Pickup'),
                    shippingLocation: deliveryMethod === 'hub' ? selectedShippingLocation : null,
                }),
            });

            const data = await response.json();

            if (data.error) {
                toast.error(data.error);
                setIsProcessing(false); // এরর আসলে লোডিং বন্ধ হবে
                return;
            }

            if (data.url) {
                window.location.href = data.url; // সাকসেস হলে Stripe-এ নিয়ে যাবে
            } else {
                // যদি API থেকে URL না আসে
                toast.error('Payment gateway error. No URL returned from API.');
                setIsProcessing(false); // লোডিং বন্ধ হবে
            }
        } catch (error) {
            console.error('Checkout error:', error);
            toast.error('Failed to connect to checkout API. Please try again.');
            setIsProcessing(false); // নেটওয়ার্ক এরর হলেও লোডিং বন্ধ হবে
        }
    };

    if (!isMounted) return null;

    if (subtotal <= 0 || cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl border-2 border-gray-200 p-8 text-center shadow-lg">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShoppingBag size={36} className="text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                    <p className="text-gray-600 mb-6">Add items to your cart to proceed to checkout.</p>
                    <Link href="/walk-in-cooler-freezer" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all hover:gap-3">
                        Continue Shopping <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Stripe Loading Skeleton */}
            {isProcessing && (
                <div className="fixed inset-0 z-[9999] bg-white flex flex-col">
                    <div className="h-1 w-full bg-gray-100 overflow-hidden">
                        <div className="h-full bg-blue-500 animate-[loading_1.5s_ease-in-out_infinite]" style={{ width: '60%', animation: 'slideProgress 1.5s ease-in-out infinite' }} />
                    </div>
                    <style>{`
                        @keyframes slideProgress { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
                        @keyframes shimmer { 0% { background-position: -1000px 0; } 100% { background-position: 1000px 0; } }
                        .shimmer { background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 1000px 100%; animation: shimmer 1.5s infinite; }
                    `}</style>
                    <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-10 flex flex-col lg:flex-row gap-8">
                        <div className="flex-1 space-y-6">
                            <div className="shimmer h-8 w-48 rounded-lg" />
                            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
                                <div className="shimmer h-5 w-32 rounded" />
                                <div className="space-y-2"><div className="shimmer h-4 w-24 rounded" /><div className="shimmer h-12 w-full rounded-lg" /></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2"><div className="shimmer h-4 w-20 rounded" /><div className="shimmer h-12 w-full rounded-lg" /></div>
                                    <div className="space-y-2"><div className="shimmer h-4 w-12 rounded" /><div className="shimmer h-12 w-full rounded-lg" /></div>
                                </div>
                                <div className="space-y-2"><div className="shimmer h-4 w-32 rounded" /><div className="shimmer h-12 w-full rounded-lg" /></div>
                                <div className="shimmer h-14 w-full rounded-xl mt-4" />
                            </div>
                        </div>
                        <div className="lg:w-[380px] space-y-4">
                            <div className="bg-blue-50 rounded-xl border border-blue-100 p-4 flex items-start gap-3">
                                <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-blue-800">Redirecting to Stripe...</p>
                                    <p className="text-xs text-blue-600 mt-0.5">Please wait while we prepare your secure checkout.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
            `}</style>

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
                    {/* Left Column */}
                    <div className="space-y-8 pb-12">
                        
                        {/* 1. Contact Information */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                            <h2 className="text-xl font-bold text-gray-900 mb-5 border-b border-gray-100 pb-3">1. Contact Information</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Email Address *</label>
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`w-full px-4 py-3 border rounded-lg focus:border-blue-500 focus:ring-2 focus:outline-none transition-all ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'}`} placeholder="Purchasing contact email" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">First Name *</label>
                                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={`w-full px-4 py-3 border rounded-lg focus:border-blue-500 focus:ring-2 focus:outline-none transition-all ${errors.firstName ? 'border-red-500 bg-red-50' : 'border-gray-300'}`} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Last Name *</label>
                                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className={`w-full px-4 py-3 border rounded-lg focus:border-blue-500 focus:ring-2 focus:outline-none transition-all ${errors.lastName ? 'border-red-500 bg-red-50' : 'border-gray-300'}`} />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Company Name (Optional)</label>
                                    <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:outline-none transition-all" placeholder="Business name for invoice" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number *</label>
                                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={`w-full px-4 py-3 border rounded-lg focus:border-blue-500 focus:ring-2 focus:outline-none transition-all ${errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'}`} placeholder="For delivery coordination" />
                                </div>
                            </div>
                        </div>

                        {/* 2. Delivery Method */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                            <h2 className="text-xl font-bold text-gray-900 mb-5 border-b border-gray-100 pb-3">2. Delivery Method</h2>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                                <button type="button" onClick={() => setDeliveryMethod('ship')} className={`py-4 px-3 rounded-xl border-2 font-bold text-sm transition-all flex flex-col items-center justify-center gap-2 ${deliveryMethod === 'ship' ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' : 'border-gray-200 text-gray-600 hover:border-blue-300'}`}>
                                    <Truck size={24} /> Direct Freight
                                </button>
                                {hasAstraItems && (
                                    <button type="button" onClick={() => setDeliveryMethod('hub')} className={`py-4 px-3 rounded-xl border-2 font-bold text-sm transition-all flex flex-col items-center justify-center gap-2 ${deliveryMethod === 'hub' ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' : 'border-gray-200 text-gray-600 hover:border-blue-300'}`}>
                                        <Building size={24} /> Regional Hub
                                    </button>
                                )}
                                <button type="button" onClick={() => setDeliveryMethod('pickup')} className={`py-4 px-3 rounded-xl border-2 font-bold text-sm transition-all flex flex-col items-center justify-center gap-2 ${deliveryMethod === 'pickup' ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' : 'border-gray-200 text-gray-600 hover:border-blue-300'}`}>
                                    <MapPin size={24} /> NY Pickup
                                </button>
                            </div>

                            {/* Option 1: Direct Freight (B2B Logic) */}
                            {deliveryMethod === 'ship' && (
                                <div className="space-y-6 animate-in fade-in duration-300">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Street Address *</label>
                                            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className={`w-full px-4 py-3 border rounded-lg focus:border-blue-500 focus:ring-2 focus:outline-none ${errors.address ? 'border-red-500 bg-red-50' : 'border-gray-300'}`} placeholder="Installation site address" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">City *</label>
                                            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className={`w-full px-4 py-3 border rounded-lg focus:border-blue-500 focus:ring-2 focus:outline-none ${errors.city ? 'border-red-500 bg-red-50' : 'border-gray-300'}`} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">State *</label>
                                                <input type="text" value={state} onChange={(e) => setState(e.target.value)} className={`w-full px-4 py-3 border rounded-lg focus:border-blue-500 focus:ring-2 focus:outline-none ${errors.state ? 'border-red-500 bg-red-50' : 'border-gray-300'}`} placeholder="e.g. NY" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">ZIP Code *</label>
                                                <input type="text" value={zipCode} onChange={(e) => setZipCode(e.target.value)} className={`w-full px-4 py-3 border rounded-lg focus:border-blue-500 focus:ring-2 focus:outline-none ${errors.zipCode ? 'border-red-500 bg-red-50' : 'border-gray-300'}`} placeholder="Required for freight" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Freight Selection */}
                                    <div className="pt-4 border-t border-gray-100">
                                        <h3 className="text-base font-bold text-gray-900 mb-3">Freight Options</h3>
                                        {isCalculatingShipping ? (
                                            <div className="py-6 text-center text-gray-500 animate-pulse bg-gray-50 rounded-lg">Calculating commercial freight rates...</div>
                                        ) : (
                                            <div className="space-y-3">
                                                {freightOptions.map((option) => (
                                                    <label key={option.id} className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${selectedFreight === option.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
                                                        <input type="radio" name="freightMethod" checked={selectedFreight === option.id} onChange={() => setSelectedFreight(option.id)} className="mt-1 accent-blue-600 w-4 h-4" />
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex justify-between mb-1">
                                                                <span className="font-bold text-gray-900 text-sm flex items-center gap-2">{option.icon} {option.label}</span>
                                                                <span className="font-bold text-gray-900">{option.price === 0 ? 'FREE' : `$${option.price.toFixed(2)}`}</span>
                                                            </div>
                                                            <p className="text-xs text-gray-500">{option.description}</p>
                                                        </div>
                                                    </label>
                                                ))}
                                                {isOversized && (
                                                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-3 text-sm text-yellow-800">
                                                        <ShieldCheck size={18} className="shrink-0 text-yellow-600"/>
                                                        <p>Commercial equipment requires specialized delivery. Ensure your facility can accommodate large freight trucks.</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Option 2: Regional Hub (Astra) */}
                            {deliveryMethod === 'hub' && hasAstraItems && (
                                <div className="space-y-4 animate-in fade-in duration-300">
                                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 mb-4">
                                        <p className="text-sm text-blue-800 font-medium">Save on shipping by picking up your equipment directly from one of our regional manufacturer hubs.</p>
                                    </div>
                                    {Object.entries(LOCATIONS_BY_STATE).map(([stateName, locs]) => (
                                        <div key={stateName}>
                                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">{stateName}</p>
                                            <div className="space-y-2">
                                                {locs.map(loc => (
                                                    <label key={loc.id} className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedShippingLocation?.id === loc.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
                                                        <input type="radio" name="astraShipping" checked={selectedShippingLocation?.id === loc.id} onChange={() => setSelectedShippingLocation(loc)} className="mt-1 accent-blue-600 w-4 h-4" />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-bold text-gray-900">{loc.name}</p>
                                                            <p className="text-xs text-gray-500 mt-1">{loc.address}</p>
                                                        </div>
                                                        <span className="text-sm font-bold text-gray-900 bg-white px-3 py-1 rounded border border-gray-200 shadow-sm shrink-0">
                                                            ${loc.cost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Option 3: NY Pickup */}
                            {deliveryMethod === 'pickup' && (
                                <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 animate-in fade-in duration-300">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                                            <MapPin size={24} className="text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-1">Pickup Location</p>
                                            <p className="font-black text-gray-900 text-xl">ICEMANZ Hub NY</p>
                                            <p className="text-sm text-gray-600 mt-1">184-60 Jamaica Ave, Hollis, NY 11423, United States</p>
                                            <div className="flex items-center gap-3 mt-4">
                                                <span className="text-sm font-black text-green-800 bg-green-200 px-4 py-1.5 rounded-full border border-green-300">FREE</span>
                                                <span className="text-xs font-medium text-gray-600 bg-white px-3 py-1.5 rounded-full border border-gray-200">⏱ Usually ready in 2-4 days</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:border-l lg:border-gray-200 lg:pl-12">
                        <div ref={sidebarRef} className={`space-y-6 transition-all duration-300 ${isFixed ? 'lg:fixed lg:top-24 lg:w-[calc(480px-3rem)]' : 'lg:relative'}`}>
                            
                            <div className="space-y-5 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <h2 className="text-lg font-bold text-gray-900 pb-2 border-b border-gray-200">Order Summary</h2>
                                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg border border-gray-200/80">
                                            <div className="relative w-16 h-16 bg-white rounded-md border border-gray-200 flex-shrink-0 p-1">
                                                <Image src={item.image} alt={item.name} fill className="object-contain p-0.5" />
                                                <div className="absolute -top-2 -right-2 w-5 h-5 bg-blue-600 text-white text-[10px] rounded-full flex items-center justify-center font-bold">{item.quantity}</div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-xs font-semibold text-gray-900 line-clamp-2">{item.name}</h3>
                                                <p className="text-[11px] text-gray-400 mt-0.5">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="text-sm font-bold text-gray-900 flex-shrink-0 text-right">
                                                ${(parseFloat(String(item.price).replace(/[^0-9.]/g, '')) * item.quantity).toLocaleString('en-US', {minimumFractionDigits:2})}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                                <div className="flex justify-between text-[15px]">
                                    <span className="text-gray-600 font-medium">Subtotal</span>
                                    <span className="font-bold text-gray-900">${subtotal.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                                </div>
                                <div className="flex justify-between text-[15px]">
                                    <span className="text-gray-600 font-medium flex items-center gap-1">Shipping / Freight</span>
                                    <span className={activeShippingPrice === 0 ? "font-bold text-green-600" : "font-bold text-gray-900"}>
                                        {activeShippingPrice === 0 ? 'FREE' : `$${activeShippingPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                                    </span>
                                </div>
                                <div className="flex justify-between text-[15px] pb-4 border-b border-gray-200">
                                    <span className="text-gray-600 font-medium">Tax</span>
                                    <span className="text-gray-500 text-sm italic">Calculated at checkout</span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-lg font-bold text-gray-900">Total</span>
                                    <div className="text-right">
                                        <div className="text-xs text-gray-500 mb-1 font-medium">USD</div>
                                        <div className="text-3xl font-black bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">${grandTotal.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
                                    </div>
                                </div>
                            </div>

                            <button onClick={handleCheckout} disabled={isProcessing || !email} className={`w-full py-4 rounded-xl font-bold text-white text-base transition-all flex items-center justify-center gap-2 ${isProcessing || !email ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 active:scale-[0.98] shadow-lg hover:shadow-xl'}`}>
                                {isProcessing ? 'Processing Secure Payment...' : <><Lock size={18} /> Proceed to Payment</>}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CheckoutClient;