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
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/10 to-transparent"></div>
          </div>
        ))}
      </div>

      {/* Left-Aligned Text Overlay */}
      <div className="container relative z-10 h-full flex items-center">
        <div className="max-w-4xl pt-4 md:pt-10">
          <div className="space-y-6 md:space-y-8">
            {/* Main Headline with provided image style */}
            <h1 className="text-4xl sm:text-6xl md:text-[90px] font-semibold text-white uppercase tracking-tighter leading-[0.85] drop-shadow-[0_5px_15px_rgba(0,0,0,0.4)]">
              YOUR <span className="text-accent inline-block relative">
                TOTAL
                <div className="absolute bottom-0 left-0 w-full h-2 md:h-3 bg-primary"></div>
              </span> <br />
              REFRIGERATION <br />
              SOLUTIONS
            </h1>

            {/* Sub-headline from content */}
            <p className="text-white font-medium text-lg md:text-2xl tracking-tight max-w-2xl drop-shadow-md transition-all duration-500">
              {sliderImages[currentSlide].subtitle}
            </p>

            {/* Action Buttons matching reference image */}
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 pt-4">
              <Link
                href="/products"
                className="bg-primary hover:bg-blue-700 text-white px-8 md:px-12 py-4 md:py-5 rounded-lg font-semibold text-sm md:text-lg uppercase tracking-widest flex items-center justify-center gap-3 transition-all hover:scale-105 transform shadow-lg cursor-pointer"
              >
                Explore Products
              </Link>
              <Link
                href="/quote"
                className="bg-white hover:bg-gray-100 text-primary px-8 md:px-12 py-4 md:py-5 rounded-lg font-semibold text-sm md:text-lg uppercase tracking-widest flex items-center justify-center gap-3 transition-all hover:scale-105 transform shadow-lg cursor-pointer"
              >
                <Search size={24} className="text-primary" /> Request a Quote
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
