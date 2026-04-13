"use client";

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ChevronRight, ShieldCheck, Zap, Clock, Snowflake, ArrowRight, CheckCircle2, Settings } from 'lucide-react';

const productCategories = [
  { name: 'Condensing units', image: '/slider/s_1.jpeg', slug: 'condensing-units' },
  { name: 'Medium profile (Scroll compressor)', image: '/slider/s_2.jpeg', slug: 'medium-profile-scroll-compressor' },
  { name: 'Evaporation units', image: '/slider/s_3.jpeg', slug: 'evaporation-units' },
  { name: 'Combo units / package unit', image: '/Walk-inCooler&Freezer/combounits.jpg', slug: 'combo-units-package-unit' },
  { name: 'Low profile evaporator', image: '/slider/s_1.jpeg', slug: 'low-profile-evaporator' },
  { name: 'Medium profile', image: '/slider/s_2.jpeg', slug: 'medium-profile' },
  { name: 'Center mount', image: '/slider/s_3.jpeg', slug: 'center-mount' },
  { name: 'Thin profile evaporator', image: '/slider/s_1.jpeg', slug: 'thin-profile-evaporator' },
];

const reasons = [
  'High-efficiency cooling systems for all industries',
  'Precision temperature and humidity control',
  'Energy-saving technology for lower operating costs',
  'Reliable performance in extreme environments',
  'Easy integration with existing systems',
  'Durable construction for long-term use',
  'Expert engineering and design support',
  'Comprehensive maintenance and after-sales service'
];

const equipmentTypes = [
  'Air Cooled Condensing Units',
  'Water Cooled Condensing Units',
  'Scroll Compressor Systems',
  'Semi-Hermetic Solutions',
  'Electric Defrost Evaporators',
  'Air Defrost Systems',
  'Low Profile Cooling Units',
  'Medium Profile Evaporators',
  'Thin Profile Systems'
];

export default function RefrigerationEquipmentPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="pt-32 pb-20 md:pt-44 md:pb-24">
        <div className="container px-4">
          {/* Header Bar */}
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight uppercase">
              Refrigeration <span className="text-primary">Equipment</span>
            </h1>
          </div>

          {/* Main Grid Section */}
          <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 mb-24 md:mb-32">
            {productCategories.map((product, index) => (
              <Link
                key={index}
                href={`/refrigeration-equipment/${product.slug}`}
                className="group flex flex-col bg-white border border-gray-100 rounded-2xl hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 overflow-hidden text-center items-center"
              >
                {/* Image Area */}
                <div className="p-3 bg-white w-full">
                  <div className="relative pt-[100%] rounded-xl bg-gray-50 overflow-hidden border border-gray-50">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="size-full absolute top-0 start-0 object-contain transition-transform duration-700 ease-in-out p-4 group-hover:scale-110"
                    />
                  </div>
                </div>

                {/* Content Area */}
                <div className="px-3 pb-4 pt-1 flex flex-col flex-grow">
                  <h3 className="text-[11px] md:text-[13px] font-black text-gray-900 leading-tight tracking-tight group-hover:text-primary transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          {/* Content Section */}
          <div className="max-w-5xl mx-auto space-y-16">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-start">
              <div className="space-y-6">
                <h2 className="text-2xl md:text-4xl font-black text-gray-900 uppercase tracking-tight">Shop Refrigeration Equipment</h2>
                <div className="space-y-4 text-gray-600 leading-relaxed font-medium">
                  <p>
                    Quality refrigeration equipment is the backbone of any successful cold storage operation. At ICEMANZ, we provide high-performance condensing units, evaporation units, and specialized cooling solutions designed for maximum reliability and efficiency.
                  </p>
                  <p>
                    Whether you're looking for low-profile evaporators for tight spaces or powerful scroll compressor systems for industrial use, our selection covers every need. We partner with industry-leading brands to ensure you get the best technology for your business.
                  </p>
                  <p>
                    Our expert team is here to help you select the right components for your system, from air-cooled condensing units to custom-built package units. Browse our categories above to explore our full range of professional refrigeration equipment.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-100 rounded-3xl p-8 md:p-10">
                <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight">Why Choose ICEMANZ?</h2>
                <ul className="space-y-4">
                  {reasons.slice(0, 6).map((reason, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="text-primary w-4 h-4" />
                      </div>
                      <span className="text-[15px] text-gray-700 font-bold">{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Types Banner */}
            <div className="bg-[#004a99] bg-gradient-to-r from-primary to-blue-800 rounded-3xl p-8 md:p-16 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative z-10 grid md:grid-cols-3 gap-12">
                <div className="md:col-span-2">
                  <h2 className="text-2xl md:text-4xl font-black mb-6 uppercase tracking-tight leading-tight">Types of Refrigeration Equipment We Offer</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                    {equipmentTypes.map((type, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                        <span className="text-[15px] font-bold text-blue-50">{type}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col justify-center gap-6">
                  <p className="text-blue-100 font-medium text-lg leading-relaxed">
                    Need technical advice on your next system upgrade?
                  </p>
                  <Link href="/quote" className="inline-flex items-center justify-center gap-2 bg-white text-primary px-8 py-4 rounded-xl font-black uppercase tracking-widest text-sm shadow-xl shadow-black/20 hover:bg-blue-50 transition-all active:scale-95 group">
                    Get Expert Advice <ArrowRight className="group-hover:translate-x-1 transition-transform w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
