"use client";
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowRight, ArrowLeft, CheckCircle2, Send, X } from 'lucide-react';

/* ─────────────────────────────────────────────
   Related Products Sidebar
───────────────────────────────────────────── */
const relatedProducts = [
  {
    id: 1,
    brand: 'ICEMANZ',
    title: 'Standard Condensing Unit - 2HP',
    image: '/slider/s_1.jpeg',
    rating: 4,
    reviews: 117,
    price: '$1,249.99',
    href: '#',
  },
  {
    id: 2,
    brand: 'LIFEPROOF',
    title: 'Premium Evaporator Coil - High Efficiency',
    image: '/slider/s_2.jpeg',
    rating: 5,
    reviews: 3399,
    price: '$3.28 /sq. ft.',
    href: '#',
  },
  {
    id: 3,
    brand: 'LIFEPROOF',
    title: 'Industrial Scroll Compressor - Heavy Duty',
    image: '/slider/s_3.jpeg',
    rating: 4,
    reviews: 1377,
    price: '$3.29 /sq. ft.',
    href: '#',
  },
  {
    id: 4,
    brand: 'PERFORMANCE',
    title: 'Center Mount Cooling Unit - Low Velocity',
    image: '/Walk-inCooler&Freezer/walkincoolers.jpg',
    rating: 4,
    reviews: 142,
    price: '$31.83',
    href: '#',
  },
  {
    id: 5,
    brand: 'ICEMANZ',
    title: 'Walk-in Freezer Door Assembly',
    image: '/slider/s_1.jpeg',
    rating: 5,
    reviews: 84,
    price: '$899.00',
    href: '#',
  },
  {
    id: 6,
    brand: 'PERFORMANCE',
    title: 'LED Cooler Lighting Kit',
    image: '/slider/s_2.jpeg',
    rating: 4,
    reviews: 256,
    price: '$145.50',
    href: '#',
  },
];

