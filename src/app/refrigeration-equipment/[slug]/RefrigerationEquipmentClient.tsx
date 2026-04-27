'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronRight,
  ChevronLeft,
  Search,
  LayoutGrid,
  Menu,
  Tag,
  Box,
  ShieldCheck,
  Filter,
  Truck,
  ArrowLeft,
  ChevronDown,
  Plus,
  Minus,
  ArrowRight
} from 'lucide-react';
import { useState } from 'react';
import { Product, Category } from '@prisma/client';

type CategoryWithSubs = Category & { subcategories: CategoryWithSubs[] };

export default function RefrigerationEquipmentClient({
  products,
  categories,
  slug,
  title
}: {
  products: (Product & { category: Category | null })[],
  categories: CategoryWithSubs[],
  slug: string,
  title: string
}) {
  const [expandedItems, setExpandedItems] = useState<string[]>(['condensing-units', 'low-profile-evaporator']);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);

  const toggleExpand = (e: React.MouseEvent, itemSlug: string) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedItems(prev =>
      prev.includes(itemSlug)
        ? prev.filter(s => s !== itemSlug)
        : [...prev, itemSlug]
    );
  };

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="pt-36 pb-20 md:pt-48 md:pb-24">
        <div className="container px-4">

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-72 xl:w-[320px] shrink-0">
              {/* Mobile Toggle Button */}
              <button
                onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                className="lg:hidden flex items-center justify-between w-full px-5 py-4 bg-white border border-gray-200 rounded-sm mb-4"
              >
                <div className="flex items-center gap-2">
                  <Filter size={18} className="text-gray-900" />
                  <span className="font-semibold text-gray-900 text-lg">Categories</span>
                </div>
                {isMobileSidebarOpen ? <Minus size={20} className="text-gray-900" /> : <Plus size={20} className="text-gray-900" />}
              </button>

              <div className={`space-y-6 ${isMobileSidebarOpen ? 'block' : 'hidden'} lg:block`}>
                <div className="flex flex-col bg-white border rounded-sm border-gray-200 ">
                  <div className="px-5 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className=" text-xl font-semibold text-gray-900">Product Categories</h3>
                    </div>
                  </div>
                  <div className="p-5">
                    <nav className="flex flex-col space-y-4">
                      {categories.map((cat) => (
                        <div key={cat.slug} className="space-y-4">
                          <div className="flex items-center justify-between group">
                            <Link
                              href={`/refrigeration-equipment/${cat.slug}`}
                              className={`text-md font-semibold transition-colors  ${slug === cat.slug ? 'text-primary' : 'text-gray-800 hover:text-primary'}`}
                            >
                              {cat.name}
                            </Link>
                            {cat.subcategories && cat.subcategories.length > 0 && (
                              <button
                                onClick={(e) => toggleExpand(e, cat.slug)}
                                className="p-1 cursor-pointer transition-colors"
                              >
                                {expandedItems.includes(cat.slug) ? <Minus size={14} className="text-gray-800" /> : <Plus size={14} className="text-gray-800" />}
                              </button>
                            )}
                          </div>

                          {cat.subcategories && cat.subcategories.length > 0 && expandedItems.includes(cat.slug) && (
                            <div className="pl-4 space-y-4 border-l border-gray-100 ml-1">
                              {cat.subcategories.map((sub) => (
                                <div key={sub.slug} className="space-y-4">
                                  <div className="flex items-center justify-between group">
                                    <Link
                                      href={`/refrigeration-equipment/${sub.slug}`}
                                      className={`text-[13px] font-semibold transition-colors ${slug === sub.slug ? 'text-primary' : 'text-gray-600 hover:text-primary'}`}
                                    >
                                      {sub.name}
                                    </Link>
                                    {sub.subcategories && sub.subcategories.length > 0 && (
                                      <button
                                        onClick={(e) => toggleExpand(e, sub.slug)}
                                        className="p-1 cursor-pointer transition-colors"
                                      >
                                        {expandedItems.includes(sub.slug) ? <Minus size={12} className="text-gray-600" /> : <Plus size={12} className="text-gray-600" />}
                                      </button>
                                    )}
                                  </div>

                                  {sub.subcategories && sub.subcategories.length > 0 && expandedItems.includes(sub.slug) && (
                                    <div className="pl-4 space-y-3 border-l border-gray-100 ml-1">
                                      {sub.subcategories.map((deepSub) => (
                                        <Link
                                          key={deepSub.slug}
                                          href={`/refrigeration-equipment/${deepSub.slug}`}
                                          className={`text-[12px] font-medium transition-colors block ${slug === deepSub.slug ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}
                                        >
                                          {deepSub.name}
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
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1">
              <div className=" flex mb-8 flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

                <div>
                  <h1 className="text-xl sm:text-xl  font-semibold text-primary tracking-tight">
                    {title}
                  </h1>
                  <p className="text-sm pt-2  block font-medium text-gray-500">
                    Showing {products.length > 0 ? 1 : 0}–{products.length} of {products.length} results
                  </p>
                </div>
                <div className="flex items-center gap-4 w-full justify-between sm:w-auto sm:justify-end sm:ml-auto">
                  {/* Sorting */}
                  <div className="relative">
                    <select className="appearance-none bg-transparent pr-8 py-1.5 border-b border-gray-300 text-gray-500  font-medium  text-sm focus:outline-none focus:border-gray-300 cursor-pointer min-w-[180px] transition-colors">
                      <option>Default sorting</option>
                      <option>Sort by popularity</option>
                      <option>Sort by rating</option>
                      <option>Sort by latest</option>
                      <option>Price: low to high</option>
                      <option>Price: high to low</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>

                  {/* View Toggles */}
                  <div className="flex items-center gap-1.5">
                    {/* Grid View (Active) */}
                    <button className="size-[30px]   bg-[#003d80] rounded-sm flex items-center justify-center cursor-pointer " aria-label="Grid view">
                      <LayoutGrid size={14} className="text-white" strokeWidth={2.5} />
                    </button>
                    {/* List View (Inactive) */}
                    <button className="size-[30px] bg-[#f1f5f9] rounded-sm flex items-center justify-center cursor-pointer transition-colors hover:bg-[#e2e8f0]" aria-label="List view">
                      <Menu size={14} className="text-gray-500" strokeWidth={2.5} />
                    </button>
                  </div>

                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-8">
                {products.length === 0 ? (
                  <div className="col-span-full py-12 text-center text-gray-500 font-medium border border-dashed border-gray-300 rounded-sm">
                    No products found in this category!
                  </div>
                ) : (
                  products.slice(0, visibleCount).map((product) => (
                    <Link
                      key={product.id}
                      href={`/refrigeration-equipment/${slug}/${product.id}`}
                      className="group bg-white border  border-gray-200 
                      
                      rounded-sm p-2 overflow-hidden hover:-translate-y-1 transition-all duration-500 flex flex-col"
                    >
                      {/* Image Area */}
                      <div className=" border-b border-gray-200  w-full  rounded-sm bg-gray-50 overflow-hidden mb-3 relative pt-[100%]">
                        {product.images && product.images[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={product.title}
                            fill
                            className="object-contain p-2 transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-semibold bg-gray-100">No Image</div>
                        )}
                      </div>

                      {/* Content Area */}
                      <div className="flex flex-col  text-center items-center px-1 mt-2">
                        <h3 className="text-sm  font-semibold text-gray-900 mb-1 tracking-tight group-hover:text-primary transition-colors line-clamp-2">
                          {product.title}
                        </h3>

                        {/* Price */}
                        {product.price ? (
                          <p className="text-base font-bold text-[#004a99] mb-2">{product.price.startsWith('$') ? product.price : `$${product.price}`}</p>
                        ) : (
                          <p className="text-xs font-medium text-gray-400 mb-2">Contact for Price</p>
                        )}

                        <div className="flex items-center justify-center gap-1.5 mb-4">
                          <div className="w-1.5 h-1.5 rounded-sm bg-[#00C853]"></div>
                          <span className="text-[9px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-widest">In Stock</span>
                        </div>

                        {/* Action Button */}
                        <div className="w-full mt-auto pb-1">
                          <div className="cursor-pointer w-full py-2.5 px-3 border-[1.5px] border-gray-200 rounded-sm flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] font-black text-[#0f172a] uppercase tracking-[0.2em] group-hover:border-gray-300 group-hover:bg-gray-50 transition-all duration-300 shadow-sm group-hover:shadow">
                            View Details
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform text-[#0f172a]" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>

              {products.length > visibleCount && (
                <div className="flex  items-center justify-center gap-4 py-5">
                  <button
                    onClick={() => setVisibleCount(products.length)}
                    className=' bg-[#003d80] text-center uppercase  font-semibold text-sm cursor-pointer text-white py-2 px-4  rounded-sm'>
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
