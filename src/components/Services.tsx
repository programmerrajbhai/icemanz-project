"use client";

import { Wrench, Zap, Layout, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const services = [
  {
    title: 'Installation',
    description: 'ICEMANZ provides professional installation for walk-in coolers, refrigeration units, and HVAC systems. Our skilled team ensures every system is set up for maximum efficiency.',
    icon: Zap,
    gridArea: 'lg:col-span-2',
    color: 'bg-primary/10',
    iconColor: 'text-primary',
    variant: 'primary'
  },
  {
    title: 'Maintenance',
    description: 'Maximize uptime and boost efficiency with ICEMANZ’s expert maintenance and rapid aftersales support.',
    icon: Wrench,
    gridArea: 'lg:col-span-1',
    color: 'bg-primary/10',
    iconColor: 'text-primary',
    variant: 'neutral'
  },
  {
    title: 'Engineering Design',
    description: 'At ICEMANZ, every cooler and freezer is backed by smart engineering and accurate load calculations.',
    icon: Layout,
    gridArea: 'lg:col-span-1',
    color: 'bg-primary/10',
    iconColor: 'text-primary',
    variant: 'neutral'
  },
  {
    title: 'Smart Cooling',
    description: 'Advanced temperature control and monitoring systems to keep your products safe and energy costs low.',
    icon: ShieldCheck,
    gridArea: 'lg:col-span-2',
    color: 'bg-primary/10',
    iconColor: 'text-primary',
    variant: 'primary'
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
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16 md:mb-20">
          <div className="space-y-5">
            <div className="flex items-center gap-3 text-primary">
              <div className="w-8 h-px bg-primary"></div>
              <span className="text-[11px] font-black uppercase tracking-[0.4em]">Excellence in Service</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
              Smart <span className="text-primary">Cooling</span><br />
              Tailored Solutions
            </h2>
          </div>

          <Link
            href="/services"
            className="group flex items-center gap-2 text-primary text-[11px] font-black uppercase tracking-[0.2em] hover:text-blue-700 transition-colors mb-2"
          >
            View All Services
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform stroke-[3px]" />
          </Link>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className={`${service.gridArea} group relative flex flex-col rounded-[2.5rem] overflow-hidden transition-all duration-700 p-8 md:p-10 bg-linear-to-br ${service.variant === 'primary' ? 'from-primary/5 via-white to-white border border-primary/20 hover:border-primary/40 hover:shadow-2xl' : 'from-slate-50 via-white to-white border border-slate-100 hover:border-primary/20 hover:shadow-xl'}`}
            >
              <div className={`size-16 inline-flex justify-center items-center rounded-2xl ${service.color} ${service.iconColor} mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm transform group-hover:-translate-y-1`}>
                <service.icon className="size-8 stroke-[1.5px]" />
              </div>

              <div className="mt-auto space-y-4">
                <h3 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tight leading-none group-hover:text-primary transition-colors">
                  {service.title}
                </h3>

                <p className="text-slate-500 text-[15px] leading-relaxed max-w-md font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                  {service.description}
                </p>

                <div className="flex items-center gap-2 text-primary text-[11px] font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500 pt-4">
                  <span>Explore Service</span>
                  <ArrowRight size={14} className="stroke-[3px]" />
                </div>
              </div>

              {/* Decorative background number or icon */}
              <div className="absolute -bottom-6 -right-6 size-40 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-110 transition-all duration-1000">
                <service.icon className="size-full" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .outline-text {
          -webkit-text-stroke: 1px #e5e7eb;
          color: transparent;
        }
      `}</style>
    </section>
  );
}
