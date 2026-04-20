'use client';

import React, { useState } from 'react';
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
    AlertCircle
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
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        jobName: '',
        address: '',
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
        if (!formData.jobName) newErrors.jobName = 'Job name is required';
        if (!formData.address) newErrors.address = 'Installation address is required';
        
        // Ensure at least one system type is selected
        if (!formData.coolerSystemType && !formData.freezerSystemType) {
            newErrors.systemType = 'Please provide details for either a Cooler or a Freezer (System Type).';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
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
                        <p className="text-gray-500 mb-8 font-medium">Thank you for your interest. Our team will review your requirements and get back to you with a custom quotation shortly.</p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="w-full py-3 px-4 bg-[#004a99] hover:bg-blue-800 text-white rounded-lg font-bold transition-colors shadow-sm cursor-pointer"
                        >
                            Submit Another Request
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
                            Quote Request <span className="text-primary">Form</span>
                        </h2>
                        <p className="mt-1 text-gray-600">
                            Please fill out the form below with your project requirements. Our team will review the details and provide a customized quotation.
                        </p>
                    </div>

                    <div className="max-w-[50rem] mx-auto">
                        <form onSubmit={handleSubmit}>
                            <div className="grid gap-y-6">

                                {/* Section 1: General Information */}
                                <div className="flex flex-col bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden">
                                    <div className="p-4 md:p-7">
                                        <div className="flex items-center gap-x-3 mb-6">
                                            <div className="inline-flex justify-center items-center size-10 rounded-sm bg-blue-50 text-blue-600">
                                                <Info className="size-5" />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wider">
                                                General Information
                                            </h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                                            <div>
                                                <label htmlFor="date" className="block mb-2 text-sm font-bold text-gray-700">Date</label>
                                                <div className="relative">
                                                    <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} className={getInputClass()} />
                                                    <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4">
                                                        <Calendar className="size-4 text-gray-400" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <label htmlFor="jobName" className="block mb-2 text-sm font-bold text-gray-700">Job Name *</label>
                                                <div className="relative">
                                                    <input type="text" id="jobName" name="jobName" value={formData.jobName} onChange={handleChange} placeholder="Enter project or job name" className={getInputClass(errors.jobName)} />
                                                    <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4">
                                                        <Briefcase className="size-4 text-gray-400" />
                                                    </div>
                                                </div>
                                                <ErrorMsg msg={errors.jobName} />
                                            </div>

                                            <div className="md:col-span-2">
                                                <label htmlFor="address" className="block mb-2 text-sm font-bold text-gray-700">Installation Address *</label>
                                                <div className="relative">
                                                    <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} placeholder="Full installation address" className={getInputClass(errors.address)} />
                                                    <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4">
                                                        <MapPin className="size-4 text-gray-400" />
                                                    </div>
                                                </div>
                                                <ErrorMsg msg={errors.address} />
                                            </div>

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
                                                        <input type="text" name="voltage" value={formData.voltage} onChange={handleChange} placeholder="Voltage" className={getNoIconInputClass()} />
                                                    </div>
                                                    <div className="inline-flex rounded-sm shadow-sm border border-gray-300">
                                                        {['Single', '3 Phase'].map(p => (
                                                            <button
                                                                key={p}
                                                                type="button"
                                                                onClick={() => updateField('phase', p)}
                                                                className={`py-3 px-4 inline-flex items-center gap-x-2 text-xs font-bold -ms-px first:rounded-s-lg last:rounded-e-lg border-x border-transparent bg-white text-gray-800 hover:bg-gray-50 focus:z-10 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none cursor-pointer transition-all ${formData.phase === p ? 'bg-blue-50 text-blue-600 z-10' : ''}`}
                                                            >
                                                                {p}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2: Cooler Details */}
                                <div className="flex flex-col bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden">
                                    <div className="p-4 md:p-7">
                                        <div className="flex items-center gap-x-3 mb-6">
                                            <div className="inline-flex justify-center items-center size-10 rounded-sm bg-emerald-50 text-emerald-600">
                                                <Wind className="size-5" />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wider">
                                                Cooler Details
                                            </h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                                            <div className="md:col-span-2">
                                                <label className="block mb-2 text-sm font-bold text-gray-700">System Type *</label>
                                                <div className="grid sm:grid-cols-2 gap-2">
                                                    {[
                                                        { id: 'remote', label: 'Remote', sub: 'Condensing unit + Evaporator' },
                                                        { id: 'package', label: 'Package', sub: 'Top mount' }
                                                    ].map(type => (
                                                        <label key={type.id} className={`flex p-3 w-full bg-white border ${errors.systemType ? 'border-red-500 bg-red-50/30' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} rounded-sm text-sm cursor-pointer transition-all ${formData.coolerSystemType === type.label ? 'ring-2 ring-blue-500 border-blue-500 bg-blue-50' : ''}`}>
                                                            <input type="radio" name="coolerSystemType" value={type.label} checked={formData.coolerSystemType === type.label} onChange={(e) => { handleChange(e); setErrors(prev => { const n = {...prev}; delete n.systemType; return n; }) }} className="shrink-0 mt-0.5 border-gray-300 rounded-sm text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none cursor-pointer" />
                                                            <span className="text-sm text-gray-500 ms-3">
                                                                <span className="block font-bold text-gray-800">{type.label}</span>
                                                                <span className="block text-xs">{type.sub}</span>
                                                            </span>
                                                        </label>
                                                    ))}
                                                </div>
                                                <ErrorMsg msg={errors.systemType} />
                                            </div>

                                            <div>
                                                <label className="block mb-2 text-sm font-bold text-gray-700">Required Temperature</label>
                                                <input type="text" name="coolerRequiredTemp" value={formData.coolerRequiredTemp} onChange={handleChange} placeholder="e.g. 35F to 38F" className={getNoIconInputClass()} />
                                            </div>

                                            <div>
                                                <label className="block mb-2 text-sm font-bold text-gray-700">Dimensions (W x D x H)</label>
                                                <input type="text" name="coolerDimension" value={formData.coolerDimension} onChange={handleChange} placeholder="e.g. 8' x 10' x 8'2'' H" className={getNoIconInputClass()} />
                                            </div>

                                            <div>
                                                <label className="block mb-2 text-sm font-bold text-gray-700">No. of Doors</label>
                                                <input type="text" name="coolerNoOfDoors" value={formData.coolerNoOfDoors} onChange={handleChange} placeholder="Quantity" className={getNoIconInputClass()} />
                                            </div>

                                            <div>
                                                <label className="block mb-2 text-sm font-bold text-gray-700">Door Size</label>
                                                <input type="text" name="coolerDoorSize" value={formData.coolerDoorSize} onChange={handleChange} placeholder="e.g. 36'' x 78''" className={getNoIconInputClass()} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 3: Freezer Details */}
                                <div className="flex flex-col bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden">
                                    <div className="p-4 md:p-7">
                                        <div className="flex items-center gap-x-3 mb-6">
                                            <div className="inline-flex justify-center items-center size-10 rounded-sm bg-blue-50 text-blue-600">
                                                <Box className="size-5" />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wider">
                                                Freezer Details
                                            </h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                                            <div className="md:col-span-2">
                                                <label className="block mb-2 text-sm font-bold text-gray-700">System Type *</label>
                                                <div className="grid sm:grid-cols-2 gap-2">
                                                    {[
                                                        { id: 'f-remote', label: 'Remote', sub: 'Condensing unit + Evaporator' },
                                                        { id: 'f-package', label: 'Package', sub: 'Top mount' }
                                                    ].map(type => (
                                                        <label key={type.id} className={`flex p-3 w-full bg-white border ${errors.systemType ? 'border-red-500 bg-red-50/30' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} rounded-sm text-sm cursor-pointer transition-all ${formData.freezerSystemType === type.label ? 'ring-2 ring-blue-500 border-blue-500 bg-blue-50' : ''}`}>
                                                            <input type="radio" name="freezerSystemType" value={type.label} checked={formData.freezerSystemType === type.label} onChange={(e) => { handleChange(e); setErrors(prev => { const n = {...prev}; delete n.systemType; return n; }) }} className="shrink-0 mt-0.5 border-gray-300 rounded-sm text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none cursor-pointer" />
                                                            <span className="text-sm text-gray-500 ms-3">
                                                                <span className="block font-bold text-gray-800">{type.label}</span>
                                                                <span className="block text-xs">{type.sub}</span>
                                                            </span>
                                                        </label>
                                                    ))}
                                                </div>
                                                <ErrorMsg msg={errors.systemType} />
                                            </div>

                                            <div>
                                                <label className="block mb-2 text-sm font-bold text-gray-700">Required Temperature</label>
                                                <input type="text" name="freezerRequiredTemp" value={formData.freezerRequiredTemp} onChange={handleChange} placeholder="e.g. -10F to 0F" className={getNoIconInputClass()} />
                                            </div>

                                            <div>
                                                <label className="block mb-2 text-sm font-bold text-gray-700">Dimensions (W x D x H)</label>
                                                <input type="text" name="freezerDimension" value={formData.freezerDimension} onChange={handleChange} placeholder="e.g. 8' x 10' x 8'2'' H" className={getNoIconInputClass()} />
                                            </div>

                                            <div>
                                                <label className="block mb-2 text-sm font-bold text-gray-700">No. of Doors</label>
                                                <input type="text" name="freezerNoOfDoors" value={formData.freezerNoOfDoors} onChange={handleChange} placeholder="Quantity" className={getNoIconInputClass()} />
                                            </div>

                                            <div>
                                                <label className="block mb-2 text-sm font-bold text-gray-700">Door Size</label>
                                                <input type="text" name="freezerDoorSize" value={formData.freezerDoorSize} onChange={handleChange} placeholder="e.g. 36'' x 78''" className={getNoIconInputClass()} />
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
                                                Additional Information
                                            </h3>
                                        </div>

                                        <textarea id="additionalInfo" name="additionalInfo" value={formData.additionalInfo} onChange={handleChange} className={getNoIconInputClass()} rows={4} placeholder="Tell us more about your specific requirements..."></textarea>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="mt-6 flex justify-end">
                                    <button 
                                        type="submit" 
                                        disabled={isSubmitting}
                                        className="py-3 px-8 inline-flex items-center gap-x-2 text-sm font-black uppercase tracking-widest rounded-sm border border-transparent bg-[#004a99] text-white hover:bg-blue-800 focus:outline-none focus:bg-blue-800 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-lg shadow-blue-900/20 active:scale-95 cursor-pointer"
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Submit Quote Request'}
                                        {!isSubmitting && <Send className="size-4" />}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
