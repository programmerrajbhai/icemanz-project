'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Phone, Mail, MessageSquare, Wrench, FileQuestion, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import Header from '@/components/Header';

export default function SupportPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    const faqs = [
        {
            question: "What areas do you service?",
            answer: "We provide nationwide delivery and installation services across the United States. Our network of certified technicians ensures your equipment is set up perfectly no matter where you are located."
        },
        {
            question: "Do you offer warranty on your walk-in coolers and freezers?",
            answer: "Yes, all our commercial refrigeration units come with a comprehensive warranty. We offer 1-year parts and labor warranty, and a 5-year compressor warranty on most models."
        },
        {
            question: "How long does delivery usually take?",
            answer: "Standard delivery typically takes 5-10 business days depending on your location. Custom builds may require 3-4 weeks for manufacturing and delivery."
        },
        {
            question: "Do you provide installation services?",
            answer: "Yes, we offer professional installation services. You can select the installation option during checkout or request it when getting a custom quote."
        },
        {
            question: "What should I do if my equipment stops working?",
            answer: "If you experience any issues, please contact our technical support line immediately at 929-451-7665. Have your order number and equipment model ready for faster service."
        }
    ];

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50 pb-20 font-sans">
                {/* Hero Section */}
                <div className="bg-[#05101e] pt-24 pb-32 px-6 relative border-b-4 border-[#0055ff] overflow-hidden">
                    {/* Background decorative elements */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
                        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#0055ff] blur-3xl"></div>
                        <div className="absolute top-1/2 -left-24 w-64 h-64 rounded-full bg-[#0055ff] blur-3xl"></div>
                    </div>

                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0055ff]/10 border border-[#0055ff]/20 text-[#0055ff] mb-6 text-sm font-medium">
                            <FileQuestion size={16} />
                            <span>Support Center</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">How can we help you?</h1>
                        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                            Our dedicated support team is here to assist you with any questions about our commercial refrigeration solutions, installation, or maintenance.
                        </p>
                    </div>
                </div>

                {/* Contact Cards */}
                <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                        {/* Sales */}
                        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100 hover:-translate-y-1 transition-all duration-300 text-center group">
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-[#0055ff] group-hover:text-white transition-colors text-[#0055ff]">
                                <MessageSquare size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Sales & Quotes</h3>
                            <p className="text-gray-600 mb-6 text-sm leading-relaxed">Need help choosing the right equipment or want a custom quote for your business?</p>
                            <a href="mailto:sales@icemanz.com" className="text-[#0055ff] font-semibold hover:underline block mb-3 text-lg">sales@icemanz.com</a>
                            <Link href="/quote" className="inline-flex mt-2 px-6 py-2.5 bg-[#0055ff] text-white rounded-lg font-medium hover:bg-[#0044cc] transition-colors shadow-lg shadow-blue-500/30">
                                Get a Quote
                            </Link>
                        </div>

                        {/* Tech Support */}
                        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100 hover:-translate-y-1 transition-all duration-300 text-center group">
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-[#0055ff] group-hover:text-white transition-colors text-[#0055ff]">
                                <Wrench size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Technical Support</h3>
                            <p className="text-gray-600 mb-6 text-sm leading-relaxed">Experiencing issues with your equipment? Our expert technicians are ready to help.</p>
                            <a href="tel:929-451-7665" className="text-[#0055ff] font-bold hover:underline block text-2xl mb-2">929-451-7665</a>
                            <p className="text-gray-500 text-sm font-medium bg-gray-50 py-1.5 px-3 rounded-md inline-block">Mon - Fri: 9AM - 6PM EST</p>
                        </div>

                        {/* General Inquiries */}
                        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100 hover:-translate-y-1 transition-all duration-300 text-center group">
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-[#0055ff] group-hover:text-white transition-colors text-[#0055ff]">
                                <MapPin size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Headquarters</h3>
                            <p className="text-gray-600 mb-6 text-sm leading-relaxed">Visit us or send mail to our main office in New York for general inquiries.</p>
                            <p className="text-gray-800 font-semibold mb-1 text-lg">Brooklyn, New York</p>
                            <p className="text-gray-500 text-sm mb-5">Serving nationwide USA</p>
                            <Link href="/enquiry" className="text-[#0055ff] font-semibold hover:underline flex items-center justify-center gap-1">
                                Send us a message
                            </Link>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="max-w-3xl mx-auto px-6 mt-28">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Frequently Asked Questions</h2>
                        <p className="text-gray-600 text-lg">Can't find the answer you're looking for? Reach out to our customer support team.</p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className={`bg-white border rounded-xl overflow-hidden transition-all duration-300 ${openFaq === index ? 'border-[#0055ff] shadow-md shadow-blue-500/10' : 'border-gray-200 hover:border-gray-300'}`}
                            >
                                <button
                                    className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                >
                                    <span className={`font-semibold pr-8 text-lg ${openFaq === index ? 'text-[#0055ff]' : 'text-gray-900'}`}>
                                        {faq.question}
                                    </span>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${openFaq === index ? 'bg-blue-50 text-[#0055ff]' : 'bg-gray-50 text-gray-400'}`}>
                                        {openFaq === index ? (
                                            <ChevronUp size={20} />
                                        ) : (
                                            <ChevronDown size={20} />
                                        )}
                                    </div>
                                </button>

                                <div
                                    className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? "max-h-40 pb-6 opacity-100" : "max-h-0 opacity-0"
                                        }`}
                                >
                                    <p className="text-gray-600 leading-relaxed border-t border-gray-100 pt-4 mt-2">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
