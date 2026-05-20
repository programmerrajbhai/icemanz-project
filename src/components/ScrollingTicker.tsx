import React from 'react';

const tickerItems = [
  "WALK-IN COOLER & FREEZER",
  "WALK-IN COOLER NO FLOOR",
  "WALK-IN FREEZER WITH FLOOR",
  "WALK-IN COMBO COOLER FREEZER",
  "CONDENSING UNITS",
  "EVAPORATION UNITS",
  "COMBO UNITS / PACKAGE UNITS"
];

export default function ScrollingTicker() {
  return (
    <div className="bg-accent py-2 md:py-3 overflow-hidden relative select-none group border-y border-white/10">
      <div className="flex whitespace-nowrap animate-marquee group-hover:[animation-play-state:paused]">
        {/* First set of items */}
        <div className="flex shrink-0 items-center">
          {tickerItems.map((item, index) => (
            <div key={`first-${index}`} className="flex items-center">
              <span className="text-white text-[10px] md:text-[12px] font-black tracking-[0.2em] uppercase mx-6 md:mx-10">
                {item}
              </span>
              <div className="size-1 rounded-sm bg-white/40 mx-2 md:mx-4"></div>
            </div>
          ))}
        </div>
        {/* Second set of items for seamless loop */}
        <div className="flex shrink-0 items-center">
          {tickerItems.map((item, index) => (
            <div key={`second-${index}`} className="flex items-center">
              <span className="text-white text-[10px] md:text-[12px] font-black tracking-[0.2em] uppercase mx-6 md:mx-10">
                {item}
              </span>
              <div className="size-1 rounded-sm bg-white/40 mx-2 md:mx-4"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
