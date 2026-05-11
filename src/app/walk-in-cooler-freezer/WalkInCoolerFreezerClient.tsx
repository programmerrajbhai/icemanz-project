'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Plus,
  Minus,
  ShoppingCart,
  X,
  Grid3X3,
  LayoutList,
  ChevronDown,
  ChevronLeft
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface Product {
  id: string;
  title: string;
  price: string | null;
  images: string[];
  slug: string;
  badge?: string | null;
  brand?: string; // Add brand field
}

const FilterSection = ({ id, title, children, expandedFilters, toggleFilter }: { id: string, title: string, children: React.ReactNode, expandedFilters: string[], toggleFilter: (id: string) => void }) => (
  <div className="flex flex-col bg-white border rounded-sm border-gray-200 mb-2">
    <button
      onClick={() => toggleFilter(id)}
      className=" p-3 flex items-center cursor-pointer justify-between w-full border-b border-gray-200"
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

const Checkbox = ({ label, count, checked, onChange }: { label: string, count?: number, checked: boolean, onChange: () => void }) => (
  <label className="flex items-center gap-3 group cursor-pointer" onClick={onChange}>
    <div className={`w-4 h-4 border rounded-sm flex items-center justify-center transition-colors ${checked ? 'border-primary bg-primary' : 'border-gray-300 group-hover:border-primary'}`}>
      {checked && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
    </div>
    <span className={`text-[13px] font-semibold transition-colors ${checked ? 'text-primary' : 'text-gray-600 group-hover:text-primary'}`}>
      {label} {count !== undefined && <span className="text-gray-400 font-normal ml-1">({count})</span>}
    </span>
  </label>
);

const boxTypes = [
  {
    name: 'Cooler',
    image: '/Walk-in-Cooler-Freezer/box-type/walk_in_cooler_1.avif',
    submenu: [
      { name: 'No Refrigeration', image: '' },
      { name: 'Remote Refrigeration', image: '' },
      { name: 'Top-Mount Refrigeration', image: '' }
    ]
  },
  {
    name: 'Freezer',
    image: '/Walk-in-Cooler-Freezer/box-type/walk_in_freezer_1.avif',
    submenu: [
      { name: 'No Refrigeration', image: '' },
      { name: 'Remote Refrigeration', image: '' },
      { name: 'Top-Mount Refrigeration', image: '' }
    ]
  },
  {
    name: 'Combo',
    image: '/Walk-in-Cooler-Freezer/box-type/walk_in_combo_1.avif',
    submenu: [
      { name: 'No Refrigeration', image: '' },
      { name: 'Remote Refrigeration', image: '' },
      { name: 'Top-Mount Refrigeration', image: '' }
    ]
  },
  {
    name: 'Beer Cave',
    image: '/Walk-in-Cooler-Freezer/box-type/beer_cave.avif',
    submenu: [
      { name: 'No Refrigeration', image: '' },
      { name: 'Remote Refrigeration', image: '' },
      { name: 'Top-Mount Refrigeration', image: '' }
    ]
  },
  {
    name: 'Custom Walk-In',
    image: '/Walk-in-Cooler-Freezer/box-type/custom_walk_in_cooler_48458996-e588-449c-b300-188f07f6326d.avif',
    submenu: [
      { name: 'No Refrigeration', image: '' },
      { name: 'Remote Refrigeration', image: '' },
      { name: 'Top-Mount Refrigeration', image: '' }
    ]
  },
  {
    name: 'Cold Warehouse',
    image: '/Walk-in-Cooler-Freezer/box-type/cold_refrigerated_warehouse.webp',
    submenu: [
      { name: 'No Refrigeration', image: '' },
      { name: 'Remote Refrigeration', image: '' },
      { name: 'Top-Mount Refrigeration', image: '' }
    ]
  }
];

interface WalkInCoolerFreezerClientProps {
  initialProducts: Product[];
  title?: string;
}

export default function WalkInCoolerFreezerClient({ initialProducts, title = "Walk-In Cooler & Freezer" }: WalkInCoolerFreezerClientProps) {
  const { addToCart } = useCart();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [expandedFilters, setExpandedFilters] = useState<string[]>(['brand', 'size', 'refrigeration', 'walk-in-type', 'product-type', 'depth']);
  const [selectedBoxType, setSelectedBoxType] = useState<string | null>(null);
  const [visibleProductCount, setVisibleProductCount] = useState(40); // Increased initial count to show more products
  const [activeBoxType, setActiveBoxType] = useState<string | null>(null);
  const [activeRefrigerationType, setActiveRefrigerationType] = useState<string | null>(null);

  // Dynamic Brand Filter State
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  // Derive brands and counts from products
  const brands = useMemo(() => {
    const brandMap: Record<string, number> = {};

    // Always ensure ICEMANZ is present if needed, but here we derive from products
    initialProducts.forEach(product => {
      // Extract brand from title (e.g., "Astra 6 x 6" -> "Astra")
      const brand = product.title.split(' ')[0];
      brandMap[brand] = (brandMap[brand] || 0) + 1;
    });

    // Get brand list from products
    const brandList = Object.entries(brandMap)
      .map(([name, count]) => ({ name, count }))
      .filter(b => b.name.toUpperCase() !== 'ASTRA'); // Exclude Astra

    // Ensure ICEMANZ is always at the top even if it has 0 products
    const hasIcemanz = brandList.some(b => b.name.toUpperCase() === 'ICEMANZ');
    if (!hasIcemanz) {
      brandList.push({ name: 'ICEMANZ', count: 0 });
    }

    return brandList.sort((a, b) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (nameA === 'ICEMANZ') return -1;
      if (nameB === 'ICEMANZ') return 1;
      return nameA.localeCompare(nameB);
    });
  }, [initialProducts]);

  // Filter products based on selected brands
  const filteredProducts = useMemo(() => {
    if (selectedBrands.length === 0) return initialProducts;
    return initialProducts.filter(product => {
      const brand = product.title.split(' ')[0];
      return selectedBrands.includes(brand);
    });
  }, [initialProducts, selectedBrands]);

  const products = filteredProducts;

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const clearAllFilters = () => {
    setSelectedBrands([]);
  };

  const toggleFilter = (id: string) => {
    setExpandedFilters(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const handleLoadMore = () => {
    setVisibleProductCount(prevCount => prevCount + 5); // Load 5 more products
  };

  const [isReadMoreOpen, setIsReadMoreOpen] = useState(false);

  return (
    <div className=" bg-white min-h-screen">
      <div className="container mx-auto px-4 ">
        <div className="flex flex-col lg:flex-row gap-4 pt-8 pb-8 ">

          {/* Sidebar Filters */}
          <aside className="lg:w-60 xl:w-64 border border-gray-200 shadow-sm ">
            <div className="space-y-0">
              {/* Active Filters / Selected Filters */}
              <div className=" bg-white  py-2 px-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Filters</h2>
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedBrands.map(brand => (
                    <div key={brand} className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                      Brand: {brand}
                      <button
                        onClick={() => toggleBrand(brand)}
                        className="hover:text-primary cursor-pointer transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                {selectedBrands.length > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm mt-5 cursor-pointer font-normal underline text-black decoration-gray-900 underline-offset-2 hover:text-primary hover:decoration-primary transition-all"
                  >
                    Clear all filters
                  </button>
                )}
              </div>

              <div className="  bg-white p-2">

                <FilterSection id="brand" title="Brand" expandedFilters={expandedFilters} toggleFilter={toggleFilter}>
                  {brands.map((brand) => (
                    <Checkbox
                      key={brand.name}
                      label={brand.name}
                      count={brand.count}
                      checked={selectedBrands.includes(brand.name)}
                      onChange={() => toggleBrand(brand.name)}
                    />
                  ))}
                </FilterSection>

                <FilterSection id="size" title="Size W x L" expandedFilters={expandedFilters} toggleFilter={toggleFilter}>
                  <Checkbox label="5' x 6'" count={9} checked={false} onChange={() => { }} />
                  <Checkbox label="5' x 8'" count={9} checked={false} onChange={() => { }} />
                  <Checkbox label="5' x 10'" count={11} checked={false} onChange={() => { }} />
                  <Checkbox label="5' x 12'" count={10} checked={false} onChange={() => { }} />
                </FilterSection>

                <FilterSection id="refrigeration" title="Refrigeration" expandedFilters={expandedFilters} toggleFilter={toggleFilter}>
                  <Checkbox label="No Refrigeration" count={378} checked={false} onChange={() => { }} />
                  <Checkbox label="Top-Mount Refrigeration" count={229} checked={false} onChange={() => { }} />
                  <Checkbox label="Remote Refrigeration" count={188} checked={false} onChange={() => { }} />
                </FilterSection>

                <FilterSection id="walk-in-type" title="Walk In Type" expandedFilters={expandedFilters} toggleFilter={toggleFilter}>
                  <Checkbox label="Combo (Cooler & Freezer)" count={101} checked={false} onChange={() => { }} />
                  <Checkbox label="Cooler" count={1} checked={false} onChange={() => { }} />
                </FilterSection>

                <FilterSection id="product-type" title="Product Type" expandedFilters={expandedFilters} toggleFilter={toggleFilter}>
                  <Checkbox label="Indoor" count={45} checked={false} onChange={() => { }} />
                  <Checkbox label="Outdoor" count={32} checked={false} onChange={() => { }} />
                </FilterSection>

                <FilterSection id="power-type" title="Power Type" expandedFilters={expandedFilters} toggleFilter={toggleFilter}>
                  <Checkbox label="Electric" count={500} checked={false} onChange={() => { }} />
                  <Checkbox label="Gas" count={50} checked={false} onChange={() => { }} />
                </FilterSection>

                <FilterSection id="custom-product" title="Custom Product" expandedFilters={expandedFilters} toggleFilter={toggleFilter}>
                  <Checkbox label="Yes" count={200} checked={false} onChange={() => { }} />
                  <Checkbox label="No" count={400} checked={false} onChange={() => { }} />
                </FilterSection>

                <FilterSection id="depth" title="Depth" expandedFilters={expandedFilters} toggleFilter={toggleFilter}>
                  <Checkbox label="4'" count={12} checked={false} onChange={() => { }} />
                  <Checkbox label="5'" count={28} checked={false} onChange={() => { }} />
                  <Checkbox label="6'" count={15} checked={false} onChange={() => { }} />
                </FilterSection>

                <FilterSection id="wattage" title="Wattage" expandedFilters={expandedFilters} toggleFilter={toggleFilter}>
                  <Checkbox label="1000W" count={50} checked={false} onChange={() => { }} />
                  <Checkbox label="1500W" count={75} checked={false} onChange={() => { }} />
                  <Checkbox label="2000W" count={100} checked={false} onChange={() => { }} />
                </FilterSection>

                <FilterSection id="number-of-wells" title="Number of Wells" expandedFilters={expandedFilters} toggleFilter={toggleFilter}>
                  <Checkbox label="2 Wells" count={50} checked={false} onChange={() => { }} />
                  <Checkbox label="3 Wells" count={75} checked={false} onChange={() => { }} />
                  <Checkbox label="4 Wells" count={100} checked={false} onChange={() => { }} />
                </FilterSection>
              </div>
            </div>
          </aside>

          {/* Main Content - Product Grid */}
          <div className="flex-1">

            {/* Page Heading inside Main Content */}
            <div className="bg-white border border-gray-200 border-b-0 p-6">
              <h1 className="text-3xl  font-semibold text-gray-900 mb-2 tracking-tight">{title}</h1>

            </div>

            {/* Toolbar Section */}
            {/* <div className="bg-white p-4 border border-gray-200 border-b-0 flex flex-wrap items-center justify-between text-[13px] text-gray-700 font-medium gap-4">
              <div>Showing 1 - {Math.min(visibleProductCount, products.length)} of {products.length} products</div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 hidden sm:flex">
                  <span>Display:</span>
                  <select className="bg-transparent border-none outline-none font-semibold cursor-pointer text-gray-900">
                    <option>24 per page</option>
                    <option>48 per page</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span>Sort by:</span>
                  <select className="bg-transparent border-none outline-none font-semibold cursor-pointer text-gray-900">
                    <option>Price, low to high</option>
                    <option>Price, high to low</option>
                    <option>Relevance</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
                  <span className="mr-1">View</span>
                  <button className="p-1 hover:text-primary text-gray-900"><Grid3X3 size={16} /></button>
                  <button className="p-1 hover:text-primary text-gray-400"><LayoutList size={16} /></button>
                </div>
              </div>
            </div> */}

            {/* Controls Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 shadow-sm lg:grid-cols-5 gap-0 border border-gray-200 bg-white">
              {products.slice(0, visibleProductCount).map((product) => (
                <Link
                  key={product.id}
                  href={`/walk-in-cooler-freezer/${product.slug}`}
                  className="bg-white border-r border-b border-gray-200 py-2 flex flex-col cursor-pointer hover:shadow-lg transition-all duration-300 group"
                >
                  {/* Image */}

                  <div className="h-45 relative overflow-hidden bg-white flex items-center justify-center">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>


                  {/* Content */}
                  <div className="p-3 flex flex-col text-center ">
                    <div className="text-[10px] text-black font-bold mb-0.5 uppercase">
                      {product.brand || product.title.split(' ')[0]}
                    </div>
                    <h3 className="text-xs font-semibold text-gray-800 mb-2 text-center max-w-[200px] group-hover:text-primary transition-colors">{product.title}</h3>
                    <div className="text-lg font-semibold text-[#004a99] mb-1 ">${product.price}</div>
                    <div className="flex items-center justify-center gap-1.5 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      <span className="text-[9px] font-black text-gray-500 uppercase">{product.badge || 'IN STOCK'}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart({
                          id: product.id,
                          name: product.title,
                          price: parseFloat(product.price?.replace(/,/g, '') || '0'),
                          image: product.images[0],
                          quantity: 1
                        })
                      }}
                      className="w-full py-2 cursor-pointer rounded-sm bg-[#004a99] text-white text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-[#003d80] transition-colors"
                    >
                      <ShoppingCart size={12} /> Add to Cart
                    </button>

                  </div>

                </Link>


              ))}
            </div>

            {/* Load More Button */}
            {products.length > visibleProductCount && (
              <div className="flex justify-center mt-8 mb-12">
                <button
                  onClick={handleLoadMore}
                  className="px-8 py-3 bg-white border-2 border-[#004a99] text-[#004a99] font-bold rounded-sm hover:bg-[#004a99] hover:text-white transition-all duration-300 cursor-pointer uppercase tracking-wider text-sm"
                >
                  Load More Products ({products.length - visibleProductCount} remaining)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
