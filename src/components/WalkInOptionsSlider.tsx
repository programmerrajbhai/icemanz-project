"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useRef, useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@prisma/client';

interface WalkInOptionsSliderProps {
    products?: Product[];
}

export default function WalkInOptionsSlider({ products = [] }: WalkInOptionsSliderProps) {
    const sliderRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const scrollProducts = useCallback((direction: 'left' | 'right') => {
        if (sliderRef.current) {
            const scrollAmount = sliderRef.current.clientWidth / 2; // Scroll by half container width for smoother feel
            
            // Check if we are at the end, and if so, scroll back to beginning if going right
            const maxScrollLeft = sliderRef.current.scrollWidth - sliderRef.current.clientWidth;
            
            if (direction === 'right' && sliderRef.current.scrollLeft >= maxScrollLeft - 10) {
                sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
            } else if (direction === 'left' && sliderRef.current.scrollLeft <= 0) {
                sliderRef.current.scrollTo({ left: maxScrollLeft, behavior: 'smooth' });
            } else {
                sliderRef.current.scrollBy({
                    left: direction === 'left' ? -scrollAmount : scrollAmount,
                    behavior: 'smooth'
                });
            }
        }
    }, []);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;
        
        if (!isHovered && products.length > 0) {
            intervalId = setInterval(() => {
                scrollProducts('right');
            }, 3500); // Auto slide every 3.5 seconds
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [isHovered, products.length, scrollProducts]);

    if (!products || products.length === 0) {
        return null;
    }

    return (
        <section className="bg-white py-16 border-t border-gray-100">
            <div className="container px-4 mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Walk-in Cooler & Freezer</h2>
                    <Link href="/walk-in-cooler-freezer" className="text-sm font-semibold text-primary hover:text-[#003366] transition-colors flex items-center gap-1">
                        View All <ChevronRight size={16} />
                    </Link>
                </div>
                
                <div 
                    className="relative group"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* Left Slider Button */}
                    <button
                        onClick={() => scrollProducts('left')}
                        className="absolute -left-4 top-1/2 cursor-pointer -translate-y-1/2 w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 shadow-[0_4px_12px_rgba(0,0,0,0.05)] z-10 hover:bg-gray-50 hover:text-primary transition-all duration-300 opacity-0 group-hover:opacity-100 disabled:opacity-0"
                        aria-label="Previous"
                    >
                        <ChevronLeft size={24} strokeWidth={2.5} />
                    </button>

                    {/* Slider Container */}
                    <div
                        ref={sliderRef}
                        className="flex overflow-x-auto snap-x scroll-smooth shadow-sm [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] border border-gray-100 rounded-sm"
                    >
                        {products.map((product) => {
                            const image = product.images && product.images.length > 0 ? product.images[0] : '/placeholder.png';
                            return (
                                <Link
                                    key={product.id}
                                    href={`/walk-in-cooler-freezer/${product.slug}/${product.id}`}
                                    className="flex-shrink-0 w-[260px] md:w-[240px] lg:w-[calc(100%/5)] xl:w-[calc(100%/6)] bg-white border-r border-gray-100 last:border-r-0 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 snap-start flex flex-col group/card relative"
                                >
                                    <div className="relative aspect-square p-6 bg-white overflow-hidden flex items-center justify-center">
                                        <Image
                                            src={image}
                                            alt={product.title}
                                            fill
                                            className="object-contain p-4 group-hover/card:scale-105 transition-transform duration-500"
                                            sizes="(max-width: 768px) 260px, (max-width: 1024px) 240px, 20vw"
                                        />
                                    </div>
                                    
                                    <div className="p-5 pt-0 flex-1 flex flex-col text-center">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                                            {product.badge || 'AMERIKOOLER'}
                                        </p>
                                        
                                        <h3 className="text-xs font-semibold text-gray-800 line-clamp-3 mb-3 leading-relaxed min-h-[54px] group-hover/card:text-primary transition-colors">
                                            {product.title}
                                        </h3>
                                        
                                        <div className="flex items-center justify-center gap-1.5 mb-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#00C853]"></div>
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">In Stock</span>
                                        </div>
                                        
                                        <div className="mt-auto">
                                            <p className="text-[15px] font-bold text-[#004a99] mb-3">
                                                ${product.price || '0.00'} <span className="text-xs font-medium text-gray-400">/ Ea.</span>
                                            </p>
                                            <button className="w-full bg-[#004a99] hover:bg-[#003366] text-white py-2.5 text-[11px] font-bold uppercase tracking-widest rounded-sm transition-colors shadow-sm">
                                                Choose Option
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right Slider Button */}
                    <button
                        onClick={() => scrollProducts('right')}
                        className="absolute -right-4 top-1/2 cursor-pointer -translate-y-1/2 w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 shadow-[0_4px_12px_rgba(0,0,0,0.05)] z-10 hover:bg-gray-50 hover:text-primary transition-all duration-300 opacity-0 group-hover:opacity-100 disabled:opacity-0"
                        aria-label="Next"
                    >
                        <ChevronRight size={24} strokeWidth={2.5} />
                    </button>
                </div>
            </div>
        </section>
    );
}
