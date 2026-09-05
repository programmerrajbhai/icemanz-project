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
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface Product {
  id: string;
  title: string;
  price: string | null;
  images: string[];
  slug: string;
  badge?: string | null;
  brand?: string | null; // Add brand field
  type?: string | null; // Add type field for refrigeration type
  features?: any; // Add features for walk-in specific fields
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
      <div className="p-5 space-y-4 max-h-60 overflow-y-auto pr-1">
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [expandedFilters, setExpandedFilters] = useState<string[]>(['brand', 'floor', 'size', 'refrigeration', 'walk-in-type', 'product-type', 'custom-product']);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedBoxType, setSelectedBoxType] = useState<string | null>(null);
  const [visibleProductCount, setVisibleProductCount] = useState(40); // Increased initial count to show more products
  const [activeBoxType, setActiveBoxType] = useState<string | null>(null);
  const [activeRefrigerationType, setActiveRefrigerationType] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>('default');

  // Helpers to extract product metadata
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
    if (text.includes('floorless') || text.includes('no floor') || text.includes('without floor')) {
      return 'No Floor';
    }
    return 'With Floor';
  };

  const getWalkInType = (product: Product) => {
    if (product.features?.walkInType) return product.features.walkInType;
    // Try to extract walk-in type from title if not in features
    if (product.title.includes('Cooler')) {
      if (product.title.includes('No Floor') || product.title.includes('Floorless')) {
        return 'Cooler (Refrigerator) No Floor';
      } else {
        return 'Cooler (Refrigerator) with Floor';
      }
    } else if (product.title.includes('Freezer')) {
      return 'Freezer with Floor';
    } else if (product.title.includes('Combo')) {
      return 'Combo (Cooler & Freezer)';
    }
    return '';
  };

  // Derive filter counts from products
  const filterCounts = useMemo(() => {
    const counts = {
      brands: {} as Record<string, number>,
      floors: {} as Record<string, number>,
      sizes: {} as Record<string, number>,
      refrigeration: {} as Record<string, number>,
      walkInTypes: {} as Record<string, number>
    };

    initialProducts.forEach(product => {
      // Brand
      const brand = product.brand || product.title.split(' ')[0];
      if (brand) {
        counts.brands[brand] = (counts.brands[brand] || 0) + 1;
      }

      // Floor
      const floorType = getFloorType(product);
      if (floorType) {
        counts.floors[floorType] = (counts.floors[floorType] || 0) + 1;
      }

      // Size
      const size = extractSize(product);
      if (size) {
        counts.sizes[size] = (counts.sizes[size] || 0) + 1;
      }

      // Refrigeration
      const refrig = product.type || (product.features?.refrigerationType) || '';
      if (refrig) {
        counts.refrigeration[refrig] = (counts.refrigeration[refrig] || 0) + 1;
      }

      // Walk In Type
      const walkInType = getWalkInType(product);
      if (walkInType) {
        counts.walkInTypes[walkInType] = (counts.walkInTypes[walkInType] || 0) + 1;
      }
    });

    return counts;
  }, [initialProducts]);

  // Dynamic Filter States
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedFloorTypes, setSelectedFloorTypes] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedRefrigerationTypes, setSelectedRefrigerationTypes] = useState<string[]>([]);
  const [selectedWalkInTypes, setSelectedWalkInTypes] = useState<string[]>([]);

  // Derive brands and counts from products, sorting "Icemanz" to the top
  const brands = useMemo(() => {
    const existingBrands = { ...filterCounts.brands };
    if (!Object.keys(existingBrands).some(k => k.toLowerCase() === 'icemanz')) {
      existingBrands['Icemanz'] = 0; // Add it with 0 count if it doesn't exist
    }
    if (!Object.keys(existingBrands).some(k => k.toLowerCase() === 'amerikooler')) {
      existingBrands['Amerikooler'] = 0;
    }
    if (!Object.keys(existingBrands).some(k => k.toLowerCase() === 'astra')) {
      existingBrands['Astra'] = 0;
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

  // Derive sorted sizes (numerically ordered by width & length)
  const sortedSizes = useMemo(() => {
    return Object.entries(filterCounts.sizes).sort(([aSize], [bSize]) => {
      const parseDim = (s: string) => {
        const match = s.match(/(\d+)\s*'\s*x\s*(\d+)/i) || s.match(/(\d+)\s*x\s*(\d+)/i);
        if (!match) return [999, 999];
        return [parseInt(match[1], 10), parseInt(match[2], 10)];
      };
      const [wA, lA] = parseDim(aSize);
      const [wB, lB] = parseDim(bSize);
      if (wA !== wB) return wA - wB;
      return lA - lB;
    });
  }, [filterCounts.sizes]);

  // Filter products based on selected filters
  const filteredProducts = useMemo(() => {
    return initialProducts.filter(product => {
      const brand = product.brand || product.title.split(' ')[0];
      const size = extractSize(product);
      const floorType = getFloorType(product);
      const refrigType = product.type || (product.features?.refrigerationType) || '';

      const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(brand) || (product.brand && selectedBrands.includes(product.brand));
      const floorMatch = selectedFloorTypes.length === 0 || selectedFloorTypes.includes(floorType);
      const sizeMatch = selectedSizes.length === 0 || selectedSizes.includes(size);
      const refrigerationMatch = selectedRefrigerationTypes.length === 0 || selectedRefrigerationTypes.includes(refrigType);
      const walkInTypeMatch = selectedWalkInTypes.length === 0 || selectedWalkInTypes.includes(getWalkInType(product));

      return brandMatch && floorMatch && sizeMatch && refrigerationMatch && walkInTypeMatch;
    });
  }, [initialProducts, selectedBrands, selectedFloorTypes, selectedSizes, selectedRefrigerationTypes, selectedWalkInTypes]);

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

  const products = sortedProducts;

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const currentProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
    setCurrentPage(1);
  };

  const toggleFloorType = (floor: string) => {
    setSelectedFloorTypes(prev =>
      prev.includes(floor) ? prev.filter(f => f !== floor) : [...prev, floor]
    );
    setCurrentPage(1);
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
    setCurrentPage(1);
  };

  const toggleRefrigerationType = (type: string) => {
    setSelectedRefrigerationTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
    setCurrentPage(1);
  };

  const toggleWalkInType = (type: string) => {
    setSelectedWalkInTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedFloorTypes([]);
    setSelectedSizes([]);
    setSelectedRefrigerationTypes([]);
    setSelectedWalkInTypes([]);
    setCurrentPage(1);
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

  const walkInTypes = [
    {
      name: 'Walk-In Box Only',
      image: '/Walk-in-Cooler-Freezer/category/Box_Only.webp'
    },
    {
      name: 'Walk-In Box with Top Mount',
      image: '/Walk-in-Cooler-Freezer/category/Top_Mount_refrigeration_and_Box.webp'
    },
    {
      name: 'Walk-In Box with Remote',
      image: '/Walk-in-Cooler-Freezer/category/Remote_refrigeration_and_Box.webp'
    }
  ];

  const cleanPrice = (priceStr: string | null) => {
    if (!priceStr) return '0.00';
    const num = parseFloat(String(priceStr).replace(/[^0-9.]/g, ''));
    return isNaN(num) ? '0.00' : num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className=" bg-white min-h-screen">
      <div className="container mx-auto px-4 ">

        {/* Walk-In Type Selection Section */}
        {/* <div className="  pt-10 pb-20">
          <div className="flex justify-center gap-6 flex-wrap">
            {walkInTypes.map((type) => (
              <div key={type.name} className="flex w-[130px] h-[100px] flex-col items-center gap-2 cursor-pointer group">
                <div className="  rounded-xl   shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                  <img
                    src={type.image}
                    alt={type.name}
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
                <h3 className="text-[12px] font-bold text-gray-800 text-center group-hover:text-primary transition-colors">
                  {type.name}
                </h3>
              </div>
            ))}
          </div>
        </div> */}

        <div className="flex flex-col lg:flex-row gap-4 pt-8 pb-8 ">

          {/* Sidebar Filters */}
          <aside className="lg:w-60 xl:w-64 shrink-0">
            {/* Mobile Toggle Button */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden flex items-center justify-between w-full px-5 py-4 bg-white border border-gray-200 rounded-sm mb-4 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-gray-900" />
                <span className="font-semibold text-gray-900 text-lg">Filter Products</span>
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
                <div className=" bg-white  py-2 px-4 lg:pt-4">
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
                    {selectedFloorTypes.map(floor => (
                      <div key={floor} className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                        Floor: {floor}
                        <button
                          onClick={() => toggleFloorType(floor)}
                          className="hover:text-primary cursor-pointer transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    {selectedSizes.map(size => (
                      <div key={size} className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                        Size: {size}
                        <button
                          onClick={() => toggleSize(size)}
                          className="hover:text-primary cursor-pointer transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    {selectedRefrigerationTypes.map(type => (
                      <div key={type} className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                        Refrigeration: {type}
                        <button
                          onClick={() => toggleRefrigerationType(type)}
                          className="hover:text-primary cursor-pointer transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    {selectedWalkInTypes.map(type => (
                      <div key={type} className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                        Walk In Type: {type}
                        <button
                          onClick={() => toggleWalkInType(type)}
                          className="hover:text-primary cursor-pointer transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  {(selectedBrands.length > 0 || selectedFloorTypes.length > 0 || selectedSizes.length > 0 || selectedRefrigerationTypes.length > 0 || selectedWalkInTypes.length > 0) && (
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

                  {Object.keys(filterCounts.floors).length > 0 && (
                    <FilterSection id="floor" title="Floor Option" expandedFilters={expandedFilters} toggleFilter={toggleFilter}>
                      {Object.entries(filterCounts.floors).map(([floor, count]) => (
                        <Checkbox
                          key={floor}
                          label={floor}
                          count={count}
                          checked={selectedFloorTypes.includes(floor)}
                          onChange={() => toggleFloorType(floor)}
                        />
                      ))}
                    </FilterSection>
                  )}

                  <FilterSection id="size" title="Size W x L" expandedFilters={expandedFilters} toggleFilter={toggleFilter}>
                    {sortedSizes.map(([size, count]) => (
                      <Checkbox
                        key={size}
                        label={size}
                        count={count}
                        checked={selectedSizes.includes(size)}
                        onChange={() => toggleSize(size)}
                      />
                    ))}
                  </FilterSection>

                  <FilterSection id="refrigeration" title="Refrigeration" expandedFilters={expandedFilters} toggleFilter={toggleFilter}>
                    {Object.entries(filterCounts.refrigeration).map(([type, count]) => (
                      <Checkbox
                        key={type}
                        label={type}
                        count={count}
                        checked={selectedRefrigerationTypes.includes(type)}
                        onChange={() => toggleRefrigerationType(type)}
                      />
                    ))}
                  </FilterSection>

                  <FilterSection id="walk-in-type" title="Walk In Type" expandedFilters={expandedFilters} toggleFilter={toggleFilter}>
                    {Object.entries(filterCounts.walkInTypes).map(([type, count]) => (
                      <Checkbox
                        key={type}
                        label={type}
                        count={count}
                        checked={selectedWalkInTypes.includes(type)}
                        onChange={() => toggleWalkInType(type)}
                      />
                    ))}
                  </FilterSection>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">

            {/* Filter Section - Sorting and View Options */}
            <div className="bg-white border border-gray-200 py-4 px-6 ">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left side - Title and Results count */}
                <div className="flex flex-col">
                  <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Showing {currentProducts.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}–{Math.min(currentPage * itemsPerPage, products.length)} of {products.length} results
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
                      <LayoutList size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className={`${viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5' : 'flex flex-col '} bg-white`}>
              {currentProducts.map((product) => (
                viewMode === 'grid' ? (
                  <div
                    key={product.id}
                    className="bg-white  border-t-0  border border-gray-200 py-2 flex flex-col  transition-all duration-300 group"
                  >
                    <Link href={`/walk-in-cooler-freezer/${product.slug}`} className="cursor-pointer">
                      {/* Image */}
                      <div className="h-45 relative overflow-hidden bg-white flex items-center justify-center">
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </Link>

                    {/* Content */}
                    <div className="p-3 flex flex-col text-center ">
                      <div className="text-[10px] text-black font-bold mb-0.5 uppercase">
                        {product.brand || product.title.split(' ')[0]}
                      </div>

                      <Link href={`/walk-in-cooler-freezer/${product.slug}`} className="cursor-pointer">
                        <h3 className="text-xs  font-medium text-gray-800 mb-2 text-center max-w-[200px] group-hover:text-primary transition-colors line-clamp-2">{product.title}</h3>
                      </Link>

                      <div className="text-lg font-semibold text-[#004a99] mb-4 ">${cleanPrice(product.price)} / Ea.</div>

                      <button
                        onClick={() => addToCart({
                          id: product.id,
                          name: product.title,
                          title: product.title,
                          price: cleanPrice(product.price),
                          image: product.images[0],
                          quantity: 1,
                          category: 'walk-in-cooler-freezer'
                        })}
                        className="w-full py-2 cursor-pointer rounded-sm bg-[#004a99] text-white text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-[#003d80] transition-colors"
                      >
                        <ShoppingCart size={12} />
                        Add to Cart
                      </button>

                    </div>

                  </div>
                ) : (
                  <div
                    key={product.id}
                    className="bg-white border border-gray-200 rounded-sm shadow-sm hover:shadow-md p-4 flex gap-4 transition-all duration-300 group"
                  >
                    <Link href={`/walk-in-cooler-freezer/${product.slug}`} className="cursor-pointer">
                      {/* Image */}
                      <div className="w-40 h-40 flex-shrink-0 relative overflow-hidden bg-white flex items-center justify-center">
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </Link>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] text-black font-bold mb-1 uppercase">
                          {product.brand || product.title.split(' ')[0]}
                        </div>

                        <Link href={`/walk-in-cooler-freezer/${product.slug}`} className="cursor-pointer">
                          <h3 className="text-sm font-medium text-gray-800 mb-2 group-hover:text-primary transition-colors">{product.title}</h3>
                        </Link>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-lg font-semibold text-[#004a99]">${cleanPrice(product.price)} / Ea.</div>

                        <button
                          onClick={() => addToCart({
                            id: product.id,
                            name: product.title,
                            title: product.title,
                            price: cleanPrice(product.price),
                            image: product.images[0],
                            quantity: 1,
                            category: 'walk-in-cooler-freezer'
                          })}
                          className="px-6 py-2.5 cursor-pointer rounded-sm bg-[#004a99] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#003d80] transition-colors flex items-center gap-2"
                        >
                          <ShoppingCart size={14} />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                )
              ))}
            </div>
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center my-12 gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 cursor-pointer rounded-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={20} className="text-gray-600" />
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 flex items-center cursor-pointer justify-center rounded-sm text-sm font-medium transition-colors ${currentPage === i + 1
                        ? 'bg-[#004a99] text-white border border-[#004a99]'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 cursor-pointer rounded-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={20} className="text-gray-600" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
