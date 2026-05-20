'use client';

import { useEffect, useRef } from 'react';
import { useCart } from '@/context/CartContext';

export default function SuccessClient({ paymentIntentId }: { paymentIntentId: string }) {
    const hasConfirmed = useRef(false);
    const { clearCart } = useCart();

    useEffect(() => {
        if (hasConfirmed.current) return;
        hasConfirmed.current = true;

        const confirmPayment = async () => {
            try {
                await fetch('/api/confirm-payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ paymentIntentId }),
                });
                clearCart();
            } catch (err) {
                console.error('Failed to confirm payment via API', err);
            }
        };

        confirmPayment();
    }, [paymentIntentId, clearCart]);

    return null;
}