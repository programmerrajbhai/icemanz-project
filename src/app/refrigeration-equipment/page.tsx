"use client";

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown, ChevronRight, Grid, List, ArrowRight, ChevronUp, Minus, Plus } from 'lucide-react';

const products = Array(8).fill(null).map((_, index) => {
  const images = [
    '/products/product_1.jpg',
    '/products/product_2.jpg',
    '/slider/s_1.jpeg',
    '/slider/s_2.jpeg',
    '/slider/s_3.jpeg'
  ];
  return {
    name: `TS0${60 + index * 5}MR404A3-T`,
    image: images[index % images.length],
  };
});

const sidebarCategories = [
  {
    name: 'Unit Coolers',
    subCategories: [
      {
        name: 'Low Profile Evaporator',
        items: ['Air Defrost', 'Electric Defrost']
      },
      {
        name: 'Thin Profile Evaporator (Reach-in)',
        items: ['Air Defrost', 'Electric Defrost']
      },
      {
        name: 'Medium Profile',
        items: ['Air Defrost', 'Electric Defrost - 6FPI', 'Electric Defrost - 4FPI']
      },
      {
        name: 'Center Mount Evaporator (Low Velocity)',
        items: ['Air Defrost', 'Electric Defrost']
      }
    ]
  },
  {
    name: 'Package Unit SMART 7',
    subCategories: [
      {
        name: 'Indoor',
        items: ['Cooler', 'Freezer']
      },
      {
        name: 'Outdoor',
        items: ['Cooler', 'Freezer']
      }
    ]
  }
];

export default function RefrigerationEquipmentPage() {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Unit Coolers', 'Package Unit SMART 7', 'Low Profile Evaporator', 'Indoor', 'Outdoor']);
  const [expandedSubCategories, setExpandedSubCategories] = useState<string[]>(['Low Profile Evaporator', 'Indoor', 'Outdoor']);

  const toggleCategory = (name: string) => {
    setExpandedCategories(prev =>
      prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
    );
  };

  const toggleSubCategory = (name: string) => {
    setExpandedSubCategories(prev =>
      prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
    );
  };

  return (
    <div className="bg-white min-h-screen">
      <Header />

      <main className="pt-32 pb-20 md:pt-44 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Sidebar */}
            <aside className="w-full lg:w-72 shrink-0">
              <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 sticky top-32 shadow-2xl shadow-gray-200/50">
                <div className="mb-6 px-1">
                  <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Filter By Category</h2>
                </div>
                <nav className="flex flex-col gap-8">
                  {sidebarCategories.map((category) => (
                    <div key={category.name} className="flex flex-col gap-4">
                      <button
                        onClick={() => toggleCategory(category.name)}
                        className="flex items-center justify-between w-full text-base font-black text-gray-900 group text-left cursor-pointer uppercase tracking-tight"
                      >
                        {category.name}
                        {expandedCategories.includes(category.name) ? (
                          <Minus size={16} className="text-primary stroke-[3]" />
                        ) : (
                          <Plus size={16} className="text-primary stroke-[3]" />
                        )}
                      </button>

                      {expandedCategories.includes(category.name) && category.subCategories.length > 0 && (
                        <div className="flex flex-col gap-6 pl-4">
                          {category.subCategories.map((sub) => (
                            <div key={sub.name} className="flex flex-col gap-3">
                              <button
                                onClick={() => toggleSubCategory(sub.name)}
                                className="flex items-center justify-between w-full text-[13px] font-bold text-gray-600 hover:text-primary transition-colors text-left cursor-pointer"
                              >
                                {sub.name}
                                {expandedSubCategories.includes(sub.name) ? (
                                  <Minus size={14} className="text-primary shrink-0 stroke-[2]" />
                                ) : (
                                  <Plus size={14} className="text-primary shrink-0 stroke-[2]" />
                                )}
                              </button>

                              {expandedSubCategories.includes(sub.name) && (
                                <div className="flex flex-col gap-3 pl-6 border-l border-gray-100">
                                  {sub.items.map((item) => (
                                    <Link
                                      key={item}
                                      href="#"
                                      className="text-[13px] font-medium text-gray-400 hover:text-primary transition-colors"
                                    >
                                      {item}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
                {products.map((product, index) => (
                  <div key={index} className="group flex flex-col bg-white rounded-3xl border border-gray-100 hover:shadow-2xl hover:shadow-gray-200/60 transition-all duration-500 overflow-hidden h-full">
                    {/* Image Area */}
                    <div className="p-4">
                      <div className="relative pt-[75%] bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden border border-gray-50">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full absolute inset-0 object-cover group-hover:scale-110 transition-transform duration-700 ease-out p-4"
                        />
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="px-6 pb-6 pt-2 flex flex-col flex-grow text-center items-center">
                      <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-2 opacity-80">Unit Cooler</div>
                      <h3 className="font-black text-gray-900 group-hover:text-primary transition-colors duration-300 leading-tight text-base uppercase tracking-tight mb-4">
                        {product.name}
                      </h3>

                      <div className="flex items-center gap-1.5 mb-6">
                        <div className="size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                          In Stock
                        </span>
                      </div>

                      <Link
                        href={`/products/refrigeration-equipment/${index + 1}`}
                        className="w-full py-3.5 text-[12px] font-black text-gray-800 uppercase tracking-widest border border-gray-100 rounded-xl hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-sm active:scale-95 cursor-pointer bg-white"
                      >
                        View Details
                        <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center items-center gap-2 mt-20">
                <button className="min-h-[40px] min-w-[40px] py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-bold rounded-xl border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none transition-all">
                  <ChevronRight size={18} className="rotate-180" />
                  <span>Prev</span>
                </button>
                <div className="flex items-center gap-2">
                  {[1, 2, 3].map((page) => (
                    <button
                      key={page}
                      className={`min-h-[40px] min-w-[40px] flex justify-center items-center rounded-xl text-sm font-black transition-all duration-300 ${page === 1
                        ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-110'
                        : 'text-gray-400 hover:bg-gray-50 hover:text-primary'
                        }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button className="min-h-[40px] min-w-[40px] py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-bold rounded-xl border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none transition-all">
                  <span>Next</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
