const services = [
  {
    title: 'Installation',
    description: 'ICEMANZ provides professional installation for walk-in coolers, walk-in freezers, refrigeration units, and HVAC systems. Our skilled team ensures every system is set up for maximum efficiency, reliability, and long-term performance. From delivery to final testing, we make your installation seamless and worry-free.',
    image: '/slider/s_1.jpeg'
  },
  {
    title: 'Maintenance and After Sales Service',
    description: 'Maximize uptime and boost efficiency with ICEMANZ’s expert maintenance and rapid aftersales support. Stay cool, stay confident — contact us today for hassle-free service!',
    image: '/slider/s_2.jpeg'
  },
  {
    title: 'Engineering Design and Application',
    description: 'At ICEMANZ, every cooler and freezer is backed by smart engineering and real-world expertise. We provide custom designs, accurate load calculations, and professional application support to ensure your system performs at its best. From planning to installation, our team delivers tailored solutions, seamless integration, and ongoing technical guidance you can trust.',
    image: '/slider/s_3.jpeg'
  }
];

export default function Services() {
  return (
    <section className="py-10 md:py-16 bg-white">
      <div className="container px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-8 md:mb-12">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase flex items-center justify-center gap-3">
            <span className="text-[#171717]">Our</span>
            <span className="text-primary">Services</span>
          </h2>
          <div className="h-1.5 w-16 bg-accent mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Services List */}
        <div className="space-y-16 md:space-y-24">
          {services.map((service, index) => (
            <div key={index} className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 items-center">
              <div className={`relative h-[300px] md:h-[450px] overflow-hidden rounded-2xl md:rounded-[40px] shadow-2xl group ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                <div className="mb-6 md:mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-8 h-[2px] bg-accent"></span>
                    <span className="text-accent font-bold text-[10px] md:text-sm uppercase tracking-[0.2em]">
                      Service 0{index + 1}
                    </span>
                  </div>
                  <h3 className="text-xl md:text-3xl font-black text-primary tracking-tight leading-tight mb-4 uppercase">
                    {service.title}
                  </h3>
                </div>

                <div className="relative mb-8">
                  <p className="text-[13px] md:text-base text-gray-600 leading-relaxed font-medium max-w-xl">
                    {service.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
