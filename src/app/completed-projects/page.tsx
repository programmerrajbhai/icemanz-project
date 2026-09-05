import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CheckCircle2, ArrowRight, MapPin, ShieldCheck, FileText, LayoutGrid, PhoneCall, Truck, Settings } from 'lucide-react';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

// Real completed projects data using images from /public/completedProject
const demoProjects = [
    {
        id: 1,
        title: "PARK'S MARKET CHAIN — MULTI-UNIT GLASSDOOR ARRAY",
        client: 'Fresh Foods Supermarket',
        location: 'QUEENS, NY',
        category: 'SUPERMARKET',
        date: 'March 2026',
        description: '18-door glassdoor cooler wall spanning two aisles. Custom shelving, energy-efficient LED strips, and integrated monitoring. Completed in under 5 days with zero store downtime.',
        image: '/completedProject/p1.jpeg',
        tags: ['18 DOORS', 'TURBO AIR', 'LED INTEGRATED', '38°F HOLD'],
        featured: true
    },
    {
        id: 2,
        title: 'OCEAN CATCH SEAFOOD — ADVANCED PACKAGE UNIT SETUP',
        client: 'Ocean Catch Seafood',
        location: 'HARBOR AREA, NY',
        category: 'RESTAURANT',
        date: 'February 2026',
        description: 'Supplied and installed multiple package units to showcase premium seafood while maintaining strict temperature controls. High-performance refrigeration for demanding retail environments.',
        image: '/completedProject/p2.jpeg',
        tags: ['REMOTE MONITORING', 'STAINLESS STEEL', 'DUAL TEMP', 'ENERGY STAR'],
        featured: false
    },
    {
        id: 3,
        title: 'GLOBAL LOGISTICS HUB — INDUSTRIAL COLD STORAGE',
        client: 'Global Logistics Hub',
        location: 'INDUSTRIAL PARK, NJ',
        category: 'INDUSTRIAL',
        date: 'January 2026',
        description: 'Designed and built a large-scale cold storage facility utilizing combo units for efficient space management. Engineered for maximum durability and thermal efficiency.',
        image: '/completedProject/p3.jpeg',
        tags: ['COMBO SYSTEM', 'R-VALUE 32', 'HEAVY DUTY', 'AUTO DEFROST'],
        featured: false
    },
    {
        id: 4,
        title: 'METRO PRODUCE TERMINAL — COMMERCIAL WALK-IN COOLER',
        client: 'Metro Produce Wholesalers',
        location: 'BROOKLYN, NY',
        category: 'WHOLESALE',
        date: 'December 2025',
        description: 'Heavy-duty walk-in cooler facility built for high-volume produce storage with precision digital humidity and temperature controllers.',
        image: '/completedProject/p4.jpeg',
        tags: ['DIGITAL CONTROL', 'ALUMINUM FLOORING', 'HIGH CUBAGE', 'FRESH KEEP'],
        featured: false
    },
    {
        id: 5,
        title: 'PRIME BUTCHERY & MEAT PROCESSING FREEZERS',
        client: 'Prime Butchery Corp',
        location: 'NEWARK, NJ',
        category: 'PROCESSING',
        date: 'November 2025',
        description: 'Sub-zero blast freezing installation with insulated panel walls and dual compressor redundancies for raw meat preservation.',
        image: '/completedProject/p5.jpeg',
        tags: ['BLAST FREEZER', '-10°F RATING', 'DUAL COMPRESSOR', 'NSF APPROVED'],
        featured: false
    },
    {
        id: 6,
        title: 'APEX DISTRIBUTION CENTER — DRIVE-IN COLD ROOM',
        client: 'Apex Logistics LLC',
        location: 'BRONX, NY',
        category: 'LOGISTICS',
        date: 'October 2025',
        description: 'High-capacity warehouse storage space featuring heavy-duty ceiling drop refrigeration units and reinforced skid flooring.',
        image: '/completedProject/p6.jpeg',
        tags: ['DRIVE-IN ACCESS', 'HEAVY LOAD FLOOR', 'REMOTE SENSORS', 'COMMERCIAL GRADE'],
        featured: false
    },
    {
        id: 7,
        title: 'BISTRO GOURMET KITCHEN — MODULAR WALK-IN COOLER',
        client: 'Bistro Gourmet Hospitality',
        location: 'MANHATTAN, NY',
        category: 'HOSPITALITY',
        date: 'September 2025',
        description: 'Space-saving custom corner walk-in box engineered for tight commercial restaurant spaces with quick access strip doors.',
        image: '/completedProject/p7.jpeg',
        tags: ['MODULAR PANELS', 'STRIP CURTAINS', 'STAINLESS INTERIOR', 'QUIET CONDENSER'],
        featured: false
    },
    {
        id: 8,
        title: 'TRI-STATE LOGISTICS — MULTI-TEMP STORAGE FACILITY',
        client: 'Tri-State Distribution',
        location: 'STAMFORD, CT',
        category: 'COMMERCIAL',
        date: 'August 2025',
        description: 'Multi-zone refrigeration system allowing simultaneous cooler and freezer operation under one structural footprint.',
        image: '/completedProject/p8.jpeg',
        tags: ['DUAL ZONE', 'R-448A REFRIGERANT', 'ENERGY EFFICIENT', '24/7 MONITORING'],
        featured: false
    }
];

