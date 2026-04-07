import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CTA from '@/components/CTA';
import Link from 'next/link';
import {
  ChevronRight,
  Search,
  ChevronDown,
  Filter,
  Check,
  ArrowRight,
  Layers,
  Box,
  Tag,
  Truck,
  ShieldCheck,
  LayoutGrid
} from 'lucide-react';

const mockProducts = [
  {
    id: 1,
    badge: 'ALWAYS IN STOCK!',
    title: "New ICEMANZ 5' x 8' x 8'H Walk-in Cooler",
    image: '/products/product_1.jpg',
    description: 'We can quote any size walk-in cooler or freezer to suit your needs.',
    condition: 'Used',
    sqFt: '40 Sq. Ft.',
    type: 'New'
  },
  {
    id: 2,
    badge: 'NEXT DAY DELIVERY!',
    title: "New ICEMANZ 8' x 10' x 10'H Walk-in Cooler",
    image: '/slider/s_1.jpeg',
    description: "Don't see the size you need? We can quote any size walk-in cooler or freezer to suit your needs.",
    condition: 'New',
    sqFt: '0 Sq. Ft.',
    type: 'New'
  },
  {
    id: 3,
    badge: '$7,970 IN STOCK!',
    title: 'New ICEMANZ 8\' x 8\' x 8\'2"H Walk-in Cooler with Floor',
    image: '/products/product_2.jpg',
    description: 'Premium insulation and heavy-duty doors for commercial use.',
    condition: 'New',
    sqFt: '64 Sq. Ft.',
    type: 'New'
  },
  {
    id: 4,
    badge: '$9,883 IN STOCK!',
    title: "ICEMANZ 10' x 12' x 8'H Commercial Freezer",
    image: '/slider/s_2.jpeg',
    description: 'High-performance cooling for large inventory storage.',
    condition: 'New',
    sqFt: '120 Sq. Ft.',
    type: 'New'
  },
  {
    id: 5,
    badge: '$10,583 IN STOCK!',
    title: 'New ICEMANZ 8\' x 8\' x 8\'2"H Walk-in Cooler with Floor',
    image: '/products/product_1.jpg',
    description: 'Complete walk-in solution with easy-to-install panels.',
    condition: 'New',
    sqFt: '64 Sq. Ft.',
    type: 'New'
  },
  {
    id: 6,
    badge: '$9,158 IN STOCK!',
    title: "New ICEMANZ 8' x 8' x 10'H Walk-in Cooler",
    image: '/slider/s_3.jpeg',
    description: 'Extra height for increased storage capacity.',
    condition: 'New',
    sqFt: '64 Sq. Ft.',
    type: 'New'
  }
];

