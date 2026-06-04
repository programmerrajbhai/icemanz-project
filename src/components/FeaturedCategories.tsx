import Link from 'next/link';
import Image from 'next/image';

const categories = [
  {
    title: 'Walk-In Coolers',
    count: 'Top Rated',
    image: '/home/Refrigeration_warehouse_walk-in_…_202606042137.jpeg',
    href: '/walk-in-cooler-freezer/walk-in-cooler-no-floor',
  },
  {
    title: 'Walk-In Freezers',
    count: 'Best Seller',
    image: '/home/hf4.jpeg',
    href: '/walk-in-cooler-freezer/walk-in-freezer-with-floor',
  },
  {
    title: 'Combo Units',
    count: 'New Arrivals',
    image: '/home/hf2.jpeg',
    href: '/walk-in-cooler-freezer/walk-in-combo-cooler-freezer',
  },
  {
    title: 'Refrigeration Equipment',
    count: 'High Efficiency',
    image: '/home/hf.jpeg',
    href: '/refrigeration-equipment',
  },
];

export default function FeaturedCategories() {
  return (
    <section className="py-16 bg-white">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <Link
              href={category.href}
              key={index}
              className="relative h-[240px] md:h-[280px] rounded-lg overflow-hidden group block cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-in-out"
                />
              </div>

              {/* Gradient Overlay for better readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 group-hover:via-black/50 transition-colors duration-500"></div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 z-10">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                  <span className="inline-block text-white/90 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[1px] after:bg-primary group-hover:after:w-full after:transition-all after:duration-500">
                    {category.count}
                  </span>
                  <h3 className="text-white text-xl sm:text-2xl font-bold mb-4 drop-shadow-lg tracking-tight">
                    {category.title}
                  </h3>

                  {/* Button Area */}
                  <div className="overflow-hidden">
                    <div className="inline-flex items-center gap-2 bg-[#f8b600] text-gray-900 px-5 py-2.5 rounded-sm text-[11px] font-black uppercase tracking-wider transition-all shadow-lg transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 duration-500 ease-out hover:bg-[#e5a800]">
                      Shop Now
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:translate-x-1 transition-transform">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}