const stats = [
    { icon: FileText, label: 'Projects Delivered', value: '140+' },
    { icon: MapPin, label: 'States Served', value: '32' },
    { icon: CheckCircle2, label: 'On-Time Rate', value: '98%' },
    { icon: ShieldCheck, label: 'In the Field', value: '12yr' }
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
        <main className="min-h-screen flex flex-col bg-white selection:bg-[#0a58ca]/20 font-sans">
            <Header />

            <div className="flex-1 pt-20 md:pt-24 pb-20">
                {/* Hero Banner Section */}
                <section className="w-full bg-gradient-to-br from-blue-50/90 via-slate-50 to-blue-100/60 border-b border-blue-200/80 py-12 lg:py-16 relative overflow-hidden">
                    {/* Ambient Blue Background Glows */}
                    <div className="absolute -top-24 -left-20 w-96 h-96 bg-[#0a58ca]/10 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute -bottom-20 right-10 w-96 h-96 bg-blue-400/15 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
                            
                            {/* Left Column: Heading, Subtitle & Stats */}
                            <div className="lg:col-span-6 space-y-6">
                                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-[#0a58ca] text-[11px] font-bold tracking-wider uppercase">
                                    <CheckCircle2 className="w-4 h-4 text-[#0a58ca]" />
                                    <span>OUR WORK SPEAKS</span>
                                </div>

                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight uppercase leading-[1.05]">
                                    Completed <span className="text-[#0a58ca]">Projects</span>
                                </h1>

                                <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal max-w-xl">
                                    Explore our portfolio of high-performance commercial refrigeration installations. We deliver industrial-grade solutions built for maximum durability and efficiency.
                                </p>

                                {/* Stats Row */}
                                <div className="pt-6 border-t border-slate-200/90 grid grid-cols-4 gap-2 sm:gap-4">
                                    {stats.map((stat, idx) => (
                                        <div key={idx} className={`flex flex-col items-start ${idx !== stats.length - 1 ? 'border-r border-slate-200/90 pr-2 sm:pr-4' : ''}`}>
                                            <stat.icon className="w-5 h-5 text-[#0a58ca] mb-2" />
                                            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none mb-1">
                                                {stat.value}
                                            </span>
                                            <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider leading-tight">
                                                {stat.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right Column: Hero Image with Graphic Framing */}
                            <div className="lg:col-span-6 relative">
                                {/* Decorative Gradient Frame */}
                                <div className="absolute -top-4 -right-4 w-full h-full bg-gradient-to-br from-[#0a58ca]/10 via-blue-50 to-transparent rounded-3xl -z-0 hidden sm:block"></div>
                                
                                {/* Dot pattern decoration */}
                                <div className="absolute -bottom-5 -right-5 w-28 h-28 opacity-25 text-[#0a58ca] grid grid-cols-5 gap-2 pointer-events-none -z-0">
                                    {Array.from({ length: 25 }).map((_, i) => (
                                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#0a58ca]"></div>
                                    ))}
                                </div>

                                <div className="relative z-10 bg-white p-2.5 rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden">
                                    <div className="bg-slate-100 rounded-xl overflow-hidden aspect-[4/3] flex items-center justify-center relative">
                                        <img
                                            src="/completedProject/p1.jpeg"
                                            alt="Completed Refrigeration Project"
                                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                        />
                                        <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-md">
                                            Featured Installation — Queens, NY
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* Recent Completed Projects Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                    <div className="text-center mb-14 sm:mb-20">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] block mb-2">
                            FEATURED INSTALLATIONS
                        </span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight uppercase">
                            Recent Completed Projects
                        </h2>
                        <div className="w-14 h-1 bg-[#0a58ca] mx-auto mt-4 rounded-full"></div>
                    </div>

                    {/* Cards Stack */}
                    <div className="space-y-12 sm:space-y-16">
                        {demoProjects.map((project, index) => (
                            <div
                                key={project.id}
                                className="bg-white rounded-2xl border border-blue-200/80 hover:border-[#0a58ca] shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden p-6 sm:p-8 lg:p-10 group"
                            >
                                <div className={`flex flex-col lg:flex-row gap-8 lg:gap-12 items-center ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                                    
                                    {/* Image Box */}
                                    <div className="w-full lg:w-1/2 relative bg-slate-100 rounded-xl overflow-hidden h-[280px] sm:h-[340px] border-2 border-slate-300 shadow-xs">
                                        <div className="absolute top-4 left-4 z-10">
                                            <span className="px-3.5 py-1 bg-[#0a58ca] text-white text-[10px] font-extrabold uppercase tracking-widest rounded-md shadow-xs">
                                                {project.category}
                                            </span>
                                        </div>

                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    </div>

                                    {/* Details Box */}
                                    <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-4 sm:space-y-5">
                                        <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#0a58ca] uppercase tracking-wider">
                                            <MapPin className="w-4 h-4 text-[#0a58ca]" />
                                            <span>{project.location}</span>
                                        </div>

                                        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight leading-snug">
                                            {project.title}
                                        </h3>

                                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
                                            {project.description}
                                        </p>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {project.tags.map((tag, i) => (
                                                <span
                                                    key={i}
                                                    className="px-3 py-1.5 bg-slate-100 text-slate-700 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider rounded-md border border-slate-200/80"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Action Button Link */}
                                        <div className="pt-3">
                                            <Link
                                                href={`/enquiry?project=${project.id}`}
                                                className="inline-flex items-center gap-3 text-xs font-bold text-[#0a58ca] hover:text-blue-800 uppercase tracking-wider group/link"
                                            >
                                                <span>View Project Details</span>
                                                <span className="w-8 h-8 rounded-lg bg-[#0a58ca] text-white flex items-center justify-center group-hover/link:translate-x-1 transition-transform shadow-xs">
                                                    <ArrowRight className="w-4 h-4" />
                                                </span>
                                            </Link>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>

                    {/* View More Projects Button */}
                    {/* <div className="text-center mt-14 sm:mt-16">
                        <button className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-white border border-slate-300 text-slate-800 text-xs font-extrabold uppercase tracking-widest rounded-lg shadow-xs hover:bg-slate-50 hover:border-slate-400 transition-all cursor-pointer">
                            <LayoutGrid className="w-4 h-4 text-slate-600" />
                            <span>View More Projects</span>
                        </button>
                    </div> */}
                </section>

                {/* Ready to Upgrade CTA Banner */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                    <div className="bg-gradient-to-r from-blue-50/80 via-slate-50 to-blue-50/60 rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 lg:p-12 relative overflow-hidden">
                        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10">
                            
                            {/* Left Column */}
                            <div className="lg:col-span-5 space-y-5">
                                <span className="text-[11px] font-extrabold text-[#0a58ca] uppercase tracking-[0.2em] block">
                                    READY TO UPGRADE?
                                </span>
                                
                                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 uppercase tracking-tight leading-tight">
                                    Ready to Upgrade Your <br className="hidden sm:inline" />
                                    <span className="text-[#0a58ca]">Cold Storage?</span>
                                </h2>

                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal">
                                    Contact us today to discuss your project requirements. We provide custom, efficient, and reliable cold storage solutions nationwide.
                                </p>

                                <div className="flex flex-wrap items-center gap-3 pt-2">
                                    <Link
                                        href="/enquiry"
                                        className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#0a58ca] hover:bg-blue-700 text-white text-xs font-extrabold uppercase tracking-wider rounded-lg shadow-sm transition-all"
                                    >
                                        <span>Get a Quote</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>

                                    <a
                                        href="tel:+17186706005"
                                        className="inline-flex items-center gap-2 px-5 py-3.5 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 text-xs font-extrabold uppercase tracking-wider rounded-lg shadow-2xs transition-all"
                                    >
                                        <PhoneCall className="w-4 h-4 text-[#0a58ca]" />
                                        <span>+1 (718) 670-6005</span>
                                    </a>
                                </div>
                            </div>

                            {/* Middle Column */}
                            <div className="lg:col-span-4 space-y-4 border-t lg:border-t-0 lg:border-l border-slate-200/80 pt-6 lg:pt-0 lg:pl-8">
                                <div className="flex items-start gap-3.5">
                                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/90 flex items-center justify-center text-[#0a58ca] shrink-0 shadow-2xs">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Factory Direct</h4>
                                        <p className="text-[11px] text-slate-500 font-normal leading-normal mt-0.5">
                                            Best pricing directly from the manufacturer with no middleman markup.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3.5">
                                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/90 flex items-center justify-center text-[#0a58ca] shrink-0 shadow-2xs">
                                        <Truck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Nationwide Shipping</h4>
                                        <p className="text-[11px] text-slate-500 font-normal leading-normal mt-0.5">
                                            Fast, insured, and reliable delivery across the country.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3.5">
                                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/90 flex items-center justify-center text-[#0a58ca] shrink-0 shadow-2xs">
                                        <Settings className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Custom Engineered</h4>
                                        <p className="text-[11px] text-slate-500 font-normal leading-normal mt-0.5">
                                            Tailored cooling solutions built specifically for your spatial and operational needs.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="lg:col-span-3 hidden lg:block relative">
                                <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-md transform rotate-1 hover:rotate-0 transition-transform">
                                    <img
                                        src="/completedProject/p7.jpeg"
                                        alt="Walk-in Cooler Installation"
                                        className="rounded-xl w-full h-44 object-cover"
                                    />
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
            </div>

        </main>
    );
}
