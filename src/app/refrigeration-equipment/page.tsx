import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CTA from '@/components/CTA';
import {
  Snowflake,
  Droplets,
  Layers,
  Cpu,
  Wind,
  ThermometerSnowflake,
  Thermometer,
  Zap,
  ArrowDown,
  Wifi,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

const systems = [
  {
    title: "Ammonia Refrigerators",
    description: "Ammonia refrigerators are large, industrial-strength units. They are mostly used in food processing plants and warehouses because of their ability to maintain very low temperatures (-40°F). They work by using an ammonia solution to remove heat from the air inside the fridge.",
    icon: Zap,
    color: "bg-blue-50 text-blue-600"
  },
  {
    title: "Blast Freezing Equipment",
    description: "Blast freezing equipment is used to rapidly freeze large quantities of food. This type of refrigeration is often used in the seafood industry, as it can preserve the quality and taste of fish and other seafood. Blast freezing can also be used to quick-freeze other products, like meat, fruits, and vegetables.",
    icon: Snowflake,
    color: "bg-cyan-50 text-cyan-600"
  },
  {
    title: "Chillers",
    description: "Chillers are used to cool liquids, like water or oil. They work by circulating the liquid through a series of tubes in the chiller unit. Chillers are often used in factories and laboratories, as they can cool large quantities of liquid quickly and evenly.",
    icon: Droplets,
    color: "bg-blue-50 text-blue-600"
  },
  {
    title: "Compressor Racks",
    description: "Compressor racks are a type of commercial refrigeration system that uses multiple compressors to cool a large area. Compressor racks are often used in supermarkets, as they can efficiently cool a large space.",
    icon: Layers,
    color: "bg-indigo-50 text-indigo-600"
  },
  {
    title: "Compressors for a Walk-In Cooler",
    description: "A walk-in cooler unit is a large, commercial refrigeration machine that can be used to store food or other products. They work by circulating cold air through the unit, using a commercial refrigeration compressor. Walk-in cooler refrigeration units are often used in restaurants, grocery stores, and warehouses.",
    icon: Cpu,
    color: "bg-slate-50 text-slate-600"
  },
  {
    title: "Condensing Units",
    description: "Condensing units are a type of commercial refrigeration system that uses a compressor to cool air. The compressor circulates the air through a series of coils, which remove heat from the air. Condensing units are often used in office buildings, hotels, and hospitals.",
    icon: Wind,
    color: "bg-sky-50 text-sky-600"
  },
  {
    title: "Evaporators",
    description: "Evaporators are used to remove water from the air. They work by circulating the air through a series of coils, which remove moisture from the air. Evaporators are often used in factories, greenhouses, and laboratories.",
    icon: ThermometerSnowflake,
    color: "bg-blue-50 text-blue-600"
  },
  {
    title: "Low-Temperature Systems",
    description: "Low-temperature systems are commercial refrigeration units that can maintain very low temperatures, like -40°F. They work by using a compressor to circulate the air through a series of coils, which remove heat from the air. Low-temperature systems are often used in food processing plants and warehouses.",
    icon: ArrowDown,
    color: "bg-blue-100 text-blue-700"
  },
  {
    title: "Medium-Temperature Systems",
    description: "Medium-temperature systems are commercial refrigeration units that can maintain temperatures between -40°F and 0°F. They work by using a compressor to circulate the air through a series of coils, which remove heat from the air. Medium-temperature systems are often used in restaurants and grocery stores.",
    icon: Thermometer,
    color: "bg-orange-50 text-orange-600"
  },
  {
    title: "Remote Condensers",
    description: "Remote condensers are a type of commercial refrigeration system that uses a compressor to cool air. The compressor circulates the air through a series of coils, which remove heat from the air. Remote condensers are often used in office buildings, hotels, and hospitals.",
    icon: Wifi,
    color: "bg-gray-50 text-gray-600"
  }
];

export default function RefrigerationEquipment() {
  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 md:pt-48 md:pb-32 bg-slate-900 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/10 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-accent/5 to-transparent"></div>

        <div className="container relative z-10 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-tight mb-8">
              Commercial <span className="text-accent">Refrigeration</span> <br className="hidden md:block" /> Systems
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
              Refrigeration systems are vital for many businesses across diverse industries.
              They preserve products, materials, and ingredients by maintaining the proper
              temperatures for every item. ICEMANZ offers the highest quality equipment
              to ensure your business stays cool and efficient.
            </p>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center mb-16 md:mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
              The Perfect Cooling Solution for Your Business
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              In order to choose the best system for your business, you must understand the
              different types of refrigeration systems and how they differ. At ICEMANZ,
              we offer an expansive catalog of commercial refrigeration units, including
              everything from industrial ammonia refrigerators to specialized blast freezing equipment.
            </p>
          </div>

          {/* Systems Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {systems.map((system, index) => (
              <div
                key={index}
                className="group p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
              >
                {/* Accent line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-slate-100 group-hover:bg-primary transition-colors"></div>

                <div className={`w-14 h-14 ${system.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                  <system.icon size={28} />
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors">
                  {system.title}
                </h3>

                <p className="text-slate-600 leading-relaxed mb-6 text-sm">
                  {system.description}
                </p>

                <Link
                  href="/quote"
                  className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:gap-3 transition-all"
                >
                  Learn More <ChevronRight size={16} />
                </Link>
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
