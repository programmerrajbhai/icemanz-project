import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Construction, CheckCircle2 } from 'lucide-react';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2026-03-25.dahlia' as any,
});

export default async function CompletedProjectsPage({
    searchParams,
}: {
    searchParams: Promise<{ session_id?: string }>;
}) {
    const params = await searchParams;
    const sessionId = params.session_id;

    let paymentSuccessful = false;
    let orderDetails = null;

    if (sessionId) {
        try {
            // Retrieve the Stripe session to verify payment status
            const session = await stripe.checkout.sessions.retrieve(sessionId);

            if (session.payment_status === 'paid') {
                paymentSuccessful = true;

                // Fallback mechanism: check if webhook already created the order
                const existingOrder = await prisma.order.findUnique({
                    where: { stripeSessionId: sessionId }
                });

                if (!existingOrder) {
                    const invoiceId = session.metadata?.invoiceId;
                    const customerName = session.metadata?.customerName || 'Customer';
                    const customerEmail = session.metadata?.customerEmail || session.customer_details?.email || '';
                    const amountPaid = session.amount_total ? session.amount_total / 100 : 0;

                    if (invoiceId) {
                        // Update InvoiceRequest status to PAID
                        await prisma.invoiceRequest.update({
                            where: { id: invoiceId },
                            data: { status: 'PAID' }
                        });

                        // Create Order entry as fallback
                        orderDetails = await prisma.order.create({
                            data: {
                                invoiceId,
                                customerName,
                                customerEmail,
                                amountPaid,
                                currency: session.currency || 'usd',
                                stripeSessionId: session.id,
                                stripePaymentId: session.payment_intent as string,
                                status: 'PAID'
                            }
                        });
                    }
                } else {
                    orderDetails = existingOrder;
                }
            }
        } catch (error) {
            console.error('Error verifying Stripe session:', error);
        }
    }

    return (
        <main className="min-h-screen bg-white">
            <Header />

            <section className="min-h-[70vh] flex flex-col items-center justify-center pt-32 pb-20">
                <div className="container px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        {paymentSuccessful ? (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Success Icon */}
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-500 mb-8 shadow-sm">
                                    <CheckCircle2 size={40} />
                                </div>

                                <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-4">
                                    Payment <span className="text-emerald-500">Successful!</span>
                                </h1>

                                <p className="text-lg text-slate-500 mb-8 max-w-lg mx-auto">
                                    Thank you for your payment. Your order has been placed successfully and is now being processed.
                                </p>

                                {orderDetails && (
                                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 max-w-sm mx-auto mb-10 text-left shadow-sm">
                                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">
                                            Order Summary
                                        </h3>
                                        <div className="space-y-3 text-sm">
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-500">Order ID</span>
                                                <span className="font-bold text-slate-900">{orderDetails.id.substring(0, 8).toUpperCase()}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-500">Amount Paid</span>
                                                <span className="font-bold text-emerald-600">${orderDetails.amountPaid.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-500">Status</span>
                                                <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-xs">
                                                    {orderDetails.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <Link
                                    href="/"
                                    className="inline-flex items-center justify-center px-8 py-4 font-bold text-white bg-[#004a99] rounded-sm hover:bg-blue-800 transition-colors shadow-sm"
                                >
                                    Return to Home
                                </Link>
                            </div>
                        ) : (
                            <div>
                                {/* Minimal Icon */}
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-sm bg-slate-50 border border-slate-100 text-[#004a99] mb-10 shadow-sm">
                                    <Construction size={32} />
                                </div>

                                <h1 className="text-4xl md:text-7xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-6">
                                    Coming <span className="text-[#004a99]">Soon</span>
                                </h1>

                                {/* Simple Animated Indicator */}
                                <div className="mt-12 w-24 h-1.5 bg-slate-100 mx-auto rounded-sm overflow-hidden">
                                    <div className="w-1/2 h-full bg-[#004a99] rounded-sm animate-pulse"></div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}