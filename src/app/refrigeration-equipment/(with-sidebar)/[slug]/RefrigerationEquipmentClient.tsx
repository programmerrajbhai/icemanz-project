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
  X,
  Grid3X3,
  ShoppingCart
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { Product, Category } from '@prisma/client';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

type CategoryWithSubs = Category & { subcategories: CategoryWithSubs[] };

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
  const { addToCart } = useCart();
  const router = useRouter();
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortOption, setSortOption] = useState<string>('default');
  const [expandedFilters, setExpandedFilters] = useState<string[]>(['brand']);

  // Filter states
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  // Calculate filter counts from products
  const filterCounts = useMemo(() => {
    const counts = {
      brands: {} as Record<string, number>
    };

    products.forEach(product => {
      // Brand - extract from product.brand or title
      const brand = product.brand || product.title.split(' ')[0];
      if (brand) {
        counts.brands[brand] = (counts.brands[brand] || 0) + 1;
      }
    });

    return counts;
  }, [products]);

  // Derive brands list, sorting "Icemanz" to the top
  const brands = useMemo(() => {
    const existingBrands = { ...filterCounts.brands };
    if (!Object.keys(existingBrands).some(k => k.toLowerCase() === 'icemanz')) {
      existingBrands['Icemanz'] = 0;
    }

    const brandList = Object.entries(existingBrands).map(([name, count]) => ({ name, count }));
    return brandList.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      if (aName === 'icemanz') return -1;
      if (bName === 'icemanz') return 1;
      return aName.localeCompare(bName);
    });
  }, [filterCounts.brands]);

  const toggleExpand = (e: React.MouseEvent, itemSlug: string) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedItems(prev =>
      prev.includes(itemSlug)
        ? prev.filter(s => s !== itemSlug)
        : [...prev, itemSlug]
    );
  };

  const toggleFilter = (id: string) => {
    setExpandedFilters(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const clearAllFilters = () => {
    setSelectedBrands([]);
  };

  // Filter products based on selected filters
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const brand = product.brand || product.title.split(' ')[0];
      const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(brand);
      return brandMatch;
    });
  }, [products, selectedBrands]);

  // Sort products based on selected sort option
  const sortedProducts = useMemo(() => {
    const productsToSort = [...filteredProducts];

    switch (sortOption) {
      case 'price-low':
        return productsToSort.sort((a, b) => {
          const priceA = parseFloat(String(a.price || '0').replace(/[^0-9.]/g, ''));
          const priceB = parseFloat(String(b.price || '0').replace(/[^0-9.]/g, ''));
          return priceA - priceB;
        });
      case 'price-high':
        return productsToSort.sort((a, b) => {
          const priceA = parseFloat(String(a.price || '0').replace(/[^0-9.]/g, ''));
          const priceB = parseFloat(String(b.price || '0').replace(/[^0-9.]/g, ''));
          return priceB - priceA;
        });
      case 'name-asc':
        return productsToSort.sort((a, b) => a.title.localeCompare(b.title));
      case 'name-desc':
        return productsToSort.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return productsToSort;
    }
  }, [filteredProducts, sortOption]);

  const displayedProducts = sortedProducts;

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
                  <span className="font-semibold text-gray-900 text-lg">Filters</span>
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
                lg:static lg:w-full lg:max-w-none lg:h-auto lg:bg-transparent lg:z-auto lg:shadow-none lg:transform-none lg:overflow-visible lg:border lg:border-gray-200
                ${isMobileSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
              `}>
                <div className="space-y-0 pb-20 lg:pb-0">
                  <div className="px-5 py-4 border-b border-gray-200 sticky top-0 bg-white z-10 lg:hidden flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900">Filters</h3>
                    <button
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-900 cursor-pointer"
                      onClick={() => setIsMobileSidebarOpen(false)}
                    >
                      <X size={24} />
                    </button>
                  </div>

                  {/* Active Filters / Selected Filters */}
                  <div className="bg-white py-2 px-4 lg:pt-4">
                    <h2 className="hidden lg:block text-xl font-semibold text-gray-900 mb-6">Filters</h2>
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

                  <div className="bg-white p-2">
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
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1">

              {/* Filter Section - Sorting and View Options */}
              <div className="bg-white border border-gray-200 py-4 px-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left side - Title and Results count */}
                  <div className="flex flex-col">
                    <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Showing {displayedProducts.length > 0 ? 1 : 0}–{Math.min(visibleCount, displayedProducts.length)} of {displayedProducts.length} results
                    </p>
                  </div>

                  {/* Right side - Sorting dropdown and view toggles */}
                  <div className="flex items-center gap-3">
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-sm text-sm text-gray-700 bg-white cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors">
                      <option value="default">Default sorting</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="name-asc">Name: A to Z</option>
                      <option value="name-desc">Name: Z to A</option>
                    </select>

                    {/* View Toggle Buttons */}
                    <div className="flex items-center gap-1 border border-gray-300 rounded-sm overflow-hidden">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 cursor-pointer transition-colors ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                        title="Grid View"
                      >
                        <Grid3X3 size={18} />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 cursor-pointer transition-colors ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                        title="List View"
                      >
                        <LayoutGrid size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <div className={`${viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4' : 'flex flex-col'} bg-white`}>
                {displayedProducts.length === 0 ? (
                  <div className="col-span-full py-12 text-center text-gray-500 font-medium border border-dashed border-gray-300 rounded-sm">
                    No products found in this category!
                  </div>
                ) : (
                  displayedProducts.slice(0, visibleCount).map((product) => {
                    const formattedInfo = extractProductInfo(product.keyFeatures) || extractProductInfo(product.description) || product.title;
                    return viewMode === 'grid' ? (
                      <div
                        key={product.id}
                        className="group bg-white border border-t-0 border-gray-200 py-2 flex flex-col transition-all duration-300"
                      >
                        {/* Image Area */}
                        <Link href={`/refrigeration-equipment/${product.category?.slug || slug}/${product.id}`} className="block">
                          <div className="h-45 relative overflow-hidden bg-white flex items-center justify-center">
                            {product.images && product.images[0] ? (
                              <img
                                src={product.images[0]}
                                alt={formattedInfo}
                                className="h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="flex items-center justify-center text-gray-400 font-semibold bg-gray-100 h-full w-full">No Image</div>
                            )}
                          </div>
                        </Link>

                        {/* Content Area */}
                        <div className="p-3 flex flex-col text-center">
                          <div className="text-[10px] text-black font-bold mb-0.5 uppercase">
                            {product.brand || product.title.split(' ')[0]}
                          </div>

                          <Link href={`/refrigeration-equipment/${product.category?.slug || slug}/${product.id}`}>
                            <h3 className="text-xs font-medium text-gray-800 mb-2 text-center max-w-[200px] mx-auto group-hover:text-primary transition-colors line-clamp-2 cursor-pointer" title={product.title}>
                              {product.title}
                            </h3>
                          </Link>

                          <div className="text-lg font-semibold text-[#004a99] mb-1">${cleanPrice(product.price)}</div>

                          <div className="flex items-center justify-center gap-1.5 mb-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                            <span className="text-[9px] font-black text-gray-500 uppercase">IN STOCK</span>
                          </div>

                          <div className="flex gap-2 w-full">
                            <Link
                              href={`/refrigeration-equipment/${product.category?.slug || slug}/${product.id}`}
                              className="flex-1 py-2 cursor-pointer rounded-sm bg-[#004a99] text-white text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-[#003d80] transition-colors"
                            >
                              <ArrowRight size={12} />
                              View
                            </Link>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                addToCart({
                                  id: product.id,
                                  name: product.title,
                                  brand: product.brand || product.title.split(' ')[0],
                                  price: product.price,
                                  image: product.images[0] || '/placeholder.png',
                                  quantity: 1,
                                  category: 'refrigeration-equipment'
                                });
                              }}
                              className="flex-1 py-2 cursor-pointer rounded-sm bg-[#cc3300] text-white text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-[#b32d00] transition-colors"
                            >
                              <ShoppingCart size={12} />
                              Add
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        key={product.id}
                        className="group bg-white border border-gray-200 rounded-sm shadow-sm hover:shadow-md p-4 flex gap-4 transition-all duration-300"
                      >
                        {/* Image */}
                        <Link href={`/refrigeration-equipment/${product.category?.slug || slug}/${product.id}`} className="block">
                          <div className="w-40 h-40 flex-shrink-0 relative overflow-hidden bg-white flex items-center justify-center">
                            {product.images && product.images[0] ? (
                              <img
                                src={product.images[0]}
                                alt={formattedInfo}
                                className="h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="flex items-center justify-center text-gray-400 font-semibold bg-gray-100 h-full w-full">No Image</div>
                            )}
                          </div>
                        </Link>

                        {/* Content */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="text-[10px] text-black font-bold mb-1 uppercase">
                              {product.brand || product.title.split(' ')[0]}
                            </div>

                            <Link href={`/refrigeration-equipment/${product.category?.slug || slug}/${product.id}`}>
                              <h3 className="text-sm font-medium text-gray-800 mb-2 group-hover:text-primary transition-colors cursor-pointer">{product.title}</h3>
                            </Link>

                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                              <span className="text-[9px] font-bold text-gray-500 uppercase">IN STOCK</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-lg font-semibold text-[#004a99]">${cleanPrice(product.price)}</div>

                            <div className="flex gap-2">
                              <Link
                                href={`/refrigeration-equipment/${product.category?.slug || slug}/${product.id}`}
                                className="py-2 px-4 cursor-pointer rounded-sm bg-[#004a99] text-white text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-[#003d80] transition-colors"
                              >
                                <ArrowRight size={12} />
                                View Details
                              </Link>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  addToCart({
                                    id: product.id,
                                    name: product.title,
                                    brand: product.brand || product.title.split(' ')[0],
                                    price: product.price,
                                    image: product.images[0] || '/placeholder.png',
                                    quantity: 1,
                                    category: 'refrigeration-equipment'
                                  });
                                }}
                                className="py-2 px-4 cursor-pointer rounded-sm bg-[#cc3300] text-white text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-[#b32d00] transition-colors"
                              >
                                <ShoppingCart size={12} />
                                Add to Cart
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {displayedProducts.length > visibleCount && (
                <div className="flex items-center justify-center gap-4 py-5">
                  <button
                    onClick={() => setVisibleCount(displayedProducts.length)}
                    className="bg-[#003d80] text-center uppercase font-semibold text-sm cursor-pointer text-white py-2 px-4 rounded-sm"
                  >
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
