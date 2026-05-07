'use client';
import { useState } from 'react';
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
  brand: string;
  name: string;
  model: string;
  price: string;
  image: string;
}

const mockProducts: Product[] = [
  { id: '1', brand: 'ASTRA', name: 'Astra 6 x 6 Walk-In Cooler No Floor', model: 'CNF6X6', price: '2,903.00', image: '/Walk-in-Cooler-Freezer/Layout-CoolerFreezer.webp' },
  { id: '2', brand: 'ASTRA', name: 'Astra 6 x 8 Walk-In Cooler No Floor', model: 'CNF6X8', price: '3,156.00', image: '/Walk-in-Cooler-Freezer/Layout-CoolerFreezer.webp' },
  { id: '3', brand: 'ASTRA', name: 'Astra 6 x 6 Walk-In Cooler with Floor', model: 'CWF6X6', price: '3,165.00', image: '/Walk-in-Cooler-Freezer/Layout-CoolerFreezer.webp' },
  { id: '4', brand: 'ASTRA', name: 'Astra 5 x 6 Walk-In Cooler No Floor', model: 'CNF5X6', price: '3,220.00', image: '/Walk-in-Cooler-Freezer/Layout-CoolerFreezer.webp' },
  { id: '5', brand: 'ASTRA', name: 'Astra 6 x 10 Walk-In Cooler No Floor', model: 'CNF6X10', price: '3,410.00', image: '/Walk-in-Cooler-Freezer/Layout-CoolerFreezer.webp' },
  { id: '6', brand: 'ASTRA', name: 'Astra 6 x 8 Walk-In Cooler with Floor', model: 'CWF6X8', price: '3,447.00', image: '/Walk-in-Cooler-Freezer/Layout-CoolerFreezer.webp' },
  { id: '7', brand: 'COLDLINE', name: 'Coldline 6 x 6 Walk-in Refrigerator Cooler Box', model: 'CL6X6', price: '3,472.74', image: '/Walk-in-Cooler-Freezer/Layout-CoolerFreezer.webp' },
  { id: '8', brand: 'ASTRA', name: 'Astra 5 x 8 Walk-In Cooler No Floor', model: 'CNF5X8', price: '3,488.00', image: '/Walk-in-Cooler-Freezer/Layout-CoolerFreezer.webp' },
];

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

