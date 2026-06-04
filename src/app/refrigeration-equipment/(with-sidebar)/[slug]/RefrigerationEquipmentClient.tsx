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
  ArrowRight,
  X
} from 'lucide-react';
import { useState } from 'react';
import { Product, Category } from '@prisma/client';

type CategoryWithSubs = Category & { subcategories: CategoryWithSubs[] };

function extractProductInfo(text: string | null | undefined) {
  if (!text) return null;
  const hpMatch = text.match(/(\d+(?:\.\d+)?)\s*HP/i);
  const tempMatch = text.match(/(Medium|Low)(?:\s+Temperature)?/i);
  if (hpMatch) {
    const hp = hpMatch[1];
    const temp = tempMatch ? `${tempMatch[1]} Temp` : 'Medium Temp';
    return `${hp} HP, ${temp}`;
  }
  const btuMatch = text.match(/([\d,]+)\s*BTU/i);
  if (btuMatch) {
    const btu = btuMatch[1].replace(/,/g, '');
    const formattedBtu = btu.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `${formattedBtu} BTU`;
  }
  return null;
}

function generateOptimizedTitle(product: any) {
  const brand = product.brand || 'Turbo Air';

  let model = product.title || '';
  if (model.match(/HP|Temp|BTU/i)) {
    const parts = model.split(/\s+/);
    model = parts[parts.length - 1];
  }

  const textToSearch = `${product.title || ''} ${product.keyFeatures || ''} ${product.description || ''}`;
  let capacity = '';
  const hpMatch = textToSearch.match(/(\d+(?:\.\d+)?)\s*HP/i);
  if (hpMatch) {
    capacity = `${hpMatch[1]} HP`;
  } else {
    const btuMatch = textToSearch.match(/([\d,]+)\s*BTU/i);
    if (btuMatch) {
      const btu = btuMatch[1].replace(/,/g, '');
      const formattedBtu = btu.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      capacity = `${formattedBtu} BTU`;
    }
  }

  let temp = '';
  const tempMatch = textToSearch.match(/(Extended\s+Medium|Medium|Low)(?:\s+Temperature|\s+Temp)?/i);
  if (tempMatch) {
    temp = `${tempMatch[1]} Temp`;
  }

  let context = 'Unit';
  if (product.category) {
    const slug = product.category.slug || '';
    if (slug.includes('condensing') || slug.includes('scroll') || slug.includes('hermetic')) {
      if (textToSearch.toLowerCase().includes('outdoor')) context = 'Outdoor Condensing Unit';
      else if (textToSearch.toLowerCase().includes('indoor')) context = 'Indoor Condensing Unit';
      else context = 'Condensing Unit';
    } else if (slug.includes('evaporator') || slug.includes('profile')) {
      if (slug.includes('low-profile')) context = 'Low Profile Evaporator';
      else if (slug.includes('medium-profile')) context = 'Medium Profile Evaporator';
      else if (slug.includes('center-mount')) context = 'Center Mount Evaporator';
      else if (slug.includes('thin-profile')) context = 'Thin Profile Evaporator';
      else context = 'Evaporator';
    } else if (slug.includes('combo') || slug.includes('package')) {
      if (slug.includes('outdoor')) context = 'Outdoor Package Unit';
      else if (slug.includes('indoor')) context = 'Indoor Package Unit';
      else context = 'Package Unit';
    }
  }

  return [brand, model, capacity, temp, context].filter(Boolean).join(' ');
}

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
  const [expandedItems, setExpandedItems] = useState<string[]>([
    'evaporation-units',
    'condensing-units',
    'combo-units-package-units',
    'low-profile-evaporator',
    'thin-profile-evaporator-reach-in',
    'medium-profile',
    'center-mount-evaporator-low-velocity',
    'indoor-pemmvl',
    'outdoor-bueip'
  ]);
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

  const cleanPrice = (priceStr: string | null) => {
    if (!priceStr) return '0.00';
    const num = parseFloat(String(priceStr).replace(/[^0-9.]/g, ''));
    return isNaN(num) ? '0.00' : num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
                onClick={() => setIsMobileSidebarOpen(true)}
                className="lg:hidden flex items-center justify-between w-full px-5 py-4 bg-white border border-gray-200 rounded-sm mb-4 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Filter size={18} className="text-gray-900" />
                  <span className="font-semibold text-gray-900 text-lg">Filter Category</span>
                </div>
                <Plus size={20} className="text-gray-900" />
              </button>

              {/* Overlay for mobile */}
              {isMobileSidebarOpen && (
                <div
                  className="fixed inset-0 bg-black/50 z-[60] lg:hidden cursor-pointer"
                  onClick={() => setIsMobileSidebarOpen(false)}
                />
              )}

              <div className={`
                fixed top-0 right-0 h-full w-full bg-white z-[70] transform transition-transform duration-300 overflow-y-auto
                lg:static lg:w-full lg:max-w-none lg:h-auto lg:bg-transparent lg:z-auto lg:shadow-none lg:transform-none lg:overflow-visible
                ${isMobileSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
              `}>
                <div className="flex flex-col bg-white lg:border rounded-sm lg:border-gray-200 h-full lg:h-auto">
                  <div className="px-5 py-4 border-b border-gray-200 sticky top-0 bg-white z-10 lg:static flex items-center justify-between">
                    <h3 className=" text-xl font-semibold text-gray-900">Product Categories</h3>
                    <button
                      className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-900 cursor-pointer"
                      onClick={() => setIsMobileSidebarOpen(false)}
                    >
                      <X size={24} />
                    </button>
                  </div>
                  <div className="p-6 flex-1 pb-20">
                    <nav className="flex flex-col space-y-6">
                      {categories
                        .filter(cat => cat.slug !== 'walk-in-cooler-freezer')
                        .map((cat) => (
                          <div key={cat.slug} className="flex flex-col">
                            <div className="flex items-center justify-between group">
                              <Link
                                href={`/refrigeration-equipment/${cat.slug}`}
                                onClick={() => setIsMobileSidebarOpen(false)}
                                className={`text-[16px] font-bold transition-colors ${slug === cat.slug ? 'text-[#004a99]' : 'text-gray-800 hover:text-[#004a99]'}`}
                              >
                                {cat.name}
                              </Link>
                              {cat.subcategories && cat.subcategories.length > 0 && (
                                <button
                                  onClick={(e) => toggleExpand(e, cat.slug)}
                                  className="p-1 cursor-pointer transition-colors"
                                >
                                  {expandedItems.includes(cat.slug) ? <Minus size={16} className="text-red-500" strokeWidth={1.5} /> : <Plus size={16} className="text-gray-600" strokeWidth={1.5} />}
                                </button>
                              )}
                            </div>

                            {cat.subcategories && cat.subcategories.length > 0 && expandedItems.includes(cat.slug) && (
                              <div className="mt-4 pl-4 border-l border-gray-200 ml-1 flex flex-col space-y-5">
                                {cat.subcategories.map((sub) => (
                                  <div key={sub.slug} className="flex flex-col">
                                    <div className="flex items-center justify-between group">
                                      <Link
                                        href={`/refrigeration-equipment/${sub.slug}`}
                                        onClick={() => setIsMobileSidebarOpen(false)}
                                        className={`text-[15px] font-semibold transition-colors ${slug === sub.slug ? 'text-[#004a99]' : 'text-gray-700 hover:text-[#004a99]'}`}
                                      >
                                        {sub.name}
                                      </Link>
                                      {sub.subcategories && sub.subcategories.length > 0 && (
                                        <button
                                          onClick={(e) => toggleExpand(e, sub.slug)}
                                          className="p-1 cursor-pointer transition-colors"
                                        >
                                          {expandedItems.includes(sub.slug) ? <Minus size={14} className="text-red-500" strokeWidth={1.5} /> : <Plus size={14} className="text-gray-600" strokeWidth={1.5} />}
                                        </button>
                                      )}
                                    </div>

                                    {sub.subcategories && sub.subcategories.length > 0 && expandedItems.includes(sub.slug) && (
                                      <div className="mt-3 pl-4 flex flex-col space-y-3.5">
                                        {sub.subcategories.map((deepSub) => (
                                          <Link
                                            key={deepSub.slug}
                                            href={`/refrigeration-equipment/${deepSub.slug}`}
                                            onClick={() => setIsMobileSidebarOpen(false)}
                                            className={`text-[14px] font-medium transition-colors block ${slug === deepSub.slug ? 'text-[#004a99]' : 'text-gray-600 hover:text-[#004a99]'}`}
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
                  products.slice(0, visibleCount).map((product) => {
                    const formattedInfo = extractProductInfo(product.keyFeatures) || extractProductInfo(product.description) || product.title;
                    return (
                      <Link
                        key={product.id}
                        href={`/refrigeration-equipment/${product.category?.slug || slug}/${product.id}`}
                        className="group bg-white border border-gray-200 rounded-sm p-2 overflow-hidden hover:-translate-y-1 transition-all duration-500 flex flex-col cursor-pointer block"
                      >
                        {/* Image Area */}
                        <div className="border-b border-gray-200 w-full rounded-sm bg-gray-50 overflow-hidden mb-3 relative pt-[100%]">
                          {product.images && product.images[0] ? (
                            <Image
                              src={product.images[0]}
                              alt={formattedInfo}
                              fill
                              className="object-contain p-2 transition-transform duration-700 group-hover:scale-105"
                              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-semibold bg-gray-100">No Image</div>
                          )}
                        </div>

                        {/* Content Area */}
                        <div className="flex flex-col flex-grow items-center text-center">
                          {/* Title */}
                          <h3 className="text-sm font-semibold text-gray-900 mb-1 text-center group-hover:text-primary transition-colors line-clamp-2" title={product.title}>
                            {product.title}
                          </h3>

                          {/* Price */}
                          {product.price ? (
                            <p className="text-base font-bold text-[#004a99] mb-2">${cleanPrice(product.price)}</p>
                          ) : (
                            <p className="text-xs font-medium text-gray-400 mb-2">Contact for Price</p>
                          )}

                          <div className="flex items-center justify-center gap-1.5 mb-4">
                            <div className="w-1.5 h-1.5 rounded-sm bg-[#00C853]"></div>
                            <span className="text-[9px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-widest">In Stock</span>
                          </div>

                          {/* Action Button */}
                          <div className="w-full mt-auto pb-1">
                            <div className="cursor-pointer w-full py-2.5 px-3 border-[1.5px] border-gray-200 rounded-sm flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] font-black text-[#0f172a] uppercase tracking-[0.2em] group-hover:border-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                              View Details
                              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })
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
    </main>
  );
}
