'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { use, useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  LayoutGrid,
  List,
  ArrowRight,
  ChevronUp,
  ChevronLeft
} from 'lucide-react';

const mockProducts = [
  {
    id: 1,
    category: 'UNIT COOLER',
    title: "TS060MR404A3-T",
    image: '/products/product_1.jpg',
    inStock: true,
  },
  {
    id: 2,
    category: 'UNIT COOLER',
    title: "TS065MR404A3-T",
    image: '/slider/s_1.jpeg',
    inStock: true,
  },
  {
    id: 3,
    category: 'UNIT COOLER',
    title: "TS070MR404A3-T",
    image: '/products/product_2.jpg',
    inStock: true,
  },
  {
    id: 4,
    category: 'UNIT COOLER',
    title: "TS075MR404A3-T",
    image: '/slider/s_2.jpeg',
    inStock: true,
  },
  {
    id: 5,
    category: 'UNIT COOLER',
    title: "TS080MR404A3-T",
    image: '/products/product_1.jpg',
    inStock: true,
  },
  {
    id: 6,
    category: 'UNIT COOLER',
    title: "TS085MR404A3-T",
    image: '/slider/s_3.jpeg',
    inStock: true,
  },
  {
    id: 7,
    category: 'UNIT COOLER',
    title: "TS090MR404A3-T",
    image: '/products/product_2.jpg',
    inStock: true,
  },
  {
    id: 8,
    category: 'UNIT COOLER',
    title: "TS095MR404A3-T",
    image: '/slider/s_1.jpeg',
    inStock: true,
  }
];

const categories = [
  {
    name: 'Unit Coolers',
    subcategories: [
      {
        name: 'Low Profile Evaporator',
        items: ['Air Defrost', 'Electric Defrost']
      },
      {
        name: 'Thin Profile Evaporator (Reach-in)',
        items: []
      },
      {
        name: 'Medium Profile',
        items: []
      },
      {
        name: 'Center Mount Evaporator (Low Velocity)',
        items: []
      }
    ]
  },
  {
    name: 'Package Unit SMART 7',
    subcategories: [
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

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [openMenus, setOpenMenus] = useState<string[]>(['Unit Coolers', 'Package Unit SMART 7', 'Low Profile Evaporator', 'Indoor', 'Outdoor']);

  const toggleMenu = (name: string) => {
    setOpenMenus(prev =>
      prev.includes(name) ? prev.filter(m => m !== name) : [...prev, name]
    );
  };

  // Format the slug for display
  const title = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="pt-32 pb-20 md:pt-44 md:pb-24">
        <div className="container px-4">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Sidebar - Redesigned matching reference */}
            <aside className="lg:w-72 shrink-0">
              <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6 sticky top-32">
                <div className="mb-6 px-1">
                  <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Filter By Category</h2>
                </div>
                <nav className="space-y-6">
                  {categories.map((cat) => (
                    <div key={cat.name}>
                      <button
                        onClick={() => toggleMenu(cat.name)}
                        className="flex items-center justify-between w-full text-left group"
                      >
                        <span className="text-base font-black text-gray-900 uppercase tracking-tight group-hover:text-primary transition-colors">
                          {cat.name}
                        </span>
                        {openMenus.includes(cat.name) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>

                      {openMenus.includes(cat.name) && (
                        <div className="mt-4 ml-4 space-y-4">
                          {cat.subcategories.map((sub) => (
                            <div key={sub.name}>
                              {sub.items.length > 0 ? (
                                <>
                                  <button
                                    onClick={() => toggleMenu(sub.name)}
                                    className="flex items-center justify-between w-full text-left group"
                                  >
                                    <span className="text-sm font-bold text-gray-600 group-hover:text-primary transition-colors">
                                      {sub.name}
                                    </span>
                                    {openMenus.includes(sub.name) ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                  </button>
                                  {openMenus.includes(sub.name) && (
                                    <div className="mt-2 ml-4 flex flex-col gap-2">
                                      {sub.items.map(item => (
                                        <Link
                                          key={item}
                                          href="#"
                                          className="text-sm text-gray-400 hover:text-primary transition-colors font-medium"
                                        >
                                          {item}
                                        </Link>
                                      ))}
                                    </div>
                                  )}
                                </>
                              ) : (
                                <Link
                                  href="#"
                                  className="text-sm font-bold text-gray-600 hover:text-primary transition-colors block"
                                >
                                  {sub.name}
                                </Link>
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

            {/* Main Content Area */}
            <div className="flex-1">
              {/* Product Grid - Redesigned Card matching reference */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
                {mockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group flex flex-col bg-white border border-gray-100 rounded-3xl hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 overflow-hidden"
                  >
                    {/* Image Area with subtle padding */}
                    <div className="p-4 bg-white">
                      <div className="relative pt-[75%] rounded-2xl bg-gray-50 overflow-hidden border border-gray-100">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="size-full absolute top-0 start-0 object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out p-4"
                        />
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="px-6 pb-6 pt-2 flex flex-col flex-grow text-center items-center">
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">
                        {product.category}
                      </span>

                      <h3 className="text-lg font-black text-gray-900 leading-tight mb-3 uppercase tracking-tight">
                        {product.title}
                      </h3>

                      <div className="flex items-center gap-1.5 mb-6">
                        <div className="size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                          In Stock
                        </span>
                      </div>

                      <Link
                        href={`/products/${slug}/${product.id}`}
                        className="w-full py-3.5 px-6 inline-flex justify-center items-center gap-x-2 text-[12px] font-black uppercase tracking-widest rounded-xl border border-gray-100 bg-white text-gray-800 shadow-sm hover:bg-primary hover:text-white hover:border-primary focus:outline-none focus:bg-primary focus:text-white transition-all duration-300 active:scale-95"
                      >
                        View Details
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Placeholder */}
              <div className="mt-16 flex justify-center">
                <nav className="flex items-center gap-x-1">
                  <button className="min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm font-bold rounded-lg border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none transition-all">
                    <ChevronLeft size={16} />
                    <span>Prev</span>
                  </button>
                  <div className="flex items-center gap-x-1">
                    <button className="min-h-[38px] min-w-[38px] flex justify-center items-center bg-primary text-white py-2 px-3 text-sm font-bold rounded-lg focus:outline-none">1</button>
                    <button className="min-h-[38px] min-w-[38px] flex justify-center items-center text-gray-800 hover:bg-gray-100 py-2 px-3 text-sm font-bold rounded-lg focus:outline-none">2</button>
                    <button className="min-h-[38px] min-w-[38px] flex justify-center items-center text-gray-800 hover:bg-gray-100 py-2 px-3 text-sm font-bold rounded-lg focus:outline-none">3</button>
                  </div>
                  <button className="min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm font-bold rounded-lg border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none transition-all">
                    <span>Next</span>
                    <ChevronRight size={16} />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

