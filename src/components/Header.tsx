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
  ChevronRight,
  Clock,
  X,
  FileText,
  ArrowRight
} from 'lucide-react';
import FloatingCart from './FloatingCart';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const { cartItems, isCartOpen, setIsCartOpen } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMobileCategories, setExpandedMobileCategories] = useState<string[]>([]);
  const [hoveredWalkInItem, setHoveredWalkInItem] = useState<string | null>(null);
  const [hoveredGlassdoorItem, setHoveredGlassdoorItem] = useState('/products/product_2.jpg');

  const mobileMenuData = [
    {
      label: 'Refrigeration Equipment',
      href: '/refrigeration-equipment',
      subItems: [
        { label: 'Condensing Units', href: '/refrigeration-equipment/condensing-units' },
        { label: 'Evaporation Units', href: '/refrigeration-equipment/evaporation-units' },
        { label: 'Combo Units / Package Units', href: '/refrigeration-equipment/combo-units-package-units' }
      ]
    },
    {
      label: 'Walk-in Cooler & Freezer',
      href: '/walk-in-cooler-freezer',
      subItems: [
        { label: 'Walk-In Cooler No Floor', href: '/walk-in-cooler-freezer/walk-in-cooler-no-floor' },
        { label: 'Walk-In Cooler with Floor', href: '/walk-in-cooler-freezer/walk-in-cooler-with-floor' },
        { label: 'Walk-In Freezer With Floor', href: '/walk-in-cooler-freezer/walk-in-freezer-with-floor' },
        { label: 'Walk-In Combo (Cooler & Freezer)', href: '/walk-in-cooler-freezer/walk-in-combo-cooler-freezer' }
      ]
    },
    {
      label: 'Glassdoor Walk-in Cooler',
      href: '/glassdoor-walk-in-cooler',
      subItems: [
        { label: 'Glassdoor Walk-in Cooler', href: '/glassdoor-walk-in-cooler/glassdoor-walk-in-cooler' },
        { label: 'Glassdoor Walk-in Freezer', href: '/glassdoor-walk-in-cooler/glassdoor-walk-in-freezer' },
        { label: 'Glassdoor', href: '/glassdoor-walk-in-cooler/glassdoor' },
        { label: 'Shelving', href: '/glassdoor-walk-in-cooler/shelving' }
      ]
    }
  ];

  const toggleMobileCategory = (label: string) => {
    setExpandedMobileCategories(prev =>
      prev.includes(label) ? prev.filter(c => c !== label) : [...prev, label]
    );
  };

  const walkInImages: { [key: string]: string } = {
    'Quick Ship Walk-Ins': '/Walk-in-Cooler-Freezer/walkincoolers.jpg',
    'Custom Walk-Ins & Combos': '/Walk-in-Cooler-Freezer/combounits.jpg',
    'Custom Refrigerated Warehouse': '/slider/s_1.jpeg',
    'Shop By Brand': '/products/product_2.jpg',
    'Walk-In Refrigeration Units': '/category/refrigerationEquipment/condensingUnit.jpg',
    'Refrigeration Equipment': '/slider/s_1.jpeg'
  };

  const glassdoorImages: { [key: string]: string } = {
    'Glassdoor Walk-in Cooler': '/products/product_2.jpg',
    'Glassdoor Walk-in Freezer': '/slider/s_2.jpeg',
    'Glassdoor': '/slider/s_3.jpeg',
    'Shelving': '/products/product_1.jpg'
  };

  const refrigerationImages: { [key: string]: string } = {
    'Condensing Units': '/category/refrigerationEquipment/condensingUnit.jpg',
    'Medium profile (Scroll compressor)': '/category/refrigerationEquipment/mediumProfile.jpg',
    'Evaporation Units': '/category/refrigerationEquipment/evaporationUnit.jpg',
    'Combo Units / Package Units': '/category/refrigerationEquipment/packageUnit.jpg',
    'Low profile evaporator': '/category/refrigerationEquipment/lowProfileEvaporator.jpg',
    'Medium profile': '/category/refrigerationEquipment/mediumProfile.jpg',
    'Center mount': '/category/refrigerationEquipment/centerMount.jpg',
    'Thin profile evaporator': '/category/refrigerationEquipment/thinProfileEvaporator.jpg',
    'Refrigeration Equipment': '/category/refrigerationEquipment/condensingUnit.jpg'
  };

  const [hoveredRefrigerationItem, setHoveredRefrigerationItem] = useState('/category/refrigerationEquipment/condensingUnit.jpg');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      setIsSearchOpen(false); // Close search when scrolling
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close search when clicking outside
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
    <header className={`fixed left-0 right-0 z-50 transition-all duration-500 ease-in-out ${isScrolled ? 'lg:-top-[37px]' : 'top-0'}`}>


      {/* Top Bar - Refined Blue */}
      <div className="hidden lg:flex bg-[#003d80] text-white py-2.5 h-[37px] items-center border-b border-white/5">
        <div className="container flex justify-between items-center text-[12px] font-bold uppercase tracking-wider leading-none">
          <div className="flex gap-8" suppressHydrationWarning>
            <a href="tel:+17186786005" className="flex items-center gap-2 hover:text-blue-200 transition-colors">
              <Phone size={14} className="text-blue-300" /> +1 (718) 678-6005
            </a>
            <a href="mailto:sales@icemanz.com" className="flex items-center gap-2 hover:text-blue-200 transition-colors">
              <Mail size={14} className="text-blue-300" /> sales@icemanz.com
            </a>
          </div>
          <div className="flex items-center gap-8">
            <Link href="/enquiry" className="flex items-center gap-2 text-blue-50 hover:text-white transition-colors group cursor-pointer">
              <Clock size={14} className="text-blue-300 group-hover:text-white transition-colors" />
              <span className="text-white font-bold tracking-wider">General enquiry</span>
            </Link>
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
            <div className="relative group py-2">
              <Link href="/walk-in-cooler-freezer" className="text-[15px] font-bold text-gray-800 hover:text-primary transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap">
                Walk-in Cooler & Freezer <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
              </Link>
              {/* Mega Dropdown for Walk-in Cooler & Freezer */}
              <div
                className="absolute top-full left-0 w-[320px] bg-white shadow-2xl rounded-sm border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 p-0 z-50 overflow-hidden"
              >
                <div className="flex flex-col p-6 gap-1.5 transition-all duration-300">
                  {[
                    { label: 'Walk-In Cooler No Floor', href: '/walk-in-cooler-freezer/walk-in-cooler-no-floor' },
                    { label: 'Walk-In Cooler with Floor', href: '/walk-in-cooler-freezer/walk-in-cooler-with-floor' },
                    { label: 'Walk-In Freezer With Floor', href: '/walk-in-cooler-freezer/walk-in-freezer-with-floor' },
                    { label: 'Walk-In Combo (Cooler & Freezer)', href: '/walk-in-cooler-freezer/walk-in-combo-cooler-freezer' }
                  ].map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="text-[14px] font-bold transition-all py-2 hover:translate-x-1 flex items-center justify-between group/item text-gray-500 hover:text-primary"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <div className="relative group py-2">
              <button className="text-[15px] font-bold text-gray-800 hover:text-primary transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap focus:outline-none">
                Glassdoor Walk-in Cooler <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
              </button>
              {/* Mega Dropdown for Glassdoor Walk-in Cooler */}
              <div className="absolute top-full left-0 w-[300px] bg-white shadow-2xl rounded-sm border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 p-6 z-50">
                <div className="flex flex-col gap-1.5 flex-1">
                  {[
                    { label: 'Glassdoor Walk-in Cooler', href: '/glassdoor-walk-in-cooler/glassdoor-walk-in-cooler' },
                    { label: 'Glassdoor Walk-in Freezer', href: '/glassdoor-walk-in-cooler/glassdoor-walk-in-freezer' },
                    { label: 'Glassdoor', href: '/glassdoor-walk-in-cooler/glassdoor' },
                    { label: 'Shelving', href: '/glassdoor-walk-in-cooler/shelving' }
                  ].map((item, index) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="text-[14px] font-bold transition-all py-2 hover:translate-x-1 flex items-center justify-between group/item text-gray-500 hover:text-primary"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative group py-2">
              <Link href="/refrigeration-equipment" className="text-[15px] font-bold text-gray-800 hover:text-primary transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap">
                Refrigeration Equipment <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
              </Link>
              {/* Mega Dropdown for Refrigeration Equipment */}
              <div className="absolute top-full left-0 w-[500px] bg-white shadow-2xl rounded-sm border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 p-6 z-50">
                <div className="flex gap-8">
                  {/* Links Column */}
                  <div className="flex flex-col gap-1.5 flex-1">
                    {[
                      { label: 'Condensing Units', href: '/refrigeration-equipment/condensing-units' },
                      { label: 'Evaporation Units', href: '/refrigeration-equipment/evaporation-units' },
                      { label: 'Combo Units / Package Units', href: '/refrigeration-equipment/combo-units-package-units' }
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
                  <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-sm p-3 overflow-hidden min-h-[180px] max-h-[220px]">
                    <img
                      key={hoveredRefrigerationItem}
                      src={hoveredRefrigerationItem}
                      alt="Refrigeration Equipment Preview"
                      className="max-w-full h-auto rounded-sm shadow-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            <Link href="/completed-projects" className="text-[15px] font-bold text-gray-800 hover:text-primary transition-all relative group py-2 cursor-pointer whitespace-nowrap">
              Completed projects
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1 mr-2 relative search-container">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2.5 text-gray-600 hover:text-primary transition-colors cursor-pointer"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              <div className="relative">
                <button
                  onClick={() => setIsCartOpen(!isCartOpen)}
                  className="p-2.5 text-gray-600 hover:text-primary transition-colors cursor-pointer relative"
                  aria-label="Cart"
                >
                  <ShoppingCart size={20} />
                  {cartItems.length > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {cartItems.length}
                    </span>
                  )}
                </button>
                <FloatingCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
              </div>

              {isSearchOpen && (
                <div className="absolute top-full right-0 mt-2 bg-white shadow-xl rounded-sm border border-gray-100 p-2 w-72 z-50">
                  <form action="/search" method="GET" className="relative flex items-center">
                    <input
                      type="text"
                      name="q"
                      autoFocus
                      placeholder="Search products..."
                      className="w-full pl-4 pr-10 py-2.5 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-primary transition-all bg-gray-50 focus:bg-white"
                      required
                    />
                    <button type="submit" className="absolute right-1 p-2 text-gray-400 hover:text-primary transition-colors cursor-pointer">
                      <Search size={18} />
                    </button>
                  </form>
                </div>
              )}


            </div>

            <Link
              href="/quote"
              className="hidden md:inline-flex items-center gap-x-2 bg-primary hover:bg-blue-700 text-white px-7 py-3 rounded-sm font-bold text-[14px] transition-all focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none transform hover:shadow-xl active:scale-95 shadow-lg shadow-primary/20 cursor-pointer"
            >
              <FileText size={18} />
              Get a Quote
            </Link>

            <button
              className="lg:hidden p-3 hover:bg-gray-100 rounded-sm transition-all text-gray-900 cursor-pointer active:scale-90 border border-gray-100 shadow-sm bg-white"
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
          className={`absolute top-0 right-0 h-full w-[85%] max-w-[400px] bg-white transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col shadow-2xl`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile Menu Header - Fixed */}
          <div className="p-5 flex justify-between items-center border-b border-gray-100 shrink-0 bg-white z-10">
            <div className="flex items-center gap-2">
              <img src='/logo.png' alt='logo' className='h-12' />
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 hover:bg-gray-100 rounded-sm transition-colors cursor-pointer active:scale-90"
              aria-label="Close menu"
            >
              <X size={28} className="text-gray-900" />
            </button>
          </div>

          {/* Mobile Menu Body - Scrollable */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
            <nav className="flex flex-col text-sm font-bold text-gray-800">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-5 hover:text-primary transition-all cursor-pointer border-b border-gray-50 flex items-center justify-between group">
                Home
                <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </Link>

              <div className="py-2 border-t border-gray-50">
                {mobileMenuData.map((category) => (
                  <div key={category.label} className="border-b border-gray-50 flex flex-col">
                    {category.subItems && category.subItems.length > 0 ? (
                      // Clickable row for category with sub-items
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleMobileCategory(category.label);
                        }}
                        className="w-full flex items-center justify-between px-6 py-5 hover:bg-gray-50 transition-all cursor-pointer group"
                      >
                        <span className={`text-[15px] font-bold transition-colors ${expandedMobileCategories.includes(category.label) ? 'text-primary' : 'text-gray-800 group-hover:text-primary'}`}>
                          {category.label}
                        </span>
                        <ChevronDown
                          size={18}
                          className={`transition-transform duration-300 text-gray-400 group-hover:text-primary ${expandedMobileCategories.includes(category.label) ? 'rotate-180 text-primary' : ''}`}
                        />
                      </button>
                    ) : (
                      // Regular link for category without sub-items
                      <Link
                        href={category.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="w-full flex items-center justify-between px-6 py-5 hover:bg-gray-50 transition-all cursor-pointer group"
                      >
                        <span className="text-[15px] font-bold text-gray-800 group-hover:text-primary transition-colors">{category.label}</span>
                      </Link>
                    )}

                    {/* Submenu items */}
                    {category.subItems && category.subItems.length > 0 && (
                      <div
                        className={`bg-gray-50/80 overflow-hidden transition-all duration-300 ease-in-out ${expandedMobileCategories.includes(category.label)
                          ? 'max-h-[500px] opacity-100 py-2'
                          : 'max-h-0 opacity-0 py-0'
                          }`}
                      >
                        {category.subItems.map((subItem) => (
                          <Link
                            key={subItem.label}
                            href={subItem.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 w-full px-8 py-3 text-[14px] font-medium text-gray-600 hover:text-primary hover:bg-gray-100 transition-all group/sub"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover/sub:bg-primary transition-colors"></span>
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <Link href="/completed-projects" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-5 hover:text-primary transition-all cursor-pointer border-b border-gray-50 flex items-center justify-between group">
                Completed projects
                <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </Link>
            </nav>

            <div className="p-6 mt-4">
              <Link
                href="/quote"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full bg-primary text-white py-4 rounded-sm font-bold text-center inline-flex items-center justify-center gap-x-2 mb-8 shadow-xl shadow-primary/20 cursor-pointer active:scale-95 transition-all"
              >
                <FileText size={20} />
                Get a Quote
              </Link>

              <div className="space-y-5 bg-gray-50 p-6 rounded-sm">
                <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2">Contact Info</p>
                <a href="tel:+17186786005" className="flex items-center gap-4 text-gray-700 hover:text-primary transition-colors group">
                  <div className="w-10 h-10 rounded-sm bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <Phone size={18} className="text-primary" />
                  </div>
                  <span className="font-bold text-sm">+1 (718) 678-6005</span>
                </a>
                <a href="mailto:sales@icemanz.com" className="flex items-center gap-4 text-gray-700 hover:text-primary transition-colors group">
                  <div className="w-10 h-10 rounded-sm bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
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
