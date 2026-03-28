import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CTA from '@/components/CTA';
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

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 md:pt-36 md:pb-16 bg-[#0a0a0a] overflow-hidden border-b border-gray-100">
        <div className="absolute inset-0">
          <img src="/slider/s_1.jpeg" alt="Background" className="w-full h-full object-cover opacity-25 scale-110 md:scale-105" />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
        </div>

        <div className="container relative z-10 px-4">
          <div className="flex flex-col items-center text-center gap-4 md:gap-6">
            <nav className="flex items-center justify-center gap-2 md:gap-3">
              <Link href="/" className="text-[9px] md:text-[10px] font-black text-white/40 hover:text-accent transition-colors uppercase tracking-[0.2em] md:tracking-[0.3em]">Home</Link>
              <div className="w-1 h-1 rounded-full bg-accent/50"></div>
              <span className="text-[9px] md:text-[10px] font-black text-accent uppercase tracking-[0.2em] md:tracking-[0.3em]">Walk-in Cooler & Freezer</span>
            </nav>

            <div className="relative inline-block px-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter leading-[1] md:leading-[0.9] drop-shadow-2xl">
                Walk-in <br />
                <span className="text-accent">Cooler & Freezer</span>
              </h1>
              <div className="h-1 w-16 md:h-1.5 md:w-24 bg-accent mx-auto mt-4 md:mt-6 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid Section */}
      <section className="py-8 md:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12 md:gap-x-12 md:gap-y-16 mb-12 md:mb-20">
            {productCategories.map((product, index) => (
              <Link
                key={index}
                href={`/walk-in-cooler-freezer/${product.name.toLowerCase().replace(/ \/ /g, '-').replace(/ /g, '-')}`}
                className="group flex flex-col items-center transition-all duration-500 hover:-translate-y-2 cursor-pointer"
              >
                <div className="relative w-full aspect-square bg-white flex items-center justify-center overflow-hidden mb-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-100 rounded-3xl group-hover:shadow-2xl group-hover:shadow-slate-200/60 transition-all duration-500">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-[80%] max-w-[80%] object-contain transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <h3 className="text-[15px] md:text-[17px] font-extrabold text-slate-900 group-hover:text-primary transition-colors tracking-tight text-center leading-tight max-w-[220px]">
                  {product.name}
                </h3>
              </Link>
            ))}
          </div>

          {/* Content Section */}
          <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">
            <section>
              <h2 className="text-xl md:text-4xl font-black text-gray-900 mb-6 md:mb-8 uppercase tracking-tight">Shop Coolers & Freezers</h2>
              <div className="space-y-4 md:space-y-6 text-gray-600 leading-relaxed text-sm md:text-[15px] font-medium">
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
              <h2 className="text-xl md:text-4xl font-black text-gray-900 mb-6 md:mb-8 uppercase tracking-tight">Commercial Refrigerators for Sale</h2>
              <div className="space-y-4 md:space-y-6 text-gray-600 leading-relaxed text-sm md:text-[15px] font-medium">
                <p>
                  If you're looking for a commercial refrigerator for sale, there are a few things you need to know. Commercial freezers and coolers are an important investment for any business, big or small.
                </p>
                <p>
                  Not only do they maintain the quality of your stock, but they can also help you save money in the long-run. Here are 10 reasons why you should invest in a commercial refrigerator:
                </p>
                <ul className="space-y-3 md:space-y-4">
                  {reasons.map((reason, i) => (
                    <li key={i} className="flex gap-2 md:gap-3 items-start">
                      <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="text-primary w-3 h-3 md:w-3.5 md:h-3.5" />
                      </div>
                      <span className="text-sm md:text-base">{reason}</span>
                    </li>
                  ))}
                </ul>
                <p className="pt-2 md:pt-4">
                  However, you still must ensure that you choose the right type of refrigerator for your operations.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl md:text-4xl font-black text-gray-900 mb-6 md:mb-8 uppercase tracking-tight">Types of Commercial Coolers</h2>
              <div className="space-y-4 md:space-y-6 text-gray-600 leading-relaxed text-sm md:text-[15px] font-medium">
                <p>
                  At ICEMANZ, we offer an expansive selection of commercial refrigeration solutions that can be custom-fit to any space. But first, you must determine what you need; should you choose a/an:
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                  {coolerTypes.map((type, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm md:text-base">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                      {type}
                    </li>
                  ))}
                </ul>
                <p className="pt-2 md:pt-4">
                  Or do you require the personalized service of a <Link href="https://www.barrinc.com/quote-request/5868" className="text-primary font-bold hover:underline">Custom Package</Link>? Our refrigeration experts are help you find the perfect solution for your business.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl md:text-4xl font-black text-gray-900 mb-6 md:mb-8 uppercase tracking-tight">Used Commercial Refrigeration</h2>
              <div className="space-y-4 md:space-y-6 text-gray-600 leading-relaxed text-sm md:text-[15px] font-medium">
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

            <section className="bg-gray-50 p-6 md:p-12 rounded-2xl md:rounded-3xl text-center">
              <h2 className="text-xl md:text-3xl lg:text-4xl font-black text-gray-900 mb-4 md:mb-6 uppercase tracking-tight">Find the Best Commercial Coolers for Sale at ICEMANZ</h2>
              <p className="text-gray-600 text-base md:text-lg mb-6 md:mb-8 font-medium">
                To find or design the perfect cooler or freezer for your business, reach out to our team today.
              </p>
              <Link href="https://www.barrinc.com/quote-request/5868" className="inline-flex items-center gap-2 bg-primary text-white px-8 md:px-10 py-3 md:py-4 rounded-xl font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-transform group">
                Contact Us <ArrowRight className="group-hover:translate-x-1 transition-transform w-4.5 h-4.5 md:w-5 md:h-5" />
              </Link>
            </section>
          </div>
        </div>
      </section>

      <CTA />
      <Footer />
    </main>
  );
}
