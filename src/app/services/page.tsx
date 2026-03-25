import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CTA from '@/components/CTA';
import { 
  Wrench, 
  Settings, 
  PenTool, 
  ShieldCheck, 
  Truck, 
  Clock,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

const services = [
  {
    title: "Installation",
    description: "ICEMANZ provides professional installation for walk-in coolers, walk-in freezers, refrigeration units, and HVAC systems. Our skilled team ensures every system is set up for maximum efficiency, reliability, and long-term performance. From delivery to final testing, we make your installation seamless and worry-free.",
    icon: Truck,
    color: "bg-blue-50 text-primary",
    features: ["Walk-in Coolers & Freezers", "Refrigeration Units", "HVAC Systems", "Final Testing & Calibration"]
  },
  {
    title: "Maintenance and After Sales Service",
    description: "Maximize uptime and boost efficiency with ICEMANZ’s expert maintenance and rapid aftersales support. Our dedicated team is always ready to ensure your operations remain uninterrupted. Stay cool, stay confident — contact us today for hassle-free service!",
    icon: ShieldCheck,
    color: "bg-accent/10 text-accent",
    features: ["Rapid Aftersales Support", "Preventative Maintenance", "System Optimization", "24/7 Technical Assistance"]
  },
  {
    title: "Engineering Design and Application",
    description: "At ICEMANZ, every cooler and freezer is backed by smart engineering and real-world expertise. We provide custom designs, accurate load calculations, and professional application support to ensure your system performs at its best. From planning to installation, our team delivers tailored solutions, seamless integration, and ongoing technical guidance you can trust.",
    icon: PenTool,
    color: "bg-slate-100 text-slate-900",
    features: ["Custom System Design", "Accurate Load Calculations", "Professional Application Support", "Ongoing Technical Guidance"]
  }
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-40 pb-24 md:pt-48 md:pb-32 bg-slate-900 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/10 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-accent/5 to-transparent"></div>
        
        <div className="container relative z-10 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-tight mb-8">
              Our Professional <span className="text-accent">Services</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
              Comprehensive refrigeration and cooling solutions tailored to your business needs. 
              From smart engineering design to rapid maintenance support, we ensure your 
              operations stay cool and efficient.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container px-4">
          <div className="grid grid-cols-1 gap-16 md:gap-24">
            {services.map((service, index) => (
              <div 
                key={service.title} 
                className={`flex flex-col lg:flex-row items-center gap-12 ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Content */}
                <div className="flex-1 space-y-8">
                  <div className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center`}>
                    <service.icon size={32} />
                  </div>
                  
                  <div>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tight mb-6">
                      {service.title}
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-slate-700 font-bold">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <CheckIcon className="w-3 h-3 text-primary" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link 
                    href="https://www.barrinc.com/quote-request/5868" 
                    className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all group"
                  >
                    Get Started 
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {/* Decorative Visual Area */}
                <div className="flex-1 w-full max-w-2xl">
                  <div className="relative aspect-video rounded-[32px] overflow-hidden group shadow-2xl">
                    <img 
                      src={`/slider/s_${(index % 3) + 1}.jpeg`} 
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-8 left-8">
                      <div className="flex items-center gap-2 text-white font-bold uppercase tracking-widest text-xs">
                        <Clock size={14} className="text-accent" />
                        Reliable 24/7 Support
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTA />
      <Footer />
    </main>
  );
}

function CheckIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
