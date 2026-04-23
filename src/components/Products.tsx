"use client";

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const products = [
  {
    id: 1,
    title: 'Walk-in Cooler & Freezer',
    description: 'Custom walk-in coolers, freezers, and combo units built for maximum efficiency and durability. Our systems are engineered for restaurants, supermarkets, and warehouses, featuring standard or floor-mounted options with premium doors and reliable insulation.',
    images: ['/products/product_1.jpg', '/slider/s_1.jpeg', '/slider/s_2.jpeg'],
    tag: 'Best Seller',
    href: '/walk-in-cooler-freezer'
  },
  {
    id: 2,
    title: 'Glassdoor Walk-in Cooler',
    description: 'Premium glass-door display coolers and freezers perfect for retail and grocery stores. These high-visibility units combine elegant design with advanced cooling performance, including custom shelving solutions and energy-efficient glass panels.',
    images: ['/products/product_2.jpg', '/slider/s_3.jpeg', '/slider/s_1.jpeg'],
    tag: 'Retail Special',
    href: '/walk-in-cooler-freezer/walk-in-coolers'
  },
  {
    id: 3,
    title: 'Refrigeration Equipment',
    description: 'Featuring industry-leading systems like Turbo AIR and Package Unit SMART 7. Our inventory includes low-profile evaporators, condensing units, and high-performance medium/low temp systems designed for seamless integration and expert cooling.',
    images: ['/slider/s_2.jpeg', '/slider/s_1.jpeg', '/products/product_1.jpg'],
    tag: 'Advanced Tech',
    href: '/refrigeration-equipment'
  }
];

function ProductCard({ product }: { product: typeof products[0] }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextImage = useCallback(() => {
    setCurrentImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
  }, [product.images.length]);

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  };

  const handleNextClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    nextImage();
  };

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(nextImage, 4000);
    return () => clearInterval(timer);
  }, [nextImage, isHovered]);

  return (
    <Link
      href={product.href}
      className="group flex flex-col h-full bg-white border border-gray-100 rounded-sm shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all duration-500 overflow-hidden focus:outline-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Internal Slider */}
      <div className="relative h-64 overflow-hidden">
        {product.images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`${product.title} ${idx + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${idx === currentImage ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
              }`}
          />
        ))}

        {/* Overlay for depth */}
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Slider Controls */}
        <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={prevImage}
            className="w-9 h-9 rounded-sm bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-primary transition-all cursor-pointer shadow-lg"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={handleNextClick}
            className="w-9 h-9 rounded-sm bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-primary transition-all cursor-pointer shadow-lg"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {product.images.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 rounded-sm transition-all duration-500 ${idx === currentImage ? 'w-6 bg-white' : 'w-2 bg-white/40'
                }`}
            />
          ))}
        </div>

        <div className="absolute top-4 left-4 z-10">
          <span className="bg-primary/90 backdrop-blur-md text-white text-[10px] font-black px-4 py-1.5 rounded-sm uppercase tracking-widest shadow-2xl border border-white/10">
            {product.tag}
          </span>
        </div>
      </div>

      <div className="p-7 flex flex-col grow relative">
        <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-4 group-hover:text-primary transition-colors tracking-tight uppercase leading-tight">
          {product.title}
        </h3>
        <p className="text-slate-500 text-[14px] leading-relaxed font-medium line-clamp-3 mb-6">
          {product.description}
        </p>
        <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-50">
          <span className="inline-flex items-center gap-2 text-primary text-[11px] font-black uppercase tracking-[0.2em] group-hover:gap-3 transition-all duration-300">
            View Details <ArrowRight size={14} className="stroke-[3px]" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function Products() {
  return (
    <section id="products" className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50/50 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <pattern id="dots" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="currentColor" />
          </pattern>
          <rect width="100" height="100" fill="url(#dots)" />
        </svg>
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-12 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight uppercase flex flex-wrap items-center justify-center gap-2 md:gap-3">
            <span className="text-[#171717]">Featured</span>
            <span className="text-primary">Products</span>
          </h2>
          <div className="h-1.5 w-16 bg-accent mx-auto mt-4 rounded-sm"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
