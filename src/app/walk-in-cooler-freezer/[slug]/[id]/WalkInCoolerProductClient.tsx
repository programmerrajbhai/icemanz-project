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
                <section className="bg-white p-8 mt-4 border border-gray-200 ">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Description</h2>

                  <div className="space-y-4">
                    <p className="text-sm text-gray-800 leading-relaxed">
                      Quick Ship Indoor Walk-In Cooler, 6' W x 6' L x 7-2 1/4" H, Without Floor, 4" thick AK-XPS4 insulation providing R-29 for coolers and R-32 for freezers, ceiling & doors, insulation with 50 Year R-value warranty, 26 gauge stucco embossed corrosion resistant acrylic coated Acrylume® on all interior & exterior surfaces, NSF vinyl screed, flush self-closing door, digital LED thermometer with pilot light switch, super cam-rise spring assisted hinges & door closer, ships in 48 hours - subject to terms & conditions, UL, Made in USA
                    </p>

                    <div>
                      <h3 className="text-sm font-bold text-gray-900 mb-3">Features:</h3>
                      <ul className="space-y-2">
                        {[
                          '4" Thick AK-XPS4 insulation, providing R-29 for coolers and R-32 for freezers',
                          '26 Gauge Acrylume® coated corrosion resistant stucco embossed Galvalume on all interior and exterior surfaces',
                          '30"W x 76"H or 36"W x 76"H flush mounted door with spring actuated door closer',
                          '2 Super cam-rise spring assisted hinges',
                          'Deadbolt keyed handle latch',
                          'Interior safety lock release handle',
                          'Digital LED thermometer with on and off pilot light switch',
                          'Vapor proof light fixture centered on interior door jamb',
                          'Floorless walk-ins have NSF vinyl screed'
                        ].map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                            <span className="mt-2 size-1.5 rounded-full bg-gray-800 shrink-0"></span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-sm font-bold text-gray-900 mb-3">Spec Sheet</h3>
                      <img
                        src="/products/product_1.jpg"
                        alt="Spec Sheet"
                        className="w-20 h-auto"
                      />
                    </div>
                  </div>
                </section>

                {/* Visual Features Section */}
                <section className="bg-gray-50/30 py-16 px-8 mt-4 border border-gray-200">
                  <div className="space-y-16 max-w-2xl mx-auto">
                    {[
                      { title: "Heavy-Duty Deadbolt Handle Latch", image: "/Walk-in-Cooler-Freezer/combounits.jpg" },
                      { title: "Modular Panel Construction", image: "/Walk-in-Cooler-Freezer/combounits.jpg" },
                      { title: "Spring Assisted Hinges", image: "/Walk-in-Cooler-Freezer/combounits.jpg" },
                      { title: "Digital LED Thermometer & Switch", image: "/Walk-in-Cooler-Freezer/combounits.jpg" },
                      { title: "Heated Pressure-Relief Vent", image: "/Walk-in-Cooler-Freezer/combounits.jpg" },
                      { title: "Long-Life Extruded Polystyrene Foam", image: "/Walk-in-Cooler-Freezer/combounits.jpg" },
                      { title: "Door Closer", image: "/Walk-in-Cooler-Freezer/combounits.jpg" }
                    ].map((feature, index) => (
                      <div key={index} className={`flex items-center justify-center gap-12 md:gap-24 ${index % 2 !== 0 ? 'flex-row-reverse' : 'flex-row'}`}>
                        {/* Image Container */}
                        <div className="relative w-40 h-40 md:w-48 md:h-48 shrink-0 rounded-full overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-8 border-white bg-white flex items-center justify-center transition-transform hover:scale-105 duration-300">
                          <Image src={feature.image} alt={feature.title} fill className="object-cover" />
                        </div>

                        {/* Text */}
                        <div className={`flex-1 max-w-[200px] ${index % 2 !== 0 ? 'text-right' : 'text-left'}`}>
                          <h3 className="text-base md:text-lg font-extrabold text-gray-900 leading-snug">
                            {feature.title}
                          </h3>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* FAQ Section */}
                <section className="bg-white p-8 mt-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold text-gray-900">FAQ's</h2>
                    <Minus size={24} className="text-gray-900" />
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 text-center mb-6">
                    Walk-In Coolers and Freezers
                  </h3>
                  <div className="border border-gray-200 rounded-md overflow-hidden bg-gray-50">
                    {[
                      'What is a walk-in cooler or freezer?',
                      'What sizes are available for walk-in coolers?',
                      'What are the benefits of a walk-in cooler?',
                      'How do I maintain a walk-in cooler?',
                      'Are walk-in coolers energy-efficient?'
                    ].map((question, index) => (
                      <div
                        key={index}
                        className="border-b border-gray-200 last:border-b-0"
                      >
                        <div className="p-4">
                          <span className="font-bold text-sm text-gray-900">
                            {question}
                          </span>
                        </div>
                      </div>
                    ))}
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
                <div className="flex items-center gap-4 text-sm font-bold uppercase tracking-wider">
                  <span className="text-blue-700">{product.brand || 'AMERIKOOLER'}</span>
                  <span className="text-gray-300">|</span>
                  <span className="text-gray-500">SKU: {product.id.substring(0, 8).toUpperCase()}</span>
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
                  <span className="text-sm font-bold text-gray-800 uppercase">Price:</span>
                  <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                </div>
                <p className="text-sm text-gray-600">
                  From $540.29/mo with <span className="text-purple-600 font-bold">shop</span>
                  <span className="text-blue-600 font-bold ml-2 cursor-pointer">View sample plans</span>
                </p>
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
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => addToCart({
                    id: product.id,
                    name: product.title,
                    brand: product.brand || 'ICEMANZ',
                    price: product.price,
                    image: product.images[0] || '/placeholder.png',
                    quantity: quantity
                  })}
                  className="bg-[#cc3300] w-full cursor-pointer text-white py-3 px-4 font-bold rounded-md hover:bg-[#b32d00] transition-colors uppercase tracking-wider text-sm"
                >
                  Add to Cart
                </button>
                <button className="bg-[#6366f1] w-full cursor-pointer text-white py-3 px-4 font-bold rounded-md hover:bg-[#4f46e5] transition-colors uppercase tracking-wider text-sm">
                  Buy with <span className="text-sm">shop</span>
                </button>
              </div>

              <p className="text-center text-sm text-blue-500 cursor-pointer hover:underline">More payment options</p>

              {/* Pickup Info */}
              <div className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-green-600 shrink-0" />
                <div className="flex flex-col">
                  <p className="text-sm font-semibold text-gray-900">Pickup available at 899 NEWARK TPKE</p>
                  <p className="text-xs text-gray-500 mb-1">Usually ready in 2-4 days</p>
                  <button className="text-xs text-gray-800 font-medium hover:underline w-fit">View store information</button>
                </div>
              </div>

              {/* Product Attachments */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-gray-900">Product Attachments</h3>
                {[
                  { name: 'Warranty', size: '2.99 MB' },
                  { name: 'About Amerikooler', size: '182.99 KB' },
                  { name: 'California 65 Statement', size: '53.2 KB' }
                ].map((doc, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-all shadow-sm">
                    <div className="size-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                      <FileText size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                      <p className="text-xs text-gray-500">({doc.size})</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>



        </div>
      </div>

    </main>
  );
}
