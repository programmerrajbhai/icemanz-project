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

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMobileCategories, setExpandedMobileCategories] = useState<string[]>([]);
  const [hoveredWalkInItem, setHoveredWalkInItem] = useState('/Walk-inCooler&Freezer/walkincoolers.jpg');
  const [hoveredGlassdoorItem, setHoveredGlassdoorItem] = useState('/products/product_2.jpg');

  const mobileMenuData = [
    {
      label: 'Walk-in Cooler & Freezer',
      href: '/walk-in-cooler-freezer',
      subItems: [
        { label: 'Walk In Coolers', href: '/walk-in-cooler-freezer/walk-in-coolers' },
        { label: 'Coolers With Floor', href: '/walk-in-cooler-freezer/coolers-with-floor' },
        { label: 'Walk In Freezers', href: '/walk-in-cooler-freezer/walk-in-freezer-units' },
        { label: 'Freezers With Floor', href: '/walk-in-cooler-freezer/freezers-with-floor' },
        { label: 'Combo Units', href: '/walk-in-cooler-freezer/combo-units' },
        { label: 'Portable Refrigeration', href: '/walk-in-cooler-freezer/portable-refrigeration' },
        { label: 'Drive-in Coolers Freezers', href: '/walk-in-cooler-freezer/drive-in-coolers-freezers' },
        { label: 'Doors and Parts', href: '/walk-in-cooler-freezer/new-cooler-freezer-doors' }
      ]
    },
    {
      label: 'Glassdoor Walk-in Cooler',
      href: '/walk-in-cooler-freezer',
      subItems: [
        { label: 'Glassdoor Walk-in Cooler', href: '/walk-in-cooler-freezer/walk-in-coolers' },
        { label: 'Glassdoor Walk-in Freezer', href: '/walk-in-cooler-freezer/walk-in-freezer-units' },
        { label: 'Glassdoor', href: '/walk-in-cooler-freezer' },
        { label: 'Shelving', href: '/refrigeration-equipment' }
      ]
    },
    {
      label: 'Refrigeration Equipment',
      href: '/refrigeration-equipment',
      subItems: [
        { label: 'Condensing units', href: '/refrigeration-equipment/condensing-units' },
        { label: 'Evaporation units', href: '/refrigeration-equipment/evaporation-units' },
        { label: 'Combo units / package unit', href: '/refrigeration-equipment/combo-unitspackage-units' }
      ]
    }
  ];

  const toggleMobileCategory = (label: string) => {
    setExpandedMobileCategories(prev =>
      prev.includes(label) ? prev.filter(c => c !== label) : [...prev, label]
    );
  };

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
    'Condensing units': '/category/refrigerationEquipment/condensingUnit.jpg',
    'Medium profile (Scroll compressor)': '/category/refrigerationEquipment/mediumProfile.jpg',
    'Evaporation units': '/category/refrigerationEquipment/evaporationUnit.jpg',
    'Combo units / package unit': '/category/refrigerationEquipment/packageUnit.jpg',
    'Low profile evaporator': '/category/refrigerationEquipment/lowProfileEvaporator.jpg',
    'Medium profile': '/category/refrigerationEquipment/mediumProfile.jpg',
    'Center mount': '/category/refrigerationEquipment/centerMount.jpg',
    'Thin profile evaporator': '/category/refrigerationEquipment/thinProfileEvaporator.jpg',
    'Refrigeration Equipment': '/category/refrigerationEquipment/condensingUnit.jpg'
  };

  const [hoveredRefrigerationItem, setHoveredRefrigerationItem] = useState('/category/refrigerationEquipment/condensingUnit.jpg');

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
              <div className="absolute top-full left-0 w-[500px] bg-white shadow-2xl rounded-sm border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 p-6 z-50">
                <div className="flex gap-8">
                  {/* Links Column */}
                  <div className="flex flex-col gap-1.5 flex-1">
                    {[
                      { label: 'Walk In Coolers', href: '/walk-in-cooler-freezer/walk-in-coolers' },
                      { label: 'Coolers With Floor', href: '/walk-in-cooler-freezer/coolers-with-floor' },
                      { label: 'Walk In Freezers', href: '/walk-in-cooler-freezer/walk-in-freezer-units' },
                      { label: 'Freezers With Floor', href: '/walk-in-cooler-freezer/freezers-with-floor' },
                      { label: 'Combo Units', href: '/walk-in-cooler-freezer/combo-units' },
                      { label: 'Portable Refrigeration', href: '/walk-in-cooler-freezer/portable-refrigeration' },
                      { label: 'Drive-in Coolers Freezers', href: '/walk-in-cooler-freezer/drive-in-coolers-freezers' },
                      { label: 'Doors and Parts', href: '/walk-in-cooler-freezer/new-cooler-freezer-doors' }
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
                  <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-sm p-3 overflow-hidden min-h-[180px] max-h-[220px]">
                    <img
                      key={hoveredWalkInItem}
                      src={hoveredWalkInItem}
                      alt="Walk-in Cooler Preview"
                      className="max-w-full h-auto rounded-sm shadow-sm"
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
              <div className="absolute top-full left-0 w-[500px] bg-white shadow-2xl rounded-sm border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 p-6 z-50">
                <div className="flex gap-8">
                  {/* Links Column */}
                  <div className="flex flex-col gap-1.5 flex-1">
                    {[
                      { label: 'Glassdoor Walk-in Cooler', href: '/walk-in-cooler-freezer/walk-in-coolers' },
                      { label: 'Glassdoor Walk-in Freezer', href: '/walk-in-cooler-freezer/walk-in-freezer-units' },
                      { label: 'Glassdoor', href: '/walk-in-cooler-freezer' },
                      { label: 'Shelving', href: '/refrigeration-equipment' }
                    ].map((item, index) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onMouseEnter={() => setHoveredGlassdoorItem(glassdoorImages[item.label])}
                        className={`text-[14px] font-bold transition-all py-1.5 hover:translate-x-1 inline-block ${index === 0 ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                  {/* Image Column */}
                  <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-sm p-3 overflow-hidden min-h-[180px] max-h-[220px]">
                    <img
                      key={hoveredGlassdoorItem}
                      src={hoveredGlassdoorItem}
                      alt="Glassdoor Cooler Preview"
                      className="max-w-full h-auto rounded-sm shadow-sm"
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
              <div className="absolute top-full left-0 w-[500px] bg-white shadow-2xl rounded-sm border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 p-6 z-50">
                <div className="flex gap-8">
                  {/* Links Column */}
                  <div className="flex flex-col gap-1.5 flex-1">
                    {[
                      { label: 'Condensing units', href: '/refrigeration-equipment/condensing-units' },
                      { label: 'Evaporation units', href: '/refrigeration-equipment/evaporation-units' },
                      { label: 'Combo units / package unit', href: '/refrigeration-equipment/combo-unitspackage-units' }
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
            <div className="hidden sm:flex items-center gap-1 mr-2">
              <button className="p-2.5 hover:bg-gray-100 rounded-sm transition-all text-gray-700 hover:text-primary cursor-pointer">
                <Search size={20} />
              </button>
              <button className="p-2.5 hover:bg-gray-100 rounded-sm transition-all text-gray-700 hover:text-primary relative group cursor-pointer">
                <ShoppingCart size={20} />
                <span className="absolute top-1.5 right-1.5 bg-accent text-white text-[10px] w-4 h-4 rounded-sm flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform">0</span>
              </button>
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
                  <div key={category.label} className="border-b border-gray-50">
                    <button
                      onClick={() => toggleMobileCategory(category.label)}
                      className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-all cursor-pointer group"
                    >
                      <span className="text-sm font-bold text-gray-800 group-hover:text-primary transition-colors">{category.label}</span>
                      <ChevronDown
                        size={18}
                        className={`text-gray-400 transition-transform duration-300 ${expandedMobileCategories.includes(category.label) ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {expandedMobileCategories.includes(category.label) && (
                      <div className="bg-gray-50/50 flex flex-col">
                        {category.subItems.map((item) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="px-10 py-4 text-sm font-bold text-gray-500 hover:text-primary hover:bg-white transition-all flex items-center justify-between group"
                          >
                            {item.label}
                            <div className="w-1.5 h-1.5 rounded-sm bg-primary/20 group-hover:bg-primary transition-colors"></div>
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
                <a href="tel:929-451-7665" className="flex items-center gap-4 text-gray-700 hover:text-primary transition-colors group">
                  <div className="w-10 h-10 rounded-sm bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <Phone size={18} className="text-primary" />
                  </div>
                  <span className="font-bold text-sm">929-451-7665</span>
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
