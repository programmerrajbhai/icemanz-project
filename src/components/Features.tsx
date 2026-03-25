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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`bg-white p-8 rounded-3xl shadow-lg shadow-gray-200/60 border border-gray-100 flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl ${index === 1 ? 'transform md:-translate-y-4' : ''}`}>
              
              <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${index === 1 ? 'bg-primary text-white' : 'bg-gray-100 text-primary'}`}>
                <feature.icon size={32} strokeWidth={2} />
                {index === 1 && <div className="absolute -top-2 w-8 h-1 bg-accent rounded-full"></div>}
              </div>

              <h3 className="font-bold text-lg text-gray-900 uppercase tracking-wider mb-3">
                {feature.title}
              </h3>

              {index === 1 && <div className="w-8 h-0.5 bg-accent mb-4"></div>}

              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
