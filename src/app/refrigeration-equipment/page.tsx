"use client";

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown, ChevronRight, Grid, List, ArrowRight, ChevronUp, Minus, Plus } from 'lucide-react';

const products = Array(12).fill(null).map((_, index) => {
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
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Unit Coolers', 'Package Unit SMART 7']);
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
    <div className="bg-white">
      <Header />

      <main className="pt-24 md:pt-32">
        {/* Hero Section */}
        <section className="relative h-64 md:h-80 mb-12 bg-gray-800 text-white overflow-hidden">
          <img
            src="/slider/s_2.jpeg"
            alt="Refrigeration Equipment"
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0  from-black/50 to-transparent" />
          <div className="container mx-auto h-full flex items-center justify-center relative">
            <div className="bg-black/60 backdrop-blur-sm p-6 md:p-8 rounded-xl">
              <h1 className="text-4xl md:text-6xl font-extrabold uppercase tracking-tight">
                Refrigeration Equipment
              </h1>
            </div>
          </div>
        </section>

        <div className="container mx-auto py-8 md:py-16 px-4">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
            {/* Sidebar */}
            <aside className="w-full lg:w-[300px] shrink-0">
              <h2 className="text-xl font-bold text-gray-900 mb-6 px-2">Product Category</h2>
              <div className="bg-white border border-gray-100 rounded-2xl p-5 md:p-8 sticky top-32 shadow-sm">
                <nav className="flex flex-col gap-6">
                  {sidebarCategories.map((category) => (
                    <div key={category.name} className="flex flex-col gap-4">
                      <button
                        onClick={() => toggleCategory(category.name)}
                        className="flex items-center justify-between w-full text-lg font-extrabold text-gray-900 group text-left cursor-pointer"
                      >
                        {category.name}
                        {expandedCategories.includes(category.name) ? (
                          <Minus size={14} className="text-accent stroke-[3] cursor-pointer" />
                        ) : (
                          <Plus size={14} className="text-accent stroke-[3] cursor-pointer" />
                        )}
                      </button>

                      {expandedCategories.includes(category.name) && category.subCategories.length > 0 && (
                        <div className="flex flex-col gap-5 pl-4 md:pl-6">
                          {category.subCategories.map((sub) => (
                            <div key={sub.name} className="flex flex-col gap-3">
                              <button
                                onClick={() => toggleSubCategory(sub.name)}
                                className="flex items-center justify-between w-full text-[15px] font-semibold text-gray-700 hover:text-primary transition-colors text-left cursor-pointer"
                              >
                                {sub.name}
                                {expandedSubCategories.includes(sub.name) ? (
                                  <Minus size={12} className="text-accent shrink-0 stroke-[3] cursor-pointer" />
                                ) : (
                                  <Plus size={12} className="text-accent shrink-0 stroke-[3] cursor-pointer" />
                                )}
                              </button>

                              {expandedSubCategories.includes(sub.name) && (
                                <div className="flex flex-col gap-3 pl-6 md:pl-8">
                                  {sub.items.map((item) => (
                                    <Link
                                      key={item}
                                      href="#"
                                      className="text-[14px] font-medium text-gray-600 hover:text-primary transition-colors"
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
            <div className="flex-1 mt-12 lg:mt-0">
              {/* Sorting and View Options */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-gray-200 gap-4">
                <p className="text-sm text-gray-600">Showing 1–12 of 40 results</p>
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                  <div className="flex items-center gap-2">
                    <label htmlFor="sort-by" className="text-sm font-medium text-gray-700 whitespace-nowrap">Sort By:</label>
                    <select id="sort-by" className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary w-32 sm:w-40 bg-white">
                      <option>Default Order</option>
                      <option>Price: Low to High</option>
                      <option>Price: High to Low</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button className="p-2 rounded-md bg-gray-200 text-gray-800 hover:bg-primary hover:text-white transition-colors">
                      <Grid size={18} />
                    </button>
                    <button className="p-2 rounded-md text-gray-400 hover:bg-primary hover:text-white transition-colors">
                      <List size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 md:gap-8">
                {products.map((product, index) => (
                  <div key={index} className="group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden h-full">
                    {/* Image Area */}
                    <div className="relative aspect-square bg-gray-50 flex items-center justify-center p-6 sm:p-8 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Content Area */}
                    <div className="p-5 sm:p-6 flex flex-col flex-grow">
                      <div className="mb-4">
                        <div className="text-[10px] font-bold text-accent uppercase tracking-widest mb-1 opacity-70">Unit Cooler</div>
                        <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors duration-300 leading-snug text-sm sm:text-base">
                          {product.name}
                        </h3>
                      </div>

                      <div className="mt-auto space-y-4">
                        <div className="flex items-center gap-2 text-[12px] text-gray-500 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                          In Stock
                        </div>

                        <button className="w-full py-3 text-[13px] font-bold text-primary border-2 border-primary/10 rounded-xl hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-sm hover:shadow-lg hover:shadow-primary/20 cursor-pointer">
                          Compare Details
                          <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex flex-wrap justify-center items-center gap-2 mt-12 sm:mt-16 pt-10 border-t border-gray-100 mb-12">
                {[1, 2, 3, 4].map((page) => (
                  <Link
                    key={page}
                    href="#"
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-300 ${page === 1
                      ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105 sm:scale-110'
                      : 'text-gray-400 hover:bg-gray-50 hover:text-primary'
                      }`}
                  >
                    {page}
                  </Link>
                ))}

                <div className="hidden sm:block w-px h-6 bg-gray-100 mx-1 sm:mx-2"></div>

                <Link href="#" className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-primary transition-all duration-300">
                  <ChevronRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
