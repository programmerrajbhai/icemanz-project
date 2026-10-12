"use client";

import React, { useState, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Filter, X, ChevronDown, Search, ArrowRight, 
  ThermometerSnowflake, Ruler, Grid, List as ListIcon, ShieldCheck
} from 'lucide-react';

// --- Demo Data: In a real app, this comes from your database/Prisma ---
const DEMO_PRODUCTS = [
  { id: '1', title: '6\' x 6\' Walk-In Cooler (No Floor)', price: 4200, type: 'Cooler', width: '6ft', depth: '6ft', system: 'Top Mount', image: '/slider/s_1.jpeg', quickShip: true },
  { id: '2', title: '8\' x 10\' Walk-In Freezer (With Floor)', price: 7800, type: 'Freezer', width: '8ft', depth: '10ft', system: 'Remote', image: '/slider/s_2.jpeg', quickShip: false },
  { id: '3', title: '10\' x 12\' Walk-In Cooler (No Floor)', price: 6500, type: 'Cooler', width: '10ft', depth: '12ft', system: 'Remote', image: '/slider/s_3.jpeg', quickShip: true },
  { id: '4', title: '8\' x 8\' Walk-In Combo Cooler/Freezer', price: 12500, type: 'Combo', width: '8ft', depth: '8ft', system: 'Top Mount', image: '/slider/s_1.jpeg', quickShip: false },
  { id: '5', title: '12\' x 20\' Commercial Warehouse Cooler', price: 18900, type: 'Cooler', width: '12ft+', depth: '12ft+', system: 'Remote', image: '/slider/s_2.jpeg', quickShip: false },
  { id: '6', title: '6\' x 8\' Walk-In Freezer (With Floor)', price: 6100, type: 'Freezer', width: '6ft', depth: '8ft', system: 'Top Mount', image: '/slider/s_3.jpeg', quickShip: true },
];

