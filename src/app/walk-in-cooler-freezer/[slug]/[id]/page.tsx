"use client";

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CTA from '@/components/CTA';
import Link from 'next/link';
import { useState, use, useEffect } from 'react';
import {
  ChevronRight,
  Star,
  Truck,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Maximize2,
  ArrowRight,
  ShoppingCart,
  Heart,
  Info,
  Award,
  Zap,
  Package,
  FileText,
  Minus,
  Plus,
  Share2,
  Facebook,
  Twitter,
  Instagram,
  MessageCircle,
  HelpCircle
} from 'lucide-react';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string, id: string }> }) {
  const { slug, id } = use(params);
  const [activeTab, setActiveTab] = useState('features');
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVoltage, setSelectedVoltage] = useState('1 Phase, 208/230v');

  // Mock product data based on the refrigerator reference image
  const product = {
    title: "New Barr 8' x 6' x 8'2\" H Walk-in Freezer with Floor",
    size: "52 Sq. Ft.",
    condition: "New",
    readyShip: "Barr Ready-Ship Item!",
    sku: "WIF-8682-BF",
    prices: [
      { amount: 11876, detail: "With new 2 HP condensing unit & evaporator (1Ph)" },
      { amount: 15709, detail: "With new 2.5 HP self contained top mounted unit." }
    ],
    inStockText: "$11,876 IN STOCK!",
    availability: "READY TO SHIP!",
    stockCount: 8,
    maxStock: 15,
    images: [
      '/Walk-inCooler&Freezer/walk-infreezerunits.jpg',
      '/Walk-inCooler&Freezer/freezerswithfloor.jpg',
      '/Walk-inCooler&Freezer/walkincoolers.jpg',
      '/Walk-inCooler&Freezer/coolerswithfloor.jpg',
      '/Walk-inCooler&Freezer/walk-infreezerunits.jpg',
      '/Walk-inCooler&Freezer/freezerswithfloor.jpg',
      '/Walk-inCooler&Freezer/walkincoolers.jpg'
    ],
    voltages: [
      { id: '1p', label: '1 Phase, 208/230v', extra: 0 },
      { id: '3p', label: '3 Phase, 208/230v', extra: 350 }
    ],
    features: [
      "Actual size 8'3\" x 6'7\" x 8'2\"H.",
      "Cam-lock wall, floor, & ceiling panels with 4.75\" urethane insulation. R-value 32.",
      "White interior/exterior finish.",
      "Unit has (1) 36\" x 78\" swinging door with new easy to install vinyl strip curtain kit included and factory floor with aluminum diamond plate.",
      "Includes mounted door closer.",
      "Door must be on 8' wall",
      "New system has 1 year factory warranty.",
      "Heated pressure relief vent included.",
      "NSF/ANSI 7 Approved.",
      "This panel is designed and certified for use in walk in freezer applications.",
      "EC 4.536 kWh/day"
    ],
    specs: [
      { label: "Voltage/Phase:", value: "Buyer to specify." },
      { label: "Barr Ready Ship:", value: "YES" },
      { label: "Details:", value: "2 HP Low temp system 0 to -5 degree storage." },
      { label: "Dimensions:", value: "8'3\" x 6'7\" x 8'2\"H" },
      { label: "Doors:", value: "(1) 36\" x 78\" Swinger" },
      { label: "Finish:", value: "White In / Out" },
      { label: "Insulation:", value: "Urethane 4.75\"" },
      { label: "Promo Text:", value: "$11,876 IN STOCK!" },
      { label: "Sold:", value: "1 year factory warranty" }
    ]
  };
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Header />

      <div className="pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="container max-w-6xl px-4 md:px-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-[10px] md:text-[11px] font-bold mb-10 text-slate-400 uppercase tracking-wider overflow-x-auto no-scrollbar whitespace-nowrap pb-2 md:pb-0">
            <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors shrink-0">Home</Link>
            <span className="text-gray-300 font-light mx-0.5 shrink-0">&gt;</span>
            <Link href="/walk-in-cooler-freezer" className="text-blue-600 hover:text-blue-800 transition-colors shrink-0">Walk-in Cooler & Freezer</Link>
            <span className="text-gray-300 font-light mx-0.5 shrink-0">&gt;</span>
            <Link href={`/walk-in-cooler-freezer/${slug}`} className="text-blue-600 hover:text-blue-800 transition-colors capitalize shrink-0">{slug.replace(/-/g, ' ')}</Link>
            <span className="text-gray-300 font-light mx-0.5 shrink-0">&gt;</span>
            <span className="text-slate-400 font-normal truncate max-w-[150px] md:max-w-none">{product.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-10 items-start">
            {/* Left Column: Gallery (6/12 width) */}
            <div className="lg:col-span-6 flex flex-col gap-8">
              <div className="relative w-full h-[450px] bg-white rounded-2xl overflow-hidden border border-slate-100 group shadow-sm flex items-center justify-center">
                <img
                  src={product.images[activeImage]}
                  alt={product.title}
                  className="max-w-full max-h-full object-contain p-6 transition-transform duration-700 group-hover:scale-105"
                />
                <button className="absolute bottom-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors cursor-pointer">
                  <Maximize2 size={16} className="text-slate-600" />
                </button>
              </div>

              <div>
                <div className="flex flex-wrap gap-2.5">
                  {product.images.slice(0, 6).map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 cursor-pointer ${activeImage === idx ? 'border-blue-600 shadow-md ring-2 ring-blue-50/50' : 'border-slate-100 hover:border-slate-300'
                        }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Info (6/12 width) */}
            <div className="lg:col-span-6 flex flex-col">
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 leading-[1.15]">
                  {product.title}
                </h1>

                <div className="space-y-1 mb-6">
                  <p className="text-[13px] font-bold text-slate-500 uppercase tracking-wider">Size: <span className="text-slate-900 font-black">{product.size}</span></p>
                  <p className="text-[13px] font-bold text-slate-500 uppercase tracking-wider">Condition: <span className="text-slate-900 font-black">{product.condition}</span></p>
                  <p className="text-[13px] font-black text-green-600 uppercase tracking-widest">{product.readyShip}</p>
                </div>

                {/* Multiple Pricing Tiers */}
                <div className="space-y-6 mb-8">
                  {product.prices.map((price, idx) => (
                    <div key={idx} className="flex flex-col border-l-4 border-blue-600 pl-4 py-1">
                      <span className="text-3xl font-black text-slate-900 tracking-tighter">
                        ${price.amount.toLocaleString()}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        {price.detail}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mb-8 py-2 px-4 bg-red-50 rounded-lg border border-red-100 inline-block">
                  <span className="text-[14px] font-black text-[#ff1a43] tracking-wide">
                    {product.inStockText}
                  </span>
                </div>

                {/* Primary CTA */}
                <div className="space-y-4 mb-8">
                  <Link href="/quote" className="group w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 px-6 rounded-xl font-black text-[12px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-100 hover:shadow-blue-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer">
                    Get A Customized Quote
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link href="#" className="flex items-center justify-center gap-2 text-[12px] font-black text-blue-600 hover:text-blue-800 uppercase tracking-widest py-2 transition-colors">
                    <FileText size={16} />
                    Click here for diagram
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="mt-4 pt-0">
            <div className="flex justify-center gap-12 mb-8">
              {[
                { id: 'features', label: 'Features' },
                { id: 'specifications', label: 'Specifications' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-[12px] font-black uppercase tracking-[0.2em] pb-6 transition-all relative whitespace-nowrap cursor-pointer ${activeTab === tab.id
                    ? 'text-slate-900'
                    : 'text-slate-400 hover:text-slate-600'
                    }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-full" />
                  )}
                </button>
              ))}
            </div>

            <div className="max-w-5xl mx-auto">
              {activeTab === 'features' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">
                  <section>
                    <div className="bg-slate-50/50 p-8 rounded-2xl border border-slate-100">
                      <p className="text-[13px] font-black text-green-600 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <CheckCircle2 size={16} />
                        In Stock - Ready to Ship!
                      </p>

                      <p className="text-[14px] leading-relaxed text-slate-600 font-medium mb-8">
                        New Barr 8x6 walk-in freezer box with factory floor with commercial refrigeration to include a new Chandler 2 HP condensing unit and matching evaporator.
                      </p>

                      <ul className="space-y-5">
                        {product.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-4">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 shadow-sm shadow-blue-200" />
                            <span className="text-[14px] font-medium text-slate-600 leading-relaxed">
                              {f.split(/(new|NSF\/ANSI 7 Approved)/i).map((part, index) =>
                                /new|NSF\/ANSI 7 Approved/i.test(part) ? <strong key={index} className="text-slate-900 font-black">{part}</strong> : part
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </section>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">
                  <section>
                    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                      <table className="w-full border-collapse">
                        <tbody>
                          {product.specs.map((spec, i) => (
                            <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                              <td className="py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest w-1/3 align-top">
                                {spec.label}
                              </td>
                              <td className={`py-5 px-6 text-[13px] font-bold ${spec.label === 'Promo Text:' ? 'text-[#ff1a43] font-black' : 'text-slate-900'}`}>
                                {spec.value}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-8 p-6 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-center gap-4">
                      <Info size={24} className="text-blue-600 shrink-0" />
                      <p className="text-[12px] font-bold text-blue-700 leading-relaxed uppercase tracking-wider">
                        Please note: Electrical voltage requirements must be confirmed at the time of order to ensure proper equipment matching.
                      </p>
                    </div>
                  </section>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <CTA />
      <Footer />
    </main>
  );
}