function StarRating({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-3 h-3 ${star <= rating ? 'text-amber-400' : 'text-gray-200'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-[10px] text-gray-400 font-medium">({reviews})</span>
    </div>
  );
}

function RelatedProductsSidebar({
  suggestedProducts,
  addToQuote
}: {
  suggestedProducts: typeof relatedProducts;
  addToQuote: (product: typeof relatedProducts[0]) => void;
}) {
  return (
    <aside className="flex flex-col w-full xl:w-[350px] shrink-0 bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden self-start order-2 xl:order-1">



      {/* Suggested Products Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
        <span className="text-[#004a99] font-black text-base leading-none">+</span>
        <span className="text-[11px] font-black text-gray-700 uppercase tracking-[0.12em]">Suggested Products</span>
      </div>

      {/* Product List */}
      <div className="flex flex-col divide-y divide-gray-50 overflow-y-auto max-h-[650px] scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {suggestedProducts.map((p) => (
          <div key={p.id} className="px-4 py-4 space-y-3">
            <div className="flex gap-3">
              <div className="size-[68px] rounded-sm overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <p className="text-[10px] font-black text-[#004a99] uppercase tracking-wider">{p.brand}</p>
                <p className="text-[12px] font-bold text-gray-900 leading-snug line-clamp-2">{p.title}</p>
                <StarRating rating={p.rating} reviews={p.reviews} />
                <p className="text-[13px] font-black text-gray-900">{p.price}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => addToQuote(p)}
              className="block w-full py-2 text-center text-[11px] font-black uppercase tracking-[0.15em] text-gray-500 border border-gray-200 rounded-sm hover:border-[#004a99] hover:text-[#004a99] hover:bg-blue-50 transition-all duration-200 cursor-pointer"
            >
              Add to Quote
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}

/* ─────────────────────────────────────────────
   Shared input class (used identically in all steps)
───────────────────────────────────────────── */
const INPUT = "py-3 px-4 block w-full border border-gray-200 rounded-sm text-sm focus:border-[#004a99] focus:ring-[#004a99] disabled:opacity-50 disabled:pointer-events-none";
const LABEL = "block text-sm font-semibold mb-2 text-gray-800";
const SECTION_TITLE = "text-[11px] font-black text-[#004a99] uppercase tracking-[0.18em]";

/* ─────────────────────────────────────────────
   Progress Step indicator
───────────────────────────────────────────── */
function StepBubble({ num, label, state }: { num: number; label: string; state: 'active' | 'done' | 'idle' }) {
  return (
    <div className="flex items-center gap-3 shrink-0">
      {state === 'done' ? (
        <span className="size-8 rounded-sm bg-[#004a99] text-white flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
        </span>
      ) : state === 'active' ? (
        <span className="size-8 rounded-sm bg-[#0f172a] text-white flex items-center justify-center text-sm font-bold">{num}</span>
      ) : (
        <span className="size-8 rounded-sm border-2 border-gray-200 flex items-center justify-center text-sm font-bold text-gray-400">{num}</span>
      )}
      <span className={`hidden sm:block text-sm font-bold whitespace-nowrap ${state === 'active' ? 'text-[#0f172a]' : state === 'done' ? 'text-[#004a99]' : 'text-gray-400'}`}>{label}</span>
    </div>
  );
}

function StepConnector({ filled }: { filled: boolean }) {
  return <div className={`flex-1 h-[2px] min-w-[30px] ${filled ? 'bg-[#004a99]' : 'bg-gray-100'}`} />;
}

/* ─────────────────────────────────────────────
   Product Card (shared across all steps)
───────────────────────────────────────────── */
function ProductCard({ product, onRemove }: { product: typeof relatedProducts[0]; onRemove: () => void }) {
  return (
    <div className="relative bg-white border border-gray-100 rounded-sm p-3.5 pr-14 flex items-center gap-5 group hover:border-[#004a99]/30 hover:shadow-sm transition-all duration-300">
      <div className="size-[72px] rounded-sm bg-white border border-gray-50 overflow-hidden shrink-0 flex items-center justify-center p-1">
        <img src={product.image} className="w-full h-full object-contain mix-blend-multiply" alt="Product" />
      </div>
      <div className="space-y-0.5 text-left flex-1 min-w-0">
        <p className="text-[10px] font-black text-[#004a99] uppercase tracking-widest">{product.brand}</p>
        <h3 className="text-[15px] font-bold text-[#0f172a] leading-tight truncate">{product.title}</h3>
        {product.id === 0 ? (
          <p className="text-[13px] text-gray-500 font-medium">Glassdoor Walk-in Freezer · Always in Stock</p>
        ) : (
          <div className="pt-0.5 pb-0.5">
            <StarRating rating={product.rating} reviews={product.reviews} />
          </div>
        )}
        <p className="text-[14px] font-bold text-[#004a99]">{product.id === 0 ? 'Price revealed upon invoice approval' : product.price}</p>
      </div>
      {product.id !== 0 && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute right-4 top-1/2 -translate-y-1/2 size-6 bg-red-50 border border-red-400 rounded-sm flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white shadow-sm transition-all duration-200 z-10 cursor-pointer"
          title="Remove from quote"
        >
          <X size={12} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   STEP 1 — Project Info
───────────────────────────────────────────── */
function Step1({ data, onChange }: { data: FormData; onChange: (k: keyof FormData, v: string) => void }) {
  return (
    <div className="space-y-8">
      <div>
        <label htmlFor="projectName" className={LABEL}>Project Name *</label>
        <input
          type="text"
          id="projectName"
          placeholder="e.g. Downtown Restaurant Cooler Install"
          value={data.projectName}
          onChange={e => onChange('projectName', e.target.value)}
          className={INPUT}
        />
      </div>

      <div className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="fullName" className={LABEL}>Full Name *</label>
            <input
              type="text"
              id="fullName"
              placeholder="Full name"
              value={data.fullName}
              onChange={e => onChange('fullName', e.target.value)}
              className={INPUT}
            />
          </div>
          <div>
            <label htmlFor="email" className={LABEL}>Email Address *</label>
            <input
              type="email"
              id="email"
              placeholder="you@company.com"
              value={data.email}
              onChange={e => onChange('email', e.target.value)}
              className={INPUT}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="phone" className={LABEL}>Phone Number *</label>
            <input
              type="tel"
              id="phone"
              placeholder="+1 (555) 000-0000"
              value={data.phone}
              onChange={e => onChange('phone', e.target.value)}
              className={INPUT}
            />
          </div>
          <div>
            <label htmlFor="address" className={LABEL}>Project Address *</label>
            <input
              type="text"
              id="address"
              placeholder="Street, City, State, ZIP"
              value={data.address}
              onChange={e => onChange('address', e.target.value)}
              className={INPUT}
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className={LABEL}>Project Description</label>
          <textarea
            id="description"
            rows={4}
            placeholder="Timeline, special requirements, constraints..."
            value={data.description}
            onChange={e => onChange('description', e.target.value)}
            className={INPUT}
          />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   STEP 2 — Box & Temperature
───────────────────────────────────────────── */
function Step2({ data, onChange }: { data: FormData; onChange: (k: keyof FormData, v: string) => void }) {
  return (
    <div className="space-y-10">

      {/* Walking Box Dimensions */}
      <div className="space-y-5">


        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          <div>
            <label htmlFor="width" className={LABEL}>Width (ft) *</label>
            <input
              type="number"
              id="width"
              placeholder="5"
              min="1"
              value={data.width}
              onChange={e => onChange('width', e.target.value)}
              className={INPUT}
            />
          </div>
          <div>
            <label htmlFor="length" className={LABEL}>Length (ft) *</label>
            <input
              type="number"
              id="length"
              placeholder="8"
              min="1"
              value={data.length}
              onChange={e => onChange('length', e.target.value)}
              className={INPUT}
            />
          </div>
          <div>
            <label htmlFor="height" className={LABEL}>Height (ft) *</label>
            <input
              type="number"
              id="height"
              placeholder="8"
              min="1"
              value={data.height}
              onChange={e => onChange('height', e.target.value)}
              className={INPUT}
            />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-sm px-4 py-3 flex items-start gap-2.5">
          <span className="text-base leading-none mt-px">💡</span>
          <p className="text-[13px] text-[#004a99] font-medium">
            Common sizes: 6×8, 8×10, 10×12, 12×16 ft. Custom dimensions available on request.
          </p>
        </div>
      </div>

      {/* Temperature Requirements */}
      <div className="space-y-5">


        <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label htmlFor="tempRange" className={LABEL}>Temperature Range *</label>
            <select
              id="tempRange"
              value={data.tempRange}
              onChange={e => onChange('tempRange', e.target.value)}
              className={`${INPUT} bg-white appearance-none text-gray-600`}
            >
              <option value="" disabled>Select a range...</option>
              <option value="Cooler: 35°F – 41°F">Cooler: 35°F – 41°F (2°C – 5°C)</option>
              <option value="Freezer: 0°F">Freezer: 0°F (-18°C)</option>
              <option value="Deep Freeze: -10°F">Deep Freeze: -10°F (-23°C)</option>
              <option value="Deep Freeze: -20°F">Deep Freeze: -20°F (-29°C)</option>
              <option value="Floral: 34°F – 38°F">Floral: 34°F – 38°F</option>
              <option value="Deli / Meat: 28°F – 34°F">Deli / Meat: 28°F – 34°F</option>
              <option value="Custom">Custom (specify below)</option>
            </select>
          </div>
          <div>
            <label htmlFor="customTemp" className={LABEL}>Custom Temp (Optional)</label>
            <input
              type="text"
              id="customTemp"
              placeholder="e.g. -5°F / -20°C"
              value={data.customTemp}
              onChange={e => onChange('customTemp', e.target.value)}
              className={INPUT}
            />
          </div>
        </div>
      </div>

      {/* Product & Quantity */}
      <div className="space-y-5">
        <div className="pb-3 border-b border-gray-100">
          <h2 className={SECTION_TITLE}>Product & Quantity</h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label htmlFor="productName" className={LABEL}>Product</label>
            <input
              type="text"
              id="productName"
              value="New ICEMANZ 5′ × 8′ × 8′H Walk-in Cooler"
              readOnly
              className={`${INPUT} bg-gray-50 text-gray-400 cursor-default focus:outline-none`}
            />
          </div>
          <div>
            <label htmlFor="quantity" className={LABEL}>Quantity *</label>
            <input
              type="number"
              id="quantity"
              placeholder="1"
              min="1"
              value={data.quantity}
              onChange={e => onChange('quantity', e.target.value)}
              className={INPUT}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   STEP 3 — Review
───────────────────────────────────────────── */
function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 py-3.5 border-b border-gray-50 last:border-0">
      <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest sm:w-44 shrink-0">{label}</span>
      <span className="text-sm font-semibold text-[#0f172a]">{value || <span className="text-gray-300 font-normal italic">—</span>}</span>
    </div>
  );
}

function Step3({ data }: { data: FormData }) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-2">
        <CheckCircle2 className="text-[#004a99]" size={22} />
        <p className="text-sm font-bold text-gray-600">Review your details before submitting</p>
      </div>

      {/* Section: Project Info */}
      <div className="rounded-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
          <h3 className={SECTION_TITLE}>Project Info</h3>
        </div>
        <div className="px-5">
          <ReviewRow label="Project Name" value={data.projectName} />
          <ReviewRow label="Full Name" value={data.fullName} />
          <ReviewRow label="Email" value={data.email} />
          <ReviewRow label="Phone" value={data.phone} />
          <ReviewRow label="Address" value={data.address} />
          <ReviewRow label="Description" value={data.description} />
        </div>
      </div>

      {/* Section: Box & Temperature */}
      <div className="rounded-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
          <h3 className={SECTION_TITLE}>Box & Temperature</h3>
        </div>
        <div className="px-5">
          <ReviewRow label="Dimensions" value={data.width && data.length && data.height ? `${data.width}′ W × ${data.length}′ L × ${data.height}′ H` : ''} />
          <ReviewRow label="Temp Range" value={data.tempRange} />
          <ReviewRow label="Custom Temp" value={data.customTemp} />
          <ReviewRow label="Quantity" value={data.quantity} />
        </div>
      </div>

      <p className="text-[12px] text-gray-400 font-medium leading-relaxed">
        By submitting, you agree to our terms. Our team will review your request and send a tailored invoice to your email within 1–2 business days.
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Form data shape
───────────────────────────────────────────── */
type FormData = {
  // Step 1
  projectName: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  // Step 2
  width: string;
  length: string;
  height: string;
  tempRange: string;
  customTemp: string;
  quantity: string;
};

const defaultData: FormData = {
  projectName: '', fullName: '', email: '', phone: '', address: '', description: '',
  width: '', length: '', height: '', tempRange: '', customTemp: '', quantity: '1',
};

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
export default function RequestInvoicePage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(defaultData);
  const [submitted, setSubmitted] = useState(false);

  const [suggestedProducts, setSuggestedProducts] = useState(relatedProducts);
  const [addedProducts, setAddedProducts] = useState<typeof relatedProducts>([
    {
      id: 0,
      brand: 'ICEMANZ',
      title: "New ICEMANZ 5′ × 8′ × 8′H Walk-in Cooler",
      image: '/Walk-inCooler&Freezer/combounits.jpg',
      rating: 5,
      reviews: 0,
      price: 'Price on Request',
      href: '#'
    }
  ]);

  const addToQuote = (product: typeof relatedProducts[0]) => {
    setAddedProducts((prev) => [...prev, product]);
    setSuggestedProducts((prev) => prev.filter((p) => p.id !== product.id));
  };

  const removeFromQuote = (product: typeof relatedProducts[0]) => {
    if (product.id !== 0) {
      setSuggestedProducts((prev) => [product, ...prev]);
    }
    setAddedProducts((prev) => prev.filter((p) => p.id !== product.id));
  };

  const updateField = (key: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.email || !formData.phone) {
      alert("Please fill in the required fields (Name, Email, Phone).");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData, addedProducts }),
      });
      
      if (res.ok) {
        setSubmitted(true);
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.details || 'Failed to submit'}`);
      }
    } catch (error) {
      console.error(error);
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepState = (n: number): 'active' | 'done' | 'idle' =>
    n === step ? 'active' : n < step ? 'done' : 'idle';

  return (
    <main className="min-h-screen bg-[#fcfcfc] flex flex-col">
      <Header />

      <div className="flex-1 pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="container px-4 mx-auto">

          <div className="flex flex-col xl:flex-row gap-6 items-start">
            <RelatedProductsSidebar suggestedProducts={suggestedProducts} addToQuote={addToQuote} />

            <div className="flex-1 min-w-0 w-full order-1 xl:order-2">
              {submitted ? (
                /* ── Success State ── */
                <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden p-10 md:p-16 flex flex-col items-center text-center gap-6">
                  <div className="size-20 rounded-sm bg-[#004a99]/10 flex items-center justify-center">
                    <CheckCircle2 size={40} className="text-[#004a99]" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-black text-[#0f172a]">Request Submitted!</h2>
                    <p className="text-gray-500 text-sm font-medium max-w-md">
                      Thank you, <span className="text-[#0f172a] font-bold">{formData.fullName}</span>. We've received your invoice request and will send a tailored quote to <span className="text-[#004a99] font-bold">{formData.email}</span> within 1–2 business days.
                    </p>
                  </div>
                  <button
                    onClick={() => { setStep(1); setFormData(defaultData); setSubmitted(false); }}
                    className="py-3 px-6 inline-flex items-center gap-2 rounded-sm font-bold text-sm cursor-pointer bg-[#003d80] text-white transition-all"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden flex flex-col">

                  {/* Progress Bar Header */}
                  <div className="px-6 md:px-10 py-6 border-b border-gray-100 flex items-center justify-between gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <StepBubble num={1} label="Project Info" state={stepState(1)} />
                    <StepConnector filled={step > 1} />
                    <StepBubble num={2} label="Box & Temperature" state={stepState(2)} />
                    <StepConnector filled={step > 2} />
                    <StepBubble num={3} label="Review" state={stepState(3)} />
                  </div>

                  {/* Form Body */}
                  <div className="p-6 md:p-10 space-y-10">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 max-h-[240px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                      {addedProducts.map(p => (
                        <ProductCard key={p.id} product={p} onRemove={() => removeFromQuote(p)} />
                      ))}
                    </div>

                    {step === 1 && <Step1 data={formData} onChange={updateField} />}
                    {step === 2 && <Step2 data={formData} onChange={updateField} />}
                    {step === 3 && <Step3 data={formData} />}
                  </div>

                  {/* Bottom Bar */}
                  <div className={`px-6 md:px-10 py-5 bg-gray-50 border-t border-gray-100 flex ${step > 1 ? 'justify-between' : 'justify-end'} items-center`}>
                    {step > 1 && (
                      <button
                        onClick={() => setStep(s => s - 1)}
                        className="py-3 px-6 inline-flex justify-center text-sm items-center gap-2 rounded-sm font-bold cursor-pointer bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 transition-all focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
                      >
                        <ArrowLeft size={18} />
                        Back
                      </button>
                    )}

                    {step < 3 ? (
                      <button
                        onClick={() => setStep(s => s + 1)}
                        className="py-3 px-6 inline-flex justify-center text-sm items-center gap-2 rounded-sm font-bold cursor-pointer bg-[#003d80] text-white transition-all focus:outline-none focus:ring-2 focus:ring-[#0f172a] focus:ring-offset-2"
                      >
                        Continue
                        <ArrowRight size={18} />
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="py-3 px-6 inline-flex justify-center text-sm items-center gap-2 rounded-sm font-bold cursor-pointer bg-[#003d80] text-white transition-all focus:outline-none focus:ring-2 focus:ring-[#0f172a] focus:ring-offset-2 disabled:opacity-70"
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit Request'}
                        {!isSubmitting && <Send size={16} />}
                      </button>
                    )}
                  </div>

                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}
