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

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="pt-32 pb-20 md:pt-40 md:pb-24 bg-white  transition-all duration-300">
        <div className="container px-4 mx-auto">
          {/* Breadcrumb */}
          {/* <nav className="text-xs text-gray-500 mb-6">
            <Link href="/walk-in-cooler-freezer" className="hover:text-primary transition-colors">Walk-in Coolers</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800">{product.title}</span>
          </nav> */}
          <div className="flex flex-col lg:flex-row gap-8 ">
            {/* Left: Product Gallery & Info */}
            <div className="w-full lg:w-[60%]   flex flex-col ">
              {/* products featured image */}
              <div className="grid grid-cols-[80px_1fr] border border-gray-200 pl-4 pt-4 gap-4">
                {/* Left: Vertical Thumbnails */}
                <div className="flex flex-col gap-2">
                  {product.images.map((img, i) => (
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

                {/* Main Image */}
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
                      src={product.images[activeImageIndex]}
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
                        backgroundImage: `url(${product.images[activeImageIndex]})`,
                        backgroundPosition: `${(mousePosition.x / containerSize.width) * 100}% ${(mousePosition.y / containerSize.height) * 100}%`,
                        backgroundSize: `${containerSize.width * 2.5}px ${containerSize.height * 2.5}px`,
                        backgroundRepeat: 'no-repeat'
                      }}
                    />
                  )}
                </div>
              </div>
              <div>
                {/* description */}
                <section className="bg-white p-8 mt-4 border border-gray-200 ">
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
                        <div>
                          {product.documents.map((doc, idx) => {
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



                {/* FAQ Section */}
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
            {/* Right: Product Info */}
            <div className="w-full lg:w-[35%] border border-gray-200 bg-white lg:sticky lg:top-24 self-start p-4 flex flex-col gap-6">
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
                {/* Door Hinge Option */}
                <div>
                  <label className="text-sm font-bold text-gray-900 mb-2 block">Door Hinge: Left Hinged Door</label>
                  <select className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm text-gray-800 font-medium">
                    <option>Left Hinged Door</option>
                    <option>Right Hinged Door</option>
                  </select>
                </div>

                {/* Door Width Option */}
                <div>
                  <label className="text-sm font-bold text-gray-900 mb-2 block">Door Width: 30" Wide Door</label>
                  <select className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm text-gray-800 font-medium">
                    <option>30" Wide Door</option>
                    <option>36" Wide Door</option>
                  </select>
                </div>
              </div>

              {/* Price Section */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs  font-bold text-gray-800 uppercase">Price:</span>
                  <span className="text-2xl font-normal text-gray-900">${product.price}</span>
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
                  className="bg-[#cc3300] w-full cursor-pointer text-white py-3 px-4 font-semibold rounded-sm hover:bg-[#b32d00] transition-colors  tracking-wider text-sm"
                >
                  Add to Cart
                </button>

              </div>

              {/* <p className="text-center text-sm text-blue-500 cursor-pointer hover:underline">More payment options</p> */}

              {/* Pickup Info */}
              {/* <div className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-green-600 shrink-0" />
                <div className="flex flex-col">
                  <p className="text-sm font-semibold text-gray-900">Pickup available at 899 NEWARK TPKE</p>
                  <p className="text-xs text-gray-500 mb-1">Usually ready in 2-4 days</p>
                  <button className="text-xs text-gray-800 font-medium hover:underline w-fit">View store information</button>
                </div>
              </div> */}

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
          </div>



          {/* Bottom Full-Width Sections */}
          <div className="w-full flex flex-col gap-8">
            {/* Google Reviews Section */}
            <section className="bg-white p-8 mt-4 ">
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
                    <div key={index} className=" w-64 p-4 bg-gray-50 border border-gray-200 rounded-lg">
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
                          <span key={star} className="text-[#ffc107] text-sm">★</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors">
                  <ArrowRight size={20} className="text-gray-700" />
                </button>
              </div>
              <div className="flex justify-center gap-1 mt-4">
                {[1, 2].map((dot) => (
                  <div key={dot} className={`w-2 h-2 rounded-full ${dot === 1 ? 'bg-gray-800' : 'bg-gray-300'}`}></div>
                ))}
              </div>
            </section>
            <h2 className="text-2xl  text-center font-bold text-gray-900">Standard Features</h2>

            {/* More Walk-In Options Section */}
            {relatedProducts.length > 0 && (
              <section className="bg-white p-8  ">
                <h2 className="text-xl font-bold text-gray-900 mb-6">More Walk-In Options!</h2>
                <div className="relative">
                  {/* Left Slider Button */}
                  <button
                    onClick={() => scrollRelatedProducts('left')}
                    className="absolute -left-5 top-1/2 cursor-pointer -translate-y-1/2 w-10 h-10 bg-[#b3b3b3] rounded-full flex items-center justify-center text-white shadow-md z-10 hover:bg-gray-400 transition-colors"
                  >
                    <ChevronLeft size={24} />
                  </button>

                  {/* Slider Container */}
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
                              ${relatedProduct.price || '0.00'} <span className="text-xs font-normal text-gray-500">/ Ea.</span>
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Right Slider Button */}
                  <button
                    onClick={() => scrollRelatedProducts('right')}
                    className="absolute -right-5 top-1/2 cursor-pointer -translate-y-1/2 w-10 h-10 bg-[#b3b3b3] rounded-full flex items-center justify-center text-white shadow-md z-10 hover:bg-gray-400 transition-colors"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              </section>
            )}



            <div className="   max-w-[1200px]  mx-auto mt-12">
              {[
                { title: "Heavy-Duty Deadbolt Handle Latch", image: "/Walk-in-Cooler-Freezer/details/handle-round_1.webp" },
                { title: "Modular Panel Construction", image: "/Walk-in-Cooler-Freezer/details/Walkin-ModularPanelConstruction.webp" },
                { title: "Spring Assisted Hinges", image: "/Walk-in-Cooler-Freezer/details/walkin-SpringHinge-Kason.webp" },
                { title: "Digital LED Thermometer & Switch", image: "/Walk-in-Cooler-Freezer/details/Walk-in-DigitalTherm-Switch.webp" },
                { title: "Heated Pressure-Relief Vent", image: "/Walk-in-Cooler-Freezer/details/Walkin-HeatPressureReliefVent.webp" },
                { title: "Long-Life Extruded Polystyrene Foam", image: "/Walk-in-Cooler-Freezer/details/Walkin-PolystyreneFoam.webp" },
                { title: "Door Closer", image: "/Walk-in-Cooler-Freezer/details/Door_Closer.webp" }
              ].map((feature, index) => (

                <div key={index} className={`flex items-center justify-center gap-8  gap-x-12   ${index % 2 !== 0 ? 'flex-row-reverse' : 'flex-row'}`}>

                  {/* Image Container */}
                  <div className="relative w-100 h-100  overflow-hidden   flex items-center justify-center ">
                    <Image src={feature.image} alt={feature.title} fill className="object-cover " />
                  </div>

                  {/* Text */}
                  <div className={`flex-1  ${index % 2 !== 0 ? 'text-right' : 'text-left'}`}>
                    <h3 className="text-xl md:text-2xl  font-semibold text-gray-900 leading-tight tracking-tight">
                      {feature.title}
                    </h3>
                  </div>

                </div>

              ))}
            </div>


            {/* Recently Viewed Section */}
            {relatedProducts.length > 0 && (
              <section className="bg-white p-8 mt-4">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Recently viewed</h2>
                <div className="relative">
                  {/* Left Slider Button */}
                  <button
                    onClick={() => scrollRecentlyViewed('left')}
                    className="absolute -left-5 top-1/2 cursor-pointer -translate-y-1/2 w-10 h-10 bg-[#b3b3b3] rounded-full flex items-center justify-center text-white shadow-md z-10 hover:bg-gray-400 transition-colors"
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
                              ${viewedProduct.price || '0.00'} <span className="text-xs font-normal text-gray-500">/ Ea.</span>
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Right Slider Button */}
                  <button
                    onClick={() => scrollRecentlyViewed('right')}
                    className="absolute -right-5 top-1/2 cursor-pointer -translate-y-1/2 w-10 h-10 bg-[#b3b3b3] rounded-full flex items-center justify-center text-white shadow-md z-10 hover:bg-gray-400 transition-colors"
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
