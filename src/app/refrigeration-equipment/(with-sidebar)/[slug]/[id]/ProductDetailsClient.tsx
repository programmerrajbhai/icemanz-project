"use client";

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState, useRef } from 'react';
import {
  PhoneCall,
  FileText,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Minus,
  Plus,
  Facebook,
  Twitter,
  Mail,
  Info,
  Truck,
  ArrowRight,
  Share2,
  Star,
  ShieldCheck,
  CreditCard,
  ShoppingCart
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

function extractProductInfo(text: string | null | undefined) {
  if (!text) return null;
  const hpMatch = text.match(/(\d+(?:\.\d+)?)\s*HP/i);
  const tempMatch = text.match(/(Medium|Low)(?:\s+Temperature)?/i);
  if (hpMatch) {
    const hp = hpMatch[1];
    const temp = tempMatch ? `${tempMatch[1]} Temp` : 'Medium Temp';
    return `${hp} HP, ${temp}`;
  }
  const btuMatch = text.match(/([\d,]+)\s*BTU/i);
  if (btuMatch) {
    const btu = btuMatch[1].replace(/,/g, '');
    const formattedBtu = btu.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `${formattedBtu} BTU`;
  }
  return null;
}

type ProductType = {
  id: string;
  title: string;
  slug: string;
  brand?: string | null;
  sku?: string | null;
  badge?: string | null;
  description?: string | null;
  keyFeatures?: string | null;
  condition?: string | null;
  type?: string | null;
  price?: string | null;
  images: string[];
  warranty?: string[];
  detailedFeatures?: string[];
  specs?: { label: string; value: string }[] | null;
  documents?: { name: string; url: string }[] | null;
  category?: { name: string; slug: string } | null;
  faqs?: { question: string; answer: string }[];
};

type RelatedProduct = {
  id: string;
  title: string;
  images: string[];
  price?: string | null;
  category?: { slug: string } | null;
  slug?: string;
  brand?: string | null;
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
  const { addToCart } = useCart();
  const router = useRouter();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [containerSize, setContainerSize] = useState({ width: 600, height: 600 });
  const [isHovering, setIsHovering] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    description: true,
    faqs: true
  });

  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const cleanPrice = (priceStr: string | null | undefined) => {
    if (!priceStr) return '0.00';
    const num = parseFloat(String(priceStr).replace(/[^0-9.]/g, ''));
    return isNaN(num) ? '0.00' : num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formattedInfo = extractProductInfo(product.keyFeatures) || extractProductInfo(product.description) || null;
  const productImages = product.images && product.images.length > 0 ? product.images : ['/placeholder.png'];
  const documents = product.documents || [];
  const detailedFeatures = product.detailedFeatures || [];

  const defaultFaqs = [
    {
      q: 'What is refrigeration equipment used for?',
      a: 'Refrigeration equipment such as condensing units and evaporators are designed to maintain required cold temperatures for walk-in coolers, freezers, and commercial display cases.'
    },
    {
      q: 'How do I choose the right unit capacity?',
      a: 'Unit capacity depends on your box volume (cubic feet), target temperature (cooler vs freezer), ambient temperature, and usage level. Contact our specialists for custom calculations.'
    },
    {
      q: 'What warranty is included?',
      a: 'Our refrigeration units come with standard manufacturer warranties covering compressors and components. Additional extended warranty options may be available.'
    },
    {
      q: 'How do I maintain condensing and evaporation units?',
      a: 'Clean condenser coils quarterly, ensure proper airflow around external units, check door gaskets regularly, and inspect refrigerant levels during annual maintenance.'
    }
  ];

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="pt-32 pb-20 md:pt-40 md:pb-24 bg-white transition-all duration-300">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column: Product Gallery & Description / FAQ Accordions */}
            <div className="w-full lg:w-[60%] flex flex-col">
              {/* Product Featured Image & Thumbnails */}
              <div className="grid grid-cols-[80px_1fr] border border-gray-200 pl-4 pt-4 gap-4">
                {/* Left: Vertical Thumbnails */}
                <div className="flex flex-col gap-2">
                  {productImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImageIndex(i)}
                      className={`cursor-pointer w-full aspect-square bg-white border rounded-sm overflow-hidden transition-all focus:outline-none p-1 relative ${i === activeImageIndex ? 'border-[#003d80]' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <Image
                        src={img}
                        alt={`View ${i + 1}`}
                        fill
                        className="object-contain p-1"
                        sizes="80px"
                      />
                    </button>
                  ))}
                </div>

                {/* Main Image View with Zoom */}
                <div className="flex items-center justify-center bg-white rounded-sm relative">
                  <div
                    className="relative w-full h-[600px] cursor-crosshair overflow-hidden"
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setMousePosition({
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top
                      });
                      setContainerSize({
                        width: rect.width,
                        height: rect.height
                      });
                    }}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    <Image
                      src={productImages[activeImageIndex]}
                      alt={product.title}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 60vw"
                    />

                    {/* Square Zoom Lens */}
                    {isHovering && (
                      <div
                        className="absolute border border-blue-500 bg-white/30 pointer-events-none z-20"
                        style={{
                          left: Math.max(0, Math.min(mousePosition.x - 100, containerSize.width - 200)),
                          top: Math.max(0, Math.min(mousePosition.y - 100, containerSize.height - 200)),
                          width: '200px',
                          height: '200px',
                        }}
                      />
                    )}
                  </div>

                  {/* Zoom Preview Panel */}
                  {isHovering && (
                    <div
                      className="hidden lg:block absolute top-0 left-full ml-4 z-50 bg-white border border-gray-200 shadow-2xl pointer-events-none"
                      style={{
                        width: '500px',
                        height: '500px',
                        backgroundImage: `url(${productImages[activeImageIndex]})`,
                        backgroundPosition: `${(mousePosition.x / containerSize.width) * 100}% ${(mousePosition.y / containerSize.height) * 100}%`,
                        backgroundSize: `${containerSize.width * 2.5}px ${containerSize.height * 2.5}px`,
                        backgroundRepeat: 'no-repeat'
                      }}
                    />
                  )}
                </div>
              </div>

              <div>
                {/* Description Section Accordion */}
                <section className="bg-white p-8 mt-4 border border-gray-200">
                  <button
                    onClick={() => toggleSection('description')}
                    className="w-full flex items-center cursor-pointer justify-between mb-6 text-left"
                  >
                    <h2 className="text-xl font-bold text-gray-900">Description</h2>
                    {expandedSections.description ? (
                      <Minus size={24} className="text-gray-900" />
                    ) : (
                      <Plus size={24} className="text-gray-900" />
                    )}
                  </button>

                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedSections.description ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="space-y-4">
                      {product.description && (
                        <p className="text-sm text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: product.description }} />
                      )}

                      {detailedFeatures.length > 0 && (
                        <div>
                          <h3 className="text-sm font-bold text-gray-900 mb-3">Features:</h3>
                          <ul className="space-y-2">
                            {detailedFeatures.map((feature, idx) => (
                              <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                                <span className="mt-2 size-1.5 rounded-full bg-gray-800 shrink-0"></span>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {documents.length > 0 && (
                        <div>
                          {documents.map((doc, idx) => {
                            if (doc.name === 'Spec Sheet') {
                              return (
                                <div key={idx} className="mt-6">
                                  <h3 className="text-sm font-bold text-gray-900 mb-4">{doc.name}</h3>
                                  <a href={doc.url} target="_blank" rel="noopener noreferrer" className="inline-block">
                                    <img
                                      src="/Walk-in-Cooler-Freezer/details/pdf_0eefef7d-35a5-4bb1-a400-2ec5f4f2f437_480x480.avif"
                                      alt="Download PDF"
                                      className="h-12 object-contain"
                                    />
                                  </a>
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </section>

                {/* FAQ Section Accordion */}
                <section className="bg-white p-8 mt-4 border border-gray-200">
                  <button
                    onClick={() => toggleSection('faqs')}
                    className="w-full flex items-center cursor-pointer justify-between mb-8 text-left"
                  >
                    <h2 className="text-xl font-bold text-gray-900">FAQ's</h2>
                    {expandedSections.faqs ? (
                      <Minus size={24} className="text-gray-900" />
                    ) : (
                      <Plus size={24} className="text-gray-900" />
                    )}
                  </button>

                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedSections.faqs ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <h3 className="text-lg font-bold text-gray-900 text-center mb-6">
                      Refrigeration Equipment
                    </h3>
                    <div className="border border-gray-200 rounded-md overflow-hidden bg-white">
                      {defaultFaqs.map((item, index) => (
                        <div
                          key={index}
                          className="border-b border-gray-200 last:border-b-0"
                        >
                          <button
                            onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                            className="w-full text-left cursor-pointer p-4 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors"
                          >
                            <span className="font-bold text-sm text-gray-900 pr-4">
                              {item.q}
                            </span>
                            {openFaqIndex === index ? (
                              <Minus size={16} className="text-gray-500 shrink-0" />
                            ) : (
                              <Plus size={16} className="text-gray-500 shrink-0" />
                            )}
                          </button>
                          <div
                            className={`bg-white overflow-hidden transition-all duration-300 ease-in-out ${openFaqIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                          >
                            <div className="p-4 border-t border-gray-100">
                              <p className="text-sm text-gray-600 leading-relaxed">
                                {item.a}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              </div>
            </div>

            {/* Right Column: Product Info & Actions Panel */}
            <div className="w-full lg:w-[35%] border border-gray-200 bg-white lg:sticky lg:top-24 self-start p-4 flex flex-col gap-6">
              {/* Title */}
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                {product.title}
              </h1>

              {/* Brand, SKU & Social Share */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs font-medium uppercase tracking-wider">
                  <span className="text-black">{product.brand || product.title.split(' ')[0] || 'ICEMANZ'}</span>
                  <span className="text-gray-300">|</span>
                  <span className="text-black">SKU: {product.sku || product.id.substring(0, 8).toUpperCase()}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Facebook size={18} className="text-gray-400 cursor-pointer hover:text-blue-600" />
                  <Twitter size={18} className="text-gray-400 cursor-pointer hover:text-blue-400" />
                  <Mail size={18} className="text-gray-400 cursor-pointer hover:text-red-500" />
                </div>
              </div>

              {/* Service Badges */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 bg-[#e7f3ff] border border-[#73a6ff] px-4 py-2 rounded-md">
                  <CheckCircle2 size={16} className="text-green-600" />
                  <p className="text-sm font-semibold text-blue-800">
                    Price Match - Call Us For Best Price!
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-[#e7f3ff] border border-[#73a6ff] px-4 py-2 rounded-md">
                  <Info size={16} className="text-blue-600" />
                  <p className="text-sm font-semibold text-blue-800">
                    Need a Custom Size? - Contact Us
                  </p>
                </div>
              </div>

              {/* Price Section */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl font-bold text-[#003366]">${cleanPrice(product.price)}</span>
                  <span className="text-lg font-normal text-gray-500">/ Ea.</span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-gray-800 uppercase">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <Minus size={18} />
                  </button>
                  <div className="w-12 h-10 flex items-center justify-center border-x border-gray-300 text-base font-semibold">
                    {quantity}
                  </div>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* Action Button */}
              <div>
                <button
                  onClick={() => {
                    addToCart({
                      id: product.id,
                      name: product.title,
                      title: product.title,
                      price: cleanPrice(product.price),
                      image: productImages[0] || '/placeholder.png',
                      quantity: quantity,
                      category: 'refrigeration-equipment'
                    });
                    router.push('/cart');
                  }}
                  className="bg-[#cc3300] w-full cursor-pointer text-white py-3 px-4 font-semibold rounded-sm hover:bg-[#b32d00] transition-colors tracking-wider text-sm"
                >
                  Add to Cart
                </button>
              </div>

              {/* Product Attachments */}
              {documents.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-gray-900">Product Attachments</h3>
                  {documents
                    .filter(doc => doc.name !== 'Spec Sheet')
                    .map((doc, idx) => (
                      <a key={idx} href={doc.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-all shadow-sm">
                        <div className="size-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                          <FileText size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                        </div>
                      </a>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Full-Width Sections: Google Reviews */}
          <div className="w-full flex flex-col gap-8">
            <section className="bg-white p-8 mt-4">
              <h2 className="text-xl font-bold underline underline-offset-4 underline-yellow text-gray-900 text-center mb-8">
                GOOGLE REVIEWS
              </h2>
              <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {[
                    {
                      name: "tysheantis walker",
                      date: "Aug 5, 2025",
                      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
                    },
                    {
                      name: "Alisha Finney",
                      date: "Aug 3, 2025",
                      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
                    },
                    {
                      name: "Clarence Calhoun",
                      date: "Jul 31, 2025",
                      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
                    },
                    {
                      name: "Shee Kay",
                      date: "Jul 28, 2025",
                      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
                    }
                  ].map((review, index) => (
                    <div key={index} className="w-64 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full overflow-hidden">
                            <Image
                              src={review.avatar}
                              alt={review.name}
                              width={32}
                              height={32}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{review.name}</p>
                            <p className="text-xs text-gray-500">{review.date}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-0.5 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} size={14} className="fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
