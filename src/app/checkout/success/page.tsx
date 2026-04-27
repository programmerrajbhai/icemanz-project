import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function SuccessPage() {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-green-50 p-12 rounded-full mb-8">
                <CheckCircle size={80} className="text-green-500" />
            </div>
            <h1 className="text-4xl font-black text-gray-900 mb-4">Payment Successful!</h1>
            <p className="text-lg text-gray-600 mb-10 max-w-md">
                Thank you for your purchase. Your order has been placed and is being processed. 
                You will receive a confirmation email shortly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/">
                    <button className="bg-primary text-white px-10 py-4 rounded-sm font-bold hover:bg-blue-800 transition-all">
                        Back to Home
                    </button>
                </Link>
                <Link href="/walk-in-cooler-freezer">
                    <button className="bg-gray-100 text-gray-900 px-10 py-4 rounded-sm font-bold hover:bg-gray-200 transition-all">
                        Continue Shopping
                    </button>
                </Link>
            </div>
        </div>
    );
}
