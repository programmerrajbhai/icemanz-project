import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 border-t border-gray-800">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">

          {/* Brand & Vision Column */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="inline-block cursor-pointer">
              <img src='/logo.png' alt='logo' className='h-12 relative' />
            </Link>
            <p className="text-gray-400 leading-relaxed max-w-sm text-[15px]">
              Revolutionizing cold storage with intelligent refrigeration. Built for performance, engineered for reliability, and delivered nationwide.
            </p>

            <div className="flex gap-3 pt-2">
              {[
                { icon: Facebook, href: '#' },
                { icon: Twitter, href: '#' },
                { icon: Instagram, href: '#' },
                { icon: Linkedin, href: '#' }
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:bg-primary hover:text-white transition-colors duration-200"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-2 lg:ml-auto">
            <h4 className="text-white font-semibold mb-6">Exploration</h4>
            <ul className="space-y-4 text-[15px]">
              {[
                { name: 'Home', href: '/' },
                { name: 'Products', href: '/products' },
                { name: 'Services', href: '/services' },
                { name: 'Portfolio', href: '/completed-projects' },
                { name: 'About Us', href: '/about-us' }
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
            <h4 className="text-white font-semibold mb-6">Solutions</h4>
            <ul className="space-y-4 text-[15px]">
              {[
                { name: 'Walk-In Coolers', href: '/products/walk-in-coolers' },
                { name: 'Walk-In Freezers', href: '/products/walk-in-freezers' },
                { name: 'Combo Units', href: '/products/combo-units' },
                { name: 'Glass Doors', href: '/products/glass-doors' },
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
            <h4 className="text-white font-semibold mb-6">Connect</h4>
            <div className="space-y-5">
              <a href="tel:929-451-7665" className="flex items-start gap-4 group cursor-pointer">
                <div className="mt-1 text-primary">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-[13px] text-gray-500 font-medium mb-0.5">Voice Support</p>
                  <p className="text-white font-medium group-hover:text-primary transition-colors">929-451-7665</p>
                </div>
              </a>

              <a href="mailto:sales@icemanz.com" className="flex items-start gap-4 group cursor-pointer">
                <div className="mt-1 text-primary">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-[13px] text-gray-500 font-medium mb-0.5">Digital Enquiry</p>
                  <p className="text-white font-medium group-hover:text-primary transition-colors">sales@icemanz.com</p>
                </div>
              </a>

              <div className="flex items-start gap-4">
                <div className="mt-1 text-primary">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-[13px] text-gray-500 font-medium mb-0.5">Global HQ</p>
                  <p className="text-white font-medium leading-relaxed">Brooklyn, <br />New York, USA</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-[14px]">
          <div className="text-gray-500">
            © {currentYear} <span className="text-gray-300 font-medium">ICEMANZ</span>. Precision Cold Storage.
          </div>

          <div className="flex gap-6">
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
