"use client";

import Header from '@/components/Header';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import {
  PhoneCall,
  FileText,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
  Facebook,
  Twitter,
  Mail,
  Share2,
  ShieldCheck,
  Truck
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
  description?: string;
  keyFeatures?: string;
  sku?: string;
  documents?: { name: string; url: string }[];
  specs?: any;
  features?: {
    hp?: string;
    temperatureType?: string;
    specifications?: any;
    features?: string[];
    warranty?: string[];
    cutSheetUrl?: string;
    manualUrl?: string;
  };
};

type RelatedProduct = {
  id: string;
  title: string;
  images: string[];
  price?: string;
  slug?: string;
  brand?: string;
};

export default function CondensingUnitProductClient({
  product,
  relatedProducts
}: {
  product: Product;
  relatedProducts: RelatedProduct[];
}) {
  const { addToCart } = useCart();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    features: true,
    specs: true,
    warranty: true,
    documents: true
  });

  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.title,
      price: parseFloat(product.price || '0'),
      quantity,
      image: product.images[0] || '/placeholder.png'
    });
  };

  const cleanPrice = (price: string) => {
    const num = parseFloat(price);
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center space-x-2 text-sm">
              <Link href="/" className="text-gray-600 hover:text-primary">Home</Link>
              <span className="text-gray-400">/</span>
              <Link href="/condensing-units" className="text-gray-600 hover:text-primary">Condensing Units</Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900">{product.title}</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Left Column - Images */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={product.images[activeImageIndex] || '/placeholder.png'}
                  alt={product.title}
                  fill
                  className="object-contain p-8"
                />
                {product.badge && (
                  <span className="absolute top-4 left-4 bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold">
                    {product.badge}
                  </span>
                )}
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-20 flex-shrink-0 rounded border-2 overflow-hidden ${
                        idx === activeImageIndex ? 'border-primary' : 'border-gray-200'
                      }`}
                    >
                      <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-contain p-2" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column - Product Info */}
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">{product.brand?.toUpperCase() || 'TURBO AIR'}</p>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
                {product.sku && (
                  <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                )}
              </div>

              {/* Key Specs */}
              <div className="flex flex-wrap gap-3">
                {product.features?.hp && (
                  <div className="bg-gray-100 px-4 py-2 rounded-lg">
                    <p className="text-xs text-gray-600">Horsepower</p>
                    <p className="text-sm font-semibold">{product.features.hp}</p>
                  </div>
                )}
                {product.features?.temperatureType && (
                  <div className="bg-blue-100 px-4 py-2 rounded-lg">
                    <p className="text-xs text-gray-600">Temperature</p>
                    <p className="text-sm font-semibold text-blue-900">{product.features.temperatureType}</p>
                  </div>
                )}
              </div>

              {/* Lead Time & Price Match */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-blue-600 border border-blue-200 bg-blue-50 rounded px-4 py-2">
                  <Truck size={18} />
                  <span className="text-sm font-semibold">🚚 Lead Time - Usually Ships in 2 - 5 Days</span>
                </div>
                <div className="flex items-center gap-2 text-green-600 border border-green-200 bg-green-50 rounded px-4 py-2">
                  <CheckCircle2 size={18} />
                  <span className="text-sm font-semibold">✅ Price Match - Call Us For Best Price!</span>
                </div>
              </div>

              {/* Price */}
              <div className="border-t border-b py-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm text-gray-600">Price:</span>
                  <span className="text-3xl font-bold text-primary">${cleanPrice(product.price)}</span>
                </div>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-semibold text-gray-700">Quantity:</label>
                  <div className="flex items-center border border-gray-300 rounded">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-gray-100"
                    >
                      <Minus size={18} />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 text-center border-x border-gray-300"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 hover:bg-gray-100"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full bg-primary text-white py-3 rounded font-semibold hover:bg-primary/90 transition-colors"
                >
                  Add to Cart
                </button>

                <button className="w-full bg-primary text-white py-3 rounded font-semibold hover:bg-primary/90 transition-colors">
                  Buy with ShopPay
                </button>

                <Link
                  href="/quote"
                  className="block w-full text-center border-2 border-primary text-primary py-3 rounded font-semibold hover:bg-primary hover:text-white transition-colors"
                >
                  Request a Quote
                </Link>
              </div>

              {/* Share */}
              <div className="flex items-center gap-3 pt-4 border-t">
                <span className="text-sm text-gray-600">Share:</span>
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <Facebook size={18} className="text-blue-600" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <Twitter size={18} className="text-blue-400" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <Mail size={18} className="text-gray-600" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <Share2 size={18} className="text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Product Details Sections */}
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Features Section */}
            {product.features?.features && product.features.features.length > 0 && (
              <div className="bg-white border rounded-lg">
                <button
                  onClick={() => toggleSection('features')}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                >
                  <h3 className="text-xl font-semibold">Features</h3>
                  {expandedSections.features ? <ChevronUp /> : <ChevronDown />}
                </button>
                {expandedSections.features && (
                  <div className="p-4 border-t">
                    <ul className="space-y-2">
                      {product.features.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Specifications Section */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="bg-white border rounded-lg">
                <button
                  onClick={() => toggleSection('specs')}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                >
                  <h3 className="text-xl font-semibold">Specifications</h3>
                  {expandedSections.specs ? <ChevronUp /> : <ChevronDown />}
                </button>
                {expandedSections.specs && (
                  <div className="p-4 border-t">
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(product.specs).map(([key, value]) => (
                        <div key={key} className="flex flex-col">
                          <dt className="text-sm font-semibold text-gray-600">{key}</dt>
                          <dd className="text-gray-900">{value as string}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}
              </div>
            )}

            {/* Warranty Section */}
            {product.features?.warranty && product.features.warranty.length > 0 && (
              <div className="bg-white border rounded-lg">
                <button
                  onClick={() => toggleSection('warranty')}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                >
                  <h3 className="text-xl font-semibold">Warranty</h3>
                  {expandedSections.warranty ? <ChevronUp /> : <ChevronDown />}
                </button>
                {expandedSections.warranty && (
                  <div className="p-4 border-t">
                    <ul className="space-y-2">
                      {product.features.warranty.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <ShieldCheck size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Product Attachments */}
            {product.documents && product.documents.length > 0 && (
              <div className="bg-white border rounded-lg">
                <button
                  onClick={() => toggleSection('documents')}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                >
                  <h3 className="text-xl font-semibold">Product Attachments</h3>
                  {expandedSections.documents ? <ChevronUp /> : <ChevronDown />}
                </button>
                {expandedSections.documents && (
                  <div className="p-4 border-t space-y-3">
                    {product.documents.map((doc, idx) => (
                      <a
                        key={idx}
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 border rounded hover:bg-gray-50 transition-colors"
                      >
                        <FileText size={24} className="text-gray-600" />
                        <div>
                          <p className="font-semibold text-gray-900">{doc.name}</p>
                          <p className="text-xs text-gray-500">PDF Document</p>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.slice(0, 4).map((relProd) => (
                  <Link
                    key={relProd.id}
                    href={`/condensing-units/${relProd.slug}/${relProd.id}`}
                    className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative h-48 bg-gray-100">
                      <Image
                        src={relProd.images[0] || '/placeholder.png'}
                        alt={relProd.title}
                        fill
                        className="object-contain p-4"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{relProd.title}</h3>
                      {relProd.price && (
                        <p className="text-xl font-bold text-primary">
                          ${cleanPrice(relProd.price)}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
