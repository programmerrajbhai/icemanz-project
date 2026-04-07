"use client";

import { Wrench, Zap, Layout, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const services = [
  {
    title: 'Installation',
    description: 'ICEMANZ provides professional installation for walk-in coolers, refrigeration units, and HVAC systems. Our skilled team ensures every system is set up for maximum efficiency and long-term performance.',
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
    <section id="services" className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden relative">
      <div className="container px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10 md:mb-12">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <div className="w-6 h-px bg-primary"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Excellence in Service</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight uppercase leading-[0.95]">
              Smart <span className="text-primary">Cooling</span><br />
              Tailored Solutions
            </h2>
          </div>

          <Link
            href="/services"
            className="group flex items-center gap-2 text-primary text-xs font-black uppercase tracking-widest hover:text-blue-700 transition-colors mb-1"
          >
            View All Services
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {services.map((service, index) => (
            <div
              key={index}
              className={`${service.gridArea} group relative flex flex-col rounded-3xl overflow-hidden transition-all duration-700 p-6 md:p-7 bg-gradient-to-br ${service.variant === 'primary' ? 'from-primary/5 to-white border border-primary/30 hover:border-primary/50 hover:shadow-xl' : 'from-gray-50 to-white border border-gray-200 hover:border-primary/30 hover:shadow-lg'}`}
            >
              <div className={`size-11 inline-flex justify-center items-center rounded-xl ${service.color} ${service.iconColor} mb-5 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm`}>
                <service.icon className="size-5 stroke-[1.5px]" />
              </div>

              <div className="mt-auto space-y-3">
                <h3 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tight leading-none group-hover:text-primary transition-colors">
                  {service.title}
                </h3>

                <p className="text-slate-600 text-sm leading-relaxed max-w-md line-clamp-2 md:line-clamp-none">
                  {service.description}
                </p>

                <div className="flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500 pt-1">
                  <span>Learn More</span>
                  <ArrowRight size={14} />
                </div>
              </div>

              {/* Decorative background number or icon */}
              <div className="absolute -bottom-4 -right-4 size-20 opacity-[0.05] group-hover:opacity-[0.1] group-hover:scale-110 transition-all duration-700">
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