export default function CategoryFilterPage() {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Filter States
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedWidths, setSelectedWidths] = useState<string[]>([]);
  const [selectedSystems, setSelectedSystems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Toggle Filter Logic
  const toggleFilter = (state: string[], setState: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    setState(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
  };

  // Filtered Products Logic
  const filteredProducts = useMemo(() => {
    return DEMO_PRODUCTS.filter(product => {
      const matchSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchType = selectedTypes.length === 0 || selectedTypes.includes(product.type);
      const matchWidth = selectedWidths.length === 0 || selectedWidths.includes(product.width);
      const matchSystem = selectedSystems.length === 0 || selectedSystems.includes(product.system);
      return matchSearch && matchType && matchWidth && matchSystem;
    });
  }, [searchQuery, selectedTypes, selectedWidths, selectedSystems]);

  // Clear All Filters
  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedWidths([]);
    setSelectedSystems([]);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      {/* Page Header (B2B Style) */}
      <div className="bg-[#001a33] text-white pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center gap-2 text-sm text-blue-300 font-medium mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link> / 
            <span className="text-gray-300">Walk-In Coolers & Freezers</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">Commercial Walk-In Systems</h1>
          <p className="text-blue-100 max-w-2xl text-lg leading-relaxed">
            Filter by dimensions, temperature, and refrigeration type to find the exact equipment for your facility. 
            Need help? <Link href="/recommendation" className="text-white underline font-bold">Use our recommendation tool.</Link>
          </p>
        </div>
      </div>

      <main className="container mx-auto max-w-7xl px-4 py-8 flex-grow">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden w-full flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <button onClick={() => setIsMobileFilterOpen(true)} className="flex items-center gap-2 font-bold text-gray-800">
              <Filter size={20} /> Show Filters
            </button>
            <span className="text-sm font-bold text-gray-500">{filteredProducts.length} Results</span>
          </div>

          {/* Sidebar Filters (Desktop & Mobile) */}
          <aside className={`fixed inset-0 z-[100] lg:static lg:z-auto lg:w-1/4 lg:block ${isMobileFilterOpen ? 'block' : 'hidden'}`}>
            <div className="absolute inset-0 bg-black/50 lg:hidden" onClick={() => setIsMobileFilterOpen(false)}></div>
            <div className="absolute top-0 right-0 h-full w-[85%] max-w-sm bg-white p-6 overflow-y-auto lg:static lg:w-full lg:h-auto lg:bg-transparent lg:p-0 lg:overflow-visible shadow-2xl lg:shadow-none transition-transform">
              
              <div className="flex justify-between items-center mb-6 lg:mb-8">
                <h2 className="text-xl font-black text-gray-900 flex items-center gap-2"><Filter size={20}/> Filters</h2>
                <button onClick={() => setIsMobileFilterOpen(false)} className="lg:hidden p-2 bg-gray-100 rounded-full"><X size={20}/></button>
                <button onClick={clearFilters} className="hidden lg:block text-sm text-blue-600 font-bold hover:underline">Clear All</button>
              </div>

              {/* Search Filter */}
              <div className="mb-8">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search SKU or Name..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm font-medium shadow-sm"
                  />
                  <Search size={18} className="absolute left-3 top-3.5 text-gray-400" />
                </div>
              </div>

              {/* Filter Categories */}
              <div className="space-y-8">
                
                {/* Product Type */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><ThermometerSnowflake size={18} className="text-blue-600"/> System Type</h3>
                  <div className="space-y-3">
                    {['Cooler', 'Freezer', 'Combo'].map(type => (
                      <label key={type} className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" checked={selectedTypes.includes(type)} onChange={() => toggleFilter(selectedTypes, setSelectedTypes, type)} className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer" />
                        <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Dimensions (Width) */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Ruler size={18} className="text-blue-600"/> Width Size</h3>
                  <div className="space-y-3">
                    {['6ft', '8ft', '10ft', '12ft+'].map(width => (
                      <label key={width} className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" checked={selectedWidths.includes(width)} onChange={() => toggleFilter(selectedWidths, setSelectedWidths, width)} className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer" />
                        <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">{width} Wide</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Refrigeration System */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><ShieldCheck size={18} className="text-blue-600"/> Compressor Type</h3>
                  <div className="space-y-3">
                    {['Top Mount', 'Remote', 'Box Only'].map(sys => (
                      <label key={sys} className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" checked={selectedSystems.includes(sys)} onChange={() => toggleFilter(selectedSystems, setSelectedSystems, sys)} className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer" />
                        <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">{sys}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button onClick={() => setIsMobileFilterOpen(false)} className="w-full lg:hidden py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md">
                  Apply Filters
                </button>
              </div>
            </div>
          </aside>

          {/* Right Content: Products Grid/List */}
          <section className="w-full lg:w-3/4">
            
            {/* Toolbar */}
            <div className="hidden lg:flex justify-between items-center mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <span className="text-sm font-bold text-gray-700">Showing {filteredProducts.length} Results</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-1 bg-gray-50">
                  <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}><Grid size={18}/></button>
                  <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}><ListIcon size={18}/></button>
                </div>
                <div className="relative border border-gray-200 rounded-lg px-3 py-2 bg-white flex items-center gap-2 cursor-pointer">
                  <span className="text-sm font-bold text-gray-700">Sort by: Recommended</span>
                  <ChevronDown size={16} className="text-gray-500"/>
                </div>
              </div>
            </div>

            {/* Products Layout */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
                <div className="text-gray-400 mb-4 flex justify-center"><Search size={48} /></div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No systems found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters to see more results.</p>
                <button onClick={clearFilters} className="px-6 py-3 bg-blue-50 text-blue-600 font-bold rounded-lg hover:bg-blue-100 transition-colors">Clear All Filters</button>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "flex flex-col gap-4"}>
                {filteredProducts.map(product => (
                  <div key={product.id} className={`bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group ${viewMode === 'list' ? 'flex flex-col sm:flex-row' : 'flex flex-col'}`}>
                    
                    {/* Image Area */}
                    <div className={`relative bg-gray-50 p-6 ${viewMode === 'list' ? 'sm:w-1/3 border-r border-gray-100' : 'aspect-[4/3] border-b border-gray-100'}`}>
                      {product.quickShip && (
                        <span className="absolute top-4 left-4 bg-green-100 text-green-800 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full z-10 border border-green-200 shadow-sm">Quick Ship</span>
                      )}
                      <Image src={product.image} alt={product.title} fill className="object-contain p-4 group-hover:scale-105 transition-transform duration-500" />
                    </div>

                    {/* Content Area */}
                    <div className={`p-6 flex flex-col flex-grow ${viewMode === 'list' ? 'sm:w-2/3' : ''}`}>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[11px] font-black uppercase tracking-widest text-blue-600">{product.type} System</span>
                        <span className="text-[10px] font-bold text-gray-400">SKU: {product.id.padStart(5, '0')}</span>
                      </div>
                      
                      <h3 className="text-lg font-black text-gray-900 mb-3 line-clamp-2 leading-snug">{product.title}</h3>
                      
                      {/* Key Specs for B2B */}
                      <div className="grid grid-cols-2 gap-y-2 mb-6">
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-bold text-gray-400">Dimensions</span>
                          <span className="text-sm font-semibold text-gray-800">{product.width} x {product.depth}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-bold text-gray-400">Compressor</span>
                          <span className="text-sm font-semibold text-gray-800">{product.system}</span>
                        </div>
                      </div>

                      <div className="mt-auto">
                        <div className="flex items-end gap-2 mb-4">
                          <span className="text-2xl font-black text-[#003366]">${product.price.toLocaleString()}</span>
                          <span className="text-sm font-medium text-gray-500 mb-1">/ Ea.</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <Link href={`/walk-in-cooler-freezer/${product.id}`} className="flex-1 text-center py-3 bg-blue-600 text-white text-sm font-bold uppercase rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg">
                            View Details
                          </Link>
                          {product.price > 10000 && (
                            <Link href="/quote" className="flex-1 text-center py-3 bg-white border-2 border-[#003366] text-[#003366] text-sm font-bold uppercase rounded-lg hover:bg-gray-50 transition-colors">
                              Quote
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}