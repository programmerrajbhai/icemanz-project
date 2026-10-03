"use client";

import Header from '@/components/Header';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState, useRef, useMemo, useEffect } from 'react';
import {
  PhoneCall,
  FileText,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Minus,
  Plus,
  Facebook,
  Twitter,
  Mail,
  Truck,
  ArrowRight,
  Share2,
  ShieldCheck,
  CreditCard,
  Package,
  Clock,
  BadgeCheck,
  ExternalLink,
  Printer,
  X
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

type Product = {
  id: string;
  title: string;
  slug: string;
  price: string;
  images: string[];
  badge?: string;
  brand?: string;
  sku?: string;
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
  productOptions?: { label: string; name: string; options: { label: string; price?: string }[] }[] | Record<string, any>;
  layouts?: { name: string; value: string; selected?: boolean; thumbnail?: string; preview_image?: string }[] | null;
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

const astraCoolerSizes = [
  { size: "6' x 6'", noFloor: "2,903", withFloor: "3,165" },
  { size: "6' x 8'", noFloor: "3,156", withFloor: "3,490" },
  { size: "6' x 10'", noFloor: "3,487", withFloor: "3,880" },
  { size: "6' x 12'", noFloor: "3,940", withFloor: "4,410" },
  { size: "8' x 8'", noFloor: "3,680", withFloor: "4,160" },
  { size: "8' x 10'", noFloor: "4,090", withFloor: "4,658" },
  { size: "8' x 12'", noFloor: "4,620", withFloor: "5,220" },
  { size: "10' x 10'", noFloor: "4,750", withFloor: "5,480" },
  { size: "10' x 12'", noFloor: "5,300", withFloor: "6,050" },
  { size: "10' x 14'", noFloor: "5,920", withFloor: "6,810" },
  { size: "10' x 16'", noFloor: "6,530", withFloor: "7,490" },
  { size: "10' x 20'", noFloor: "7,790", withFloor: "8,990" },
];

const astraFreezerSizes = [
  { size: "6' x 6'", noFloor: "3,190", withFloor: "3,490" },
  { size: "6' x 8'", noFloor: "3,490", withFloor: "3,860" },
  { size: "6' x 10'", noFloor: "3,870", withFloor: "4,310" },
  { size: "6' x 12'", noFloor: "4,380", withFloor: "4,900" },
  { size: "8' x 8'", noFloor: "4,090", withFloor: "4,620" },
  { size: "8' x 10'", noFloor: "4,550", withFloor: "5,170" },
  { size: "8' x 12'", noFloor: "5,130", withFloor: "5,790" },
  { size: "10' x 10'", noFloor: "5,280", withFloor: "6,090" },
  { size: "10' x 12'", noFloor: "5,890", withFloor: "6,720" },
  { size: "10' x 14'", noFloor: "6,580", withFloor: "7,560" },
  { size: "10' x 16'", noFloor: "7,260", withFloor: "8,310" },
  { size: "10' x 20'", noFloor: "8,650", withFloor: "9,990" },
];

export default function AstraProductClient({
  product,
  relatedProducts
}: {
  product: Product;
  relatedProducts: RelatedProduct[];
}) {
  const router = useRouter();
  const { addToCart } = useCart();

  // Fallback data for incomplete products
  const enrichedProduct = {
    ...product,
    description: product.description || '',
    detailedFeatures: product.detailedFeatures || [],
    warranty: product.warranty || [],
    documents: product.documents || [],
    features: product.features || {},
    faqs: product.faqs || [],
    productOptions: product.productOptions || []
  };

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [containerSize, setContainerSize] = useState({ width: 600, height: 600 });
  const [isHovering, setIsHovering] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('coolers');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    description: true,
    features: true,
    refrigeration: false,
    additional: false,
    warranty: false,
  });
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [addonQuantities, setAddonQuantities] = useState<Record<string, number>>({});
  const accessoriesSliderRef = useRef<HTMLDivElement>(null);

  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleOptionChange = (optionName: string, value: string) => {
    console.log('Option changed:', optionName, '=', value);
    setSelectedOptions(prev => {
      const updated = { ...prev, [optionName]: value };
      console.log('Updated selectedOptions:', updated);
      return updated;
    });
  };

  const scrollAccessories = (direction: 'left' | 'right') => {
    if (accessoriesSliderRef.current) {
      accessoriesSliderRef.current.scrollBy({
        left: direction === 'left' ? -220 : 220,
        behavior: 'smooth'
      });
    }
  };

  const cleanPrice = (priceStr: string) => {
    const num = parseFloat(String(priceStr).replace(/[^0-9.]/g, ''));
    return isNaN(num) ? 0 : num;
  };

  const formatPrice = (num: number) => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Get dynamic data from product features (imported from JSON)
  const productFeatures = enrichedProduct.features as any;

  const panelFeatures = productFeatures?.panels || [];
  const doorFeatures = productFeatures?.doors || [];
  const topMountFeatures = productFeatures?.topMount || [];
  const remoteFeatures = productFeatures?.remote || [];

  // Get dynamic data from JSON - check both features object and detailedFeatures array
  const standardFeaturesHtml = productFeatures?.standard_features_html ||
    (Array.isArray(enrichedProduct.detailedFeatures) && enrichedProduct.detailedFeatures[0]) ||
    '';

  const refrigerationOptionsHtml = productFeatures?.refrigeration_options_html ||
    (Array.isArray(enrichedProduct.detailedFeatures) && enrichedProduct.detailedFeatures[1]) ||
    '';

  const additionalOptionsHtml = productFeatures?.additional_options_html ||
    (Array.isArray(enrichedProduct.detailedFeatures) && enrichedProduct.detailedFeatures[2]) ||
    '';

  const warrantyItems = enrichedProduct.warranty || [];

  // Get certifications from documents object
  const certifications = (enrichedProduct.documents as any)?.certifications || [];

  // Get FAQs from product
  const faqs = enrichedProduct.faqs || [];

  // Get configurable properties and addons from productOptions
  const productOptionsData = enrichedProduct.productOptions as any;
  const configurableProperties = productOptionsData?.configurable_properties || {};
  const addons = productOptionsData?.addons || [];

  // Get layouts - from product.layouts field (typed now)
  const layouts = product.layouts || (enrichedProduct as any).layouts || productOptionsData?.layouts || [];

  // Auto-select first layout on mount
  useEffect(() => {
    if (layouts && layouts.length > 0 && !selectedOptions.layout) {
      const firstLayout = layouts[0];
      setSelectedOptions(prev => ({
        ...prev,
        layout: firstLayout.value || firstLayout.name
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layouts.length]);

  // Get specifications from specs field — normalize to plain object for rendering
  // DB may store as [{label, value}] array (admin form) or plain {Key: Value} object (imported)
  const rawSpecs = enrichedProduct.specs;
  const specifications: Record<string, string> = (() => {
    if (!rawSpecs) return {};
    if (Array.isArray(rawSpecs)) {
      const obj: Record<string, string> = {};
      (rawSpecs as { label: string; value: string }[]).forEach(s => {
        if (s.label) obj[s.label] = s.value || '';
      });
      return obj;
    }
    if (typeof rawSpecs === 'object') return rawSpecs as Record<string, string>;
    return {};
  })();

  // Calculate dynamic price based on selected options - useMemo for reactivity
  const totalPrice = useMemo(() => {

    let basePrice = cleanPrice(product.price);

    // Helper function to extract price from label text like "(+$250.00)" or "(+$540.00)"
    const extractPriceFromLabel = (label: string): number => {
      const match = label.match(/\(\+\$([0-9,]+\.?\d*)\)/);
      if (match) {
        return parseFloat(match[1].replace(/,/g, ''));
      }
      return 0;
    };

    // Add refrigeration price if selected
    if (selectedOptions.refrigeration && productOptionsData?.refrigeration_choice) {
      const selectedRefrig = productOptionsData.refrigeration_choice.find(
        (opt: any) => opt.value === selectedOptions.refrigeration
      );
      if (selectedRefrig) {
        if (selectedRefrig.price_cents) {
          basePrice += selectedRefrig.price_cents / 100;
        } else {
          // Try to extract from label
          const priceFromLabel = extractPriceFromLabel(selectedRefrig.label || '');
          basePrice += priceFromLabel;
        }
      }
    }

    // Add Indoor/Outdoor price difference
    if (configurableProperties && configurableProperties['Indoor / Outdoor']) {
      const selectedOption = configurableProperties['Indoor / Outdoor'].find(
        (opt: any) => opt.value === selectedOptions.location || opt.label === selectedOptions.location
      );
      if (selectedOption) {
        if (selectedOption.price_cents) {
          basePrice += selectedOption.price_cents / 100;
        } else {
          const priceFromLabel = extractPriceFromLabel(selectedOption.label || '');
          basePrice += priceFromLabel;
          console.log('Indoor/Outdoor price added:', priceFromLabel);
        }
      }
    }

    // Add Door Size price difference
    if (configurableProperties && configurableProperties['Door Size']) {
      const selectedOption = configurableProperties['Door Size'].find(
        (opt: any) => opt.value === selectedOptions.door || opt.label === selectedOptions.door
      );
      if (selectedOption) {
        if (selectedOption.price_cents) {
          basePrice += selectedOption.price_cents / 100;
        } else {
          const priceFromLabel = extractPriceFromLabel(selectedOption.label || '');
          basePrice += priceFromLabel;
          console.log('Door Size price added:', priceFromLabel);
        }
      }
    }

    // Add Floor Type price difference
    if (configurableProperties && configurableProperties['Floor Type']) {
      const selectedOption = configurableProperties['Floor Type'].find(
        (opt: any) => opt.value === selectedOptions.floorType || opt.label === selectedOptions.floorType
      );
      if (selectedOption) {
        if (selectedOption.price_cents) {
          basePrice += selectedOption.price_cents / 100;
        } else {
          const priceFromLabel = extractPriceFromLabel(selectedOption.label || '');
          basePrice += priceFromLabel;
          console.log('Floor Type price added:', priceFromLabel);
        }
      }
    }

    // Add addons
    if (addons && addons.length > 0) {
      addons.forEach((addon: any) => {
        const qty = addonQuantities[addon.name] || 0;
        if (qty > 0 && addon.price_cents) {
          basePrice += (addon.price_cents / 100) * qty;
        }
      });
    } else {
      // Add default addons if no scraped data
      const ledQty = addonQuantities['LED Light'] || 0;
      const kickPlateQty = addonQuantities['Door Kick Plate'] || 0;
      const rampQty = addonQuantities['Exterior Ramp'] || 0;

      basePrice += ledQty * 150;
      basePrice += kickPlateQty * 160;
      basePrice += rampQty * 911;
    }

    return basePrice;
  }, [product.price, selectedOptions, addonQuantities, productOptionsData, configurableProperties, addons]);

  const getCategoryFromTitle = () => {
    const title = product.title.toLowerCase();
    if (title.includes('freezer')) return { label: 'Walk-In Freezers', slug: 'walk-in-freezer-with-floor' };
    if (title.includes('combo')) return { label: 'Walk-In Combo', slug: 'walk-in-combo-cooler-freezer' };
    if (title.includes('with floor')) return { label: 'Walk-In Coolers With Floor', slug: 'walk-in-cooler-with-floor' };
    return { label: 'Walk-In Coolers', slug: 'walk-in-cooler-no-floor' };
  };

  const category = getCategoryFromTitle();

  return (
    <main className="min-h-screen bg-[#fcfcfc]">
      <Header />

      <div className="pt-24 sm:pt-32 lg:pt-40 pb-12 sm:pb-16 transition-all duration-300">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-0 ">

          {/* Breadcrumb */}

          <div className=' mb-2'>
            <nav className="text-xs text-gray-500 mb-2 flex items-center gap-1 flex-wrap">
              <Link href="/" className="hover:text-[#2172b9] transition-colors">Home</Link>
              <span className="mx-1 text-gray-400">/</span>
              <Link href="/walk-in-cooler-freezer" className="hover:text-[#2172b9] transition-colors">Walk-In Cooler &amp; Freezer</Link>
              <span className="mx-1 text-gray-400">/</span>
              <Link href={`/walk-in-cooler-freezer/${category.slug}`} className="hover:text-[#2172b9] transition-colors">{category.label}</Link>
              <span className="mx-1 text-gray-400">/</span>
              <span className="text-gray-800 font-medium">{product.title}</span>
            </nav>
            {/* Product Title (Desktop) */}
            <div className="hidden lg:block ">
              <h1 className="text-2xl xl:text-[28px] font-bold text-[#000000] leading-tight">
                {product.title}
              </h1>
              <div className="flex items-center gap-3 mt-2 text-xs font-medium uppercase tracking-wider text-gray-500">
                <span className=' font-semibold text-primary'>ASTRA</span>
                <span className="text-gray-300 font-semibold">|</span>
                <span>SKU: {product.slug?.split('-').pop()?.toUpperCase() || product.id.substring(0, 8).toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* Product Title (Mobile only) */}
          <div className="lg:hidden mb-4">
            <h1 className="text-xl sm:text-2xl font-bold text-[#000000] leading-tight">
              {product.title}
            </h1>
            <div className="flex items-center gap-3 mt-2 text-xs font-medium uppercase tracking-wider text-gray-500">
              <span>SKU: {product.slug?.split('-').pop()?.toUpperCase() || product.id.substring(0, 8).toUpperCase()}</span>
              <span className="text-gray-300">|</span>
              <span>ASTRA</span>
            </div>
          </div>

          {/* Mobile-only: Image Gallery shown before the 2-col layout */}
          <div className="lg:hidden mb-6 bg-white border border-gray-200 rounded-sm overflow-hidden p-3">
            <div className="flex flex-col-reverse gap-3">
              {/* Thumbnails — horizontal row below main image on mobile */}
              <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    className={`cursor-pointer shrink-0 w-16 h-16 bg-white border-2 rounded-sm overflow-hidden transition-all focus:outline-none relative ${i === activeImageIndex
                      ? 'border-[#233673] ring-1 ring-[#233673]/30'
                      : 'border-gray-200 hover:border-gray-400'
                      }`}
                  >
                    <Image src={img} alt={`View ${i + 1}`} fill className="object-contain p-1" sizes="80px" />
                  </button>
                ))}
              </div>
              {/* Main Image */}
              <div className="flex-1">
                <div
                  className="relative w-full h-[300px] cursor-crosshair overflow-hidden bg-white rounded-sm"
                  onClick={() => setLightboxOpen(true)}
                >
                  <Image
                    src={product.images[activeImageIndex]}
                    alt={product.title}
                    fill
                    className="object-contain p-4"
                    sizes="100vw"
                    priority
                  />
                  <div className="absolute bottom-3 right-3 bg-white/90 rounded-full p-2 shadow-sm">
                    <ZoomIn size={18} className="text-gray-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Layout */}
          <div className="flex flex-col lg:flex-row lg:gap-8 gap-6">

            {/* RIGHT COLUMN — comes first in HTML so on mobile it shows before left collapsibles */}
            {/* On desktop: order-2 pushes it to the right */}
            <div className="w-full lg:w-[55%] order-2 lg:order-1 flex flex-col gap-5">

              {/* Image Gallery — shown on desktop inside left col, hidden on mobile (mobile has its own copy above) */}
              <div className="hidden lg:block bg-white border border-gray-200 rounded-sm overflow-hidden p-3">
                <div className="flex flex-col-reverse sm:flex-row gap-3">
                  {/* Thumbnails - Bottom on mobile, Left on desktop */}
                  <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto pb-1 sm:pb-0 sm:w-20 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {product.images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImageIndex(i)}
                        className={`cursor-pointer shrink-0 w-16 h-16 sm:w-full sm:aspect-square bg-white border-2 rounded-sm overflow-hidden transition-all focus:outline-none relative ${i === activeImageIndex
                          ? 'border-[#233673] ring-1 ring-[#233673]/30'
                          : 'border-gray-200 hover:border-gray-400'
                          }`}
                      >
                        <Image src={img} alt={`View ${i + 1}`} fill className="object-contain p-1" sizes="80px" />
                      </button>
                    ))}
                  </div>

                  {/* Main Image */}
                  <div className="flex-1">
                    <div
                      className="relative w-full h-[300px] xs:h-[380px] sm:h-[450px] md:h-[520px] lg:h-[500px] xl:h-[560px] cursor-crosshair overflow-hidden bg-white rounded-sm"
                      onClick={() => setLightboxOpen(true)}
                      onMouseMove={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                        setContainerSize({ width: rect.width, height: rect.height });
                      }}
                      onMouseEnter={() => setIsHovering(true)}
                      onMouseLeave={() => setIsHovering(false)}
                    >
                      <Image
                        src={product.images[activeImageIndex]}
                        alt={product.title}
                        fill
                        className="object-contain p-6"
                        sizes="(max-width: 768px) 100vw, 60vw"
                        priority
                      />
                      {isHovering && (
                        <div
                          className="hidden md:block absolute border-2 border-[#233673]/40 bg-white/20 pointer-events-none z-20 rounded-sm"
                          style={{
                            left: Math.max(0, Math.min(mousePosition.x - 80, containerSize.width - 160)),
                            top: Math.max(0, Math.min(mousePosition.y - 80, containerSize.height - 160)),
                            width: '160px',
                            height: '160px',
                          }}
                        />
                      )}
                      <div className="absolute bottom-3 right-3 bg-white/90 rounded-full p-2 shadow-sm">
                        <ZoomIn size={18} className="text-gray-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Zoomed Preview Panel (Desktop) */}
              {isHovering && (
                <div
                  className="hidden lg:block fixed z-[100] bg-white border border-gray-200 shadow-2xl pointer-events-none"
                  style={{
                    width: '450px',
                    height: '450px',
                    top: '160px',
                    right: '40px',
                    backgroundImage: `url(${product.images[activeImageIndex]})`,
                    backgroundPosition: `${(mousePosition.x / containerSize.width) * 100}% ${(mousePosition.y / containerSize.height) * 100}%`,
                    backgroundSize: `${containerSize.width * 2.5}px ${containerSize.height * 2.5}px`,
                    backgroundRepeat: 'no-repeat'
                  }}
                />
              )}

              {/* Description Section */}
              <CollapsibleSection
                title="Description"
                isOpen={expandedSections.description}
                onToggle={() => toggleSection('description')}
              >
                <div className="astra-description">
                  {product.description && (
                    <div dangerouslySetInnerHTML={{ __html: product.description }} />
                  )}
                </div>
              </CollapsibleSection>

              {/* Standard Features */}
              <CollapsibleSection
                title="Standard Features"
                isOpen={expandedSections.features}
                onToggle={() => toggleSection('features')}
              >
                {standardFeaturesHtml ? (
                  <div dangerouslySetInnerHTML={{ __html: standardFeaturesHtml }} />
                ) : (
                  <div className="p-4 text-center text-sm text-gray-500">
                    No standard features information available for this product.
                  </div>
                )}
              </CollapsibleSection>

              {/* Refrigeration Options */}
              <CollapsibleSection
                title="Refrigeration Options"
                isOpen={expandedSections.refrigeration}
                onToggle={() => toggleSection('refrigeration')}
              >
                {refrigerationOptionsHtml ? (
                  <div dangerouslySetInnerHTML={{ __html: refrigerationOptionsHtml }} />
                ) : (
                  <div className="p-4 text-center text-sm text-gray-500">
                    No refrigeration options information available for this product.
                  </div>
                )}
              </CollapsibleSection>

              {/* Additional Options */}
              <CollapsibleSection
                title="Additional Options"
                isOpen={expandedSections.additional}
                onToggle={() => toggleSection('additional')}
              >
                {additionalOptionsHtml ? (
                  <div dangerouslySetInnerHTML={{ __html: additionalOptionsHtml }} />
                ) : (
                  <div className="p-4 text-center text-sm text-gray-500">
                    No additional options available for this product.
                  </div>
                )}
              </CollapsibleSection>

              {/* Warranty */}
              <CollapsibleSection
                title="Warranty"
                isOpen={expandedSections.warranty}
                onToggle={() => toggleSection('warranty')}
              >
                {warrantyItems && warrantyItems.length > 0 ? (
                  <div className="space-y-3">
                    {warrantyItems.map((w: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-3">
                        <ShieldCheck size={18} className="text-[#233673] mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{w}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-gray-500">
                    No warranty information available for this product.
                  </div>
                )}
              </CollapsibleSection>

              {/* Payment & Security */}
              <section className="bg-white border border-gray-200 rounded-sm p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Payment & Security</h3>
                  <ShieldCheck size={28} className="text-gray-900" />
                </div>

                {/* Payment Method Icons */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {/* Apple Pay */}
                  <div className="h-8 px-3 bg-white border border-gray-300 rounded flex items-center justify-center">
                    <span className="text-sm font-semibold">Apple Pay</span>
                  </div>
                  {/* Diners Club */}
                  <div className="h-8 px-3 bg-white border border-gray-300 rounded flex items-center justify-center">
                    <div className="w-8 h-5 bg-gradient-to-r from-blue-600 to-blue-400 rounded-sm"></div>
                  </div>
                  {/* Discover */}
                  <div className="h-8 px-3 bg-white border border-gray-300 rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-orange-500">DISCOVER</span>
                  </div>
                  {/* Google Pay */}
                  <div className="h-8 px-3 bg-white border border-gray-300 rounded flex items-center justify-center">
                    <span className="text-sm font-semibold">G Pay</span>
                  </div>
                  {/* Mastercard */}
                  <div className="h-8 px-3 bg-white border border-gray-300 rounded flex items-center justify-center">
                    <div className="flex -space-x-2">
                      <div className="w-5 h-5 rounded-full bg-red-500 opacity-90"></div>
                      <div className="w-5 h-5 rounded-full bg-orange-400 opacity-90"></div>
                    </div>
                  </div>
                  {/* PayPal */}
                  <div className="h-8 px-3 bg-white border border-gray-300 rounded flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">PayPal</span>
                  </div>
                  {/* Shop Pay */}
                  <div className="h-8 px-3 bg-[#5a31f4] border border-gray-300 rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-white">Shop Pay</span>
                  </div>
                  {/* Venmo */}
                  <div className="h-8 px-3 bg-[#3d95ce] border border-gray-300 rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-white">venmo</span>
                  </div>
                  {/* Visa */}
                  <div className="h-8 px-3 bg-white border border-gray-300 rounded flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-700">VISA</span>
                  </div>
                </div>

                {/* Security Message */}
                <p className="text-[15px] text-gray-800 leading-relaxed">
                  Your payment information is processed securely. We do not store credit card details nor have access to your credit card information.
                </p>
              </section>

              {/* Find the Right Walk-In Box Size */}
              {productFeatures?.sizePricing && (
                <section className="bg-white border border-gray-200 rounded-sm overflow-hidden">
                  <div className="p-5 sm:p-6">
                    <h2 className="text-lg font-bold text-[#000000] mb-1">
                      {productFeatures.sizePricing.title || "Find the right walk-in box size for your space"}
                    </h2>
                    <p className="text-sm text-gray-500 mb-5">
                      {productFeatures.sizePricing.subtitle || "Astra Walk-In Coolers & Freezers — Standard Sizes & Pricing"}
                    </p>

                    {productFeatures.sizePricing.tabs && productFeatures.sizePricing.tabs.length > 0 && (
                      <div className="flex border-b border-gray-200 mb-4">
                        {productFeatures.sizePricing.tabs.map((tab: any) => (
                          <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-4 py-2.5 text-sm font-semibold cursor-pointer transition-colors relative ${activeTab === tab.key
                              ? 'text-[#233673] border-b-2 border-[#233673]'
                              : 'text-gray-500 hover:text-gray-700'
                              }`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="overflow-x-auto -mx-5 sm:-mx-6 px-5 sm:px-6">
                      <table className="w-full text-sm border-collapse min-w-[400px]">
                        <thead>
                          <tr className="bg-[#233673] text-white">
                            <th className="text-left py-2.5 px-4 font-semibold text-xs uppercase tracking-wider">Size (W x L)</th>
                            <th className="text-right py-2.5 px-4 font-semibold text-xs uppercase tracking-wider">No Floor</th>
                            <th className="text-right py-2.5 px-4 font-semibold text-xs uppercase tracking-wider">With Floor</th>
                          </tr>
                        </thead>
                        <tbody>
                          {productFeatures.sizePricing.tabs && productFeatures.sizePricing.tabs.length > 0
                            ? (() => {
                              const currentTab = productFeatures.sizePricing.tabs.find((t: any) => t.key === activeTab);
                              const sizes = currentTab?.sizes || [];
                              return sizes.map((row: any, idx: number) => (
                                <tr key={idx} className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/70'} hover:bg-blue-50/50 transition-colors`}>
                                  <td className="py-2.5 px-4 font-medium text-gray-800">{row.size}</td>
                                  <td className="py-2.5 px-4 text-right text-gray-700">${row.noFloor}</td>
                                  <td className="py-2.5 px-4 text-right text-gray-700">${row.withFloor}</td>
                                </tr>
                              ));
                            })()
                            : (activeTab === 'coolers' ? astraCoolerSizes : astraFreezerSizes).map((row, idx) => (
                              <tr key={idx} className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/70'} hover:bg-blue-50/50 transition-colors`}>
                                <td className="py-2.5 px-4 font-medium text-gray-800">{row.size}</td>
                                <td className="py-2.5 px-4 text-right text-gray-700">${row.noFloor}</td>
                                <td className="py-2.5 px-4 text-right text-gray-700">${row.withFloor}</td>
                              </tr>
                            ))
                          }
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <Link
                        href="/walk-in-cooler-freezer"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#233673] hover:text-[#1a2a5e] transition-colors"
                      >
                        View All Sizes
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </section>
              )}

            </div>

            {/* RIGHT COLUMN — Sticky Sidebar: order-1 on mobile (shows before collapsibles), order-2 on desktop */}
            <div className="w-full lg:w-[45%] order-1 lg:order-2 lg:top-[140px] self-start flex flex-col gap-4 mb-6 lg:mb-0">

              {/* Price + Options Card */}
              <div className="bg-white border border-gray-200 rounded-sm p-5 sm:p-6 flex flex-col gap-6">
                {/* Price */}
                <div className="pb-4 border-b border-gray-200">
                  <div className="flex items-baseline gap-3">
                    <span className="text-base font-semibold text-gray-700">Price:</span>
                    <span className="text-4xl font-bold text-[#004a99]">${formatPrice(totalPrice)}</span>
                  </div>
                  {totalPrice !== cleanPrice(product.price) && (
                    <p className="text-sm text-gray-500 mt-1">
                      Base price: ${formatPrice(cleanPrice(product.price))}
                    </p>
                  )}
                </div>


                {/* Options - 2 Column Grid */}
                <div className="space-y-4">
                  {/* Door Hinge */}
                  {configurableProperties && configurableProperties['Door Hinge'] && configurableProperties['Door Hinge'].length > 0 ? (
                    <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
                      <label className="text-sm font-bold text-gray-900">Door Hinge</label>
                      <select
                        className="w-full bg-white border border-gray-300 rounded px-3 py-2.5 text-sm text-gray-800 focus:border-[#004a99] focus:ring-1 focus:ring-[#004a99]/20 outline-none transition-all"
                        onChange={(e) => handleOptionChange('hinge', e.target.value)}
                      >
                        {configurableProperties['Door Hinge'].map((opt: any, idx: number) => (
                          <option key={idx}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
                      <label className="text-sm font-bold text-gray-900">Door Hinge</label>
                      <select
                        className="w-full bg-white border border-gray-300 rounded px-3 py-2.5 text-sm text-gray-800 focus:border-[#004a99] focus:ring-1 focus:ring-[#004a99]/20 outline-none transition-all"
                        onChange={(e) => handleOptionChange('hinge', e.target.value)}
                      >
                        <option>Left Hinged</option>
                        <option>Right Hinged</option>
                      </select>
                    </div>
                  )}

                  {/* Indoor/Outdoor */}
                  {configurableProperties && configurableProperties['Indoor / Outdoor'] && configurableProperties['Indoor / Outdoor'].length > 0 ? (
                    <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
                      <label className="text-sm font-bold text-gray-900">Indoor / Outdoor</label>
                      <select
                        className="w-full bg-white border border-gray-300 rounded px-3 py-2.5 text-sm text-gray-800 focus:border-[#004a99] focus:ring-1 focus:ring-[#004a99]/20 outline-none transition-all"
                        onChange={(e) => handleOptionChange('location', e.target.value)}
                      >
                        {configurableProperties['Indoor / Outdoor'].map((opt: any, idx: number) => (
                          <option key={idx}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
                      <label className="text-sm font-bold text-gray-900">Indoor / Outdoor</label>
                      <select
                        className="w-full bg-white border border-gray-300 rounded px-3 py-2.5 text-sm text-gray-800 focus:border-[#004a99] focus:ring-1 focus:ring-[#004a99]/20 outline-none transition-all"
                        onChange={(e) => handleOptionChange('location', e.target.value)}
                      >
                        <option>Indoor</option>
                        <option>Outdoor</option>
                      </select>
                    </div>
                  )}

                  {/* Door Size */}
                  {configurableProperties && configurableProperties['Door Size'] && configurableProperties['Door Size'].length > 0 ? (
                    <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
                      <label className="text-sm font-bold text-gray-900">Door Size</label>
                      <select
                        className="w-full bg-white border border-gray-300 rounded px-3 py-2.5 text-sm text-gray-800 focus:border-[#004a99] focus:ring-1 focus:ring-[#004a99]/20 outline-none transition-all"
                        onChange={(e) => handleOptionChange('door', e.target.value)}
                      >
                        {configurableProperties['Door Size'].map((opt: any, idx: number) => (
                          <option key={idx}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
                      <label className="text-sm font-bold text-gray-900">Door Size</label>
                      <select
                        className="w-full bg-white border border-gray-300 rounded px-3 py-2.5 text-sm text-gray-800 focus:border-[#004a99] focus:ring-1 focus:ring-[#004a99]/20 outline-none transition-all"
                        onChange={(e) => handleOptionChange('door', e.target.value)}
                      >
                        <option>30"</option>
                        <option>36"</option>
                      </select>
                    </div>
                  )}

                  {/* Refrigeration */}
                  {configurableProperties && configurableProperties['Refrigeration'] && configurableProperties['Refrigeration'].length > 0 ? (
                    <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
                      <label className="text-sm font-bold text-gray-900">Refrigeration</label>
                      <select
                        className="w-full bg-white border border-gray-300 rounded px-3 py-2.5 text-sm text-gray-800 focus:border-[#004a99] focus:ring-1 focus:ring-[#004a99]/20 outline-none transition-all"
                        onChange={(e) => handleOptionChange('refrigeration', e.target.value)}
                      >
                        {configurableProperties['Refrigeration'].map((opt: any, idx: number) => (
                          <option key={idx} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
                      <label className="text-sm font-bold text-gray-900">Refrigeration</label>
                      <select
                        className="w-full bg-white border border-gray-300 rounded px-3 py-2.5 text-sm text-gray-800 focus:border-[#004a99] focus:ring-1 focus:ring-[#004a99]/20 outline-none transition-all"
                        onChange={(e) => handleOptionChange('refrigeration', e.target.value)}
                      >
                        <option>Top Mount - Indoor</option>
                        <option>Top Mount - Outdoor</option>
                        <option>Remote Refrigeration</option>
                        <option>Box Only (No Refrigeration)</option>
                      </select>
                    </div>
                  )}

                  {/* Floor Type */}
                  {configurableProperties && configurableProperties['Floor Type'] && configurableProperties['Floor Type'].length > 0 && (
                    <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
                      <label className="text-sm font-bold text-gray-900">Floor Type</label>
                      <select
                        className="w-full bg-white border border-gray-300 rounded px-3 py-2.5 text-sm text-gray-800 focus:border-[#004a99] focus:ring-1 focus:ring-[#004a99]/20 outline-none transition-all"
                        onChange={(e) => handleOptionChange('floorType', e.target.value)}
                      >
                        {configurableProperties['Floor Type'].map((opt: any, idx: number) => (
                          <option key={idx} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  )}




                </div>

                {/* Add-Ons Table */}
                <div className="border border-gray-200 rounded-sm overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h3 className="text-sm font-bold text-gray-900">Add-Ons</h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {addons && addons.length > 0 ? (
                      addons.map((addon: any, idx: number) => (
                        <div key={idx} className="grid grid-cols-[1fr_auto_auto] gap-4 items-center px-4 py-3">
                          <span className="text-sm text-gray-800">{addon.name}</span>
                          <span className="text-sm font-semibold text-gray-700">{addon.price_text}</span>
                          <select
                            className="w-16 border border-gray-300 rounded px-2 py-1.5 text-sm"
                            value={addonQuantities[addon.name] || 0}
                            onChange={(e) => setAddonQuantities(prev => ({ ...prev, [addon.name]: parseInt(e.target.value) }))}
                          >
                            {Array.from({ length: Math.min(addon.max_quantity || 10, 11) }, (_, i) => (
                              <option key={i} value={i}>{i}</option>
                            ))}
                          </select>
                        </div>
                      ))
                    ) : (
                      <>
                        {/* Default LED Light */}
                        <div className="grid grid-cols-[1fr_auto_auto] gap-4 items-center px-4 py-3">
                          <span className="text-sm text-gray-800">LED Light</span>
                          <span className="text-sm font-semibold text-gray-700">$150.00 / Ea.</span>
                          <select
                            className="w-16 border border-gray-300 rounded px-2 py-1.5 text-sm"
                            value={addonQuantities['LED Light'] || 0}
                            onChange={(e) => setAddonQuantities(prev => ({ ...prev, 'LED Light': parseInt(e.target.value) }))}
                          >
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                          </select>
                        </div>

                        {/* Default Door Kick Plate */}
                        <div className="grid grid-cols-[1fr_auto_auto] gap-4 items-center px-4 py-3">
                          <span className="text-sm text-gray-800">Door Kick Plate</span>
                          <span className="text-sm font-semibold text-gray-700">$160.00 / Ea.</span>
                          <select
                            className="w-16 border border-gray-300 rounded px-2 py-1.5 text-sm"
                            value={addonQuantities['Door Kick Plate'] || 0}
                            onChange={(e) => setAddonQuantities(prev => ({ ...prev, 'Door Kick Plate': parseInt(e.target.value) }))}
                          >
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                          </select>
                        </div>

                        {/* Default Exterior Ramp */}
                        <div className="grid grid-cols-[1fr_auto_auto] gap-4 items-center px-4 py-3">
                          <span className="text-sm text-gray-800">Exterior Ramp</span>
                          <span className="text-sm font-semibold text-gray-700">$911.00 / Ea.</span>
                          <select
                            className="w-16 border border-gray-300 rounded px-2 py-1.5 text-sm"
                            value={addonQuantities['Exterior Ramp'] || 0}
                            onChange={(e) => setAddonQuantities(prev => ({ ...prev, 'Exterior Ramp': parseInt(e.target.value) }))}
                          >
                            <option>0</option>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                          </select>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Layout Selection - Visual Grid */}
                {layouts && layouts.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-5">Layout</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {layouts.map((layout: any, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => handleOptionChange('layout', layout.value || layout.name)}
                          className={`relative cursor-pointer rounded-xl p-4 transition-all ${selectedOptions.layout === (layout.value || layout.name)
                            ? 'border-[2.5px] border-[#2563eb] bg-white shadow-sm'
                            : 'border-[2px] border-gray-200 bg-white hover:border-gray-300'
                            }`}
                        >
                          <div className="aspect-square bg-gray-50 rounded-lg mb-3 flex items-center justify-center p-4">
                            {layout.thumbnail || layout.preview_image ? (
                              <img
                                src={layout.thumbnail || layout.preview_image}
                                alt={layout.name}
                                className="object-contain w-full h-full max-w-full max-h-full"
                                onError={(e) => {
                                  console.error('Layout image failed to load:', layout.thumbnail || layout.preview_image);
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                No Image URL
                              </div>
                            )}
                          </div>

                          <p className="text-sm font-semibold text-center text-gray-900">
                            {layout.name}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}



                {/* Quantity & Add to Cart */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-gray-800">Quantity:</span>
                    <div className="flex items-center border border-gray-300 rounded">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        <Minus size={16} />
                      </button>
                      <div className="w-12 h-10 flex items-center justify-center border-x border-gray-300 text-sm font-semibold">
                        {quantity}
                      </div>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      addToCart({
                        id: product.id,
                        name: product.title,
                        brand: product.brand || 'Astra',
                        price: totalPrice,
                        image: product.images[0] || '/placeholder.png',
                        quantity: quantity,
                        category: 'walk-in-cooler-freezer',
                        selectedOptions: {
                          ...selectedOptions,
                          layout: selectedOptions.layout || (layouts.length > 0 ? (layouts[0].value || layouts[0].name) : undefined),
                        },
                        addonQuantities: addonQuantities,
                      });
                      router.push('/cart');
                    }}
                    className="bg-[#cf3601] w-full cursor-pointer text-white py-3.5 px-4 font-bold rounded hover:bg-[#b32d00] transition-colors tracking-wide text-sm uppercase shadow-sm"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
              {/* Walk-In Cooler & Freezer FAQs */}
              <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h2 className="text-base font-bold text-gray-900">Walk-In Cooler & Freezer FAQs</h2>
                </div>
                {faqs && faqs.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {faqs.map((faq: any, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                        className="w-full text-left"
                      >
                        <div className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors">
                          <h3 className="text-sm font-semibold text-gray-900 pr-4">{faq.question}</h3>
                          <Plus
                            size={18}
                            className={`text-[#004a99] flex-shrink-0 transition-transform ${openFaqIndex === idx ? 'rotate-45' : ''
                              }`}
                          />
                        </div>
                        {openFaqIndex === idx && (
                          <div className="px-4 pb-3 text-xs text-gray-700 leading-relaxed">
                            {faq.answer}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-gray-500">
                    No FAQs available for this product.
                  </div>
                )}
              </div>

              {/* Product Specifications */}
              <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h2 className="text-base font-bold text-gray-900">Product Specifications</h2>
                </div>
                {specifications && Object.keys(specifications).length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
                    {/* Left Column */}
                    <div className="divide-y divide-gray-200">
                      {Object.entries(specifications).slice(0, Math.ceil(Object.keys(specifications).length / 2)).map(([key, value]: [string, any], idx) => (
                        <div key={idx} className="px-4 py-2.5">
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-0.5">{key}</p>
                          <p className="text-sm text-gray-900">{value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Right Column */}
                    <div className="divide-y divide-gray-200">
                      {Object.entries(specifications).slice(Math.ceil(Object.keys(specifications).length / 2)).map(([key, value]: [string, any], idx) => (
                        <div key={idx} className="px-4 py-2.5">
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-0.5">{key}</p>
                          <p className="text-sm text-gray-900">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-gray-500">
                    No specifications available for this product.
                  </div>
                )}
              </div>

              {/* Resources & Documents */}
              {(enrichedProduct.documents as any)?.resources && (enrichedProduct.documents as any).resources.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
                  <div className="px-3 py-2 border-b border-gray-200">
                    <h2 className="text-sm font-bold text-gray-900">Resources & Documents</h2>
                  </div>
                  <div className="p-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {(enrichedProduct.documents as any).resources.map((resource: any, idx: number) => (
                        <a
                          key={idx}
                          href={resource.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group block bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:border-[#004a99] hover:shadow-lg transition-all"
                        >
                          <div className="relative w-full aspect-[3/4] bg-gray-50 p-1.5">
                            {resource.preview_image ? (
                              <div className="relative w-full h-full">
                                <Image
                                  src={resource.preview_image}
                                  alt={resource.name}
                                  fill
                                  className="object-contain"
                                  sizes="250px"
                                />
                              </div>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <FileText size={64} className="text-gray-300" />
                              </div>
                            )}
                            <div className="absolute bottom-1.5 right-1.5 bg-[#3b4d63] text-white px-1.5 py-0.5 rounded text-[9px] font-bold shadow-md">
                              PDF
                            </div>
                          </div>
                          <div className="px-2.5 py-1.5 bg-white">
                            <h3 className="text-xs font-bold text-gray-900 group-hover:text-[#004a99] transition-colors">
                              {resource.name}
                            </h3>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {/* Product Certifications */}
              {certifications && certifications.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-sm p-4 sm:p-5">
                  <h3 className="text-sm font-bold text-gray-900 mb-4">Product Certifications</h3>
                  <div className="grid grid-cols-4 gap-3">
                    {certifications.map((cert: any, idx: number) => (
                      <div key={idx} className="flex flex-col items-center gap-1.5">
                        <div className="w-16 h-16 flex items-center justify-center">
                          <Image
                            src={cert.src}
                            alt={cert.alt}
                            width={64}
                            height={64}
                            className="object-contain"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors cursor-pointer z-10"
          >
            <X size={24} className="text-white" />
          </button>
          <div className="relative max-w-4xl max-h-[85vh] w-full" onClick={(e) => e.stopPropagation()}>
            <div className="relative w-full h-[70vh] bg-white rounded-lg overflow-hidden">
              <Image
                src={product.images[activeImageIndex]}
                alt={product.title}
                fill
                className="object-contain p-8"
                sizes="80vw"
              />
            </div>
            {product.images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImageIndex((activeImageIndex - 1 + product.images.length) % product.images.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-md hover:bg-white transition-colors cursor-pointer"
                >
                  <ChevronLeft size={20} className="text-gray-800" />
                </button>
                <button
                  onClick={() => setActiveImageIndex((activeImageIndex + 1) % product.images.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-md hover:bg-white transition-colors cursor-pointer"
                >
                  <ChevronRight size={20} className="text-gray-800" />
                </button>
              </>
            )}
            <div className="flex gap-2 justify-center mt-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIndex(i)}
                  className={`w-14 h-14 rounded border-2 overflow-hidden relative ${i === activeImageIndex ? 'border-white' : 'border-white/30 hover:border-white/60'
                    } cursor-pointer transition-all`}
                >
                  <Image src={img} alt="" fill className="object-contain p-1 bg-white" sizes="56px" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

// CollapsibleSection Component
function CollapsibleSection({
  title,
  isOpen,
  onToggle,
  children
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white border border-gray-200 rounded-sm overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center cursor-pointer justify-between p-5 sm:p-6 text-left hover:bg-gray-50/50 transition-colors"
      >
        <h2 className="text-lg font-bold text-[#000000]">{title}</h2>
        {isOpen ? (
          <Minus size={20} className="text-gray-500 shrink-0" />
        ) : (
          <Plus size={20} className="text-gray-500 shrink-0" />
        )}
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-5 sm:px-6 pb-6">
          {children}
        </div>
      </div>
    </section>
  );
}
