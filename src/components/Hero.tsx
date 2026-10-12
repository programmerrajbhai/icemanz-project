"use client";

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, FileText, Target } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#001a33] mt-[70px] md:mt-[100px] min-h-[550px] sm:min-h-[600px] md:min-h-[650px] flex items-center">
      
      {/* Background Image with Premium Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/slider/s_1.jpeg" // Using your best product image
          alt="Commercial Walk-In Coolers and Freezers"
          fill
          priority
          className="object-cover object-center opacity-40 scale-105"
          sizes="100vw"
        />
        {/* Deep Blue Gradient Overlay for a clean B2B look */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#001a33] via-[#001a33]/90 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#001a33] via-transparent to-transparent"></div>
      </div>

      {/* Hero Content */}
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="max-w-3xl pt-8 pb-12">
          
          {/* Eyebrow Text */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-900/50 border border-blue-500/30 backdrop-blur-sm mb-6">
            <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse"></span>
            <span className="text-xs font-bold text-blue-200 uppercase tracking-widest">Your Total Refrigeration Solutions</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] mb-6 drop-shadow-md">
            Commercial Walk-In <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Coolers & Freezers</span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-10 max-w-2xl font-medium leading-relaxed drop-shadow-sm">
            Factory-direct refrigeration solutions for restaurants, supermarkets, and warehouses. From standard quick-ship units to custom-engineered facilities.
          </p>

          {/* The 3 Customer Journey Actions (Clean & Clear) */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-4">
            
            {/* Journey A: Shop Now */}
            <Link
              href="/walk-in-cooler-freezer"
              className="inline-flex justify-center items-center gap-x-2 text-sm font-black rounded-lg border border-transparent bg-blue-600 text-white px-8 py-4 hover:bg-blue-700 hover:-translate-y-0.5 transition-all duration-300 shadow-[0_4px_20px_rgba(37,99,235,0.4)] uppercase tracking-wider"
            >
              Shop Catalog <ArrowRight size={18} />
            </Link>

            {/* Journey B: Recommendation */}
            <Link
              href="/recommendation"
              className="inline-flex justify-center items-center gap-x-2 text-sm font-black rounded-lg border border-gray-500/30 bg-white/10 text-white backdrop-blur-md px-8 py-4 hover:bg-white/20 hover:-translate-y-0.5 transition-all duration-300 uppercase tracking-wider"
            >
              <Target size={18} className="text-blue-400" /> Help Me Choose
            </Link>

            {/* Journey C: Custom Project */}
            <Link
              href="/quote"
              className="inline-flex justify-center items-center gap-x-2 text-sm font-black rounded-lg border border-transparent bg-transparent text-gray-300 px-6 py-4 hover:text-white hover:bg-white/5 transition-all duration-300 uppercase tracking-wider"
            >
              <FileText size={18} /> Request Custom Quote
            </Link>

          </div>
        </div>
      </div>

    </section>
  );
}