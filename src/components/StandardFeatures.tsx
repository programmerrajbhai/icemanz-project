import Image from 'next/image';

interface Feature {
  title: string;
  description: string;
  image: string;
}

const features: Feature[] = [
  {
    title: 'Heavy-Duty Deadbolt Handle Latch',
    description: 'Commercial-grade locking mechanism for maximum security and durability',
    image: '/Walk-in-Cooler-Freezer/details/handle-round_1.webp'
  },
  {
    title: 'Modular Panel Construction',
    description: 'Flexible design allows for easy installation and future expansion',
    image: '/Walk-in-Cooler-Freezer/details/Walkin-ModularPanelConstruction.webp'
  },
  {
    title: 'Spring Assisted Hinges',
    description: 'Self-closing hinges ensure door stays sealed after each use',
    image: '/Walk-in-Cooler-Freezer/details/walkin-SpringHinge-Kason.webp'
  },
  {
    title: 'Digital LED Thermometer & Switch',
    description: 'Precise temperature monitoring and control at your fingertips',
    image: '/Walk-in-Cooler-Freezer/details/Walk-in-DigitalTherm-Switch.webp'
  },
  {
    title: 'Heated Pressure-Relief Vent',
    description: 'Prevents vacuum seal and makes door opening effortless',
    image: '/Walk-in-Cooler-Freezer/details/Walkin-HeatPressureReliefVent.webp'
  },
  {
    title: 'Long-Life Extruded Polystyrene Foam',
    description: 'Superior insulation for energy efficiency and consistent temperatures',
    image: '/Walk-in-Cooler-Freezer/details/Walkin-PolystyreneFoam.webp'
  },
  {
    title: 'Door Closer',
    description: 'Ensures proper sealing and prevents energy loss from open doors',
    image: '/Walk-in-Cooler-Freezer/details/Door_Closer.webp'
  }
];

export default function StandardFeatures() {
  return (
    <section className="w-full bg-white">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col gap-1.5 mb-4">
          <h2 className="text-3xl font-bold  text-center text-[#12233F]">Standard Features</h2>

        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#D7DEE6] border border-[#D7DEE6]">
        {features.map((feature, index) => {
          return (
            <div
              key={index}
              className="bg-white p-7 flex flex-col gap-3.5 hover:bg-[#EDF1F5] transition-colors"
            >
              {/* Image Badge */}
              <div className="w-32 h-32 rounded-[10px] bg-white border border-[#D7DEE6] flex items-center justify-center overflow-hidden ">
                <div className="relative w-full h-full">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-[15.5px] font-bold  text-black leading-snug">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-[13px] text-[#6B7686] leading-relaxed">
                {feature.description}
              </p>
            </div>
          );
        })}

        {/* CTA Note - fills the last spot in the grid */}
        <div className="bg-[#EDF1F5] p-7 flex flex-col gap-3.5 items-start justify-center">
          <div className="w-11 h-11 rounded-[10px] bg-[#12233F] flex items-center justify-center">
            <svg
              className="text-white"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <line x1="9" y1="15" x2="15" y2="15" />
            </svg>
          </div>
          <h3 className="text-[15.5px] font-semibold text-[#25303C]">
            Need a full spec sheet?
          </h3>
          <p className="text-[13px] text-[#6B7686]">
            Ask your rep for complete technical documentation.
          </p>
        </div>
      </div>
    </section>
  );
}
