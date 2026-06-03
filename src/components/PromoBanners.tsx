import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const PromoBanners = () => {
  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Banner */}
        <div className="relative overflow-hidden bg-[#111111] rounded-xl group min-h-[320px] flex items-center">
          {/* Background Image */}
          <div className="absolute right-0 top-0 bottom-0 w-[65%] transition-transform duration-700 group-hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-r from-[#111111] via-[#111111]/90 to-transparent z-10"></div>
            <Image
              src="/Walk-in-Cooler-Freezer/combounits.jpg"
              alt="Walk-in Coolers"
              fill
              className="object-cover object-right opacity-80"
            />
          </div>

          {/* Content */}
          <div className="relative z-20 pl-8 md:pl-12 py-10 w-[70%]">
            <h3 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-white leading-[1.1] tracking-tight mb-3">
              Walk-in Coolers<br />& Freezers
            </h3>
            <p className="text-[#ffb800] text-sm md:text-base font-medium mb-8 flex items-center gap-1.5">
              <span className="text-gray-300 font-normal">Custom Sizes -</span> Now 15% Savings
            </p>
            <Link
              href="/walk-in-cooler-freezer"
              className="inline-block bg-[#ffb800] text-black text-sm font-bold uppercase tracking-wider px-8 py-3.5 rounded-full hover:bg-white hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(255,184,0,0.4)] hover:shadow-[0_0_20px_rgba(255,255,255,0.6)]"
            >
              Shop Now
            </Link>
          </div>
        </div>

        {/* Right Banner */}
        <div className="relative overflow-hidden bg-[#111111] rounded-xl group min-h-[320px] flex items-center">
          {/* Background Image */}
          <div className="absolute right-0 top-0 bottom-0 w-[65%] transition-transform duration-700 group-hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-r from-[#111111] via-[#111111]/90 to-transparent z-10"></div>
            <Image
              src="/category/refrigerationEquipment/packageUnit.jpg"
              alt="Refrigeration Equipment"
              fill
              className="object-cover object-right opacity-80"
            />
          </div>

          {/* Content */}
          <div className="relative z-20 pl-8 md:pl-12 py-10 w-[70%]">
            <h3 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-white leading-[1.1] tracking-tight mb-3">
              Refrigeration<br />Equipment
            </h3>
            <p className="text-[#ffb800] text-sm md:text-base font-medium mb-8 flex items-center gap-1.5">
              <span className="text-gray-300 font-normal">Take an Extra</span> $50 Off Every Monday
            </p>
            <Link
              href="/refrigeration-equipment"
              className="inline-block bg-[#ffb800] text-black text-sm font-bold uppercase tracking-wider px-8 py-3.5 rounded-full hover:bg-white hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(255,184,0,0.4)] hover:shadow-[0_0_20px_rgba(255,255,255,0.6)]"
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
