import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FileText, Users, ShoppingBag, RotateCcw, AlertTriangle, Mail, ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'Terms & Conditions | Refrigeration Equipment & Walk-in Coolers',
  description: 'Terms and Conditions for using our website and purchasing our products.',
};

const sections = [
  { id: 'introduction', title: 'Introduction', icon: FileText },
  { id: 'user-responsibilities', title: 'User Responsibilities', icon: Users },
  { id: 'product-information', title: 'Product Information', icon: ShoppingBag },
  { id: 'returns-refunds', title: 'Returns & Refunds', icon: RotateCcw },
  { id: 'limitation-liability', title: 'Limitation of Liability', icon: AlertTriangle },
  { id: 'contact', title: 'Contact Us', icon: Mail },
];

export default function TermsAndConditionsPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      <Header />

      {/* Hero Section */}
      <div className="relative pt-32 pb-16 md:pt-40 md:pb-24 bg-gradient-to-b from-blue-50/50 to-transparent overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-blue-100/40 blur-3xl" />
          <div className="absolute top-[20%] -left-[10%] w-[40%] h-[40%] rounded-full bg-emerald-50/40 blur-3xl" />
        </div>
        
        <div className="max-w-[85rem] px-4 sm:px-6 lg:px-8 mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-xl shadow-sm mb-6 border border-gray-100">
            <FileText className="w-8 h-8 text-[#004a99]" />
          </div>
          <h1 className="text-2xl font-bold md:text-4xl md:leading-tight text-gray-800 uppercase tracking-tight mb-4">
            Terms & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#004a99] to-blue-500">Conditions</span>
          </h1>
          <p className="max-w-2xl mx-auto text-gray-600 leading-relaxed">
            Please read these terms and conditions carefully before using our website or purchasing our products. These terms govern your use of our services.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 max-w-[85rem] w-full px-4 sm:px-6 lg:px-8 mx-auto pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">
          
          {/* Sticky Sidebar Navigation */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-32 p-5 bg-white rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-4">On this page</h3>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="group w-full flex items-center justify-between text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-gray-600 hover:bg-blue-50 hover:text-[#004a99]"
                  >
                    <span className="flex items-center gap-3">
                      <section.icon className="w-4 h-4 text-gray-400 group-hover:text-[#004a99] transition-colors" />
                      {section.title}
                    </span>
                    <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-10">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10 space-y-12">
              
              {/* Section 1 */}
              <section id="introduction" className="scroll-mt-32 group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50/80 flex items-center justify-center shrink-0 group-hover:bg-[#004a99] group-hover:text-white transition-colors duration-300 text-[#004a99]">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">1. Introduction</h2>
                </div>
                <div className="text-gray-600 pl-0 md:pl-14 text-sm md:text-base">
                  <p className="leading-relaxed">
                    Welcome to our website. By accessing or using our website and services, you agree to comply with and be bound by these Terms and Conditions. If you disagree with any part of these terms, please do not use our website.
                  </p>
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* Section 2 */}
              <section id="user-responsibilities" className="scroll-mt-32 group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50/80 flex items-center justify-center shrink-0 group-hover:bg-[#004a99] group-hover:text-white transition-colors duration-300 text-[#004a99]">
                    <Users className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">2. User Responsibilities</h2>
                </div>
                <div className="text-gray-600 pl-0 md:pl-14 text-sm md:text-base">
                  <p className="leading-relaxed mb-4">
                    As a user of our website, you agree to:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Provide accurate, current, and complete information when making inquiries or purchases.</li>
                    <li>Use the website for lawful purposes only and not engage in any activity that could harm the website or its users.</li>
                    <li>Maintain the confidentiality of your account information and password.</li>
                  </ul>
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* Section 3 */}
              <section id="product-information" className="scroll-mt-32 group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50/80 flex items-center justify-center shrink-0 group-hover:bg-[#004a99] group-hover:text-white transition-colors duration-300 text-[#004a99]">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">3. Product Information</h2>
                </div>
                <div className="text-gray-600 pl-0 md:pl-14 text-sm md:text-base">
                  <p className="leading-relaxed">
                    We strive to ensure that all product descriptions, images, and prices on our website are accurate. However, errors may occur. We reserve the right to correct any errors, inaccuracies, or omissions, and to change or update information at any time without prior notice. We do not guarantee that the colors or details displayed on your screen will perfectly match the actual product.
                  </p>
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* Section 4 */}
              <section id="returns-refunds" className="scroll-mt-32 group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50/80 flex items-center justify-center shrink-0 group-hover:bg-[#004a99] group-hover:text-white transition-colors duration-300 text-[#004a99]">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">4. Returns & Refunds</h2>
                </div>
                <div className="text-gray-600 pl-0 md:pl-14 text-sm md:text-base">
                  <p className="leading-relaxed">
                    Due to the industrial nature of our refrigeration equipment and walk-in coolers, returns and refunds are subject to strict policies. Custom-built units are generally non-refundable. Standard products may be returned within a specific timeframe if they are unused and in their original packaging, subject to restocking fees. Please contact our support team to initiate any return process.
                  </p>
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* Section 5 */}
              <section id="limitation-liability" className="scroll-mt-32 group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50/80 flex items-center justify-center shrink-0 group-hover:bg-[#004a99] group-hover:text-white transition-colors duration-300 text-[#004a99]">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">5. Limitation of Liability</h2>
                </div>
                <div className="text-gray-600 pl-0 md:pl-14 text-sm md:text-base">
                  <p className="leading-relaxed">
                    To the fullest extent permitted by law, we shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising out of your use of, or inability to use, our website or products. This includes, but is not limited to, damages for loss of profits, data, or other intangible losses.
                  </p>
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* Section 6 */}
              <section id="contact" className="scroll-mt-32 group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50/80 flex items-center justify-center shrink-0 group-hover:bg-[#004a99] group-hover:text-white transition-colors duration-300 text-[#004a99]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">6. Contact Us</h2>
                </div>
                <div className="text-gray-600 pl-0 md:pl-14 text-sm md:text-base">
                  <p className="leading-relaxed">
                    If you have any questions or concerns regarding these Terms and Conditions, please don't hesitate to reach out to us. We are here to assist you.
                  </p>
                  
                  <div className="mt-6 p-5 bg-blue-50/50 rounded-xl border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h4 className="text-base font-bold text-gray-800">Have questions about our terms?</h4>
                      <p className="text-gray-500 text-sm mt-0.5">Our support team is available to help.</p>
                    </div>
                    <a href="/enquiry" className="px-5 py-2.5 bg-[#004a99] text-white text-sm font-bold rounded-lg hover:bg-blue-800 transition-colors whitespace-nowrap shadow-sm">
                      Contact Support
                    </a>
                  </div>
                </div>
              </section>

            </div>
            
            <div className="flex justify-center pb-10">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white rounded-full shadow-sm border border-gray-100">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <p className="text-xs font-semibold text-gray-500">
                  Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </main>
  );
}
