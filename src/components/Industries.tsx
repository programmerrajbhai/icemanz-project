import { Utensils, ShoppingBasket, Box, Hotel, Stethoscope, Star } from 'lucide-react';

const sectors = [
  {
    title: 'RESTAURANTS',
    description: 'Walk-ins sized for every kitchen, from cafes to large restaurant groups',
    icon: Utensils,
  },
  {
    title: 'SUPERMARKETS',
    description: 'Glassdoor display and walk-in systems for retail environments',
    icon: ShoppingBasket,
  },
  {
    title: 'WAREHOUSES',
    description: 'Large-scale drive-in coolers for high-volume cold storage',
    icon: Box,
  },
  {
    title: 'HOSPITALITY',
    description: 'Hotel kitchens, banquet facilities, and full F&B programs',
    icon: Hotel,
  },
  {
    title: 'HEALTHCARE',
    description: 'Precision temperature control for pharmaceutical and medical storage',
    icon: Stethoscope,
  },
  {
    title: 'CUSTOM',
    description: 'Fully custom-engineered solutions for unique project requirements',
    icon: Star,
  },
];

export default function Industries() {
  return (
    <section className="py-24 bg-white text-gray-900 overflow-hidden relative">
      <div className="container px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-20">
          <div className="flex items-center justify-center gap-x-3 mb-6">
            <div className="w-8 h-px bg-primary/20"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Industries Served</span>
            <div className="w-8 h-px bg-primary/20"></div>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tight leading-[0.9] mb-8">
            ONE SYSTEM. <br />
            <span className="text-accent">EVERY SECTOR.</span>
          </h2>

          <div className="flex justify-center">
            <div className="size-8 rounded-full border border-primary/10 flex items-center justify-center">
              <div className="size-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(0,74,153,0.3)]"></div>
            </div>
          </div>
        </div>

        {/* Sectors Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {sectors.map((item, index) => (
            <div 
              key={index}
              className="flex flex-col items-center text-center p-6 md:p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:border-primary/20 hover:bg-white hover:shadow-xl transition-all duration-500 group"
            >
              <div className="size-16 rounded-3xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-500 border border-primary/20 group-hover:bg-primary group-hover:text-white shadow-sm shadow-primary/5 group-hover:shadow-xl group-hover:shadow-primary/20">
                <item.icon className="size-7 text-primary group-hover:text-white transition-colors" strokeWidth={2} />
              </div>

              <h3 className="text-sm font-black uppercase tracking-widest mb-3 text-gray-900 group-hover:text-primary transition-colors">
                {item.title}
              </h3>

              <p className="text-[10px] leading-relaxed text-slate-500 font-medium group-hover:text-slate-600 transition-colors">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 size-[600px] bg-primary/[0.03] rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 size-[600px] bg-accent/[0.03] rounded-full blur-[120px] pointer-events-none"></div>
    </section>
  );
}
