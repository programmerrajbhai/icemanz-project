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
    CheckCircle2
} from 'lucide-react';

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        alert('Quote request submitted successfully!');
    };

    const inputClasses = "py-3 px-4 ps-11 block w-full border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none transition-colors";
    const buttonBaseClasses = "inline-flex items-center gap-x-2 text-xs font-bold rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none cursor-pointer transition-all";

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
                                <div className="flex flex-col bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
                                    <div className="p-4 md:p-7">
                                        <div className="flex items-center gap-x-3 mb-6">
                                            <div className="inline-flex justify-center items-center size-10 rounded-lg bg-blue-50 text-blue-600">
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
                                                    <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} className={inputClasses} />
                                                    <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4">
                                                        <Calendar className="size-4 text-gray-400" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <label htmlFor="jobName" className="block mb-2 text-sm font-bold text-gray-700">Job Name</label>
                                                <div className="relative">
                                                    <input type="text" id="jobName" name="jobName" value={formData.jobName} onChange={handleChange} placeholder="Enter project or job name" className={inputClasses} />
                                                    <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4">
                                                        <Briefcase className="size-4 text-gray-400" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="md:col-span-2">
                                                <label htmlFor="address" className="block mb-2 text-sm font-bold text-gray-700">Installation Address</label>
                                                <div className="relative">
                                                    <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} placeholder="Full installation address" className={inputClasses} />
                                                    <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4">
                                                        <MapPin className="size-4 text-gray-400" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block mb-2 text-sm font-bold text-gray-700">Ambient Temperature</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {['80F', '90F', '95F', '100F'].map(temp => (
                                                        <button
                                                            key={temp}
                                                            type="button"
                                                            onClick={() => setFormData(prev => ({ ...prev, ambientTemp: temp }))}
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
                                                        <input type="text" name="voltage" value={formData.voltage} onChange={handleChange} placeholder="Voltage" className="py-3 px-4 block w-full border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 transition-colors" />
                                                    </div>
                                                    <div className="inline-flex rounded-lg shadow-sm border border-gray-300">
                                                        {['Single', '3 Phase'].map(p => (
                                                            <button
                                                                key={p}
                                                                type="button"
                                                                onClick={() => setFormData(prev => ({ ...prev, phase: p }))}
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
                                <div className="flex flex-col bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
                                    <div className="p-4 md:p-7">
                                        <div className="flex items-center gap-x-3 mb-6">
                                            <div className="inline-flex justify-center items-center size-10 rounded-lg bg-emerald-50 text-emerald-600">
                                                <Wind className="size-5" />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wider">
                                                Cooler Details
                                            </h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                                            <div className="md:col-span-2">
                                                <label className="block mb-2 text-sm font-bold text-gray-700">System Type</label>
                                                <div className="grid sm:grid-cols-2 gap-2">
                                                    {[
                                                        { id: 'remote', label: 'Remote', sub: 'Condensing unit + Evaporator' },
                                                        { id: 'package', label: 'Package', sub: 'Top mount' }
                                                    ].map(type => (
                                                        <label key={type.id} className={`flex p-3 w-full bg-white border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 cursor-pointer transition-all ${formData.coolerSystemType === type.label ? 'ring-2 ring-blue-500 border-blue-500 bg-blue-50' : ''}`}>
                                                            <input type="radio" name="coolerSystemType" value={type.label} checked={formData.coolerSystemType === type.label} onChange={handleChange} className="shrink-0 mt-0.5 border-gray-300 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none cursor-pointer" />
                                                            <span className="text-sm text-gray-500 ms-3">
                                                                <span className="block font-bold text-gray-800">{type.label}</span>
                                                                <span className="block text-xs">{type.sub}</span>
                                                            </span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block mb-2 text-sm font-bold text-gray-700">Required Temperature</label>
                                                <input type="text" name="coolerRequiredTemp" value={formData.coolerRequiredTemp} onChange={handleChange} placeholder="e.g. 35F to 38F" className="py-3 px-4 block w-full border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 transition-colors" />
                                            </div>

                                            <div>
                                                <label className="block mb-2 text-sm font-bold text-gray-700">Dimensions (W x D x H)</label>
                                                <input type="text" name="coolerDimension" value={formData.coolerDimension} onChange={handleChange} placeholder="e.g. 8' x 10' x 8'2'' H" className="py-3 px-4 block w-full border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 transition-colors" />
                                            </div>

                                            <div>
                                                <label className="block mb-2 text-sm font-bold text-gray-700">No. of Doors</label>
                                                <input type="text" name="coolerNoOfDoors" value={formData.coolerNoOfDoors} onChange={handleChange} placeholder="Quantity" className="py-3 px-4 block w-full border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 transition-colors" />
                                            </div>

                                            <div>
                                                <label className="block mb-2 text-sm font-bold text-gray-700">Door Size</label>
                                                <input type="text" name="coolerDoorSize" value={formData.coolerDoorSize} onChange={handleChange} placeholder="e.g. 36'' x 78''" className="py-3 px-4 block w-full border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 transition-colors" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 3: Freezer Details */}
                                <div className="flex flex-col bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
                                    <div className="p-4 md:p-7">
                                        <div className="flex items-center gap-x-3 mb-6">
                                            <div className="inline-flex justify-center items-center size-10 rounded-lg bg-blue-50 text-blue-600">
                                                <Box className="size-5" />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wider">
                                                Freezer Details
                                            </h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                                            <div className="md:col-span-2">
                                                <label className="block mb-2 text-sm font-bold text-gray-700">System Type</label>
                                                <div className="grid sm:grid-cols-2 gap-2">
                                                    {[
                                                        { id: 'f-remote', label: 'Remote', sub: 'Condensing unit + Evaporator' },
                                                        { id: 'f-package', label: 'Package', sub: 'Top mount' }
                                                    ].map(type => (
                                                        <label key={type.id} className={`flex p-3 w-full bg-white border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 cursor-pointer transition-all ${formData.freezerSystemType === type.label ? 'ring-2 ring-blue-500 border-blue-500 bg-blue-50' : ''}`}>
                                                            <input type="radio" name="freezerSystemType" value={type.label} checked={formData.freezerSystemType === type.label} onChange={handleChange} className="shrink-0 mt-0.5 border-gray-300 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none cursor-pointer" />
                                                            <span className="text-sm text-gray-500 ms-3">
                                                                <span className="block font-bold text-gray-800">{type.label}</span>
                                                                <span className="block text-xs">{type.sub}</span>
                                                            </span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block mb-2 text-sm font-bold text-gray-700">Required Temperature</label>
                                                <input type="text" name="freezerRequiredTemp" value={formData.freezerRequiredTemp} onChange={handleChange} placeholder="e.g. -10F to 0F" className="py-3 px-4 block w-full border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 transition-colors" />
                                            </div>

                                            <div>
                                                <label className="block mb-2 text-sm font-bold text-gray-700">Dimensions (W x D x H)</label>
                                                <input type="text" name="freezerDimension" value={formData.freezerDimension} onChange={handleChange} placeholder="e.g. 8' x 10' x 8'2'' H" className="py-3 px-4 block w-full border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 transition-colors" />
                                            </div>

                                            <div>
                                                <label className="block mb-2 text-sm font-bold text-gray-700">No. of Doors</label>
                                                <input type="text" name="freezerNoOfDoors" value={formData.freezerNoOfDoors} onChange={handleChange} placeholder="Quantity" className="py-3 px-4 block w-full border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 transition-colors" />
                                            </div>

                                            <div>
                                                <label className="block mb-2 text-sm font-bold text-gray-700">Door Size</label>
                                                <input type="text" name="freezerDoorSize" value={formData.freezerDoorSize} onChange={handleChange} placeholder="e.g. 36'' x 78''" className="py-3 px-4 block w-full border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 transition-colors" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 4: Additional Information */}
                                <div className="flex flex-col bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
                                    <div className="p-4 md:p-7">
                                        <div className="flex items-center gap-x-3 mb-6">
                                            <div className="inline-flex justify-center items-center size-10 rounded-lg bg-yellow-50 text-yellow-600">
                                                <Info className="size-5" />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wider">
                                                Additional Information
                                            </h3>
                                        </div>

                                        <textarea id="additionalInfo" name="additionalInfo" value={formData.additionalInfo} onChange={handleChange} className="py-3 px-4 block w-full border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none transition-colors" rows={4} placeholder="Tell us more about your specific requirements..."></textarea>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="mt-6 flex justify-end">
                                    <button type="submit" className="py-3 px-8 inline-flex items-center gap-x-2 text-sm font-black uppercase tracking-widest rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-lg shadow-blue-500/20 active:scale-95 cursor-pointer">
                                        Submit Quote Request
                                        <Send className="size-4" />
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
