'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
    User,
    Mail,
    Phone,
    MessageSquare,
    Send,
    CheckCircle2,
    AlertCircle,
    Info,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import toast from 'react-hot-toast';

function ErrorMsg({ msg }: { msg?: string }) {
    if (!msg) return null;
    return (
        <p className="text-red-500 text-xs font-semibold mt-1.5 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1">
            <AlertCircle size={14} /> {msg}
        </p>
    );
}

const faqs = [
    {
        question: "What types of refrigeration equipment do you supply?",
        answer: "We supply a wide range of commercial refrigeration equipment including walk-in coolers, freezers, display cases, and custom refrigeration systems tailored for various industries."
    },
    {
        question: "Do you offer installation services?",
        answer: "Yes, our team of experienced technicians provides professional installation services for all the equipment we supply to ensure optimal performance and longevity."
    },
    {
        question: "How long does it take to get a custom quote?",
        answer: "Typically, we respond to all custom quote requests within 24-48 business hours. For highly complex projects, we may reach out for additional details before providing the final quote."
    },
    {
        question: "Do you provide maintenance and repair services?",
        answer: "Absolutely. We offer comprehensive maintenance plans and responsive repair services to keep your refrigeration systems running efficiently year-round."
    },
    {
        question: "What areas do you serve?",
        answer: "We primarily serve commercial clients across the region. Please contact us with your specific location, and we will confirm if we can accommodate your project."
    },
    {
        question: "Do your products come with a warranty?",
        answer: "Yes, all our new equipment comes with standard manufacturer warranties. We also offer extended warranty options and guarantee our installation workmanship."
    }
];

