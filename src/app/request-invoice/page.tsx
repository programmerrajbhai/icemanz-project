"use client";

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  ChevronRight,
  CheckCircle2,
  Plus,
  Star
} from 'lucide-react';

const suggestedProducts = [
  {
    name: "Lakeside Hill Oak Exact Match",
    brand: "STEPSOLUTION",
    price: "$93.26",
    rating: 4.3,
    reviews: 117,
    image: "/slider/s_1.jpeg"
  },
  {
    name: "Fresh Oak 22 MIL x 8.7 in.",
    brand: "Lifeproof",
    price: "$3.28 /sq. ft.",
    rating: 4.5,
    reviews: 3399,
    image: "/slider/s_2.jpeg"
  },
  {
    name: "Maple Navarra Planks 22 MIL",
    brand: "Lifeproof",
    price: "$3.29 /sq. ft.",
    rating: 4.8,
    reviews: 1377,
    image: "/slider/s_3.jpeg"
  },
  {
    name: "Performance Accessories Gray",
    brand: "PERFORMANCE",
    price: "$31.83",
    rating: 4.2,
    reviews: 142,
    image: "/slider/s_1.jpeg"
  }
];

const bottomRecommendations = [
  { name: "Maple Navarra Planks", brand: "Lifeproof", price: "$3.29 /sq. ft.", rating: 4.8, reviews: 1377, image: "/slider/s_3.jpeg", tag: "Top Rated" },
  { name: "Performance Accessories", brand: "PERFORMANCE", price: "$31.83", rating: 4.2, reviews: 142, image: "/slider/s_1.jpeg", tag: null },
  { name: "Fresh Oak 22 MIL x 8.7", brand: "Lifeproof", price: "$3.28 /sq. ft.", rating: 4.5, reviews: 3395, image: "/slider/s_2.jpeg", tag: "Top Rated" },
  { name: "Light Oak 9.39 mm.", brand: "STEPSOLUTION", price: "$31.83", rating: 3.0, reviews: 3, image: "/slider/s_3.jpeg", tag: null },
  { name: "Trail Oak 22 MIL x 8.7", brand: "Lifeproof", price: "$3.28 /sq. ft.", rating: 4.5, reviews: 3373, image: "/slider/s_1.jpeg", tag: "Top Rated" }
];

