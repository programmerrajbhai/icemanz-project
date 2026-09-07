import prisma from '@/lib/prisma';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

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

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = q || '';

  const cleanPrice = (priceStr: string | null) => {
    if (!priceStr) return '0.00';
    const num = parseFloat(String(priceStr).replace(/[^0-9.]/g, ''));
    return isNaN(num) ? '0.00' : num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const queryWords = query.split(/\s+/).filter(w => w.trim().length > 0);

  // Fetch products that match the query
  const products = await prisma.product.findMany({
    where: queryWords.length > 0 ? {
      AND: queryWords.map(word => ({
        OR: [
          { title: { contains: word, mode: 'insensitive' } },
          { keyFeatures: { contains: word, mode: 'insensitive' } },
          { description: { contains: word, mode: 'insensitive' } }
        ]
      }))
    } : {},
    include: {
      category: {
        include: {
          parent: {
            include: { parent: true }
          }
        }
      }
    }
  });

  const getProductUrl = (product: any) => {
    const walkInCategories = [
      'walk-in-cooler-freezer',
      'walk-in-cooler-no-floor',
      'walk-in-cooler-with-floor',
      'walk-in-freezer-with-floor',
      'walk-in-combo-cooler-freezer'
    ];

    const isWalkIn = product.category && (
      walkInCategories.includes(product.category.slug) ||
      (product.category.parent && walkInCategories.includes(product.category.parent.slug))
    );

    if (isWalkIn) {
      return `/walk-in-cooler-freezer/${product.slug}`;
    }

    if (product.category) {
      return `/refrigeration-equipment/${product.category.slug}/${product.id}`;
    }

    return `/refrigeration-equipment/all/${product.id}`;
  };

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="pt-36 pb-20 md:pt-48 md:pb-24">
        <div className="container px-4">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-semibold text-primary tracking-tight">
              Search Results {query && `for "${query}"`}
            </h1>
            <p className="text-sm pt-2 block font-medium text-gray-500">
              Found {products.length} products
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6 mb-8">
            {products.length === 0 ? (
              <div className="col-span-full py-12 text-center text-gray-500 font-medium border border-dashed border-gray-300 rounded-sm">
                No products found matching your search.
              </div>
            ) : (
              products.map((product) => {
                return (
                  <Link
                    key={product.id}
                    href={getProductUrl(product)}
                    className="group bg-white border border-gray-200 rounded-sm p-2 overflow-hidden hover:-translate-y-1 transition-all duration-500 flex flex-col"
                  >
                    {/* Image Area */}
                    <div className="border-b border-gray-200 w-full rounded-sm bg-gray-50 overflow-hidden mb-3 relative pt-[100%]">
                      {product.images && product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.title}
                          fill
                          className="object-contain p-2 transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-semibold bg-gray-100">No Image</div>
                      )}
                    </div>

                    {/* Content Area */}
                    <div className="flex flex-col flex-grow items-center text-center">
                      <div className="text-[10px] text-black font-bold mb-0.5 uppercase">
                        {product.brand || product.title.split(' ')[0]}
                      </div>

                      <h3 className="text-xs font-medium text-gray-800 mb-2 text-center max-w-[200px] group-hover:text-primary transition-colors line-clamp-2">
                        {product.title}
                      </h3>

                      {product.price ? (
                        <p className="text-base font-bold text-[#004a99] mb-2">
                          ${cleanPrice(product.price)}
                        </p>
                      ) : (
                        <p className="text-xs font-medium text-gray-400 mb-2">Contact for Price</p>
                      )}

                      <div className="flex items-center justify-center gap-1.5 mb-4">
                        <div className="w-1.5 h-1.5 rounded-sm bg-[#00C853]"></div>
                        <span className="text-[9px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                          {product.badge || 'IN STOCK'}
                        </span>
                      </div>

                      {/* Action Button */}
                      <div className="w-full mt-auto pb-1">
                        <div className="cursor-pointer w-full py-2.5 px-3 border-[1.5px] border-gray-200 rounded-sm flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] font-black text-[#0f172a] uppercase tracking-[0.2em] group-hover:border-gray-300 group-hover:bg-gray-50 transition-all duration-300 shadow-sm group-hover:shadow">
                          View Details
                          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform text-[#0f172a]" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
