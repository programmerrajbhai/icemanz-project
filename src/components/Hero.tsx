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
            <div className="absolute inset-0 bg-black/60 md:bg-black/50"></div>
          </div>
        ))}
      </div>

      {/* Centered Text Overlay */}
      <div className="container relative z-10 h-full flex items-center justify-center">
        <div className="max-w-4xl pt-4 md:pt-10 text-center">
          <div className="space-y-6 md:space-y-8">
            <h1 className="text-3xl sm:text-4xl md:text-[72px] font-black text-white uppercase tracking-tighter leading-[1.1] md:leading-[0.95] drop-shadow-2xl">
              YOUR <span className="text-accent">TOTAL</span> <br className="hidden sm:block" />
              REFRIGERATION <br className="hidden sm:block" />
              <span className="text-accent">SOLUTIONS</span>
            </h1>

            <div className="hidden md:flex flex-wrap justify-center gap-x-6 gap-y-3 text-white/80 font-bold text-xs md:text-base tracking-widest uppercase">
              <span className="flex items-center gap-2 group">
                <div className="w-1.5 h-1.5 rounded-full bg-accent group-hover:scale-150 transition-transform"></div>
                WALK-IN COOLER
              </span>
              <span className="flex items-center gap-2 group">
                <div className="w-1.5 h-1.5 rounded-full bg-accent group-hover:scale-150 transition-transform"></div>
                WALK-IN FREEZER
              </span>
              <span className="flex items-center gap-2 group">
                <div className="w-1.5 h-1.5 rounded-full bg-accent group-hover:scale-150 transition-transform"></div>
                CONDENSING UNIT
              </span>
              <span className="flex items-center gap-2 group">
                <div className="w-1.5 h-1.5 rounded-full bg-accent group-hover:scale-150 transition-transform"></div>
                COMMERCIAL HVAC
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4 md:pt-6 justify-center px-6 sm:px-0">
              <Link
                href="/products"
                className="w-full sm:w-auto bg-primary hover:bg-blue-700 text-white px-8 md:px-10 py-3.5 md:py-4.5 rounded-xl font-black text-[11px] md:text-[15px] uppercase tracking-[0.15em] flex items-center justify-center gap-3 transition-all hover:scale-105 transform shadow-2xl shadow-primary/40 cursor-pointer"
              >
                Explore Products <ArrowRight size={16} className="md:w-[18px] md:h-[18px]" />
              </Link>
              <Link
                href="/quote"
                className="w-full sm:w-auto bg-white hover:bg-gray-100 text-primary px-8 md:px-10 py-3.5 md:py-4.5 rounded-xl font-black text-[11px] md:text-[15px] uppercase tracking-[0.15em] flex items-center justify-center gap-3 transition-all hover:scale-105 transform shadow-2xl cursor-pointer"
              >
                <Search size={16} className="text-primary md:w-[18px] md:h-[18px]" /> Request a Quote
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
