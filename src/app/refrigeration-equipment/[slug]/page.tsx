"use client";

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
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

// Define the hierarchical category data
const categories = [
  {
    name: 'Condensing Units',
    slug: 'condensing-units',
    subcategories: [
      {
        name: 'Low Profile',
        slug: 'low-profile',
        subcategories: [
          { name: 'Scroll compressor', slug: 'scroll-compressor' },
          { name: 'Semi- Hermetic', slug: 'semi-hermetic' }
        ]
      },
      {
        name: 'Medium Profile (Scroll Compressor)',
        slug: 'medium-profile-scroll-compressor'
      }
    ]
  },
  {
    name: 'Evaporation Units',
    slug: 'evaporation-units',
    subcategories: [
      {
        name: 'Low Profile Evaporator',
        slug: 'low-profile-evaporator',
        subcategories: [
          { name: 'Air Defrost', slug: 'air-defrost-low' },
          { name: 'Electric Defrost', slug: 'electric-defrost-low' }
        ]
      },
      {
        name: 'Medium Profile',
        slug: 'medium-profile',
        subcategories: [
          { name: 'Air Defrost', slug: 'air-defrost-medium' },
          { name: 'Electric Defrost - 6FPI', slug: 'electric-defrost-6fpi' },
          { name: 'Electric Defrost - 4FPI', slug: 'electric-defrost-4fpi' }
        ]
      },
      {
        name: 'Center Mount Evaporator (Low Velocity)',
        slug: 'center-mount-evaporator-low-velocity',
        subcategories: [
          { name: 'Air Defrost', slug: 'air-defrost-center' },
          { name: 'Electric Defrost', slug: 'electric-defrost-center' }
        ]
      },
      {
        name: 'Thin Profile Evaporator (Reach-in)',
        slug: 'thin-profile-evaporator-reach-in',
        subcategories: [
          { name: 'Air Defrost', slug: 'air-defrost-thin' },
          { name: 'Electric Defrost', slug: 'electric-defrost-thin' }
        ]
      }
    ]
  },
  {
    name: 'Combo Units/Package Units',
    slug: 'combo-units-package-unit',
    subcategories: [
      { name: 'Indoor', slug: 'indoor' },
      { name: 'Outdoor', slug: 'outdoor' }
    ]
  }
];
import { useParams } from 'next/navigation';

// Mock products data for refrigeration equipment categories
const products = [
  {
    id: 1,
    name: "TS-MR Condensing Unit",
    price: "From $1,200",
    image: "/products/condensingUnits/TS-MR_XR1-600x600.jpg",
    specs: ["Air Cooled", "R448A/R449A", "Outdoor Housing"]
  },
  {
    id: 2,
    name: "Premium Evaporator Coil",
    price: "From $850",
    image: "/products/condensingUnits/TS-MR_XR1-600x600-1.jpg",
    specs: ["Electric Defrost", "Low Profile", "Aluminum Fins"]
  },
  {
    id: 3,
    name: "Industrial Scroll Compressor",
    price: "From $2,400",
    image: "/products/condensingUnits/TS-MR_XR1-600x600-2.jpg",
    specs: ["High Efficiency", "Quiet Operation", "Vibration Isolation"]
  },
  {
    id: 4,
    name: "Center Mount Cooling Unit",
    price: "From $1,100",
    image: "/products/condensingUnits/TS-MR_XR1-600x600-3.jpg",
    specs: ["Dual Discharge", "Compact Design", "Easy Install"]
  },
  {
    id: 5,
    name: "High Capacity Combo Unit",
    price: "From $3,500",
    image: "/products/condensingUnits/TS-MR_XR1-600x600-4.jpg",
    specs: ["Plug & Play", "Pre-charged", "Microprocessor Control"]
  },
  {
    id: 6,
    name: "Thin Profile reach-in Unit",
    price: "From $750",
    image: "/products/condensingUnits/TS-MR_XR1-600x600-5.jpg",
    specs: ["Ultra Slim", "Space Saving", "LED Lighting"]
  }
];

