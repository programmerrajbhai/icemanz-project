'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState, use } from 'react';
import {
  ChevronRight,
  Truck,
  ShieldCheck,
  PhoneCall,
  FileText
} from 'lucide-react';

const mockProducts = [
  {
    id: '1',
    badge: 'ALWAYS IN STOCK!',
    title: "New ICEMANZ 5' x 8' x 8'H Walk-in Cooler",
    images: ['/products/product_1.jpg', '/slider/s_1.jpeg', '/slider/s_2.jpeg'],
    description: 'Professional grade walk-in cooler designed for maximum efficiency and durability. Ideal for restaurants, supermarkets, and commercial kitchens.',
    condition: 'Used',
    sqFt: '40 Sq. Ft.',
    type: 'New',
    price: '$5,250',
    specs: [
      { label: 'Dimensions', value: "5' x 8' x 8'H" },
      { label: 'Insulation', value: '4" Thick Polyurethane' },
      { label: 'Floor', value: 'Included (Aluminum Diamond Tread)' },
      { label: 'Door Size', value: "36' x 78' Flush Mount" },
      { label: 'Refrigeration', value: 'Optional Remote or Package System' },
      { label: 'Voltage', value: '208-230V / 1PH / 60Hz' }
    ]
  },
  // Add more mock data if needed, but one is enough for dynamic routing demonstration
];

export default function ProductDetailsPage({ params }: { params: Promise<{ slug: string, id: string }> }) {
  const { slug, id } = use(params);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Find product by ID or use first one as fallback for demo
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
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            {/* Left: Product Gallery - Vertical Layout */}
            <div className="flex flex-col-reverse md:flex-row gap-4">
              {/* Thumbnails Column */}
              <div className="flex md:flex-col gap-3 shrink-0">
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

              {/* Main Image View */}
              <div className="flex-1 bg-gray-50 border border-gray-200 rounded-3xl overflow-hidden aspect-[4/3] flex items-center justify-center p-6 md:p-12 relative">
                <div className="absolute top-4 left-4 z-10">
                  <span className="inline-block bg-[#cc0000] text-white px-3 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-sm">
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

            {/* Right: Product Info - Preline Content Pattern */}
            <div className="flex flex-col h-full">
              <div className="mb-4 md:mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="py-1 px-2.5 inline-flex items-center text-[10px] font-black uppercase tracking-wider bg-primary/10 text-primary rounded-lg">
                    {product.type}
                  </span>
                  <span className="py-1 px-2.5 inline-flex items-center text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700 rounded-lg">
                    {product.condition}
                  </span>
                </div>

                <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-4 leading-tight uppercase">
                  {product.title}
                </h1>

                {/* Primary Call to Action */}
                <div className="mb-4 md:mb-8 flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/quote"
                    className="flex-1 py-4 px-8 inline-flex justify-center items-center gap-x-3 text-sm font-black uppercase tracking-widest rounded-xl border border-transparent bg-primary text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-xl shadow-blue-500/20 cursor-pointer active:scale-95"
                  >
                    <FileText size={18} /> Request Pricing
                  </Link>
                  <a
                    href="tel:929-451-7665"
                    className="flex-1 py-4 px-8 inline-flex justify-center items-center gap-x-3 text-sm font-black uppercase tracking-widest rounded-xl border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer active:scale-95"
                  >
                    <PhoneCall size={18} /> Call Specialist
                  </a>
                </div>

                <p className="hidden md:block text-gray-600 text-base md:text-lg leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Specs Table - Preline Table Pattern */}
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm mb-8">
                <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-200">
                  <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider">Technical Specifications</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {product.specs.map((spec, i) => (
                    <div key={i} className="flex px-6 py-3 items-center text-sm">
                      <span className="w-1/3 font-bold text-gray-500 uppercase text-[11px] tracking-wider">{spec.label}</span>
                      <span className="w-2/3 font-semibold text-gray-800">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Cards - Preline Card Pattern */}
              <div className="grid sm:grid-cols-2 gap-4 mt-auto">
                <div className="p-5 border border-gray-200 rounded-2xl bg-white hover:border-primary transition-colors group">
                  <Truck className="size-6 text-primary mb-3" />
                  <h4 className="text-sm font-bold text-gray-800 mb-1 uppercase tracking-wider">Fast Shipping</h4>
                  <p className="text-xs text-gray-500">Nationwide delivery within 36-48 hours for in-stock units.</p>
                </div>
                <div className="p-5 border border-gray-200 rounded-2xl bg-white hover:border-primary transition-colors group">
                  <ShieldCheck className="size-6 text-primary mb-3" />
                  <h4 className="text-sm font-bold text-gray-800 mb-1 uppercase tracking-wider">Expert Support</h4>
                  <p className="text-xs text-gray-500">Dedicated assistance for design and installation queries.</p>
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
