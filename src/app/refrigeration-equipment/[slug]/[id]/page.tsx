"use client";

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState, use } from 'react';
import {
  ChevronRight,
  Truck,
  ShieldCheck,
  PhoneCall,
  FileText,
  ArrowLeft,
  Settings,
  Zap,
  Gauge,
  FileDown
} from 'lucide-react';

const mockProducts = [
  {
    id: '1',
    badge: 'IN STOCK',
    title: "Standard Condensing Unit - 2HP",
    images: ['/slider/s_1.jpeg', '/slider/s_2.jpeg', '/slider/s_3.jpeg'],
    keyFeatures: "3.5 HP, Low Temperature Condensing Unit With Scroll Compressor 208-230V/1Ph/60Hz",
    warranty: [
      "1 Year Compressor Warranty (4 Year extended warranty available)",
      "1 Year Fan Motor and Parts Warranty"
    ],
    documents: [
      { name: "Cut Sheet", href: "#" },
      { name: "Parameter Settings", href: "#" },
      { name: "User Manual", href: "#" },
      { name: "Maintenance Guide", href: "#" }
    ],
    detailedFeatures: [
      "Blue anti-corrosion-fin increases the life span of the coil.",
      "Seamless inner groove copper tube increases the heat exchange rate by reducing the space between the fin and copper tube.",
      "Highest quality compressor in the world.",
      "Head pressure control stabilizes the freezing of liquid line, minimizes formation of flash gas to increase efficiency of the system, and prevents compressor damage by controlling high pressure.",
      "Experienced engineers have designed the system for maximum efficiency.",
      "Fan Blades: Specifically matched with motors and coil for maximum air movement and cooling.",
      "Control box is designed for easy installation.",
      "Low pressure control is adjustable.",
      "All the parts are compliant with industry standards and interchangeable with readily available parts.",
      "Wiring: Easily accessible. Compressor comes with a wiring harness that is manufactured with connections that will not come loose with vibration.",
      "Control box and service valves are located outside for easy service.",
      "Base: Heavy duty steel. Legs are 2-1/6\" tall.",
      "Cabinet: Prepainted with galvanized body. Protects against corrosion.",
      "All products carry UL, CUL, ISO 9001 approvals."
    ],
    description: 'High-performance air-cooled condensing unit designed for commercial refrigeration. Features a robust scroll compressor and energy-efficient fan motors.',
    condition: 'New',
    type: 'Refrigeration',
    price: 'From $1,200',
    specs: [
      { label: 'Capacity', value: "2 HP (15,000 BTU/hr)" },
      { label: 'Refrigerant', value: 'R448A / R449A' },
      { label: 'Power Supply', value: '208-230V / 1PH / 60Hz' },
      { label: 'Compressor Type', value: "High Efficiency Scroll" },
      { label: 'Condenser Type', value: 'Air-Cooled with Heavy Duty Fins' },
      { label: 'Dimensions', value: '32"W x 24"D x 28"H' }
    ]
  }
];

