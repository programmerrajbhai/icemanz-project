'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-[#0a101d] text-gray-300 pt-20 pb-8 border-t border-white/5">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">

          {/* Brand & Vision Column */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="inline-block cursor-pointer">
              <img src='/logo.png' alt='logo' className='h-12 relative' />
            </Link>
            <p className="text-gray-400 leading-relaxed max-w-sm text-[14px]">
              Revolutionizing cold storage with intelligent refrigeration. Built for performance, engineered for reliability, and delivered nationwide.
            </p>

            <div className="flex gap-3 pt-4">
              {[
                { icon: Facebook, href: '#' },
                { icon: Twitter, href: '#' },
                { icon: Instagram, href: '#' },
                { icon: Linkedin, href: '#' }
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:bg-primary hover:text-white transition-all duration-300 hover:-translate-y-1"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-2 lg:ml-auto">
            <h4 className="text-white text-[15px] font-bold mb-6">Exploration</h4>
            <ul className="space-y-4 text-[14px]">
              {[
                { name: 'Home', href: '/' },
                { name: 'Products', href: '/refrigeration-equipment' },
                { name: 'Services', href: '/services' },
                { name: 'Portfolio', href: '/completed-projects' },
                { name: 'About Us', href: '/#about' }
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-gray-400 hover:text-white hover:underline decoration-primary underline-offset-4 transition-all cursor-pointer">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Categories */}
          <div className="lg:col-span-2 lg:ml-auto">
            <h4 className="text-white text-[15px] font-bold mb-6">Solutions</h4>
            <ul className="space-y-4 text-[14px]">
              {[
                { name: 'Walk-In Coolers', href: '/walk-in-cooler-freezer/walk-in-cooler-no-floor' },
                { name: 'Walk-In Freezers', href: '/walk-in-cooler-freezer/walk-in-freezer-with-floor' },
                { name: 'Combo Units', href: '/walk-in-cooler-freezer/walk-in-combo-cooler-freezer' },
                { name: 'Glass Doors', href: '/walk-in-cooler-freezer' },
                { name: 'Custom Build', href: '/quote' }
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-gray-400 hover:text-white hover:underline decoration-primary underline-offset-4 transition-all cursor-pointer">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3 lg:ml-auto">
            <h4 className="text-white text-[15px] font-bold mb-6">Connect</h4>
            <div className="space-y-6">
              <a href="tel:929-451-7665" className="flex items-start gap-4 group cursor-pointer">
                <div className="mt-1 text-[#3b82f6] group-hover:text-white transition-colors">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[12px] text-gray-500 font-medium mb-1 uppercase tracking-wider">Voice Support</p>
                  <p className="text-gray-300 group-hover:text-white text-[14px] font-medium transition-colors">929-451-7665</p>
                </div>
              </a>

              <a href="mailto:sales@icemanz.com" className="flex items-start gap-4 group cursor-pointer">
                <div className="mt-1 text-[#3b82f6] group-hover:text-white transition-colors">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[12px] text-gray-500 font-medium mb-1 uppercase tracking-wider">Digital Enquiry</p>
                  <p className="text-gray-300 group-hover:text-white text-[14px] font-medium transition-colors">sales@icemanz.com</p>
                </div>
              </a>

              <div className="flex items-start gap-4 group cursor-pointer">
                <div className="mt-1 text-[#3b82f6] group-hover:text-white transition-colors">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-[12px] text-gray-500 font-medium mb-1 uppercase tracking-wider">Global HQ</p>
                  <p className="text-gray-300 group-hover:text-white text-[14px] font-medium leading-relaxed transition-colors">Brooklyn, <br />New York, USA</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[13px]">
          <div className="text-gray-500">
            © {currentYear} <span className="text-white font-semibold">ICEMANZ</span>. Precision Cold Storage.
          </div>

          <div className="flex gap-8">
            <Link href="/privacy" className="text-gray-500 hover:text-white transition-colors cursor-pointer">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-500 hover:text-white transition-colors cursor-pointer">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
