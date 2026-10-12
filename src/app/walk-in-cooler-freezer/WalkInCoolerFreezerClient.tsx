'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Pagination from '@/components/Pagination';
import {
  Plus, Minus, ShoppingCart, X, Grid, List as ListIcon,
  ChevronDown, Filter, Search, FileText, Ruler, ShieldCheck, ThermometerSnowflake
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  title: string;
  price: string | null;
  images: string[];
  slug: string;
  badge?: string | null;
  brand?: string | null;
  type?: string | null;
  features?: any;
}

const FilterSection = ({ id, title, children, expandedFilters, toggleFilter }: { id: string, title: string, children: React.ReactNode, expandedFilters: string[], toggleFilter: (id: string) => void }) => (
  <div className="border-b border-gray-100 last:border-0 py-4">
    <button
      onClick={() => toggleFilter(id)}
      className="flex items-center justify-between w-full group cursor-pointer"
    >
      <span className="text-[13px] font-bold text-gray-900 uppercase tracking-wider">{title}</span>
      <div className="text-gray-400 group-hover:text-[#004a99] transition-colors">
        {expandedFilters.includes(id) ? <Minus size={16} /> : <Plus size={16} />}
      </div>
    </button>
    {expandedFilters.includes(id) && (
      <div className="pt-4 space-y-3 max-h-56 overflow-y-auto custom-scrollbar pr-2">
        {children}
      </div>
    )}
  </div>
);

