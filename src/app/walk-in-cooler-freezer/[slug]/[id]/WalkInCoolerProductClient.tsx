"use client";

import Header from '@/components/Header';
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
  CreditCard
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import StandardFeatures from '@/components/StandardFeatures';

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
  brand?: string;
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
  slug?: string;
  brand?: string;
};

export default function WalkInCoolerProductClient({
  product,
  relatedProducts
}: {
  product: Product;
  relatedProducts: RelatedProduct[];
}) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showZoom, setShowZoom] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [containerSize, setContainerSize] = useState({ width: 600, height: 600 });
  const [isHovering, setIsHovering] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    refrigeration: false,
    payment: true,
    additional: true,
    faqs: true,
    warranty: false,
    description: true
  });
  const [activeTab, setActiveTab] = useState<string>('spec-sheet');

  const relatedProductsSliderRef = useRef<HTMLDivElement>(null);
  const recentlyViewedSliderRef = useRef<HTMLDivElement>(null);
  const googleReviewsSliderRef = useRef<HTMLDivElement>(null);

  const scrollRelatedProducts = (direction: 'left' | 'right') => {
    if (relatedProductsSliderRef.current) {
      const scrollAmount = 240; // Approx card width
      relatedProductsSliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const scrollRecentlyViewed = (direction: 'left' | 'right') => {
    if (recentlyViewedSliderRef.current) {
      const scrollAmount = 240; // Approx card width
      recentlyViewedSliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const scrollGoogleReviews = (direction: 'left' | 'right') => {
    if (googleReviewsSliderRef.current) {
      const scrollAmount = 280;
      googleReviewsSliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions(prev => ({ ...prev, [optionName]: value }));
  };

  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const panelFeatures = product.features?.panels ?? [
    '4" thick bonded panels with foamed-in-place insulation',
    'Tongue-and-groove panel locking assembly',
    'NSF approved embossed stucco finish',
    'Made in USA'
  ];

  const doorFeatures = product.features?.doors ?? [
    'Heavy-duty flush-mounted door with spring-loaded hinges',
    'Self-closing cam-lift hinges and positive latch',
    'Magnetic gasket for superior seal'
  ];

  const topMountFeatures = product.features?.topMount ?? [
    'Factory installed indoor condensing unit',
    'Digital temperature control with automatic defrost',
    'R-448A refrigerant and pre-charged lines'
  ];

  const remoteFeatures = product.features?.remote ?? [
    'Outdoor ready remote condensing option',
    'Long line-set flexibility for difficult installs',
    'Optional low ambient controls available'
  ];

  const faqItems = product.faqs?.length
    ? product.faqs
    : [
      { question: 'What is a walk-in cooler or freezer?', answer: 'A walk-in cooler or freezer is an enclosed, refrigerated storage space used primarily in commercial settings to store perishable goods at safe temperatures.' },
      { question: 'What sizes are available for walk-in coolers?', answer: 'Walk-in coolers are available in a variety of standard sizes starting from 5\'x5\', and can also be custom-built to fit specific layout requirements.' },
      { question: 'What are the benefits of a walk-in cooler?', answer: 'Benefits include large storage capacity, customizable shelving, reliable temperature control, and the ability to buy and store inventory in bulk.' },
      { question: 'How do I maintain a walk-in cooler?', answer: 'Regular maintenance involves cleaning the condenser coils, checking door seals, monitoring temperature settings, and scheduling annual professional inspections.' },
      { question: 'Are walk-in coolers energy-efficient?', answer: 'Yes, modern walk-in coolers are designed with high-density insulation and energy-efficient refrigeration systems to minimize power consumption.' }
    ];

  const cleanPrice = (priceStr: string) => {
    const num = parseFloat(String(priceStr).replace(/[^0-9.]/g, ''));
    return isNaN(num) ? '0.00' : num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="pt-24 sm:pt-32 lg:pt-40 pb-12 sm:pb-20 md:pb-24 bg-white transition-all duration-300">
        <div className="container px-3 sm:px-4 mx-auto">
          {/* Breadcrumb */}
          {/* <nav className="text-xs text-gray-500 mb-6">
            <Link href="#" className="hover:text-primary transition-colors">Walk-in Coolers</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800">{product.title}</span>
          </nav> */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Gallery (Order 1 on mobile, Col 1-7 on desktop) */}
            <div className="col-span-1 lg:col-span-7 order-1 flex flex-col">
              {/* products featured image */}
              <div className="flex flex-col-reverse sm:grid sm:grid-cols-[70px_1fr] md:grid-cols-[80px_1fr] border border-gray-200 p-3 sm:p-4 gap-3 sm:gap-4 rounded-sm">
                {/* Left/Bottom: Thumbnails */}
                <div className="flex flex-row sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto pb-1 sm:pb-0 max-h-[90px] sm:max-h-[500px] md:max-h-[600px]">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImageIndex(i)}
                      className={`cursor-pointer shrink-0 w-14 h-14 sm:w-full sm:h-auto sm:aspect-square bg-white border rounded-sm overflow-hidden transition-all focus:outline-none p-1 relative ${i === activeImageIndex ? 'border-[#003d80] ring-1 ring-[#003d80]' : 'border-gray-200 hover:border-gray-300'}`}
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

                {/* Main Image */}
                <div className="flex items-center justify-center bg-white rounded-sm relative w-full">
                  <div
                    className="relative w-full h-[280px] xs:h-[340px] sm:h-[420px] md:h-[500px] lg:h-[600px] cursor-crosshair overflow-hidden"
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
                      src={product.images[activeImageIndex]}
                      alt={product.title}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 60vw"
                      priority
                    />

                    {/* Square Zoom Lens */}
                    {isHovering && (
                      <div
                        className="hidden md:block absolute border border-blue-500 bg-white/30 pointer-events-none z-20"
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
                        backgroundImage: `url(${product.images[activeImageIndex]})`,
                        backgroundPosition: `${(mousePosition.x / containerSize.width) * 100}% ${(mousePosition.y / containerSize.height) * 100}%`,
                        backgroundSize: `${containerSize.width * 2.5}px ${containerSize.height * 2.5}px`,
                        backgroundRepeat: 'no-repeat'
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Product Info (Order 2 on mobile, Col 8-12 Sticky on desktop) */}
            <div className="col-span-1 lg:col-span-5 order-2 lg:row-span-2 border border-gray-200 bg-white lg:sticky lg:top-24 self-start p-4 sm:p-6 flex flex-col gap-6 rounded-sm">
              {/* Title */}
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                {product.title}
              </h1>
              {/* Brand, SKU & Social Share */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs  font-medium uppercase tracking-wider">
                  <span className="text-black ">{product.brand || 'AMERIKOOLER'}</span>
                  <span className="text-gray-300">|</span>
                  <span className=" text-black">SKU: {product.id.substring(0, 8).toUpperCase()}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Facebook size={18} className="text-gray-400" />
                  <Twitter size={18} className="text-gray-400" />
                  <Mail size={18} className="text-gray-400" />
                </div>
              </div>

              {/* Service Badges */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 bg-[#e7f3ff] border border-[#73a6ff] px-4 py-2 rounded-md">
                  <CheckCircle2 size={16} className="text-green-600" />
                  <p className="text-sm font-semibold text-blue-800">
                    Price Match - Call Us For Best Pricel
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-[#e7f3ff] border border-[#73a6ff] px-4 py-2 rounded-md">
                  <Info size={16} className="text-blue-600" />
                  <p className="text-sm font-semibold text-blue-800">
                    Need a Custom Size? - Contact Us
                  </p>
                </div>
              </div>

              {/* Product Options */}
              <div className="space-y-5">
                {/* Dynamic Options from Product Options */}
                {product.productOptions && product.productOptions.length > 0 ? (
                  product.productOptions.map((option: any, idx: number) => {
                    const selectedValue = selectedOptions[option.name] || option.options[0]?.label;
                    return (
                      <div key={idx}>
                        <label className="text-sm font-bold text-gray-900 mb-2 block">
                          {option.label}: {selectedValue}
                        </label>
                        <select
                          value={selectedValue}
                          onChange={(e) => handleOptionChange(option.name, e.target.value)}
                          className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm text-gray-800 font-medium cursor-pointer"
                        >
                          {option.options.map((opt: any, vIdx: number) => (
                            <option key={vIdx} value={opt.label}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  })
                ) : (
                  <>
                    {/* Default Options if no dynamic options available */}
                    <div>
                      <label className="text-sm font-bold text-gray-900 mb-2 block">Door Hinge: Left Hinged Door</label>
                      <select className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm text-gray-800 font-medium cursor-pointer">
                        <option>Left Hinged Door</option>
                        <option>Right Hinged Door</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-bold text-gray-900 mb-2 block">Door Width: 30" Wide Door</label>
                      <select className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm text-gray-800 font-medium cursor-pointer">
                        <option>30" Wide Door</option>
                        <option>36" Wide Door</option>
                      </select>
                    </div>
                  </>
                )}
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
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <Minus size={18} />
                  </button>
                  <div className="w-12 h-10 flex items-center justify-center border-x border-gray-300 text-base font-semibold">
                    {quantity}
                  </div>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div>
                <button
                  onClick={() => {
                    addToCart({
                      id: product.id,
                      name: product.title,
                      brand: product.brand || 'ICEMANZ',
                      price: product.price,
                      image: product.images[0] || '/placeholder.png',
                      quantity: quantity,
                      category: 'walk-in-cooler-freezer'
                    });
                    router.push('/cart');
                  }}
                  className="bg-[#cc3300] w-full cursor-pointer text-white py-3 px-4 font-semibold rounded-sm hover:bg-[#b32d00] transition-colors tracking-wider text-sm"
                >
                  Add to Cart
                </button>
              </div>

              {/* Product Attachments */}
              {product.documents && product.documents.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-gray-900">Product Attachments</h3>
                  {product.documents
                    .filter(doc => doc.name !== 'Spec Sheet')
                    .map((doc, idx) => (
                      <a key={idx} href={doc.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-all shadow-sm">
                        <div className="size-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                          <FileText size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                          {doc.name === 'Warranty' && <p className="text-xs text-gray-500">(2.99 MB)</p>}
                          {doc.name === 'About Amerikooler' && <p className="text-xs text-gray-500">(182.99 KB)</p>}
                          {doc.name === 'California 65 Statement' && <p className="text-xs text-gray-500">(53.2 KB)</p>}
                        </div>
                      </a>
                    ))}
                </div>
              )}
            </div>

            {/* Description & FAQ (Order 3 on mobile, Col 1-7 on desktop below Gallery) */}
            <div className="col-span-1 lg:col-span-7 order-3 flex flex-col gap-4">
              {/* description */}
              <section className="bg-white p-4 sm:p-6 md:p-8 border border-gray-200 rounded-sm">
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
                    <p className="text-sm text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: product.description || '' }} />

                    {product.detailedFeatures && product.detailedFeatures.length > 0 && (
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 mb-3">Features:</h3>
                        <ul className="space-y-2">
                          {product.detailedFeatures.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                              <span className="mt-2 size-1.5 rounded-full bg-gray-800 shrink-0"></span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {product.documents && product.documents.length > 0 && (
                      (() => {
                        const specSheet = product.documents.find(doc => doc.name === 'Spec Sheet');
                        if (!specSheet) return null;
                        return (
                          <div className="mt-6">
                            <h3 className="text-sm font-bold text-gray-900 mb-4">Spec Sheet</h3>
                            <a href={specSheet.url} target="_blank" rel="noopener noreferrer" className="inline-block">
                              <img
                                src="/Walk-in-Cooler-Freezer/details/pdf_0eefef7d-35a5-4bb1-a400-2ec5f4f2f437_480x480.avif"
                                alt="Download PDF"
                                className="h-12 object-contain"
                              />
                            </a>
                          </div>
                        );
                      })()
                    )}
                  </div>
                </div>
              </section>

              {/* FAQ Section */}
              <section className="bg-white p-4 sm:p-6 md:p-8 border border-gray-200 rounded-sm">
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
                    Walk-In Coolers and Freezers
                  </h3>
                  <div className="border border-gray-200 rounded-md overflow-hidden bg-white">
                    {[
                      {
                        q: 'What is a walk-in cooler or freezer?',
                        a: 'A walk-in cooler or freezer is a large, refrigerated room designed to store perishable items like food or beverages at consistent temperatures. They are commonly used in restaurants, supermarkets, and warehouses.'
                      },
                      {
                        q: 'What sizes are available for walk-in coolers?',
                        a: "Walk-in coolers come in various sizes, ranging from compact units for small kitchens to large-scale units for warehouses. Common sizes include 5'x6', 6'x8', and 10'x12'. Custom sizes are also available."
                      },
                      {
                        q: 'What are the benefits of a walk-in cooler?',
                        a: 'Walk-in coolers help maintain consistent temperatures, reduce food spoilage, and provide ample storage for bulk goods. They also improve operational efficiency in commercial kitchens.'
                      },
                      {
                        q: 'How do I maintain a walk-in cooler?',
                        a: 'Regular maintenance includes cleaning the condenser coils, checking door seals, and monitoring temperature settings. Proper upkeep extends the lifespan and efficiency of your unit.'
                      },
                      {
                        q: 'Are walk-in coolers energy-efficient?',
                        a: 'Modern walk-in coolers are designed with energy-efficient components, such as insulated panels and energy-saving compressors, to reduce operating costs.'
                      }
                    ].map((item, index) => (
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
                          className={`bg-white overflow-hidden transition-all duration-300 ease-in-out ${openFaqIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                            }`}
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

          {/* Bottom Full-Width Sections */}
          <div className="w-full flex flex-col gap-8">
            {/* Google Reviews Section */}
            <section className="bg-white p-4 sm:p-6 md:p-8 mt-4 border border-gray-200 rounded-sm">
              <h2 className="text-xl font-bold underline underline-offset-4 underline-yellow text-gray-900 text-center mb-8">
                GOOGLE REVIEWS
              </h2>
              <div className="relative">
                {/* Left Slider Button */}
                <button
                  onClick={() => scrollGoogleReviews('left')}
                  className="hidden sm:flex absolute -left-3 sm:-left-5 top-1/2 cursor-pointer -translate-y-1/2 w-10 h-10 bg-[#b3b3b3] rounded-full items-center justify-center text-white shadow-md z-10 hover:bg-gray-400 transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>

                {/* Slider Container */}
                <div
                  ref={googleReviewsSliderRef}
                  className="flex gap-4 overflow-x-auto snap-x scroll-smooth pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                >
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
                    <div key={index} className="flex-shrink-0 w-[85%] sm:w-[260px] md:w-[calc(25%-12px)] p-4 bg-gray-50 border border-gray-200 rounded-lg snap-start">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                          <Image
                            src={review.avatar}
                            alt={review.name}
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{review.name}</p>
                          <p className="text-xs text-gray-500">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className="text-[#ffc107] text-sm">★</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right Slider Button */}
                <button
                  onClick={() => scrollGoogleReviews('right')}
                  className="hidden sm:flex absolute -right-3 sm:-right-5 top-1/2 cursor-pointer -translate-y-1/2 w-10 h-10 bg-[#b3b3b3] rounded-full items-center justify-center text-white shadow-md z-10 hover:bg-gray-400 transition-colors"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </section>
            {/* Standard Features Section */}


            {relatedProducts.length > 0 && (
              <section className="py-4">
                <h2 className="text-xl font-bold text-gray-900 mb-6">More Walk-In Options!</h2>
                <div className="relative">
                  <button
                    onClick={() => scrollRelatedProducts('left')}
                    className="hidden sm:flex absolute -left-3 sm:-left-5 top-1/2 cursor-pointer -translate-y-1/2 w-10 h-10 bg-[#b3b3b3] rounded-full items-center justify-center text-white shadow-md z-10 hover:bg-gray-400 transition-colors"
                  >
                    <ChevronLeft size={24} />
                  </button>

                  <div
                    ref={relatedProductsSliderRef}
                    className="flex overflow-x-auto snap-x scroll-smooth shadow-sm [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] border border-gray-100"
                  >
                    {relatedProducts.map((relatedProduct) => (
                      <Link
                        key={relatedProduct.id}
                        href={`/walk-in-cooler-freezer/${relatedProduct.slug || relatedProduct.category?.slug || 'product'}/${relatedProduct.id}`}
                        className="flex-shrink-0 w-[240px] md:w-[220px] lg:w-[calc(100%/6)] bg-white border-r border-gray-100 last:border-r-0 hover:shadow-md transition-shadow snap-start flex flex-col"
                      >
                        <div className="relative aspect-square p-4 bg-white">
                          <Image
                            src={relatedProduct.images?.[0] || '/placeholder.png'}
                            alt={relatedProduct.title}
                            fill
                            className="object-contain p-4"
                          />
                        </div>
                        <div className="p-4 flex-1 flex flex-col text-left">
                          <p className="text-[10px] font-bold text-gray-800 uppercase mb-2 text-center tracking-wider">
                            {relatedProduct.brand || 'AMERIKOOLER'}
                          </p>
                          <p className="text-xs text-gray-800 line-clamp-2 mb-3 leading-relaxed h-[36px]">
                            {relatedProduct.title}
                          </p>
                          <div className="mt-auto text-center">
                            <p className="text-sm font-bold text-[#003366]">
                              ${cleanPrice(relatedProduct.price || '')} <span className="text-xs font-normal text-gray-500">/ Ea.</span>
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <button
                    onClick={() => scrollRelatedProducts('right')}
                    className="hidden sm:flex absolute -right-3 sm:-right-5 top-1/2 cursor-pointer -translate-y-1/2 w-10 h-10 bg-[#b3b3b3] rounded-full items-center justify-center text-white shadow-md z-10 hover:bg-gray-400 transition-colors"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              </section>
            )}

            <StandardFeatures />
            {/* Recently Viewed Section */}
            {relatedProducts.length > 0 && (
              <section className="py-4">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Recently viewed</h2>
                <div className="relative">
                  {/* Left Slider Button */}
                  <button
                    onClick={() => scrollRecentlyViewed('left')}
                    className="hidden sm:flex absolute -left-3 sm:-left-5 top-1/2 cursor-pointer -translate-y-1/2 w-10 h-10 bg-[#b3b3b3] rounded-full items-center justify-center text-white shadow-md z-10 hover:bg-gray-400 transition-colors"
                  >
                    <ChevronLeft size={24} />
                  </button>

                  {/* Slider Container */}
                  <div
                    ref={recentlyViewedSliderRef}
                    className="flex overflow-x-auto snap-x scroll-smooth shadow-sm [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] border border-gray-100"
                  >
                    {/* Reversing the relatedProducts array to simulate recently viewed items */}
                    {[...relatedProducts].reverse().map((viewedProduct) => (
                      <Link
                        key={`recent-${viewedProduct.id}`}
                        href={`/walk-in-cooler-freezer/${viewedProduct.slug || viewedProduct.category?.slug || 'product'}/${viewedProduct.id}`}
                        className="flex-shrink-0 w-[240px] md:w-[220px] lg:w-[calc(100%/6)] bg-white border-r border-gray-100 last:border-r-0 hover:shadow-md transition-shadow snap-start flex flex-col"
                      >
                        <div className="relative aspect-square p-4 bg-white">
                          <Image
                            src={viewedProduct.images?.[0] || '/placeholder.png'}
                            alt={viewedProduct.title}
                            fill
                            className="object-contain p-4"
                          />
                        </div>
                        <div className="p-4 flex-1 flex flex-col text-left">
                          <p className="text-[10px] font-bold text-gray-800 uppercase mb-2 text-center tracking-wider">
                            {viewedProduct.brand || 'AMERIKOOLER'}
                          </p>
                          <p className="text-xs text-gray-800 line-clamp-2 mb-3 leading-relaxed h-[36px]">
                            {viewedProduct.title}
                          </p>
                          <div className="mt-auto text-center">
                            <p className="text-sm font-bold text-[#003366]">
                              ${cleanPrice(viewedProduct.price || '')} <span className="text-xs font-normal text-gray-500">/ Ea.</span>
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Right Slider Button */}
                  <button
                    onClick={() => scrollRecentlyViewed('right')}
                    className="hidden sm:flex absolute -right-3 sm:-right-5 top-1/2 cursor-pointer -translate-y-1/2 w-10 h-10 bg-[#b3b3b3] rounded-full items-center justify-center text-white shadow-md z-10 hover:bg-gray-400 transition-colors"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
