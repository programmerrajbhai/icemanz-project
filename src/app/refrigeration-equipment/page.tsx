import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, ShieldCheck, Zap, Clock, Snowflake, ArrowRight, CheckCircle2, Settings } from 'lucide-react';

const productCategories = [
  { name: 'Condensing units', image: '/category/refrigerationEquipment/condensingUnit.jpg', slug: 'condensing-units' },
  { name: 'Medium profile (Scroll compressor)', image: '/category/refrigerationEquipment/mediumProfile.jpg', slug: 'medium-profile-scroll-compressor' },
  { name: 'Evaporation units', image: '/category/refrigerationEquipment/evaporationUnit.jpg', slug: 'evaporation-units' },
  { name: 'Combo units / package unit', image: '/category/refrigerationEquipment/packageUnit.jpg', slug: 'combo-unitspackage-units' },
  { name: 'Low profile evaporator', image: '/category/refrigerationEquipment/lowProfileEvaporator.jpg', slug: 'low-profile-evaporator' },
  { name: 'Medium profile', image: '/category/refrigerationEquipment/mediumProfile.jpg', slug: 'medium-profile' },
  { name: 'Center mount', image: '/category/refrigerationEquipment/centerMount.jpg', slug: 'center-mount' },
  { name: 'Thin profile evaporator', image: '/category/refrigerationEquipment/thinProfileEvaporator.jpg', slug: 'thin-profile-evaporator' },
];

const reasons = [
  'High-efficiency cooling systems for all industries',
  'Precision temperature and humidity control',
  'Energy-saving technology for lower operating costs',
  'Reliable performance in extreme environments',
  'Easy integration with existing systems',
  'Durable construction for long-term use',
  'Expert engineering and design support',
  'Comprehensive maintenance and after-sales service'
];

const equipmentTypes = [
  'Air Cooled Condensing Units',
  'Water Cooled Condensing Units',
  'Scroll Compressor Systems',
  'Semi-Hermetic Solutions',
  'Electric Defrost Evaporators',
  'Air Defrost Systems',
  'Low Profile Cooling Units',
  'Medium Profile Evaporators',
  'Thin Profile Systems'
];

export default function RefrigerationEquipmentPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="pt-32 pb-20 md:pt-44 md:pb-24">
        <div className="container px-4">
          {/* Header Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <h1 className="text-2xl md:text-[28px] font-bold text-[#1f2937] tracking-tight">
              Refrigeration <span className="text-[#004a99]">Equipment</span>
            </h1>
          </div>

          {/* Main Grid Section */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4 md:gap-5 lg:gap-6 mb-24 max-w-7xl">
            {productCategories.map((product, index) => (
              <Link
                key={index}
                href={`/refrigeration-equipment/${product.slug}`}
                className="group flex flex-col bg-white border border-gray-100 rounded-sm hover:shadow-lg hover:shadow-gray-200/40 transition-all duration-300 overflow-hidden text-center items-center p-3 sm:p-4"
              >
                {/* Image Area */}
                <div className="w-full relative pt-[90%] rounded-sm bg-gray-50/80 overflow-hidden mb-4 border border-gray-50">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain transition-transform duration-500 ease-in-out p-4 group-hover:scale-110"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                  />
                </div>

                {/* Content Area */}
                <div className="px-1 pb-1 flex flex-col justify-center min-h-[44px]">
                  <h3 className="text-[13px] sm:text-[14px] font-semibold text-gray-800 group-hover:text-[#004a99] transition-colors leading-snug">
                    {product.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          {/* Content Section */}
          <div className="space-y-16">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-start">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold md:text-3xl text-gray-900">Shop Refrigeration Equipment</h2>
                <div className="space-y-4 text-base sm:text-lg text-gray-700">
                  <p>
                    Quality refrigeration equipment is the backbone of any successful cold storage operation. At ICEMANZ, we provide high-performance condensing units, evaporation units, and specialized cooling solutions designed for maximum reliability and efficiency.
                  </p>
                  <p>
                    Whether you're looking for low-profile evaporators for tight spaces or powerful scroll compressor systems for industrial use, our selection covers every need. We partner with industry-leading brands to ensure you get the best technology for your business.
                  </p>
                  <p>
                    Our expert team is here to help you select the right components for your system, from air-cooled condensing units to custom-built package units. Browse our categories above to explore our full range of professional refrigeration equipment.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-100 rounded-sm p-8 md:p-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Choose ICEMANZ?</h2>
                <ul className="space-y-4">
                  {reasons.slice(0, 6).map((reason, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <div className="w-6 h-6 rounded-sm bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="text-primary w-4 h-4" />
                      </div>
                      <span className="text-base text-gray-800">{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Types Banner */}
            <div className="bg-[#004a99] bg-gradient-to-r from-primary to-blue-800 rounded-sm p-8 md:p-16 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-sm blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative z-10 grid md:grid-cols-3 gap-12">
                <div className="md:col-span-2">
                  <h2 className="text-2xl font-bold md:text-3xl mb-6 leading-tight text-white">Types of Refrigeration Equipment We Offer</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                    {equipmentTypes.map((type, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-sm bg-accent"></div>
                        <span className="text-base font-medium text-blue-50">{type}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col justify-center gap-6">
                  <p className="text-blue-100 text-base sm:text-lg">
                    Need technical advice on your next system upgrade?
                  </p>
                  <Link href="/quote" className="inline-flex items-center justify-center gap-2 bg-white text-primary px-8 py-4 rounded-sm font-semibold text-sm shadow-xl shadow-black/20 hover:bg-blue-50 transition-all active:scale-95 group">
                    Get Expert Advice <ArrowRight className="group-hover:translate-x-1 transition-transform w-5 h-5" />
                  </Link>
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
