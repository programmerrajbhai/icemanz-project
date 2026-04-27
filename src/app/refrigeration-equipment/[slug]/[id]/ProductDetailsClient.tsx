"use client";

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef } from 'react';
import {
  PhoneCall,
  FileText,
  FileDown,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize,
  ChevronUp,
  ChevronDown,
  CheckCircle2
} from 'lucide-react';

type ProductType = {
  id: string;
  title: string;
  slug: string;
  badge?: string | null;
  description?: string | null;
  keyFeatures?: string | null;
  condition?: string | null;
  type?: string | null;
  price?: string | null;
  images: string[];
  warranty: string[];
  detailedFeatures: string[];
  specs?: { label: string; value: string }[] | null;
  documents?: { name: string; url: string }[] | null;
  category?: { name: string; slug: string } | null;
};

type RelatedProduct = {
  id: string;
  title: string;
  images: string[];
  price?: string | null;
  category?: { slug: string } | null;
};

export default function ProductDetailsClient({
  product,
  relatedProducts,
  slug
}: {
  product: ProductType;
  relatedProducts: RelatedProduct[];
  slug: string;
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('features');
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

  const documents = (product.documents as { name: string; url: string }[] | null) || [];
  const specs = (product.specs as { label: string; value: string }[] | null) || [];

  // Determine which tabs to show
  const hasTabs = product.detailedFeatures.length > 0 || specs.length > 0 || product.description;

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="pt-32 pb-20 md:pt-44 md:pb-24">
        <div className="container px-4">

          <div className="grid lg:grid-cols-[100px_1fr_1fr] gap-4 items-start bg-white p-0">
            {/* Left: Product Gallery - Vertical Thumbnails */}
            {product.images.length > 0 ? (
              <div className="flex md:flex-col gap-2 w-full lg:col-span-1 h-auto max-h-[600px] overflow-x-auto md:overflow-y-auto no-scrollbar">
                {product.images.length > 1 && (
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
                )}

                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => { setActiveImageIndex(i); handleResetZoom(); }}
                    className={`cursor-pointer md:w-full md:aspect-square bg-white border rounded-sm overflow-hidden transition-all focus:outline-none p-1.5 relative ${i === activeImageIndex ? 'border-[#003d80]' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <Image
                      src={img}
                      alt={`View ${i + 1}`}
                      fill
                      className="object-contain p-1"
                      sizes="(max-width: 1024px) 80px, 100px"
                    />
                  </button>
                ))}

                {product.images.length > 1 && (
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
                )}
              </div>
            ) : (
              <div className="lg:col-span-1" />
            )}

            {/* Main Image View */}
            <div ref={imageContainerRef} className="flex-1 bg-white border h-[500px] border-gray-200 overflow-hidden aspect-square w-full flex items-center justify-center relative lg:col-span-1 rounded-sm">
              {/* Badge */}
              {product.badge && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="inline-flex items-center bg-green-100 text-green-700 px-3 py-1 text-xs font-bold rounded-sm">
                    {product.badge}
                  </span>
                </div>
              )}

              <div className="w-full h-full flex items-center justify-center overflow-hidden relative">
                {product.images.length > 0 ? (
                  <Image
                    src={product.images[activeImageIndex]}
                    alt={product.title}
                    fill
                    priority
                    style={{ transform: `scale(${zoomLevel})` }}
                    className="object-contain transition-transform duration-300 ease-out"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="text-gray-400 font-semibold text-lg">No Image</div>
                )}
              </div>

              {/* Image Controls */}
              {product.images.length > 0 && (
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center z-10">
                  <div className="flex items-center gap-2">
                    <button onClick={handleResetZoom} className="size-8 cursor-pointer bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-sm flex items-center justify-center transition-colors shadow-sm">
                      <RotateCcw size={14} />
                    </button>
                    <button onClick={handleZoomIn} className="size-8 bg-white cursor-pointer border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-sm flex items-center justify-center transition-colors shadow-sm">
                      <ZoomIn size={14} />
                    </button>
                    <button onClick={handleZoomOut} className="size-8 bg-white border cursor-pointer border-gray-200 hover:bg-gray-50 text-gray-600 rounded-sm flex items-center justify-center transition-colors shadow-sm">
                      <ZoomOut size={14} />
                    </button>
                  </div>
                  <button onClick={handleFullscreen} className="size-8 bg-white border cursor-pointer border-gray-200 hover:bg-gray-50 text-gray-600 rounded-sm flex items-center justify-center transition-colors shadow-sm">
                    <Maximize size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Right: Product Info */}
            <div className="flex flex-col lg:col-span-1 px-0 lg:pl-8">
              <div className="mb-8 mt-3">
                <h1 className="text-2xl md:text-3xl font-bold text-[#1f2937] tracking-tight">
                  {product.title}
                </h1>
                {product.price && (
                  <p className="text-xl font-bold text-[#004a99] mt-3">
                    {product.price.startsWith('$') ? product.price : `$${product.price}`}
                  </p>
                )}
              </div>

              <div className="space-y-8">
                {/* Key Features */}
                {product.keyFeatures && (
                  <div>
                    <h3 className="text-lg font-bold text-[#1f2937] mb-4">Key Features</h3>
                    <p className="text-gray-600 pl-4 text-[15px] leading-relaxed">
                      {product.keyFeatures}
                    </p>
                  </div>
                )}

                {/* Warranty */}
                {product.warranty.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-[#1f2937] mb-4">Warranty</h3>
                    <ul className="space-y-4 pl-4">
                      {product.warranty.map((item, i) => (
                        <li key={i} className="text-gray-600 text-[15px] leading-relaxed">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Documents */}
                {documents.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-[#1f2937] mb-4">Documents</h3>
                    <div className="flex flex-wrap gap-x-6 gap-y-4 pl-4">
                      {documents.map((doc, i) => (
                        <a
                          key={i}
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-3 text-[15px] font-semibold text-[#1f2937] hover:text-[#004a99] transition-colors"
                        >
                          <div className="size-9 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-400 transition-colors shadow-sm">
                            <FileDown size={18} strokeWidth={1.5} />
                          </div>
                          <span className="underline decoration-1 underline-offset-4 decoration-gray-300 hover:decoration-[#004a99]">
                            {doc.name}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Main Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 mb-14">
                <Link
                  href={`/request-invoice?productId=${product.id}`}
                  className="flex-1 py-4 px-6 inline-flex justify-center items-center gap-x-2 text-[15px] font-bold rounded-md border border-transparent bg-[#004a99] text-white hover:bg-blue-800 transition-colors shadow-sm"
                >
                  <FileText size={18} />
                  Request for Invoice
                </Link>
                <a
                  href="tel:929-451-7665"
                  className="flex-1 py-4 px-6 inline-flex justify-center items-center gap-x-2 text-[15px] font-bold rounded-md border border-gray-200 bg-white text-[#1f2937] hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <PhoneCall size={18} />
                  Call Specialist
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Tabs Section */}
          {hasTabs && (
            <div className="mt-16 bg-white border border-gray-200 rounded-sm">
              {/* Tab Headers */}
              <div className="flex flex-wrap justify-center border-b border-gray-200 px-4">
                {product.detailedFeatures.length > 0 && (
                  <button
                    onClick={() => setActiveTab('features')}
                    className="py-5 px-6 text-md font-semibold relative cursor-pointer"
                  >
                    Features
                    {activeTab === 'features' && (
                      <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#004a99]" />
                    )}
                  </button>
                )}

                {specs.length > 0 && (
                  <button
                    onClick={() => setActiveTab('additional_info')}
                    className="py-5 px-6 text-md font-semibold relative cursor-pointer"
                  >
                    Additional information
                    {activeTab === 'additional_info' && (
                      <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#004a99]" />
                    )}
                  </button>
                )}

                {product.description && (
                  <button
                    onClick={() => setActiveTab('description')}
                    className="py-5 px-6 text-md font-semibold relative cursor-pointer"
                  >
                    Description
                    {activeTab === 'description' && (
                      <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#004a99]" />
                    )}
                  </button>
                )}
              </div>

              {/* Tab Content */}
              <div className="p-8 md:p-12 max-w-6xl mx-auto">
                {activeTab === 'features' && product.detailedFeatures.length > 0 && (
                  <div className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-x-16 gap-y-10">
                      <div className="space-y-5">
                        {product.detailedFeatures
                          .slice(0, Math.ceil(product.detailedFeatures.length / 2))
                          .map((feature, idx) => (
                            <div key={`left-${idx}`} className="flex items-start gap-4">
                              <CheckCircle2 className="text-[#004a99] shrink-0 mt-0.5" size={22} strokeWidth={2} />
                              <p className="text-gray-600 text-[15px] leading-relaxed">{feature}</p>
                            </div>
                          ))}
                      </div>
                      <div className="space-y-5 mt-10 md:mt-0">
                        {product.detailedFeatures
                          .slice(Math.ceil(product.detailedFeatures.length / 2))
                          .map((feature, idx) => (
                            <div key={`right-${idx}`} className="flex items-start gap-4">
                              <CheckCircle2 className="text-[#004a99] shrink-0 mt-0.5" size={22} strokeWidth={2} />
                              <p className="text-gray-600 text-[15px] leading-relaxed">{feature}</p>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'additional_info' && specs.length > 0 && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-[#1f2937] tracking-tight mb-6">Specifications</h3>
                    <table className="w-full text-left text-sm text-gray-600 border border-gray-200">
                      <tbody>
                        {specs.map((spec, i) => (
                          <tr key={i} className="border-b border-gray-200">
                            <th className="py-3 px-4 font-semibold text-gray-800 bg-gray-50 w-1/3">{spec.label}</th>
                            <td className="py-3 px-4">{spec.value}</td>
                          </tr>
                        ))}
                        {product.warranty.length > 0 && (
                          <tr className="border-b border-gray-200">
                            <th className="py-3 px-4 font-semibold text-gray-800 bg-gray-50">Warranty</th>
                            <td className="py-3 px-4">
                              <ul className="list-disc pl-4 space-y-1">
                                {product.warranty.map((w, i) => <li key={i}>{w}</li>)}
                              </ul>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === 'description' && product.description && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-[#1f2937] tracking-tight mb-6">Product Description</h3>
                    <div className="text-gray-600 text-[15px] leading-relaxed whitespace-pre-line">
                      {product.description}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-12 md:mt-18 border-gray-100">
              <h2 className="text-xl md:text-2xl font-bold text-[#1f2937] tracking-tight mb-8">
                Related products
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6 mb-8">
                {relatedProducts.map((rp) => (
                  <Link
                    key={rp.id}
                    href={`/refrigeration-equipment/${rp.category?.slug || slug}/${rp.id}`}
                    className="group bg-white border border-gray-200 rounded-sm p-2 overflow-hidden hover:-translate-y-1 transition-all duration-500 flex flex-col"
                  >
                    <div className="border-b border-gray-200 w-full rounded-sm bg-gray-50 overflow-hidden mb-3">
                      {rp.images && rp.images[0] ? (
                        <img src={rp.images[0]} alt={rp.title} className="size-full aspect-square object-contain transition-transform duration-700 group-hover:scale-105" />
                      ) : (
                        <div className="aspect-square flex items-center justify-center text-gray-400 font-semibold bg-gray-100">No Image</div>
                      )}
                    </div>
                    <div className="flex flex-col text-center items-center px-1 mt-2 flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 mb-1 tracking-tight group-hover:text-[#004a99] transition-colors line-clamp-2">
                        {rp.title}
                      </h3>
                      {rp.price && (
                        <p className="text-sm font-bold text-[#004a99] mb-2">
                          {rp.price.startsWith('$') ? rp.price : `$${rp.price}`}
                        </p>
                      )}
                      <div className="flex items-center justify-center gap-1.5 mb-4">
                        <div className="w-1.5 h-1.5 rounded-sm bg-[#00C853]"></div>
                        <span className="text-[9px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-widest">In Stock</span>
                      </div>
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
          )}

        </div>
      </div>

      <Footer />
    </main>
  );
}
