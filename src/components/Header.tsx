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
  FileText,
  ArrowRight
} from 'lucide-react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredWalkInItem, setHoveredWalkInItem] = useState('/Walk-inCooler&Freezer/walkincoolers.jpg');
  const [hoveredGlassdoorItem, setHoveredGlassdoorItem] = useState('/products/product_2.jpg');

  const walkInImages: { [key: string]: string } = {
    'Walk In Coolers': '/Walk-inCooler&Freezer/walkincoolers.jpg',
    'Coolers With Floor': '/Walk-inCooler&Freezer/coolerswithfloor.jpg',
    'Walk In Freezers': '/Walk-inCooler&Freezer/walk-infreezerunits.jpg',
    'Freezers With Floor': '/Walk-inCooler&Freezer/freezerswithfloor.jpg',
    'Combo Units': '/Walk-inCooler&Freezer/combounits.jpg',
    'Portable Refrigeration': '/Walk-inCooler&Freezer/portableRefrigeration.jpg',
    'Drive-in Coolers Freezers': '/Walk-inCooler&Freezer/drive-inCoolersFreezers.jpg',
    'Doors': '/Walk-inCooler&Freezer/NewCooler.jpg'
  };

  const glassdoorImages: { [key: string]: string } = {
    'Glassdoor Walk-in Cooler': '/products/product_2.jpg',
    'Glassdoor Walk-in Freezer': '/slider/s_2.jpeg',
    'Glassdoor': '/slider/s_3.jpeg',
    'Shelving': '/products/product_1.jpg'
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  return (
    <header className={`fixed left-0 right-0 z-50 transition-all duration-500 ease-in-out ${isScrolled ? '-top-[37px]' : 'top-0'}`}>
      {/* Top Bar */}
      <div className="bg-primary text-white py-2.5 h-[37px] flex items-center">
        <div className="container flex justify-between items-center text-[13px] font-medium leading-none">
          <div className="flex gap-6" suppressHydrationWarning>
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
              <Link href="/walk-in-cooler-freezer" className="text-[15px] font-bold text-gray-800 hover:text-primary transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap">
                Walk-in Cooler & Freezer <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
              </Link>
              {/* Mega Dropdown for Walk-in Cooler & Freezer */}
              <div className="absolute top-full left-0 w-[600px] bg-white shadow-2xl rounded-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 p-8 z-50">
                <div className="flex gap-10">
                  {/* Links Column */}
                  <div className="flex flex-col gap-2 flex-1">
                    {[
                      'Walk In Coolers',
                      'Coolers With Floor',
                      'Walk In Freezers',
                      'Freezers With Floor',
                      'Combo Units',
                      'Portable Refrigeration',
                      'Drive-in Coolers Freezers',
                      'Doors'
                    ].map((item, index) => (
                      <Link
                        key={item}
                        href={`/products/${item.toLowerCase().replace(/ /g, '-')}`}
                        onMouseEnter={() => setHoveredWalkInItem(walkInImages[item])}
                        className={`text-[16px] font-bold transition-all py-1.5 hover:translate-x-1 inline-block ${index === 0 ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}
                      >
                        {item}
                      </Link>
                    ))}
                  </div>
                  {/* Image Column */}
                  <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-xl p-4 overflow-hidden min-h-[300px]">
                    <img
                      key={hoveredWalkInItem}
                      src={hoveredWalkInItem}
                      alt="Walk-in Cooler Preview"
                      className="max-w-full h-auto rounded-lg shadow-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="relative group py-2">
              <button className="text-[15px] font-bold text-gray-800 hover:text-primary transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap">
                Glassdoor Walk-in Cooler <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
              </button>
              {/* Mega Dropdown for Glassdoor Walk-in Cooler */}
              <div className="absolute top-full left-0 w-[600px] bg-white shadow-2xl rounded-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 p-8 z-50">
                <div className="flex gap-10">
                  {/* Links Column */}
                  <div className="flex flex-col gap-2 flex-1">
                    {[
                      'Glassdoor Walk-in Cooler',
                      'Glassdoor Walk-in Freezer',
                      'Glassdoor',
                      'Shelving'
                    ].map((item, index) => (
                      <Link
                        key={item}
                        href={`/products/${item.toLowerCase().replace(/ /g, '-')}`}
                        onMouseEnter={() => setHoveredGlassdoorItem(glassdoorImages[item])}
                        className={`text-[16px] font-bold transition-all py-1.5 hover:translate-x-1 inline-block ${index === 0 ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}
                      >
                        {item}
                      </Link>
                    ))}
                  </div>
                  {/* Image Column */}
                  <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-xl p-4 overflow-hidden min-h-[300px]">
                    <img
                      key={hoveredGlassdoorItem}
                      src={hoveredGlassdoorItem}
                      alt="Glassdoor Cooler Preview"
                      className="max-w-full h-auto rounded-lg shadow-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="relative group py-2">
              <Link href="/refrigeration-equipment" className="text-[15px] font-bold text-gray-800 hover:text-primary transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap uppercase tracking-tight">
                Refrigeration Equipment
              </Link>
            </div>
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

            <Link href="https://www.barrinc.com/quote-request/5868" className="hidden md:flex items-center gap-2 bg-primary hover:bg-blue-700 text-white px-7 py-3 rounded-xl font-bold text-[14px] transition-all transform hover:shadow-xl active:scale-95 shadow-lg shadow-primary/20 cursor-pointer">
              <FileText size={18} />
              Get a Quote
            </Link>

            <button
              className="lg:hidden p-3 hover:bg-gray-100 rounded-xl transition-all text-gray-900 cursor-pointer active:scale-90 border border-gray-100 shadow-sm bg-white"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={26} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[100] bg-gray-900/60 backdrop-blur-md lg:hidden transition-all duration-500 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div
          className={`absolute top-0 right-0 h-full w-[85%] max-w-[400px] bg-white shadow-2xl transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile Menu Header - Fixed */}
          <div className="p-5 flex justify-between items-center border-b border-gray-100 shrink-0 bg-white z-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white font-bold">I</div>
              <span className="text-xl font-black text-primary tracking-tighter">ICEMANZ</span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer active:scale-90"
              aria-label="Close menu"
            >
              <X size={28} className="text-gray-900" />
            </button>
          </div>

          {/* Mobile Menu Body - Scrollable */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 custom-scrollbar">
            <nav className="flex flex-col gap-1 text-lg font-bold text-gray-800">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="py-4 hover:text-primary transition-colors cursor-pointer border-b border-gray-50 flex items-center justify-between group">
                Home
                <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </Link>

              <div className="py-6 border-b border-gray-50">
                <Link href="/walk-in-cooler-freezer" onClick={() => setIsMobileMenuOpen(false)} className="text-xs uppercase tracking-[0.2em] text-primary font-black mb-4 block">Walk-in Cooler & Freezer</Link>
                <div className="grid grid-cols-1 gap-3 pl-4 border-l-2 border-primary/10">
                  {[
                    'Walk In Coolers',
                    'Coolers With Floor',
                    'Walk In Freezers',
                    'Freezers With Floor',
                    'Combo Units',
                    'Portable Refrigeration',
                    'Drive-in Coolers Freezers',
                    'Doors'
                  ].map((item) => (
                    <Link
                      key={item}
                      href={`/products/${item.toLowerCase().replace(/ /g, '-')}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-[15px] font-bold text-gray-500 hover:text-primary py-1 transition-colors block"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="py-6 border-b border-gray-50">
                <span className="text-xs uppercase tracking-[0.2em] text-primary font-black mb-4 block">Glassdoor Walk-in Cooler</span>
                <div className="grid grid-cols-1 gap-3 pl-4 border-l-2 border-primary/10">
                  {[
                    'Glassdoor Walk-in Cooler',
                    'Glassdoor Walk-in Freezer',
                    'Glassdoor',
                    'Shelving'
                  ].map((item) => (
                    <Link
                      key={item}
                      href={`/products/${item.toLowerCase().replace(/ /g, '-')}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-[15px] font-bold text-gray-500 hover:text-primary py-1 transition-colors block"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </div>

              <Link href="/refrigeration-equipment" onClick={() => setIsMobileMenuOpen(false)} className="py-4 hover:text-primary transition-colors cursor-pointer border-b border-gray-50 flex items-center justify-between group">
                Refrigeration Equipment
                <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </Link>
            </nav>

            <div className="mt-8 pb-10">
              <Link
                href="https://www.barrinc.com/quote-request/5868"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold text-center flex items-center justify-center gap-2 mb-8 shadow-xl shadow-primary/20 cursor-pointer active:scale-95 transition-transform"
              >
                <FileText size={20} />
                Get a Quote
              </Link>
              <div className="space-y-5 bg-gray-50 p-6 rounded-2xl">
                <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2">Contact Info</p>
                <a href="tel:1-800-000-0000" className="flex items-center gap-4 text-gray-700 hover:text-primary transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <Phone size={18} className="text-primary" />
                  </div>
                  <span className="font-bold text-sm">1-800-000-0000</span>
                </a>
                <a href="mailto:sales@icemanz.com" className="flex items-center gap-4 text-gray-700 hover:text-primary transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <Mail size={18} className="text-primary" />
                  </div>
                  <span className="font-bold text-sm">sales@icemanz.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
