import Link from 'next/link';
import { PhoneCall, FileText } from 'lucide-react';

export default function CTA() {
  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="container px-4 md:px-6">
        <div className="relative bg-[#020617] rounded-sm overflow-hidden px-6 py-12 md:py-16 lg:px-12 shadow-2xl">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-primary/20 pointer-events-none"></div>
          <div className="absolute -top-24 -right-24 size-96 bg-primary/10 blur-[100px] rounded-sm pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 size-96 bg-accent/10 blur-[80px] rounded-sm pointer-events-none"></div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-sm bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-sm h-2 w-2 bg-primary"></span>
              </span>
              Direct Factory Solutions
            </div>

            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tighter uppercase leading-[0.95] drop-shadow-sm">
              Ready to Upgrade Your <br />
              <span className="text-primary">Cold Storage</span>?
            </h2>
            
            <p className="text-sm md:text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed font-medium opacity-90">
              Contact us today to discuss your project requirements. Whether you need a standard quick-ship unit or a fully custom-built walk-in, ICEMANZ has you covered.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/quote"
                className="w-full sm:w-auto py-4 px-10 inline-flex justify-center items-center gap-x-3 text-sm font-black uppercase tracking-[0.2em] rounded-sm bg-primary text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-4 focus:ring-offset-[#020617] transition-all shadow-[0_0_20px_rgba(0,74,153,0.3)] hover:shadow-[0_0_30px_rgba(0,74,153,0.5)] cursor-pointer active:scale-[0.98] group/btn"
              >
                <FileText size={20} className="group-hover/btn:scale-110 transition-transform" /> Get a Quote Now
              </Link>
              
              <a
                href="tel:929-451-7665"
                className="w-full sm:w-auto py-3.5 px-8 inline-flex justify-center items-center gap-x-3 text-sm font-black uppercase tracking-widest rounded-sm border border-slate-800 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10 focus:outline-none transition-all cursor-pointer active:scale-95"
              >
                <PhoneCall size={18} /> Call 929-451-7665
              </a>
            </div>

            <div className="mt-12 flex flex-wrap justify-center items-center gap-x-10 gap-y-4 opacity-40 grayscale group hover:grayscale-0 transition-all duration-500">
              <div className="flex items-center gap-2 text-white font-black text-[10px] uppercase tracking-widest">
                <span className="text-primary text-base">✓</span> Factory Direct
              </div>
              <div className="flex items-center gap-2 text-white font-black text-[10px] uppercase tracking-widest">
                <span className="text-primary text-base">✓</span> Nationwide Shipping
              </div>
              <div className="flex items-center gap-2 text-white font-black text-[10px] uppercase tracking-widest">
                <span className="text-primary text-base">✓</span> Custom Engineered
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
