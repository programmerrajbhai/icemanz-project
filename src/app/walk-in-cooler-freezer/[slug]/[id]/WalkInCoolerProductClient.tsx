"use client";

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import {
  PhoneCall,
  FileText,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
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
};

export default function WalkInCoolerProductClient({
  product,
  relatedProducts
}: {
  product: Product;
  relatedProducts: RelatedProduct[];
}) {
  const { addToCart } = useCart();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showZoom, setShowZoom] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    refrigeration: false,
    payment: true,
    additional: true,
    faqs: true,
    warranty: false
  });

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
          <div className="flex flex-col lg:flex-row gap-2 ">

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
                <div className="flex items-center justify-center bg-white rounded-sm overflow-hidden relative">
                  <div
                    className="relative w-full h-[600px] cursor-crosshair overflow-hidden"
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setMousePosition({
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top
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
                          left: mousePosition.x - 100,
                          top: mousePosition.y - 100,
                          width: '200px',
                          height: '200px',
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>

              <div>
                {/* description */}
                <section className="border border-gray-200 bg-white p-8 mt-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Description</h2>

                  <div className="space-y-6">
                    <p className="text-sm text-gray-800 leading-relaxed">
                      <span className="font-bold">Astra® Quick-Ship Walk-In Coolers & Freezers</span> deliver quality and speed with modular cam-lock panels, sizes 5'-40', and top-mount or remote options. Ships in 48 hours, NSF, UL, DOE compliant, with 10-year panel warranty. Ready when you are!
                    </p>

                    <ul className="space-y-4">
                      {[
                        'Ships within 48 hours',
                        'Several Variations Available',
                        'Top-Mount or Remote Refrigeration',
                        'Modular design with all cam-lock panels',
                        '10 year panel warranty, 1 year parts warranty on doors',
                        '2 year parts and 1 labor warranty on top-mount refrigeration',
                        'NSF, UL, DOE, ASTM Test 518, and ASTM Test E84 Compliant',
                        'UL723 Flame Spread and Smoke Development Compliant'
                      ].map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                          <span className="mt-2 size-1.5 rounded-full bg-gray-400 shrink-0"></span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                {/* Standard Features */}
                <section className="border border-gray-200 bg-white p-8 mt-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-8">Standard Features</h2>

                  <div className="space-y-10 pb-5">
                    {/* Panels */}
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Panels</h3>
                        <ul className="space-y-4">
                          {[
                            '4" Thick Foamed-In-Place Polyurethane Insulation',
                            'Cam-Lock Panels, Tongue & Groove Design',
                            '24 Gauge Pre-Painted White Galvanized Steel',
                            'R27 for Coolers and R33 for Freezers',
                            'CFC and HFC Free Materials',
                            '10 Year Panel Warranty'
                          ].map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-sm text-gray-800">
                              <span className="mt-2 size-1.5 rounded-full bg-gray-400 shrink-0"></span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="w-full md:w-[280px] shrink-0 border border-gray-200 rounded-sm overflow-hidden bg-white p-4">
                        <div className="relative w-full aspect-square">
                          <Image src="/Walk-in-Cooler-Freezer/combounits.jpg" alt="Panels" fill className="object-contain" />
                        </div>
                      </div>
                    </div>

                    <div className="w-full h-px bg-gray-100"></div>

                    {/* Doors */}
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Doors</h3>
                        <ul className="space-y-4">
                          {[
                            '30" or 36" wide doors (left or right hinged)',
                            'Self-Closing, Flush-Mounted Doors',
                            'Keyed Locking Door Handle',
                            '120V/1P/1A Heating Wire and Pressure Relief Vent on Freezers',
                            'Heavy-Duty Hinges and Durable Handles'
                          ].map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-sm text-gray-800">
                              <span className="mt-2 size-1.5 rounded-full bg-gray-400 shrink-0"></span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="w-full md:w-[280px] shrink-0   overflow-hidden  p-4">
                        <div className="relative w-full ">
                          <Image src="/Walk-in-Cooler-Freezer/combounits.jpg" alt="Doors" fill className="object-contain" />
                        </div>
                      </div>
                    </div>

                    <div className="w-full h-px bg-gray-100"></div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-2">
                      {[
                        { name: 'Keyed Locking Door Handle', image: '/Walk-in-Cooler-Freezer/combounits.jpg' },
                        { name: 'Heavy-Duty Door Hinge', image: '/Walk-in-Cooler-Freezer/combounits.jpg' },
                        { name: 'Self-Closing Door Mechanism', image: '/Walk-in-Cooler-Freezer/combounits.jpg' },
                        { name: 'Vapor Proof Light', image: '/Walk-in-Cooler-Freezer/combounits.jpg' }
                      ].map((feat, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                          <div className="w-full  h-50 mb-4 relative overflow-hidden bg-[#e0dfd5] flex items-center justify-center">
                            <Image src={feat.image} alt={feat.name} fill className="object-contain" />
                          </div>
                          <span className=" text-sm font-semibold text-gray-900 text-center  leading-tight max-w-[160px]">{feat.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>






                {/* Refrigeration Options */}
                <section className="border border-gray-200 bg-white mt-4">
                  <button
                    onClick={() => toggleSection('refrigeration')}
                    className="w-full flex items-center justify-between cursor-pointer p-6 hover:bg-gray-50 transition-colors"
                  >
                    <h2 className="text-xl font-bold text-gray-900">Refrigeration Options</h2>
                    {expandedSections.refrigeration ? <ChevronUp size={24} className="text-gray-500" /> : <Plus size={24} className="text-gray-500" />}
                  </button>

                  {expandedSections.refrigeration && (
                    <div className="p-6 md:p-8 border-t border-gray-200">
                      <div className="grid md:grid-cols-2 gap-8">
                        {/* Top Mount */}
                        <div className="p-6 rounded-sm bg-white border border-gray-200">
                          <div className="relative w-full h-48 mb-6 rounded-sm overflow-hidden">
                            <Image src="/category/refrigerationEquipment/packageUnit.jpg" alt="Top Mount Refrigeration" fill className="object-contain p-4" />
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Top Mount Refrigeration</h3>
                          <ul className="space-y-3">
                            {topMountFeatures.map((feature, idx) => (
                              <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                                <CheckCircle2 size={16} className="text-[#00C853] shrink-0 mt-0.5" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Remote */}
                        <div className="p-6 rounded-sm bg-white border border-gray-200">
                          <div className="relative w-full h-48 mb-6   rounded-sm overflow-hidden">
                            <Image src="/category/refrigerationEquipment/condensingUnit.jpg" alt="Remote Refrigeration" fill className="object-contain p-4" />
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Remote Refrigeration</h3>
                          <ul className="space-y-3">
                            {remoteFeatures.map((feature, idx) => (
                              <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                                <CheckCircle2 size={16} className="text-[#00C853] shrink-0 mt-0.5" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </section>

                {/* Additional Options */}
                <section className="border border-gray-200 bg-white mt-4">
                  <button
                    onClick={() => toggleSection('additional')}
                    className="w-full flex items-center justify-between cursor-pointer p-6 hover:bg-gray-50 transition-colors"
                  >
                    <h2 className="text-xl font-bold text-gray-900">Additional Options</h2>
                    {expandedSections.additional ? <Minus size={24} className="text-gray-900" /> : <Plus size={24} className="text-gray-900" />}
                  </button>

                  {expandedSections.additional && (
                    <div className="p-6 md:p-8 pt-0">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                          { name: 'LED Light', image: '/Walk-in-Cooler-Freezer/combounits.jpg' },
                          { name: 'Exterior Ramp', image: '/Walk-in-Cooler-Freezer/combounits.jpg' },
                          { name: 'Aluminum Diamond Plate', image: '/Walk-in-Cooler-Freezer/combounits.jpg' },
                          { name: 'Kick Plate', image: '/Walk-in-Cooler-Freezer/combounits.jpg' }
                        ].map((opt, idx) => (
                          <div key={idx} className="flex flex-col items-center">
                            <div className="w-full aspect-square border border-gray-200 rounded-sm mb-4 relative overflow-hidden bg-white  flex items-center justify-center p-4">
                              <Image src={opt.image} alt={opt.name} fill className="object-contain p-4" />
                            </div>
                            <span className="text-sm font-semibold text-gray-900 text-center leading-snug max-w-[140px]">{opt.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
                {/* FAQ Section */}
                <section className="border border-gray-200 bg-white mt-4">
                  <button
                    onClick={() => toggleSection('faqs')}
                    className="w-full flex items-center justify-between cursor-pointer p-6 hover:bg-gray-50 transition-colors"
                  >
                    <h2 className="text-xl font-bold text-gray-900">FAQ's</h2>
                    {expandedSections.faqs ? <Minus size={24} className="text-gray-900" /> : <Plus size={24} className="text-gray-900" />}
                  </button>

                  {expandedSections.faqs && (
                    <div className="p-6 md:p-8 pt-0">
                      <h3 className="text-lg font-bold text-gray-900 text-center mb-6">
                        Astra Walk-In Coolers and Freezers
                      </h3>
                      <div className="border border-gray-200 rounded-md overflow-hidden">
                        {faqItems.map((faq, index) => (
                          <div
                            key={index}
                            className={`border-b border-gray-200 last:border-b-0 ${expandedFaq === index ? 'bg-gray-100' : 'bg-gray-50'
                              }`}
                          >
                            <button
                              onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                              className="w-full text-left p-4 hover:bg-gray-100 transition-colors"
                            >
                              <span className="font-bold text-sm text-gray-900">
                                {faq.question}
                              </span>
                            </button>
                            {expandedFaq === index && (
                              <div className="p-4 pt-0 text-sm text-gray-700 bg-gray-100">
                                {faq.answer}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </section>

                {/* Warranty Section */}
                <section className="border border-gray-200 bg-white mt-4">
                  <button
                    onClick={() => toggleSection('warranty')}
                    className="w-full flex items-center justify-between cursor-pointer p-6 hover:bg-gray-50 transition-colors"
                  >
                    <h2 className="text-xl font-bold text-gray-900">Warranty</h2>
                    {expandedSections.warranty ? <Minus size={24} className="text-gray-900" /> : <Plus size={24} className="text-gray-900" />}
                  </button>

                  {expandedSections.warranty && (
                    <div className="p-6 md:p-8 pt-0">
                      <ul className="space-y-4">
                        {[
                          { bold: '10-Year', text: 'Panel Warranty' },
                          { bold: '2-Year', text: 'Top Mount Refrigeration Parts' },
                          { bold: '1-Year', text: 'Top Mount Refrigeration Labor' },
                          { bold: '1-Year', text: 'Remote Refrigeration Parts' },
                          { bold: '1-Year', text: 'Door Warranty' }
                        ].map((item, idx) => (
                          <li key={idx} className="flex items-center gap-3 text-sm text-gray-800">
                            <span className="size-1.5 rounded-full bg-gray-400 shrink-0"></span>
                            <span>
                              <span className="font-bold">{item.bold}</span> {item.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </section>
              </div>

            </div>

            {/* Right: Product Info */}
            <div className="w-full lg:w-[35%] lg:sticky lg:top-24 self-start border border-gray-200 p-4 flex flex-col gap-4">

              {/* Right: Zoom Preview Box (Outside Gallery) */}
              {isHovering && <div className=" absolute  border border-black  w-full  top-0 left-0  z-10">
                <div className="  top-0  bg-white  rounded-sm overflow-hidden relative h-[600px]">
                  <div
                    className="w-full h-full"
                    style={{
                      backgroundImage: `url(${product.images[activeImageIndex]})`,
                      backgroundSize: '250% 250%',
                      backgroundPosition: `${(mousePosition.x / 600) * 100}% ${(mousePosition.y / 600) * 100}%`,
                      backgroundRepeat: 'no-repeat',
                    }}
                  />

                </div>
              </div>}

              {/* Title */}
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight mb-2">
                {product.title}
              </h1>

              {/* Brand, SKU & Social Share */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                <div className="flex items-center gap-4 text-sm font-bold uppercase tracking-wider">
                  <span className="text-[#004a99]">ASTRA</span>
                  <span className="text-gray-300">|</span>
                  <span className="text-gray-500">SKU: {product.id.substring(0, 8).toUpperCase()}</span>
                </div>

              </div>

              {/* Service Badges */}
              <div className="space-y-2 mb-5">
                <div className="flex items-center gap-3 bg-[#e8f4fd] border border-[#b8daff] px-3 py-2 rounded-sm">
                  <Truck size={18} className="text-[#004a99]" />
                  <p className="text-sm font-bold text-[#004a99]">
                    🚚 Lead Time - Usually Ships in 2 - 5 Days
                  </p>
                </div>
                <div className="flex items-center gap-3 bg-[#e8f4fd] border border-[#b8daff] px-3 py-2 rounded-sm">
                  <CheckCircle2 size={18} className="text-[#00C853]" />
                  <p className="text-sm font-bold text-[#004a99]">
                    ✅ Price Match - Call Us For Best Price!
                  </p>
                </div>
              </div>

              {/* Price Section */}
              <div className="flex items-start gap-4 mb-5">
                <span className="text-sm font-bold text-gray-800 mt-1 uppercase">Price:</span>
                <div className="flex flex-col">
                  <p className="text-2xl font-bold text-[#004a99] leading-none mb-1">${product.price}</p>

                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-bold text-gray-800 uppercase">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <div className="w-10 h-9 flex items-center justify-center border-x border-gray-300 text-sm font-bold">
                    {quantity}
                  </div>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Customization Alert */}
              <div className="bg-[#f0f9ff] border border-[#bae6fd] p-3 rounded-sm mb-6">
                <p className="text-sm font-medium text-[#0369a1] leading-relaxed">
                  Don't see the Layout or Option you need? <Link href="/contact" className="font-bold underline">Contact Us to customize your QuickShip Walk-In.</Link>
                </p>
              </div>

              {/* Product Options */}
              <div className="space-y-5 mb-6">
                {/* Layout Option */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <label className="text-sm font-bold text-gray-900">Layout</label>
                    <Info size={14} className="text-gray-400" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: '1A', img: '/Walk-in-Cooler-Freezer/combounits.jpg' },
                      { id: '1B', img: '/Walk-in-Cooler-Freezer/combounits.jpg' },
                      { id: '2A', img: '/Walk-in-Cooler-Freezer/combounits.jpg' }
                    ].map((layout) => (
                      <button
                        key={layout.id}
                        className={`group relative border-2 rounded-sm p-1 transition-all ${selectedOptions['layout'] === layout.id ? 'border-gray-900' : 'border-gray-200 hover:border-gray-300'}`}
                        onClick={() => handleOptionChange('layout', layout.id)}
                      >
                        <div className="aspect-4/3 bg-gray-50 relative overflow-hidden mb-1">
                          <Image src={layout.img} alt={layout.id} fill className="object-contain p-1" />
                        </div>
                        <span className="text-[10px] font-bold text-gray-500 group-hover:text-gray-900">{layout.id}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dropdown Options */}
                {[
                  { label: 'LED Lights', name: 'led_lights' },
                  { label: 'Kick Plate', name: 'kick_plate' },
                  { label: 'External Ramp', name: 'external_ramp' }
                ].map((option) => (
                  <div key={option.name}>
                    <div className="flex items-center gap-2 mb-2">
                      <label className="text-sm font-bold text-gray-900">{option.label}</label>
                      <Info size={14} className="text-gray-400" />
                    </div>
                    <div className="relative">
                      <select
                        className="w-full appearance-none bg-white border border-gray-200 rounded-sm px-4 py-3 text-sm text-gray-500 focus:outline-none focus:border-gray-900"
                        onChange={(e) => handleOptionChange(option.name, e.target.value)}
                      >
                        <option value="">Choose {option.label}</option>
                        <option value="standard">Standard</option>
                        <option value="premium">Premium</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Price Bar */}
              <div className="border border-gray-900 p-3 mb-4">
                <p className="text-xs font-bold text-gray-900 uppercase">
                  Total price is <span className="text-[#cc0000] ml-2">${product.price}</span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid  mb-2">
                <button
                  onClick={() => addToCart({
                    id: product.id,
                    name: product.title,
                    brand: product.brand || 'ICEMANZ',
                    price: product.price,
                    image: product.images[0] || '/placeholder.png',
                    quantity: quantity
                  })}
                  className="bg-[#cc3300] w-full cursor-pointer text-white py-3 px-4 font-bold rounded-sm hover:bg-[#b32d00] transition-colors uppercase tracking-wider text-xs"
                >
                  Add to Cart
                </button>

              </div>


              {/* Pickup & Support */}
              <div className="space-y-4">
                {/* Pickup Info */}
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-[#00C853] shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <p className="text-xs font-bold text-gray-900">Pickup available at 899 NEWARK TPKE</p>
                    <p className="text-[11px] text-gray-500 mb-1">Usually ready in 2-4 days</p>
                    <button className="text-xs text-[#004a99] font-bold hover:underline w-fit">View store information</button>
                  </div>
                </div>

                {/* Expert Support Card */}
                <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm flex items-center justify-between group cursor-pointer hover:border-gray-200 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-full bg-[#004a99]/10 flex items-center justify-center text-[#004a99]">
                      <div className="relative">
                        <PhoneCall size={18} />
                        <div className="absolute -top-1 -right-1 size-3 bg-[#00C853] border-2 border-white rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <div className="size-1.5 rounded-full bg-[#00C853]"></div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Team Online</span>
                      </div>
                      <p className="text-xs font-bold text-gray-900">Speak with a Walk-In Expert</p>
                      <p className="text-[11px] text-gray-500">We'll contact you as soon as possible.</p>
                    </div>
                  </div>
                  <div className="size-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#004a99] group-hover:text-white transition-all">
                    <ArrowRight size={16} />
                  </div>
                </div>

                {/* Attachments */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-gray-900 mb-2">Product Attachments</h3>
                  {[
                    { name: 'CNF5X6 - Spec Sheet', size: '1.44 MB' },
                    { name: 'California 65 Statement', size: '53.2 KB' }
                  ].map((doc, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl group cursor-pointer hover:border-gray-200 transition-all">
                      <div className="size-9 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-gray-100 transition-colors">
                        <FileText size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">{doc.name}</p>
                        <p className="text-[11px] text-gray-400">({doc.size})</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>



        </div>
      </div>

    </main>
  );
}