export default function RequestInvoicePage() {
  return (
    <main className="min-h-screen bg-[#fcfcfc]">
      <Header />

      <div className="pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="container px-4 max-w-[1400px] mx-auto">

          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* Left Sidebar - Added to Cart & Suggested */}
            <aside className="w-full lg:w-[380px] space-y-6">
              <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center gap-3 text-emerald-600 font-bold mb-6">
                  <div className="size-6 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 size={14} />
                  </div>
                  Added to Quote
                </div>

                <div className="flex gap-4 mb-8">
                  <div className="size-24 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
                    <img src="/slider/s_1.jpeg" className="w-full h-full object-cover" alt="Product" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest">STEPSOLUTION</p>
                    <h3 className="text-sm font-bold text-gray-900 leading-tight">Fresh Oak Stair Tread Molding Square Model</h3>
                    <p className="text-xs text-gray-500">Qty: 1</p>
                    <p className="text-sm font-black text-gray-900 mt-2">$87.99</p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-8">
                  <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                    <Plus size={16} className="text-primary" />
                    Suggested Products
                  </h4>
                  <div className="space-y-8">
                    {suggestedProducts.map((item, i) => (
                      <div key={i} className={`group ${i >= 2 ? 'hidden lg:block' : ''}`}>
                        <div className="flex gap-4 mb-4">
                          <div className="size-20 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
                            <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.name} />
                          </div>
                          <div className="space-y-1">
                            <p className="text-[9px] font-black text-primary uppercase tracking-widest">{item.brand}</p>
                            <h5 className="text-[13px] font-bold text-gray-800 leading-snug">{item.name}</h5>
                            <div className="flex items-center gap-1">
                              <div className="flex text-amber-400">
                                {[...Array(5)].map((_, j) => <Star key={j} size={10} fill={j < 4 ? "currentColor" : "none"} />)}
                              </div>
                              <span className="text-[10px] text-gray-400 font-bold">({item.reviews})</span>
                            </div>
                            <p className="text-[13px] font-black text-gray-900">{item.price}</p>
                          </div>
                        </div>
                        <button className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-[10px] font-black uppercase tracking-widest rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none">
                          Add to Quote
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Center Main Form */}
            <div className="flex-1 bg-white border border-gray-100 rounded-[40px] shadow-xl shadow-gray-200/50 overflow-hidden">
              {/* Form Header - 3 Step Progress Bar */}
              <div className="px-4 md:px-12 py-6 md:py-8 border-b border-gray-100 bg-white flex items-center justify-between gap-2 md:gap-8 overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-2 md:gap-3 shrink-0">
                  <span className="size-7 md:size-8 rounded-full bg-[#1e40af] text-white flex items-center justify-center text-xs md:text-sm font-bold shadow-lg shadow-blue-900/20">1</span>
                  <span className="text-[10px] md:text-sm font-black text-[#1e40af] whitespace-nowrap">Project Info</span>
                </div>
                <div className="flex-1 h-px bg-gray-100 min-w-[20px] md:min-w-[30px]"></div>
                <div className="flex items-center gap-2 md:gap-3 shrink-0">
                  <span className="size-7 md:size-8 rounded-full border-2 border-gray-100 flex items-center justify-center text-xs md:text-sm font-bold text-gray-300">2</span>
                  <span className="text-[10px] md:text-sm font-black text-gray-300 whitespace-nowrap">Box & Temperature</span>
                </div>
                <div className="flex-1 h-px bg-gray-100 min-w-[20px] md:min-w-[30px]"></div>
                <div className="flex items-center gap-2 md:gap-3 shrink-0">
                  <span className="size-7 md:size-8 rounded-full border-2 border-gray-100 flex items-center justify-center text-xs md:text-sm font-bold text-gray-300">3</span>
                  <span className="text-[10px] md:text-sm font-black text-gray-300 whitespace-nowrap">Review</span>
                </div>
              </div>

              {/* Form Body - Reference Image Style */}
              <div className="p-8 md:p-12 space-y-12">

                {/* Product Summary Card */}
                <div className="bg-[#f8fafc] border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row gap-6 items-center">
                  <div className="size-32 rounded-2xl bg-white border border-gray-100 overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
                    <img src="/slider/s_1.jpeg" className="w-full h-full object-cover" alt="Product" />
                  </div>
                  <div className="space-y-1.5 text-center sm:text-left">
                    <h3 className="text-xl font-black text-[#1e293b] leading-tight">New ICEMANZ 5' x 8' x 8'H Walk-in Cooler</h3>
                    <p className="text-sm text-[#64748b] font-bold">Glassdoor Walk-in Freezer · Always in Stock</p>
                    <p className="text-base font-black text-[#1e40af] mt-2">Price revealed upon invoice approval</p>
                  </div>
                </div>

                {/* Section: Project Details */}
                <div>
                  <div className="flex items-center gap-4 mb-10">
                    <h4 className="text-[13px] font-black text-[#1e40af] uppercase tracking-[0.2em] whitespace-nowrap">PROJECT DETAILS</h4>
                    <div className="flex-1 h-px bg-gray-100"></div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-[11px] font-black text-[#64748b] uppercase tracking-widest ml-1">PROJECT NAME *</label>
                    <input
                      type="text"
                      placeholder="e.g. Downtown Restaurant Cooler Install"
                      autoComplete="one-time-code"
                      spellCheck={false}
                      className="py-4 px-6 block w-full bg-[#f8fafc] border border-gray-200 rounded-xl text-sm font-bold text-[#1e293b] focus:bg-white focus:border-[#1e40af] focus:ring-0 transition-all placeholder:text-gray-300 shadow-sm shadow-gray-100/50"
                    />
                  </div>
                </div>

                {/* Section: Contact Information */}
                <div>
                  <div className="flex items-center gap-4 mb-10">
                    <h4 className="text-[13px] font-black text-[#1e40af] uppercase tracking-[0.2em] whitespace-nowrap">CONTACT INFORMATION</h4>
                    <div className="flex-1 h-px bg-gray-100"></div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-x-6 gap-y-10">
                    <div className="space-y-3">
                      <label className="block text-[11px] font-black text-[#64748b] uppercase tracking-widest ml-1">CONTACT PERSON *</label>
                      <input
                        type="text"
                        placeholder="Full name"
                        autoComplete="one-time-code"
                        spellCheck={false}
                        className="py-4 px-6 block w-full bg-[#f8fafc] border border-gray-200 rounded-xl text-sm font-bold text-[#1e293b] focus:bg-white focus:border-[#1e40af] focus:ring-0 transition-all placeholder:text-gray-300 shadow-sm shadow-gray-100/50"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="block text-[11px] font-black text-[#64748b] uppercase tracking-widest ml-1">EMAIL ADDRESS *</label>
                      <input
                        type="email"
                        placeholder="you@company.com"
                        autoComplete="one-time-code"
                        spellCheck={false}
                        className="py-4 px-6 block w-full bg-[#f8fafc] border border-gray-200 rounded-xl text-sm font-bold text-[#1e293b] focus:bg-white focus:border-[#1e40af] focus:ring-0 transition-all placeholder:text-gray-300 shadow-sm shadow-gray-100/50"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="block text-[11px] font-black text-[#64748b] uppercase tracking-widest ml-1">PHONE NUMBER *</label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        autoComplete="one-time-code"
                        spellCheck={false}
                        className="py-4 px-6 block w-full bg-[#f8fafc] border border-gray-200 rounded-xl text-sm font-bold text-[#1e293b] focus:bg-white focus:border-[#1e40af] focus:ring-0 transition-all placeholder:text-gray-300 shadow-sm shadow-gray-100/50"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="block text-[11px] font-black text-[#64748b] uppercase tracking-widest ml-1">PROJECT ADDRESS *</label>
                      <input
                        type="text"
                        placeholder="Street, City, State, ZIP"
                        autoComplete="one-time-code"
                        spellCheck={false}
                        className="py-4 px-6 block w-full bg-[#f8fafc] border border-gray-200 rounded-xl text-sm font-bold text-[#1e293b] focus:bg-white focus:border-[#1e40af] focus:ring-0 transition-all placeholder:text-gray-300 shadow-sm shadow-gray-100/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Section: Project Description */}
                <div>
                  <div className="flex items-center gap-4 mb-10">
                    <h4 className="text-[13px] font-black text-[#1e40af] uppercase tracking-[0.2em] whitespace-nowrap">PROJECT DESCRIPTION</h4>
                    <div className="flex-1 h-px bg-gray-100"></div>
                  </div>

                  <div className="space-y-3">
                    <textarea
                      rows={5}
                      placeholder="Timeline, special requirements, constraints..."
                      autoComplete="off"
                      spellCheck={false}
                      className="py-4 px-6 block w-full bg-[#f8fafc] border border-gray-200 rounded-2xl text-sm font-bold text-[#1e293b] focus:bg-white focus:border-[#1e40af] focus:ring-0 transition-all placeholder:text-gray-300 resize-none shadow-sm shadow-gray-100/50"
                    ></textarea>
                  </div>
                </div>

                <div className="flex justify-end pt-12 border-t border-gray-50">
                  <button className="bg-[#1e40af] text-white px-10 py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-blue-800 transition-all flex items-center gap-3 group active:scale-95 shadow-xl shadow-blue-900/10">
                    Continue →
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Recommendations Section */}
          <div className="mt-32">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-black text-[#0b1120] uppercase tracking-tight">Customers Also Purchased...</h2>
              <div className="flex gap-2">
                <button className="size-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-white hover:text-primary hover:border-primary transition-all cursor-pointer">
                  <ChevronRight size={20} className="rotate-180" />
                </button>
                <button className="size-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-white hover:text-primary hover:border-primary transition-all cursor-pointer">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {bottomRecommendations.map((item, i) => (
                <div key={i} className="group bg-white border border-gray-100 rounded-3xl p-4 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 flex flex-col">
                  <div className="relative aspect-square rounded-2xl bg-gray-50 overflow-hidden mb-4 border border-gray-50">
                    {item.tag && (
                      <span className="absolute top-2 left-2 z-10 px-2 py-1 bg-[#4ade80]/10 text-[#166534] text-[8px] font-black uppercase tracking-widest rounded-md border border-[#4ade80]/20">
                        {item.tag}
                      </span>
                    )}
                    <img src={item.image} alt={item.name} className="size-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{item.brand}</p>
                    <h4 className="text-[13px] font-bold text-gray-900 leading-tight line-clamp-2">{item.name}</h4>
                    <div className="flex items-center gap-1 py-1">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, j) => <Star key={j} size={10} fill={j < 4 ? "currentColor" : "none"} />)}
                      </div>
                      <span className="text-[10px] text-gray-400 font-bold">({item.reviews})</span>
                    </div>
                    <p className="text-sm font-black text-primary">{item.price}</p>
                  </div>
                  <button className="mt-4 w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-[10px] font-black uppercase tracking-widest rounded-xl border border-gray-100 bg-white text-primary shadow-sm hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none">
                    Add to Quote
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}
