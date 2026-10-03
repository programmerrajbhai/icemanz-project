'use client';

import { useState, FormEvent, useEffect, useRef } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, PaymentElement, AddressElement } from '@stripe/react-stripe-js';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Truck, MapPin } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CheckoutFormProps {
    initialAmount: number;
    paymentIntentId: string;
    invoiceRequestId: string;
    cartItemsSnapshot: any[];
}

function CheckoutForm({ initialAmount, paymentIntentId, invoiceRequestId, cartItemsSnapshot }: CheckoutFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const { cartItems } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [deliveryMethod, setDeliveryMethod] = useState<'ship' | 'pickup'>('ship');
    const [shippingAddress, setShippingAddress] = useState<any>(null);
    const [billingAddress, setBillingAddress] = useState<any>(null);
    const [customerEmail, setCustomerEmail] = useState('');
    const [taxAmount, setTaxAmount] = useState(0);
    // Start at 0 — correct value is set by update-payment-intent after address is entered
    const [shippingCharge, setShippingCharge] = useState(0);
    // Track whether we're currently updating the payment intent
    const [isUpdatingIntent, setIsUpdatingIntent] = useState(false);
    // Track if we've already updated the payment intent for the current address
    const [hasUpdatedForAddress, setHasUpdatedForAddress] = useState(false);
    // True only after a successful update-payment-intent call for the current address
    // Pay button stays disabled until this is true (for ship delivery)
    const [amountConfirmed, setAmountConfirmed] = useState(false);

    // Check if cart contains Astra products
    const hasAstraProduct = cartItems.some(
        item => item.brand?.toLowerCase() === 'astra' || item.category === 'walk-in-cooler-freezer'
    );

    // Check if cart contains Amerikooler products
    const hasAmerikoolerProduct = cartItems.some(
        item => item.brand?.toLowerCase() === 'amerikooler'
    );

    // Check if cart contains refrigeration equipment (Condensing, Evaporation, Combo units)
    const hasRefrigerationEquipment = cartItems.some(
        item => item.category === 'refrigeration-equipment' ||
            item.category === 'condensing-units' ||
            item.category === 'evaporation-units' ||
            item.category === 'combo-units-package-units'
    );

    // Astra shipping zones by state (based on distance from NJ warehouse)
    const getAstraShipping = (state: string): number => {
        const astraShippingRates: Record<string, number> = {
            // Zone 1 - Northeast (base $1000)
            'NY': 1000, 'NJ': 1000, 'CT': 1000, 'PA': 1000,
            'MA': 1000, 'RI': 1000, 'NH': 1000, 'VT': 1000,
            'ME': 1000, 'DE': 1000, 'MD': 1000,
            // Zone 2 - Mid-Atlantic / Southeast ($1500)
            'VA': 1500, 'WV': 1500, 'NC': 1500, 'SC': 1500,
            'DC': 1500,
            // Zone 3 - South / Midwest ($2000)
            'IL': 2000, 'OH': 2000, 'IN': 2000, 'MI': 2000,
            'GA': 2000, 'TN': 2000, 'KY': 2000, 'AL': 2000,
            // Zone 4 - Southeast coast ($2437.50)
            'FL': 2437.50,
            // Zone 5 - South Central ($2812.50)
            'TX': 2812.50, 'OK': 2812.50, 'AR': 2812.50,
            'LA': 2812.50, 'MS': 2812.50,
            // Zone 6 - Mountain / Central ($3250)
            'CO': 3250, 'MN': 3250, 'WI': 3250, 'IA': 3250,
            'MO': 3250, 'KS': 3250, 'NE': 3250, 'SD': 3250,
            'ND': 3250, 'WY': 3250, 'MT': 3250, 'UT': 3250,
            'NV': 3250, 'ID': 3250, 'WA': 3250, 'OR': 3250,
            // Zone 7 - West Coast ($3750)
            'CA': 3750, 'AZ': 3750, 'NM': 3750,
            // Zone 8 - Remote ($4500)
            'AK': 4500, 'HI': 4500,
        };
        return astraShippingRates[state] ?? 2000; // Default $2000 for unknown states
    };

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const discountAmount = subtotal * (discount / 100);
    const subtotalAfterDiscount = subtotal - discountAmount;
    const actualShipping = deliveryMethod === 'pickup' ? 0 : shippingCharge;
    const total = subtotalAfterDiscount + actualShipping + taxAmount;

    // Shipping display is driven entirely by server response from update-payment-intent.
    // No client-side preset needed — shippingCharge starts at 0 and is set after address entry.
    // (useEffect removed: was setting stale/wrong initial estimates)

    // Function to update payment intent with shipping/tax
    const updatePaymentIntentWithAddress = (state: string) => {
        console.log('🔄 [DEBUG] updatePaymentIntentWithAddress called with state:', state);
        console.log('🔄 [DEBUG] Check conditions:', {
            isUpdatingIntent,
            paymentIntentId,
            invoiceRequestId,
        });

        if (isUpdatingIntent || !paymentIntentId || !invoiceRequestId) {
            console.log('⛔ [DEBUG] Skipping update - conditions not met');
            return;
        }

        console.log('🚀 [DEBUG] Starting payment intent update...');
        setIsUpdatingIntent(true);
        setHasUpdatedForAddress(true);
        setAmountConfirmed(false); // reset until server confirms

        fetch('/api/update-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                paymentIntentId,
                invoiceRequestId,
                cartItems: cartItemsSnapshot,
                deliveryMethod: deliveryMethod,
                state,
            }),
        })
            .then(r => r.json())
            .then(data => {
                console.log('✅ [DEBUG] Payment intent update response:', data);
                if (data.breakdown) {
                    setShippingCharge(data.breakdown.shipping);
                    setTaxAmount(data.breakdown.tax);
                    setAmountConfirmed(true); // shipping+tax now locked in PaymentIntent
                    console.log('💰 [DEBUG] Updated charges:', {
                        shipping: data.breakdown.shipping,
                        tax: data.breakdown.tax,
                    });
                }
            })
            .catch(err => {
                console.error('❌ [DEBUG] Failed to update payment intent:', err);
                setAmountConfirmed(false);
            })
            .finally(() => {
                console.log('🏁 [DEBUG] Payment intent update finished');
                setIsUpdatingIntent(false);
            });
    };

    const handleAddressChange = (event: any) => {
        console.log('📍 [DEBUG] Address changed event:', event);

        if (event.value?.address) {
            const address = event.value.address;
            console.log('📍 [DEBUG] Address value:', address);
            console.log('📍 [DEBUG] Has state?', !!address.state);
            console.log('📍 [DEBUG] Has postal_code?', !!address.postal_code);

            setShippingAddress(event.value);
            setHasUpdatedForAddress(false);
            setAmountConfirmed(false); // require re-confirmation for new address

            // If address is complete, update immediately
            if (address.state && address.postal_code) {
                console.log('✅ [DEBUG] Address is complete, calling updatePaymentIntentWithAddress');
                console.log('✅ [DEBUG] Current state:', {
                    paymentIntentId,
                    invoiceRequestId,
                    isUpdatingIntent,
                    hasUpdatedForAddress,
                });
                updatePaymentIntentWithAddress(address.state);
            } else {
                console.log('⏳ [DEBUG] Address incomplete - missing state or ZIP');
            }
        } else {
            console.log('❌ [DEBUG] No address in event.value');
        }
    };

    // ── Retry update when payment intent becomes available ──
    useEffect(() => {
        // If we have a complete address but haven't updated yet (e.g., payment intent wasn't ready)
        if (
            deliveryMethod === 'ship' &&
            shippingAddress?.address?.state &&
            shippingAddress?.address?.postal_code &&
            paymentIntentId &&
            invoiceRequestId &&
            !hasUpdatedForAddress &&
            !isUpdatingIntent
        ) {
            updatePaymentIntentWithAddress(shippingAddress.address.state);
        } else if (
            deliveryMethod === 'pickup' &&
            billingAddress?.address?.state &&
            paymentIntentId &&
            invoiceRequestId &&
            !hasUpdatedForAddress &&
            !isUpdatingIntent
        ) {
            updatePaymentIntentWithAddress(billingAddress.address.state);
        }
    }, [paymentIntentId, invoiceRequestId, deliveryMethod, shippingAddress, billingAddress, hasUpdatedForAddress, isUpdatingIntent]);

    const handleBillingAddressChange = (event: any) => {
        console.log('💳 Billing address changed:', event);
        if (event.value?.address) {
            setBillingAddress(event.value);
            
            // If pickup is selected, we should calculate tax based on billing address state
            if (deliveryMethod === 'pickup') {
                setHasUpdatedForAddress(false);
                if (event.value.address.state) {
                    updatePaymentIntentWithAddress(event.value.address.state);
                }
            }
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setIsProcessing(true);
        setErrorMessage(null);

        try {
            // Validate required fields
            if (!customerEmail) {
                setErrorMessage('Please enter your email address.');
                setIsProcessing(false);
                return;
            }

            if (deliveryMethod === 'ship' && !shippingAddress) {
                setErrorMessage('Please enter your shipping address.');
                setIsProcessing(false);
                return;
            }

            if (!billingAddress) {
                setErrorMessage('Please enter your billing address.');
                setIsProcessing(false);
                return;
            }

            // Submit the payment element to validate and collect data
            const { error: submitError } = await elements.submit();
            if (submitError) {
                setErrorMessage(submitError.message || 'Please complete all required fields.');
                setIsProcessing(false);
                return;
            }

            // Prepare billing details - this is required when billingDetails field is set to 'never'
            const billingDetails = {
                name: billingAddress?.name || 'Customer',
                email: customerEmail,
                phone: billingAddress?.phone || undefined,
                address: {
                    line1: billingAddress?.address?.line1 || '',
                    line2: billingAddress?.address?.line2 || undefined,
                    city: billingAddress?.address?.city || '',
                    state: billingAddress?.address?.state || '',
                    postal_code: billingAddress?.address?.postal_code || '',
                    country: billingAddress?.address?.country || 'US',
                },
            };

            // Confirm the payment
            const { error } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/checkout/success`,
                    payment_method_data: {
                        billing_details: billingDetails,
                    },
                    // Add shipping details to the payment
                    shipping: deliveryMethod === 'ship' && shippingAddress ? {
                        name: shippingAddress.name || billingDetails.name,
                        phone: shippingAddress.phone || billingAddress?.phone,
                        address: {
                            line1: shippingAddress.address.line1,
                            line2: shippingAddress.address.line2 || undefined,
                            city: shippingAddress.address.city,
                            state: shippingAddress.address.state,
                            postal_code: shippingAddress.address.postal_code,
                            country: shippingAddress.address.country,
                        },
                    } : undefined,
                },
            });

            if (error) {
                console.error('Payment error:', error);
                setErrorMessage(error.message || 'An unexpected error occurred.');
                setIsProcessing(false);
            }
        } catch (err: any) {
            console.error('Payment exception:', err);
            setErrorMessage(err.message || 'Payment failed. Please try again.');
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans text-[#1f2937]">
            {/* Header */}
            <header className="border-b border-gray-200 bg-white py-4">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    <Link href="/">
                        <Image src="/logo.png" alt="Icemanz" width={140} height={80} className="h-12 w-auto object-contain" />
                    </Link>
                    <Link href="/cart" className="text-gray-700 hover:text-black p-1">
                        <ShoppingBag size={22} />
                    </Link>
                </div>
            </header>

            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-73px)]">

                    {/* LEFT COLUMN - Forms */}
                    <div className="lg:col-span-7 px-4 sm:px-6 lg:px-8 py-6 bg-white border-r border-gray-200 space-y-6">

                        {/* Express Checkout */}
                        {/* <div className="space-y-3">
                            <p className="text-xs text-center text-gray-500 font-medium tracking-wide">Express checkout</p>
                            <div className="grid grid-cols-3 gap-2.5">
                                <button type="button" className="bg-[#5a31f4] text-white py-3 rounded-md font-bold text-sm hover:opacity-90 transition">
                                    shop
                                </button>
                                <button type="button" className="bg-[#ffc439] text-[#003087] py-3 rounded-md font-bold text-sm hover:opacity-90 transition flex items-center justify-center">
                                    PayPal
                                </button>
                                <button type="button" className="bg-black text-white py-3 rounded-md font-bold text-sm hover:opacity-90 transition flex items-center justify-center">
                                    G Pay
                                </button>
                            </div>
                            <div className="relative flex py-3 items-center">
                                <div className="flex-grow border-t border-gray-200"></div>
                                <span className="flex-shrink mx-4 text-xs font-semibold text-gray-400 uppercase">OR</span>
                                <div className="flex-grow border-t border-gray-200"></div>
                            </div>
                        </div> */}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Contact Section */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <h2 className="text-lg font-bold text-gray-900">Contact</h2>
                                    {/* <Link href="/login" className="text-sm text-blue-600 hover:underline font-medium">Sign in</Link> */}
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={customerEmail}
                                    onChange={(e) => setCustomerEmail(e.target.value)}
                                    className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition"
                                    placeholder="Email"
                                />
                                <label className="flex items-center gap-2.5 mt-2.5 cursor-pointer">
                                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-0 w-4 h-4" />
                                    <span className="text-sm text-gray-700">Email me with news and offers</span>
                                </label>
                            </div>

                            {/* Delivery Section */}
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 mb-2.5">Delivery</h2>
                                <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-md text-sm font-medium border border-gray-200">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setDeliveryMethod('ship');
                                            // Reset the flag so useEffect can trigger update
                                            setHasUpdatedForAddress(false);
                                            setAmountConfirmed(false); // require address re-entry
                                        }}
                                        className={`py-2.5 rounded-sm flex items-center justify-center gap-2 transition-all text-sm ${deliveryMethod === 'ship' ? 'bg-white shadow-sm text-black font-semibold' : 'text-gray-600'}`}
                                    >
                                        <Truck size={18} />
                                        <span>Ship</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setDeliveryMethod('pickup');
                                            setAmountConfirmed(true);
                                            setIsUpdatingIntent(true);

                                            const stateToUse = billingAddress?.address?.state || null;

                                            fetch('/api/update-payment-intent', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({
                                                    paymentIntentId,
                                                    invoiceRequestId,
                                                    cartItems: cartItemsSnapshot,
                                                    deliveryMethod: 'pickup',
                                                    state: stateToUse,
                                                }),
                                            })
                                                .then(r => r.json())
                                                .then(data => {
                                                    if (data.breakdown) {
                                                        setShippingCharge(0);
                                                        setTaxAmount(data.breakdown.tax || 0);
                                                    }
                                                })
                                                .catch(err => console.error('Failed to update payment intent:', err))
                                                .finally(() => setIsUpdatingIntent(false));
                                        }}
                                        className={`py-2.5 rounded-sm flex items-center justify-center gap-2 transition-all text-sm ${deliveryMethod === 'pickup' ? 'bg-white shadow-sm text-black font-semibold' : 'text-gray-600'}`}
                                    >
                                        <MapPin size={18} />
                                        <span>Pickup</span>
                                    </button>
                                </div>
                            </div>

                            {/* Address Section */}
                            {deliveryMethod === 'ship' && (
                                <div className="space-y-3.5">
                                    <AddressElement
                                        options={{
                                            mode: 'shipping',
                                            allowedCountries: ['US'],
                                            fields: { phone: 'always' },
                                            validation: {
                                                phone: {
                                                    required: 'always',
                                                },
                                            },
                                            display: { name: 'split' }
                                        }}
                                        onChange={handleAddressChange}
                                    />

                                    <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-md text-xs text-gray-600 leading-relaxed">
                                        <p className="font-semibold text-gray-800 text-xs uppercase tracking-wide mb-1.5">Shipping method</p>
                                        <p className="text-xs leading-relaxed">
                                            Please be advised that any unexpected extra or surcharges (such as limited access, inside delivery, residential address, lift gate, etc.) identified by the freight company at the time of delivery, will be added to the customer's invoice.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Pickup Location */}
                            {deliveryMethod === 'pickup' && (
                                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <MapPin size={20} className="text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-gray-900 mb-1">Pickup Location</p>
                                            <p className="text-sm text-gray-800 font-semibold">184-60 JAMAICA AVE</p>
                                            <p className="text-sm text-gray-700 mt-1">184-60 Jamaica Ave, Hollis, NY 11423, United States</p>
                                            <div className="flex items-center gap-2 mt-2.5">
                                                <span className="text-xs font-semibold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">FREE</span>
                                                <span className="text-xs text-gray-600">⏱ Usually ready in 2-4 days</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Payment Section */}
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 mb-1">Payment</h2>
                                <p className="text-xs text-gray-500 mb-3">All transactions are secure and encrypted.</p>

                                <div className="border border-gray-300 rounded-md p-3.5 bg-white">
                                    <PaymentElement
                                        options={{
                                            layout: {
                                                type: 'tabs',
                                                defaultCollapsed: false,
                                                spacedAccordionItems: false,
                                            },
                                            wallets: {
                                                applePay: 'never',
                                                googlePay: 'never',
                                            },
                                            fields: {
                                                billingDetails: 'never'
                                            },
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Billing Address Section */}
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 mb-2.5">Billing address</h2>
                                <div className="border border-gray-300 rounded-md p-3.5 bg-white">
                                    <AddressElement
                                        options={{
                                            mode: 'billing',
                                            allowedCountries: ['US'],
                                            fields: { phone: 'always' },
                                            validation: {
                                                phone: {
                                                    required: 'always',
                                                },
                                            },
                                            display: { name: 'split' },
                                        }}
                                        onChange={handleBillingAddressChange}
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={!stripe || isProcessing || isUpdatingIntent || (deliveryMethod === 'ship' && !amountConfirmed)}
                                className="w-full py-3 cursor-pointer bg-[#0066cc] hover:bg-[#0052a3] text-white font-semibold text-base rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm mt-4"
                            >
                                {isProcessing
                                    ? 'Processing...'
                                    : isUpdatingIntent
                                        ? 'Calculating shipping & tax...'
                                        : (deliveryMethod === 'ship' && !amountConfirmed)
                                            ? 'Enter shipping address to continue'
                                            : 'Pay now'}
                            </button>

                            {/* DEBUG: Manual trigger button */}
                            {process.env.NODE_ENV === 'development' && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        console.log('🔧 Manual trigger - Current state:', {
                                            deliveryMethod,
                                            shippingAddress,
                                            paymentIntentId,
                                            invoiceRequestId,
                                            hasUpdatedForAddress,
                                            isUpdatingIntent,
                                        });

                                        if (!shippingAddress?.address?.state) {
                                            alert('Please enter a complete shipping address first');
                                            return;
                                        }

                                        setIsUpdatingIntent(true);
                                        fetch('/api/update-payment-intent', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({
                                                paymentIntentId,
                                                invoiceRequestId,
                                                cartItems: cartItemsSnapshot,
                                                deliveryMethod: 'ship',
                                                state: shippingAddress.address.state,
                                            }),
                                        })
                                            .then(r => r.json())
                                            .then(data => {
                                                console.log('✅ Manual update result:', data);
                                                alert(`Success! Shipping: $${data.breakdown?.shipping}, Tax: $${data.breakdown?.tax}`);
                                                if (data.breakdown) {
                                                    setShippingCharge(data.breakdown.shipping);
                                                    setTaxAmount(data.breakdown.tax);
                                                }
                                            })
                                            .catch(err => {
                                                console.error('❌ Manual update failed:', err);
                                                alert('Failed: ' + err.message);
                                            })
                                            .finally(() => setIsUpdatingIntent(false));
                                    }}
                                    className="w-full py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold text-sm rounded-md transition"
                                >
                                    🔧 DEBUG: Manually Update Shipping + Tax
                                </button>
                            )}

                            {/* Error Message */}
                            {errorMessage && (
                                <p className="text-sm text-red-600 mt-2 font-medium">{errorMessage}</p>
                            )}

                            {/* Footer links */}
                            <div className="flex flex-wrap gap-3.5 text-xs text-gray-500 pt-5 border-t border-gray-200 mt-6">
                                <Link href="#" className="hover:underline">Refund policy</Link>
                                <Link href="#" className="hover:underline">Shipping</Link>
                                <Link href="#" className="hover:underline">Privacy policy</Link>
                                <Link href="#" className="hover:underline">Terms of service</Link>
                                <Link href="#" className="hover:underline">Contact</Link>
                            </div>
                        </form>
                    </div>

                    {/* RIGHT COLUMN - Order Summary */}
                    <div className="lg:col-span-5 px-5 sm:px-6 lg:px-8 py-6 bg-[#fafafa] space-y-5">

                        {/* Products List */}
                        <div className="space-y-3">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex items-center gap-3 p-2.5 bg-white rounded-lg border border-gray-200/80 shadow-sm">
                                    <div className="relative w-16 h-16 bg-white rounded-md border border-gray-100 flex-shrink-0 p-1">
                                        <Image src={item.image} alt={item.name || 'Product Image'} fill className="object-contain p-0.5" />
                                        <span className="absolute -top-2 -right-2 bg-gray-800 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-md border-2 border-white">
                                            {item.quantity}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-xs font-semibold text-gray-900 leading-snug break-words line-clamp-2">
                                            {item.name}
                                        </h3>
                                        {item.brand && (
                                            <p className="text-[11px] text-gray-400 mt-0.5">
                                                {item.brand}
                                            </p>
                                        )}
                                        <p className="text-[11px] text-gray-400">
                                            Qty: {item.quantity}
                                        </p>
                                    </div>
                                    <div className="text-sm font-bold text-gray-900 flex-shrink-0 text-right">
                                        ${(item.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Discount Code */}
                        <div className="flex gap-2 pt-1">
                            <input
                                type="text"
                                placeholder="Discount code"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                                className="flex-1 px-3.5 py-2.5 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                            />
                            <button
                                type="button"
                                className="px-5 py-2.5 bg-[#e5e7eb] hover:bg-[#d1d5db] text-gray-700 text-sm font-semibold rounded-md transition"
                            >
                                Apply
                            </button>
                        </div>

                        {/* Cost Calculations */}
                        <div className="space-y-2.5 text-sm border-t border-gray-300 pt-4">
                            <div className="flex justify-between text-gray-700 text-sm">
                                <span>Subtotal • {cartItems.reduce((a, b) => a + b.quantity, 0)} items</span>
                                <span className="font-semibold text-gray-900">${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                            </div>

                            {discount > 0 && (
                                <div className="flex justify-between text-green-600 text-sm">
                                    <span>Discount ({discount}%)</span>
                                    <span className="font-semibold">-${discountAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                </div>
                            )}

                            <div className="flex justify-between text-gray-700 text-sm">
                                <span>Shipping</span>
                                {deliveryMethod === 'pickup' ? (
                                    <span className="font-semibold text-green-600">FREE</span>
                                ) : isUpdatingIntent ? (
                                    <span className="text-gray-400 text-xs italic">Calculating...</span>
                                ) : amountConfirmed ? (
                                    <div className="text-right">
                                        <span className="font-semibold text-gray-900">${actualShipping.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                        {shippingAddress?.address?.state && (
                                            <p className="text-[11px] text-gray-400 mt-0.5">
                                                {shippingAddress.address.state} freight rate
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <span className="text-gray-500 text-xs">Enter shipping address</span>
                                )}
                            </div>

                            {/* Tax row — shown once amount is confirmed */}
                            <div className="flex justify-between text-gray-700 text-sm">
                                <span>Tax</span>
                                {isUpdatingIntent ? (
                                    <span className="text-gray-400 text-xs italic">Calculating...</span>
                                ) : amountConfirmed ? (
                                    <span className="font-semibold text-gray-900">${taxAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                ) : (
                                    <span className="text-gray-500 text-xs">Enter address</span>
                                )}
                            </div>

                            <div className="flex justify-between items-baseline text-gray-900 border-t border-gray-300 pt-3 mt-3">
                                <span className="text-base font-bold">Total</span>
                                <div className="text-right flex items-baseline gap-1.5">
                                    <span className="text-xs text-gray-500 font-normal">USD</span>
                                    <span className="text-2xl font-bold">
                                        {(deliveryMethod === 'ship' && !amountConfirmed)
                                            ? `$${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                                            : `$${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                                    </span>
                                </div>
                            </div>
                            {deliveryMethod === 'ship' && !amountConfirmed && (
                                <p className="text-[11px] text-gray-400 text-right mt-1">
                                    + shipping & tax (enter address above)
                                </p>
                            )}
                        </div>

                    </div>
                </div>
            </div >
        </div >
    );
}

export default function CheckoutPage() {
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [paymentIntentId, setPaymentIntentId] = useState<string>('');
    const [invoiceRequestId, setInvoiceRequestId] = useState<string>('');
    const [cartItemsSnapshot, setCartItemsSnapshot] = useState<any[]>([]);
    const { cartItems } = useCart();
    const router = useRouter();
    // Guard against React StrictMode double-invoking the effect in development,
    // which would create two separate PaymentIntents and break the update flow.
    const hasFetchedIntent = useRef(false);

    useEffect(() => {
        // Redirect to cart if empty
        if (cartItems.length === 0) {
            router.push('/cart');
            return;
        }

        // Only create one PaymentIntent per mount — StrictMode fires this twice in dev
        if (hasFetchedIntent.current) return;
        hasFetchedIntent.current = true;

        // Snapshot cart items once — we pass these to the server for price validation
        const snapshot = cartItems.map(item => ({
            id: item.id,
            name: item.name,
            brand: item.brand,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            category: item.category,
            selectedOptions: item.selectedOptions,
        }));
        setCartItemsSnapshot(snapshot);

        // Calculate initial amount using validated subtotal only.
        // Shipping + tax will be added later via update-payment-intent once the
        // customer enters their shipping address.
        const subtotal = snapshot.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const totalWithTax = subtotal;

        fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: totalWithTax,
                currency: 'usd',
                cartItems: snapshot,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                setClientSecret(data.clientSecret);
                if (data.paymentIntentId) setPaymentIntentId(data.paymentIntentId);
                if (data.invoiceRequestId) setInvoiceRequestId(data.invoiceRequestId);
            })
            .catch((error) => console.error('Failed to create Payment Intent:', error));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run once on mount

    if (!clientSecret) return (
        <div className="min-h-screen bg-white font-sans">
            {/* Header skeleton */}
            <header className="border-b border-gray-200 bg-white py-4">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    <div className="h-12 w-36 bg-gray-200 rounded animate-pulse" />
                    <div className="h-6 w-6 bg-gray-200 rounded animate-pulse" />
                </div>
            </header>

            <style>{`
                @keyframes shimmer {
                    0% { background-position: -1000px 0; }
                    100% { background-position: 1000px 0; }
                }
                .sk {
                    background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
                    background-size: 1000px 100%;
                    animation: shimmer 1.4s infinite;
                    border-radius: 6px;
                }
            `}</style>

            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-73px)]">

                    {/* LEFT COLUMN skeleton */}
                    <div className="lg:col-span-7 px-4 sm:px-6 lg:px-8 py-6 bg-white border-r border-gray-200 space-y-7">

                        {/* Contact */}
                        <div className="space-y-3">
                            <div className="sk h-6 w-24" />
                            <div className="sk h-11 w-full" />
                            <div className="flex items-center gap-2">
                                <div className="sk h-4 w-4" />
                                <div className="sk h-4 w-48" />
                            </div>
                        </div>

                        {/* Delivery toggle */}
                        <div className="space-y-3">
                            <div className="sk h-6 w-20" />
                            <div className="sk h-11 w-full rounded-md" />
                        </div>

                        {/* Shipping address */}
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="sk h-11 w-full" />
                                <div className="sk h-11 w-full" />
                            </div>
                            <div className="sk h-11 w-full" />
                            <div className="sk h-11 w-full" />
                            <div className="grid grid-cols-3 gap-3">
                                <div className="sk h-11 w-full" />
                                <div className="sk h-11 w-full" />
                                <div className="sk h-11 w-full" />
                            </div>
                            <div className="sk h-11 w-full" />
                        </div>

                        {/* Payment */}
                        <div className="space-y-3">
                            <div className="sk h-6 w-20" />
                            <div className="sk h-4 w-56" />
                            <div className="border border-gray-200 rounded-md p-4 space-y-4">
                                {/* Tab selector */}
                                <div className="flex gap-2">
                                    <div className="sk h-9 w-28 rounded-md" />
                                    <div className="sk h-9 w-24 rounded-md" />
                                    <div className="sk h-9 w-20 rounded-md" />
                                </div>
                                {/* Card number */}
                                <div className="space-y-1.5">
                                    <div className="sk h-4 w-24" />
                                    <div className="sk h-11 w-full" />
                                </div>
                                {/* Expiry + CVC */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <div className="sk h-4 w-20" />
                                        <div className="sk h-11 w-full" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="sk h-4 w-12" />
                                        <div className="sk h-11 w-full" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Billing address */}
                        <div className="space-y-3">
                            <div className="sk h-6 w-32" />
                            <div className="border border-gray-200 rounded-md p-4 space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="sk h-11 w-full" />
                                    <div className="sk h-11 w-full" />
                                </div>
                                <div className="sk h-11 w-full" />
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="sk h-11 w-full" />
                                    <div className="sk h-11 w-full" />
                                </div>
                            </div>
                        </div>

                        {/* Pay button */}
                        <div className="sk h-12 w-full rounded-md" />
                    </div>

                    {/* RIGHT COLUMN skeleton */}
                    <div className="lg:col-span-5 px-5 sm:px-6 lg:px-8 py-6 bg-[#fafafa] space-y-5">

                        {/* Cart items */}
                        {[1, 2].map(i => (
                            <div key={i} className="flex items-center gap-3 p-2.5 bg-white rounded-lg border border-gray-200 shadow-sm">
                                <div className="sk w-16 h-16 rounded-md shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="sk h-4 w-3/4" />
                                    <div className="sk h-3 w-1/3" />
                                    <div className="sk h-3 w-1/4" />
                                </div>
                                <div className="sk h-5 w-16 shrink-0" />
                            </div>
                        ))}

                        {/* Discount code */}
                        <div className="flex gap-2">
                            <div className="sk h-11 flex-1 rounded-md" />
                            <div className="sk h-11 w-20 rounded-md" />
                        </div>

                        {/* Totals */}
                        <div className="space-y-3 border-t border-gray-300 pt-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex justify-between">
                                    <div className="sk h-4 w-24" />
                                    <div className="sk h-4 w-20" />
                                </div>
                            ))}
                            <div className="flex justify-between pt-3 border-t border-gray-300">
                                <div className="sk h-6 w-16" />
                                <div className="sk h-7 w-28" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const subtotalAmount = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const stripeOptions = {
        clientSecret,
        locale: 'en' as const,
        appearance: {
            theme: 'flat' as const,
            variables: {
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                fontSizeBase: '14px',
                colorBackground: '#ffffff',
                colorText: '#1f2937',
                colorDanger: '#d9381e',
                borderRadius: '6px',
                spacingUnit: '4px',
            },
            rules: {
                '.Input': {
                    border: '1px solid #d1d5db',
                    boxShadow: 'none',
                    padding: '11px 13px',
                    fontSize: '14px',
                },
                '.Input:focus': {
                    border: '2px solid #0066cc',
                    boxShadow: 'none',
                },
                '.Label': {
                    fontWeight: '500',
                    fontSize: '13px',
                    color: '#374151',
                    marginBottom: '6px',
                },
                '.Block': {
                    borderColor: '#e5e7eb',
                },
                '.CheckboxInput': {
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                },
                '.CheckboxLabel': {
                    fontSize: '14px',
                    color: '#374151',
                }
            }
        }
    };

    return (
        <Elements stripe={stripePromise} options={stripeOptions}>
            <CheckoutForm
                initialAmount={subtotalAmount}
                paymentIntentId={paymentIntentId}
                invoiceRequestId={invoiceRequestId}
                cartItemsSnapshot={cartItemsSnapshot}
            />
        </Elements>
    );
}
