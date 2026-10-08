"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';

const products = [
  {
    id: 1,
    title: 'Walk-in Cooler & Freezer',
    description: 'Custom walk-in coolers, freezers, and combo units built for maximum efficiency and durability. Our systems are engineered for restaurants, supermarkets, and warehouses, featuring standard or floor-mounted options with premium doors and reliable insulation.',
    images: ['/products/product_1.jpg', '/slider/s_1.jpeg', '/slider/s_2.jpeg'],
    tag: 'Best Seller',
    tagColor: 'bg-blue-600',
    href: '/walk-in-cooler-freezer/walk-in-cooler-no-floor'
  },
  {
    id: 2,
    title: 'Glassdoor Walk-in Cooler',
    description: 'Premium glass-door display coolers and freezers perfect for retail and grocery stores. These high-visibility units combine elegant design with advanced cooling performance, including custom shelving solutions and energy-efficient glass panels.',
    images: ['/slider/s_3.jpeg', '/slider/s_1.jpeg'],
    tag: 'Retail Special',
    tagColor: 'bg-emerald-600',
    href: '/glassdoor-walk-in-cooler'
  },
  {
    id: 3,
    title: 'Refrigeration Equipment',
    description: 'Featuring industry-leading systems like Turbo AIR and Package Unit SMART 7. Our inventory includes low-profile evaporators, condensing units, and high-performance medium/low temp systems designed for seamless integration and expert cooling.',
    images: ['/slider/s_2.jpeg', '/slider/s_1.jpeg', '/products/product_1.jpg'],
    tag: 'Advanced Tech',
    tagColor: 'bg-gray-900',
    href: '/refrigeration-equipment'
  }
];

function ProductCard({ product }: { product: typeof products[0] }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextImage = useCallback(() => {
    setCurrentImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
  }, [product.images.length]);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(nextImage, 4000);
    return () => clearInterval(timer);
  }, [nextImage, isHovered]);

  return (
    <Link
      href={product.href}
      className="group flex flex-col h-full bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.12)] transition-all duration-500 overflow-hidden focus:outline-none hover:-translate-y-2 border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with Slider */}
      <div className="relative h-[280px] w-full overflow-hidden bg-gray-100">
        {product.images.map((img, idx) => (
          <Image
            key={idx}
            src={img}
            alt={`${product.title} ${idx + 1}`}
            fill
            className={`object-cover transition-all duration-1000 ease-in-out ${
              idx === currentImage ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            }`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={idx === 0}
          />
        ))}

        {/* Gradient Overlay for Depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/20 opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Badge */}
        <div className="absolute top-5 left-5 z-10">
          <span className={`${product.tagColor} text-white text-xs font-bold px-3 py-1.5 rounded uppercase tracking-wider shadow-md backdrop-blur-sm bg-opacity-90`}>
            {product.tag}
          </span>
        </div>

        {/* Slider Indicators (Dots) */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {product.images.map((_, idx) => (
            <div
              key={idx}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentImage(idx);
              }}
              className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                idx === currentImage ? 'w-6 bg-blue-500' : 'w-2 bg-white/60 hover:bg-white'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content Container */}
      <div className="p-8 flex flex-col flex-grow relative">
        <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300 tracking-tight leading-tight">
          {product.title}
        </h3>
        
        <p className="text-gray-600 text-[15px] leading-relaxed mb-8 flex-grow line-clamp-3">
          {product.description}
        </p>
        
        {/* Animated View Details Button */}
        <div className="mt-auto pt-6 border-t border-gray-100">
          <div className="inline-flex items-center justify-between w-full text-sm font-bold uppercase tracking-wider text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
            <span>View Details</span>
            <span className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors duration-300">
              <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Products() {
  return (
    <section id="products" className="py-20 md:py-28 bg-gray-50/50 relative overflow-hidden">
      {/* Background Dots Pattern */}
      <div className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

      <div className="container px-4 md:px-6 mx-auto max-w-7xl relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 uppercase tracking-tight mb-4">
            Featured <span className="text-blue-600">Products</span>
          </h2>
          <div className="w-24 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
          <p className="mt-6 text-gray-600 text-lg leading-relaxed">
            Explore our premium selection of commercial refrigeration solutions tailored for your business needs.
          </p>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
      </div>
    </section>
  );
}