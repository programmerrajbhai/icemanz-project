import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Marcus Rivera",
    role: "Owner",
    company: "Riverside Bistro, NY",
    initials: "MR",
    content: "ICEMANZ delivered our walk-in cooler two days ahead of schedule. The installation team was professional, and the system has been running flawlessly for eight months. Couldn't ask for more.",
    color: "bg-blue-500"
  },
  {
    name: "Sandra Park",
    role: "Operations Director",
    company: "Park's Market Chain",
    initials: "SP",
    content: "We expanded our supermarket cold storage with three glassdoor units from ICEMANZ. The engineering support they provided during design made the whole process seamless. Top-tier company.",
    color: "bg-cyan-500"
  },
  {
    name: "James Torres",
    role: "Facility Manager",
    company: "Cold Link Distribution",
    initials: "JT",
    content: "Drive-in freezer for our distribution center. ICEMANZ handled the engineering calculations, permitting support, and installation. The custom build was exactly as specified — on time and on budget.",
    color: "bg-orange-500"
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-blue-50/50 relative overflow-hidden">
      <div className="container px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-x-2 py-1 px-3 rounded-full bg-blue-100 text-blue-600 mb-4">
            <div className="w-4 h-px bg-blue-600"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Testimonials</span>
            <div className="w-4 h-px bg-blue-600"></div>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 uppercase tracking-tight leading-[1.1] mb-6">
            What Our <br />
            <span className="text-accent">Clients Say</span>
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <div 
              key={index}
              className="flex flex-col bg-white border border-gray-100 rounded-3xl p-8 md:p-10 shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 group relative"
            >
              <Quote className="absolute top-8 right-8 text-blue-50 size-12 group-hover:text-blue-100 transition-colors" />
              
              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-orange-400 text-orange-400" />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-600 font-medium leading-relaxed mb-8 flex-grow">
                "{item.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-6 border-t border-gray-50">
                <div className={`size-12 rounded-full ${item.color} flex items-center justify-center text-white font-black text-sm shrink-0 shadow-lg shadow-black/5`}>
                  {item.initials}
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-black text-gray-900 uppercase tracking-tight">{item.name}</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {item.role} <span className="mx-1">•</span> {item.company}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
