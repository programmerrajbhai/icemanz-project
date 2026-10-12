'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import { 
  ArrowRight, ArrowLeft, CheckCircle2, Building2, 
  ThermometerSnowflake, Ruler, MapPin, Grid, Phone, Mail, User, Send
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function RecommendationQuizPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [answers, setAnswers] = useState({
    businessType: '',
    tempNeed: '',
    location: '',
    size: '',
    floor: '',
    fullName: '',
    email: '',
    phone: '',
  });

  const totalSteps = 6;

  const handleSelect = (field: string, value: string) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
    // Auto advance to next step after a short delay for better UX
    if (currentStep < totalSteps - 1) {
      setTimeout(() => setCurrentStep(prev => prev + 1), 400);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answers.fullName || !answers.email || !answers.phone) {
      toast.error('Please fill in all contact details.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Formatting answers to fit into the standard quote API
      const quoteData = {
        date: new Date().toISOString().split('T')[0],
        jobName: `${answers.businessType} Recommendation Request`,
        address: 'TBD',
        fullName: answers.fullName,
        email: answers.email,
        phone: answers.phone,
        projectType: 'Recommendation Quiz Lead',
        additionalInfo: `
          --- QUIZ ANSWERS ---
          Business Type: ${answers.businessType}
          Temperature Need: ${answers.tempNeed}
          Location: ${answers.location}
          Approx Size: ${answers.size}
          Floor Type: ${answers.floor}
        `
      };

      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quoteData)
      });

      if (res.ok) {
        setIsSubmitted(true);
      } else {
        toast.error('Failed to submit request.');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // UI rendering for different steps
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2 flex items-center justify-center gap-3"><Building2 className="text-blue-600"/> What best describes your business?</h2>
            <p className="text-gray-500 mb-8 text-center">This helps us recommend commercial-grade equipment suited for your industry.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['Restaurant / Cafe', 'Grocery / Supermarket', 'Convenience Store', 'Warehouse / Cold Storage', 'Floral / Agriculture', 'Other'].map(opt => (
                <button
                  key={opt}
                  onClick={() => handleSelect('businessType', opt)}
                  className={`p-6 border-2 rounded-xl text-left font-bold transition-all cursor-pointer ${answers.businessType === opt ? 'border-blue-600 bg-blue-50 text-blue-800 shadow-md transform scale-[1.02]' : 'border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-gray-50'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2 flex items-center justify-center gap-3"><ThermometerSnowflake className="text-blue-600"/> What temperature do you need?</h2>
            <p className="text-gray-500 mb-8 text-center">Select the primary cooling requirement for your products.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Cooler (Above 32°F)', sub: 'Produce, Beverages, Dairy' },
                { label: 'Freezer (Below 32°F)', sub: 'Meat, Ice Cream, Frozen Goods' },
                { label: 'Combo (Both)', sub: 'Dual temperature zones' }
              ].map(opt => (
                <button
                  key={opt.label}
                  onClick={() => handleSelect('tempNeed', opt.label)}
                  className={`p-6 border-2 rounded-xl text-center transition-all cursor-pointer ${answers.tempNeed === opt.label ? 'border-blue-600 bg-blue-50 text-blue-800 shadow-md transform scale-[1.02]' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}
                >
                  <div className="font-black text-lg text-gray-900 mb-2">{opt.label}</div>
                  <div className="text-sm text-gray-500 font-medium">{opt.sub}</div>
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2 flex items-center justify-center gap-3"><MapPin className="text-blue-600"/> Where will it be installed?</h2>
            <p className="text-gray-500 mb-8 text-center">Outdoor units require special weather-proof roofing and components.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['Indoors (Inside a building)', 'Outdoors (Exposed to weather)'].map(opt => (
                <button
                  key={opt}
                  onClick={() => handleSelect('location', opt)}
                  className={`p-6 border-2 rounded-xl text-center font-bold text-lg transition-all cursor-pointer ${answers.location === opt ? 'border-blue-600 bg-blue-50 text-blue-800 shadow-md transform scale-[1.02]' : 'border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-gray-50'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2 flex items-center justify-center gap-3"><Ruler className="text-blue-600"/> Approximate size needed?</h2>
            <p className="text-gray-500 mb-8 text-center">Don't worry if you aren't sure, we can adjust this later.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Small (Under 8x8 ft)', sub: 'Perfect for tight spaces' },
                { label: 'Medium (8x8 to 10x14 ft)', sub: 'Standard restaurant size' },
                { label: 'Large (Over 10x14 ft)', sub: 'High volume storage' },
                { label: 'Not Sure / Custom Size', sub: 'I need an expert to help me' }
              ].map(opt => (
                <button
                  key={opt.label}
                  onClick={() => handleSelect('size', opt.label)}
                  className={`p-6 border-2 rounded-xl text-left transition-all cursor-pointer ${answers.size === opt.label ? 'border-blue-600 bg-blue-50 text-blue-800 shadow-md transform scale-[1.02]' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}
                >
                  <div className="font-black text-gray-900 mb-1">{opt.label}</div>
                  <div className="text-sm text-gray-500 font-medium">{opt.sub}</div>
                </button>
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2 flex items-center justify-center gap-3"><Grid className="text-blue-600"/> Floor Type</h2>
            <p className="text-gray-500 mb-8 text-center">Freezers MUST have insulated floors. Coolers can often use existing concrete.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'I need an insulated floor', sub: 'Recommended for all freezers & wooden building floors' },
                { label: 'Floorless (No Floor)', sub: 'I have an insulated concrete pad ready' }
              ].map(opt => (
                <button
                  key={opt.label}
                  onClick={() => handleSelect('floor', opt.label)}
                  className={`p-6 border-2 rounded-xl text-left transition-all cursor-pointer ${answers.floor === opt.label ? 'border-blue-600 bg-blue-50 text-blue-800 shadow-md transform scale-[1.02]' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}
                >
                  <div className="font-black text-gray-900 mb-1">{opt.label}</div>
                  <div className="text-sm text-gray-500 font-medium">{opt.sub}</div>
                </button>
              ))}
            </div>
          </div>
        );
      case 6:
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-black text-gray-900 mb-2 text-center">We have your perfect match! 🎉</h2>
              <p className="text-gray-600 mb-6 text-center">Enter your details below to see your recommended {answers.tempNeed || 'refrigeration'} system and get instant pricing from our engineering team.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block mb-1.5 text-sm font-bold text-gray-700">Full Name</label>
                  <div className="relative">
                    <input type="text" value={answers.fullName} onChange={(e) => setAnswers({...answers, fullName: e.target.value})} className="py-3 px-4 ps-11 block w-full border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 text-sm" placeholder="John Doe" />
                    <User className="size-4 text-gray-400 absolute top-3.5 left-4" />
                  </div>
                </div>
                <div>
                  <label className="block mb-1.5 text-sm font-bold text-gray-700">Email Address</label>
                  <div className="relative">
                    <input type="email" value={answers.email} onChange={(e) => setAnswers({...answers, email: e.target.value})} className="py-3 px-4 ps-11 block w-full border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 text-sm" placeholder="john@company.com" />
                    <Mail className="size-4 text-gray-400 absolute top-3.5 left-4" />
                  </div>
                </div>
                <div>
                  <label className="block mb-1.5 text-sm font-bold text-gray-700">Phone Number</label>
                  <div className="relative">
                    <input type="tel" value={answers.phone} onChange={(e) => setAnswers({...answers, phone: e.target.value})} className="py-3 px-4 ps-11 block w-full border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 text-sm" placeholder="(555) 123-4567" />
                    <Phone className="size-4 text-gray-400 absolute top-3.5 left-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (isSubmitted) {
    return (
        <main className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <div className="flex-1 flex flex-col items-center justify-center pt-32 pb-20 px-4">
                <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md border border-gray-100 text-center animate-in zoom-in-95 duration-500">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={40} />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-3">Recommendation Ready!</h2>
                    <p className="text-gray-600 mb-8 font-medium leading-relaxed">
                      Thanks for telling us about your needs! Our engineering team is reviewing your answers and will email you the perfect <b>{answers.tempNeed}</b> configuration for your <b>{answers.businessType}</b> within the next 2 hours.
                    </p>
                    <Link
                        href="/"
                        className="w-full inline-block py-3 px-4 bg-[#004a99] hover:bg-blue-800 text-white rounded-lg font-bold transition-colors shadow-sm cursor-pointer"
                    >
                        Return to Homepage
                    </Link>
                </div>
            </div>
        </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-32 pb-20 md:pt-40 px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Progress Bar */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Step {currentStep} of {totalSteps}</span>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{Math.round((currentStep / totalSteps) * 100)}% Completed</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Quiz Content Container */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-12 min-h-[400px] flex flex-col justify-center">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8">
            <button 
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-6 py-3 font-bold rounded-lg transition-all ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:text-gray-900 cursor-pointer shadow-sm'}`}
            >
              <ArrowLeft size={18} /> Back
            </button>
            
            {currentStep < totalSteps ? (
              <button 
                onClick={handleNext}
                // Determine if we can proceed based on current step selection
                disabled={
                  (currentStep === 1 && !answers.businessType) ||
                  (currentStep === 2 && !answers.tempNeed) ||
                  (currentStep === 3 && !answers.location) ||
                  (currentStep === 4 && !answers.size) ||
                  (currentStep === 5 && !answers.floor)
                }
                className="flex items-center gap-2 px-8 py-3 font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Next <ArrowRight size={18} />
              </button>
            ) : (
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting || !answers.fullName || !answers.email}
                className="flex items-center gap-2 px-8 py-3 font-bold rounded-lg bg-[#cc3300] text-white hover:bg-[#b32d00] transition-all shadow-md shadow-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer uppercase tracking-wide"
              >
                {isSubmitting ? 'Sending...' : 'Get My Recommendation'} <Send size={18} />
              </button>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}