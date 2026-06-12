"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function WalkInOptionsSlider({ products = [] }: { products?: any[] }) {
    const sliderRef = useRef<HTMLDivElement>(null);

    const scrollProducts = (direction: 'left' | 'right') => {
        if (sliderRef.current) {
            const scrollAmount = 240;
            sliderRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (!products || products.length === 0) return null;

    return (
        <section className="bg-white py-16">
            <div className="container px-4 mx-auto">
                <h2 className="text-xl font-bold text-gray-900 mb-6">More Walk-In Options!</h2>
                <div className="relative">
                    {/* Left Slider Button */}
                    <button
                        onClick={() => scrollProducts('left')}
                        className="absolute -left-5 top-1/2 cursor-pointer -translate-y-1/2 w-10 h-10 bg-[#b3b3b3] rounded-full flex items-center justify-center text-white shadow-md z-10 hover:bg-gray-400 transition-colors"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    {/* Slider Container */}
                    <div
                        ref={sliderRef}
                        className="flex overflow-x-auto snap-x scroll-smooth shadow-sm [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] border border-gray-100"
                    >
                        {products.map((product) => (
                            <Link
                                key={product.id}
                                href={`/walk-in-cooler-freezer/${product.category?.slug || 'walk-in-cooler-no-floor'}/${product.id}`}
                                className="flex-shrink-0 w-[240px] md:w-[220px] lg:w-[calc(100%/6)] bg-white border-r border-gray-100 last:border-r-0 hover:shadow-md transition-shadow snap-start flex flex-col group"
                            >
                                <div className="relative aspect-square p-4 bg-white">
                                    <Image
                                        src={product.images?.[0] || '/placeholder.png'}
                                        alt={product.title}
                                        fill
                                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div className="p-4 flex-1 flex flex-col text-left">
                                    <p className="text-[10px] font-bold text-gray-800 uppercase mb-2 text-center tracking-wider">
                                        {product.brand || 'AMERIKOOLER'}
                                    </p>
                                    <p className="text-xs text-gray-800 line-clamp-2 mb-3 leading-relaxed h-[36px]">
                                        {product.title}
                                    </p>
                                    <div className="text-center mb-3">
                                        <p className="text-sm font-bold text-[#003366]">
                                            ${product.price || '0.00'} <span className="text-xs font-normal text-gray-500">/ Ea.</span>
                                        </p>
                                    </div>
                                    <div className="mt-auto text-center w-full">
                                        <button className="w-full bg-[#004a99] hover:bg-blue-800 text-white text-xs font-bold py-2 px-4 rounded-sm transition-colors uppercase tracking-wider">
                                            Choose Option
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Right Slider Button */}
                    <button
                        onClick={() => scrollProducts('right')}
                        className="absolute -right-5 top-1/2 cursor-pointer -translate-y-1/2 w-10 h-10 bg-[#b3b3b3] rounded-full flex items-center justify-center text-white shadow-md z-10 hover:bg-gray-400 transition-colors"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>
        </section>
    );
}
