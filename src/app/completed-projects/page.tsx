import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CTA from '@/components/CTA';
import { CheckCircle2, ArrowRight, MapPin, Calendar, ExternalLink } from 'lucide-react';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2026-03-25.dahlia' as any,
});

// Demo data for completed projects
const demoProjects = [
    {
        id: 1,
        title: 'Commercial Walk-in Freezer Installation',
        client: 'Fresh Foods Supermarket',
        location: 'Downtown District',
        date: 'March 2026',
        description: 'Complete installation of a custom 20x30ft walk-in freezer with remote condensing units for a major supermarket chain.',
        image: '/Walk-inCooler&Freezer/walk-infreezerunits.jpg',
        tags: ['Walk-in Freezer', 'Custom Build', 'Retail']
    },
    {
        id: 2,
        title: 'Restaurant Display Cooler Setup',
        client: 'Ocean Catch Seafood',
        location: 'Harbor Area',
        date: 'February 2026',
        description: 'Supplied and installed multiple package units to showcase premium seafood while maintaining strict temperature controls.',
        image: '/category/refrigerationEquipment/packageUnit.jpg',
        tags: ['Display Cooler', 'Restaurant', 'Installation']
    },
    {
        id: 3,
        title: 'Industrial Cold Storage Facility',
        client: 'Global Logistics Hub',
        location: 'Industrial Park',
        date: 'January 2026',
        description: 'Designed and built a large-scale cold storage facility utilizing combo units for efficient space management.',
        image: '/Walk-inCooler&Freezer/combounits.jpg',
        tags: ['Cold Storage', 'Industrial', 'Combo System']
    },
    {
        id: 4,
        title: 'Bakery Refrigeration Upgrade',
        client: 'Sweet Delights Bakery',
        location: 'Westside Mall',
        date: 'December 2025',
        description: 'Upgraded aging refrigeration units with modern, energy-efficient condensing units and freezers for a busy bakery.',
        image: '/category/refrigerationEquipment/condensingUnit.jpg',
        tags: ['Upgrade', 'Condensing Unit', 'Energy Efficient']
    },
    {
        id: 5,
        title: 'Beverage Display Merchandisers',
        client: 'Quick Stop Convenience',
        location: 'North Highway',
        date: 'November 2025',
        description: 'Installed a continuous lineup of new coolers for grab-and-go beverages and snacks.',
        image: '/Walk-inCooler&Freezer/NewCooler.jpg',
        tags: ['Merchandiser', 'Convenience Store', 'Retail']
    },
    {
        id: 6,
        title: 'Meat Prep Room Cooling System',
        client: 'Prime Cuts Butcher',
        location: 'Eastside Market',
        date: 'October 2025',
        description: 'Custom refrigeration solution for a meat preparation room, ensuring compliance with health and safety temperature regulations.',
        image: '/Walk-inCooler&Freezer/walkincoolers.jpg',
        tags: ['Prep Room', 'Custom Cooling', 'Butcher']
    }
];

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
        <main className="min-h-screen flex flex-col bg-slate-50 selection:bg-blue-200">
            <Header />

            <div className="flex-1 flex flex-col items-center justify-center pt-44 pb-32 px-4 relative overflow-hidden">

                {/* Subtle Background Pattern */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                    <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-[#004a99] opacity-[0.05] blur-[100px]"></div>
                </div>

                <div className="w-full max-w-4xl mx-auto z-10">
                    {paymentSuccessful ? (
                        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 md:p-14 text-center max-w-2xl mx-auto animate-in zoom-in-95 duration-500">
                            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-50 border-[6px] border-emerald-100/50 text-emerald-500 mb-8">
                                <CheckCircle2 size={48} strokeWidth={2.5} />
                            </div>

                            <h1 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tight leading-none mb-4">
                                Payment <span className="text-emerald-500">Successful</span>
                            </h1>

                            <p className="text-slate-500 mb-10 max-w-md mx-auto text-lg font-medium">
                                Thank you for your payment. Your order has been confirmed and is now being processed by our team.
                            </p>

                            {orderDetails && (
                                <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 mb-10 text-left">
                                    <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
                                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Order Details</h3>
                                        <span className="font-bold text-emerald-700 bg-emerald-100/50 border border-emerald-200 px-3 py-1 rounded-full text-xs uppercase tracking-wider">
                                            {orderDetails.status}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-y-4">
                                        <div>
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Order ID</p>
                                            <p className="font-bold text-slate-900">{orderDetails.id.substring(0, 8).toUpperCase()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Amount Paid</p>
                                            <p className="font-black text-emerald-600 text-lg">${orderDetails.amountPaid.toFixed(2)}</p>
                                        </div>
                                        <div className="col-span-2 mt-2 pt-4 border-t border-slate-200/60">
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Customer</p>
                                            <p className="font-bold text-slate-900">{orderDetails.customerName}</p>
                                            <p className="text-sm text-slate-500">{orderDetails.customerEmail}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <Link
                                href="/"
                                className="group inline-flex items-center justify-center gap-2 px-8 py-4 font-bold text-white bg-[#004a99] rounded-lg hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98] w-full sm:w-auto uppercase tracking-wider"
                            >
                                Return to Home
                                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    ) : (
                        <div className="w-full mt-10">
                            {/* Page Header */}
                            <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <div className="inline-block border border-blue-100 bg-white shadow-sm px-6 py-2 rounded-full mb-6">
                                    <span className="text-sm font-bold text-[#004a99] uppercase tracking-widest flex items-center gap-2">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                        </span>
                                        Our Portfolio
                                    </span>
                                </div>

                                {/* <h1 className="text-xl md:text-xl lg:text-xl font-black text-slate-900 uppercase tracking-tighter leading-tight mb-6">
                                    Completed Projects
                              
                                </h1> */}

                                <p className="text-sm text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
                                    Explore our gallery of successful commercial refrigeration installations. From custom walk-in coolers to large-scale industrial freezers, we deliver quality and performance.
                                </p>
                            </div>

                            {/* Projects Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl mx-auto pb-20 animate-in fade-in duration-1000 delay-300">
                                {demoProjects.map((project) => (
                                    <div key={project.id} className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 cursor-pointer">
                                        {/* Image Container */}
                                        <div className="relative h-48 w-full bg-slate-50 overflow-hidden flex items-center justify-center p-6">
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-end p-6">
                                                <span className="text-white font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                    View Details <ExternalLink size={16} />
                                                </span>
                                            </div>
                                            <img
                                                src={project.image}
                                                alt={project.title}
                                                className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 flex flex-col flex-1">
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {project.tags.map((tag, idx) => (
                                                    <span key={idx} className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-sm">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>

                                            <h3 className="text-lg font-black text-slate-900 leading-tight mb-3 group-hover:text-[#004a99] transition-colors line-clamp-2">
                                                {project.title}
                                            </h3>

                                            <p className="text-sm text-slate-500 mb-6 line-clamp-3 leading-relaxed">
                                                {project.description}
                                            </p>

                                            <div className="mt-auto pt-5 border-t border-slate-100 space-y-2">
                                                <div className="flex items-center gap-2 text-slate-600 text-[13px] font-medium">
                                                    <MapPin size={14} className="text-slate-400" />
                                                    <span className="truncate">{project.client}, {project.location}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-500 text-[12px]">
                                                    <Calendar size={14} className="text-slate-400" />
                                                    <span>Completed: {project.date}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {!paymentSuccessful && <CTA />}

            <Footer />
        </main>
    );
}
