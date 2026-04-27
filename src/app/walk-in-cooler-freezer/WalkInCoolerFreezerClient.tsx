'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Plus,
  Minus,
  ShoppingCart,
  X
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface Product {
  id: string;
  brand: string;
  name: string;
  model: string;
  price: string;
  image: string;
}

const mockProducts: Product[] = [
  { id: '1', brand: 'ASTRA', name: 'Astra 6 x 6 Walk-In Cooler No Floor', model: 'CNF6X6', price: '2,903.00', image: '/Walk-inCooler&Freezer/walkincoolers.jpg' },
  { id: '2', brand: 'ASTRA', name: 'Astra 6 x 8 Walk-In Cooler No Floor', model: 'CNF6X8', price: '3,156.00', image: '/Walk-inCooler&Freezer/walkincoolers.jpg' },
  { id: '3', brand: 'ASTRA', name: 'Astra 6 x 6 Walk-In Cooler with Floor', model: 'CWF6X6', price: '3,165.00', image: '/Walk-inCooler&Freezer/coolerswithfloor.jpg' },
  { id: '4', brand: 'ASTRA', name: 'Astra 5 x 6 Walk-In Cooler No Floor', model: 'CNF5X6', price: '3,220.00', image: '/Walk-inCooler&Freezer/walkincoolers.jpg' },
  { id: '5', brand: 'ASTRA', name: 'Astra 6 x 10 Walk-In Cooler No Floor', model: 'CNF6X10', price: '3,410.00', image: '/Walk-inCooler&Freezer/walkincoolers.jpg' },
  { id: '6', brand: 'ASTRA', name: 'Astra 6 x 8 Walk-In Cooler with Floor', model: 'CWF6X8', price: '3,447.00', image: '/Walk-inCooler&Freezer/coolerswithfloor.jpg' },
  { id: '7', brand: 'COLDLINE', name: 'Coldline 6 x 6 Walk-in Refrigerator Cooler Box', model: 'CL6X6', price: '3,472.74', image: '/Walk-inCooler&Freezer/walkincoolers.jpg' },
  { id: '8', brand: 'ASTRA', name: 'Astra 5 x 8 Walk-In Cooler No Floor', model: 'CNF5X8', price: '3,488.00', image: '/Walk-inCooler&Freezer/walkincoolers.jpg' },
];

const FilterSection = ({ id, title, children, expandedFilters, toggleFilter }: { id: string, title: string, children: React.ReactNode, expandedFilters: string[], toggleFilter: (id: string) => void }) => (
  <div className="flex flex-col bg-white border rounded-sm border-gray-200 mb-4">
    <button
      onClick={() => toggleFilter(id)}
      className="px-5 py-4 flex items-center cursor-pointer justify-between w-full border-b border-gray-200"
    >
      <span className="text-sm font-semibold text-gray-900">{title}</span>
      {expandedFilters.includes(id) ? <Minus size={14} className="text-gray-800" /> : <Plus size={14} className="text-gray-800" />}
    </button>
    {expandedFilters.includes(id) && (
      <div className="p-5 space-y-4">
        {children}
      </div>
    )}
  </div>
);

const Checkbox = ({ label, count }: { label: string, count?: number }) => (
  <label className="flex items-center gap-3 group cursor-pointer">
    <div className="w-4 h-4 border border-gray-300 rounded-sm flex items-center justify-center group-hover:border-primary transition-colors">
      <div className="w-2 h-2 bg-primary scale-0 transition-transform group-hover:scale-100 opacity-20"></div>
    </div>
    <span className="text-[13px] font-semibold text-gray-600 group-hover:text-primary transition-colors">
      {label} {count !== undefined && <span className="text-gray-400 font-medium">({count})</span>}
    </span>
  </label>
);

