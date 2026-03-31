"use client";

import { useState, useEffect, useCallback } from 'react';
import { ArrowRight, Search, FileText } from 'lucide-react';
import Link from 'next/link';

const sliderImages = [
  {
    url: '/slider/s_1.jpeg',
    title: 'ICEMANZ Walk-In Cooler & Freezer',
    subtitle: 'Fast. Reliable. Built for Performance.',
  },
  {
    url: '/slider/s_2.jpeg',
    title: 'Custom Modular Solutions',
    subtitle: 'Tailored to fit your business perfectly.',
  },
  {
    url: '/slider/s_3.jpeg',
    title: '36-48 Hour Quick Ship',
    subtitle: 'Get your cooling solutions delivered fast.',
  }
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === sliderImages.length - 1 ? 0 : prev + 1));
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="relative h-[550px] sm:h-[600px] md:h-[720px] w-full overflow-hidden bg-gray-950 mt-[70px] md:mt-[100px]">
      {/* Background Slides */}
      <div className="absolute inset-0 z-0">
        {sliderImages.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <img
              src={slide.url}
              alt={slide.title}
              className="w-full h-full object-cover object-center scale-105"
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
        ))}
      </div>

      {/* Centered Text Overlay */}
      <div className="container relative z-10 h-full flex items-center justify-center">
        <div className="max-w-4xl pt-4 md:pt-10 text-center">
          <div className="space-y-10 md:space-y-12">
            {/* Main Headline following reference image */}
            <h1 className="text-4xl sm:text-5xl md:text-[84px] font-black text-white uppercase tracking-tight leading-[0.9] md:leading-[0.9] px-2 max-w-[95vw] mx-auto drop-shadow-2xl">
              YOUR <span className="text-accent relative inline-block">
                TOTAL
                <div className="absolute -bottom-1 md:bottom-2 left-0 w-full h-1 md:h-2 bg-primary"></div>
              </span> <br />
              REFRIGERATION <br />
              SOLUTIONS
            </h1>

            {/* Action Buttons following reference image */}
            <div className="flex flex-col sm:flex-row gap-4 px-4 sm:px-0 justify-center">
              <Link
                href="/products"
                className="bg-primary hover:bg-blue-800 text-white px-6 md:px-8 py-3 md:py-3.5 rounded-xl font-black text-sm md:text-base uppercase tracking-widest flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-2xl cursor-pointer w-full sm:w-auto min-w-[240px]"
              >
                EXPLORE PRODUCTS
              </Link>
              <Link
                href="/quote"
                className="bg-white hover:bg-gray-50 text-primary px-6 md:px-8 py-3 md:py-3.5 rounded-xl font-black text-sm md:text-base uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all hover:scale-105 active:scale-95 shadow-2xl cursor-pointer w-full sm:w-auto min-w-[240px]"
              >
                <Search size={20} className="text-primary stroke-[3px]" /> REQUEST A QUOTE
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