const Checkbox = ({ label, count }: { label: string, count?: number }) => (
  <label className="flex items-center gap-3 group cursor-pointer">
    <div className="w-4 h-4 border border-gray-300 rounded-sm flex items-center justify-center group-hover:border-primary transition-colors">
      <div className="w-2 h-2 bg-primary scale-0 transition-transform group-hover:scale-100 opacity-20"></div>
    </div>
    <span className="text-[13px] font-semibold text-gray-600 group-hover:text-primary transition-colors">
      {label}
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

export default function WalkInCoolerFreezerClient() {
  const { addToCart } = useCart();
  const [expandedFilters, setExpandedFilters] = useState<string[]>(['brand', 'size', 'refrigeration', 'walk-in-type', 'product-type', 'power-type', 'custom-product', 'depth', 'wattage', 'number-of-wells']);
  const [visibleProductCount, setVisibleProductCount] = useState(15); // Initially show 3 rows * 5 products/row
  const [activeBoxType, setActiveBoxType] = useState<string | null>(null);
  const [activeRefrigerationType, setActiveRefrigerationType] = useState<string | null>(null);

  const toggleFilter = (id: string) => {
    setExpandedFilters(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const handleLoadMore = () => {
    setVisibleProductCount(prevCount => prevCount + 5); // Load 5 more products
  };

  return (
    <div className=" bg-white min-h-screen">
      <div className="container mx-auto px-4 pt-8 ">
        <div className="flex flex-col lg:flex-row gap-2   pb-8 ">

          {/* Sidebar Filters */}
          <aside className="lg:w-60 xl:w-64 border border-gray-200 shadow-sm ">
            <div className="space-y-0">
              {/* Active Filters / Selected Filters */}
              <div className=" bg-white  py-2 px-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Filters</h2>
                <div className="flex flex-wrap gap-2 mb-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                    Depth: 5
                    <button className="hover:text-primary cursor-pointer transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                </div>
                <button className="text-sm mt-5 cursor-pointer  font-normal underline 
                 text-black  decoration-gray-900 underline-offset-2 hover:text-primary hover:decoration-primary transition-all">
                  Clear all filters
                </button>
              </div>

              <div className="  bg-white p-2">

                <FilterSection id="brand" title="Brand" expandedFilters={expandedFilters} toggleFilter={toggleFilter}>
                  <Checkbox label="Icemanz" count={500} />
                  <Checkbox label="Astra" count={639} />
                  <Checkbox label="Amerikooler" count={136} />
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

                <FilterSection id="walk-in-type" title="Walk In Type" expandedFilters={expandedFilters} toggleFilter={toggleFilter}>
                  <Checkbox label="Combo (Cooler & Freezer)" count={101} />
                  <Checkbox label="Cooler" count={1} />
                </FilterSection>

                <FilterSection id="product-type" title="Product Type" expandedFilters={expandedFilters} toggleFilter={toggleFilter}>
                  <Checkbox label="Indoor" count={45} />
                  <Checkbox label="Outdoor" count={32} />
                </FilterSection>

                <FilterSection id="power-type" title="Power Type" expandedFilters={expandedFilters} toggleFilter={toggleFilter}>
                  <Checkbox label="Electric" count={500} />
                  <Checkbox label="Gas" count={50} />
                </FilterSection>

                <FilterSection id="custom-product" title="Custom Product" expandedFilters={expandedFilters} toggleFilter={toggleFilter}>
                  <Checkbox label="Yes" count={200} />
                  <Checkbox label="No" count={400} />
                </FilterSection>

                <FilterSection id="depth" title="Depth" expandedFilters={expandedFilters} toggleFilter={toggleFilter}>
                  <Checkbox label="4'" count={12} />
                  <Checkbox label="5'" count={28} />
                  <Checkbox label="6'" count={15} />
                </FilterSection>

                <FilterSection id="wattage" title="Wattage" expandedFilters={expandedFilters} toggleFilter={toggleFilter}>
                  <Checkbox label="1000W" count={50} />
                  <Checkbox label="1500W" count={75} />
                  <Checkbox label="2000W" count={100} />
                </FilterSection>

                <FilterSection id="number-of-wells" title="Number of Wells" expandedFilters={expandedFilters} toggleFilter={toggleFilter}>
                  <Checkbox label="2 Wells" count={50} />
                  <Checkbox label="3 Wells" count={75} />
                  <Checkbox label="4 Wells" count={100} />
                </FilterSection>
              </div>
            </div>
          </aside>

          {/* Main Content - Product Grid */}
          <div className="flex-1">

            {/* Box Type Filter Section */}
            <div className="mb-2 w-full px-6 border border-gray-200 border-b-0">
              {activeBoxType && activeRefrigerationType ? (
                <div>
                  <button
                    onClick={() => setActiveRefrigerationType(null)}
                    className="flex items-center gap-1 pt-4 text-gray-900 hover:text-primary transition-colors cursor-pointer"
                  >
                    <ChevronLeft size={16} strokeWidth={2.5} />
                    <span className="text-[15px] font-bold underline underline-offset-4 decoration-2">Back to Refrigeration Type</span>
                  </button>
                  <h3 className="text-sm font-bold text-gray-900 mt-4 uppercase tracking-wider">BOX DEPTH</h3>
                  <div className="flex items-center justify-start gap-3 mt-4 overflow-x-auto pb-4">
                    {['5', '6', '8', '10', '12'].map((depth, index) => (
                      <button
                        key={index}
                        className="px-8 py-3 rounded-full border border-blue-200 bg-white hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer text-gray-800 font-semibold text-sm"
                      >
                        {depth}
                      </button>
                    ))}
                  </div>
                </div>
              ) : activeBoxType ? (
                <div>
                  <button
                    onClick={() => setActiveBoxType(null)}
                    className="flex items-center gap-1 pt-4 text-gray-900 hover:text-primary transition-colors cursor-pointer"
                  >
                    <ChevronLeft size={16} strokeWidth={2.5} />
                    <span className="text-[15px] font-bold underline underline-offset-4 decoration-2">Back to Box Type</span>
                  </button>
                  <h3 className="text-sm font-bold text-gray-900 mt-4 uppercase tracking-wider">REFRIGERATION TYPE</h3>
                  <div className="flex items-center justify-start gap-3 mt-4 overflow-x-auto pb-4">
                    {boxTypes.find(b => b.name === activeBoxType)?.submenu.map((subType, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveRefrigerationType(subType.name)}
                        className="flex flex-col items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer w-[110px] h-[110px] p-2 flex-shrink-0"
                      >
                        <div className="flex items-center h-12 w-12 justify-center">
                          <img
                            src={boxTypes.find(b => b.name === activeBoxType)?.image}
                            alt={subType.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <span className="text-[13px] font-normal leading-tight text-center text-gray-800">{subType.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-sm font-bold text-gray-900 pt-4 self-start uppercase tracking-wider">BOX TYPE</h3>
                  <div className="flex items-center justify-start gap-3 mt-4 overflow-x-auto pb-4">
                    {boxTypes.map((type, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveBoxType(type.name)}
                        className="flex flex-col items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer w-[110px] h-[110px] p-2 flex-shrink-0"
                      >
                        <div className="flex items-center h-12 w-12 justify-center">
                          <img
                            src={type.image}
                            alt={type.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <span className="text-[13px] font-normal leading-tight text-center text-gray-800">{type.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>


            {/* Controls Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 shadow-sm lg:grid-cols-5 gap-0 border border-gray-200 bg-white">
              {mockProducts.slice(0, visibleProductCount).map((product) => (
                <Link
                  key={product.id}
                  href={`/walk-in-cooler-freezer/walk-in-coolers/${product.id}`}
                  className="bg-white border-r border-b border-gray-200 py-2 flex flex-col cursor-pointer hover:shadow-lg transition-all duration-300 group"
                >
                  {/* Image */}

                  <div className="h-45 relative overflow-hidden bg-white flex items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>


                  {/* Content */}
                  <div className="p-3 flex flex-col text-center ">
                    <div className="text-[10px] text-black font-bold mb-0.5">{product.brand}</div>
                    <h3 className="text-xs font-semibold text-gray-800 mb-2 text-center max-w-[200px] group-hover:text-primary transition-colors">{product.name}</h3>
                    <div className="text-lg font-semibold text-[#004a99] mb-1 ">${product.price}</div>
                    <div className="flex items-center justify-center gap-1.5 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      <span className="text-[9px] font-black text-gray-500 uppercase">IN STOCK</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart({
                          id: product.id,
                          name: product.name,
                          price: parseFloat(product.price.replace(/,/g, '')),
                          image: product.image,
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
          </div>
        </div>
      </div>
    </div>
  );
}
