"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
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
  ArrowRight,
  Sparkles
} from 'lucide-react';
import FloatingCart from './FloatingCart';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const { cartItems, isCartOpen, setIsCartOpen } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [expandedMobileCategories, setExpandedMobileCategories] = useState<string[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Hover states for Mega Menu image previews
  const [hoveredWalkInItem, setHoveredWalkInItem] = useState('/walk-in-cooler-freezer/walkincoolers.jpg');
  const [hoveredGlassdoorItem, setHoveredGlassdoorItem] = useState('/products/product_2.jpg');
  const [hoveredRefrigerationItem, setHoveredRefrigerationItem] = useState('/category/refrigerationEquipment/condensingUnit.jpg');

  const mobileMenuData = [
    {
      label: 'Walk-in Cooler & Freezer',
      href: '/walk-in-cooler-freezer',
      subItems: [
        { label: 'Walk-In Cooler (No Floor)', href: '/walk-in-cooler-freezer/walk-in-cooler-no-floor' },
        { label: 'Walk-In Cooler (With Floor)', href: '/walk-in-cooler-freezer/walk-in-cooler-with-floor' },
        { label: 'Walk-In Freezer', href: '/walk-in-cooler-freezer/walk-in-freezer-with-floor' },
        { label: 'Walk-In Combo (Cooler & Freezer)', href: '/walk-in-cooler-freezer/walk-in-combo-cooler-freezer' }
      ]
    },
    {
      label: 'Glassdoor Walk-in Cooler',
      href: '/glassdoor-walk-in-cooler',
      subItems: [
        { label: 'Glassdoor Walk-in Cooler', href: '/glassdoor-walk-in-cooler/glassdoor-walk-in-cooler' },
        { label: 'Glassdoor Walk-in Freezer', href: '/glassdoor-walk-in-cooler/glassdoor-walk-in-freezer' },
        { label: 'Glassdoor', href: '/glassdoor-walk-in-cooler/glassdoor' }
      ]
    },
    {
      label: 'Refrigeration Equipment',
      href: '/refrigeration-equipment',
      subItems: [
        { label: 'Condensing Units', href: '/refrigeration-equipment/condensing-units' },
        { label: 'Evaporation Units', href: '/refrigeration-equipment/evaporation-units' },
        { label: 'Combo Units / Package Units', href: '/refrigeration-equipment/combo-units-package-units' }
      ]
    }
  ];

  const toggleMobileCategory = (label: string) => {
    setExpandedMobileCategories(prev =>
      prev.includes(label) ? prev.filter(c => c !== label) : [...prev, label]
    );
  };

  const walkInImages: { [key: string]: string } = {
    'Walk-In Cooler': '/slider/s_1.jpeg',
    'Walk-In Freezer': '/slider/s_2.jpeg',
    'Walk-In Combo (Cooler & Freezer)': '/slider/s_3.jpeg'
  };

  const glassdoorImages: { [key: string]: string } = {
    'Glassdoor Walk-in Cooler': '/products/product_2.jpg',
    'Glassdoor Walk-in Freezer': '/slider/s_2.jpeg',
    'Glassdoor': '/slider/s_3.jpeg'
  };

  const refrigerationImages: { [key: string]: string } = {
    'Condensing Units': '/slider/s_1.jpeg',
    'Evaporation Units': '/slider/s_2.jpeg',
    'Combo Units / Package Units': '/slider/s_3.jpeg'
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      setIsSearchOpen(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isSearchOpen && !(e.target as Element).closest('.search-container')) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isSearchOpen]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  return (
    <header className={`fixed left-0 right-0 z-50 transition-all duration-500 ease-in-out ${isScrolled ? 'lg:-top-[40px]' : 'top-0'}`}>
      
      {/* Top Bar - Ultra Stylish Gradient & Glow */}
      <div className="hidden lg:flex bg-gradient-to-r from-blue-950 via-[#003d80] to-blue-900 text-white py-2 h-[40px] items-center border-b border-blue-800/40 shadow-inner">
        <div className="container flex justify-between items-center text-[12px] font-semibold tracking-wide">
          <div className="flex gap-8 items-center" suppressHydrationWarning>
            <a href="tel:+17186786005" className="flex items-center gap-2 hover:text-blue-300 transition-colors group">
              <span className="p-1 rounded bg-blue-900/50 group-hover:bg-blue-800 transition-colors">
                <Phone size={12} className="text-blue-400" />
              </span> 
              +1 (718) 678-6005
            </a>
            <a href="mailto:sales@icemanz.com" className="flex items-center gap-2 hover:text-blue-300 transition-colors group">
              <span className="p-1 rounded bg-blue-900/50 group-hover:bg-blue-800 transition-colors">
                <Mail size={12} className="text-blue-400" />
              </span> 
              sales@icemanz.com
            </a>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/enquiry" className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors group cursor-pointer">
              <Clock size={13} className="text-blue-400 group-hover:rotate-45 transition-transform duration-300" />
              <span>General Enquiry</span>
            </Link>
            <span className="text-blue-500">/</span>
            <Link href="/support" className="text-blue-100 hover:text-white transition-colors">Support Center</Link>
          </div>
        </div>
      </div>

      {/* Main Navigation - Premium Glassmorphism */}
      <div className={`bg-white/95 backdrop-blur-xl transition-all duration-300 ${isScrolled ? 'py-3 shadow-xl border-b border-gray-100' : 'py-5 shadow-sm border-b border-gray-100'}`}>
        <div className="container flex justify-between items-center">
          
          {/* Logo with Glow Effect */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
              <img src='/logo.png' alt='logo' className='relative h-12 md:h-14 object-contain' />
            </div>
          </Link>

          {/* Desktop Navigation with Advanced Mega Menus */}
          <nav className="hidden lg:flex items-center gap-8">
            
            {/* Walk-in Cooler & Freezer Dropdown */}
            <div className="relative group py-2">
              <Link href="/walk-in-cooler-freezer" className="text-[14px] font-extrabold uppercase tracking-wider text-gray-800 hover:text-blue-600 transition-all flex items-center gap-1.5 cursor-pointer">
                Walk-in Cooler & Freezer 
                <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300 text-blue-600" />
              </Link>
              
              <div className="absolute top-full left-0 w-[540px] bg-white/95 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] rounded-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 p-6 z-50 transform translate-y-2 group-hover:translate-y-0">
                <div className="flex gap-6 items-center">
                  <div className="flex flex-col gap-2 flex-1">
                    <p className="text-[11px] font-black uppercase tracking-widest text-blue-600 mb-1 flex items-center gap-1">
                      <Sparkles size={12} /> Featured Categories
                    </p>
                    {[
                      { label: 'Walk-In Cooler', href: '/walk-in-cooler-freezer/walk-in-cooler-no-floor' },
                      { label: 'Walk-In Freezer', href: '/walk-in-cooler-freezer/walk-in-freezer-with-floor' },
                      { label: 'Walk-In Combo (Cooler & Freezer)', href: '/walk-in-cooler-freezer/walk-in-combo-cooler-freezer' }
                    ].map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onMouseEnter={() => setHoveredWalkInItem(walkInImages[item.label] || '/slider/s_1.jpeg')}
                        className="text-[13px] font-bold text-gray-600 hover:text-blue-600 hover:bg-blue-50/60 px-3 py-2.5 rounded-lg transition-all flex items-center justify-between group/item"
                      >
                        <span>{item.label}</span>
                        <ArrowRight size={14} className="opacity-0 group-hover/item:opacity-150 transform -translate-x-2 group-hover/item:translate-x-0 transition-all text-blue-600" />
                      </Link>
                    ))}
                  </div>
                  <div className="w-[200px] h-[160px] relative rounded-lg overflow-hidden shadow-md bg-gray-100 hidden sm:block">
                    <Image
                      key={hoveredWalkInItem}
                      src={hoveredWalkInItem}
                      alt="Walk-in Preview"
                      fill
                      className="object-cover transition-all duration-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Glassdoor Walk-in Cooler Dropdown */}
            <div className="relative group py-2">
              <Link href="/glassdoor-walk-in-cooler" className="text-[14px] font-extrabold uppercase tracking-wider text-gray-800 hover:text-blue-600 transition-all flex items-center gap-1.5 cursor-pointer">
                Glassdoor Walk-in
                <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300 text-blue-600" />
              </Link>
              
              <div className="absolute top-full left-0 w-[540px] bg-white/95 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] rounded-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 p-6 z-50 transform translate-y-2 group-hover:translate-y-0">
                <div className="flex gap-6 items-center">
                  <div className="flex flex-col gap-2 flex-1">
                    <p className="text-[11px] font-black uppercase tracking-widest text-blue-600 mb-1 flex items-center gap-1">
                      <Sparkles size={12} /> Retail Displays
                    </p>
                    {[
                      { label: 'Glassdoor Walk-in Cooler', href: '/glassdoor-walk-in-cooler/glassdoor-walk-in-cooler' },
                      { label: 'Glassdoor Walk-in Freezer', href: '/glassdoor-walk-in-cooler/glassdoor-walk-in-freezer' },
                      { label: 'Glassdoor', href: '/glassdoor-walk-in-cooler/glassdoor' }
                    ].map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onMouseEnter={() => setHoveredGlassdoorItem(glassdoorImages[item.label] || '/products/product_2.jpg')}
                        className="text-[13px] font-bold text-gray-600 hover:text-blue-600 hover:bg-blue-50/60 px-3 py-2.5 rounded-lg transition-all flex items-center justify-between group/item"
                      >
                        <span>{item.label}</span>
                        <ArrowRight size={14} className="opacity-0 group-hover/item:opacity-100 transform -translate-x-2 group-hover/item:translate-x-0 transition-all text-blue-600" />
                      </Link>
                    ))}
                  </div>
                  <div className="w-[200px] h-[160px] relative rounded-lg overflow-hidden shadow-md bg-gray-100 hidden sm:block">
                    <Image
                      key={hoveredGlassdoorItem}
                      src={hoveredGlassdoorItem}
                      alt="Glassdoor Preview"
                      fill
                      className="object-cover transition-all duration-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Refrigeration Equipment Dropdown */}
            <div className="relative group py-2">
              <Link href="/refrigeration-equipment" className="text-[14px] font-extrabold uppercase tracking-wider text-gray-800 hover:text-blue-600 transition-all flex items-center gap-1.5 cursor-pointer">
                Refrigeration Equipment
                <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300 text-blue-600" />
              </Link>
              
              <div className="absolute top-full left-0 w-[560px] bg-white/95 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] rounded-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 p-6 z-50 transform translate-y-2 group-hover:translate-y-0">
                <div className="flex gap-6 items-center">
                  <div className="flex flex-col gap-2 flex-1">
                    <p className="text-[11px] font-black uppercase tracking-widest text-blue-600 mb-1 flex items-center gap-1">
                      <Sparkles size={12} /> Systems & Units
                    </p>
                    {[
                      { label: 'Condensing Units', href: '/refrigeration-equipment/condensing-units' },
                      { label: 'Evaporation Units', href: '/refrigeration-equipment/evaporation-units' },
                      { label: 'Combo Units / Package Units', href: '/refrigeration-equipment/combo-units-package-units' }
                    ].map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onMouseEnter={() => setHoveredRefrigerationItem(refrigerationImages[item.label] || '/slider/s_1.jpeg')}
                        className="text-[13px] font-bold text-gray-600 hover:text-blue-600 hover:bg-blue-50/60 px-3 py-2.5 rounded-lg transition-all flex items-center justify-between group/item"
                      >
                        <span>{item.label}</span>
                        <ArrowRight size={14} className="opacity-0 group-hover/item:opacity-100 transform -translate-x-2 group-hover/item:translate-x-0 transition-all text-blue-600" />
                      </Link>
                    ))}
                  </div>
                  <div className="w-[200px] h-[160px] relative rounded-lg overflow-hidden shadow-md bg-gray-100 hidden sm:block">
                    <Image
                      key={hoveredRefrigerationItem}
                      src={hoveredRefrigerationItem}
                      alt="Refrigeration Preview"
                      fill
                      className="object-cover transition-all duration-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <Link href="/completed-projects" className="text-[14px] font-extrabold uppercase tracking-wider text-gray-800 hover:text-blue-600 transition-all py-2 cursor-pointer">
              Completed Projects
            </Link>
          </nav>

          {/* Action Buttons & Icons */}
          <div className="flex items-center gap-3">
            
            {/* Search Toggle & Popup */}
            <div className="relative search-container">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all cursor-pointer"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {isSearchOpen && (
                <div className="absolute top-full right-0 mt-3 bg-white shadow-2xl rounded-xl border border-gray-100 p-3 w-80 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                  <form action="/search" method="GET" className="relative flex items-center">
                    <input
                      type="text"
                      name="q"
                      autoFocus
                      placeholder="Search coolers, freezers..."
                      className="w-full pl-4 pr-12 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 transition-all bg-gray-50 focus:bg-white font-medium"
                      required
                    />
                    <button type="submit" className="absolute right-2 p-2 text-blue-600 hover:scale-110 transition-transform cursor-pointer">
                      <Search size={18} />
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Shopping Cart */}
            <div className="relative">
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="p-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all cursor-pointer relative"
                aria-label="Cart"
              >
                <ShoppingCart size={20} />
                {cartItems.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 bg-blue-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-pulse">
                    {cartItems.length}
                  </span>
                )}
              </button>
              <FloatingCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            </div>

            {/* Get a Quote Button */}
            <Link
              href="/quote"
              className="hidden md:inline-flex items-center gap-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-7 py-3 rounded-lg font-bold text-[14px] uppercase tracking-wider transition-all transform hover:-translate-y-0.5 active:scale-95 shadow-lg shadow-blue-600/25 cursor-pointer"
            >
              <FileText size={18} />
              Get a Quote
            </Link>

            {/* Mobile Search Button */}
            <button
              className="lg:hidden p-3 hover:bg-gray-100 rounded-xl transition-all text-gray-800 cursor-pointer border border-gray-100 shadow-sm bg-white"
              onClick={() => setIsMobileSearchOpen(true)}
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-3 hover:bg-gray-100 rounded-xl transition-all text-gray-800 cursor-pointer border border-gray-100 shadow-sm bg-white"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Search Overlay ─────────────────────────────────────────── */}
      <div className={`fixed inset-0 z-[110] lg:hidden transition-all duration-300 ${isMobileSearchOpen ? 'opacity-100 visible' : 'opacity-100 invisible'}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileSearchOpen(false)} />
        <div className={`absolute top-0 left-0 right-0 bg-white shadow-2xl p-5 transition-transform duration-300 ${isMobileSearchOpen ? 'translate-y-0' : '-translate-y-full'}`}>
          <div className="flex items-center gap-3">
            <form action="/search" method="GET" className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-blue-600 focus-within:bg-white transition-all">
              <Search size={18} className="text-gray-400 shrink-0" />
              <input
                type="text"
                name="q"
                autoFocus={isMobileSearchOpen}
                placeholder="Search products..."
                className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400 font-medium"
                required
              />
              <button type="submit" className="shrink-0 text-blue-600 font-bold text-sm cursor-pointer">Search</button>
            </form>
            <button onClick={() => setIsMobileSearchOpen(false)} className="p-3 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer">
              <X size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div className={`fixed inset-0 z-[100] bg-black/60 backdrop-blur-md lg:hidden transition-all duration-500 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setIsMobileMenuOpen(false)}>
        <div className={`absolute top-0 right-0 h-full w-[85%] max-w-[400px] bg-white transition-transform duration-500 transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col shadow-2xl`} onClick={(e) => e.stopPropagation()}>
          
          <div className="p-5 flex justify-between items-center border-b border-gray-100 shrink-0 bg-white">
            <img src='/logo.png' alt='logo' className='h-10 object-contain' />
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer">
              <X size={24} className="text-gray-800" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <nav className="flex flex-col space-y-2">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-extrabold uppercase text-gray-800 hover:text-blue-600 py-3 border-b border-gray-50 flex items-center justify-between">
                Home
              </Link>

              {mobileMenuData.map((category) => (
                <div key={category.label} className="border-b border-gray-50 pb-2">
                  <button
                    onClick={() => toggleMobileCategory(category.label)}
                    className="w-full flex items-center justify-between py-3 text-base font-extrabold uppercase text-gray-800 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    <span>{category.label}</span>
                    <ChevronDown size={18} className={`transition-transform duration-300 ${expandedMobileCategories.includes(category.label) ? 'rotate-180 text-blue-600' : 'text-gray-400'}`} />
                  </button>

                  {category.subItems && expandedMobileCategories.includes(category.label) && (
                    <div className="pl-4 py-2 space-y-2 bg-gray-50/50 rounded-xl mt-1">
                      {category.subItems.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block py-2 text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          • {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <Link href="/completed-projects" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-extrabold uppercase text-gray-800 hover:text-blue-600 py-3 border-b border-gray-50">
                Completed Projects
              </Link>
            </nav>

            <div className="pt-6">
              <Link
                href="/quote"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-extrabold uppercase text-center inline-flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer"
              >
                <FileText size={18} /> Get a Quote
              </Link>

              <div className="mt-8 bg-gray-50 p-5 rounded-2xl space-y-4">
                <a href="tel:+17186786005" className="flex items-center gap-3 text-gray-700 font-bold text-sm">
                  <Phone size={16} className="text-blue-600" /> +1 (718) 678-6005
                </a>
                <a href="mailto:sales@icemanz.com" className="flex items-center gap-3 text-gray-700 font-bold text-sm">
                  <Mail size={16} className="text-blue-600" /> sales@icemanz.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}