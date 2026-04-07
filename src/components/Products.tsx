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
    href: '/products/glassdoor-walk-in-cooler'
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
      className="group flex flex-col h-full bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg hover:border-primary transition-all overflow-hidden focus:outline-none focus:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Internal Slider */}
      <div className="relative h-52 overflow-hidden">
        {product.images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`${product.title} ${idx + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${idx === currentImage ? 'opacity-100 scale-100' : 'opacity-0'
              }`}
          />
        ))}

        {/* Slider Controls */}
        <div className="absolute inset-0 flex items-center justify-between p-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={prevImage}
            className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center hover:bg-primary transition-all cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={handleNextClick}
            className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center hover:bg-primary transition-all cursor-pointer"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
          {product.images.map((_, idx) => (
            <div
              key={idx}
              className={`h-0.5 rounded-full transition-all duration-300 ${idx === currentImage ? 'w-3 bg-primary' : 'w-1 bg-white/50'
                }`}
            />
          ))}
        </div>

        <div className="absolute top-3 left-3">
          <span className="bg-primary text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-xl">
            {product.tag}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col grow">
        <h3 className="text-xl font-black text-gray-900 mb-3 group-hover:text-primary transition-colors tracking-tight uppercase">
          {product.title}
        </h3>
        <p className="text-gray-600 text-[13px] md:text-[14px] leading-relaxed font-medium line-clamp-3">
          {product.description}
        </p>
        <div className="mt-auto flex justify-end items-center pt-5 border-t border-gray-100 mt-6">
          <span className="inline-flex items-center gap-2 text-primary text-[11px] font-black uppercase tracking-widest">
            View Details <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function Products() {
  return (
    <section id="products" className="py-16 md:py-24 bg-white">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-4xl mx-auto mb-12 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight uppercase flex flex-wrap items-center justify-center gap-2 md:gap-3">
            <span className="text-[#171717]">Featured</span>
            <span className="text-primary">Products</span>
          </h2>
          <div className="h-1.5 w-16 bg-accent mx-auto mt-4 rounded-full"></div>
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
