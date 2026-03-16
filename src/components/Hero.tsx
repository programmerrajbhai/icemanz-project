"use client";

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';

const sliderImages = [
  {
    url: '/slider/s_1.png',
    title: 'ICEMANZ® Walk-In Cooler & Freezer',
    subtitle: 'Fast. Reliable. Built for Performance.',
  },
  {
    url: '/slider/s_2.jpg',
    title: 'Custom Modular Solutions',
    subtitle: 'Tailored to fit your business perfectly.',
  },
  {
    url: '/slider/s_3.jpg',
    title: '36-48 Hour Quick Ship',
    subtitle: 'Get your cooling solutions delivered fast.',
  },
  {
    url: '/slider/s_4.jpg',
    title: '10-Year Panel Warranty',
    subtitle: 'Dependable quality you can trust.',
  },
  {
    url: '/slider/s_5.jpg',
    title: 'Fully Compliant Engineering',
    subtitle: 'Meets all NSF, UL, DOE, and ASTM standards.',
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
    <section className="relative min-h-[550px] md:h-[650px] w-full overflow-hidden bg-gray-900 mt-[70px] md:mt-[100px]">
      {/* Background Slides */}
      <div className="absolute inset-0 z-0">
        {sliderImages.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-50' : 'opacity-0'
              }`}
          >
            <img
              src={slide.url}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/60 to-transparent md:via-gray-900/40"></div>
          </div>
        ))}
      </div>

      <div className="container relative z-10 h-full flex items-center py-20 md:py-0">
        <div className="max-w-3xl">
          <div className="overflow-hidden">
            {sliderImages.map((slide, index) => (
              <div
                key={index}
                className={`transition-all duration-700 ease-out ${index === currentSlide
                  ? 'translate-y-0 opacity-100 relative block'
                  : 'translate-y-8 opacity-0 absolute hidden'
                  }`}
              >
                <span className="inline-block bg-accent px-4 py-1 rounded text-[10px] md:text-sm font-bold uppercase tracking-widest mb-4 md:mb-6 text-white shadow-lg">
                  New Quick-Ship Available
                </span>
                <h1 className="text-4xl md:text-7xl font-black text-white leading-[1.1] mb-4 md:mb-6 tracking-tighter">
                  {slide.title.split('®')[0]}<span className="text-accent">®</span><br />
                  <span className="text-3xl md:text-7xl">{slide.title.split('®')[1]}</span>
                </h1>
                <p className="text-lg md:text-2xl text-gray-200 mb-8 md:mb-10 max-w-xl leading-relaxed font-medium">
                  {slide.subtitle}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-10 md:mb-12">
            <Link href="/products" className="bg-primary text-white px-8 md:px-10 py-4 md:py-5 rounded-xl font-bold text-base md:text-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-all transform hover:scale-105 shadow-2xl shadow-primary/30">
              View Inventory <ArrowRight size={20} />
            </Link>
            <Link href="/quote" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 md:px-10 py-4 md:py-5 rounded-xl font-bold text-base md:text-lg flex items-center justify-center gap-2 hover:bg-white/20 transition-all">
              Request a Quote
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              '10-Year Warranty',
              'NSF/UL Compliant',
              '36-48h Shipping',
              'Modular Design'
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-2 text-white/80 font-semibold text-xs md:text-sm">
                <CheckCircle size={16} className="text-accent flex-shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
