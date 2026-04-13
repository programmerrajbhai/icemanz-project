"use client";

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { 
  ChevronRight, 
  Search, 
  LayoutGrid, 
  Tag, 
  Box, 
  ShieldCheck, 
  Filter, 
  Truck,
  ArrowLeft
} from 'lucide-react';
import { useParams } from 'next/navigation';

// Mock products data for refrigeration equipment categories
const products = [
  {
    id: 1,
    name: "Standard Condensing Unit",
    price: "From $1,200",
    image: "/slider/s_1.jpeg",
    specs: ["Air Cooled", "R448A/R449A", "Outdoor Housing"]
  },
  {
    id: 2,
    name: "Premium Evaporator Coil",
    price: "From $850",
    image: "/slider/s_2.jpeg",
    specs: ["Electric Defrost", "Low Profile", "Aluminum Fins"]
  },
  {
    id: 3,
    name: "Industrial Scroll Compressor",
    price: "From $2,400",
    image: "/slider/s_3.jpeg",
    specs: ["High Efficiency", "Quiet Operation", "Vibration Isolation"]
  },
  {
    id: 4,
    name: "Center Mount Cooling Unit",
    price: "From $1,100",
    image: "/slider/s_1.jpeg",
    specs: ["Dual Discharge", "Compact Design", "Easy Install"]
  },
  {
    id: 5,
    name: "High Capacity Combo Unit",
    price: "From $3,500",
    image: "/Walk-inCooler&Freezer/combounits.jpg",
    specs: ["Plug & Play", "Pre-charged", "Microprocessor Control"]
  },
  {
    id: 6,
    name: "Thin Profile reach-in Unit",
    price: "From $750",
    image: "/slider/s_2.jpeg",
    specs: ["Ultra Slim", "Space Saving", "LED Lighting"]
  }
];

export default function RefrigerationSubcategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  // Convert slug back to title case
  const title = slug
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
            <aside className="lg:w-64 shrink-0">
              <div className="space-y-6 sticky top-32">
                <Link href="/refrigeration-equipment" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-blue-700 transition-colors mb-4">
                  <ArrowLeft size={16} />
                  Back to All Equipment
                </Link>

                {/* Sort By Section */}
                <div className="flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-gray-50/50 px-5 py-3 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <LayoutGrid size={16} className="text-gray-800" />
                      <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider">Sort By</h3>
                    </div>
                  </div>
                  <div className="p-2">
                    <nav className="flex flex-col space-y-1">
                      {[
                        { label: 'Featured', icon: Tag },
                        { label: 'Capacity', icon: Box },
                        { label: 'Efficiency', icon: ShieldCheck }
                      ].map((item) => (
                        <button
                          key={item.label}
                          className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 hover:text-primary transition-all cursor-pointer w-full text-left"
                        >
                          <item.icon size={16} className="text-gray-400" />
                          {item.label}
                        </button>
                      ))}
                    </nav>
                  </div>
                </div>

                {/* Filter Section */}
                <div className="flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-gray-50/50 px-5 py-3 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <Filter size={16} className="text-gray-800" />
                      <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider">Filter</h3>
                    </div>
                  </div>
                  <div className="p-5 space-y-8">
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Truck size={14} className="text-gray-400" />
                        <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Shipping</h4>
                      </div>
                      <div className="space-y-3">
                        <label className="flex items-center gap-x-3 cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="shrink-0 size-4 border-gray-300 rounded text-primary focus:ring-primary cursor-pointer" 
                          />
                          <span className="text-sm font-bold text-gray-600 cursor-pointer hover:text-primary transition-colors">In Stock</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1">
              <div className="mb-10">
                <h1 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tight leading-none mb-4">
                  {title}
                </h1>
                <p className="text-gray-500 font-medium">Showing {products.length} products for your refrigeration needs.</p>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                {products.map((product) => (
                  <Link 
                    key={product.id} 
                    href={`/refrigeration-equipment/${slug}/${product.id}`}
                    className="group bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 flex flex-col"
                  >
                    <div className="p-4 bg-white">
                      <div className="relative pt-[80%] rounded-2xl bg-gray-50 overflow-hidden border border-gray-50">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="size-full absolute top-0 start-0 object-contain p-6 transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                    </div>
                    <div className="p-6 pt-2 flex flex-col flex-grow">
                      <h3 className="text-lg font-black text-gray-900 mb-2 uppercase tracking-tight group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {product.specs.map((spec, i) => (
                          <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            {spec}
                          </span>
                        ))}
                      </div>
                      <div className="mt-auto flex items-center justify-between gap-4">
                        <p className="text-primary font-black text-lg">{product.price}</p>
                        <div 
                          className="inline-flex items-center justify-center p-3 bg-gray-900 text-white rounded-xl hover:bg-primary transition-all active:scale-90"
                        >
                          <ChevronRight size={20} />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
