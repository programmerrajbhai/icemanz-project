"use client";

import { useState, useEffect, useCallback } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
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

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? sliderImages.length - 1 : prev - 1));
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="relative h-[480px] sm:h-[540px] md:h-[650px] w-full overflow-hidden bg-gray-950 mt-[70px] md:mt-[100px] group">
      {/* Background Slides */}
      <div className="absolute inset-0 z-0">
        {sliderImages.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={slide.url}
              alt={slide.title}
              fill
              priority={index === 0}
              className={`object-cover object-center transition-transform duration-[10000ms] ease-linear ${
                index === currentSlide ? 'scale-110' : 'scale-100'
              }`}
              sizes="100vw"
            />
            {/* Premium Gradient Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>
          </div>
        ))}
      </div>

      {/* Centered Text Overlay */}
      <div className="container relative z-10 h-full flex items-center justify-center">
        <div className="max-w-5xl pt-4 md:pt-10 text-center">
          <div className="space-y-8 md:space-y-12">
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white uppercase tracking-tight leading-[1.1] md:leading-[1.05] px-2 mx-auto drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
              YOUR TOTAL <br className="hidden sm:block" />
              <span className="text-blue-400 block mt-2 sm:inline sm:mt-0">REFRIGERATION</span> SOLUTIONS
            </h1>

            {/* Action Buttons with Modern Hover Effects */}
            <div className="flex flex-col sm:flex-row gap-5 px-6 sm:px-0 justify-center items-center">
              <Link
                href="/walk-in-cooler-freezer/walk-in-cooler-no-floor"
                className="w-full sm:w-auto py-4 px-10 inline-flex justify-center items-center gap-x-2 text-sm font-bold rounded border border-transparent bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 uppercase tracking-[0.2em] shadow-[0_4px_14px_0_rgba(0,118,255,0.39)] hover:shadow-[0_6px_20px_rgba(0,118,255,0.23)] active:scale-[0.98]"
              >
                Explore Products
              </Link>
              
              <Link
                href="/quote"
                className="w-full sm:w-auto py-4 px-10 inline-flex justify-center items-center gap-x-3 text-sm font-bold rounded border-2 border-white/40 bg-white/10 text-white backdrop-blur-md hover:bg-white hover:text-gray-950 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 uppercase tracking-[0.2em] shadow-lg hover:shadow-xl active:scale-[0.98] group/btn"
              >
                <Search size={18} className="group-hover/btn:scale-110 group-hover/btn:text-blue-600 transition-transform duration-300" /> 
                Request a Quote
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Slider Controls (Arrows) */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/20 text-white/70 backdrop-blur-sm border border-white/10 hover:bg-black/50 hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 hidden md:block"
        aria-label="Previous Slide"
      >
        <ChevronLeft size={32} />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/20 text-white/70 backdrop-blur-sm border border-white/10 hover:bg-black/50 hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 hidden md:block"
        aria-label="Next Slide"
      >
        <ChevronRight size={32} />
      </button>

      {/* Slider Indicators (Dots) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {sliderImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-blue-500 w-8' : 'bg-white/50 hover:bg-white'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}