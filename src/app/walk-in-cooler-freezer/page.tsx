import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CTA from '@/components/CTA';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const productCategories = [
  { name: 'Walk In Coolers', image: '/products/product_1.jpg' },
  { name: 'Coolers With Floor', image: '/products/product_2.jpg' },
  { name: 'Walk-in Freezer Units', image: '/slider/s_1.jpeg' },
  { name: 'Freezers With Floor', image: '/slider/s_2.jpeg' },
  { name: 'Combo Units', image: '/slider/s_3.jpeg' },
  { name: 'Portable Refrigeration', image: '/products/product_1.jpg' },
  { name: 'Drive-in Coolers Freezers', image: '/products/product_2.jpg' },
  { name: 'New Cooler / Freezer Doors', image: '/slider/s_1.jpeg' },
];

const reasons = [
  'Increased storage capacity',
  'Saves on energy costs by maintaining an optimal temperature',
  'Reduces waste due to spoilage',
  'Prevents bacteria growth and food poisoning',
  'Helps ensure compliance with health and safety regulations',
  'Allows you to store large quantities of inventory',
  'Ideal for use in restaurants, cafes, bars, hotels, supermarkets, convenience stores, and more!',
  'Comes in a variety of sizes to suit your needs',
  'Can be used for both regular operations and experiential marketing events like conventions, trade shows, and brand pop-ups',
  'Customizable, affordable, easy to install'
];

const coolerTypes = [
  'Air curtain?',
  'Combo Unit?',
  'Cooler with Floor?',
  'Drive-In Cooler or Freezer?',
  'Freezer with Floor?',
  'New Cooler/Freezer Doors?',
  'Portable Refrigeration?',
  'Walk-In Cooler?',
  'Walk-In Freezer Unit?'
];

export default function WalkInCoolerFreezerPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      <div className="pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="container px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[12px] font-medium text-blue-600 mb-4">
            <Link href="/" className="hover:underline">Home</Link>
            <ChevronRight size={12} className="text-gray-400" />
            <span className="text-gray-400">Coolers & Freezers</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-12 uppercase tracking-tight">
            Coolers & Freezers
          </h1>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-x-6 gap-y-10 mb-20">
            {productCategories.map((product, index) => (
              <Link key={index} href={`/products/${product.name.toLowerCase().replace(/ /g, '-')}`} className="group flex flex-col items-center text-center">
                <div className="aspect-square w-full max-w-[220px] bg-gray-50 rounded-xl flex items-center justify-center p-3 mb-3 group-hover:shadow-lg transition-all duration-300 border border-gray-50">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <span className="text-[13px] font-bold text-gray-600 group-hover:text-primary transition-colors">
                  {product.name}
                </span>
              </Link>
            ))}
          </div>

          {/* Content Section */}
          <div className="max-w-5xl space-y-12">
            <section>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-8">Shop Coolers & Freezers</h2>
              <div className="space-y-6 text-gray-600 leading-relaxed text-[15px]">
                <p>
                  Commercial refrigerators and freezers are a necessary investment for any business that wants to keep their products and ingredients fresh. The food & beverage industry may be the first that comes to mind, but there are an abundance of diverse industries that require an industrial cooling solution.
                </p>
                <p>
                  At ICEMANZ, we've been designing custom refrigeration solutions for years! From pharmaceutical production to laboratory testing, many of the products and services that you use require reliable refrigeration.
                </p>
                <p>
                  Our inventory of commercial refrigerator freezers includes quality brands such as Copeland, Bohn, Krack, Hussmann, Heatcraft, Larkin, Kysor, and Tyler. Browse the categories above to find a great selection of new and used walk-in commercial refrigerators and freezers, refrigerated containers, combo units, and doors.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-8">Commercial Refrigerators for Sale</h2>
              <div className="space-y-6 text-gray-600 leading-relaxed text-[15px]">
                <p>
                  If you're looking for a commercial refrigerator for sale, there are a few things you need to know. Commercial freezers and coolers are an important investment for any business, big or small.
                </p>
                <p>
                  Not only do they maintain the quality of your stock, but they can also help you save money in the long-run. Here are 10 reasons why you should invest in a commercial refrigerator:
                </p>
                <ol className="space-y-3 list-decimal pl-5">
                  {reasons.map((reason, i) => (
                    <li key={i}>{reason}</li>
                  ))}
                </ol>
                <p className="pt-4">
                  However, you still must ensure that you choose the right type of refrigerator for your operations.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-8">Types of Commercial Coolers</h2>
              <div className="space-y-6 text-gray-600 leading-relaxed text-[15px]">
                <p>
                  At ICEMANZ, we offer an expansive selection of commercial refrigeration solutions that can be custom-fit to any space. But first, you must determine what you need; should you choose a/an:
                </p>
                <ul className="space-y-2 list-disc pl-5">
                  {coolerTypes.map((type, i) => (
                    <li key={i}>{type}</li>
                  ))}
                </ul>
                <p className="pt-4">
                  Or do you require the personalized service of a <Link href="https://www.barrinc.com/quote-request/5868" className="text-blue-600 hover:underline">Custom Package</Link>? Our refrigeration experts are here to help you find the perfect solution for your business.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-8">Used Commercial Refrigeration</h2>
              <div className="space-y-6 text-gray-600 leading-relaxed text-[15px]">
                <p>
                  There are a number of reasons to invest in a used commercial refrigerator. Perhaps the most obvious one is that it can save your business money. Commercial refrigerators are expensive to purchase new, but you can often find them at a fraction of the cost if you buy them used.
                </p>
                <p>
                  Another reason to buy a used commercial refrigerator is that it can help you reduce your environmental impact. Refrigerators use a lot of energy, and new ones are even more energy-intensive than used ones. Buying a used refrigerator is a great way to reduce your company's carbon footprint.
                </p>
                <p>
                  Finally, buying a used commercial refrigerator is a great way to recycle an old walk in. Commercial refrigerators are built to last, so if your business is looking for a new refrigerator, it's worth considering buying one that's been pre-owned.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-8">Find the Best Commercial Coolers for Sale at ICEMANZ</h2>
              <p className="text-gray-600 text-[15px]">
                To find or design the perfect cooler or freezer for your business, <Link href="https://www.barrinc.com/quote-request/5868" className="text-blue-600 hover:underline">reach out to our team</Link> today.
              </p>
            </section>
          </div>
        </div>
      </div>

      <CTA />
      <Footer />
    </main>
  );
}
