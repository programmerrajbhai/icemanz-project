import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CTA from '@/components/CTA';
import Link from 'next/link';
import {
  ChevronRight,
  Search,
  ChevronDown,
  Filter,
  Check
} from 'lucide-react';

const mockProducts = [
  {
    id: 1,
    badge: 'ALWAYS IN STOCK!',
    title: 'New ICEMANZ 5\' x 8\' x 8\'H Walk-in Cooler',
    image: '/products/product_1.jpg',
    description: 'We can quote any size walk-in cooler or freezer to suit your needs.',
    condition: 'Used',
    sqFt: '40 Sq. Ft.',
    type: 'New'
  },
  {
    id: 2,
    badge: 'NEXT DAY DELIVERY!',
    title: 'New ICEMANZ 8\' x 10\' x 10\'H Walk-in Cooler',
    image: '/slider/s_1.jpeg',
    description: 'Don\'t see the size you need? We can quote any size walk-in cooler or freezer to suit your needs.',
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
    title: 'ICEMANZ 10\' x 12\' x 8\'H Commercial Freezer',
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
    title: 'New ICEMANZ 8\' x 8\' x 10\'H Walk-in Cooler',
    image: '/slider/s_3.jpeg',
    description: 'Extra height for increased storage capacity.',
    condition: 'New',
    sqFt: '64 Sq. Ft.',
    type: 'New'
  }
];

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;

  // Format the slug for display
  const title = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="pt-32 pb-20 md:pt-40 md:pb-24">
        <div className="container px-4">
          {/* Breadcrumb & Search Row */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <nav className="flex items-center gap-2 text-[13px] font-medium text-blue-600">
              <Link href="/" className="hover:underline">Home</Link>
              <ChevronRight size={14} className="text-gray-400" />
              <Link href="/walk-in-cooler-freezer" className="hover:underline">Coolers & Freezers</Link>
              <ChevronRight size={14} className="text-gray-400" />
              <span className="text-gray-400">{title}</span>
            </nav>

            <div className="flex w-full md:w-auto items-center">
              <div className="relative flex-grow md:w-64">
                <input
                  type="text"
                  placeholder="Search the Catalog"
                  className="w-full pl-4 pr-10 py-2.5 border border-gray-200 rounded-l-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <button className="bg-primary text-white px-6 py-2.5 rounded-r-md font-bold text-sm hover:bg-blue-700 transition-all flex items-center gap-2 uppercase tracking-wider">
                Find It <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar Filters */}
            <aside className="w-full lg:w-[240px] shrink-0">
              <div className="space-y-10">
                <section>
                  <h3 className="text-lg font-black text-gray-900 mb-6 uppercase tracking-tighter">Sort By</h3>
                  <ul className="space-y-4">
                    {['Featured', 'Size', 'Brand'].map((item) => (
                      <li key={item}>
                        <button className="flex items-center gap-2 text-[15px] font-bold text-gray-600 hover:text-primary transition-colors group w-full text-left">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                          {item}
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-black text-gray-900 mb-6 uppercase tracking-tighter">Narrow By</h3>
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-[14px] font-bold text-gray-900 mb-4">Availability</h4>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-5 h-5 border-2 border-gray-200 rounded flex items-center justify-center group-hover:border-primary transition-colors">
                          <Check size={14} className="text-primary opacity-0 group-hover:opacity-100" />
                        </div>
                        <span className="text-[14px] font-medium text-gray-600">ICEMANZ Ready Ship</span>
                      </label>
                    </div>

                    <div>
                      <h4 className="text-[14px] font-bold text-gray-900 mb-4">Condition</h4>
                      <div className="space-y-3">
                        {['New', 'Used'].map((condition) => (
                          <label key={condition} className="flex items-center gap-3 cursor-pointer group">
                            <div className="w-5 h-5 border-2 border-gray-200 rounded flex items-center justify-center group-hover:border-primary transition-colors">
                              <Check size={14} className="text-primary opacity-0 group-hover:opacity-100" />
                            </div>
                            <span className="text-[14px] font-medium text-gray-600">{condition}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 border-b border-gray-100 pb-6">
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tight">
                  {title}
                </h1>
                <Link href="https://www.barrinc.com/quote-request/5868" className="text-[13px] font-bold text-blue-600 hover:underline uppercase tracking-wider">
                  Don't see the size you need? <span className="text-primary">Click Here!</span>
                </Link>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                {mockProducts.map((product) => (
                  <div key={product.id} className="group flex flex-col bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden h-full">
                    {/* Image Area with Badge Overlay */}
                    <div className="relative aspect-[4/3] bg-gray-50 flex items-center justify-center p-4 overflow-hidden">
                      {/* Badge */}
                      <div className="absolute top-0 left-0 z-10">
                        <span className="bg-[#cc0000] text-white px-3 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-md inline-block">
                          {product.badge}
                        </span>
                      </div>

                      <img
                        src={product.image}
                        alt={product.title}
                        className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out"
                      />

                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Content Area */}
                    <div className="p-4 flex flex-col flex-grow">
                      <div className="space-y-2 mb-4">
                        <h3 className="text-[14px] font-bold text-gray-900 leading-snug group-hover:text-primary transition-colors min-h-[40px] line-clamp-2">
                          {product.title}
                        </h3>
                        <p className="text-[12px] text-gray-500 leading-relaxed line-clamp-2">
                          {product.description}
                        </p>
                      </div>

                      {/* Specs Grid */}
                      <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg mb-4 border border-gray-100/50">
                        <div className="flex flex-col">
                          <span className="text-gray-400 text-[9px] font-bold uppercase tracking-widest mb-0.5">Size</span>
                          <span className="text-gray-900 text-[12px] font-extrabold">{product.sqFt}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-gray-400 text-[9px] font-bold uppercase tracking-widest mb-0.5">Condition</span>
                          <span className="text-gray-900 text-[12px] font-extrabold">{product.condition}</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="mt-auto">
                        <Link
                          href="https://www.barrinc.com/quote-request/5868"
                          className="w-full bg-slate-900 text-white py-2.5 rounded-lg font-bold text-[12px] flex items-center justify-center gap-2 hover:bg-primary transition-all duration-300 shadow-lg shadow-gray-200 uppercase tracking-wide group/btn cursor-pointer"
                        >
                          View / Get Quote
                          <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
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
