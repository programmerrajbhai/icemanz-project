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
        <div className="max-w-6xl pt-4 md:pt-10 text-center">
          <div className="space-y-6 md:space-y-10">
            {/* Main Headline matching reference image style but in 2 lines */}
            <h1 className="text-4xl sm:text-5xl md:text-[72px] font-extrabold text-white uppercase tracking-tighter leading-tight md:leading-[1.05] drop-shadow-[0_5px_15px_rgba(0,0,0,0.4)] px-4 sm:px-2 max-w-[90vw] mx-auto">
              YOUR <span className="text-accent inline-block relative">
                TOTAL
                <div className="absolute bottom-0 md:bottom-2 left-0 w-full h-1 md:h-2 bg-primary"></div>
              </span> REFRIGERATION <br className="hidden sm:block" />
              SOLUTIONS
            </h1>

            {/* Action Buttons matching reference image */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4 justify-center">
              <Link
                href="/products"
                className="bg-primary hover:bg-blue-700 text-white px-6 md:px-10 py-3 md:py-4 rounded-lg font-bold text-xs md:text-[15px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:scale-105 transform shadow-lg cursor-pointer"
              >
                Explore Products
              </Link>
              <Link
                href="https://www.barrinc.com/quote-request/5868"
                className="bg-white hover:bg-gray-100 text-primary px-6 md:px-10 py-3 md:py-4 rounded-lg font-bold text-xs md:text-[15px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:scale-105 transform shadow-lg cursor-pointer"
              >
                <Search size={20} className="text-primary" /> Request a Quote
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
