"use client";

import { useState, useEffect, useCallback } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const products = [
  {
    id: 1,
    title: 'Walk-in Cooler & Freezer',
    description: 'Custom walk-in coolers, freezers, and combo units built for maximum efficiency and durability. Our systems are engineered for restaurants, supermarkets, and warehouses, featuring standard or floor-mounted options with premium doors and reliable insulation.',
    images: ['/products/product_1.jpg', '/slider/s_1.jpeg', '/slider/s_2.jpeg'],
    tag: 'Best Seller',
  },
  {
    id: 2,
    title: 'Glassdoor Walk-in Cooler',
    description: 'Premium glass-door display coolers and freezers perfect for retail and grocery stores. These high-visibility units combine elegant design with advanced cooling performance, including custom shelving solutions and energy-efficient glass panels.',
    images: ['/products/product_2.jpg', '/slider/s_3.jpeg', '/slider/s_1.jpeg'],
    tag: 'Retail Special',
  },
  {
    id: 3,
    title: 'Refrigeration Equipment',
    description: 'Featuring industry-leading systems like Turbo AIR and Package Unit SMART 7. Our inventory includes low-profile evaporators, condensing units, and high-performance medium/low temp systems designed for seamless integration and expert cooling.',
    images: ['/slider/s_2.jpeg', '/slider/s_1.jpeg', '/products/product_1.jpg'],
    tag: 'Advanced Tech',
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
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 group border border-gray-100 flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Internal Slider */}
      <div className="relative h-72 overflow-hidden">
        {product.images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`${product.title} ${idx + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${idx === currentImage ? 'opacity-100 scale-105' : 'opacity-0'
              }`}
          />
        ))}

        {/* Slider Controls */}
        <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={prevImage}
            className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center hover:bg-primary transition-all cursor-pointer"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={handleNextClick}
            className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center hover:bg-primary transition-all cursor-pointer"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          {product.images.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 rounded-full transition-all duration-300 ${idx === currentImage ? 'w-4 bg-primary' : 'w-1.5 bg-white/50'
                }`}
            />
          ))}
        </div>

        <div className="absolute top-4 left-4">
          <span className="bg-primary text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-xl">
            {product.tag}
          </span>
        </div>
      </div>

      <div className="p-8 flex flex-col grow">
        <h3 className="text-2xl font-black text-gray-900 mb-6 group-hover:text-primary transition-colors tracking-tight uppercase">
          {product.title}
        </h3>
        <p className="text-gray-600 text-[14px] md:text-[15px] leading-relaxed font-medium">
          {product.description}
        </p>
        <div className="mt-auto flex justify-end items-center pt-8 border-t border-gray-100 mt-8">
          <button className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 transform cursor-pointer">
            Learn More <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {products.map((product, index) => (
            <div
              key={index}
              className="group bg-white rounded-[24px] md:rounded-[32px] p-6 md:p-10 border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2 flex flex-col"
            >
              <div className="mb-6 md:mb-8 relative aspect-square overflow-hidden rounded-2xl bg-gray-50 flex items-center justify-center p-6 md:p-10">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-white/90 backdrop-blur-md text-[10px] font-bold text-primary px-3 py-1 rounded-full shadow-sm border border-gray-100 uppercase tracking-wider">
                    In Stock
                  </span>
                </div>
              </div>

              <div className="flex-grow">
                <h3 className="text-xl md:text-2xl font-black text-[#171717] mb-3 md:mb-4 group-hover:text-primary transition-colors uppercase tracking-tight">
                  {product.title}
                </h3>
                <p className="text-gray-600 text-[14px] md:text-[15px] leading-relaxed font-medium mb-6 md:mb-8 line-clamp-3">
                  {product.description}
                </p>
              </div>

              <button
                className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-sm md:text-base hover:bg-primary transition-all duration-300 shadow-lg shadow-gray-200 group/btn cursor-pointer"
              >
                View Details
                <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
