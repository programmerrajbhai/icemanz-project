'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  LayoutGrid,
  List,
  ArrowRight,
  ChevronUp,
  ChevronLeft
} from 'lucide-react';
import { Product, Category } from '@prisma/client';

type CategoryWithSubs = Category & { subcategories: CategoryWithSubs[] };

export default function ProductListClient({
  products,
  categories,
  slug
}: {
  products: (Product & { category: Category | null })[],
  categories: CategoryWithSubs[],
  slug: string
}) {
  const [openMenus, setOpenMenus] = useState<string[]>(
    categories.map(c => c.name) // Open root categories by default
  );
  const [visibleCount, setVisibleCount] = useState(8);

  const toggleMenu = (name: string) => {
    setOpenMenus(prev =>
      prev.includes(name) ? prev.filter(m => m !== name) : [...prev, name]
    );
  };

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
            {/* Sidebar */}
            <aside className="lg:w-72 shrink-0">
              <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6 sticky top-32">
                <div className="mb-6 px-1">
                  <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Filter By Category</h2>
                </div>
                <nav className="space-y-6">
                  {categories.map((cat) => (
                    <div key={cat.id}>
                      <button
                        onClick={() => toggleMenu(cat.name)}
                        className="flex items-center justify-between w-full text-left group cursor-pointer"
                      >
                        <span className="text-base font-black text-gray-900 uppercase tracking-tight group-hover:text-primary transition-colors">
                          {cat.name}
                        </span>
                        {openMenus.includes(cat.name) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>

                      {openMenus.includes(cat.name) && cat.subcategories.length > 0 && (
                        <div className="mt-4 ml-4 space-y-4">
                          {cat.subcategories.map((sub) => (
                            <div key={sub.id}>
                              {sub.subcategories && sub.subcategories.length > 0 ? (
                                <>
                                  <button
                                    onClick={() => toggleMenu(sub.name)}
                                    className="flex items-center justify-between w-full text-left group cursor-pointer"
                                  >
                                    <span className="text-sm font-bold text-gray-600 group-hover:text-primary transition-colors">
                                      {sub.name}
                                    </span>
                                    {openMenus.includes(sub.name) ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                  </button>
                                  {openMenus.includes(sub.name) && (
                                    <div className="mt-2 ml-4 flex flex-col gap-2">
                                      {sub.subcategories.map(item => (
                                        <Link
                                          key={item.id}
                                          href={`/products/${item.slug}`}
                                          className="text-sm text-gray-400 hover:text-primary transition-colors font-medium"
                                        >
                                          {item.name}
                                        </Link>
                                      ))}
                                    </div>
                                  )}
                                </>
                              ) : (
                                <Link
                                  href={`/products/${sub.slug}`}
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
              <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{title}</h1>
                <p className="text-slate-500 mt-2">Showing {products.length} products</p>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
                {products.length === 0 ? (
                  <div className="col-span-full py-20 text-center border border-dashed border-slate-300 rounded-sm">
                    <p className="text-slate-500 font-medium">No products found in this category.</p>
                  </div>
                ) : (
                  products.slice(0, visibleCount).map((product) => (
                    <div
                      key={product.id}
                      className="group flex flex-col bg-white border border-gray-100 rounded-sm hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 overflow-hidden"
                    >
                      <div className="p-4 bg-white">
                        <div className="relative pt-[75%] rounded-sm bg-gray-50 overflow-hidden border border-gray-100 flex items-center justify-center">
                          {product.images && product.images[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="size-full absolute top-0 start-0 object-contain group-hover:scale-110 transition-transform duration-700 ease-in-out p-4"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-slate-300">No Image</div>
                          )}
                        </div>
                      </div>

                      <div className="px-6 pb-6 pt-2 flex flex-col flex-grow text-center items-center">
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">
                          {product.category?.name || "Uncategorized"}
                        </span>

                        <h3 className="text-lg font-black text-gray-900 leading-tight mb-3 uppercase tracking-tight">
                          {product.title}
                        </h3>

                        <div className="flex items-center gap-1.5 mb-6">
                          <div className="size-2 rounded-sm bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                            In Stock
                          </span>
                        </div>

                        <Link
                          href={`/products/${slug}/${product.id}`}
                          className="w-full py-3.5 px-6 inline-flex justify-center items-center gap-x-2 text-[12px] font-black uppercase tracking-widest rounded-sm border border-gray-100 bg-white text-gray-800 shadow-sm hover:bg-primary hover:text-white hover:border-primary focus:outline-none focus:bg-primary focus:text-white transition-all duration-300 active:scale-95"
                        >
                          View Details
                          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {products.length > visibleCount && (
                <div className="mt-12 flex justify-center">
                  <button
                    onClick={() => setVisibleCount(products.length)}
                    className="py-3 px-8 inline-flex justify-center items-center gap-x-2 text-[13px] font-black uppercase tracking-widest rounded-sm border border-transparent bg-[#004a99] text-white hover:bg-[#003366] transition-colors shadow-md active:scale-95 cursor-pointer"
                  >
                    Load More
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
