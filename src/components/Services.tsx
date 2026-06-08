"use client";

import { Wrench, Zap, Layout, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const services = [
  {
    title: 'Installation',
    description: 'Professional installations for walk-in coolers, refrigeration units, and HVAC systems. Our team ensures zero-downtime setup optimized for maximum efficiency.',
    icon: Wrench,
  },
  {
    title: 'Maintenance',
    description: 'Maximize system lifespan and efficiency with ICEMANZ expert maintenance and rapid response technical support available around the clock.',
    icon: ShieldCheck,
  },
  {
    title: 'Engineering Design',
    description: 'Every cooler and freezer is backed by expert engineering and accurate heat load calculations—designed to the exact spec your facility demands.',
    icon: Layout,
  },
  {
    title: 'Smart Cooling',
    description: 'Advanced temperature control and monitoring systems to keep your products safe and energy costs low around the clock, every day.',
    icon: Zap,
  },
];

export default function Services() {
  return (
    <section id="services" className="py-20 md:py-32 bg-white overflow-hidden relative">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <pattern id="grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left Column: Text & CTA */}
          <div className="space-y-6 md:space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <div className="w-8 h-px bg-primary"></div>
                <span className="text-[11px] font-black uppercase tracking-[0.4em]">Excellence in Service</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight text-gray-900 leading-[1.1]">
                Smart <span className="text-primary">Cooling</span><br />
                Tailored Solutions
              </h2>
            </div>

            <p className="text-slate-500 text-base md:text-lg leading-relaxed max-w-lg font-medium">
              At ICEMANZ, every cooler and freezer is backed by expert engineering and accurate heat calculations. We design systems that keep your products safe and energy costs low.
            </p>

            <div className="pt-2">
              <Link
                href="/services"
                className="inline-flex justify-center items-center gap-x-2 bg-primary text-white hover:bg-blue-800 text-[11px] font-black uppercase tracking-[0.15em] py-4 px-8 rounded-sm transition-all shadow-[0_0_20px_rgba(0,74,153,0.2)] hover:shadow-[0_0_30px_rgba(0,74,153,0.4)]"
              >
                View All Services
              </Link>
            </div>
          </div>

          {/* Right Column: Service Cards Grid */}
          <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-slate-50 border border-slate-100 rounded-2xl p-6 md:p-8 hover:border-primary/30 hover:bg-white hover:shadow-xl transition-all duration-300 group"
              >
                <div className="size-12 rounded-lg bg-white border border-slate-200 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:border-primary transition-colors duration-300 shadow-sm">
                  <service.icon className="size-5 text-primary group-hover:text-white transition-colors" strokeWidth={2} />
                </div>

                <h3 className="text-[14px] font-black text-gray-900 uppercase tracking-widest mb-3 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>

                <p className="text-slate-500 text-[13px] leading-relaxed font-medium">
                  {service.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
