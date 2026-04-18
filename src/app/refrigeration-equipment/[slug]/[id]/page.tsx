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
  Maximize,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  CheckCircle2
} from 'lucide-react';

const mockProducts = [
  {
    id: '1',
    badge: 'IN STOCK',
    title: "Standard Condensing Unit - 2HP",
    images: ['/slider/s_1.jpeg', '/slider/s_2.jpeg', '/slider/s_3.jpeg', '/slider/s_1.jpeg'],
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
  const [activeTab, setActiveTab] = useState('features');

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


          <div className="grid lg:grid-cols-[100px_1fr_1fr] gap-4 items-start bg-white p-0">
            {/* Left: Product Gallery - Vertical Layout */}
            <div className="flex md:flex-col gap-2 w-full lg:col-span-1 h-auto max-h-[600px] overflow-x-auto md:overflow-y-auto no-scrollbar">
              <button
                onClick={() => {
                  const prevIdx = activeImageIndex === 0 ? product.images.length - 1 : activeImageIndex - 1;
                  setActiveImageIndex(prevIdx);
                  handleResetZoom();
                }}
                className="hidden md:flex w-full cursor-pointer h-8 bg-gray-100 hover:bg-gray-200 rounded-sm items-center justify-center transition-colors focus:outline-none shrink-0"
                aria-label="Previous image"
              >
                <ChevronUp className="text-gray-600" size={16} />
              </button>

              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setActiveImageIndex(i);
                    handleResetZoom();
                  }}
                  className={`cursor-pointer  md:w-full md:aspect-square bg-white border rounded-md overflow-hidden transition-all focus:outline-none p-1.5 ${i === activeImageIndex ? 'border-[#003d80]' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <img src={img} alt={`View ${i + 1}`} className="size-full object-contain" />
                </button>
              ))}

              <button
                onClick={() => {
                  const nextIdx = activeImageIndex === product.images.length - 1 ? 0 : activeImageIndex + 1;
                  setActiveImageIndex(nextIdx);
                  handleResetZoom();
                }}
                className="hidden md:flex w-full cursor-pointer h-8 bg-gray-100 hover:bg-gray-200 rounded-sm items-center justify-center transition-colors focus:outline-none shrink-0"
                aria-label="Next image"
              >
                <ChevronDown className="text-gray-600" size={16} />
              </button>
            </div>



            {/* Main Image View */}
            <div ref={imageContainerRef} className="flex-1 bg-white border h-[500px] border-gray-200 overflow-hidden aspect-square w-full flex items-center justify-center relative lg:col-span-1 rounded-sm">
              {/* IN STOCK Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="inline-flex items-center bg-green-100 text-green-700 px-3 py-1 text-xs font-bold rounded-sm">
                  {product.badge || 'IN STOCK'}
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

              {/* Image Controls */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center z-10">
                <div className="flex items-center gap-2">
                  <button onClick={handleResetZoom} className="size-8 cursor-pointer bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-full flex items-center justify-center transition-colors shadow-sm">
                    <RotateCcw size={14} />
                  </button>
                  <button onClick={handleZoomIn} className="size-8 bg-white cursor-pointer border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-full flex items-center justify-center transition-colors shadow-sm">
                    <ZoomIn size={14} />
                  </button>
                  <button onClick={handleZoomOut} className="size-8 bg-white border cursor-pointer border-gray-200 hover:bg-gray-50 text-gray-600 rounded-full flex items-center justify-center transition-colors shadow-sm">
                    <ZoomOut size={14} />
                  </button>
                </div>

                <button onClick={handleFullscreen} className="size-8 bg-white border cursor-pointer border-gray-200 hover:bg-gray-50 text-gray-600 rounded-full flex items-center justify-center transition-colors shadow-sm">
                  <Maximize size={14} />
                </button>
              </div>
            </div>




            {/* Right: Product Info - Redesigned to match reference */}
            <div className="flex flex-col lg:col-span-1 px-0 lg:pl-8">
              {/* Title */}
              <div className="mb-5 mt-3">
                <h1 className="text-md md:text-2xl font-bold text-[#1f2937] tracking-tight ">
                  {product.title}
                </h1>
              </div>



              {/* Key Features Section */}
              <div className="">
                <h3 className=" text-md font-bold text-[#1f2937] mb-4">Key Features</h3>
                <p className="text-gray-600  pl-2 text-sm leading-relaxed mb-3">
                  {product.keyFeatures}
                </p>

                {/* Warranty Section */}
                <h3 className=" text-md font-bold text-[#1f2937] mb-4">Warranty</h3>

                <ul className="space-y-2 mb-4 pl-2">
                  {product.warranty.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-600  pl-2 text-sm leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>

                {/* Documents Section */}
                <h3 className="text-md font-bold text-[#1f2937] ">Documents</h3>

                <div className="flex flex-wrap gap-x-6 gap-y-4 mb-4  p-6 ">
                  {product.documents.map((doc, i) => (
                    <a
                      key={i}
                      href={doc.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2.5 text-[15px] font-semibold text-gray-600 hover:text-[#004a99] transition-colors group/doc"
                    >
                      <div className="size-8 rounded-sm bg-white border border-gray-200 flex items-center justify-center text-gray-400 transition-colors">
                        <FileDown size={16} strokeWidth={1.5} />
                      </div>
                      <span className="underline decoration-1 underline-offset-4 decoration-gray-300 hover:decoration-[#004a99]">
                        {doc.name}
                      </span>
                    </a>
                  ))}
                </div>
              </div>


              {/* Main Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-14">
                <Link
                  href={`/request-invoice?product=${encodeURIComponent(product.title)}`}
                  className="flex-1 py-3.5 px-6 inline-flex justify-center items-center gap-x-2 text-[15px] font-bold rounded-sm border border-transparent bg-[#004a99] text-white hover:bg-blue-800 transition-colors shadow-sm"
                >
                  <FileText size={18} />
                  Request for Invoice
                </Link>
                <a
                  href="tel:929-451-7665"
                  className="flex-1 py-3.5 px-6 inline-flex justify-center items-center gap-x-2 text-[15px] font-bold rounded-sm border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <PhoneCall size={18} />
                  Call Specialist
                </a>
              </div>

            </div>
          </div>

          {/* Bottom Tabs Section - Designed like reference */}
          <div className="mt-16 bg-white border border-gray-200 rounded-sm">
            {/* Tab Headers */}
            <div className="flex flex-wrap justify-center border-b border-gray-200 px-4">
              <button
                onClick={() => setActiveTab('features')}
                className={`py-5 px-6 text-md font-semibold relative cursor-pointer
                  }`}
              >
                Features
                {activeTab === 'features' && (
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#004a99]" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('additional_info')}
                className={`py-5 px-6 text-md font-semibold relative cursor-pointer
                  }`}
              >
                Additional information
                {activeTab === 'additional_info' && (
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#004a99]" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-5 px-6 text-md font-semibold relative cursor-pointer
                  }`}
              >
                Reviews(1)
                {activeTab === 'reviews' && (
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#004a99]" />
                )}
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-8 md:p-12 max-w-6xl mx-auto">
              {activeTab === 'features' && (
                <div className="space-y-8">


                  <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
                    {[
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
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="text-[#004a99] shrink-0 mt-0.5" size={20} />
                        <p className="text-gray-600 text-[15px] leading-relaxed">
                          {feature}
                        </p>
                      </div>
                    ))}
                  </div>


                </div>
              )}

              {activeTab === 'additional_info' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-[#1f2937] tracking-tight mb-6">Additional Information</h3>
                  <table className="w-full text-left text-sm text-gray-600 border border-gray-200">
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <th className="py-3 px-4 font-semibold text-gray-800 bg-gray-50 w-1/3">Weight</th>
                        <td className="py-3 px-4">45 lbs</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <th className="py-3 px-4 font-semibold text-gray-800 bg-gray-50">Dimensions</th>
                        <td className="py-3 px-4">24 × 18 × 20 in</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <th className="py-3 px-4 font-semibold text-gray-800 bg-gray-50">Warranty</th>
                        <td className="py-3 px-4">
                          <ul className="list-disc pl-4 space-y-1">
                            {product.warranty.map((w, i) => <li key={i}>{w}</li>)}
                          </ul>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-[#1f2937] tracking-tight mb-6">1 review for {product.title}</h3>
                  <div className="flex gap-4 border-b border-gray-100 pb-6">
                    <div className="size-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg shrink-0">
                      J
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-gray-900">John Doe</h4>
                        <span className="text-gray-400 text-sm">- October 12, 2025</span>
                      </div>
                      <div className="flex text-[#ea580c] mb-3 text-sm">
                        ★★★★★
                      </div>
                      <p className="text-gray-600 text-[15px] leading-relaxed">
                        Great product! Exact replacement for my old unit. Fast shipping and excellent customer service from the team. Highly recommended.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Products Section */}
          <div className=" mt-12 md:mt-18 border-gray-100 ">
            <h2 className="text-xl md:text-2xl font-bold text-[#1f2937] tracking-tight mb-8">
              Related products
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6 mb-8">
              {[
                { id: '1', name: "Standard Condensing Unit - 2HP", image: "/slider/s_1.jpeg" },
                { id: '2', name: "Premium Evaporator Coil - High Efficiency", image: "/slider/s_2.jpeg" },
                { id: '3', name: "Industrial Scroll Compressor - Heavy Duty", image: "/slider/s_3.jpeg" },
                { id: '4', name: "Center Mount Cooling Unit - Low Velocity", image: "/slider/s_1.jpeg" },
                { id: '5', name: "High Capacity Package Unit - Outdoor", image: "/Walk-inCooler&Freezer/combounits.jpg" }
              ].map((product) => (
                <Link
                  key={product.id}
                  href={`/refrigeration-equipment/${slug}/${product.id}`}
                  className="group bg-white border border-gray-200 rounded-sm p-2 overflow-hidden hover:-translate-y-1 transition-all duration-500 flex flex-col"
                >
                  {/* Image Area */}
                  <div className="border-b border-gray-200 w-full rounded-none bg-gray-50 overflow-hidden mb-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="size-full aspect-square object-contain transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  {/* Content Area */}
                  <div className="flex flex-col text-center items-center px-1 mt-2 flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2 tracking-tight group-hover:text-[#004a99] transition-colors line-clamp-2">
                      {product.name}
                    </h3>

                    <div className="flex items-center justify-center gap-1.5 mb-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00C853]"></div>
                      <span className="text-[9px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-widest">In Stock</span>
                    </div>

                    {/* Action Button */}
                    <div className="w-full mt-auto pb-1">
                      <div className="cursor-pointer w-full py-2.5 px-3 border-[1.5px] border-gray-200 rounded-sm flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] font-black text-[#0f172a] uppercase tracking-[0.2em] group-hover:border-[#004a99] group-hover:bg-[#004a99] group-hover:text-white transition-all duration-300 shadow-sm">
                        View Details
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
