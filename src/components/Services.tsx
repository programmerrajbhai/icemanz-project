import Link from 'next/link';
import {
  ArrowRight,
  Settings,
  ShieldCheck,
  Wrench,
  ThermometerSnowflake,
  Zap,
  Layout
} from 'lucide-react';

const services = [
  {
    title: 'Installation',
    description: 'ICEMANZ provides professional installation for walk-in coolers, walk-in freezers, refrigeration units, and HVAC systems. Our skilled team ensures every system is set up for maximum efficiency, reliability, and long-term performance.',
    image: '/slider/s_1.jpeg',
    icon: Zap
  },
  {
    title: 'Maintenance',
    description: 'Maximize uptime and boost efficiency with ICEMANZ’s expert maintenance and rapid aftersales support. Stay cool, stay confident — contact us today for hassle-free service!',
    image: '/slider/s_2.jpeg',
    icon: Wrench
  },
  {
    title: 'Engineering Design',
    description: 'At ICEMANZ, every cooler and freezer is backed by smart engineering. We provide custom designs, accurate load calculations, and professional application support to ensure your system performs at its best.',
    image: '/slider/s_3.jpeg',
    icon: Layout
  },
  {
    title: 'Smart Cooling',
    description: 'Advanced temperature control and monitoring systems to keep your products safe and energy costs low. Integration with modern smart building protocols.',
    image: '/products/product_1.jpg',
    icon: ThermometerSnowflake
  }
];

export default function Services() {
  return (
    <section id="services" className="py-12 md:py-16 bg-white overflow-hidden">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-16">
          {/* Image Grid with Animation */}
          <div className="flex-1 w-full max-w-2xl lg:max-w-none grid grid-cols-2 gap-3 md:gap-4 relative group">
            <div className="space-y-3 md:space-y-4">
              <div className="aspect-[4/5] rounded-[24px] md:rounded-[32px] overflow-hidden shadow-xl transform group-hover:-translate-y-2 transition-transform duration-700">
                <img src="/slider/s_1.jpeg" alt="ICEMANZ Facility" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-square rounded-[24px] md:rounded-[32px] overflow-hidden shadow-xl transform group-hover:translate-y-2 transition-transform duration-700 delay-100">
                <img src="/slider/s_2.jpeg" alt="Walk-in Cooler" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="pt-8 md:pt-12 space-y-3 md:space-y-4">
              <div className="aspect-square rounded-[24px] md:rounded-[32px] overflow-hidden shadow-xl transform group-hover:-translate-y-2 transition-transform duration-700 delay-200">
                <img src="/slider/s_3.jpeg" alt="Refrigeration Unit" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-[4/5] rounded-[24px] md:rounded-[32px] overflow-hidden shadow-xl transform group-hover:translate-y-2 transition-transform duration-700 delay-300">
                <img src="/products/product_1.jpg" alt="Installation Service" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          {/* Content with modern styling */}
          <div className="flex-1 space-y-6 md:space-y-10">
            <div className="space-y-4 md:space-y-6">
              <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-full font-bold text-xs md:text-sm uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                Professional Services
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#171717] leading-tight uppercase tracking-tighter">
                Smart Cooling <br className="hidden md:block" />
                <span className="text-primary">Tailored Solutions</span>
              </h2>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-xl font-medium">
                We don't just sell equipment; we provide end-to-end refrigeration excellence.
                From custom engineering to rapid installation, our team ensures your business
                stays cool and efficient.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
              {services.map((service, index) => (
                <div key={index} className="group/item space-y-3 md:space-y-4 p-4 md:p-6 rounded-2xl md:rounded-[24px] hover:bg-gray-50 transition-all duration-300 border border-transparent hover:border-gray-100">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white shadow-lg rounded-xl flex items-center justify-center text-primary group-hover/item:bg-primary group-hover/item:text-white transition-all duration-500">
                    <service.icon size={20} className="md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-[#171717] mb-1 md:mb-2">{service.title}</h3>
                    <p className="text-gray-500 text-[13px] md:text-sm leading-relaxed">{service.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 md:pt-6">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 md:px-10 py-3.5 md:py-4 rounded-xl font-bold text-sm md:text-base hover:bg-primary transition-all duration-300 shadow-xl shadow-gray-200 group/btn cursor-pointer"
              >
                Explore Our Services
                <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
