'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, ChevronRight, Settings2, ShieldCheck, Truck, Clock, Utensils, ShoppingCart, Box, Building2, Stethoscope, Star, Maximize2 } from 'lucide-react';

const IND = [
  ['Restaurants', 'NSF / UL approved', 'Walk-ins sized for every kitchen', 'Cafes to multi-unit groups. Most owners start with an 8×10 or 8×12.', ['Fits tight back-of-house layouts', 'Easy-clean, food-safe interiors', 'Combo units save floor space'], 'Walk-in cooler or combo unit'],
  ['Supermarkets', 'Maximized merchandising', 'Glass doors that stay clear', 'Anti-condensation display doors and multi-deck systems.', ['Customers see and reach products', 'Stock from behind the wall', 'Energy-saving glass panels'], 'Glass-door walk-in cooler'],
  ['Warehouses', 'ASTM E84 compliant', 'Drive-in cold storage at scale', 'Large coolers and freezers for high-volume pallets.', ['Wide drive-in doors for forklifts', 'Heavy-duty insulated floors', 'Engineering and permit support'], 'Large walk-in freezer'],
  ['Hospitality', 'Integrated catering systems', 'Resort kitchens and banquets', 'Reliable cold space for large food and beverage operations.', ['Separate cooler and freezer zones', 'Quick-ship for opening dates', 'Service plans for peak seasons'], 'Combo unit or multiple coolers'],
  ['Healthcare', 'NIST traceable monitoring', 'Precise temperatures for pharma', 'Medical-grade temperature control with traceable monitoring.', ['Tight, logged temperature range', 'Alarm and backup options', 'Calibration records on request'], 'Custom walk-in with monitoring'],
  ['Custom', 'Full CAD/BIM support', 'Odd shapes, tough sites', 'Engineered to your plans, from heat-load math to drawings.', ['CAD and BIM files included', 'Heat-load calculation', 'Design review with an engineer'], 'Custom build']
];

// Added original image paths to the products array
const PRODS = [
  ['Astra 12 × 13 Cooler, No Floor', 'CNF12X13', 'Box only', 6156, '/home/hf.jpeg'],
  ['Amerikooler 8 × 10 Quick Ship Cooler', 'QC081072N', 'Box only · Quick ship', 7999, '/home/hf2.jpeg'],
  ['Astra 8 × 12 Cooler, Remote', 'CNF8X12-RM', 'With refrigeration', 8976, '/home/hf3.jpeg'],
  ['Astra 8 × 15 Cooler, Remote', 'CNF8X15-RM', 'With refrigeration', 10202, '/home/hf4.jpeg'],
  ['Astra 8 × 13 Cooler, Top Mount', 'CNF8X13-TM', 'With refrigeration', 10904, '/home/hf5.jpeg'],
  ['Astra 12 × 12 Cooler, Top Mount', 'CNF12X12-TM', 'With refrigeration', 11366, '/home/hf.jpeg'],
  ['Astra 10 × 20 Cooler, Remote', 'CNF10X20-RM', 'With refrigeration', 12258, '/home/hf2.jpeg'],
  ['Astra 8 × 26 Cooler, Remote', 'CNF8X26-RM', 'With refrigeration', 13493, '/home/hf3.jpeg']
];

const TESTIMONIALS = [
  ['ICEMANZ delivered our walk-in cooler two days ahead of schedule. It has run flawlessly for eight months.', 'Marcus Rivera, Owner, Riverside Bistro, NY'],
  ['Their engineers supported the design of three glass-door units for our supermarket expansion.', "Sandra Park, Operations Director, Park's Market Chain"],
  ['Engineering, permitting help and installation for our drive-in freezer, on time and on budget.', 'James Torres, Facility Manager, Cold Link Distribution'],
  ['Energy costs dropped noticeably after we upgraded to ICEMANZ panels.', 'Elena Rodriguez, Procurement Lead, Metro Food Hall'],
  ['The combo unit gives my kitchen the right balance of freezer and cooler space.', 'David Chen, Head Chef, Golden Dragon Seafood']
];