export default function RefrigerationProductDetailsPage({ params }: { params: Promise<{ slug: string, id: string }> }) {
  const { slug, id } = use(params);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const product = mockProducts.find(p => p.id === id) || mockProducts[0];

  const categoryTitle = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="pt-32 pb-20 md:pt-44 md:pb-24">
        <div className="container px-4">
          <Link
            href={`/refrigeration-equipment/${slug}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-blue-700 transition-colors mb-8 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to {categoryTitle}
          </Link>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            {/* Left: Product Gallery - Removed sticky to prevent scroll overlap issues */}
            <div className="flex flex-col-reverse md:flex-row gap-4">
              <div className="flex md:flex-col gap-3 shrink-0 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    className={`flex-shrink-0 size-16 md:size-20 bg-gray-50 border-2 rounded-xl overflow-hidden transition-all focus:outline-none p-1.5 ${i === activeImageIndex ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-gray-300'}`}
                  >
                    <img src={img} alt={`View ${i + 1}`} className="size-full object-cover rounded-lg" />
                  </button>
                ))}
              </div>

              <div className="flex-1 bg-gray-50 border border-gray-200 rounded-3xl overflow-hidden aspect-square md:aspect-[4/3] flex items-center justify-center p-6 md:p-12 relative">
                <div className="absolute top-4 left-4 z-10">
                  <span className="inline-block bg-primary text-white px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm rounded-lg">
                    {product.badge}
                  </span>
                </div>
                <img
                  src={product.images[activeImageIndex]}
                  alt={product.title}
                  className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Right: Product Info - Redesigned to match reference */}
            <div className="flex flex-col">
              {/* Labels */}
              <div className="flex items-center gap-2 mb-6">
                <span className="py-1 px-3 inline-flex items-center text-[10px] font-black uppercase tracking-wider bg-blue-50 text-primary border border-blue-100 rounded-md">
                  NEW
                </span>
                <span className="py-1 px-3 inline-flex items-center text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-md">
                  USED
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-5xl font-black text-[#0b1120] tracking-tight mb-8 leading-none uppercase">
                {product.title}
              </h1>

              {/* Main Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                <Link
                  href="/request-invoice"
                  className="flex-1 py-4 px-8 inline-flex justify-center items-center gap-x-3 text-sm font-black uppercase tracking-widest rounded-xl border border-transparent bg-primary text-white hover:bg-blue-700 transition-all shadow-xl shadow-primary/30 active:scale-95 group"
                >
                  <FileText size={18} className="group-hover:scale-110 transition-transform" />
                  Request <span className="opacity-80 lowercase font-bold">For invoice</span>
                </Link>
                <a
                  href="tel:929-451-7665"
                  className="flex-1 py-4 px-8 inline-flex justify-center items-center gap-x-3 text-sm font-black uppercase tracking-widest rounded-xl border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 transition-all active:scale-95 shadow-sm group"
                >
                  <PhoneCall size={18} className="group-hover:rotate-12 transition-transform" />
                  Call Specialist
                </a>
              </div>

              {/* Key Features Section */}
              <div className="mb-10">
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 tracking-tight">Key Features</h3>
                <p className="text-gray-600 text-lg leading-relaxed font-medium mb-8">
                  {product.keyFeatures}
                </p>

                {/* Warranty Section */}
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 tracking-tight">Warranty</h3>
                <ul className="space-y-3 mb-10">
                  {product.warranty.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-600 font-medium leading-relaxed">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                {/* Documents Section */}
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 tracking-tight">Documents</h3>
                <div className="flex flex-wrap gap-4 mb-0 bg-gray-50 border border-gray-200/60 p-8 rounded-3xl shadow-sm">
                  {product.documents.map((doc, i) => (
                    <a
                      key={i}
                      href={doc.href}
                      className="inline-flex items-center gap-2.5 text-sm font-bold text-slate-500 hover:text-primary transition-all group/doc"
                    >
                      <div className="size-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-slate-400 group-hover/doc:text-primary group-hover/doc:border-primary/30 transition-all shadow-sm">
                        <FileDown size={16} />
                      </div>
                      <span className="underline decoration-2 underline-offset-4 decoration-gray-300 group-hover/doc:decoration-primary">
                        {doc.name}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Features Section - From Reference */}
          <div className="mt-8 pt-8 border-t border-gray-100">
            <h2 className="text-3xl font-black text-gray-900 mb-10 tracking-tight uppercase">Features :</h2>
            <ul className="space-y-4 max-w-5xl">
              {product.detailedFeatures?.map((feature, i) => (
                <li key={i} className="text-gray-600 font-bold text-[15px] leading-relaxed">
                  <span className="underline decoration-1 underline-offset-[6px] decoration-gray-200">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommended Products - From Reference */}
          <div className="mt-32 pt-16 border-t border-[#f8e7e7]">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif text-gray-800 tracking-wide inline-block relative pb-4">
                Recommended products
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-px bg-[#c4a4a4]" />
              </h2>
            </div>

            <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                { name: "Condensing Unit", image: "/slider/s_1.jpeg" },
                { name: "Evaporator Coil", image: "/slider/s_2.jpeg" },
                { name: "Scroll Compressor", image: "/slider/s_3.jpeg" },
                { name: "Package Unit", image: "/Walk-inCooler&Freezer/combounits.jpg" }
              ].map((item, i) => (
                <Link
                  key={i}
                  href="#"
                  className="group block bg-gray-50/50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-500"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-3 text-center">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">{item.name}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
