import { Wrench, Zap, Layout, ShieldCheck } from 'lucide-react';

const services = [
  {
    title: 'Installation',
    description: 'ICEMANZ provides professional installation for walk-in coolers, walk-in freezers, refrigeration units, and HVAC systems. Our skilled team ensures every system is set up for maximum efficiency, reliability, and long-term performance.',
    icon: Zap,
  },
  {
    title: 'Maintenance',
    description: 'Maximize uptime and boost efficiency with ICEMANZ’s expert maintenance and rapid aftersales support. Stay cool, stay confident—contact us today for hassle-free service!',
    icon: Wrench,
  },
  {
    title: 'Engineering Design',
    description: 'At ICEMANZ, every cooler and freezer is backed by smart engineering. We provide custom designs, accurate load calculations, and professional application support to ensure your system performs at its best.',
    icon: Layout,
  },
  {
    title: 'Smart Cooling',
    description: 'Advanced temperature control and monitoring systems to keep your products safe and energy costs low. Integration with modern smart building protocols.',
    icon: ShieldCheck,
  },
];

export default function Services() {
  return (
    <section className="py-24 md:py-32 bg-[#fafafa] overflow-hidden relative">
      {/* Subtle Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
      </div>

      <div className="container px-4 mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-20 md:mb-24">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 bg-white shadow-sm rounded-full border border-gray-100">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            <span className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.2em]">Our Services</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight uppercase leading-[1.05]">
            <span className="text-gray-900 block mb-2">Smart Cooling</span>
            <span className="text-primary relative inline-block">
              Tailored Solutions
              <div className="absolute -bottom-2 left-0 w-full h-1.5 bg-primary/10 rounded-full"></div>
            </span>
          </h2>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
          {services.map((service) => (
            <div
              key={service.title}
              className="p-10 md:p-12 rounded-[40px] bg-white border border-gray-100/50 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-10px_rgba(0,74,153,0.15)] hover:-translate-y-3 transition-all duration-700 flex flex-col items-center text-center group relative overflow-hidden"
            >
              {/* Card Accent Top */}
              <div className="absolute top-0 left-0 w-full h-2 bg-primary transform -translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-gray-50 text-primary flex items-center justify-center mb-8 md:mb-10 group-hover:bg-primary group-hover:text-white transition-all duration-500 transform group-hover:rotate-6 shadow-sm">
                <service.icon className="w-8 h-8 md:w-10 md:h-10 stroke-[1.5px]" />
              </div>
              
              <h3 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tight group-hover:text-primary transition-colors leading-none">
                {service.title}
              </h3>
              
              <div className="w-8 h-1 bg-primary/10 mt-6 group-hover:w-16 group-hover:bg-primary/30 transition-all duration-500 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