const GALLERY_IMAGES = [
  { id: 1, src: '/home/hf.jpeg', alt: 'Walk-In Coolers' },
  { id: 2, src: '/home/hf2.jpeg', alt: 'Walk-In Freezers' },
  { id: 3, src: '/home/hf3.jpeg', alt: 'Combo Units' },
  { id: 4, src: '/home/hf4.jpeg', alt: 'Refrigeration Equipment' },
  { id: 5, src: '/home/hf5.jpeg', alt: 'Industrial Walk-In' }
];

export default function ClientHomeDesign() {
  const [boxType, setBoxType] = useState<'cooler' | 'freezer' | 'combo'>('cooler');
  const [refrigType, setRefrigType] = useState<'remote' | 'top'>('remote');
  const [width, setWidth] = useState(10);
  const [length, setLength] = useState(12);
  const [activeInd, setActiveInd] = useState(0);
  const [prodFilter, setProdFilter] = useState('all');
  const [ti, setTi] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTi((prev) => (prev + 1) % TESTIMONIALS.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const { priceStr, capacity, temp, right, left, top, door, unit } = useMemo(() => {
    const w = width; const l = length; const t = boxType;
    const h = 8, s = 6.2, c = 0.866, k = 0.5;

    const P = (x: number, y: number, z: number) => [
      200 + (x - y) * c * s * 0.95,
      150 + (x + y) * k * s * 0.95 - z * s * 0.95
    ];
    const p = (x: number, y: number, z: number) => {
      const a = P(x, y, z);
      return `${(a[0]).toFixed(1)},${(a[1] - ((w + l) * k * s * 0.95) / 2 + 20).toFixed(1)}`;
    };

    const polyPoints = (pts: number[][]) => pts.map(a => p(a[0], a[1], a[2])).join(' ');

    const topPts = polyPoints([[0, 0, h], [w, 0, h], [w, l, h], [0, l, h]]);
    const leftPts = polyPoints([[0, l, 0], [w, l, 0], [w, l, h], [0, l, h]]);
    const rightPts = polyPoints([[w, 0, 0], [w, l, 0], [w, l, h], [w, 0, h]]);
    const doorPts = polyPoints([[w * 0.3, l, 0], [w * 0.3 + 3.2, l, 0], [w * 0.3 + 3.2, l, 7], [w * 0.3, l, 7]]);
    const unitPts = refrigType === 'top' ? polyPoints([[w * 0.3, l * 0.3, h], [w * 0.3 + 3, l * 0.3, h], [w * 0.3 + 3, l * 0.3 + 3, h + 1.6], [w * 0.3, l * 0.3 + 3, h + 1.6]]) : '';

    const area = w * l;
    let pr = area * 42 + (2400 + area * 30);
    if (t === 'freezer') pr *= 1.35;
    if (t === 'combo') pr *= 1.25;
    if (refrigType === 'top') pr *= 1.06;

    const fmt = (n: number) => '$' + (Math.round(n / 50) * 50).toLocaleString();

    return {
      top: topPts, left: leftPts, right: rightPts, door: doorPts, unit: unitPts,
      priceStr: `${fmt(pr * 0.92)}–${fmt(pr * 1.08)}`,
      capacity: '~' + Math.max(1, Math.floor(area * 0.55 / 13.3)),
      temp: t === 'cooler' ? '35°F' : t === 'freezer' ? '−10°F' : '35°F / −10°F'
    };
  }, [width, length, boxType, refrigType]);

  const filteredProds = PRODS.filter(p => {
    const price = p[3] as number;
    if (prodFilter === 'all') return true;
    if (prodFilter === 's' && price < 10000) return true;
    if (prodFilter === 'm' && price >= 10000 && price <= 12500) return true;
    if (prodFilter === 'l' && price > 12500) return true;
    return false;
  });

  return (
    <div className="bg-[#F4F7FB] text-[#0F172A] font-sans selection:bg-[#2563EB] selection:text-white">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');
        .font-heading { font-family: 'Bricolage Grotesque', sans-serif; letter-spacing: -0.02em; }
        .font-body { font-family: 'Inter', sans-serif; }
        
        .compact-slider { -webkit-appearance: none; appearance: none; height: 6px; background: #E2E8F0; border-radius: 4px; outline: none; }
        .compact-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; border-radius: 50%; background: #2563EB; cursor: pointer; border: 3px solid white; box-shadow: 0 2px 5px rgba(37,99,235,0.4); }
        
        .btn-company {
          background-color: #2563EB;
          color: white;
          box-shadow: 0 8px 20px -6px rgba(37, 99, 235, 0.6);
          transition: all 0.3s ease;
        }
        .btn-company:hover {
          background-color: #1D4ED8;
          transform: translateY(-2px);
          box-shadow: 0 12px 24px -8px rgba(37, 99, 235, 0.8);
        }
      `}} />

      {/* --- 1. SUPER AMAZING BLUE HERO & CALCULATOR --- */}
      <section className="pt-28 md:pt-36 pb-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#0A1C27]">
        <div className="absolute top-[0%] right-[-5%] w-[600px] h-[600px] bg-[#2563EB] rounded-full blur-[140px] opacity-40 pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#004a99] rounded-full blur-[100px] opacity-50 pointer-events-none"></div>
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
          
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/10 border border-white/20 text-[#BFE3F2] font-bold text-xs uppercase tracking-widest mb-6 w-max backdrop-blur-sm shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#60A5FA] animate-pulse"></span> Factory Direct
            </div>
            
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.1] font-extrabold text-white mb-6">
              Build your walk-in.<br/>
              <span className="text-[#60A5FA]">See the price.</span>
            </h1>
            
            <p className="font-body text-[#9DB6C4] text-lg leading-relaxed mb-8 max-w-lg">
              Pick a type, drag the size, and get a ballpark cost, storage capacity and delivery time instantly.
            </p>
            
            <div className="flex flex-wrap gap-2.5 mb-10">
              {['Ships in 36–48 hrs', '10-Year Warranty', 'NSF / UL Approved'].map((chip, idx) => (
                <span key={idx} className="flex items-center gap-1.5 bg-[#0E2B3B]/60 border border-white/10 backdrop-blur-md rounded-md px-3 py-1.5 text-sm font-medium text-white shadow-sm">
                  <Check size={14} className="text-[#60A5FA]" /> {chip}
                </span>
              ))}
            </div>

            <Link href="#need" className="inline-flex items-center justify-center min-h-[52px] px-8 rounded-xl font-bold w-max text-sm tracking-wide bg-white text-[#2563EB] hover:bg-blue-50 hover:-translate-y-1 transition-all shadow-[0_10px_30px_rgba(255,255,255,0.2)]">
              Explore Categories <ArrowRight className="ml-2" size={18} />
            </Link>
          </div>

          <div className="lg:col-span-7 bg-white rounded-2xl shadow-[0_25px_60px_-10px_rgba(0,0,0,0.5)] border border-gray-100 overflow-hidden flex flex-col md:flex-row relative">
            
            <div className="w-full md:w-5/12 bg-[#F8FAFC] p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-100">
              <div className="w-full aspect-square flex items-center justify-center">
                <svg viewBox="0 0 400 230" className="w-[120%] h-[120%] drop-shadow-xl">
                  <polygon points={right} fill={boxType === 'freezer' ? '#93C5FD' : '#BFDBFE'} stroke="#1E3A8A" strokeWidth="2" strokeLinejoin="round" />
                  <polygon points={left} fill="#DBEAFE" stroke="#1E3A8A" strokeWidth="2" strokeLinejoin="round" />
                  <polygon points={top} fill="#ffffff" stroke="#1E3A8A" strokeWidth="2" strokeLinejoin="round" />
                  <polygon points={door} fill="#2563EB" stroke="#1E3A8A" strokeWidth="2" strokeLinejoin="round" />
                  {refrigType === 'top' && <polygon points={unit} fill="#1E3A8A" stroke="#1E3A8A" strokeWidth="2" strokeLinejoin="round" />}
                </svg>
              </div>
              <div className="grid grid-cols-2 gap-2 w-full mt-4">
                 <div className="bg-white rounded-lg p-2.5 text-center border border-gray-100 shadow-sm">
                   <small className="block text-[10px] uppercase font-bold text-[#64748B] tracking-wider mb-0.5">Pallets</small>
                   <b className="font-heading text-xl text-[#0F172A]">{capacity}</b>
                 </div>
                 <div className="bg-white rounded-lg p-2.5 text-center border border-gray-100 shadow-sm">
                   <small className="block text-[10px] uppercase font-bold text-[#64748B] tracking-wider mb-0.5">Temp</small>
                   <b className="font-heading text-xl text-[#0F172A]">{temp}</b>
                 </div>
              </div>
            </div>

            <div className="w-full md:w-7/12 p-6 md:p-8 flex flex-col bg-white">
              <div className="grid grid-cols-3 gap-1 bg-[#F1F5F9] p-1.5 rounded-xl mb-8">
                {['cooler', 'freezer', 'combo'].map((type) => (
                  <button key={type} onClick={() => setBoxType(type as any)} className={`py-2.5 rounded-lg font-bold text-sm capitalize transition-all ${boxType === type ? 'bg-white text-[#2563EB] shadow-sm border border-gray-200' : 'text-[#64748B] hover:text-[#0F172A]'}`}>
                    {type}
                  </button>
                ))}
              </div>

              <div className="space-y-6 mb-8">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="font-bold text-sm text-[#0F172A] uppercase tracking-wide">Width</label>
                    <span className="font-heading font-black text-[#2563EB] text-lg">{width} ft</span>
                  </div>
                  <input type="range" min="6" max="30" value={width} onChange={e => setWidth(+e.target.value)} className="w-full compact-slider" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="font-bold text-sm text-[#0F172A] uppercase tracking-wide">Length</label>
                    <span className="font-heading font-black text-[#2563EB] text-lg">{length} ft</span>
                  </div>
                  <input type="range" min="6" max="30" value={length} onChange={e => setLength(+e.target.value)} className="w-full compact-slider" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1.5 bg-[#F1F5F9] p-1.5 rounded-xl mb-8 mt-auto">
                <button onClick={() => setRefrigType('remote')} className={`py-2.5 rounded-lg font-bold text-xs sm:text-sm transition-all ${refrigType === 'remote' ? 'bg-white text-[#2563EB] shadow-sm border border-gray-200' : 'text-[#64748B] hover:text-[#0F172A]'}`}>Remote System</button>
                <button onClick={() => setRefrigType('top')} className={`py-2.5 rounded-lg font-bold text-xs sm:text-sm transition-all ${refrigType === 'top' ? 'bg-white text-[#2563EB] shadow-sm border border-gray-200' : 'text-[#64748B] hover:text-[#0F172A]'}`}>Top-Mount</button>
              </div>

              <div className="bg-[#0F172A] rounded-xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-lg">
                 <div className="text-center sm:text-left">
                   <small className="text-blue-300 text-[10px] font-bold uppercase tracking-widest block mb-0.5">Estimated Cost</small>
                   <b className="font-heading text-2xl text-white block leading-none">{priceStr}</b>
                 </div>
                 <Link href={`/quote?type=${boxType}&size=${width}x${length}&refrig=${refrigType}`} className="btn-company w-full sm:w-auto px-5 py-3 text-sm font-bold rounded-lg flex items-center justify-center gap-2">
                   Get Quote <ChevronRight size={16} />
                 </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 2. BLUE TRUST METRICS --- */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto -mt-12 relative z-20">
        <div className="bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] rounded-2xl p-6 shadow-xl grid grid-cols-2 md:grid-cols-4 gap-6 divide-x-0 md:divide-x divide-white/20">
          {[
            { t: '36–48 hrs', d: 'Quick-ship turnaround', ic: <Clock size={24} className="text-white" /> },
            { t: '10 Years', d: 'Panel warranty', ic: <ShieldCheck size={24} className="text-white" /> },
            { t: '50 States', d: 'Nationwide delivery', ic: <Truck size={24} className="text-white" /> },
            { t: '24/7', d: 'Engineering support', ic: <Settings2 size={24} className="text-white" /> }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center justify-center text-center px-2">
              <div className="mb-3">{item.ic}</div>
              <h4 className="font-heading text-xl font-black text-white mb-1">{item.t}</h4>
              <p className="text-blue-100 text-xs font-medium">{item.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- 3. THE 3 JOURNEYS --- */}
      <section id="need" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-12 text-center md:text-left">
          <h2 className="font-heading text-3xl md:text-4xl font-black text-[#0F172A] mb-3">What do you need to keep cold?</h2>
          <p className="text-[#475569] text-lg">Select a category to view models, sizes, and pricing.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {[
            { ic: '🥬', title: 'Walk-in cooler', desc: 'Holds food at about 35°F.', link: '/walk-in-cooler-freezer/walk-in-cooler-no-floor' },
            { ic: '🥩', title: 'Walk-in freezer', desc: 'Insulated floor. Holds at −10°F.', link: '/walk-in-cooler-freezer/walk-in-freezer-with-floor' },
            { ic: '❄️', title: 'Combo unit', desc: 'Cooler and freezer in one footprint.', link: '/walk-in-cooler-freezer/walk-in-combo-cooler-freezer' },
            { ic: '🛒', title: 'Glass-door', desc: 'Display for convenience stores.', link: '/glassdoor-walk-in-cooler' },
            { ic: '⚙️', title: 'Refrigeration', desc: 'Condensers and evaporators.', link: '/refrigeration-equipment' }
          ].map((card, idx) => (
            <Link key={idx} href={card.link} className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#2563EB] hover:shadow-lg transition-all duration-300 flex flex-col group">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center text-2xl mb-5 border border-blue-100">{card.ic}</div>
              <h3 className="font-heading text-lg font-bold text-[#0F172A] mb-2">{card.title}</h3>
              <p className="text-[#64748B] text-sm mb-8 flex-grow">{card.desc}</p>
              <span className="text-[#2563EB] text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                Browse <ArrowRight size={14}/>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* --- 4. B2B VERTICAL TABS FOR INDUSTRIES --- */}
      <section id="industry" className="py-20 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center md:text-left">
            <h2 className="font-heading text-3xl md:text-4xl font-black text-[#0F172A] mb-3">Built for how you work</h2>
            <p className="text-[#475569] text-lg">Select your business to see optimized configurations.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4 flex flex-col gap-2.5">
              {IND.map((d, i) => (
                <button key={i} onClick={() => setActiveInd(i)} className={`text-left px-6 py-4 rounded-xl font-bold text-[15px] transition-all flex justify-between items-center outline-none border ${activeInd === i ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-md shadow-blue-500/30' : 'bg-white text-[#475569] hover:bg-gray-50 border-gray-200'}`}>
                  {d[0]}
                  {activeInd === i && <ArrowRight size={18} className="text-white" />}
                </button>
              ))}
            </div>

            <div className="lg:col-span-8 bg-[#F8FAFC] rounded-2xl p-8 lg:p-10 border border-gray-200 flex flex-col md:flex-row gap-10 shadow-sm">
              <div className="flex-1">
                <span className="inline-block bg-blue-100 text-[#1D4ED8] px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-widest mb-5">
                  {IND[activeInd][1]}
                </span>
                <h3 className="font-heading text-3xl font-black text-[#0F172A] mb-4 leading-tight">{IND[activeInd][2]}</h3>
                <p className="text-[#475569] text-lg mb-8 leading-relaxed">{IND[activeInd][3] as string}</p>
                <ul className="space-y-4 mb-8">
                  {(IND[activeInd][4] as string[]).map((x, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-[#0F172A] font-bold text-sm sm:text-base">
                      <Check size={20} className="text-[#2563EB] shrink-0" /> {x}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="md:w-64 shrink-0 flex flex-col">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-4 h-full flex flex-col justify-center text-center">
                  <small className="text-[#64748B] font-bold text-[10px] uppercase tracking-widest block mb-3">Recommended Setup</small>
                  <b className="font-heading text-xl text-[#1E3A8A] leading-tight">{IND[activeInd][5]}</b>
                </div>
                <Link href="/quote" className="btn-company w-full px-4 py-4 text-center text-[15px] font-bold rounded-xl">
                  Get a Quote
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 5. COMPACT PRODUCTS GRID (WITH REAL IMAGES INSTEAD OF SVG) --- */}
      <section id="shop" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 mb-12">
          <div className="text-center md:text-left">
            <h2 className="font-heading text-3xl md:text-4xl font-black text-[#0F172A] mb-3">Popular Models</h2>
            <p className="text-[#475569] text-lg">Select any model to customize dimensions.</p>
          </div>
          
          <div className="flex gap-1.5 bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm">
            {[ { label: 'All', val: 'all' }, { label: '< $10k', val: 's' }, { label: '$10k–$12.5k', val: 'm' }, { label: '> $12.5k', val: 'l' } ].map((f, i) => (
              <button key={i} onClick={() => setProdFilter(f.val)} className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-colors ${prodFilter === f.val ? 'bg-[#2563EB] text-white shadow-sm' : 'text-[#64748B] hover:bg-gray-50'}`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {filteredProds.slice(0, 8).map((p, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col hover:border-[#2563EB] hover:shadow-xl transition-all duration-300 group">
              
              {/* --- Replaced SVG with Original Image --- */}
              <div className="bg-[#F8FAFC] rounded-xl h-[180px] w-full flex items-center justify-center mb-6 overflow-hidden border border-gray-100 relative">
                <img 
                  src={p[4] as string} 
                  alt={p[0] as string} 
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500 ease-in-out"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?q=80&w=600&auto=format&fit=crop';
                  }}
                />
                <div className="absolute inset-0 bg-[#2563EB]/0 group-hover:bg-[#2563EB]/10 transition-colors duration-300 pointer-events-none"></div>
              </div>
              
              <span className="text-[10px] font-black uppercase tracking-widest text-[#1D4ED8] bg-blue-100 px-2 py-1 rounded w-max mb-3">{p[2]}</span>
              <h3 className="font-heading text-lg font-extrabold text-[#0F172A] leading-tight mb-2 line-clamp-2">{p[0]}</h3>
              <small className="text-[#64748B] font-bold text-xs block mb-6 uppercase tracking-wider">SKU: {p[1]}</small>
              <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-5">
                <div className="font-heading font-black text-2xl text-[#1E3A8A]">${(p[3] as number).toLocaleString()}</div>
                <Link href="/walk-in-cooler-freezer" className="w-10 h-10 rounded-lg bg-gray-100 text-[#0F172A] flex items-center justify-center group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- 6. DUAL BANNERS (Walk-in Coolers vs Refrigeration Equipment) --- */}
      <section className="w-full max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-2 mt-8">
        <div className="relative h-[350px] md:h-[400px] overflow-hidden group bg-[#1E3A8A]">
          <div className="absolute inset-0 bg-cover bg-right md:bg-center group-hover:scale-105 transition-transform duration-700 ease-out" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1587293852726-70cdb56c2866?q=80&w=1200&auto=format&fit=crop')" }}></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#1E3A8A] via-[#1E3A8A]/80 to-transparent"></div>
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 lg:px-20">
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-3 leading-tight tracking-tight">
              Walk-in Coolers<br />& Freezers
            </h2>
            <p className="text-blue-200 text-sm md:text-base font-medium mb-8">
              Custom Sizes <span className="mx-2 text-white">•</span> Now 15% Savings
            </p>
            <Link href="/walk-in-cooler-freezer" className="btn-company px-8 py-3.5 text-xs font-black uppercase tracking-widest w-max rounded-md">
              Shop Now
            </Link>
          </div>
        </div>
        <div className="relative h-[350px] md:h-[400px] overflow-hidden group bg-[#0F172A]">
          <div className="absolute inset-0 bg-cover bg-right md:bg-center group-hover:scale-105 transition-transform duration-700 ease-out" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1635405038299-6e3eb33bc073?q=80&w=1200&auto=format&fit=crop')" }}></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/90 to-transparent"></div>
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 lg:px-20">
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-3 leading-tight tracking-tight">
              Refrigeration<br />Equipment
            </h2>
            <p className="text-gray-300 text-sm md:text-base font-medium mb-8">
              Take an Extra $50 Off Every Monday
            </p>
            <Link href="/refrigeration-equipment" className="btn-company px-8 py-3.5 text-xs font-black uppercase tracking-widest w-max rounded-md">
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* --- 7. TARGET INDUSTRIES GRID --- */}
      <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-[#F4F7FB] border-b border-gray-200">
        <div className="text-center mb-16 md:mb-20">
          <h4 className="text-[#2563EB] text-xs font-extrabold uppercase tracking-[0.2em] mb-4">Target Industries</h4>
          <h2 className="font-heading text-3xl md:text-5xl font-black text-[#0F172A] tracking-tight uppercase">
            ONE SYSTEM. <span className="text-[#2563EB]">EVERY SECTOR.</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[
            { t: 'RESTAURANTS', d: 'Walk-ins sized for every kitchen, from cafes to large multi-unit groups.', f: 'NSF / UL Approved', ic: <Utensils size={32} strokeWidth={1.5} className="text-[#2563EB]" /> },
            { t: 'SUPERMARKETS', d: 'Anti-condensation display glass doors and multi-deck systems.', f: 'Maximized Merchandising', ic: <ShoppingCart size={32} strokeWidth={1.5} className="text-[#2563EB]" /> },
            { t: 'WAREHOUSES', d: 'Large-scale drive-in coolers for massive high-volume cold storage.', f: 'ASTM E84 Compliant', ic: <Box size={32} strokeWidth={1.5} className="text-[#2563EB]" /> },
            { t: 'HOSPITALITY', d: 'Solutions for resort kitchens, banquet facilities, and large-scale F&B.', f: 'Integrated Catering Systems', ic: <Building2 size={32} strokeWidth={1.5} className="text-[#2563EB]" /> },
            { t: 'HEALTHCARE', d: 'Precise, medical-grade temperature arrays for sensitive pharma storage.', f: 'NIST Traceable Monitoring', ic: <Stethoscope size={32} strokeWidth={1.5} className="text-[#2563EB]" /> },
            { t: 'CUSTOM', d: 'Fully tailored, spatially complex engineering solutions for unique project requirements.', f: 'Full CAD/BIM Support', ic: <Star size={32} strokeWidth={1.5} className="text-[#2563EB]" /> }
          ].map((ind, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-8 flex items-start gap-6 border border-gray-200 shadow-[0_4px_15px_rgba(0,0,0,0.03)] hover:border-[#2563EB] hover:shadow-[0_10px_30px_rgba(37,99,235,0.1)] hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
              <div className="shrink-0 mt-1 bg-blue-50 p-2 rounded-lg">{ind.ic}</div>
              <div className="flex flex-col h-full">
                <h3 className="text-sm md:text-[15px] font-extrabold text-[#0F172A] uppercase tracking-wide mb-3">{ind.t}</h3>
                <p className="text-[#475569] text-sm leading-relaxed mb-6 flex-grow font-medium">{ind.d}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-[11px] font-black text-[#1E3A8A] uppercase tracking-wider">{ind.f}</span>
                  <span className="text-gray-300 group-hover:text-[#2563EB] transition-colors transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- 8. TESTIMONIAL BLOCK --- */}
      <section className="py-20 bg-[#0F172A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <h2 className="font-heading text-3xl md:text-5xl font-black mb-8 leading-tight">Trusted by commercial kitchens & warehouses.</h2>
            <div className="flex gap-3">
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => setTi(i)} className={`w-12 h-12 rounded-xl font-bold text-[15px] transition-colors ${ti === i ? 'bg-[#2563EB] text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}>
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-[#1E293B] p-8 lg:p-10 rounded-3xl border border-white/10 shadow-xl">
            <blockquote className="font-heading font-medium text-2xl leading-snug mb-8 min-h-[4em]">
              "{TESTIMONIALS[ti][0]}"
            </blockquote>
            <figcaption className="text-blue-300 font-bold text-sm tracking-widest uppercase flex items-center gap-3">
              <span className="w-6 h-0.5 bg-[#2563EB]"></span>
              {TESTIMONIALS[ti][1]}
            </figcaption>
          </div>
        </div>
      </section>

      {/* --- 9. EXACT SCREENSHOT MATCH: 5-COLUMN IMAGE GALLERY --- */}
      <section className="pt-16 pb-12 bg-white w-full border-b-[4px] border-[#2563EB]">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
            {GALLERY_IMAGES.map((img) => (
              <div
                key={img.id}
                className="relative group overflow-hidden rounded-[16px] md:rounded-[20px] aspect-[4/3] bg-gray-100 shadow-sm cursor-pointer"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-in-out"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-[#002f6c]/20 transition-colors duration-300 pointer-events-none"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg transform scale-50 group-hover:scale-100 transition-transform duration-300">
                    <Maximize2 size={20} className="text-[#0F172A]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}