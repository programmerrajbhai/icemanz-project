import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#020617] text-slate-400 pt-20 md:pt-28 pb-10 border-t border-slate-900/50 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-accent/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20 md:mb-24">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-8">
            <Link href="/" className="inline-block group cursor-pointer">
              <img src='/logo.png' alt='logo' className='h-10 md:h-12' />
            </Link>
            <p className="text-slate-400 leading-relaxed max-w-sm text-sm md:text-base font-medium opacity-80">
              ICEMANZ is your trusted partner for reliable and efficient refrigeration systems—built for supermarkets, restaurants, retail outlets, and warehouses. We offer a complete, hassle-free experience with expert support at every step.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="size-10 inline-flex items-center justify-center text-slate-400 bg-slate-900/40 rounded-xl hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1 border border-slate-800/50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 lg:ml-auto">
            <h4 className="text-xs font-black text-white mb-8 uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-4 h-px bg-primary"></span>
              Quick Links
            </h4>
            <ul className="space-y-4 font-bold text-sm">
              {[
                { name: 'Home', href: '/' },
                { name: 'Products', href: '/products' },
                { name: 'About Us', href: '/about-us' },
                { name: 'Contact', href: '/contact' },
                { name: 'Get a Quote', href: '/quote' }
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group cursor-pointer">
                    <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-primary" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div className="lg:col-span-2 lg:ml-auto">
            <h4 className="text-xs font-black text-white mb-8 uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-4 h-px bg-primary"></span>
              Our Products
            </h4>
            <ul className="space-y-4 font-bold text-sm">
              {[
                { name: 'Walk-In Coolers', href: '/products/coolers' },
                { name: 'Walk-In Freezers', href: '/products/freezers' },
                { name: 'Cooler-Freezer Combo', href: '/products/combo' },
                { name: 'Custom Solutions', href: '/products/custom' },
                { name: 'Glass Doors', href: '/products/glass-doors' },
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group cursor-pointer">
                    <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-primary" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-3 lg:ml-auto">
            <h4 className="text-xs font-black text-white mb-8 uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-4 h-px bg-primary"></span>
              Contact Info
            </h4>
            <ul className="space-y-6">
              <li className="flex gap-4 items-start group">
                <div className="bg-slate-900/50 w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-primary border border-slate-800/50 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                  <MapPin size={18} />
                </div>
                <span className="text-slate-400 font-medium leading-relaxed text-sm">123 Cooling St, <br />Refrigeration City, NY 10001</span>
              </li>
              <li className="flex gap-4 items-center group">
                <div className="bg-slate-900/50 w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-primary border border-slate-800/50 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                  <Phone size={18} />
                </div>
                <a href="tel:929-451-7665" className="text-slate-400 font-bold hover:text-white transition-colors text-sm cursor-pointer tracking-tight">929-451-7665</a>
              </li>
              <li className="flex gap-4 items-center group">
                <div className="bg-slate-900/50 w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-primary border border-slate-800/50 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                  <Mail size={18} />
                </div>
                <a href="mailto:sales@icemanz.com" className="text-slate-400 font-bold hover:text-white transition-colors text-sm cursor-pointer tracking-tight">sales@icemanz.com</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-slate-900/50 bg-black/20">
        <div className="container px-4 md:px-6 py-10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em]">
          <p className="text-slate-500 text-center md:text-left">
            © {currentYear} <span className="text-primary">ICEMANZ</span>. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8 md:gap-12">
            <Link href="/privacy" className="text-slate-500 hover:text-white transition-colors cursor-pointer">Privacy Policy</Link>
            <Link href="/terms" className="text-slate-500 hover:text-white transition-colors cursor-pointer">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
