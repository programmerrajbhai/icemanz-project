'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
    Calendar,
    Briefcase,
    MapPin,
    Thermometer,
    Zap,
    Wind,
    Box,
    Maximize,
    DoorOpen,
    Info,
    Send,
    User,
    CheckCircle2,
    AlertCircle,
    Mail,
    Phone,
    PackageSearch
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

export default function QuotePage() {
    const searchParams = useSearchParams();
    const productId = searchParams.get('product');

    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        jobName: '',
        address: '',
        fullName: '',
        email: '',
        phone: '',
        interestedProduct: productId ? `Product ID: ${productId}` : '',
        projectType: '',
        ambientTemp: '',
        voltage: '',
        phase: '',
        coolerSystemType: '',
        coolerRequiredTemp: '',
        coolerDimension: '',
        coolerNoOfDoors: '',
        coolerDoorSize: '',
        freezerSystemType: '',
        freezerRequiredTemp: '',
        freezerDimension: '',
        freezerNoOfDoors: '',
        freezerDoorSize: '',
        additionalInfo: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Fetch product name if productId is present in URL
    useEffect(() => {
        if (productId) {
            // In a real app, you might fetch the product details here to show the actual name
            // For now, we just set the ID in the form data
            setFormData(prev => ({ ...prev, interestedProduct: `Interested in Product: ${productId}` }));
        }
    }, [productId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

    const updateField = (name: string, value: string) => {
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
        if (!formData.email) newErrors.email = 'Email address is required';
        if (!formData.phone) newErrors.phone = 'Phone number is required';
        if (!formData.jobName) newErrors.jobName = 'Job name is required';
        if (!formData.address) newErrors.address = 'Installation address is required';
        if (!formData.projectType) newErrors.projectType = 'Please select a project type';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            toast.error('Please fill in all required fields.');
            // Scroll to top to show errors
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch('/api/quote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setIsSubmitted(true);
            } else {
                toast.error('Failed to submit quote request.');
            }
        } catch (error) {
            toast.error('Network error. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getInputClass = (error?: string) => `py-3 px-4 ps-11 block w-full border ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50/30 text-red-900' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} rounded-sm text-sm disabled:opacity-50 disabled:pointer-events-none transition-colors`;
    const getNoIconInputClass = (error?: string) => `py-3 px-4 block w-full border ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50/30 text-red-900' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} rounded-sm text-sm disabled:opacity-50 disabled:pointer-events-none transition-colors`;
    const buttonBaseClasses = "inline-flex items-center gap-x-2 text-xs font-bold rounded-sm border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none cursor-pointer transition-all";

    if (isSubmitted) {
        return (
            <main className="min-h-screen bg-gray-50 flex flex-col">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center pt-32 pb-20 px-4">
                    <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center animate-in zoom-in-95 duration-500">
                        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 size={40} />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-3">Quote Request Sent!</h2>
                        <p className="text-gray-500 mb-8 font-medium">Thank you for your interest. Our engineering team will review your requirements and get back to you with a custom quotation shortly.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full py-3 px-4 bg-[#004a99] hover:bg-blue-800 text-white rounded-lg font-bold transition-colors shadow-sm cursor-pointer"
                        >
                            Submit Another Request
                        </button>
                    </div>
                </div>
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
                            Request a <span className="text-primary">Project Quote</span>
                        </h2>
                        <p className="mt-1 text-gray-600">
                            Tell us about your refrigeration needs. Whether it's a single unit or a complete facility design, our experts will provide a customized solution.
                        </p>
                    </div>

                    <div className="max-w-[50rem] mx-auto">
                        <form onSubmit={handleSubmit}>
                            <div className="grid gap-y-6">

                                {/* Selected Product Info (Shows only if coming from a product page) */}
                                {productId && (
                                     <div className="bg-blue-50 border border-blue-200 p-4 rounded-sm shadow-sm flex items-start gap-4">
                                        <div className="mt-1 text-blue-600">
                                            <PackageSearch size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-blue-900 text-sm">Quote for Specific Product</h4>
                                            <p className="text-sm text-blue-800 mt-1">{formData.interestedProduct}</p>
                                        </div>
                                     </div>
                                )}

                                {/* Section 1: Project Details (New) */}
                                <div className="flex flex-col bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden">
                                    <div className="p-4 md:p-7">
                                        <div className="flex items-center gap-x-3 mb-6">
                                            <div className="inline-flex justify-center items-center size-10 rounded-sm bg-indigo-50 text-indigo-600">
                                                <Briefcase className="size-5" />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wider">
                                                Project Details
                                            </h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                                            <div className="md:col-span-2">
                                                <label className="block mb-2 text-sm font-bold text-gray-700">What are you looking for? *</label>
                                                <div className="grid sm:grid-cols-3 gap-2">
                                                    {['Walk-In Cooler', 'Walk-In Freezer', 'Combo Unit', 'Glass Door Unit', 'Refrigeration Equipment', 'Complete Facility Design'].map(type => (
                                                        <label key={type} className={`flex p-3 w-full bg-white border ${errors.projectType ? 'border-red-500 bg-red-50/30' : 'border-gray-300 focus:border-blue-500'} rounded-sm text-sm cursor-pointer transition-all ${formData.projectType === type ? 'ring-2 ring-blue-500 border-blue-500 bg-blue-50' : ''}`}>
                                                            <input type="radio" name="projectType" value={type} checked={formData.projectType === type} onChange={handleChange} className="shrink-0 mt-0.5 border-gray-300 rounded-sm text-blue-600 focus:ring-blue-500" />
                                                            <span className="text-sm text-gray-800 font-bold ms-3">{type}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                                <ErrorMsg msg={errors.projectType} />
                                            </div>
                                            
                                            <div>
                                                <label htmlFor="jobName" className="block mb-2 text-sm font-bold text-gray-700">Project / Job Name *</label>
                                                <div className="relative">
                                                    <input type="text" id="jobName" name="jobName" value={formData.jobName} onChange={handleChange} placeholder="e.g. Main Street Supermarket" className={getInputClass(errors.jobName)} />
                                                    <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4">
                                                        <Briefcase className="size-4 text-gray-400" />
                                                    </div>
                                                </div>
                                                <ErrorMsg msg={errors.jobName} />
                                            </div>

                                            <div className="">
                                                <label htmlFor="address" className="block mb-2 text-sm font-bold text-gray-700">Installation Address / ZIP *</label>
                                                <div className="relative">
                                                    <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} placeholder="Full address or ZIP code" className={getInputClass(errors.address)} />
                                                    <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4">
                                                        <MapPin className="size-4 text-gray-400" />
                                                    </div>
                                                </div>
                                                <ErrorMsg msg={errors.address} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2: Contact Information */}
                                <div className="flex flex-col bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden">
                                    <div className="p-4 md:p-7">
                                        <div className="flex items-center gap-x-3 mb-6">
                                            <div className="inline-flex justify-center items-center size-10 rounded-sm bg-blue-50 text-blue-600">
                                                <User className="size-5" />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wider">
                                                Contact Information
                                            </h3>
                                        </div>


                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">

                                            <div className="md:col-span-2">
                                                <label htmlFor="fullName" className="block mb-2 text-sm font-bold text-gray-700">Full Name / Company Name *</label>
                                                <div className="relative">
                                                    <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Your name or company" className={getInputClass(errors.fullName)} />
                                                    <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4">
                                                        <User className="size-4 text-gray-400" />
                                                    </div>
                                                </div>
                                                <ErrorMsg msg={errors.fullName} />
                                            </div>

                                            <div>
                                                <label htmlFor="email" className="block mb-2 text-sm font-bold text-gray-700">Email Address *</label>
                                                <div className="relative">
                                                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="Your email address" className={getInputClass(errors.email)} />
                                                    <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4">
                                                        <Mail className="size-4 text-gray-400" />
                                                    </div>
                                                </div>
                                                <ErrorMsg msg={errors.email} />
                                            </div>

                                            <div>
                                                <label htmlFor="phone" className="block mb-2 text-sm font-bold text-gray-700">Phone Number *</label>
                                                <div className="relative">
                                                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="Your phone number" className={getInputClass(errors.phone)} />
                                                    <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4">
                                                        <Phone className="size-4 text-gray-400" />
                                                    </div>
                                                </div>
                                                <ErrorMsg msg={errors.phone} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 3: Technical Specs (Optional for General Enquiries) */}
                                <div className="flex flex-col bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden">
                                    <div className="p-4 md:p-7">
                                        <div className="flex items-center gap-x-3 mb-6">
                                            <div className="inline-flex justify-center items-center size-10 rounded-sm bg-orange-50 text-orange-600">
                                                <Zap className="size-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wider">
                                                    Technical Specifications
                                                </h3>
                                                <p className="text-xs text-gray-500">Skip this section if you're unsure. Our experts will help you figure it out.</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 mb-6">
                                            <div>
                                                <label className="block mb-2 text-sm font-bold text-gray-700">Ambient Temperature</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {['80F', '90F', '95F', '100F'].map(temp => (
                                                        <button
                                                            key={temp}
                                                            type="button"
                                                            onClick={() => updateField('ambientTemp', temp)}
                                                            className={`${buttonBaseClasses} py-2 px-4 ${formData.ambientTemp === temp ? 'ring-2 ring-blue-500 border-blue-500 bg-blue-50 text-blue-600' : ''}`}
                                                        >
                                                            {temp}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block mb-2 text-sm font-bold text-gray-700">Electric Voltage & Phase</label>
                                                <div className="flex gap-x-2">
                                                    <div className="relative flex-1">
                                                        <input type="text" name="voltage" value={formData.voltage} onChange={handleChange} placeholder="Voltage (e.g. 115V, 230V)" className={getNoIconInputClass()} />
                                                    </div>
                                                    <div className="inline-flex rounded-sm shadow-sm">
                                                        {['Single', '3 Phase'].map(p => (
                                                            <button
                                                                key={p}
                                                                type="button"
                                                                onClick={() => updateField('phase', p)}
                                                                className={`py-3 px-4 inline-flex items-center justify-center gap-x-2 text-sm font-bold -ms-px first:rounded-s-sm last:rounded-e-sm border focus:z-10 focus:outline-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer transition-all min-w-[90px] ${formData.phase === p
                                                                    ? 'bg-blue-50 text-blue-600 border-blue-500 z-10 ring-1 ring-blue-500'
                                                                    : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
                                                                    }`}
                                                            >
                                                                {p}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-100 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Cooler Details */}
                                            <div className="space-y-4">
                                                <h4 className="font-bold text-sm text-blue-800 flex items-center gap-2"><Wind size={16}/> Cooler Requirements</h4>
                                                <div>
                                                    <label className="block mb-1 text-xs font-bold text-gray-700">Dimensions (W x D x H)</label>
                                                    <input type="text" name="coolerDimension" value={formData.coolerDimension} onChange={handleChange} placeholder="e.g. 8' x 10' x 8'2'' H" className={getNoIconInputClass()} />
                                                </div>
                                                <div>
                                                    <label className="block mb-1 text-xs font-bold text-gray-700">Required Temperature</label>
                                                    <input type="text" name="coolerRequiredTemp" value={formData.coolerRequiredTemp} onChange={handleChange} placeholder="e.g. 35F" className={getNoIconInputClass()} />
                                                </div>
                                                <div>
                                                    <label className="block mb-1 text-xs font-bold text-gray-700">Refrigeration Type</label>
                                                    <select name="coolerSystemType" value={formData.coolerSystemType} onChange={handleChange} className={getNoIconInputClass()}>
                                                        <option value="">Select Type</option>
                                                        <option value="Top Mount">Top Mount (Package)</option>
                                                        <option value="Remote">Remote</option>
                                                        <option value="Box Only">Box Only</option>
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Freezer Details */}
                                            <div className="space-y-4">
                                                <h4 className="font-bold text-sm text-blue-800 flex items-center gap-2"><Box size={16}/> Freezer Requirements</h4>
                                                <div>
                                                    <label className="block mb-1 text-xs font-bold text-gray-700">Dimensions (W x D x H)</label>
                                                    <input type="text" name="freezerDimension" value={formData.freezerDimension} onChange={handleChange} placeholder="e.g. 8' x 10' x 8'2'' H" className={getNoIconInputClass()} />
                                                </div>
                                                <div>
                                                    <label className="block mb-1 text-xs font-bold text-gray-700">Required Temperature</label>
                                                    <input type="text" name="freezerRequiredTemp" value={formData.freezerRequiredTemp} onChange={handleChange} placeholder="e.g. -10F" className={getNoIconInputClass()} />
                                                </div>
                                                <div>
                                                    <label className="block mb-1 text-xs font-bold text-gray-700">Refrigeration Type</label>
                                                    <select name="freezerSystemType" value={formData.freezerSystemType} onChange={handleChange} className={getNoIconInputClass()}>
                                                        <option value="">Select Type</option>
                                                        <option value="Top Mount">Top Mount (Package)</option>
                                                        <option value="Remote">Remote</option>
                                                        <option value="Box Only">Box Only</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 4: Additional Information */}
                                <div className="flex flex-col bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden">
                                    <div className="p-4 md:p-7">
                                        <div className="flex items-center gap-x-3 mb-6">
                                            <div className="inline-flex justify-center items-center size-10 rounded-sm bg-yellow-50 text-yellow-600">
                                                <Info className="size-5" />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wider">
                                                Additional Details
                                            </h3>
                                        </div>

                                        <label className="block mb-2 text-sm font-bold text-gray-700">Tell us more about your specific requirements, installation limits, or questions.</label>
                                        <textarea id="additionalInfo" name="additionalInfo" value={formData.additionalInfo} onChange={handleChange} className={getNoIconInputClass()} rows={4} placeholder="e.g. I need installation support, floor options, glass doors..."></textarea>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="mt-6 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="py-3 px-8 inline-flex items-center gap-x-2 text-sm font-black uppercase tracking-widest rounded-sm border border-transparent bg-[#004a99] text-white hover:bg-blue-800 focus:outline-none focus:bg-blue-800 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-lg shadow-blue-900/20 active:scale-95 cursor-pointer w-full md:w-auto justify-center"
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Request Project Quote'}
                                        {!isSubmitting && <Send className="size-4" />}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </main>
    );
}