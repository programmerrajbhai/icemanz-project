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
  const mobileProductLinks = [
    { label: 'Walk In Coolers', href: '/products/walk-in-coolers' },
    { label: 'Coolers With Floor', href: '/products/coolers-with-floor' },
    { label: 'Walk In Freezers', href: '/products/walk-in-freezers' },
    { label: 'Freezers With Floor', href: '/products/freezers-with-floor' },
    { label: 'Combo Units', href: '/products/combo-units' },
    { label: 'Portable Refrigeration', href: '/products/portable-refrigeration' },
    { label: 'Drive-in Coolers Freezers', href: '/products/drive-in-coolers-freezers' },
    { label: 'Doors and Parts', href: '/products/doors' },
    { label: 'Glassdoor Walk-in Cooler', href: '/products/glassdoor-walk-in-cooler' },
    { label: 'Glassdoor Walk-in Freezer', href: '/products/glassdoor-walk-in-freezer' },
    { label: 'Glassdoor', href: '/products/glassdoor' },
    { label: 'Shelving', href: '/products/shelving' },
    { label: 'Refrigeration Equipment', href: '/refrigeration-equipment' },
    { label: 'Low Profile Evaporator', href: '/products/low-profile-evaporator' },
    { label: 'Thin Profile Evaporator (Reach-in)', href: '/products/thin-profile-evaporator' },
    { label: 'Medium Profile', href: '/products/medium-profile' }
  ];

  const walkInImages: { [key: string]: string } = {
    'Walk In Coolers': '/Walk-inCooler&Freezer/walkincoolers.jpg',
    'Coolers With Floor': '/Walk-inCooler&Freezer/coolerswithfloor.jpg',
    'Walk In Freezers': '/Walk-inCooler&Freezer/walk-infreezerunits.jpg',
    'Freezers With Floor': '/Walk-inCooler&Freezer/freezerswithfloor.jpg',
    'Combo Units': '/Walk-inCooler&Freezer/combounits.jpg',
    'Portable Refrigeration': '/Walk-inCooler&Freezer/portableRefrigeration.jpg',
    'Drive-in Coolers Freezers': '/Walk-inCooler&Freezer/drive-inCoolersFreezers.jpg',
    'Doors and Parts': '/Walk-inCooler&Freezer/NewCooler.jpg',
    'Refrigeration Equipment': '/slider/s_1.jpeg'
  };

  const glassdoorImages: { [key: string]: string } = {
    'Glassdoor Walk-in Cooler': '/products/product_2.jpg',
    'Glassdoor Walk-in Freezer': '/slider/s_2.jpeg',
    'Glassdoor': '/slider/s_3.jpeg',
    'Shelving': '/products/product_1.jpg'
  };

  const refrigerationImages: { [key: string]: string } = {
    'Low Profile Evaporator': '/slider/s_1.jpeg',
    'Thin Profile Evaporator (Reach-in)': '/slider/s_2.jpeg',
    'Medium Profile': '/slider/s_3.jpeg',
    'Refrigeration Equipment': '/slider/s_1.jpeg'
  };

  const [hoveredRefrigerationItem, setHoveredRefrigerationItem] = useState('/slider/s_1.jpeg');

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
    <header className={`fixed left-0 right-0 z-50 transition-all duration-500 ease-in-out ${isScrolled ? 'lg:-top-[37px]' : 'top-0'}`}>
      {/* Top Bar - Refined Blue */}
      <div className="hidden lg:flex bg-[#003d80] text-white py-2.5 h-[37px] items-center border-b border-white/5">
        <div className="container flex justify-between items-center text-[12px] font-bold uppercase tracking-wider leading-none">
          <div className="flex gap-8" suppressHydrationWarning>
            <a href="tel:929-451-7665" className="flex items-center gap-2 hover:text-blue-200 transition-colors">
              <Phone size={14} className="text-blue-300" /> 929-451-7665
            </a>
            <a href="mailto:sales@icemanz.com" className="flex items-center gap-2 hover:text-blue-200 transition-colors">
              <Mail size={14} className="text-blue-300" /> sales@icemanz.com
            </a>
          </div>
          <div className="flex items-center gap-8">
            <span className="flex items-center gap-2 text-blue-50">
              <Clock size={14} className="text-blue-300" />
              <span className="text-white">36-48h Shipping</span> - Nationwide Delivery
            </span>
            <Link href="/support" className="hover:text-blue-200 transition-colors border-l border-white/20 pl-8">Support</Link>
          </div>
        </div>
      </div>

      {/* Main Navigation - Enhanced Shadow and Border */}
      <div className={`bg-white/95 backdrop-blur-md transition-all duration-300 ${isScrolled ? 'py-2 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)]' : 'py-4 shadow-sm border-b border-gray-100'}`}>
        <div className="container flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 group">
            <img src='/logo.png' alt='logo' className='h-14' />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex gap-10 items-center">
            <Link href="/" className="text-[15px] font-bold text-gray-800 hover:text-primary transition-all relative group py-2 cursor-pointer">
              Home
            </Link>
            <div className="relative group py-2">
              <Link href="/walk-in-cooler-freezer" className="text-[15px] font-bold text-gray-800 hover:text-primary transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap">
                Walk-in Cooler & Freezer <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
              </Link>
              {/* Mega Dropdown for Walk-in Cooler & Freezer */}
              <div className="absolute top-full left-0 w-[500px] bg-white shadow-2xl rounded-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 p-6 z-50">
                <div className="flex gap-8">
                  {/* Links Column */}
                  <div className="flex flex-col gap-1.5 flex-1">
                    {[
                      { label: 'Walk In Coolers', href: '/products/walk-in-coolers' },
                      { label: 'Coolers With Floor', href: '/products/coolers-with-floor' },
                      { label: 'Walk In Freezers', href: '/products/walk-in-freezers' },
                      { label: 'Freezers With Floor', href: '/products/freezers-with-floor' },
                      { label: 'Combo Units', href: '/products/combo-units' },
                      { label: 'Portable Refrigeration', href: '/products/portable-refrigeration' },
                      { label: 'Drive-in Coolers Freezers', href: '/products/drive-in-coolers-freezers' },
                      { label: 'Doors and Parts', href: '/products/doors' }
                    ].map((item, index) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onMouseEnter={() => setHoveredWalkInItem(walkInImages[item.label])}
                        className={`text-[14px] font-bold transition-all py-1.5 hover:translate-x-1 inline-block ${index === 0 ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                  {/* Image Column */}
                  <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-xl p-3 overflow-hidden min-h-[180px] max-h-[220px]">
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
              <button className="text-[15px] font-bold text-gray-800 hover:text-primary transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap focus:outline-none">
                Glassdoor Walk-in Cooler <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
              </button>
              {/* Mega Dropdown for Glassdoor Walk-in Cooler */}
              <div className="absolute top-full left-0 w-[500px] bg-white shadow-2xl rounded-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 p-6 z-50">
                <div className="flex gap-8">
                  {/* Links Column */}
                  <div className="flex flex-col gap-1.5 flex-1">
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
                        className={`text-[14px] font-bold transition-all py-1.5 hover:translate-x-1 inline-block ${index === 0 ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}
                      >
                        {item}
                      </Link>
                    ))}
                  </div>
                  {/* Image Column */}
                  <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-xl p-3 overflow-hidden min-h-[180px] max-h-[220px]">
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
              <Link href="/refrigeration-equipment" className="text-[15px] font-bold text-gray-800 hover:text-primary transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap">
                Refrigeration Equipment <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
              </Link>
              {/* Mega Dropdown for Refrigeration Equipment */}
              <div className="absolute top-full left-0 w-[500px] bg-white shadow-2xl rounded-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 p-6 z-50">
                <div className="flex gap-8">
                  {/* Links Column */}
                  <div className="flex flex-col gap-1.5 flex-1">
                    {[
                      { label: 'Low Profile Evaporator', href: '/products/low-profile-evaporator' },
                      { label: 'Thin Profile Evaporator (Reach-in)', href: '/products/thin-profile-evaporator' },
                      { label: 'Medium Profile', href: '/products/medium-profile' }
                    ].map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onMouseEnter={() => setHoveredRefrigerationItem(refrigerationImages[item.label])}
                        className="text-[14px] font-bold transition-all py-1.5 hover:translate-x-1 inline-block text-gray-500 hover:text-primary"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                  {/* Image Column */}
                  <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-xl p-3 overflow-hidden min-h-[180px] max-h-[220px]">
                    <img
                      key={hoveredRefrigerationItem}
                      src={hoveredRefrigerationItem}
                      alt="Refrigeration Equipment Preview"
                      className="max-w-full h-auto rounded-lg shadow-sm"
                    />
                  </div>
                </div>
              </div>
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

            <Link
              href="/quote"
              className="hidden md:inline-flex items-center gap-x-2 bg-primary hover:bg-blue-700 text-white px-7 py-3 rounded-xl font-bold text-[14px] transition-all focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none transform hover:shadow-xl active:scale-95 shadow-lg shadow-primary/20 cursor-pointer"
            >
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
              <img src='/logo.png' alt='logo' className='h-12' />
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
                <span className="text-xs uppercase tracking-[0.2em] text-primary font-black mb-4 block">Products</span>
                <div className="grid grid-cols-1 gap-3 pl-4 border-l-2 border-primary/10">
                  {mobileProductLinks.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-[15px] font-bold text-gray-500 hover:text-primary py-1 transition-colors block"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>

            <div className="mt-8 pb-10">
              <Link
                href="/quote"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold text-center inline-flex items-center justify-center gap-x-2 mb-8 shadow-xl shadow-primary/20 cursor-pointer active:scale-95 transition-all focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
              >
                <FileText size={20} />
                Get a Quote
              </Link>
              <div className="space-y-5 bg-gray-50 p-6 rounded-2xl">
                <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2">Contact Info</p>
                <a href="tel:929-451-7665" className="flex items-center gap-4 text-gray-700 hover:text-primary transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <Phone size={18} className="text-primary" />
                  </div>
                  <span className="font-bold text-sm">929-451-7665</span>
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
