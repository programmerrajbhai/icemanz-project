"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Phone,
  Mail,
  Menu,
  Search,
  ShoppingCart,
  ChevronDown,
  Clock,
  X,
  FileText
} from 'lucide-react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed left-0 right-0 z-50 transition-all duration-500 ease-in-out ${isScrolled ? '-top-[37px]' : 'top-0'}`}>
      {/* Top Bar */}
      <div className="bg-primary text-white py-2.5 h-[37px] flex items-center">
        <div className="container flex justify-between items-center text-[13px] font-medium leading-none">
          <div className="flex gap-6">
            <a href="tel:1-800-000-0000" className="flex items-center gap-2 hover:text-accent transition-colors">
              <Phone size={14} className="text-accent" /> 1-800-000-0000
            </a>
            <a href="mailto:sales@icemanz.com" className="flex items-center gap-2 hover:text-accent transition-colors">
              <Mail size={14} className="text-accent" /> sales@icemanz.com
            </a>
          </div>
          <div className="hidden lg:flex items-center gap-6">
            <span className="flex items-center gap-2">
              <Clock size={14} className="text-accent" />
              <span className="text-accent">36-48h Shipping</span> - Nationwide Delivery
            </span>
            <div className="h-4 w-px bg-white/20"></div>
            <Link href="/track" className="hover:text-accent transition-colors">Track Order</Link>
            <Link href="/support" className="hover:text-accent transition-colors">Support</Link>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className={`bg-white/95 backdrop-blur-md transition-all duration-300 ${isScrolled ? 'py-2 shadow-xl' : 'py-4 shadow-sm border-b border-gray-100'}`}>
        <div className="container flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 group">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl group-hover:bg-accent transition-colors duration-300">
              I
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-primary tracking-tighter leading-none group-hover:text-gray-900 transition-colors">
                ICEMANZ<span className="text-accent"></span>
              </span>
              <span className="text-[10px] font-bold text-gray-500 tracking-[0.2em] uppercase leading-none mt-1">
                Cooling Excellence
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex gap-10 items-center">
            <Link href="/" className="text-[15px] font-bold text-gray-800 hover:text-primary transition-all relative group py-2 cursor-pointer">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <div className="relative group py-2">
              <button className="text-[15px] font-bold text-gray-800 hover:text-primary transition-all flex items-center gap-1 cursor-pointer">
                Products <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
              </button>
              {/* Comprehensive Mega Menu */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-[900px] bg-white shadow-2xl rounded-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 p-8 grid grid-cols-3 gap-10">
                {/* Category 1 */}
                <div className="space-y-4">
                  <h4 className="text-primary font-black text-sm uppercase tracking-wider pb-2 border-b-2 border-primary/10">
                    Walk-in Cooler & Freezer
                  </h4>
                  <div className="flex flex-col gap-2">
                    {[
                      'Walk-in Coolers',
                      'Coolers with Floor',
                      'Walking Freezer',
                      'Freezers with Floor',
                      'Combo Units',
                      'Refrigerated Container',
                      'Frozen Container',
                      'Doors'
                    ].map((item) => (
                      <Link
                        key={item}
                        href={`/products/${item.toLowerCase().replace(/ /g, '-')}`}
                        className="text-[13px] font-bold text-gray-600 hover:text-primary transition-colors py-1 flex items-center gap-2 group/item"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover/item:bg-accent transition-all"></span>
                        {item}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Category 2 */}
                <div className="space-y-4">
                  <h4 className="text-primary font-black text-sm uppercase tracking-wider pb-2 border-b-2 border-primary/10">
                    Glassdoor Walk-in Cooler
                  </h4>
                  <div className="flex flex-col gap-2">
                    {[
                      'Glassdoor walk-in Cooler',
                      'Glassdoor walk-in Freezer',
                      'Glassdoor',
                      'Shelving'
                    ].map((item) => (
                      <Link
                        key={item}
                        href={`/products/${item.toLowerCase().replace(/ /g, '-')}`}
                        className="text-[13px] font-bold text-gray-600 hover:text-primary transition-colors py-1 flex items-center gap-2 group/item"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover/item:bg-accent transition-all"></span>
                        {item}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Category 3 */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-primary font-black text-sm uppercase tracking-wider pb-2 border-b-2 border-primary/10 mb-4">
                      Refrigeration Equipment
                    </h4>
                    <div className="space-y-4">
                      {/* Sub-section: Turbo AIR */}
                      <div>
                        <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-2">Turbo AIR</span>
                        <div className="flex flex-col gap-1 pl-2 border-l-2 border-gray-50">
                          {[
                            'Low Profile Evaporator',
                            'Thin Profile Evaporator',
                            'Medium Profile',
                            'Center Mount Evaporator'
                          ].map((item) => (
                            <Link key={item} href="#" className="text-[12px] font-bold text-gray-600 hover:text-accent transition-colors py-0.5">{item}</Link>
                          ))}
                        </div>
                      </div>
                      {/* Sub-section: SMART 7 */}
                      <div>
                        <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-2">Package Unit SMART 7</span>
                        <div className="flex flex-col gap-1 pl-2 border-l-2 border-gray-50">
                          <Link href="#" className="text-[12px] font-bold text-gray-600 hover:text-accent transition-colors py-0.5">Indoor+</Link>
                          <Link href="#" className="text-[12px] font-bold text-gray-600 hover:text-accent transition-colors py-0.5">Outdoor+</Link>
                        </div>
                      </div>
                      {/* Sub-section: Systems */}
                      <div className="flex flex-col gap-1">
                        {[
                          'Medium Temp Systems',
                          'Low Temp Systems',
                          'Condensing Units',
                          'Evaporators'
                        ].map((item) => (
                          <Link key={item} href="#" className="text-[12px] font-bold text-gray-600 hover:text-primary transition-colors py-0.5 uppercase tracking-tighter">{item}</Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Link href="/about" className="text-[15px] font-bold text-gray-800 hover:text-primary transition-all relative group py-2 cursor-pointer">
              About Us
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/resources" className="text-[15px] font-bold text-gray-800 hover:text-primary transition-all relative group py-2 cursor-pointer">
              Resources
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/contact" className="text-[15px] font-bold text-gray-800 hover:text-primary transition-all relative group py-2 cursor-pointer">
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1 mr-2">
              <button className="p-2.5 hover:bg-gray-100 rounded-full transition-all text-gray-700 hover:text-primary cursor-pointer">
                <Search size={20} />
              </button>
              <button className="p-2.5 hover:bg-gray-100 rounded-full transition-all text-gray-700 hover:text-primary relative group cursor-pointer">
                <ShoppingCart size={20} />
                <span className="absolute top-1.5 right-1.5 bg-accent text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform">0</span>
              </button>
            </div>

            <Link href="/quote" className="hidden md:flex items-center gap-2 bg-primary hover:bg-blue-700 text-white px-7 py-3 rounded-xl font-bold text-[14px] transition-all transform hover:shadow-xl active:scale-95 shadow-lg shadow-primary/20 cursor-pointer">
              <FileText size={18} />
              Get a Quote
            </Link>

            <button
              className="lg:hidden p-2.5 hover:bg-gray-100 rounded-xl transition-all text-gray-700 cursor-pointer"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[60] bg-gray-900/50 backdrop-blur-sm lg:hidden transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className={`absolute top-0 right-0 h-full w-[300px] bg-white shadow-2xl transition-transform duration-300 transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-6 flex flex-col h-full">
            <div className="flex justify-between items-center mb-10">
              <span className="text-xl font-black text-primary">ICEMANZ<span className="text-accent"></span></span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                <X size={24} />
              </button>
            </div>

            <nav className="flex flex-col gap-6 text-lg font-bold text-gray-800">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors cursor-pointer border-b border-gray-50 pb-4">Home</Link>

              <div className="flex flex-col gap-4">
                <span className="text-xs uppercase tracking-[0.3em] text-primary font-black mb-2">Products</span>

                {/* Mobile Sub-categories */}
                <div className="space-y-6 pl-2">
                  {/* Walk-in Cooler & Freezer */}
                  <div className="space-y-3">
                    <span className="text-[13px] font-black text-gray-900 block border-l-4 border-accent pl-3">Walk-in Cooler & Freezer</span>
                    <div className="grid grid-cols-1 gap-2 pl-4">
                      {[
                        'Walk-in Coolers',
                        'Coolers with Floor',
                        'Walking Freezer',
                        'Freezers with Floor',
                        'Combo Units',
                        'Doors'
                      ].map((item) => (
                        <Link key={item} href="#" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-bold text-gray-500 hover:text-primary">{item}</Link>
                      ))}
                    </div>
                  </div>

                  {/* Glassdoor Walk-in Cooler */}
                  <div className="space-y-3">
                    <span className="text-[13px] font-black text-gray-900 block border-l-4 border-accent pl-3">Glassdoor Walk-in Cooler</span>
                    <div className="grid grid-cols-1 gap-2 pl-4">
                      {[
                        'Glassdoor walk-in Cooler',
                        'Glassdoor walk-in Freezer',
                        'Glassdoor',
                        'Shelving'
                      ].map((item) => (
                        <Link key={item} href="#" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-bold text-gray-500 hover:text-primary">{item}</Link>
                      ))}
                    </div>
                  </div>

                  {/* Refrigeration Equipment */}
                  <div className="space-y-3">
                    <span className="text-[13px] font-black text-gray-900 block border-l-4 border-accent pl-3">Refrigeration Equipment</span>
                    <div className="grid grid-cols-1 gap-2 pl-4">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Turbo AIR</span>
                      <Link href="#" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-bold text-gray-500 hover:text-primary">Low Profile Evaporator</Link>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Package Unit SMART 7</span>
                      <Link href="#" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-bold text-gray-500 hover:text-primary">Indoor/Outdoor Units</Link>
                    </div>
                  </div>
                </div>
              </div>

              <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors cursor-pointer border-t border-gray-50 pt-4">About Us</Link>
              <Link href="/resources" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors cursor-pointer">Resources</Link>
              <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors cursor-pointer">Contact</Link>
            </nav>

            <div className="mt-auto pt-10 border-t border-gray-100">
              <Link href="/quote" onClick={() => setIsMobileMenuOpen(false)} className="w-full bg-primary text-white py-4 rounded-xl font-bold text-center block mb-4 shadow-lg shadow-primary/20 cursor-pointer">
                Get a Quote
              </Link>
              <div className="flex flex-col gap-4 text-sm text-gray-600 font-medium">
                <a href="tel:1-800-000-0000" className="flex items-center gap-3">
                  <Phone size={18} className="text-primary" /> 1-800-000-0000
                </a>
                <a href="mailto:sales@icemanz.com" className="flex items-center gap-3">
                  <Mail size={18} className="text-primary" /> sales@icemanz.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
