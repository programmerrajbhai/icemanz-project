import CheckoutClient from './CheckoutClient';
import { Suspense } from 'react';

export const metadata = {
    title: 'Checkout | ICEMANZ',
    description: 'Secure checkout for your walk-in cooler and freezer solutions.',
};

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white"><div className="w-8 h-8 border-4 border-[#004a99]/30 border-t-[#004a99] rounded-full animate-spin"></div></div>}>
            <CheckoutClient />
        </Suspense>
    );
}
