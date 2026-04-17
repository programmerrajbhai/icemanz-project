"use client";

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState, use, useRef } from 'react';
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
  FileDown,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize
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
  const [activeTab, setActiveTab] = useState('Features');

  // Image Controls State
  const [zoomLevel, setZoomLevel] = useState(1);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.5, 1));
  const handleResetZoom = () => setZoomLevel(1);

  const handleFullscreen = () => {
    if (imageContainerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        imageContainerRef.current.requestFullscreen();
      }
    }
  };

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
                    onClick={() => {
                      setActiveImageIndex(i);
                      handleResetZoom();
                    }}
                    className={`flex-shrink-0 size-16 md:size-20 bg-gray-50 border-2 rounded-none overflow-hidden transition-all focus:outline-none p-1.5 ${i === activeImageIndex ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-gray-300'}`}
                  >
                    <img src={img} alt={`View ${i + 1}`} className="size-full object-cover rounded-none" />
                  </button>
                ))}
              </div>

              <div ref={imageContainerRef} className="flex-1 bg-gray-50 border border-gray-200 rounded-none overflow-hidden aspect-square md:aspect-[4/3] flex items-center justify-center p-6 md:p-12 relative bg-white">
                {/* IN STOCK Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="inline-flex items-center bg-[#0047AB] text-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider shadow-sm rounded-none">
                    IN STOCK
                  </span>
                </div>

                <div className="w-full h-full flex items-center justify-center overflow-hidden">
                  <img
                    src={product.images[activeImageIndex]}
                    alt={product.title}
                    style={{ transform: `scale(${zoomLevel})` }}
                    className="max-h-full max-w-full object-contain transition-transform duration-300 ease-out"
                  />
                </div>

                {/* Image Controls - Always visible */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center z-10">
                  <div className="flex items-center gap-2">
                    <button onClick={handleResetZoom} className="size-10 bg-[#404040] hover:bg-[#202020] text-white rounded-full flex items-center justify-center transition-colors shadow-md">
                      <RotateCcw size={18} />
                    </button>
                    <button onClick={handleZoomIn} className="size-10 bg-[#404040] hover:bg-[#202020] text-white rounded-full flex items-center justify-center transition-colors shadow-md">
                      <ZoomIn size={18} />
                    </button>
                    <button onClick={handleZoomOut} className="size-10 bg-[#404040] hover:bg-[#202020] text-white rounded-full flex items-center justify-center transition-colors shadow-md">
                      <ZoomOut size={18} />
                    </button>
                  </div>

                  <button onClick={handleFullscreen} className="size-10 bg-[#404040] hover:bg-[#202020] text-white rounded-full flex items-center justify-center transition-colors shadow-md">
                    <Maximize size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Product Info - Redesigned to match reference */}
            <div className="flex flex-col">
              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-8">
                {product.title}
              </h1>

              {/* Main Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                <Link
                  href="/request-invoice"
                  className="flex-1 py-3 px-6 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-none border border-transparent bg-primary text-white hover:bg-blue-700 transition-all shadow-sm active:scale-95 group"
                >
                  <FileText size={18} className="group-hover:scale-110 transition-transform" />
                  Request For invoice
                </Link>
                <a
                  href="tel:929-451-7665"
                  className="flex-1 py-3 px-6 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-none border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 transition-all active:scale-95 shadow-sm group"
                >
                  <PhoneCall size={18} className="group-hover:rotate-12 transition-transform" />
                  Call Specialist
                </a>
              </div>

              {/* Key Features Section */}
              <div className="mb-10">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4 tracking-tight">Key Features</h3>
                <p className="text-gray-600 text-base leading-relaxed mb-8">
                  {product.keyFeatures}
                </p>

                {/* Warranty Section */}
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4 tracking-tight">Warranty</h3>
                <ul className="space-y-3 mb-10">
                  {product.warranty.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-600 text-base leading-relaxed">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                {/* Documents Section */}
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4 tracking-tight">Documents</h3>
                <div className="flex flex-wrap gap-4 mb-0 bg-gray-50 border border-gray-200 p-6 rounded-none shadow-sm">
                  {product.documents.map((doc, i) => (
                    <a
                      key={i}
                      href={doc.href}
                      className="inline-flex items-center gap-2.5 text-sm font-semibold text-gray-600 hover:text-primary transition-all group/doc"
                    >
                      <div className="size-8 rounded-none bg-white border border-gray-200 flex items-center justify-center text-gray-400 group-hover/doc:text-primary group-hover/doc:border-primary/30 transition-all shadow-sm">
                        <FileDown size={16} />
                      </div>
                      <span className="underline decoration-1 underline-offset-4 decoration-gray-300 group-hover/doc:decoration-primary">
                        {doc.name}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product Tabs Section */}
          <div className="mt-4 max-w-5xl mx-auto">
            <div>
              <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2" aria-label="Tabs">
                {['Features'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-1 inline-flex items-center gap-x-2 border-b-2 text-xl font-bold whitespace-nowrap transition-colors ${activeTab === tab
                      ? 'border-primary text-[#0f172a]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6 md:p-10 shadow-sm">
              {activeTab === 'Features' && (
                <div className="space-y-12">
                  {/* Features List */}
                  <div>

                    <ul className="space-y-6">
                      {product.detailedFeatures?.map((feature, i) => (
                        <li key={i} className="text-[#0f172a] text-[15px] font-medium leading-relaxed">
                          <span className="underline decoration-1 underline-offset-[6px] decoration-gray-300">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Recommended Products - From Reference */}
          <div className="mt-12 md:mt-16">
            <div className="text-center mb-8 md:mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight inline-block relative pb-4">
                Recommended products
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-0.5 bg-gray-200" />
              </h2>
            </div>

            <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                { name: "Condensing Unit", image: "/slider/s_1.jpeg" },
                { name: "Evaporator Coil", image: "/slider/s_2.jpeg" },
                { name: "Scroll Compressor", image: "/slider/s_3.jpeg" },
                { name: "Package Unit", image: "/Walk-inCooler&Freezer/combounits.jpg" }
              ].map((item, i) => (
                <Link
                  key={i}
                  href="#"
                  className="group bg-white border border-gray-100/80 p-2 shadow-md shadow-gray-200/50 overflow-hidden hover:shadow-2xl hover:shadow-gray-300/60 hover:-translate-y-1 transition-all duration-500 flex flex-col"
                >
                  {/* Image Area */}
                  <div className="relative w-full pt-[80%] bg-gray-50 overflow-hidden mb-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="size-full absolute top-0 start-0 object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  {/* Content Area */}
                  <div className="flex flex-col flex-grow text-center items-center px-1 mt-2">
                    <h3 className="text-sm sm:text-base font-black text-gray-900 mb-2 tracking-tight group-hover:text-primary transition-colors line-clamp-2">
                      {item.name}
                    </h3>

                    <div className="flex items-center justify-center gap-1.5 mb-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00C853]"></div>
                      <span className="text-[9px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-widest">In Stock</span>
                    </div>

                    {/* Action Button */}
                    <div className="w-full mt-auto pb-1">
                      <div className="cursor-pointer w-full py-2.5 px-3 border-[1.5px] border-gray-200 flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] font-black text-[#0f172a] uppercase tracking-[0.2em] group-hover:border-gray-300 group-hover:bg-gray-50 transition-all duration-300 shadow-sm group-hover:shadow">
                        View Details
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform text-[#0f172a]" />
                      </div>
                    </div>
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
