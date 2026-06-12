import Image from 'next/image';
import Link from 'next/link';

const PromoBanners = () => {
  return (
    <section className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Left Banner */}
        <div className="relative overflow-hidden bg-[#004a99] group min-h-[320px] md:min-h-[400px] flex items-center">
          {/* Background Image */}
          <div className="absolute right-0 top-0 bottom-0 w-[100%] transition-transform duration-700 group-hover:scale-105">
            <div className="absolute inset-0 z-10"></div>
            <Image
              src="/home/Refrigeration_warehouse_walk-in_…_202606042119.jpeg"
              alt="Walk-in Coolers"
              fill
              className="object-cover object-right opacity-80"
            />
          </div>

          {/* Content */}
          <div className="relative z-20 pl-8 md:pl-16 lg:pl-24 py-12 w-[80%] pointer-events-auto">
            <h3 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-white leading-[1.1] tracking-tight mb-3">
              Walk-in Coolers<br />& Freezers
            </h3>
            <p className="text-blue-200 text-sm md:text-base font-medium mb-8 flex items-center gap-1.5">
              <span className="text-white font-normal">Custom Sizes -</span> Now 15% Savings
            </p>
            <Link
              href="/walk-in-cooler-freezer"
              className="inline-block relative z-30 bg-white text-[#004a99] text-sm font-bold uppercase tracking-wider px-8 py-3.5 hover:bg-gray-100 hover:shadow-lg transition-all duration-300 shadow-md cursor-pointer"
            >
              Shop Now
            </Link>
          </div>
        </div>

        {/* Right Banner */}
        <div className="relative overflow-hidden bg-slate-900 group min-h-[320px] md:min-h-[400px] flex items-center">
          {/* Background Image */}
          <div className="absolute right-0 top-0 bottom-0 w-[100%] transition-transform duration-700 group-hover:scale-105">
            <div className="absolute inset-0 z-10"></div>
            <Image
              src="/home/Refrigeration_condensing_unit_wa…_202606091949.jpeg"
              alt="Refrigeration Equipment"
              fill
              className="object-cover object-right opacity-80"
            />
          </div>

          {/* Content */}
          <div className="relative z-20 pl-8 md:pl-16 lg:pl-24 py-12 w-[80%] pointer-events-auto">
            <h3 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-white leading-[1.1] tracking-tight mb-3">
              Refrigeration<br />Equipment
            </h3>
            <p className="text-slate-300 text-sm md:text-base font-medium mb-8 flex items-center gap-1.5">
              <span className="text-white font-normal">Take an Extra</span> $50 Off Every Monday
            </p>
            <Link
              href="/refrigeration-equipment"
              className="inline-block relative z-30 bg-white text-[#004a99] text-sm font-bold uppercase tracking-wider px-8 py-3.5 hover:bg-gray-100 hover:shadow-lg transition-all duration-300 shadow-md cursor-pointer"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanners;
