import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const productCategories = [
  { name: 'Walk-In Cooler No Floor', image: '/Walk-in-Cooler-Freezer/walkincoolers.jpg', slug: 'walk-in-cooler-no-floor' },
  { name: 'Walk-In Cooler with Floor', image: '/Walk-in-Cooler-Freezer/coolerswithfloor.jpg', slug: 'walk-in-cooler-with-floor' },
  { name: 'Walk-In Freezer With Floor', image: '/Walk-in-Cooler-Freezer/freezerswithfloor.jpg', slug: 'walk-in-freezer-with-floor' },
  { name: 'Walk-In Combo (Cooler & Freezer)', image: '/Walk-in-Cooler-Freezer/combounits.jpg', slug: 'walk-in-combo-cooler-freezer' },
];

const reasons = [
  'High-density polyurethane insulation for maximum efficiency',
  'Customizable sizes and configurations for any space',
  'Durable construction for heavy commercial use',
  'Energy-saving technology for lower operating costs',
  'Quick ship options available for urgent needs',
  'Cam-lock panel systems for easy installation',
  'Expert engineering and design support',
  'Industry-leading warranty and after-sales service'
];

const equipmentTypes = [
  'Indoor Walk-in Coolers',
  'Outdoor Walk-in Freezers',
  'Combo Cooler/Freezer Units',
  'Glass Door Display Coolers',
  'Drive-in Cold Storage',
  'Custom Shape Walk-ins',
  'Floorless Cooler Models',
  'Reinforced Floor Freezers',
  'Quick Ship Standard Sizes'
];

export default function WalkInCoolerFreezerPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Header />

      <div className="pt-32 pb-20 md:pt-44 md:pb-24 grow">
        <div className="container px-4">
          {/* Header Bar */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-[#1f2937] tracking-tight">
              Walk-in Cooler <span className="text-[#004a99]">& Freezer</span>
            </h1>
          </div>

          {/* Main Grid Section */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 justify-center items-center gap-4 md:gap-5 lg:gap-6 mb-24">
            {productCategories.map((product, index) => (
              <Link
                key={index}
                href={`/walk-in-cooler-freezer/${product.slug}`}
                className='block w-full h-full group'
              >
                {/* Image Area */}
                <div className="w-full relative aspect-square rounded-sm overflow-hidden mb-4 border border-gray-100 shadow-sm">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                  />
                </div>

                {/* Content Area */}
                <div className="px-1 pb-1 flex flex-col justify-center">
                  <h3 className="text-[13px] uppercase sm:text-xl font-bold text-gray-800 group-hover:text-[#004a99] transition-colors leading-snug">
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
                <h2 className="text-2xl font-bold md:text-3xl text-gray-900">Shop Walk-in Coolers & Freezers</h2>
                <div className="space-y-4 text-base sm:text-lg text-gray-700">
                  <p>
                    Premium walk-in coolers and freezers are essential for preserving inventory and maintaining food safety in commercial foodservice operations. At ICEMANZ, we provide top-quality modular cold storage solutions built for maximum efficiency and durability.
                  </p>
                  <p>
                    Whether you need a simple indoor cooler without a floor, a heavy-duty outdoor freezer, or a custom combination unit, our selection meets every demand. We utilize advanced insulation and cam-lock panel technology to ensure a tight seal and easy installation.
                  </p>
                  <p>
                    Our expert team will help you configure the exact dimensions, door placements, and refrigeration systems required for your business. Browse our categories above to find the perfect walk-in solution for your facility.
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
                  <h2 className="text-2xl font-bold md:text-3xl mb-6 leading-tight text-white">Types of Walk-ins We Offer</h2>
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
                    Need a custom size or technical advice on your cold storage?
                  </p>
                  <Link href="/quote" className="inline-flex items-center justify-center gap-2 bg-white text-primary px-8 py-4 rounded-sm font-semibold text-sm shadow-xl shadow-black/20 hover:bg-blue-50 transition-all active:scale-95 group">
                    Get a Custom Quote <ArrowRight className="group-hover:translate-x-1 transition-transform w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      
    </main>
  );
}