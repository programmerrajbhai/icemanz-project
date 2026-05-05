'use client';
import { useState } from 'react';
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
  { id: '1', brand: 'ASTRA', name: 'Astra 6 x 6 Walk-In Cooler No Floor', model: 'CNF6X6', price: '2,903.00', image: '/Walk-in-Cooler-Freezer/walkincoolers.jpg' },
  { id: '2', brand: 'ASTRA', name: 'Astra 6 x 8 Walk-In Cooler No Floor', model: 'CNF6X8', price: '3,156.00', image: '/Walk-in-Cooler-Freezer/walkincoolers.jpg' },
  { id: '3', brand: 'ASTRA', name: 'Astra 6 x 6 Walk-In Cooler with Floor', model: 'CWF6X6', price: '3,165.00', image: '/Walk-in-Cooler-Freezer/coolerswithfloor.jpg' },
  { id: '4', brand: 'ASTRA', name: 'Astra 5 x 6 Walk-In Cooler No Floor', model: 'CNF5X6', price: '3,220.00', image: '/Walk-in-Cooler-Freezer/walkincoolers.jpg' },
  { id: '5', brand: 'ASTRA', name: 'Astra 6 x 10 Walk-In Cooler No Floor', model: 'CNF6X10', price: '3,410.00', image: '/Walk-in-Cooler-Freezer/walkincoolers.jpg' },
  { id: '6', brand: 'ASTRA', name: 'Astra 6 x 8 Walk-In Cooler with Floor', model: 'CWF6X8', price: '3,447.00', image: '/Walk-in-Cooler-Freezer/coolerswithfloor.jpg' },
  { id: '7', brand: 'COLDLINE', name: 'Coldline 6 x 6 Walk-in Refrigerator Cooler Box', model: 'CL6X6', price: '3,472.74', image: '/Walk-in-Cooler-Freezer/walkincoolers.jpg' },
  { id: '8', brand: 'ASTRA', name: 'Astra 5 x 8 Walk-In Cooler No Floor', model: 'CNF5X8', price: '3,488.00', image: '/Walk-in-Cooler-Freezer/walkincoolers.jpg' },
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

export default function WalkInCoolerFreezerClient() {
  const { addToCart } = useCart();
  const [expandedFilters, setExpandedFilters] = useState<string[]>(['brand', 'size', 'refrigeration', 'walk-in-type', 'product-type', 'power-type', 'custom-product', 'depth', 'wattage', 'number-of-wells']);
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
        <div className="flex flex-col lg:flex-row gap-4  pb-8 ">

          {/* Sidebar Filters */}
          <aside className="lg:w-60 xl:w-64 border border-gray-300 ">
            <div className="space-y-0">

              {/* Active Filters / Selected Filters */}
              <div className=" bg-white  p-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-8">Filters</h2>
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
            <div className="mb-8">
              <h1 className="text-2xl font-black text-[#004a99] mb-2">Walk-in Cooler & Freezer</h1>
              <p className="text-sm text-gray-500">Showing 1–8 of 8 results</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {mockProducts.slice(0, visibleProductCount).map((product) => (
                <div key={product.id} className="bg-white border border-gray-200 flex flex-col">
                  {/* Image */}
                  <div className="relative pt-[100%] bg-white overflow-hidden border-b border-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="absolute inset-0 object-contain p-3"
                    />
                  </div>
                  {/* Content */}
                  <div className="p-3 flex flex-col text-center ">
                    <div className="text-[10px] text-gray-400 font-bold mb-0.5">{product.brand}</div>
                    <h3 className="text-xs font-semibold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
                    <div className="text-lg font-black text-[#004a99] mb-1">${product.price}</div>
                    <div className="flex items-center justify-center gap-1.5 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      <span className="text-[9px] font-black text-gray-500 uppercase">IN STOCK</span>
                    </div>
                    <button
                      onClick={() => addToCart({
                        id: product.id,
                        name: product.name,
                        price: parseFloat(product.price.replace(/,/g, '')),
                        image: product.image,
                        quantity: 1
                      })}
                      className="w-full py-1.5 cursor-pointer bg-[#004a99] text-white text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-[#003d80] transition-colors"
                    >
                      <ShoppingCart size={12} /> Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