export default async function SubCategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;

  // Format the slug for display
  const title = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="pt-28 pb-20 md:pt-36 md:pb-24">
        <div className="container px-4">
          {/* Breadcrumb & Search Section - Preline Pattern */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <nav className="flex items-center whitespace-nowrap min-w-0" aria-label="Breadcrumb">
              <ol className="flex items-center text-sm text-gray-500 font-medium">
                <li className="flex items-center">
                  <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                  <ChevronRight size={14} className="mx-2 text-gray-400 shrink-0" />
                </li>
                <li className="flex items-center">
                  <Link href="/walk-in-cooler-freezer" className="hover:text-primary transition-colors">Walk-in Cooler & Freezer</Link>
                  <ChevronRight size={14} className="mx-2 text-gray-400 shrink-0" />
                </li>
                <li className="text-gray-800 font-bold truncate" aria-current="page">
                  {title}
                </li>
              </ol>
            </nav>

            <div className="w-full md:w-auto">
              <div className="flex rounded-lg shadow-sm">
                <input
                  type="text"
                  placeholder="Search the Catalog"
                  className="py-3 px-4 block w-full md:w-80 border-gray-300 shadow-sm rounded-s-lg text-sm focus:z-10 focus:border-primary focus:ring-primary disabled:opacity-50 disabled:pointer-events-none"
                />
                <button
                  type="button"
                  className="py-3 px-6 inline-flex justify-center items-center gap-x-2 text-sm font-black uppercase tracking-widest rounded-e-lg border border-transparent bg-primary text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer"
                >
                  Find It
                  <ChevronRight size={18} strokeWidth={3} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Preline Vertical Nav Pattern */}
            <aside className="lg:w-64 shrink-0">
              <div className="space-y-6 sticky top-32">
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
                        { label: 'Size', icon: Box },
                        { label: 'Brand', icon: ShieldCheck }
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

                {/* Narrow By Section */}
                <div className="flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-gray-50/50 px-5 py-3 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <Filter size={16} className="text-gray-800" />
                      <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider">Narrow By</h3>
                    </div>
                  </div>
                  <div className="p-5 space-y-8">
                    {/* Availability */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Truck size={14} className="text-gray-400" />
                        <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Availability</h4>
                      </div>
                      <div className="space-y-3">
                        <label className="flex items-center gap-x-3 cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="shrink-0 size-4 border-gray-300 rounded text-primary focus:ring-primary disabled:opacity-50 disabled:pointer-events-none cursor-pointer transition-all" 
                            id="hs-availability-ready-ship"
                          />
                          <span className="text-sm font-bold text-gray-600 cursor-pointer hover:text-primary transition-colors">Barr Ready Ship</span>
                        </label>
                      </div>
                    </div>

                    {/* Condition */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Box size={14} className="text-gray-400" />
                        <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Condition</h4>
                      </div>
                      <div className="space-y-3">
                        {['New', 'Used'].map((condition) => (
                          <label key={condition} className="flex items-center gap-x-3 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="shrink-0 size-4 border-gray-300 rounded text-primary focus:ring-primary disabled:opacity-50 disabled:pointer-events-none cursor-pointer transition-all" 
                              id={`hs-condition-${condition.toLowerCase()}`}
                            />
                            <span className="text-sm font-bold text-gray-600 cursor-pointer hover:text-primary transition-colors">{condition}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-4 mb-10 pb-6 border-b border-gray-100">
                <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter">
                  {title}
                </h1>
                <Link href="/quote" className="text-[12px] font-black text-primary hover:text-blue-800 uppercase tracking-widest transition-colors">
                  Don't see the size you need? <span className="text-gray-900">Click Here!</span>
                </Link>
              </div>

              {/* Product Grid - Compact Preline Pattern */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {mockProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/walk-in-cooler-freezer/${slug}/${product.id}`}
                    className="group flex flex-col bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
                  >
                    {/* Compact Image Area */}
                    <div className="relative pt-[65%] bg-gray-50 overflow-hidden">
                      {/* Red Badge matching reference image */}
                      <div className="absolute top-0 left-0 z-10">
                        <span className="inline-block bg-[#cc0000] text-white px-2.5 py-1 text-[9px] font-black uppercase tracking-widest">
                          {product.badge}
                        </span>
                      </div>

                      <img
                        src={product.image}
                        alt={product.title}
                        className="size-full absolute top-0 start-0 object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                      />
                    </div>

                    {/* Compact Content Area */}
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="text-sm font-semibold text-gray-800 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {product.title}
                      </h3>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {product.sqFt !== '0 Sq. Ft.' && (
                          <span className="py-1 px-2 inline-flex items-center text-[11px] font-medium uppercase tracking-wider bg-gray-100 text-gray-500 rounded-md">
                            {product.sqFt}
                          </span>
                        )}
                        <span className="py-1 px-2 inline-flex items-center text-[11px] font-medium uppercase tracking-wider bg-gray-100 text-gray-500 rounded-md">
                          {product.condition}
                        </span>
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-sm font-semibold text-primary group-hover:text-blue-700 transition-colors">
                          View Details
                        </span>
                        <ArrowRight size={14} className="text-primary group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <CTA />
      <Footer />
    </main>
  );
}
