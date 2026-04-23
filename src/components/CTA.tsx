import Link from 'next/link';
import { PhoneCall, FileText, ArrowRight, ShieldCheck, Truck, Cog } from 'lucide-react';

export default function CTA() {
  return (
    <section className="py-12 md:py-20 bg-white relative overflow-hidden border-t border-slate-100">
      {/* Industrial Grid Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[500px] w-[500px] rounded-full bg-[#004a99] opacity-[0.03] blur-[120px]"></div>
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          {/* Huge Background Outline Text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none select-none overflow-hidden -z-10">
            <span 
              className="text-[80px] md:text-[140px] lg:text-[180px] font-black uppercase text-transparent tracking-tighter leading-none whitespace-nowrap" 
              style={{ WebkitTextStroke: '2px rgba(0, 74, 153, 0.04)' }}
            >
              UPGRADE NOW
            </span>
          </div>

          <div className="bg-white border-2 border-slate-900 p-6 md:p-10 lg:p-12 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] relative transition-all duration-300 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_rgba(15,23,42,1)]">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] mb-8">
              <div className="size-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              Direct Factory Solutions
            </div>

            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-7">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-5 tracking-tighter uppercase leading-[1.1]">
                  Ready to Upgrade <br />
                  <span className="text-[#004a99]">Your Cold Storage?</span>
                </h2>
                
                <p className="text-sm md:text-base text-slate-600 mb-8 leading-relaxed font-medium max-w-xl">
                  Contact us today to discuss your project requirements. Whether you need a standard quick-ship unit or a fully custom-built walk-in, ICEMANZ has you covered with premium industrial solutions.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/quote"
                    className="group flex-1 py-3.5 px-6 inline-flex justify-center items-center gap-x-2 text-xs font-black uppercase tracking-widest bg-[#004a99] text-white hover:bg-blue-800 transition-colors border-2 border-[#004a99] hover:border-blue-800"
                  >
                    Get a Quote <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                  
                  <a
                    href="tel:929-451-7665"
                    className="flex-1 py-3.5 px-6 inline-flex justify-center items-center gap-x-2 text-xs font-black uppercase tracking-widest bg-white text-slate-900 border-2 border-slate-900 hover:bg-slate-900 hover:text-white transition-colors"
                  >
                    <PhoneCall size={16} /> 929-451-7665
                  </a>
                </div>
              </div>

              {/* Bento Grid Feature List */}
              <div className="lg:col-span-5 grid gap-3">
                <div className="bg-white border border-slate-200 p-4 lg:p-5 flex items-start gap-4 hover:border-[#004a99]/30 hover:bg-blue-50/50 transition-colors group">
                  <div className="shrink-0 size-10 bg-white border border-slate-200 flex items-center justify-center text-[#004a99] group-hover:border-[#004a99]/30 transition-colors shadow-sm rounded-sm">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h4 className="text-slate-900 text-sm font-black uppercase tracking-wider mb-1">Factory Direct</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">Get the best prices directly from the manufacturer with no middlemen markup.</p>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-4 lg:p-5 flex items-start gap-4 hover:border-[#004a99]/30 hover:bg-blue-50/50 transition-colors group">
                  <div className="shrink-0 size-10 bg-white border border-slate-200 flex items-center justify-center text-[#004a99] group-hover:border-[#004a99]/30 transition-colors shadow-sm rounded-sm">
                    <Truck size={20} />
                  </div>
                  <div>
                    <h4 className="text-slate-900 text-sm font-black uppercase tracking-wider mb-1">Nationwide Shipping</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">Fast, insured, and reliable delivery across the country directly to your site.</p>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-4 lg:p-5 flex items-start gap-4 hover:border-[#004a99]/30 hover:bg-blue-50/50 transition-colors group">
                  <div className="shrink-0 size-10 bg-white border border-slate-200 flex items-center justify-center text-[#004a99] group-hover:border-[#004a99]/30 transition-colors shadow-sm rounded-sm">
                    <Cog size={20} />
                  </div>
                  <div>
                    <h4 className="text-slate-900 text-sm font-black uppercase tracking-wider mb-1">Custom Engineered</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">Tailored cooling solutions built specifically for your spatial and operational needs.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
