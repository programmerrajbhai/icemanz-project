"use client";

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import {
  PhoneCall,
  FileText,
  Truck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ZoomIn,
  Minus,
  Plus,
  ShoppingCart,
  ArrowRight
} from 'lucide-react';

type ProductOption = {
  label: string;
  name: string;
  options: { label: string; price?: string }[];
};

type Product = {
  id: string;
  title: string;
  slug: string;
  price: string;
  images: string[];
  badge?: string;
  description?: string;
  keyFeatures?: string;
  condition?: string;
  type?: string;
  warranty?: string[];
  detailedFeatures?: string[];
  specs?: { label: string; value: string }[];
  documents?: { name: string; url: string }[];
  features?: {
    panels?: string[];
    doors?: string[];
    topMount?: string[];
    remote?: string[];
  };
  faqs?: { question: string; answer: string }[];
  productOptions?: ProductOption[];
};

type RelatedProduct = {
  id: string;
  title: string;
  images: string[];
  price?: string;
  category?: { slug: string } | null;
};

export default function WalkInCoolerProductClient({
  product,
  relatedProducts
}: {
  product: Product;
  relatedProducts: RelatedProduct[];
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showZoom, setShowZoom] = useState(false);

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions(prev => ({ ...prev, [optionName]: value }));
  };

  const basePrice = parseFloat(product.price.replace(/[^0-9.]/g, '')) || 0;

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="pt-32 pb-20 md:pt-40 md:pb-24 bg-white">
        <div className="container px-4 mx-auto">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-6">
            <Link href="/walk-in-cooler-freezer" className="hover:text-primary transition-colors">Walk-in Coolers</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800">{product.title}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left: Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div
                className="relative aspect-square bg-gray-50 border border-gray-200 rounded-sm overflow-hidden cursor-zoom-in"
                onClick={() => setShowZoom(true)}
              >
                {product.images[activeImageIndex] ? (
                  <Image
                    src={product.images[activeImageIndex]}
                    alt={product.title}
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                )}
                <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-sm border border-gray-200">
                  <ZoomIn size={16} className="text-gray-600" />
                  <span className="text-xs font-medium text-gray-600">Click to zoom</span>
                </div>
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-20 shrink-0 border-2 rounded-sm overflow-hidden transition-all ${
                        idx === activeImageIndex ? 'border-primary' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.title} ${idx + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Lead Time & Stock Info */}
              <div className="flex items-center gap-3 text-sm">
                <Truck size={18} className="text-[#004a99]" />
                <span className="text-gray-600">Usually Ships in 2 - 5 Days</span>
              </div>
            </div>

            {/* Right: Product Info */}
            <div className="flex flex-col">
              {/* Badge */}
              {product.badge && (
                <span className="inline-block bg-[#cc0000] text-white px-3 py-1 text-xs font-bold uppercase tracking-widest w-fit mb-3">
                  {product.badge}
                </span>
              )}

              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-3">
                {product.title}
              </h1>

              {/* Price */}
              <div className="mb-6">
                <p className="text-2xl font-bold text-[#004a99]">${product.price}</p>
              </div>

              {/* Key Features */}
              {product.keyFeatures && (
                <div className="mb-6 p-4 bg-gray-50 rounded-sm border border-gray-200">
                  <div className="flex items-start gap-2 mb-3">
                    <CheckCircle2 size={20} className="text-[#00C853] shrink-0 mt-0.5" />
                    <span className="text-sm font-semibold text-gray-800">Quick-Ship Program</span>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-[#00C853]" />
                      Ships within 48 hours
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-[#00C853]" />
                      NSF, UL, DOE compliant
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-[#00C853]" />
                      10-year panel warranty
                    </li>
                  </ul>
                </div>
              )}

              {/* Product Options */}
              {product.productOptions && product.productOptions.length > 0 && (
                <div className="space-y-4 mb-6">
                  {product.productOptions.map((option) => (
                    <div key={option.name}>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        {option.label} <span className="text-red-500">*</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {option.options.map((opt) => (
                          <button
                            key={opt.label}
                            onClick={() => handleOptionChange(option.name, opt.label)}
                            className={`px-4 py-2 text-sm border rounded-sm transition-all ${
                              selectedOptions[option.name] === opt.label
                                ? 'border-primary bg-primary text-white'
                                : 'border-gray-300 hover:border-primary'
                            }`}
                          >
                            {opt.label}
                            {opt.price && <span className="ml-2 text-xs opacity-80">{opt.price}</span>}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-800 mb-2">Quantity</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <button className="flex-1 py-4 px-6 bg-[#004a99] text-white font-bold rounded-sm hover:bg-blue-800 transition-colors flex items-center justify-center gap-2">
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>
                <Link
                  href={`/request-invoice?productId=${product.id}`}
                  className="flex-1 py-4 px-6 bg-white border border-gray-300 text-gray-800 font-bold rounded-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <FileText size={20} />
                  Request Quote
                </Link>
              </div>

              {/* Call Specialist */}
              <a
                href="tel:929-451-7665"
                className="flex items-center justify-center gap-2 py-3 text-sm font-semibold text-[#004a99] hover:text-blue-800 transition-colors mb-6"
              >
                <PhoneCall size={18} />
                Call a Specialist: 929-451-7665
              </a>

              {/* Payment Methods */}
              <div className="flex items-center justify-center gap-4 py-4 border-t border-b border-gray-200">
                <span className="text-xs text-gray-500 uppercase tracking-wider">Payment Methods:</span>
                <div className="flex items-center gap-3 text-gray-400">
                  <span className="text-sm font-medium">Visa</span>
                  <span className="text-sm font-medium">Mastercard</span>
                  <span className="text-sm font-medium">PayPal</span>
                  <span className="text-sm font-medium">Apple Pay</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Features Sections */}
          {product.features && (
            <div className="mt-16 grid md:grid-cols-2 gap-8">
              {product.features.panels && (
                <div className="bg-gray-50 rounded-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Panels</h3>
                  <ul className="space-y-2">
                    {product.features.panels.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 size={16} className="text-[#004a99] shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {product.features.doors && (
                <div className="bg-gray-50 rounded-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Doors</h3>
                  <ul className="space-y-2">
                    {product.features.doors.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 size={16} className="text-[#004a99] shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {product.features.topMount && (
                <div className="bg-gray-50 rounded-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Top Mount Refrigeration</h3>
                  <ul className="space-y-2">
                    {product.features.topMount.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 size={16} className="text-[#004a99] shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {product.features.remote && (
                <div className="bg-gray-50 rounded-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Remote Refrigeration</h3>
                  <ul className="space-y-2">
                    {product.features.remote.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 size={16} className="text-[#004a99] shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Detailed Features */}
          {product.detailedFeatures && product.detailedFeatures.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Features</h2>
              <div className="grid md:grid-cols-2 gap-x-16 gap-y-4">
                {product.detailedFeatures.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="text-[#004a99] shrink-0 mt-1" size={20} />
                    <span className="text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Specifications */}
          {product.specs && product.specs.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h2>
              <table className="w-full text-left text-sm border border-gray-200 rounded-sm overflow-hidden">
                <tbody>
                  {product.specs.map((spec, i) => (
                    <tr key={i} className={`border-b border-gray-200 ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                      <th className="py-3 px-4 font-semibold text-gray-800 w-1/3">{spec.label}</th>
                      <td className="py-3 px-4 text-gray-600">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Documents */}
          {product.documents && product.documents.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Documents</h2>
              <div className="flex flex-wrap gap-4">
                {product.documents.map((doc, i) => (
                  <a
                    key={i}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm text-sm font-semibold text-gray-700 hover:bg-gray-100 hover:border-gray-300 transition-all"
                  >
                    <FileText size={18} className="text-[#004a99]" />
                    {doc.name}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* FAQ Section */}
          {product.faqs && product.faqs.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {product.faqs.map((faq, i) => (
                  <div key={i} className="border border-gray-200 rounded-sm overflow-hidden">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-semibold text-gray-800">{faq.question}</span>
                      {expandedFaq === i ? (
                        <ChevronUp size={20} className="text-gray-500 shrink-0" />
                      ) : (
                        <ChevronDown size={20} className="text-gray-500 shrink-0" />
                      )}
                    </button>
                    {expandedFaq === i && (
                      <div className="p-4 bg-gray-50 border-t border-gray-200">
                        <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedProducts.map((rp) => (
                  <Link
                    key={rp.id}
                    href={`/walk-in-cooler-freezer/all/${rp.id}`}
                    className="group bg-white border border-gray-200 rounded-sm p-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="relative aspect-square bg-gray-50 rounded-sm overflow-hidden mb-3">
                      {rp.images[0] ? (
                        <Image
                          src={rp.images[0]}
                          alt={rp.title}
                          fill
                          className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 text-xs">No Image</div>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-gray-800 group-hover:text-primary transition-colors line-clamp-2 mb-2">
                      {rp.title}
                    </h3>
                    {rp.price && (
                      <p className="text-sm font-bold text-[#004a99]">${rp.price}</p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />

      {/* Zoom Modal */}
      {showZoom && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center cursor-zoom-out"
          onClick={() => setShowZoom(false)}
        >
          <div className="relative w-full h-full max-w-4xl max-h-4xl p-4">
            <Image
              src={product.images[activeImageIndex]}
              alt={product.title}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
          <button
            onClick={() => setShowZoom(false)}
            className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-800 hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>
      )}
    </main>
  );
}
