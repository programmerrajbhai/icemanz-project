import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ChevronRight, ShieldCheck, Zap, Clock, Snowflake, ArrowRight, CheckCircle2 } from 'lucide-react';

const productCategories = [
  { name: 'Walk-in coolers', image: '/Walk-inCooler&Freezer/walkincoolers.jpg' },
  { name: 'Coolers with floor', image: '/Walk-inCooler&Freezer/coolerswithfloor.jpg' },
  { name: 'Walk-in freezer units', image: '/Walk-inCooler&Freezer/walk-infreezerunits.jpg' },
  { name: 'Freezers with floor', image: '/Walk-inCooler&Freezer/freezerswithfloor.jpg' },
  { name: 'Combo units', image: '/Walk-inCooler&Freezer/combounits.jpg' },
  { name: 'Portable refrigeration', image: '/Walk-inCooler&Freezer/portableRefrigeration.jpg' },
  { name: 'Drive-in coolers freezers', image: '/Walk-inCooler&Freezer/drive-inCoolersFreezers.jpg' },
  { name: 'New cooler / freezer doors', image: '/Walk-inCooler&Freezer/NewCooler.jpg' },
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

      <div className="pt-32 pb-20 md:pt-44 md:pb-24">
        <div className="container px-4">
          {/* Header Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight uppercase">
              Walk-in <span className="text-primary">Cooler & Freezer</span>
            </h1>
          </div>

          {/* Main Grid Section */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 mb-24 md:mb-32">
            {productCategories.map((product, index) => (
              <Link
                key={index}
                href={`/walk-in-cooler-freezer/${product.name.toLowerCase().replace(/ \/ /g, '-').replace(/ /g, '-')}`}
                className="group flex flex-col bg-white border border-gray-100 rounded-2xl hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 overflow-hidden text-center items-center"
              >
                {/* Image Area */}
                <div className="p-3 bg-white w-full">
                  <div className="relative pt-[100%] rounded-xl bg-gray-50 overflow-hidden border border-gray-50">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="size-full absolute top-0 start-0 object-contain transition-transform duration-700 ease-in-out p-4 group-hover:scale-110"
                    />
                  </div>
                </div>

                {/* Content Area */}
                <div className="px-3 pb-4 pt-1 flex flex-col flex-grow">
                  <h3 className="text-[11px] md:text-[13px] font-black text-gray-900 leading-tight uppercase tracking-tight group-hover:text-primary transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          {/* Content Section - Redesigned with Preline Card Patterns */}
          <div className="space-y-16">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-start">
              <div className="space-y-6">
                <h2 className="text-2xl md:text-4xl font-black text-gray-900 uppercase tracking-tight">Shop Coolers & Freezers</h2>
                <div className="space-y-4 text-gray-600 leading-relaxed font-medium">
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
              </div>

              <div className="bg-gray-50 border border-gray-100 rounded-3xl p-8 md:p-10">
                <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight">Why Choose ICEMANZ?</h2>
                <ul className="space-y-4">
                  {reasons.slice(0, 6).map((reason, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="text-primary w-4 h-4" />
                      </div>
                      <span className="text-[15px] text-gray-700 font-bold">{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-[#004a99] bg-gradient-to-r from-primary to-blue-800 rounded-3xl p-8 md:p-16 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative z-10 grid md:grid-cols-3 gap-12">
                <div className="md:col-span-2">
                  <h2 className="text-2xl md:text-4xl font-black mb-6 uppercase tracking-tight leading-tight">Types of Commercial Coolers We Offer</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                    {coolerTypes.map((type, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                        <span className="text-[15px] font-bold text-blue-50">{type}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col justify-center gap-6">
                  <p className="text-blue-100 font-medium text-lg leading-relaxed">
                    Need a personalized solution? Our experts help you find the perfect fit.
                  </p>
                  <Link href="/quote" className="inline-flex items-center justify-center gap-2 bg-white text-primary px-8 py-4 rounded-xl font-black uppercase tracking-widest text-sm shadow-xl shadow-black/20 hover:bg-blue-50 transition-all active:scale-95 group">
                    Get a Custom Quote <ArrowRight className="group-hover:translate-x-1 transition-transform w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <h2 className="text-2xl md:text-4xl font-black text-gray-900 uppercase tracking-tight">Used Commercial Refrigeration</h2>
                <div className="space-y-4 text-gray-600 leading-relaxed font-medium">
                  <p>
                    There are a number of reasons to invest in a used commercial refrigerator. Perhaps the most obvious one is that it can save your business money. Commercial refrigerators are expensive to purchase new, but you can often find them at a fraction of the cost if you buy them used.
                  </p>
                  <p>
                    Another reason to buy a used commercial refrigerator is that it can help you reduce your environmental impact. Refrigerators use a lot of energy, and new ones are even more energy-intensive than used ones. Buying a used refrigerator is a great way to reduce your company's carbon footprint.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <div className="p-6 border border-gray-100 rounded-3xl bg-white shadow-sm hover:shadow-xl transition-all group">
                  <Zap className="size-8 text-primary mb-4" />
                  <h4 className="text-base font-black text-gray-900 mb-2 uppercase tracking-tight">Fast Installation</h4>
                  <p className="text-sm text-gray-500 font-medium">Modular designs that can be set up in any space quickly.</p>
                </div>
                <div className="p-6 border border-gray-100 rounded-3xl bg-white shadow-sm hover:shadow-xl transition-all group">
                  <ShieldCheck className="size-8 text-primary mb-4" />
                  <h4 className="text-base font-black text-gray-900 mb-2 uppercase tracking-tight">Quality Tested</h4>
                  <p className="text-sm text-gray-500 font-medium">All used equipment undergoes rigorous testing before sale.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