export default function WalkInCoolerFreezerClient() {
  const { addToCart } = useCart();
  const [expandedFilters, setExpandedFilters] = useState<string[]>(['brand', 'size', 'refrigeration', 'type', 'product-type', 'depth']);
  const [visibleProductCount, setVisibleProductCount] = useState(15); // Initially show 3 rows * 5 products/row

  const toggleFilter = (id: string) => {
    setExpandedFilters(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const handleLoadMore = () => {
    setVisibleProductCount(prevCount => prevCount + 5); // Load 5 more products
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      <div className="container mx-auto px-4 pt-8 ">
        <div className="flex flex-col lg:flex-row gap-8 pb-20 pt-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-60 xl:w-64 shrink-0">
            <div className="space-y-0">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Filters</h2>

              {/* Active Filters / Selected Filters */}
              <div className="  bg-white rounded-sm  p-5">
                <div className="flex flex-wrap gap-2 mb-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                    Depth: 5
                    <button className="hover:text-primary cursor-pointer transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                </div>
                <button className="text-sm mt-5 cursor-pointer font-semibold text-gray-900 underline decoration-gray-300 underline-offset-4 hover:text-primary hover:decoration-primary transition-all">
                  Clear all filters
                </button>
              </div>

              <div className=" border-t border-gray-100 pt-8">
                <FilterSection id="brand" title="Brand" expandedFilters={expandedFilters} toggleFilter={toggleFilter}>
                  <Checkbox label="Astra" count={639} />
                  <Checkbox label="Amerikooler" count={136} />
                  <Checkbox label="Atosa" count={6} />
                  <Checkbox label="Coldline" count={65} />
                </FilterSection>

                <FilterSection id="size" title="Size W x L" expandedFilters={expandedFilters} toggleFilter={toggleFilter}>
                  <Checkbox label="5' x 6'" count={9} />
                  <Checkbox label="5' x 8'" count={9} />
                  <Checkbox label="5' x 10'" count={11} />
                  <Checkbox label="5' x 12'" count={10} />
                </FilterSection>

                <FilterSection id="refrigeration" title="Refrigeration" expandedFilters={expandedFilters} toggleFilter={toggleFilter}>
                  <Checkbox label="No Refrigeration" count={378} />
                  <Checkbox label="Top-Mount Refrigeration" count={229} />
                  <Checkbox label="Remote Refrigeration" count={188} />
                </FilterSection>

                <FilterSection id="type" title="Walk In Type" expandedFilters={expandedFilters} toggleFilter={toggleFilter}>
                  <Checkbox label="Combo (Cooler & Freezer)" count={101} />
                  <Checkbox label="Cooler" count={1} />
                </FilterSection>

                <FilterSection id="product-type" title="Product Type" expandedFilters={expandedFilters} toggleFilter={toggleFilter}>
                  <Checkbox label="Indoor" count={45} />
                  <Checkbox label="Outdoor" count={32} />
                </FilterSection>

                <FilterSection id="depth" title="Depth" expandedFilters={expandedFilters} toggleFilter={toggleFilter}>
                  <Checkbox label="4'" count={12} />
                  <Checkbox label="5'" count={28} />
                  <Checkbox label="6'" count={15} />
                </FilterSection>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Grid Header */}
            <div className="flex mb-8 flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-primary tracking-tight">
                  Walk-in Cooler & Freezer
                </h1>
                <p className="text-sm pt-2 block font-medium text-gray-500">
                  Showing 1–{mockProducts.length} of {mockProducts.length} results
                </p>
              </div>


            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-3 sm:gap-4">
              {mockProducts.slice(0, visibleProductCount).map((product) => (
                <Link
                  key={product.id}
                  href={`/walk-in-cooler-freezer/all/${product.id}`}
                  className="group bg-white border border-gray-200 rounded-sm p-2 overflow-hidden hover:-translate-y-1 transition-all duration-500 flex flex-col h-full"
                >
                  {/* Image Area */}
                  <div className="border-b border-gray-200 w-full rounded-sm bg-white overflow-hidden mb-2 relative pt-[90%] shrink-0">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-2 transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    />
                  </div>

                  {/* Content Area */}
                  <div className="flex flex-col text-center items-center px-1 mt-1 flex-grow">
                    <span className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase mb-0.5">
                      {product.brand}
                    </span>
                    <h3 className="text-[12px] sm:text-[13px] font-semibold text-gray-900 mb-1 tracking-tight group-hover:text-primary transition-colors line-clamp-2 min-h-[36px] flex items-center justify-center leading-tight">
                      {product.name}
                    </h3>

                    {/* Price */}
                    <p className="text-sm sm:text-base font-bold text-[#004a99] mb-1">${product.price}</p>

                    <div className="flex items-center justify-center gap-1 mb-3">
                      <div className="w-1 h-1 rounded-sm bg-[#00C853]"></div>
                      <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">In Stock</span>
                    </div>

                    {/* Action Button */}
                    <div className="w-full mt-auto pb-1">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        className="cursor-pointer w-full py-2 px-2 bg-primary border border-primary  flex items-center justify-center gap-1.5 text-[9px] sm:text-[10px] font-black text-white uppercase tracking-widest hover:bg-[#003d80] hover:border-[#003d80] transition-all duration-300 shadow-sm active:scale-95"
                      >
                        <ShoppingCart size={12} />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Load More Button */}
            {visibleProductCount < mockProducts.length && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleLoadMore}
                  className="bg-primary text-white px-6 py-3 rounded-sm font-semibold hover:bg-[#003d80] transition-colors"
                >
                  Load More
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

  );
}
