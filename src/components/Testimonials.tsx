"use client";

import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';
import { useCallback, useEffect, useState } from 'react';

const testimonials = [
  {
    name: "Marcus Rivera",
    role: "Owner",
    company: "Riverside Bistro, NY",
    initials: "MR",
    content: "ICEMANZ delivered our walk-in cooler two days ahead of schedule. The installation team was professional, and the system has been running flawlessly for eight months. Couldn't ask for more.",
    color: "bg-blue-500"
  },
  {
    name: "Sandra Park",
    role: "Operations Director",
    company: "Park's Market Chain",
    initials: "SP",
    content: "We expanded our supermarket cold storage with three glassdoor units from ICEMANZ. The engineering support they provided during design made the whole process seamless. Top-tier company.",
    color: "bg-cyan-500"
  },
  {
    name: "James Torres",
    role: "Facility Manager",
    company: "Cold Link Distribution",
    initials: "JT",
    content: "Drive-in freezer for our distribution center. ICEMANZ handled the engineering calculations, permitting support, and installation. The custom build was exactly as specified — on time and on budget.",
    color: "bg-orange-500"
  },
  {
    name: "Elena Rodriguez",
    role: "Procurement Lead",
    company: "Metro Food Hall",
    initials: "ER",
    content: "The quality of the walk-in panels is outstanding. We've noticed a significant reduction in energy costs since upgrading to ICEMANZ systems. Their customer service is also top-notch.",
    color: "bg-purple-500"
  },
  {
    name: "David Chen",
    role: "Head Chef",
    company: "Golden Dragon Seafood",
    initials: "DC",
    content: "Reliable refrigeration is the heart of my kitchen. ICEMANZ's combo units give us the perfect balance of freezer and cooler space. Highly recommend for any serious food service business.",
    color: "bg-emerald-500"
  }
];

export default function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: true,
    skipSnaps: true,
    dragFree: true
  }, [
    AutoScroll({ speed: 0.6, stopOnInteraction: false, stopOnMouseEnter: true })
  ]);

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section className="py-20 pb-14 bg-blue-50/50 relative overflow-hidden">
      <div className="container px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-x-2 py-1 px-3 rounded-sm bg-blue-100 text-blue-600 mb-4">
              <div className="w-4 h-px bg-blue-600"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Testimonials</span>
              <div className="w-4 h-px bg-blue-600"></div>
            </div>

            <h2 className="text-4xl md:text-6xl font-black text-gray-900 uppercase tracking-tight leading-[1.1]">
              What Our <br />
              <span className="text-accent">Clients Say</span>
            </h2>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className="w-12 h-12 rounded-sm bg-white border border-gray-100 text-gray-900 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-gray-900 disabled:hover:border-gray-100 transition-all duration-300 shadow-sm cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={scrollNext}
              disabled={!canScrollNext}
              className="w-12 h-12 rounded-sm bg-white border border-gray-100 text-gray-900 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-gray-900 disabled:hover:border-gray-100 transition-all duration-300 shadow-sm cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Embla Carousel */}
        <div className="overflow-hidden -mx-4 px-4" ref={emblaRef}>
          <div className="flex gap-6">
            {testimonials.map((item, index) => (
              <div
                key={index}
                className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0"
              >
                <div className="h-full flex flex-col bg-white border border-gray-100 rounded-sm p-8 md:p-10 shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 group relative">
                  <Quote className="absolute top-8 right-8 text-blue-50 size-12 group-hover:text-blue-100 transition-colors" />

                  {/* Rating */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="fill-orange-400 text-orange-400" />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-gray-600 font-medium leading-relaxed mb-8 flex-grow">
                    "{item.content}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4 pt-6 border-t border-gray-50">
                    <div className={`size-12 rounded-sm ${item.color} flex items-center justify-center text-white font-black text-sm shrink-0 shadow-lg shadow-black/5`}>
                      {item.initials}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-base font-black text-gray-900 uppercase tracking-tight">{item.name}</span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {item.role} <span className="mx-1">•</span> {item.company}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots Indicators */}
        <div className="flex justify-center gap-2 mt-10">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`h-1.5 transition-all duration-300 rounded-sm ${selectedIndex === index ? 'w-8 bg-primary' : 'w-2 bg-gray-200'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

