'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, Phone, Mail, CheckSquare, Truck, ShieldCheck, Headphones, Award, Lock, FileText, ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const pathname = usePathname();

    if (pathname?.startsWith('/admin')) {
        return null;
    }

    return (
        <footer className="bg-[#05101e] text-gray-300 pt-16 pb-8 border-t-4 border-[#0055ff] relative overflow-hidden font-sans">
            <div className="container mx-auto px-6 lg:px-8 max-w-[1400px]">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-x-8 gap-y-12 mb-16">

                    {/* Column 1: Brand & Info (Span 4) */}
                    <div className="lg:col-span-4 space-y-6">
                        <Link href="/" className="inline-block cursor-pointer mb-2">
                            <Image src='/logo.png' alt='Icemanz Refrigeration' width={180} height={60} className='h-12 w-auto' />
                        </Link>
                        <p className="text-gray-400 leading-relaxed text-sm pr-4">
                            Revolutionizing cold storage with intelligent refrigeration. Built for performance, engineered for reliability, and delivered nationwide.
                        </p>

                        <ul className="space-y-3 pt-2 text-sm text-gray-300">
                            <li className="flex items-center gap-3">
                                <CheckSquare size={18} className="text-[#0055ff]" />
                                <span>Commercial-Grade Quality</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <CheckSquare size={18} className="text-[#0055ff]" />
                                <span>Energy Efficient Solutions</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <CheckSquare size={18} className="text-[#0055ff]" />
                                <span>Nationwide Delivery</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <CheckSquare size={18} className="text-[#0055ff]" />
                                <span>Expert Support & Service</span>
                            </li>
                        </ul>

                    </div>

                    {/* Column 2: EXPLORE (Span 2) */}
                    <div className="lg:col-span-2">
                        <h4 className="text-white text-sm font-bold tracking-wider mb-6 relative inline-block">
                            EXPLORE
                            <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-[#0055ff]"></span>
                        </h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            {[
                                { name: 'Home', href: '/' },
                                { name: 'Products', href: '/refrigeration-equipment' },
                                { name: 'Services', href: '/services' },
                                { name: 'Portfolio', href: '/completed-projects' }
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="group flex items-center justify-between hover:text-white transition-colors cursor-pointer w-full max-w-[160px]">
                                        <span>{item.name}</span>
                                        <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#0055ff]" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: SOLUTIONS (Span 2) */}
                    <div className="lg:col-span-2">
                        <h4 className="text-white text-sm font-bold tracking-wider mb-6 relative inline-block">
                            SOLUTIONS
                            <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-[#0055ff]"></span>
                        </h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            {[
                                { name: 'Walk-In Coolers', href: '/walk-in-cooler-freezer/walk-in-cooler-no-floor' },
                                { name: 'Walk-In Freezers', href: '/walk-in-cooler-freezer/walk-in-freezer-with-floor' },
                                { name: 'Combo Units', href: '/walk-in-cooler-freezer/walk-in-combo-cooler-freezer' },
                                { name: 'Custom Build', href: '/quote' }
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="hover:text-white transition-colors cursor-pointer">
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: SUPPORT (Span 2) */}
                    <div className="lg:col-span-2">
                        <h4 className="text-white text-sm font-bold tracking-wider mb-6 relative inline-block">
                            SUPPORT
                            <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-[#0055ff]"></span>
                        </h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            {[
                                { name: 'Support Center', href: '/support' },
                                { name: 'Request a Quote', href: '/quote' },
                                { name: 'Request Invoice', href: '/request-invoice' },
                                { name: 'Contact Us', href: '/enquiry' },
                                { name: 'Privacy Policy', href: '/privacy-policy' },
                                { name: 'Terms & Conditions', href: '/terms-and-conditions' }
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="hover:text-white transition-colors cursor-pointer">
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 5: GET IN TOUCH (Span 2) */}
                    <div className="lg:col-span-2">
                        <h4 className="text-white text-sm font-bold tracking-wider mb-6 relative inline-block">
                            GET IN TOUCH
                            <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-[#0055ff]"></span>
                        </h4>

                        <div className="space-y-6 mb-8">
                            <a href="tel:929-451-7665" className="flex items-start gap-4 group cursor-pointer">
                                <div className="w-10 h-10 rounded-full bg-[#0a1526] border border-gray-800 flex items-center justify-center text-[#0055ff] group-hover:bg-[#0055ff] group-hover:text-white transition-all shrink-0">
                                    <Phone size={18} />
                                </div>
                                <div className=' w-full'>
                                    <p className="text-white font-semibold text-sm">929-451-7665</p>
                                    <p className="text-gray-500 text-xs w-full mt-0.5 whitespace-nowrap">Mon - Fri: 9AM - 6PM EST</p>
                                </div>
                            </a>

                            <a href="mailto:sales@icemanz.com" className="flex items-start gap-4 group cursor-pointer">
                                <div className="w-10 h-10 rounded-full bg-[#0a1526] border border-gray-800 flex items-center justify-center text-[#0055ff] group-hover:bg-[#0055ff] group-hover:text-white transition-all shrink-0">
                                    <Mail size={18} />
                                </div>
                                <div>
                                    <p className="text-white font-semibold text-sm">sales@icemanz.com</p>
                                    <p className="text-gray-500 text-xs mt-0.5 whitespace-nowrap">We reply within 1 business day</p>
                                </div>
                            </a>

                            <div className="flex items-start gap-4 group">
                                <div className="w-10 h-10 rounded-full bg-[#0a1526] border border-gray-800 flex items-center justify-center text-[#0055ff] shrink-0">
                                    <MapPin size={18} />
                                </div>
                                <div>
                                    <p className="text-white font-semibold text-sm whitespace-nowrap">Brooklyn, New York, USA</p>
                                    <p className="text-gray-500 text-xs mt-0.5 ">Serving nationwide</p>
                                </div>
                            </div>
                        </div>

                        <Link
                            href="/quote"
                            className="w-full py-3 px-4 bg-[#0055ff] hover:bg-[#0044cc] text-white rounded-md flex items-center justify-center gap-2 font-semibold text-sm transition-colors cursor-pointer"
                        >
                            <FileText size={16} />
                            Get a Quote
                        </Link>
                    </div>

                </div>

                {/* Trust Badges Banner */}
                <div className="bg-[#0a1526]/80 border border-gray-800 rounded-xl p-6 lg:p-8 mb-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        <div className="flex items-center gap-4">
                            <div className="text-[#0055ff] shrink-0">
                                <Truck size={36} strokeWidth={1.5} />
                            </div>
                            <div>
                                <h5 className="text-white font-semibold text-sm">Fast Nationwide Delivery</h5>
                                <p className="text-gray-500 text-xs mt-1">Reliable shipping across the United States</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-[#0055ff] shrink-0">
                                <ShieldCheck size={36} strokeWidth={1.5} />
                            </div>
                            <div>
                                <h5 className="text-white font-semibold text-sm">Commercial-Grade Quality</h5>
                                <p className="text-gray-500 text-xs mt-1">Built to last with premium materials & components</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-[#0055ff] shrink-0">
                                <Headphones size={36} strokeWidth={1.5} />
                            </div>
                            <div>
                                <h5 className="text-white font-semibold text-sm">Expert Support</h5>
                                <p className="text-gray-500 text-xs mt-1">Our refrigeration experts are here to help</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-[#0055ff] shrink-0">
                                <Award size={36} strokeWidth={1.5} />
                            </div>
                            <div>
                                <h5 className="text-white font-semibold text-sm">Satisfaction Guarantee</h5>
                                <p className="text-gray-500 text-xs mt-1">Quality you can trust, service you can count on</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="pt-6 border-t border-gray-800 flex flex-col lg:flex-row justify-between items-center gap-6 text-xs text-gray-500">
                    <div className="text-center lg:text-left">
                        <p>© {currentYear} <span className="text-[#0055ff] font-bold">ICEMANZ</span>. All rights reserved.</p>
                        <p className="mt-1">Precision Cold Storage.</p>
                    </div>

                    {/* Security Badges */}
                    <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-8">
                        <div className="flex items-center gap-2">
                            <Lock size={16} className="text-gray-400" />
                            <div className="text-[10px] leading-tight font-medium uppercase">
                                <p className="text-gray-300">Secure</p>
                                <p>& Private</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={16} className="text-[#0055ff]" />
                            <div className="text-[10px] leading-tight font-medium uppercase">
                                <p className="text-gray-300">SSL</p>
                                <p>Encrypted</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="px-2 py-0.5 bg-[#0055ff] text-white text-[10px] font-black italic rounded uppercase tracking-wider">PCI</div>
                            <div className="text-[10px] leading-tight font-medium uppercase">
                                <p className="text-gray-300">PCI</p>
                                <p>Compliant</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </footer>
    );
}