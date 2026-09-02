'use client';

import Link from 'next/link';
import { useState } from 'react';

/**
 * Test Checkout Page
 * Quick testing page for Stripe Embedded Checkout
 * Remove this in production or protect with authentication
 */
export default function TestCheckoutPage() {
  const [customAmount, setCustomAmount] = useState('49.99');
  const [productName, setProductName] = useState('Test Product');
  const [isCreating, setIsCreating] = useState(false);

  const handleQuickCheckout = async () => {
    setIsCreating(true);
    try {
      const amount = parseFloat(customAmount) * 100; // Convert to cents
      
      const response = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lineItems: [
            {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: productName,
                  description: 'Test product for checkout',
                },
                unit_amount: amount,
              },
              quantity: 1,
            },
          ],
        }),
      });

      if (response.ok) {
        window.location.href = '/checkout';
      } else {
        alert('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating checkout session');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              🧪 Stripe Checkout Test Page
            </h1>
            <p className="text-gray-600">
              Test your Stripe Embedded Checkout integration
            </p>
          </div>

          {/* Environment Info */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Environment Info
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Stripe Publishable Key:</span>
                <span className="font-mono text-xs">
                  {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.substring(0, 20)}...
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Mode:</span>
                <span className={`font-semibold ${
                  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.includes('test') 
                    ? 'text-yellow-600' 
                    : 'text-green-600'
                }`}>
                  {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.includes('test') 
                    ? 'Test Mode' 
                    : 'Live Mode'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Test Buttons */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Quick Test
            </h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="49.99"
                />
              </div>
            </div>

            <button
              onClick={handleQuickCheckout}
              disabled={isCreating}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? 'Creating Session...' : 'Create Custom Checkout Session'}
            </button>
          </div>

          {/* Test Scenarios */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Test Scenarios
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <Link
                href="/checkout"
                className="block p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all"
              >
                <h3 className="font-semibold text-gray-900 mb-2">
                  Default Checkout
                </h3>
                <p className="text-sm text-gray-600">
                  Test with default product ($49.99)
                </p>
              </Link>

              <div className="p-4 border-2 border-gray-200 rounded-lg bg-gray-50">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Multiple Items
                </h3>
                <p className="text-sm text-gray-600">
                  Coming soon - Multiple line items
                </p>
              </div>

              <div className="p-4 border-2 border-gray-200 rounded-lg bg-gray-50">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Subscription
                </h3>
                <p className="text-sm text-gray-600">
                  Coming soon - Recurring payments
                </p>
              </div>

              <div className="p-4 border-2 border-gray-200 rounded-lg bg-gray-50">
                <h3 className="font-semibold text-gray-900 mb-2">
                  With Coupon
                </h3>
                <p className="text-sm text-gray-600">
                  Test promo codes (enabled)
                </p>
              </div>
            </div>
          </div>

          {/* Test Card Numbers */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Test Card Numbers
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Use these test cards in Stripe Test Mode:
            </p>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded border border-green-200">
                <div>
                  <span className="font-mono font-semibold">4242 4242 4242 4242</span>
                  <p className="text-xs text-gray-600 mt-1">Visa - Success</p>
                </div>
                <span className="text-green-600 font-semibold">✓ Success</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-red-50 rounded border border-red-200">
                <div>
                  <span className="font-mono font-semibold">4000 0000 0000 0002</span>
                  <p className="text-xs text-gray-600 mt-1">Visa - Decline</p>
                </div>
                <span className="text-red-600 font-semibold">✗ Decline</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded border border-yellow-200">
                <div>
                  <span className="font-mono font-semibold">4000 0025 0000 3155</span>
                  <p className="text-xs text-gray-600 mt-1">Visa - 3D Secure</p>
                </div>
                <span className="text-yellow-600 font-semibold">⚠ 3DS</span>
              </div>

              <div className="p-3 bg-gray-50 rounded border border-gray-200">
                <p className="text-xs text-gray-600">
                  • Use any future expiry date (e.g., 12/34)
                  <br />
                  • Use any 3-digit CVC
                  <br />
                  • Use any valid ZIP code
                </p>
              </div>
            </div>

            <a
              href="https://stripe.com/docs/testing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mt-4"
            >
              View all test cards →
            </a>
          </div>

          {/* API Endpoints */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              API Endpoints
            </h2>
            
            <div className="space-y-2 text-sm font-mono">
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-bold">
                  POST
                </span>
                <span>/api/checkout_sessions</span>
              </div>

              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-bold">
                  GET
                </span>
                <span>/api/checkout_sessions/[session_id]</span>
              </div>

              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-bold">
                  POST
                </span>
                <span>/api/webhooks/stripe</span>
              </div>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-8">
            <Link
              href="/"
              className="inline-flex items-center text-gray-600 hover:text-gray-900"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
