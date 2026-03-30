import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0a0a] text-gray-400 pt-16 md:pt-24 pb-12 border-t border-gray-900">
      <div className="container px-4 md:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-16 md:mb-24">
        <div className="space-y-6 md:space-y-8">
          <Link href="/" className="inline-block group cursor-pointer">
            <span className="text-2xl md:text-3xl font-black text-white tracking-tighter leading-none">
              ICEMANZ<span className="text-accent text-sm align-top ml-0.5"></span>
            </span>
            <span className="block text-[10px] font-bold text-gray-500 tracking-[0.2em] uppercase mt-2 group-hover:text-accent transition-colors">
              Cooling Excellence
            </span>
          </Link>
          <p className="text-gray-400 leading-relaxed max-w-sm text-sm md:text-[15px]">
            ICEMANZ is your trusted partner for reliable and efficient refrigeration systems—built for supermarkets, restaurants, retail outlets, and warehouses. We offer a complete, hassle-free experience with expert support at every step. From design consultation to seamless installation, ICEMANZ is your one-stop shop for modern refrigeration.
          </p>
          <div className="flex gap-3">
            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
              <a key={i} href="#" className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1 border border-gray-800 cursor-pointer">
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div className="md:pl-4 lg:pl-0">
          <h4 className="text-lg font-bold text-white mb-6 md:mb-8 relative inline-block">
            Quick Links
            <span className="absolute -bottom-2 left-0 w-8 h-1 bg-accent rounded-full"></span>
          </h4>
          <ul className="space-y-3 md:space-y-4 font-medium text-sm md:text-base">
            {[
              { name: 'Home', href: '/' },
              { name: 'Products', href: '/products' },
              { name: 'About Us', href: '/about-us' },
              { name: 'Contact', href: '/contact' },
              { name: 'Get a Quote', href: '/quote' }
            ].map((item) => (
              <li key={item.name}>
                <Link href={item.href} className="flex items-center gap-2 hover:text-accent transition-all group cursor-pointer">
                  <ArrowRight size={14} className="text-gray-600 group-hover:text-accent group-hover:translate-x-1 transition-all" /> {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold text-white mb-6 md:mb-8 relative inline-block">
            Our Products
            <span className="absolute -bottom-2 left-0 w-8 h-1 bg-accent rounded-full"></span>
          </h4>
          <ul className="space-y-3 md:space-y-4 font-medium text-sm md:text-base">
            {[
              { name: 'Walk-In Coolers', href: '/products/coolers' },
              { name: 'Walk-In Freezers', href: '/products/freezers' },
              { name: 'Cooler-Freezer Combo', href: '/products/combo' },
              { name: 'Custom Solutions', href: '/products/custom' },
              { name: 'Glass Door Options', href: '/products/glass-doors' },
            ].map((item) => (
              <li key={item.name}>
                <Link href={item.href} className="flex items-center gap-2 hover:text-accent transition-all group cursor-pointer">
                  <ArrowRight size={14} className="text-gray-600 group-hover:text-accent group-hover:translate-x-1 transition-all" /> {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold text-white mb-6 md:mb-8 relative inline-block">
            Contact Info
            <span className="absolute -bottom-2 left-0 w-8 h-1 bg-accent rounded-full"></span>
          </h4>
          <ul className="space-y-5 md:space-y-6">
            <li className="flex gap-4 items-start group">
              <div className="bg-gray-900 w-11 h-11 shrink-0 rounded-xl flex items-center justify-center text-accent border border-gray-800 group-hover:bg-accent group-hover:text-white transition-colors">
                <MapPin size={20} />
              </div>
              <span className="text-gray-400 font-medium leading-relaxed text-sm md:text-base">123 Cooling St, <br />Refrigeration City, NY 10001</span>
            </li>
            <li className="flex gap-4 items-center group">
              <div className="bg-gray-900 w-11 h-11 shrink-0 rounded-xl flex items-center justify-center text-accent border border-gray-800 group-hover:bg-accent group-hover:text-white transition-colors">
                <Phone size={20} />
              </div>
              <a href="tel:1-800-000-0000" className="text-gray-400 font-bold hover:text-white transition-colors text-sm md:text-base cursor-pointer">1-800-000-0000</a>
            </li>
            <li className="flex gap-4 items-center group">
              <div className="bg-gray-900 w-11 h-11 shrink-0 rounded-xl flex items-center justify-center text-accent border border-gray-800 group-hover:bg-accent group-hover:text-white transition-colors">
                <Mail size={20} />
              </div>
              <a href="mailto:sales@icemanz.com" className="text-gray-400 font-bold hover:text-white transition-colors text-sm md:text-base cursor-pointer">sales@icemanz.com</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t mt-5 pt-5 border-gray-900 bg-gray-950/50">
        <div className="container px-4 md:px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-6 text-xs md:text-sm font-medium">
          <p className="text-gray-500 text-center md:text-left">
            © {currentYear} <span className="text-gray-300 font-bold">ICEMANZ</span> Walk-In Cooler & Freezer. All rights reserved.
          </p>
          <div className="flex gap-6 md:gap-8">
            <Link href="/privacy" className="text-gray-500 hover:text-accent transition-colors cursor-pointer">Privacy Policy</Link>
            <Link href="/terms" className="text-gray-500 hover:text-accent transition-colors cursor-pointer">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