const Checkbox = ({ label, count, checked, onChange }: { label: string, count?: number, checked: boolean, onChange: () => void }) => (
  <label className="flex items-start gap-3 group cursor-pointer">
    {/* HIDDEN INPUT ADDED HERE FOR CLICK FUNCTIONALITY */}
    <input type="checkbox" className="hidden" checked={checked} onChange={onChange} />
    <div className="pt-0.5">
      <div className={`w-4 h-4 rounded-[3px] border flex items-center justify-center transition-all duration-200 ${checked ? 'bg-[#004a99] border-[#004a99] shadow-sm' : 'border-gray-300 bg-white group-hover:border-blue-400'}`}>
        {checked && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
      </div>
    </div>
    <span className={`text-sm font-medium transition-colors flex-1 ${checked ? 'text-[#004a99] font-bold' : 'text-gray-600 group-hover:text-gray-900'}`}>
      {label} {count !== undefined && <span className="text-gray-400 font-normal ml-1">({count})</span>}
    </span>
  </label>
);

export default function WalkInCoolerFreezerClient({ initialProducts, title = "Walk-In Cooler & Freezer" }: { initialProducts: Product[], title?: string }) {
  const { addToCart } = useCart();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [expandedFilters, setExpandedFilters] = useState<string[]>(['brand', 'size', 'refrigeration']);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [sortOption, setSortOption] = useState<string>('default');

  // Helpers
  const extractSize = (product: Product) => {
    if (product.features?.size) return product.features.size;
    const matchWithQuote = product.title.match(/(\d+)'\s*x\s*(\d+)'/i);
    if (matchWithQuote) return `${matchWithQuote[1]}' x ${matchWithQuote[2]}'`;
    const matchNoQuote = product.title.match(/(\d+)\s*x\s*(\d+)/i);
    if (matchNoQuote) return `${matchNoQuote[1]}' x ${matchNoQuote[2]}'`;
    return '';
  };

  const getFloorType = (product: Product) => {
    if (product.features?.floorType) return product.features.floorType;
    const text = (product.title + ' ' + (product.features?.walkInType || '')).toLowerCase();
    if (text.includes('floorless') || text.includes('no floor') || text.includes('without floor')) return 'No Floor';
    return 'With Floor';
  };

  const getWalkInType = (product: Product) => {
    if (product.features?.walkInType) return product.features.walkInType;
    if (product.title.includes('Cooler')) return product.title.includes('No Floor') || product.title.includes('Floorless') ? 'Cooler No Floor' : 'Cooler with Floor';
    if (product.title.includes('Freezer')) return 'Freezer with Floor';
    if (product.title.includes('Combo')) return 'Combo Unit';
    return '';
  };

  const getNumericPrice = (priceStr: string | null) => {
    if (!priceStr) return 0;
    const num = parseFloat(String(priceStr).replace(/[^0-9.]/g, ''));
    return isNaN(num) ? 0 : num;
  };

  // Derive filter counts
  const filterCounts = useMemo(() => {
    const counts = { brands: {} as Record<string, number>, floors: {} as Record<string, number>, sizes: {} as Record<string, number>, refrigeration: {} as Record<string, number>, walkInTypes: {} as Record<string, number> };
    initialProducts.forEach(product => {
      const brand = product.brand || product.title.split(' ')[0];
      if (brand) counts.brands[brand] = (counts.brands[brand] || 0) + 1;
      const floorType = getFloorType(product);
      if (floorType) counts.floors[floorType] = (counts.floors[floorType] || 0) + 1;
      const size = extractSize(product);
      if (size) counts.sizes[size] = (counts.sizes[size] || 0) + 1;
      const refrig = product.type || (product.features?.refrigerationType) || '';
      if (refrig) counts.refrigeration[refrig] = (counts.refrigeration[refrig] || 0) + 1;
      const walkInType = getWalkInType(product);
      if (walkInType) counts.walkInTypes[walkInType] = (counts.walkInTypes[walkInType] || 0) + 1;
    });
    return counts;
  }, [initialProducts]);

  // States
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedFloorTypes, setSelectedFloorTypes] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedRefrigerationTypes, setSelectedRefrigerationTypes] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const brands = useMemo(() => {
    const existingBrands = { ...filterCounts.brands };
    if (!existingBrands['Icemanz']) existingBrands['Icemanz'] = 0;
    if (!existingBrands['Amerikooler']) existingBrands['Amerikooler'] = 0;
    if (!existingBrands['Astra']) existingBrands['Astra'] = 0;
    return Object.entries(existingBrands).map(([name, count]) => ({ name, count })).sort((a, b) => {
      if (a.name.toLowerCase() === 'icemanz') return -1;
      if (b.name.toLowerCase() === 'icemanz') return 1;
      return a.name.localeCompare(b.name);
    });
  }, [filterCounts.brands]);

  const sortedSizes = useMemo(() => {
    return Object.entries(filterCounts.sizes).sort(([aSize], [bSize]) => {
      const parseDim = (s: string) => {
        const match = s.match(/(\d+)\s*'\s*x\s*(\d+)/i) || s.match(/(\d+)\s*x\s*(\d+)/i);
        return match ? [parseInt(match[1], 10), parseInt(match[2], 10)] : [999, 999];
      };
      const [wA, lA] = parseDim(aSize);
      const [wB, lB] = parseDim(bSize);
      return wA !== wB ? wA - wB : lA - lB;
    });
  }, [filterCounts.sizes]);

  const filteredProducts = useMemo(() => {
    return initialProducts.filter(product => {
      const brand = product.brand || product.title.split(' ')[0];
      const q = searchQuery.trim().toLowerCase();
      const searchMatch = !q || product.title.toLowerCase().includes(q) || (product.brand || '').toLowerCase().includes(q);
      const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(brand) || (product.brand && selectedBrands.includes(product.brand));
      const floorMatch = selectedFloorTypes.length === 0 || selectedFloorTypes.includes(getFloorType(product));
      const sizeMatch = selectedSizes.length === 0 || selectedSizes.includes(extractSize(product));
      const refrigerationMatch = selectedRefrigerationTypes.length === 0 || selectedRefrigerationTypes.includes(product.type || (product.features?.refrigerationType) || '');
      return searchMatch && brandMatch && floorMatch && sizeMatch && refrigerationMatch;
    });
  }, [initialProducts, searchQuery, selectedBrands, selectedFloorTypes, selectedSizes, selectedRefrigerationTypes]);

  const sortedProducts = useMemo(() => {
    const p = [...filteredProducts];
    if (sortOption === 'price-low') p.sort((a, b) => getNumericPrice(a.price) - getNumericPrice(b.price));
    if (sortOption === 'price-high') p.sort((a, b) => getNumericPrice(b.price) - getNumericPrice(a.price));
    if (sortOption === 'name-asc') p.sort((a, b) => a.title.localeCompare(b.title));
    if (sortOption === 'name-desc') p.sort((a, b) => b.title.localeCompare(a.title));
    return p;
  }, [filteredProducts, sortOption]);

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const currentProducts = sortedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleArray = (setter: any, value: string) => {
    setter((prev: any) => prev.includes(value) ? prev.filter((v: string) => v !== value) : [...prev, value]);
    setCurrentPage(1);
  };
  const clearAllFilters = () => { setSelectedBrands([]); setSelectedFloorTypes([]); setSelectedSizes([]); setSelectedRefrigerationTypes([]); setSearchQuery(''); setCurrentPage(1); };
  const toggleFilter = (id: string) => setExpandedFilters(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.title,
      brand: product.brand || product.title.split(' ')[0],
      price: String(getNumericPrice(product.price)),
      image: product.images[0] || '/placeholder.png',
      quantity: 1,
      category: 'walk-in-cooler-freezer'
    });
    toast.success(`${product.title} added to cart!`);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="flex flex-col lg:flex-row gap-6 pt-8 pb-8">

          {/* --- LEFT SIDEBAR --- */}
          <aside className="lg:w-[280px] shrink-0 sticky top-24">
            
            {/* Mobile Toggle */}
            <div className="lg:hidden flex gap-2 mb-4">
              <button onClick={() => setIsMobileSidebarOpen(true)} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg font-bold text-gray-800 shadow-sm">
                <Filter size={18} /> Filters
              </button>
            </div>

            {/* Sidebar Content */}
            <div className={`
              fixed inset-y-0 right-0 w-[85%] max-w-sm bg-white z-[100] transform transition-transform duration-300 overflow-y-auto shadow-2xl
              lg:static lg:w-full lg:max-w-none lg:bg-transparent lg:z-auto lg:shadow-none lg:transform-none lg:overflow-visible
              ${isMobileSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
            `}>
              
              {/* Mobile Overlay */}
              {isMobileSidebarOpen && <div className="fixed inset-0 bg-black/60 -z-10 lg:hidden" onClick={() => setIsMobileSidebarOpen(false)} />}

              <div className="bg-white lg:border lg:border-gray-200 lg:rounded-xl lg:shadow-sm overflow-hidden">
                
                {/* Header Mobile */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between lg:hidden bg-gray-50">
                  <h3 className="text-lg font-black text-gray-900">Filters</h3>
                  <button onClick={() => setIsMobileSidebarOpen(false)} className="p-2 bg-gray-200 rounded-full text-gray-600"><X size={18} /></button>
                </div>

                {/* Search */}
                <div className="p-6 border-b border-gray-100">
                  <h2 className="hidden lg:block text-xl font-semibold text-gray-900 mb-4">Filters</h2>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                      placeholder="Search SKU or name..."
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#004a99] outline-none text-sm font-medium transition-colors"
                    />
                    <Search size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                    {searchQuery && <button onClick={() => { setSearchQuery(''); setCurrentPage(1); }} className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-700"><X size={16} /></button>}
                  </div>
                </div>

                {/* Active Filters */}
                {(selectedBrands.length > 0 || selectedFloorTypes.length > 0 || selectedSizes.length > 0 || selectedRefrigerationTypes.length > 0) && (
                  <div className="px-6 pb-2 pt-4 bg-blue-50/30">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-bold text-gray-500 uppercase">Active Filters</span>
                      <button onClick={clearAllFilters} className="text-xs font-bold text-[#004a99] hover:underline">Clear All</button>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {[...selectedBrands, ...selectedFloorTypes, ...selectedSizes, ...selectedRefrigerationTypes].map(f => (
                        <span key={f} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-blue-200 rounded text-[11px] font-bold text-[#004a99] shadow-sm">
                          {f} <X size={12} className="cursor-pointer hover:text-red-500" onClick={() => {
                            if(selectedBrands.includes(f)) toggleArray(setSelectedBrands, f);
                            if(selectedFloorTypes.includes(f)) toggleArray(setSelectedFloorTypes, f);
                            if(selectedSizes.includes(f)) toggleArray(setSelectedSizes, f);
                            if(selectedRefrigerationTypes.includes(f)) toggleArray(setSelectedRefrigerationTypes, f);
                          }}/>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Filter Accordions */}
                <div className="px-6 pb-6">
                  <FilterSection id="brand" title="Brand" expandedFilters={expandedFilters} toggleFilter={toggleFilter}>
                    {brands.map(brand => <Checkbox key={brand.name} label={brand.name} count={brand.count} checked={selectedBrands.includes(brand.name)} onChange={() => toggleArray(setSelectedBrands, brand.name)} />)}
                  </FilterSection>

                  {sortedSizes.length > 0 && (
                    <FilterSection id="size" title="Size (W x L)" expandedFilters={expandedFilters} toggleFilter={toggleFilter}>
                      {sortedSizes.map(([size, count]) => <Checkbox key={size} label={size} count={count} checked={selectedSizes.includes(size)} onChange={() => toggleArray(setSelectedSizes, size)} />)}
                    </FilterSection>
                  )}

                  {Object.keys(filterCounts.floors).length > 0 && (
                    <FilterSection id="floor" title="Floor Option" expandedFilters={expandedFilters} toggleFilter={toggleFilter}>
                      {Object.entries(filterCounts.floors).map(([floor, count]) => <Checkbox key={floor} label={floor} count={count} checked={selectedFloorTypes.includes(floor)} onChange={() => toggleArray(setSelectedFloorTypes, floor)} />)}
                    </FilterSection>
                  )}

                  {Object.keys(filterCounts.refrigeration).length > 0 && (
                    <FilterSection id="refrigeration" title="Compressor Type" expandedFilters={expandedFilters} toggleFilter={toggleFilter}>
                      {Object.entries(filterCounts.refrigeration).map(([type, count]) => <Checkbox key={type} label={type} count={count} checked={selectedRefrigerationTypes.includes(type)} onChange={() => toggleArray(setSelectedRefrigerationTypes, type)} />)}
                    </FilterSection>
                  )}
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100 lg:hidden">
                  <button onClick={() => setIsMobileSidebarOpen(false)} className="w-full py-3 bg-[#004a99] text-white font-bold rounded-lg">View Results ({filteredProducts.length})</button>
                </div>
              </div>
            </div>
          </aside>

          {/* --- RIGHT MAIN CONTENT --- */}
          <div className="flex-1 w-full min-w-0">

            {/* Toolbar */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                 <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                <span className="text-sm font-medium text-gray-500">Showing {currentProducts.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}–{Math.min(currentPage * itemsPerPage, sortedProducts.length)} of {sortedProducts.length} results</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative border border-gray-200 rounded-lg bg-white flex items-center hover:border-gray-300 transition-colors">
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="appearance-none bg-transparent pl-4 pr-10 py-2.5 text-sm font-medium text-gray-700 outline-none w-full cursor-pointer"
                  >
                    <option value="default">Default sorting</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name-asc">Name (A to Z)</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 text-gray-500 pointer-events-none" />
                </div>

                <div className="hidden sm:flex items-center gap-1 border border-gray-200 rounded-lg p-1 bg-gray-50 shrink-0">
                  <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-[#004a99] shadow text-white' : 'text-gray-400 hover:text-gray-700'}`}><Grid size={18}/></button>
                  <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-[#004a99] shadow text-white' : 'text-gray-400 hover:text-gray-700'}`}><ListIcon size={18}/></button>
                </div>
              </div>
            </div>

            {/* Products Layout */}
            {currentProducts.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 py-20 text-center shadow-sm">
                <Search size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No products match your filters</h3>
                <p className="text-gray-500 mb-6 text-sm">Try adjusting or clearing your filters to see more results.</p>
                <button onClick={clearAllFilters} className="px-6 py-2.5 bg-blue-50 text-[#004a99] font-bold rounded-lg hover:bg-blue-100 transition-colors">Clear All Filters</button>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4" : "flex flex-col gap-4"}>
                {currentProducts.map((product) => {
                  const numPrice = getNumericPrice(product.price);
                  const isHighValue = numPrice > 10000;
                  const extractedSize = extractSize(product);
                  const extractedFloor = getFloorType(product);

                  return (
                    <div key={product.id} className={`bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all duration-300 group flex ${viewMode === 'list' ? 'flex-col sm:flex-row' : 'flex-col'}`}>
                      
                      {/* Image Area */}
                      <div className={`relative bg-white flex items-center justify-center p-4 ${viewMode === 'list' ? 'sm:w-[260px] sm:border-r border-b sm:border-b-0 border-gray-100' : 'aspect-square border-b border-gray-100'}`}>
                        {product.badge && <span className="absolute top-3 left-3 bg-green-100 text-green-800 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded border border-green-200 z-10">{product.badge}</span>}
                        <Link href={`/walk-in-cooler-freezer/${product.slug}`} className="absolute inset-0 z-0 flex items-center justify-center p-4">
                          <img src={product.images[0] || '/placeholder.png'} alt={product.title} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                        </Link>
                      </div>

                      {/* Content Area */}
                      <div className={`p-4 flex flex-col flex-grow ${viewMode === 'list' ? 'sm:w-2/3' : ''}`}>
                        <div className="flex justify-between items-start mb-1.5 gap-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#004a99] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                            {product.brand || product.title.split(' ')[0] || 'Unbranded'}
                          </span>
                          {(product.type || product.features?.refrigerationType) && (
                             <span className="text-[9px] font-bold text-gray-500 flex items-center gap-1"><ThermometerSnowflake size={10}/> {product.type || product.features?.refrigerationType}</span>
                          )}
                        </div>

                        <Link href={`/walk-in-cooler-freezer/${product.slug}`} className="block group-hover:text-[#004a99] transition-colors mb-2">
                          <h3 className={`font-bold text-gray-900 leading-snug ${viewMode === 'list' ? 'text-lg line-clamp-2' : 'text-sm line-clamp-3'}`}>{product.title}</h3>
                        </Link>

                        {/* Specs for List View */}
                        {viewMode === 'list' && (
                          <div className="flex flex-wrap gap-4 mb-4 mt-1 border-t border-b border-gray-50 py-2">
                            {extractedSize && (
                              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600"><Ruler size={14} className="text-[#004a99]"/> Dimensions: <span className="text-gray-900">{extractedSize}</span></div>
                            )}
                            {extractedFloor && (
                              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600"><ShieldCheck size={14} className="text-[#004a99]"/> Floor: <span className="text-gray-900">{extractedFloor}</span></div>
                            )}
                          </div>
                        )}

                        <div className="mt-auto pt-3">
                          <div className="flex items-end gap-1 mb-3">
                            <span className="text-xl font-black text-[#003366]">${numPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                            <span className="text-[10px] font-bold text-gray-400 mb-1">/ Ea.</span>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row gap-2">
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#004a99] text-white text-[11px] font-black uppercase tracking-wider rounded-lg shadow-md hover:bg-[#003366] active:scale-95 transition-all cursor-pointer"
                            >
                              <ShoppingCart size={14} /> Add to Cart
                            </button>
                            
                            {isHighValue && (
                              <Link 
                                href={`/quote?product=${product.id}`}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-white text-[#004a99] border-2 border-[#004a99] text-[11px] font-black uppercase tracking-wider rounded-lg hover:bg-blue-50 active:scale-95 transition-all cursor-pointer"
                              >
                                <FileText size={14} /> Get Quote
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </div>
            )}

          </div>
        </div>
      </div>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
}


