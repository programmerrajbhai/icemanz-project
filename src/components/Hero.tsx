"use client";

import { useState, useEffect, useCallback } from 'react';
import { ArrowRight, Search, FileText, ChevronLeft, ChevronRight, Phone } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

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
    <section className="relative h-[480px] sm:h-[540px] md:h-[620px] w-full overflow-hidden bg-gray-950 mt-[70px] md:mt-[100px]">
      {/* Background Slides */}
      <div className="absolute inset-0 z-0">
        {sliderImages.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <Image
              src={slide.url}
              alt={slide.title}
              fill
              priority={index === 0}
              className="object-cover object-center scale-105"
              sizes="100vw"
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
            <h1 className="text-4xl sm:text-5xl md:text-[64px] font-black text-white uppercase tracking-tight leading-[0.9] md:leading-[0.9] px-2 max-w-[95vw] mx-auto drop-shadow-2xl">
              YOUR TOTAL <br />
              REFRIGERATION SOLUTIONS
            </h1>

            {/* Action Buttons using Preline Styles */}
            <div className="flex flex-col sm:flex-row gap-4 px-4 sm:px-0 justify-center">
              <Link
                href="/walk-in-cooler-freezer/walk-in-cooler-no-floor"
                className="py-4 px-10 inline-flex justify-center items-center gap-x-2 text-sm font-black rounded-sm border border-transparent bg-primary text-white hover:bg-blue-600 focus:outline-none focus:bg-blue-600 disabled:opacity-50 disabled:pointer-events-none cursor-pointer transition-all uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(0,74,153,0.3)] hover:shadow-[0_0_30px_rgba(0,74,153,0.5)] active:scale-[0.98]"
              >
                Explore Products
              </Link>
              <Link
                href="/quote"
                className="py-4 px-10 inline-flex justify-center items-center gap-x-3 text-sm font-black rounded-sm border border-white/20 bg-white/10 text-white backdrop-blur-md hover:bg-white hover:text-gray-950 focus:outline-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer transition-all uppercase tracking-[0.2em] active:scale-[0.98] group/btn"
              >
                <Search size={20} className="group-hover/btn:scale-110 transition-transform" /> Request a Quote
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
