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
  ShieldCheck
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
          {/* Top Row: Breadcrumb & Search */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <nav className="flex items-center gap-2 text-[14px] font-medium">
              <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors">Home</Link>
              <span className="text-gray-400 font-light mx-1">&gt;</span>
              <Link href="/walk-in-cooler-freezer" className="text-blue-600 hover:text-blue-800 transition-colors">Walk-in Cooler & Freezer</Link>
              <span className="text-gray-400 font-light mx-1">&gt;</span>
              <span className="text-slate-400 font-normal">{title}</span>
            </nav>

            <div className="flex w-full md:w-auto items-center shadow-sm border border-gray-100 rounded-lg overflow-hidden transition-shadow hover:shadow-md">
              <div className="relative flex-grow md:w-80">
                <input
                  type="text"
                  placeholder="Search the Catalog"
                  className="w-full pl-5 pr-10 py-3 text-[15px] focus:outline-none placeholder:text-gray-400"
                />
              </div>
              <button className="bg-[#005cb9] text-white px-8 py-3 font-black text-[15px] hover:bg-blue-700 transition-all flex items-center gap-2 uppercase tracking-tighter shrink-0">
                Find It <ChevronRight size={18} strokeWidth={3} />
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            {/* Sidebar Filters */}
            <aside className="w-full lg:w-[240px] shrink-0">
              <div className="space-y-10 sticky top-32">
                <section className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100/50">
                  <div className="flex items-center gap-2 mb-6">
                    <Layers size={18} className="text-slate-900" />
                    <h3 className="text-[16px] font-black text-slate-900 uppercase tracking-wider">Sort By</h3>
                  </div>
                  <ul className="space-y-3">
                    {[
                      { label: 'Featured', icon: Tag },
                      { label: 'Size', icon: Box },
                      { label: 'Brand', icon: ShieldCheck }
                    ].map((item) => (
                      <li key={item.label}>
                        <button className="flex items-center gap-3 w-full p-2 rounded-xl text-[14px] font-bold text-slate-600 hover:text-[#005cb9] hover:bg-white hover:shadow-sm transition-all cursor-pointer group">
                          <item.icon size={16} className="text-slate-400 group-hover:text-[#005cb9] transition-colors" />
                          {item.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100/50">
                  <div className="flex items-center gap-2 mb-8">
                    <Filter size={18} className="text-slate-900" />
                    <h3 className="text-[16px] font-black text-slate-900 uppercase tracking-wider">Narrow By</h3>
                  </div>

                  <div className="space-y-10">
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Truck size={14} className="text-slate-400" />
                        <h4 className="text-[12px] font-black text-slate-400 uppercase tracking-widest">Availability</h4>
                      </div>
                      <label className="flex items-center gap-3 cursor-pointer group p-2 rounded-xl hover:bg-white hover:shadow-sm transition-all">
                        <div className="relative flex items-center justify-center">
                          <input type="checkbox" className="peer appearance-none w-5 h-5 border-2 border-slate-200 rounded-md checked:bg-[#005cb9] checked:border-[#005cb9] transition-all cursor-pointer" />
                          <Check size={14} className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" strokeWidth={4} />
                        </div>
                        <span className="text-[14px] font-bold text-slate-600 group-hover:text-[#005cb9] transition-colors">Barr Ready Ship</span>
                      </label>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Box size={14} className="text-slate-400" />
                        <h4 className="text-[12px] font-black text-slate-400 uppercase tracking-widest">Condition</h4>
                      </div>
                      <div className="space-y-2">
                        {['New', 'Used'].map((condition) => (
                          <label key={condition} className="flex items-center gap-3 cursor-pointer group p-2 rounded-xl hover:bg-white hover:shadow-sm transition-all">
                            <div className="relative flex items-center justify-center">
                              <input type="checkbox" className="peer appearance-none w-5 h-5 border-2 border-slate-200 rounded-md checked:bg-[#005cb9] checked:border-[#005cb9] transition-all cursor-pointer" />
                              <Check size={14} className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" strokeWidth={4} />
                            </div>
                            <span className="text-[14px] font-bold text-slate-600 group-hover:text-[#005cb9] transition-colors">{condition}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-baseline gap-4 mb-12 border-b border-slate-100 pb-8">
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
                  {title}
                </h1>
                <Link href="/quote" className="text-[13px] font-black text-[#005cb9] hover:underline uppercase tracking-widest">
                  Don't see the size you need? <span className="text-slate-900">Click Here!</span>
                </Link>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-16">
                {mockProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/walk-in-cooler-freezer/${slug}/${product.id}`}
                    className="group flex flex-col h-full bg-white rounded-2xl border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 overflow-hidden cursor-pointer"
                  >
                    {/* Image Area with Floating Badge */}
                    <div className="relative group/img aspect-[4/3] bg-slate-50 overflow-hidden flex items-center justify-center p-4">
                      {/* Badge matching reference image exactly */}
                      <div className="absolute top-4 left-4 z-10">
                        <span className="bg-[#cc0000] text-white px-3 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-900/20 rounded-sm">
                          {product.badge}
                        </span>
                      </div>

                      <img
                        src={product.image}
                        alt={product.title}
                        className="max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>

                    {/* Content Area */}
                    <div className="flex flex-col flex-grow p-5">
                      <h3 className="text-[15px] font-black text-slate-900 leading-tight mb-3 group-hover:text-[#005cb9] transition-colors min-h-[40px] line-clamp-2">
                        {product.title}
                      </h3>

                      <p className="text-[13px] font-medium text-slate-500 line-clamp-2 mb-6 leading-relaxed flex-grow">
                        {product.description}
                      </p>

                      <div className="flex flex-wrap gap-3 mb-6">
                        {product.sqFt !== '0 Sq. Ft.' && (
                          <div className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider">{product.sqFt}</div>
                        )}
                        <div className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider">{product.condition}</div>
                      </div>

                      <div className="mt-auto pt-4 border-t border-slate-50">
                        <div className="text-[#005cb9] text-[13px] font-black hover:gap-2 flex items-center gap-1.5 group/link transition-all">
                          View Details <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
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

      <CTA />
      <Footer />
    </main>
  );
}
