import { ShieldCheck, Zap, Settings } from 'lucide-react';

const features = [
  {
    icon: ShieldCheck,
    title: 'Reliable & Efficient',
    description: 'ICEMANZ is your trusted partner for reliable and efficient refrigeration systems—built for supermarkets, restaurants, retail outlets, and warehouses.'
  },
  {
    icon: Zap,
    title: 'Expert Support',
    description: 'We offer a complete, hassle-free experience with expert support at every step.'
  },
  {
    icon: Settings,
    title: 'One-Stop Shop',
    description: 'From design consultation to seamless installation, ICEMANZ is your one-stop shop for modern refrigeration.'
  }
];

export default function Features() {
  return (
    <section className="py-20 md:py-32 bg-[#f8f9fa] overflow-hidden relative">
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary opacity-10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-accent opacity-10 rounded-full blur-[120px]"></div>

      <div className="container relative z-10 px-4 md:px-6">
        <div className="text-center max-w-5xl mx-auto mb-10 md:mb-24">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight uppercase flex items-center justify-center gap-2 md:gap-3">
            <span className="text-[#171717]">Why Choose</span>
            <span className="text-primary">ICEMANZ</span>
          </h2>
          <div className="h-1 md:h-1.5 w-12 md:w-16 bg-accent mx-auto mt-4 md:mt-6 mb-6 md:mb-8 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-12 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 sm:p-12 md:p-14 rounded-[32px] md:rounded-[40px] shadow-2xl shadow-gray-200/50 border border-gray-100 hover:shadow-primary/10 transition-all duration-500 group hover:-translate-y-3 flex flex-col items-center text-center relative overflow-hidden"
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-full"></div>

              <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-50 border border-gray-100 rounded-[20px] md:rounded-[28px] flex items-center justify-center text-primary mb-6 md:mb-10 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-500 transform group-hover:scale-110">
                <feature.icon size={28} className="md:w-8 md:h-8" strokeWidth={1.5} />
              </div>

              <div className="mb-4 md:mb-6">
                <h3 className="text-lg md:text-3xl font-black text-[#171717] tracking-tight uppercase group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <div className="h-0.5 md:h-1 w-8 md:w-10 bg-accent/20 mx-auto mt-3 md:mt-4 group-hover:w-16 group-hover:bg-accent transition-all duration-500 rounded-full"></div>
              </div>

              <p className="text-sm md:text-lg text-gray-600 leading-relaxed font-bold">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
