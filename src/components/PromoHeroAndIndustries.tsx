'use client';

import React from 'react';
import Link from 'next/link';
import { Utensils, ShoppingCart, Box, Building2, Stethoscope, Star } from 'lucide-react';

export default function PromoHeroAndIndustries() {
  const industries = [
    {
      title: 'RESTAURANTS',
      desc: 'Walk-ins sized for every kitchen, from cafes to large multi-unit groups.',
      feature: 'NSF / UL Approved',
      icon: <Utensils size={32} strokeWidth={1.5} className="text-gray-700" />
    },
    {
      title: 'SUPERMARKETS',
      desc: 'Anti-condensation display glass doors and multi-deck systems.',
      feature: 'Maximized Merchandising',
      icon: <ShoppingCart size={32} strokeWidth={1.5} className="text-gray-700" />
    },
    {
      title: 'WAREHOUSES',
      desc: 'Large-scale drive-in coolers for massive high-volume cold storage.',
      feature: 'ASTM E84 Compliant',
      icon: <Box size={32} strokeWidth={1.5} className="text-gray-700" />
    },
    {
      title: 'HOSPITALITY',
      desc: 'Solutions for resort kitchens, banquet facilities, and large-scale F&B.',
      feature: 'Integrated Catering Systems',
      icon: <Building2 size={32} strokeWidth={1.5} className="text-gray-700" />
    },
    {
      title: 'HEALTHCARE',
      desc: 'Precise, medical-grade temperature arrays for sensitive pharma storage.',
      feature: 'NIST Traceable Monitoring',
      icon: <Stethoscope size={32} strokeWidth={1.5} className="text-gray-700" />
    },
    {
      title: 'CUSTOM',
      desc: 'Fully tailored, spatially complex engineering solutions for unique project requirements.',
      feature: 'Full CAD/BIM Support',
      icon: <Star size={32} strokeWidth={1.5} className="text-gray-700" />
    }
  ];

  return (
    <div className="w-full bg-white font-sans">
      
      {/* --- 1. DUAL HERO BANNERS --- */}
      <section className="w-full max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-2">
        
        {/* Banner 1: Walk-in Coolers */}
        <div className="relative h-[350px] md:h-[450px] lg:h-[500px] overflow-hidden group bg-[#002f6c]">
          {/* Background Image (Using high quality relevant placeholder) */}
          <div 
            className="absolute inset-0 bg-cover bg-right md:bg-center group-hover:scale-105 transition-transform duration-700 ease-out"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1587293852726-70cdb56c2866?q=80&w=1200&auto=format&fit=crop')" }}
          ></div>
          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#002f6c] via-[#002f6c]/80 to-transparent"></div>
          
          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 lg:px-20">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-3 leading-tight tracking-tight">
              Walk-in Coolers<br />& Freezers
            </h2>
            <p className="text-blue-100 text-sm md:text-base font-medium mb-8">
              Custom Sizes <span className="mx-2">•</span> Now 15% Savings
            </p>
            <Link href="/walk-in-cooler-freezer" className="bg-white text-[#002f6c] hover:bg-gray-100 px-8 py-3.5 text-xs font-extrabold uppercase tracking-widest w-max transition-colors shadow-lg">
              Shop Now
            </Link>
          </div>
        </div>

        {/* Banner 2: Refrigeration Equipment */}
        <div className="relative h-[350px] md:h-[450px] lg:h-[500px] overflow-hidden group bg-[#0a192f]">
          {/* Background Image (Using high quality relevant placeholder) */}
          <div 
            className="absolute inset-0 bg-cover bg-right md:bg-center group-hover:scale-105 transition-transform duration-700 ease-out"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1635405038299-6e3eb33bc073?q=80&w=1200&auto=format&fit=crop')" }}
          ></div>
          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a192f] via-[#0a192f]/90 to-transparent"></div>
          
          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 lg:px-20">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-3 leading-tight tracking-tight">
              Refrigeration<br />Equipment
            </h2>
            <p className="text-gray-300 text-sm md:text-base font-medium mb-8">
              Take an Extra $50 Off Every Monday
            </p>
            <Link href="/refrigeration-equipment" className="bg-white text-[#0a192f] hover:bg-gray-100 px-8 py-3.5 text-xs font-extrabold uppercase tracking-widest w-max transition-colors shadow-lg">
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* --- 2. TARGET INDUSTRIES GRID --- */}
      <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <h4 className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mb-4">
            Target Industries
          </h4>
          <h2 className="text-3xl md:text-5xl font-black text-[#0f172a] tracking-tight">
            ONE SYSTEM. <span className="text-[#0052cc]">EVERY SECTOR.</span>
          </h2>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {industries.map((ind, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-2xl p-8 flex items-start gap-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
            >
              {/* Left Icon */}
              <div className="shrink-0 mt-1">
                {ind.icon}
              </div>
              
              {/* Right Content */}
              <div className="flex flex-col h-full">
                <h3 className="text-sm md:text-base font-extrabold text-[#0f172a] uppercase tracking-wide mb-3">
                  {ind.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow">
                  {ind.desc}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-[11px] font-extrabold text-[#334155]">
                    {ind.feature}
                  </span>
                  <span className="text-gray-300 group-hover:text-[#0052cc] transition-colors transform group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </section>
    </div>
  );
}