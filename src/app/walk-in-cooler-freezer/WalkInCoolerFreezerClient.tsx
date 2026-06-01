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
  ChevronRight
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [expandedFilters, setExpandedFilters] = useState<string[]>(['brand', 'size', 'refrigeration', 'walk-in-type', 'product-type', 'custom-product']);
  const [selectedBoxType, setSelectedBoxType] = useState<string | null>(null);
  const [visibleProductCount, setVisibleProductCount] = useState(40); // Increased initial count to show more products
  const [activeBoxType, setActiveBoxType] = useState<string | null>(null);
  const [activeRefrigerationType, setActiveRefrigerationType] = useState<string | null>(null);

  // Derive filter counts from products
  const filterCounts = useMemo(() => {
    const counts = {
      brands: {} as Record<string, number>,
      sizes: {
        "6' x 6'": 0,
        "6' x 8'": 0,
        "6' x 10'": 0,
        "6' x 12'": 0,
        "8' x 8'": 0,
        "8' x 10'": 0,
        "8' x 12'": 0,
        "10' x 10'": 0
      } as Record<string, number>,
      refrigeration: {
        'No Refrigeration': 0,
        'Top-Mount Refrigeration': 0
      } as Record<string, number>,
      walkInTypes: {
        'Cooler (Refrigerator) No Floor': 0,
        'Cooler (Refrigerator) with Floor': 0,
        'Freezer with Floor': 0,
        'Combo (Cooler & Freezer)': 0
      } as Record<string, number>
    };

    initialProducts.forEach(product => {
      // Brand
      const brand = product.brand || product.title.split(' ')[0];
      if (brand) {
        counts.brands[brand] = (counts.brands[brand] || 0) + 1;
      }

      // Size
      let size = product.features?.size;
      if (!size) {
        const sizeMatch = product.title.match(/(\d+')\s*x\s*(\d+')/);
        if (sizeMatch) {
          size = `${sizeMatch[1]} x ${sizeMatch[2]}`;
        }
      }
      if (size) {
        if (counts.sizes[size] !== undefined) {
          counts.sizes[size] += 1;
        } else {
          counts.sizes[size] = 1;
        }
      }

      // Refrigeration
      if (product.type) {
        counts.refrigeration[product.type] = (counts.refrigeration[product.type] || 0) + 1;
      }

      // Walk In Type
      let walkInType = product.features?.walkInType;
      if (!walkInType) {
        // Try to extract walk-in type from title if not in features
        if (product.title.includes('Cooler')) {
          if (product.title.includes('No Floor') || product.title.includes('Floorless')) {
            walkInType = 'Cooler (Refrigerator) No Floor';
          } else {
            walkInType = 'Cooler (Refrigerator) with Floor';
          }
        } else if (product.title.includes('Freezer')) {
          walkInType = 'Freezer with Floor';
        } else if (product.title.includes('Combo')) {
          walkInType = 'Combo (Cooler & Freezer)';
        }
      }
      if (walkInType) {
        counts.walkInTypes[walkInType] = (counts.walkInTypes[walkInType] || 0) + 1;
      }
    });

    return counts;
  }, [initialProducts]);

  // Dynamic Filter States
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedRefrigerationTypes, setSelectedRefrigerationTypes] = useState<string[]>([]);
  const [selectedWalkInTypes, setSelectedWalkInTypes] = useState<string[]>([]);

  // Derive brands and counts from products
  const brands = useMemo(() => {
    return Object.entries(filterCounts.brands).map(([name, count]) => ({ name, count }));
  }, [filterCounts.brands]);

  // Helper to extract size from product title
  const extractSize = (product: Product) => {
    if (product.features?.size) return product.features.size;
    const match = product.title.match(/(\d+')\s*x\s*(\d+')/);
    return match ? `${match[1]} x ${match[2]}` : '';
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

  // Filter products based on selected filters
  const filteredProducts = useMemo(() => {
    return initialProducts.filter(product => {
      const brand = product.title.split(' ')[0];
      const size = extractSize(product);

      const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(brand) || (product.brand && selectedBrands.includes(product.brand));
      const sizeMatch = selectedSizes.length === 0 || selectedSizes.includes(size);
      const refrigerationMatch = selectedRefrigerationTypes.length === 0 || selectedRefrigerationTypes.includes(product.type || '');
      const walkInTypeMatch = selectedWalkInTypes.length === 0 || selectedWalkInTypes.includes(getWalkInType(product));

      return brandMatch && sizeMatch && refrigerationMatch && walkInTypeMatch;
    });
  }, [initialProducts, selectedBrands, selectedSizes, selectedRefrigerationTypes, selectedWalkInTypes]);

  const products = filteredProducts;

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const currentProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
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
          <aside className="lg:w-60 xl:w-64 border  h-fit border-gray-200 shadow-sm ">
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
                {(selectedBrands.length > 0 || selectedSizes.length > 0 || selectedRefrigerationTypes.length > 0 || selectedWalkInTypes.length > 0) && (
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
                  {Object.entries(filterCounts.sizes).map(([size, count]) => (
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
          </aside>
          {/* Main Content - Product Grid */}
          <div className="flex-1">
            {/* Page Heading inside Main Content */}
            <div className="bg-white  border-b-0 p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">{title}</h1>
              <p className="text-sm text-gray-600">
                At Atlantic Supermarket Equipment we have Walk-In Coolers in stock & ready to ship! We offer attractive financing options, ship nationwide, and have great prices!
                <button
                  onClick={() => setIsReadMoreOpen(!isReadMoreOpen)}
                  className="ml-2 text-gray-900 font-bold underline cursor-pointer hover:text-primary transition-colors"
                >
                  Read more
                </button>
              </p>
            </div>
            {/* Controls Row */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5  bg-white">
              {currentProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/walk-in-cooler-freezer/${product.slug}`}
                  className="bg-white   shadow-md py-2 flex flex-col cursor-pointer  transition-all duration-300 group"
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

                    <h3 className="text-xs  font-medium text-gray-800 mb-2 text-center max-w-[200px] group-hover:text-primary transition-colors line-clamp-2">{product.title}</h3>

                    <div className="text-lg font-semibold text-[#004a99] mb-1 ">${product.price}</div>

                    <div className="flex items-center justify-center gap-1.5 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      <span className="text-[9px] font-black text-gray-500 uppercase">{product.badge || 'IN STOCK'}</span>
                    </div>

                    <div
                      className="w-full py-2 cursor-pointer rounded-sm bg-[#004a99] text-white text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-[#003d80] transition-colors"
                    >
                      Choose Option
                    </div>

                  </div>

                </Link>


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
