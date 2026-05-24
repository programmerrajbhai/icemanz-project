import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CTA from '@/components/CTA';
import { CheckCircle2, ArrowRight, MapPin, Calendar, ExternalLink, ArrowDown } from 'lucide-react';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

// Demo data for completed projects
const demoProjects = [
    {
        id: 1,
        title: "PARK'S MARKET CHAIN — MULTI-UNIT GLASSDOOR ARRAY",
        client: 'Fresh Foods Supermarket',
        location: 'Queens, NY',
        category: 'SUPERMARKET',
        date: 'March 2026',
        description: '18-door glassdoor cooler wall spanning two aisles. Custom shelving, energy-efficient LED strips, and integrated monitoring. Completed in under 5 days with zero store downtime.',
        image: '/Walk-in-Cooler-Freezer/walk-infreezerunits.jpg',
        tags: ['18 DOORS', 'TURBO AIR', 'LED INTEGRATED', '36°F HOLD'],
        featured: true
    },
    {
        id: 2,
        title: 'OCEAN CATCH SEAFOOD — ADVANCED PACKAGE UNIT SETUP',
        client: 'Ocean Catch Seafood',
        location: 'Harbor Area, NY',
        category: 'RESTAURANT',
        date: 'February 2026',
        description: 'Supplied and installed multiple package units to showcase premium seafood while maintaining strict temperature controls. High-performance refrigeration for demanding retail environments.',
        image: '/category/refrigerationEquipment/packageUnit.jpg',
        tags: ['REMOTE MONITORING', 'STAINLESS STEEL', 'DUAL TEMP', 'ENERGY STAR'],
        featured: false
    },
    {
        id: 3,
        title: 'GLOBAL LOGISTICS HUB — INDUSTRIAL COLD STORAGE',
        client: 'Global Logistics Hub',
        location: 'Industrial Park, NJ',
        category: 'INDUSTRIAL',
        date: 'January 2026',
        description: 'Designed and built a large-scale cold storage facility utilizing combo units for efficient space management. Engineered for maximum durability and thermal efficiency.',
        image: '/Walk-in-Cooler-Freezer/combounits.jpg',
        tags: ['COMBO SYSTEM', 'R-VALUE 32', 'HEAVY DUTY', 'AUTO DEFROST'],
        featured: false
    }
];


const stats = [
    { label: 'PROJECTS DELIVERED', value: '140+' },
    { label: 'STATES SERVED', value: '32' },
    { label: 'ON-TIME RATE', value: '98%' },
    { label: 'IN THE FIELD', value: '12yr' }
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

    if (sessionId && process.env.STRIPE_SECRET_KEY) {
        try {
            const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
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
        <main className="min-h-screen flex flex-col  selection:bg-primary/30">
            <Header />

            <div className="flex-1 flex flex-col pt-32 pb-32 relative">
                <div className="w-full max-w-7xl mx-auto z-10 px-4">
                    <div className="w-full">
                        {/* Professional Dark Header Section */}
                        <div className="mb-20 animate-in mt-10 fade-in slide-in-from-bottom-4 duration-700">
                            <div className="space-y-4 mb-10">

                                <h1 className="text-5xl md:text-6xl lg:text-7xl text-center text-slate-900 font-black tracking-tighter leading-none uppercase">
                                    Completed <span className="text-primary">Projects</span>
                                </h1>
                                <p className="text-center text-slate-500 max-w-2xl mx-auto text-sm md:text-base font-medium">
                                    Explore our gallery of high-performance commercial refrigeration installations. We deliver industrial-grade solutions built for maximum durability and efficiency.
                                </p>
                            </div>

                            {/* Stats Section - Industrial Style */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 border-y border-slate-200 py-8 bg-white/50 backdrop-blur-sm">
                                {stats.map((stat, i) => (
                                    <div key={i} className={`flex flex-col items-center justify-center text-center p-4 ${i !== stats.length - 1 ? 'md:border-r md:border-slate-200' : ''}`}>
                                        <span className="text-4xl md:text-5xl font-black text-slate-900 mb-2 tracking-tighter">{stat.value}</span>
                                        <span className="text-[10px] md:text-xs font-bold text-primary uppercase tracking-[0.2em]">{stat.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Dark Editorial Project List */}
                        <div className="space-y-12 md:space-y-16 mt-16">
                            {demoProjects.map((project, index) => (
                                <div
                                    key={project.id}
                                    className={`flex flex-col lg:flex-row gap-8 lg:gap-12 group/card items-center ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
                                >
                                    {/* Image Presentation */}
                                    <div className="w-full lg:w-1/2 relative group overflow-hidden bg-slate-100 rounded-sm shadow-lg h-[300px] md:h-[400px]">
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className="w-full h-full object-contain mix-blend-multiply p-8 transition-transform duration-1000 group-hover/card:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                                        {/* Industrial Badge on Image */}
                                        <div className="absolute top-4 left-4 z-20">
                                            <div className="bg-white/90 backdrop-blur-sm border border-slate-200 px-3 py-1 rounded-sm shadow-sm">
                                                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{project.category}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Editorial Content Style */}
                                    <div className="w-full lg:w-1/2 space-y-6 flex flex-col justify-center">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-px w-8 bg-primary"></div>
                                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{project.location}</span>
                                            </div>

                                            <h2 className="text-2xl md:text-4xl font-black text-slate-900 leading-[1.1] tracking-tighter uppercase group-hover/card:text-primary transition-colors duration-300">
                                                {project.title}
                                            </h2>
                                        </div>

                                        <p className="text-sm md:text-base text-slate-600 leading-relaxed font-medium max-w-lg">
                                            {project.description}
                                        </p>

                                        {/* Tags/Features - Industrial Style */}
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {project.tags.map((tag, i) => (
                                                <span key={i} className="text-[9px] font-black uppercase tracking-widest text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-sm group-hover/card:border-primary/30 group-hover/card:bg-blue-50 transition-colors">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="pt-4">
                                            <Link
                                                href={`/enquiry?project=${project.id}`}
                                                className="inline-flex items-center gap-3 text-[11px] font-black text-primary hover:gap-5 transition-all duration-300 uppercase tracking-[0.2em] group/btn"
                                            >
                                                Inquire about this setup
                                                <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {!paymentSuccessful && <CTA />}
        </main>
    );
}
