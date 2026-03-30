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
    Mail,
    Phone,
    Send,
    ChevronRight
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

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900">
            <Header />

            <div className="pt-32 pb-20 md:pt-40">
                <div className="container max-w-4xl px-4 md:px-6 mx-auto">
                    {/* Page Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 uppercase tracking-tight">
                            Quote Request <span className="text-blue-600">Form</span>
                        </h1>
                        <p className="text-slate-500 font-medium max-w-2xl mx-auto">
                            Please fill out the form below with your project requirements. Our team will review the details and provide a customized quotation for your refrigeration needs.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* General Information Section */}
                        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
                                    <Info size={24} />
                                </div>
                                <h2 className="text-xl font-black text-slate-900 uppercase tracking-wider">General Information</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Calendar size={14} /> Date
                                    </label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-[14px] font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Briefcase size={14} /> Job Name
                                    </label>
                                    <input
                                        type="text"
                                        name="jobName"
                                        placeholder="Enter project or job name"
                                        value={formData.jobName}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-[14px] font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    />
                                </div>

                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <MapPin size={14} /> Address
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        placeholder="Full installation address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-[14px] font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Thermometer size={14} /> Ambient Temperature
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {['80F', '90F', '95F', '100F'].map(temp => (
                                            <button
                                                key={temp}
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, ambientTemp: temp }))}
                                                className={`py-3 rounded-xl border-2 text-[12px] font-black transition-all cursor-pointer ${formData.ambientTemp === temp
                                                    ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md'
                                                    : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'
                                                    }`}
                                            >
                                                {temp}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Zap size={14} /> Electric Voltage & Phase
                                    </label>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <input
                                            type="text"
                                            name="voltage"
                                            placeholder="Voltage (e.g. 208/230v)"
                                            value={formData.voltage}
                                            onChange={handleChange}
                                            className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-[14px] font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        />
                                        <div className="grid grid-cols-2 gap-2">
                                            {['Single', '3 Phase'].map(p => (
                                                <button
                                                    key={p}
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, phase: p }))}
                                                    className={`px-4 py-3 rounded-xl border-2 text-[12px] font-black transition-all cursor-pointer whitespace-nowrap ${formData.phase === p
                                                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md'
                                                        : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'
                                                        }`}
                                                >
                                                    {p}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Cooler Section */}
                        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
                                    <Wind size={24} />
                                </div>
                                <h2 className="text-xl font-black text-slate-900 uppercase tracking-wider">Cooler Details</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                <div className="space-y-4">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">System Type</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {[
                                            { id: 'remote', label: 'Remote', sub: '(Condensing unit + Evaporator)' },
                                            { id: 'package', label: 'Package', sub: '(Top mount)' }
                                        ].map(type => (
                                            <button
                                                key={type.id}
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, coolerSystemType: type.label }))}
                                                className={`flex-1 p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${formData.coolerSystemType === type.label
                                                    ? 'border-blue-600 bg-blue-50 shadow-md'
                                                    : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                                                    }`}
                                            >
                                                <span className={`block text-[13px] font-black uppercase tracking-tight ${formData.coolerSystemType === type.label ? 'text-blue-700' : 'text-slate-900'}`}>{type.label}</span>
                                                <span className="block text-[10px] font-bold text-slate-400 mt-1 uppercase leading-tight">{type.sub}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Thermometer size={14} /> Required Temperature
                                    </label>
                                    <input
                                        type="text"
                                        name="coolerRequiredTemp"
                                        placeholder="e.g. 35F to 38F"
                                        value={formData.coolerRequiredTemp}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-[14px] font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Maximize size={14} /> Dimensions (W x D x H)
                                    </label>
                                    <input
                                        type="text"
                                        name="coolerDimension"
                                        placeholder="e.g. 8' x 10' x 8'2'' H"
                                        value={formData.coolerDimension}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-[14px] font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <Box size={14} /> No. of Doors
                                        </label>
                                        <input
                                            type="text"
                                            name="coolerNoOfDoors"
                                            placeholder="Quantity"
                                            value={formData.coolerNoOfDoors}
                                            onChange={handleChange}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-[14px] font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <DoorOpen size={14} /> Door Size
                                        </label>
                                        <input
                                            type="text"
                                            name="coolerDoorSize"
                                            placeholder="e.g. 36'' x 78''"
                                            value={formData.coolerDoorSize}
                                            onChange={handleChange}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-[14px] font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Freezer Section */}
                        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
                                    <Box size={24} />
                                </div>
                                <h2 className="text-xl font-black text-slate-900 uppercase tracking-wider">Freezer Details</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                <div className="space-y-4">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">System Type</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {[
                                            { id: 'f-remote', label: 'Remote', sub: '(Condensing unit + Evaporator)' },
                                            { id: 'f-package', label: 'Package', sub: '(Top mount)' }
                                        ].map(type => (
                                            <button
                                                key={type.id}
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, freezerSystemType: type.label }))}
                                                className={`flex-1 p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${formData.freezerSystemType === type.label
                                                    ? 'border-blue-600 bg-blue-50 shadow-md'
                                                    : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                                                    }`}
                                            >
                                                <span className={`block text-[13px] font-black uppercase tracking-tight ${formData.freezerSystemType === type.label ? 'text-blue-700' : 'text-slate-900'}`}>{type.label}</span>
                                                <span className="block text-[10px] font-bold text-slate-400 mt-1 uppercase leading-tight">{type.sub}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Thermometer size={14} /> Required Temperature
                                    </label>
                                    <input
                                        type="text"
                                        name="freezerRequiredTemp"
                                        placeholder="e.g. -10F to 0F"
                                        value={formData.freezerRequiredTemp}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-[14px] font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Maximize size={14} /> Dimensions (W x D x H)
                                    </label>
                                    <input
                                        type="text"
                                        name="freezerDimension"
                                        placeholder="e.g. 8' x 10' x 8'2'' H"
                                        value={formData.freezerDimension}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-[14px] font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <Box size={14} /> No. of Doors
                                        </label>
                                        <input
                                            type="text"
                                            name="freezerNoOfDoors"
                                            placeholder="Quantity"
                                            value={formData.freezerNoOfDoors}
                                            onChange={handleChange}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-[14px] font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <DoorOpen size={14} /> Door Size
                                        </label>
                                        <input
                                            type="text"
                                            name="freezerDoorSize"
                                            placeholder="e.g. 36'' x 78''"
                                            value={formData.freezerDoorSize}
                                            onChange={handleChange}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-[14px] font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Information Section */}
                        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
                                    <Info size={24} />
                                </div>
                                <h2 className="text-xl font-black text-slate-900 uppercase tracking-wider">Additional Information</h2>
                            </div>

                            <div className="space-y-2">
                                <textarea
                                    name="additionalInfo"
                                    rows={4}
                                    placeholder="Tell us more about your specific requirements, installation constraints, or any other details..."
                                    value={formData.additionalInfo}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 text-[14px] font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                ></textarea>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-4">
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3 text-slate-500">
                                    <Mail size={18} className="text-blue-600" />
                                    <span className="text-[13px] font-bold">kooltecnyc@gmail.com</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-500">
                                    <Phone size={18} className="text-blue-600" />
                                    <span className="text-[13px] font-bold">+1 (929) 451-7665</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="group bg-blue-600 hover:bg-blue-700 text-white py-5 px-12 rounded-2xl font-black text-[14px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-100 hover:shadow-blue-200 hover:-translate-y-1 active:translate-y-0 w-full md:w-auto cursor-pointer"
                            >
                                Submit Quote Request
                                <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <Footer />
        </main>
    );
}
