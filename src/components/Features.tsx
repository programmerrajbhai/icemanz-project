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
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-white p-6 md:p-7 rounded-sm shadow-lg shadow-gray-200/60 border border-gray-100 flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl ${index === 1 ? 'transform md:-translate-y-3' : ''}`}>

              <div className={`relative w-14 h-14 rounded-sm flex items-center justify-center mb-5 ${index === 1 ? 'bg-primary text-white' : 'bg-gray-100 text-primary'}`}>
                <feature.icon size={28} strokeWidth={2} />
                {index === 1 && <div className="absolute -top-1.5 w-6 h-1 bg-accent rounded-sm"></div>}
              </div>

              <h3 className="font-bold text-base md:text-lg text-gray-900 uppercase tracking-wider mb-2">
                {feature.title}
              </h3>

              {index === 1 && <div className="w-6 h-0.5 bg-accent mb-3"></div>}

              <p className="text-gray-600 text-[13px] md:text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
