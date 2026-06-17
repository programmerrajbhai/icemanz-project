import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ShieldCheck, Cookie, CreditCard, Database, Share2, Mail, ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | Refrigeration Equipment & Walk-in Coolers',
  description: 'Privacy Policy for our website detailing how we handle your data.',
};

const sections = [
  { id: 'information-collected', title: 'Information Collected', icon: ShieldCheck },
  { id: 'cookies-usage', title: 'Cookies Usage', icon: Cookie },
  { id: 'payment-processing', title: 'Payment Processing', icon: CreditCard },
  { id: 'data-storage', title: 'How Customer Data is Stored', icon: Database },
  { id: 'third-party', title: 'Third-Party Services', icon: Share2 },
  { id: 'contact', title: 'Contact Information', icon: Mail },
];

export default function PrivacyPolicyPage() {
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
            <ShieldCheck className="w-8 h-8 text-[#004a99]" />
          </div>
          <h1 className="text-2xl font-bold md:text-4xl md:leading-tight text-gray-800 uppercase tracking-tight mb-4">
            Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#004a99] to-blue-500">Policy</span>
          </h1>
          <p className="max-w-2xl mx-auto text-gray-600 leading-relaxed">
            Your privacy is critically important to us. This policy outlines how we collect, use, and protect your personal data with the highest standards of security.
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
              <section id="information-collected" className="scroll-mt-32 group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50/80 flex items-center justify-center shrink-0 group-hover:bg-[#004a99] group-hover:text-white transition-colors duration-300 text-[#004a99]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">1. Information Collected</h2>
                </div>
                <div className="text-gray-600 pl-0 md:pl-14 text-sm md:text-base">
                  <p className="leading-relaxed">
                    We collect information that you provide directly to us when using our services. This includes personal information such as your name, email address, phone number, shipping and billing address, and any other details required to fulfill your orders, process quotes, or respond to your inquiries.
                  </p>
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* Section 2 */}
              <section id="cookies-usage" className="scroll-mt-32 group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50/80 flex items-center justify-center shrink-0 group-hover:bg-[#004a99] group-hover:text-white transition-colors duration-300 text-[#004a99]">
                    <Cookie className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">2. Cookies Usage</h2>
                </div>
                <div className="text-gray-600 pl-0 md:pl-14 text-sm md:text-base">
                  <p className="leading-relaxed">
                    Our website uses "cookies" to enhance your browsing experience. Cookies are small data files stored on your device that help us understand how you interact with our site, remember your preferences, and track session information. You can choose to disable cookies through your browser settings, though some features of our site may not function properly as a result.
                  </p>
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* Section 3 */}
              <section id="payment-processing" className="scroll-mt-32 group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50/80 flex items-center justify-center shrink-0 group-hover:bg-[#004a99] group-hover:text-white transition-colors duration-300 text-[#004a99]">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">3. Payment Processing</h2>
                </div>
                <div className="text-gray-600 pl-0 md:pl-14 text-sm md:text-base">
                  <p className="leading-relaxed">
                    All payment transactions are processed through secure, encrypted connections. We do not store your full credit card numbers or sensitive payment details on our servers. Your payment information is securely transmitted directly to our trusted payment processors to ensure maximum security.
                  </p>
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* Section 4 */}
              <section id="data-storage" className="scroll-mt-32 group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50/80 flex items-center justify-center shrink-0 group-hover:bg-[#004a99] group-hover:text-white transition-colors duration-300 text-[#004a99]">
                    <Database className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">4. How Customer Data is Stored</h2>
                </div>
                <div className="text-gray-600 pl-0 md:pl-14 text-sm md:text-base">
                  <p className="leading-relaxed">
                    The security of your personal information is extremely important to us. We implement industry-standard security measures to protect your data from unauthorized access, alteration, disclosure, or destruction. Your data is stored securely in our databases and is only accessible to authorized personnel who require it to perform their duties.
                  </p>
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* Section 5 */}
              <section id="third-party" className="scroll-mt-32 group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50/80 flex items-center justify-center shrink-0 group-hover:bg-[#004a99] group-hover:text-white transition-colors duration-300 text-[#004a99]">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">5. Third-Party Services</h2>
                </div>
                <div className="text-gray-600 pl-0 md:pl-14 text-sm md:text-base">
                  <p className="leading-relaxed mb-6">
                    We utilize several trusted third-party services to operate our business efficiently and provide you with the best experience. These include:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-[#f8fafc] p-5 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all duration-300">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-sm">
                          <span className="text-sm font-bold text-[#004a99]">Q</span>
                        </div>
                        <h4 className="text-base font-bold text-gray-800">QuickBooks</h4>
                      </div>
                      <p className="text-gray-500 text-sm leading-relaxed">Used for accounting, invoicing, and managing financial records securely.</p>
                    </div>
                    
                    <div className="bg-[#f8fafc] p-5 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all duration-300">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-sm">
                          <span className="text-sm font-bold text-[#004a99]">$</span>
                        </div>
                        <h4 className="text-base font-bold text-gray-800">Stripe & PayPal</h4>
                      </div>
                      <p className="text-gray-500 text-sm leading-relaxed">Secure payment gateways used to process your transactions safely.</p>
                    </div>
                    
                    <div className="bg-[#f8fafc] p-5 rounded-xl border border-gray-100 md:col-span-2 hover:border-blue-200 hover:shadow-sm transition-all duration-300">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-sm">
                          <span className="text-sm font-bold text-[#004a99]">G</span>
                        </div>
                        <h4 className="text-base font-bold text-gray-800">Google Analytics</h4>
                      </div>
                      <p className="text-gray-500 text-sm leading-relaxed">Used to track website traffic, user behavior, and help us improve our website's performance and user experience.</p>
                    </div>
                  </div>
                  
                  <p className="leading-relaxed">
                    These third-party services have their own privacy policies addressing how they use your information. We recommend reviewing their respective policies for more details.
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
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">6. Contact Information</h2>
                </div>
                <div className="text-gray-600 pl-0 md:pl-14 text-sm md:text-base">
                  <p className="leading-relaxed">
                    If you have any questions, concerns, or requests regarding this Privacy Policy or how we handle your data, please contact us. You can reach out to us via the contact form on our website or by emailing our support team directly.
                  </p>
                  
                  <div className="mt-6 p-5 bg-blue-50/50 rounded-xl border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h4 className="text-base font-bold text-gray-800">Need more clarification?</h4>
                      <p className="text-gray-500 text-sm mt-0.5">Our support team is here to help you.</p>
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