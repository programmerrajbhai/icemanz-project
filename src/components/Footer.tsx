import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail, ArrowRight, Sparkles } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#020617] text-slate-400 pt-24 pb-12 relative overflow-hidden">
      {/* AI-Inspired Background Effects */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/10 blur-[120px] rounded-sm pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 blur-[150px] rounded-sm pointer-events-none"></div>
      
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-8 mb-24">
          
          {/* Brand & Vision Column */}
          <div className="lg:col-span-4 space-y-10">
            <div className="space-y-6">
              <Link href="/" className="inline-block group cursor-pointer">
                <div className="relative">
                  <div className="absolute -inset-2 bg-primary/20 blur-xl rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <img src='/logo.png' alt='logo' className='h-12 md:h-14 relative' />
                </div>
              </Link>
              <p className="text-slate-400 leading-relaxed max-w-sm text-base font-medium opacity-80">
                Revolutionizing cold storage with <span className="text-white">intelligent refrigeration</span>. 
                Built for performance, engineered for reliability, and delivered nationwide.
              </p>
            </div>

            {/* AI-Style Social Icons */}
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="size-11 inline-flex items-center justify-center text-slate-400 bg-white/5 backdrop-blur-sm rounded-sm hover:bg-primary hover:text-white transition-all duration-300 transform hover:-translate-y-1 border border-white/10 hover:border-primary/50 cursor-pointer shadow-lg hover:shadow-primary/20"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links - Refined Columns */}
          <div className="lg:col-span-2 lg:ml-auto">
            <h4 className="text-[11px] font-black text-white mb-10 uppercase tracking-[0.3em] flex items-center gap-3">
              <Sparkles size={14} className="text-primary animate-pulse" />
              Exploration
            </h4>
            <ul className="space-y-5 font-bold text-sm">
              {[
                { name: 'Home', href: '/' },
                { name: 'Products', href: '/products' },
                { name: 'Services', href: '/services' },
                { name: 'Portfolio', href: '/completed-projects' },
                { name: 'About Us', href: '/about-us' }
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="group flex items-center gap-3 text-slate-500 hover:text-white transition-all duration-300 cursor-pointer">
                    <div className="w-1.5 h-1.5 rounded-sm bg-primary scale-0 group-hover:scale-100 transition-transform duration-300 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Categories */}
          <div className="lg:col-span-2 lg:ml-auto">
            <h4 className="text-[11px] font-black text-white mb-10 uppercase tracking-[0.3em] flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-sm bg-accent"></div>
              Solutions
            </h4>
            <ul className="space-y-5 font-bold text-sm">
              {[
                { name: 'Walk-In Coolers', href: '/products/coolers' },
                { name: 'Walk-In Freezers', href: '/products/freezers' },
                { name: 'Combo Units', href: '/products/combo' },
                { name: 'Glass Doors', href: '/products/glass-doors' },
                { name: 'Custom Build', href: '/products/custom' }
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="group flex items-center gap-3 text-slate-500 hover:text-white transition-all duration-300 cursor-pointer">
                    <div className="w-1.5 h-1.5 rounded-sm bg-accent scale-0 group-hover:scale-100 transition-transform duration-300 shadow-[0_0_8px_rgba(234,179,8,0.8)]"></div>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact - High Tech Look */}
          <div className="lg:col-span-3 lg:ml-auto">
            <h4 className="text-[11px] font-black text-white mb-10 uppercase tracking-[0.3em] flex items-center gap-3">
              <div className="w-4 h-[2px] bg-white/20"></div>
              Connect
            </h4>
            <div className="space-y-4">
              <div className="p-5 rounded-sm bg-white/[0.02] border border-white/5 backdrop-blur-sm space-y-6">
                <a href="tel:929-451-7665" className="flex items-center gap-5 group cursor-pointer">
                  <div className="size-10 rounded-sm bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 border border-primary/20">
                    <Phone size={18} />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Voice Support</p>
                    <p className="text-white font-bold text-sm group-hover:text-primary transition-colors">929-451-7665</p>
                  </div>
                </a>
                
                <a href="mailto:sales@icemanz.com" className="flex items-center gap-5 group cursor-pointer">
                  <div className="size-10 rounded-sm bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-300 border border-accent/20">
                    <Mail size={18} />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Digital Enquiry</p>
                    <p className="text-white font-bold text-sm group-hover:text-accent transition-colors">sales@icemanz.com</p>
                  </div>
                </a>

                <div className="flex items-center gap-5 group pt-2">
                  <div className="size-10 rounded-sm bg-white/5 flex items-center justify-center text-slate-400 border border-white/10">
                    <MapPin size={18} />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global HQ</p>
                    <p className="text-white font-bold text-sm leading-tight">Brooklyn, <br />New York, USA</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Glass Bar */}
        <div className="pt-12 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black uppercase tracking-[0.3em]">
            <div className="flex items-center gap-4 text-slate-500">
              <p>© {currentYear} <span className="text-white">ICEMANZ</span></p>
              <div className="w-1 h-1 rounded-sm bg-white/20"></div>
              <p className="text-[9px] opacity-50">Precision Cold Storage</p>
            </div>
            
            <div className="flex gap-10">
              <Link href="/privacy" className="text-slate-500 hover:text-primary transition-colors cursor-pointer relative group">
                Privacy
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="/terms" className="text-slate-500 hover:text-primary transition-colors cursor-pointer relative group">
                Terms
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
