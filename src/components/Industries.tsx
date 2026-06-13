import { Utensils, ShoppingCart, Archive, Hotel, Stethoscope, Star, ArrowRight } from 'lucide-react';

const sectors = [
  {
    title: 'RESTAURANTS',
    description: 'Walk-ins sized for every kitchen, from cafes to large multi-unit groups.',
    footer: 'NSF / UL Approved',
    icon: Utensils,
  },
  {
    title: 'SUPERMARKETS',
    description: 'Anti-condensation display glass doors and multi-deck systems.',
    footer: 'Maximized Merchandising',
    icon: ShoppingCart,
  },
  {
    title: 'WAREHOUSES',
    description: 'Large-scale drive-in coolers for massive high-volume cold storage.',
    footer: 'ASTM E84 Compliant',
    icon: Archive,
  },
  {
    title: 'HOSPITALITY',
    description: 'Solutions for resort kitchens, banquet facilities, and large-scale F&B.',
    footer: 'Integrated Catering Systems',
    icon: Hotel,
  },
  {
    title: 'HEALTHCARE',
    description: 'Precise, medical-grade temperature arrays for sensitive pharma storage.',
    footer: 'NIST Traceable Monitoring',
    icon: Stethoscope,
  },
  {
    title: 'CUSTOM',
    description: 'Fully tailored, spatially complex engineering solutions for unique project requirements.',
    footer: 'Full CAD/BIM Support',
    icon: Star,
  },
];

export default function Industries() {
  return (
    <section className="py-24 bg-white text-gray-900 overflow-hidden relative font-sans">
      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-[1200px]">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 block">Target Industries</span>

          <h2 className="text-3xl md:text-4xl lg:text-[40px] font-black uppercase tracking-tight text-gray-900">
            ONE SYSTEM. <span className="text-[#0055ff]">EVERY SECTOR.</span>
          </h2>
        </div>

        {/* Sectors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {sectors.map((item, index) => (
            <div
              key={index}
              className="flex items-center p-5 md:p-6 rounded-3xl bg-white border border-gray-100 hover:border-[#0055ff]/20 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
              style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}
            >
              {/* Icon */}
              <div className="mr-4 shrink-0 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-[#0055ff]/10 blur-xl rounded-full group-hover:bg-[#0055ff]/20 transition-all duration-300"></div>
                <item.icon className="w-10 h-10 text-[#0a1526] group-hover:text-[#0055ff] transition-colors relative z-10" strokeWidth={1.5} />
              </div>

              {/* Content */}
              <div className="flex-1 pr-6">
                <h3 className="text-base font-bold text-gray-900 mb-1.5 group-hover:text-[#0055ff] transition-colors">
                  {item.title}
                </h3>
                <p className="text-[13px] text-gray-600 leading-relaxed mb-2.5">
                  {item.description}
                </p>
                <p className="text-[11px] font-bold text-gray-900">
                  {item.footer}
                </p>
              </div>

              {/* Arrow */}
              <div className="absolute bottom-6 right-6 opacity-20 group-hover:opacity-100 text-gray-400 group-hover:text-[#0055ff] transition-all duration-300 group-hover:translate-x-1">
                <ArrowRight size={16} strokeWidth={2} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
