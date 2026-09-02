'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckoutSessionStatus, StripeErrorResponse } from '@/types/stripe';
import Link from 'next/link';

/**
 * Loading Skeleton for Return Page
 */
function ReturnPageSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-lg p-8 animate-pulse">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
          <div className="h-8 bg-gray-200 rounded-md w-64"></div>
          <div className="h-4 bg-gray-200 rounded-md w-96"></div>
          <div className="w-full space-y-3 mt-8">
            <div className="h-12 bg-gray-100 rounded-lg"></div>
            <div className="h-12 bg-gray-100 rounded-lg"></div>
            <div className="h-12 bg-gray-100 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Success State Component
 */
function SuccessState({ session }: { session: CheckoutSessionStatus }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
      {/* Success Icon */}
      <div className="flex justify-center mb-6">
        <div className="rounded-full bg-green-100 p-3">
          <svg
            className="w-16 h-16 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>

      {/* Success Message */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Payment Successful!
        </h1>
        <p className="text-gray-600 text-lg">
          Thank you for your purchase. Your order has been confirmed.
        </p>
      </div>

      {/* Order Details */}
      <div className="border-t border-b border-gray-200 py-6 mb-6 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Order ID:</span>
          <span className="text-gray-900 font-mono text-sm">
            {session.session_id.substring(0, 24)}...
          </span>
        </div>

        {session.customer_email && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Email:</span>
            <span className="text-gray-900">{session.customer_email}</span>
          </div>
        )}

        {session.total_display && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Total Amount:</span>
            <span className="text-gray-900 font-bold text-xl">
              ${session.total_display}
            </span>
          </div>
        )}

        {session.payment_status && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Payment Status:</span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              {session.payment_status.charAt(0).toUpperCase() + session.payment_status.slice(1)}
            </span>
          </div>
        )}
      </div>

      {/* Shipping Information */}
      {session.shipping_details && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Shipping Information
          </h3>
          <div className="space-y-2 text-gray-700">
            {session.shipping_details.name && (
              <p className="font-medium">{session.shipping_details.name}</p>
            )}
            {session.shipping_details.address && (
              <div className="text-sm">
                <p>{session.shipping_details.address.line1}</p>
                {session.shipping_details.address.line2 && (
                  <p>{session.shipping_details.address.line2}</p>
                )}
                <p>
                  {session.shipping_details.address.city}, {session.shipping_details.address.state} {session.shipping_details.address.postal_code}
                </p>
                <p>{session.shipping_details.address.country}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Order Items */}
      {session.line_items && session.line_items.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Order Items
          </h3>
          <div className="space-y-3">
            {session.line_items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {item.description}
                  </p>
                  <p className="text-sm text-gray-600">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    ${((item.amount_total || 0) / 100).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmation Email Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <svg
            className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Confirmation Email Sent</p>
            <p>
              A confirmation email has been sent to{' '}
              <span className="font-semibold">{session.customer_email}</span>.
              Please check your inbox for order details and tracking information.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Continue Shopping
        </Link>
        <button
          onClick={() => window.print()}
          className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Print Receipt
        </button>
      </div>
    </div>
  );
}

/**
 * Pending/Processing State Component
 */
function PendingState({ session }: { session: CheckoutSessionStatus }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
      <div className="flex justify-center mb-6">
        <div className="rounded-full bg-yellow-100 p-3">
          <svg
            className="w-16 h-16 text-yellow-600 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      </div>

      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Processing Payment
        </h1>
        <p className="text-gray-600 text-lg mb-6">
          Your payment is being processed. Please wait a moment...
        </p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800">
            Session Status: <span className="font-semibold">{session.status}</span>
          </p>
          <p className="text-sm text-yellow-800 mt-1">
            Payment Status: <span className="font-semibold">{session.payment_status}</span>
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}

/**
 * Error State Component
 */
function ErrorState({ error, sessionId }: { error: string; sessionId: string | null }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
      <div className="flex justify-center mb-6">
        <div className="rounded-full bg-red-100 p-3">
          <svg
            className="w-16 h-16 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>

      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Payment Error
        </h1>
        <p className="text-gray-600 text-lg mb-6">
          {error}
        </p>

        {sessionId && (
          <p className="text-sm text-gray-500 mb-6">
            Session ID: {sessionId}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/checkout"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Try Again
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * Return Page Content Component
 */
function ReturnPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [sessionData, setSessionData] = useState<CheckoutSessionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID provided');
      setIsLoading(false);
      return;
    }

    const fetchSessionStatus = async () => {
      try {
        const response = await fetch(`/api/checkout_sessions/${sessionId}`);

        if (!response.ok) {
          const errorData: StripeErrorResponse = await response.json();
          throw new Error(errorData.error || 'Failed to retrieve session');
        }

        const data: CheckoutSessionStatus = await response.json();
        setSessionData(data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching session:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        setIsLoading(false);
      }
    };

    fetchSessionStatus();
  }, [sessionId]);

  if (isLoading) {
    return <ReturnPageSkeleton />;
  }

  if (error || !sessionData) {
    return <ErrorState error={error || 'Session not found'} sessionId={sessionId} />;
  }

  // Show success state if payment is complete
  if (sessionData.status === 'complete' && sessionData.payment_status === 'paid') {
    return <SuccessState session={sessionData} />;
  }

  // Show pending state for open sessions
  if (sessionData.status === 'open') {
    return <PendingState session={sessionData} />;
  }

  // Show error for expired or failed sessions
  return (
    <ErrorState
      error={`Payment ${sessionData.status || 'failed'}. Please try again or contact support.`}
      sessionId={sessionId}
    />
  );
}

/**
 * Main Return Page with Suspense Boundary
 */
export default function ReturnPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4">
        <Suspense fallback={<ReturnPageSkeleton />}>
          <ReturnPageContent />
        </Suspense>
      </div>
    </main>
  );
}