export default function EnquiryPage() {
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        message: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => {
                const newErrs = { ...prev };
                delete newErrs[name];
                return newErrs;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: Record<string, string> = {};
        if (!formData.fullName) newErrors.fullName = 'Full Name is required';
        if (!formData.phone) newErrors.phone = 'Phone Number is required';
        if (!formData.email) newErrors.email = 'Email Address is required';
        if (!formData.message) newErrors.message = 'Enquiry Message is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch('/api/enquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setIsSubmitted(true);
                toast.success('Enquiry submitted successfully!');
            } else {
                toast.error('Failed to submit enquiry request.');
            }
        } catch (error) {
            toast.error('Network error. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getInputClass = (error?: string) => `py-3 px-4 ps-11 block w-full border ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50/30 text-red-900' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} rounded-sm text-sm disabled:opacity-50 disabled:pointer-events-none transition-colors`;

    if (isSubmitted) {
        return (
            <main className="min-h-screen bg-gray-50 flex flex-col">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center pt-32 pb-20 px-4">
                    <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center animate-in zoom-in-95 duration-500">
                        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 size={40} />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-3">Enquiry Sent!</h2>
                        <p className="text-gray-500 mb-8 font-medium">Thank you for getting in touch. Our team will review your message and respond shortly.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full py-3 px-4 bg-[#004a99] hover:bg-blue-800 text-white rounded-lg font-bold transition-colors shadow-sm cursor-pointer"
                        >
                            Submit Another Enquiry
                        </button>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50">
            <Header />

            <div className="pt-32 pb-20 md:pt-40">
                <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
                    {/* Page Header */}
                    <div className="max-w-2xl text-center mx-auto mb-10 lg:mb-14">
                        <h2 className="text-2xl font-bold md:text-4xl md:leading-tight text-gray-800 uppercase tracking-tight">
                            General <span className="text-primary">Enquiry</span>
                        </h2>
                        <p className="mt-1 text-gray-600">
                            Have a question or need more information? Fill out the form below and we will get back to you as soon as possible.
                        </p>
                    </div>

                    <div className="max-w-[50rem] mx-auto">
                        <form onSubmit={handleSubmit}>
                            <div className="grid gap-y-6">

                                {/* Section 1: Contact Information */}
                                <div className="flex flex-col bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden">
                                    <div className="p-4 md:p-7">
                                        <div className="flex items-center gap-x-3 mb-6">
                                            <div className="inline-flex justify-center items-center size-10 rounded-sm bg-blue-50 text-blue-600">
                                                <Info className="size-5" />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wider">
                                                Contact Details
                                            </h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                                            <div className="md:col-span-2">
                                                <label htmlFor="fullName" className="block mb-2 text-sm font-bold text-gray-700">Full Name *</label>
                                                <div className="relative">
                                                    <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter your full name" className={getInputClass(errors.fullName)} />
                                                    <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4">
                                                        <User className="size-4 text-gray-400" />
                                                    </div>
                                                </div>
                                                <ErrorMsg msg={errors.fullName} />
                                            </div>

                                            <div>
                                                <label htmlFor="email" className="block mb-2 text-sm font-bold text-gray-700">Email Address *</label>
                                                <div className="relative">
                                                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" className={getInputClass(errors.email)} />
                                                    <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4">
                                                        <Mail className="size-4 text-gray-400" />
                                                    </div>
                                                </div>
                                                <ErrorMsg msg={errors.email} />
                                            </div>

                                            <div>
                                                <label htmlFor="phone" className="block mb-2 text-sm font-bold text-gray-700">Phone Number *</label>
                                                <div className="relative">
                                                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter your phone number" className={getInputClass(errors.phone)} />
                                                    <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4">
                                                        <Phone className="size-4 text-gray-400" />
                                                    </div>
                                                </div>
                                                <ErrorMsg msg={errors.phone} />
                                            </div>

                                            <div className="md:col-span-2">
                                                <label htmlFor="message" className="block mb-2 text-sm font-bold text-gray-700">Enquiry Message *</label>
                                                <div className="relative">
                                                    <textarea
                                                        id="message"
                                                        name="message"
                                                        rows={6}
                                                        value={formData.message}
                                                        onChange={handleChange}
                                                        placeholder="How can we help you?"
                                                        className={`py-3 px-4 ps-11 block w-full border ${errors.message ? 'border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50/30 text-red-900' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} rounded-sm text-sm disabled:opacity-50 disabled:pointer-events-none transition-colors resize-y`}
                                                    ></textarea>
                                                    <div className="absolute top-3 start-0 flex items-start pointer-events-none ps-4">
                                                        <MessageSquare className="size-4 text-gray-400" />
                                                    </div>
                                                </div>
                                                <ErrorMsg msg={errors.message} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="mt-4 flex justify-end gap-x-2">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="py-3 px-8 inline-flex justify-center items-center gap-x-2 text-sm font-bold rounded-sm border border-transparent bg-[#004a99] text-white hover:bg-blue-800 focus:outline-none focus:bg-blue-800 disabled:opacity-50 disabled:pointer-events-none transition-all uppercase tracking-wider cursor-pointer"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="animate-spin inline-block size-4 border-[2px] border-current border-t-transparent text-white rounded-full" role="status" aria-label="loading"></span>
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                Submit Enquiry <Send className="size-4" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* FAQ Section */}
                    <div className="max-w-[50rem] mx-auto mt-24">
                        <div className="text-center mb-10">
                            <h3 className="text-2xl font-bold md:text-3xl text-gray-800 uppercase tracking-tight">
                                Frequently Asked <span className="text-[#004a99]">Questions</span>
                            </h3>
                            <p className="mt-2 text-gray-600">
                                Here are some common questions we get from our customers.
                            </p>
                        </div>
                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <div key={index} className="bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden transition-all duration-200 hover:border-blue-300">
                                    <button
                                        type="button"
                                        onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                                        className="w-full flex justify-between items-center p-5 text-left font-bold text-gray-800 hover:bg-blue-50/50 transition-colors cursor-pointer"
                                    >
                                        <span className="pr-4">{faq.question}</span>
                                        {openFaqIndex === index ? (
                                            <ChevronUp className="size-5 text-blue-600 shrink-0" />
                                        ) : (
                                            <ChevronDown className="size-5 text-gray-400 shrink-0" />
                                        )}
                                    </button>
                                    <div
                                        className={`grid transition-all duration-300 ease-in-out ${openFaqIndex === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                                    >
                                        <div className="overflow-hidden">
                                            <div className="p-5 pt-0 text-gray-600 leading-relaxed border-t border-gray-100 mt-2">
                                                {faq.answer}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}