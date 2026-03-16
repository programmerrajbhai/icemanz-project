import { Truck, ShieldCheck, Settings, Users, Ruler, Globe } from 'lucide-react';

const features = [
  {
    icon: Truck,
    title: 'Ready to Ship in 36-48h',
    description: 'Fast delivery so you can get up and running quickly. We prioritize your business timeline.',
  },
  {
    icon: Settings,
    title: 'Modular Cam-Lock Panels',
    description: 'Simple assembly and flexible layout options for any space, large or small.',
  },
  {
    icon: Ruler,
    title: 'Sizes from 5’ to 40’',
    description: 'Customizable to fit any space. Tailored to your business needs.',
  },
  {
    icon: ShieldCheck,
    title: '10-Year Panel Warranty',
    description: 'Dependable quality you can trust. Our units are built to last.',
  },
  {
    icon: Globe,
    title: 'Fully Compliant',
    description: 'Meets NSF, UL, DOE, and ASTM standards for safety and efficiency.',
  },
  {
    icon: Users,
    title: 'Professional Support',
    description: 'Expert guidance through the entire process, from design to installation.',
  }
];

export default function Features() {
  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden relative">
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 md:w-96 h-64 md:h-96 bg-primary opacity-5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 md:w-96 h-64 md:h-96 bg-accent opacity-5 rounded-full blur-3xl"></div>
      
      <div className="container relative z-10 px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 md:mb-6 tracking-tight">
            Why Choose <span className="text-primary">ICEMANZ®</span>?
          </h2>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            We specialize in high-efficiency walk-in coolers and freezers designed to meet the unique needs of your business.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {features.map((feature, index) => (
            <div key={index} className="flex gap-6 group">
              <div className="flex-shrink-0 bg-secondary p-5 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all duration-300 transform group-hover:-translate-y-2 shadow-sm group-hover:shadow-lg">
                <feature.icon size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
