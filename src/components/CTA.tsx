import Link from 'next/link';
import { PhoneCall, FileText } from 'lucide-react';

export default function CTA() {
  return (
    <section className="py-16 md:py-24 bg-primary relative overflow-hidden text-white">
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-white opacity-5 rounded-full blur-3xl animate-pulse"></div>

      <div className="container relative z-10 text-center px-4 md:px-6">
        <h2 className="text-3xl md:text-5xl font-extrabold mb-6 md:mb-8 tracking-tight">
          Ready to Upgrade Your <span className="text-accent">Cold Storage</span>?
        </h2>
        <p className="text-lg md:text-xl text-blue-100 mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed">
          Contact us today to discuss your project requirements. Whether you need a standard quick-ship unit or a fully custom-built walk-in, ICEMANZ® has you covered.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
          <Link href="/quote" className="bg-accent text-white px-8 md:px-10 py-4 md:py-5 rounded-xl font-bold text-base md:text-lg flex items-center justify-center gap-3 hover:bg-orange-600 transition-all shadow-xl hover:scale-105 transform">
            <FileText size={24} /> Get a Quote Now
          </Link>
          <a href="tel:1-800-000-0000" className="bg-white text-primary px-8 md:px-10 py-4 md:py-5 rounded-xl font-bold text-base md:text-lg flex items-center justify-center gap-3 hover:bg-gray-100 transition-all shadow-xl hover:scale-105 transform">
            <PhoneCall size={24} /> Call 1-800-000-0000
          </a>
        </div>

        <p className="mt-10 md:mt-12 text-xs md:text-sm text-blue-200 font-medium tracking-wide uppercase">
          Trusted by Businesses Nationwide Since 2005
        </p>
      </div>
    </section>
  );
}