export default function RefrigerationSubcategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [expandedItems, setExpandedItems] = useState<string[]>(['condensing-units', 'low-profile-evaporator']);

  const toggleExpand = (e: React.MouseEvent, itemSlug: string) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedItems(prev =>
      prev.includes(itemSlug)
        ? prev.filter(s => s !== itemSlug)
        : [...prev, itemSlug]
    );
  };

  // Convert slug back to title case, or find it in the categories hierarchy
  const findTitle = (cats: any[], targetSlug: string): string | null => {
    for (const cat of cats) {
      if (cat.slug === targetSlug) return cat.name;
      if (cat.subcategories) {
        const found = findTitle(cat.subcategories, targetSlug);
        if (found) return found;
      }
    }
    return null;
  };

  const title = findTitle(categories, slug) || slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="pt-36 pb-20 md:pt-48 md:pb-24">
        <div className="container px-4">

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Consistent with Walk-in page */}
            <aside className="lg:w-72 xl:w-[320px] shrink-0">
              <div className="space-y-6">
                {/* Subcategories Section */}
                <div className="flex flex-col bg-white border rounded-sm border-gray-200 ">
                  <div className="px-5 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className=" text-xl font-semibold text-gray-900">Product Categories</h3>
                      {/* <Minus size={18} className="text-gray-900" /> */}
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
                            {cat.subcategories && (
                              <button
                                onClick={(e) => toggleExpand(e, cat.slug)}
                                className="p-1 cursor-pointer transition-colors"
                              >
                                {expandedItems.includes(cat.slug) ? <Minus size={14} className="text-gray-800" /> : <Plus size={14} className="text-gray-800" />}
                              </button>
                            )}
                          </div>

                          {cat.subcategories && expandedItems.includes(cat.slug) && (
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
                                    {sub.subcategories && (
                                      <button
                                        onClick={(e) => toggleExpand(e, sub.slug)}
                                        className="p-1 cursor-pointer transition-colors"
                                      >
                                        {expandedItems.includes(sub.slug) ? <Minus size={12} className="text-gray-600" /> : <Plus size={12} className="text-gray-600" />}
                                      </button>
                                    )}
                                  </div>

                                  {sub.subcategories && expandedItems.includes(sub.slug) && (
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
                    Showing 1–{products.length} of 6 results
                  </p>
                </div>
                <div className="flex items-center gap-4 sm:ml-auto">
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
                    <button className="size-[30px]   bg-[#003d80] rounded flex items-center justify-center cursor-pointer " aria-label="Grid view">
                      <LayoutGrid size={14} className="text-white" strokeWidth={2.5} />
                    </button>
                    {/* List View (Inactive) */}
                    <button className="size-[30px] bg-[#f1f5f9] rounded flex items-center justify-center cursor-pointer transition-colors hover:bg-[#e2e8f0]" aria-label="List view">
                      <Menu size={14} className="text-gray-500" strokeWidth={2.5} />
                    </button>
                  </div>

                </div>
              </div>




              {/* Products Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-8">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/refrigeration-equipment/${slug}/${product.id}`}
                    className="group bg-white border  border-gray-200 
                    
                    rounded-sm p-2 overflow-hidden hover:-translate-y-1 transition-all duration-500 flex flex-col"
                  >
                    {/* Image Area */}
                    <div className=" border-b border-gray-200  w-full  rounded-none bg-gray-50 overflow-hidden mb-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="size-full   transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>

                    {/* Content Area */}
                    <div className="flex flex-col  text-center items-center px-1 mt-2">
                      <h3 className="text-sm  font-semibold text-gray-900 mb-2 tracking-tight group-hover:text-primary transition-colors line-clamp-2">
                        {product.name}
                      </h3>

                      <div className="flex items-center justify-center gap-1.5 mb-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00C853]"></div>
                        <span className="text-[9px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-widest">In Stock</span>
                      </div>

                      {/* Action Button */}
                      <div className="w-full mt-auto pb-1">
                        <div className="cursor-pointer w-full py-2.5 px-3 border-[1.5px] border-gray-200 rounded-none flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] font-black text-[#0f172a] uppercase tracking-[0.2em] group-hover:border-gray-300 group-hover:bg-gray-50 transition-all duration-300 shadow-sm group-hover:shadow">
                          View Details
                          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform text-[#0f172a]" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex  items-center justify-center gap-4 py-5">

                <button className=' bg-[#003d80] text-center uppercase  font-semibold text-sm cursor-pointer text-white py-2 px-4  rounded-md'>
                  Load More
                </button>
              </div>

            </div>

          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
