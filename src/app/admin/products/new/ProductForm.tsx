'use client';

import { useState, useMemo } from "react";
import { createProduct } from "./actions";
import { AlertCircle, Loader2, ImagePlus, X, Plus, FileText, Trash2 } from "lucide-react";
import { Category } from "@prisma/client";

type CategoryWithSubs = Category & {
  subcategories: (Category & {
    subcategories: Category[];
  })[];
};

type ProductOption = {
  label: string;
  name: string;
  options: { label: string; price?: string }[];
};

type Faq = {
  question: string;
  answer: string;
};

type Features = {
  panels?: string[];
  doors?: string[];
  topMount?: string[];
  remote?: string[];
};

export default function ProductForm({ allCategories, preselectedCategory }: { allCategories: CategoryWithSubs[], preselectedCategory?: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<{ file: File, preview: string }[]>([]);

  // Cascading category state - initialize correctly based on preselected category
  const [selectedLevel1, setSelectedLevel1] = useState(() => {
    if (!preselectedCategory) return '';
    // If preselected has parent, parent is level1
    if (preselectedCategory.parentId) return preselectedCategory.parentId;
    // Otherwise, preselected is level1
    return preselectedCategory.id;
  });
  const [selectedLevel2, setSelectedLevel2] = useState(() => {
    if (!preselectedCategory) return '';
    // If preselected has parent and no parent's parent, preselected is level2
    if (preselectedCategory.parentId) {
      return preselectedCategory.id;
    }
    return '';
  });
  const [selectedLevel3, setSelectedLevel3] = useState('');

  // Specs state
  const [specs, setSpecs] = useState<{ label: string; value: string }[]>([]);

  // Documents state
  const [docEntries, setDocEntries] = useState<{ name: string; file: File | null }[]>([]);

  // Product Options state
  const [productOptions, setProductOptions] = useState<ProductOption[]>([]);

  // FAQs state
  const [faqs, setFaqs] = useState<Faq[]>([]);

  // Features state
  const [features, setFeatures] = useState<Features>({});

  // Walk-in Cooler Specific State
  const [walkInType, setWalkInType] = useState('');
  const [sizeW, setSizeW] = useState('');
  const [sizeL, setSizeL] = useState('');

  // Get top-level categories (no parent)
  const topCategories = useMemo(() => {
    return allCategories.filter(c => !c.parentId);
  }, [allCategories]);

  const walkInCoolerCat = topCategories.find(c => c.slug === 'walk-in-cooler-freezer');
  const isWalkInCooler = walkInCoolerCat && selectedLevel1 === walkInCoolerCat.id;

  const level2Options = useMemo(() => {
    if (!selectedLevel1) return [];
    const parent = topCategories.find(c => c.id === selectedLevel1);
    return parent?.subcategories || [];
  }, [selectedLevel1, topCategories]);

  const level3Options = useMemo(() => {
    if (!selectedLevel2) return [];
    const parent = level2Options.find(c => c.id === selectedLevel2);
    return parent?.subcategories || [];
  }, [selectedLevel2, level2Options]);

  const finalCategoryId = selectedLevel3 || selectedLevel2 || selectedLevel1 || '';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set('categoryId', finalCategoryId);
    formData.set('specs', JSON.stringify(specs));
    formData.set('productOptions', JSON.stringify(productOptions));
    formData.set('faqs', JSON.stringify(faqs));
    const currentFeatures: any = { ...features };
    if (isWalkInCooler) {
      currentFeatures.walkInType = walkInType;
      if (sizeW && sizeL) {
        currentFeatures.size = `${sizeW}' x ${sizeL}'`;
      }
    }

    formData.set('features', JSON.stringify(currentFeatures));

    formData.delete('images');
    images.forEach((img) => formData.append('images', img.file));

    // Add document files and names
    formData.delete('documents');
    formData.delete('documentNames');
    for (const entry of docEntries) {
      if (entry.file) {
        formData.append('documents', entry.file);
        formData.append('documentNames', entry.name || entry.file.name);
      }
    }

    const result = await createProduct(formData);

    if (result?.error) {
      setError(result.error);
      setIsSubmitting(false);
    }
  };

  // Product Options handlers
  const addProductOption = () => {
    setProductOptions([...productOptions, { label: '', name: '', options: [{ label: '', price: '' }] }]);
  };

  const removeProductOption = (index: number) => {
    setProductOptions(productOptions.filter((_, i) => i !== index));
  };

  const updateProductOption = (index: number, field: 'label' | 'name', value: string) => {
    const updated = [...productOptions];
    updated[index][field] = value;
    setProductOptions(updated);
  };

  const addOptionValue = (optionIndex: number) => {
    const updated = [...productOptions];
    updated[optionIndex].options.push({ label: '', price: '' });
    setProductOptions(updated);
  };

  const removeOptionValue = (optionIndex: number, valueIndex: number) => {
    const updated = [...productOptions];
    updated[optionIndex].options = updated[optionIndex].options.filter((_, i) => i !== valueIndex);
    setProductOptions(updated);
  };

  const updateOptionValue = (optionIndex: number, valueIndex: number, field: 'label' | 'price', value: string) => {
    const updated = [...productOptions];
    updated[optionIndex].options[valueIndex][field] = value;
    setProductOptions(updated);
  };

  // FAQs handlers
  const addFaq = () => {
    setFaqs([...faqs, { question: '', answer: '' }]);
  };

  const removeFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const updateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    const updated = [...faqs];
    updated[index][field] = value;
    setFaqs(updated);
  };

  // Features helpers
  const updateFeaturesList = (section: keyof Features, value: string) => {
    const list = value.split('\n').map(s => s.trim()).filter(Boolean);
    setFeatures(prev => ({ ...prev, [section]: list.length > 0 ? list : undefined }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newImages = files.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setImages(prev => [...prev, ...newImages]);
    }
    // reset input so same file can be selected again
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const addSpec = () => setSpecs([...specs, { label: '', value: '' }]);
  const removeSpec = (i: number) => setSpecs(specs.filter((_, idx) => idx !== i));
  const updateSpec = (i: number, field: 'label' | 'value', val: string) => {
    const updated = [...specs];
    updated[i][field] = val;
    setSpecs(updated);
  };

  const addDocEntry = () => setDocEntries([...docEntries, { name: '', file: null }]);
  const removeDocEntry = (i: number) => setDocEntries(docEntries.filter((_, idx) => idx !== i));

  const inputClasses = "py-2.5 px-3.5 block w-full border border-slate-300 rounded-lg text-sm focus:border-[#004a99] focus:ring-1 focus:ring-[#004a99]/20 bg-white placeholder:text-slate-400 outline-none transition-all";
  const selectClasses = `${inputClasses} appearance-none cursor-pointer`;
  const labelClasses = "block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-start gap-3">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* ===== SECTION 1: Product Images ===== */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 mb-4 pb-2 border-b border-slate-100">Product Images</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {images.map((img, idx) => (
            <div key={idx} className="relative w-full aspect-square rounded-xl border border-slate-200 overflow-hidden group bg-white shadow-sm">
              <img src={img.preview} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
              <button type="button" onClick={(e) => { e.preventDefault(); removeImage(idx); }} className="absolute top-2 right-2 size-7 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer opacity-100 md:opacity-0 md:group-hover:opacity-100">
                <X size={14} />
              </button>
            </div>
          ))}

          <label htmlFor="image" className="block cursor-pointer group h-full">
            <div className="w-full aspect-square rounded-xl border-2 border-dashed border-slate-300 group-hover:border-[#004a99] bg-slate-50 group-hover:bg-[#004a99]/[0.03] transition-all duration-200 flex flex-col items-center justify-center gap-2">
              <div className="size-10 rounded-full bg-[#004a99]/10 group-hover:bg-[#004a99]/20 flex items-center justify-center transition-colors">
                <ImagePlus className="size-5 text-[#004a99]" strokeWidth={1.5} />
              </div>
              <p className="text-xs font-medium text-slate-400 group-hover:text-[#004a99] transition-colors text-center px-2">
                {images.length > 0 ? "Add more images" : "Click to upload"}
              </p>
            </div>
          </label>
          <input id="image" name="images" type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
        </div>
      </div>

      {/* ===== SECTION 2: Basic Info ===== */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 mb-4 pb-2 border-b border-slate-100">Basic Information</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className={labelClasses}>Title *</label>
              <input type="text" id="title" name="title" required className={inputClasses} placeholder="e.g. TS060MR404A3-T" />
            </div>
            {!isWalkInCooler && (
              <div>
                <label htmlFor="slug" className={labelClasses}>Slug</label>
                <input type="text" id="slug" name="slug" className={inputClasses} placeholder="Auto-generated if empty" />
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="brand" className={labelClasses}>Brand</label>
              <input type="text" id="brand" name="brand" className={inputClasses} placeholder="e.g. Amerikooler, Icemanz" />
            </div>
            {!isWalkInCooler && (
              <div>
                <label htmlFor="sku" className={labelClasses}>SKU</label>
                <input type="text" id="sku" name="sku" className={inputClasses} placeholder="e.g. SKU-12345" />
              </div>
            )}
            <div>
              <label htmlFor="price" className={labelClasses}>Price</label>
              <input type="text" id="price" name="price" className={inputClasses} placeholder="e.g. $1,299.00" />
            </div>
          </div>

          {/* Category Selector */}
          {!isWalkInCooler && (
            <div>
              <label className={`${labelClasses} mb-2`}>Category</label>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 sm:p-4 space-y-3">
                <div className="flex items-start sm:items-center gap-3">
                  <span className="shrink-0 size-6 rounded-full bg-[#004a99] text-white text-xs font-bold flex items-center justify-center mt-1 sm:mt-0">1</span>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-500 mb-1">Main Category</p>
                    <select value={selectedLevel1} onChange={(e) => { setSelectedLevel1(e.target.value); setSelectedLevel2(''); setSelectedLevel3(''); }} className={`${selectClasses} ${selectedLevel1 ? 'border-[#004a99]/40 bg-[#004a99]/[0.03]' : ''}`}>
                      <option value="">Select category...</option>
                      {topCategories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                    </select>
                  </div>
                </div>
                {level2Options.length > 0 && (
                  <div className="flex items-start sm:items-center gap-3">
                    <span className="shrink-0 size-6 rounded-full bg-[#0070cc] text-white text-xs font-bold flex items-center justify-center mt-1 sm:mt-0">2</span>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-slate-500 mb-1">Subcategory</p>
                      <select value={selectedLevel2} onChange={(e) => { setSelectedLevel2(e.target.value); setSelectedLevel3(''); }} className={`${selectClasses} ${selectedLevel2 ? 'border-[#0070cc]/40 bg-[#0070cc]/[0.03]' : ''}`}>
                        <option value="">Select subcategory...</option>
                        {level2Options.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                      </select>
                    </div>
                  </div>
                )}
                {level3Options.length > 0 && (
                  <div className="flex items-start sm:items-center gap-3">
                    <span className="shrink-0 size-6 rounded-full bg-[#0891b2] text-white text-xs font-bold flex items-center justify-center mt-1 sm:mt-0">3</span>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-slate-500 mb-1">Type</p>
                      <select value={selectedLevel3} onChange={(e) => setSelectedLevel3(e.target.value)} className={`${selectClasses} ${selectedLevel3 ? 'border-[#0891b2]/40 bg-[#0891b2]/[0.03]' : ''}`}>
                        <option value="">Select type...</option>
                        {level3Options.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                      </select>
                    </div>
                  </div>
                )}
                {selectedLevel1 && (
                  <div className="pt-2 border-t border-slate-200">
                    <p className="text-xs text-slate-400 font-medium">
                      Selected: <span className="text-[#004a99] font-semibold">
                        {topCategories.find(c => c.id === selectedLevel1)?.name}
                        {selectedLevel2 && ` › ${level2Options.find(c => c.id === selectedLevel2)?.name}`}
                        {selectedLevel3 && ` › ${level3Options.find(c => c.id === selectedLevel3)?.name}`}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          {isWalkInCooler && (
            <div>
              <label className={`${labelClasses} mb-2`}>Category</label>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 sm:p-4 space-y-3">
                <div className="flex items-start sm:items-center gap-3">
                  <span className="shrink-0 size-6 rounded-full bg-[#004a99] text-white text-xs font-bold flex items-center justify-center mt-1 sm:mt-0">1</span>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-500 mb-1">Main Category</p>
                    <input type="text" value={topCategories.find(c => c.id === selectedLevel1)?.name || ''} disabled className={`${inputClasses} bg-slate-100`} />
                  </div>
                </div>
                {level2Options.length > 0 && (
                  <div className="flex items-start sm:items-center gap-3">
                    <span className="shrink-0 size-6 rounded-full bg-[#0070cc] text-white text-xs font-bold flex items-center justify-center mt-1 sm:mt-0">2</span>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-slate-500 mb-1">Subcategory</p>
                      <select value={selectedLevel2} onChange={(e) => { setSelectedLevel2(e.target.value); }} className={`${selectClasses} ${selectedLevel2 ? 'border-[#0070cc]/40 bg-[#0070cc]/[0.03]' : ''}`}>
                        <option value="">Select subcategory...</option>
                        {level2Options.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                      </select>
                    </div>
                  </div>
                )}
                {(selectedLevel1 || selectedLevel2) && (
                  <div className="pt-2 border-t border-slate-200">
                    <p className="text-xs text-slate-400 font-medium">
                      Selected: <span className="text-[#004a99] font-semibold">
                        {topCategories.find(c => c.id === selectedLevel1)?.name}
                        {selectedLevel2 && ` › ${level2Options.find(c => c.id === selectedLevel2)?.name}`}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          <input type="hidden" name="categoryId" value={finalCategoryId} />

          {!isWalkInCooler && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="badge" className={labelClasses}>Badge</label>
                <input type="text" id="badge" name="badge" className={inputClasses} placeholder="e.g. IN STOCK" />
              </div>
              <div>
                <label htmlFor="condition" className={labelClasses}>Condition</label>
                <input type="text" id="condition" name="condition" className={inputClasses} placeholder="e.g. New" />
              </div>
            </div>
          )}
          {!isWalkInCooler && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="type" className={labelClasses}>Type</label>
                <input type="text" id="type" name="type" className={inputClasses} placeholder="e.g. Compressor" />
              </div>
            </div>
          )}
          {isWalkInCooler && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="type" className={labelClasses}>Refrigeration Type</label>
                <select id="type" name="type" className={selectClasses}>
                  <option value="">Select Refrigeration Type...</option>
                  <option value="No Refrigeration">No Refrigeration</option>
                  <option value="Top-Mount Refrigeration">Top-Mount Refrigeration</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== SECTION 2: Product Details ===== */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 mb-4 pb-2 border-b border-slate-100">Product Details</h3>
        <div className="space-y-4">
          {!isWalkInCooler && (
            <div>
              <label htmlFor="keyFeatures" className={labelClasses}>Key Features (short summary)</label>
              <input type="text" id="keyFeatures" name="keyFeatures" className={inputClasses} placeholder="e.g. 3.5 HP, Low Temperature Condensing Unit With Scroll Compressor" />
            </div>
          )}
          <div>
            <label htmlFor="description" className={labelClasses}>Description</label>
            <textarea id="description" name="description" rows={3} className={`${inputClasses} resize-y`} placeholder="Detailed product description..."></textarea>
          </div>
          {!isWalkInCooler && (
            <div>
              <label htmlFor="warranty" className={labelClasses}>Warranty (one per line)</label>
              <textarea id="warranty" name="warranty" rows={2} className={`${inputClasses} resize-y`} placeholder={"1 Year Compressor Warranty\n1 Year Fan Motor and Parts Warranty"}></textarea>
            </div>
          )}
          <div>
            <label htmlFor="detailedFeatures" className={labelClasses}>Detailed Features (one per line)</label>
            <textarea id="detailedFeatures" name="detailedFeatures" rows={4} className={`${inputClasses} resize-y`} placeholder={"Blue anti-corrosion-fin increases the life span\nHighest quality compressor in the world\nControl box is designed for easy installation"}></textarea>
          </div>
        </div>
      </div>

      {/* ===== SECTION 3: Specifications ===== */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 mb-4 pb-2 border-b border-slate-100">Specifications</h3>
        <div className="space-y-3">
          {specs.map((spec, i) => (
            <div key={i} className="flex items-center gap-3">
              <input
                type="text"
                value={spec.label}
                onChange={(e) => updateSpec(i, 'label', e.target.value)}
                className={`${inputClasses} flex-1`}
                placeholder="Label (e.g. Capacity)"
              />
              <input
                type="text"
                value={spec.value}
                onChange={(e) => updateSpec(i, 'value', e.target.value)}
                className={`${inputClasses} flex-1`}
                placeholder="Value (e.g. 2 HP)"
              />
              <button type="button" onClick={() => removeSpec(i)} className="shrink-0 size-9 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors cursor-pointer">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <button type="button" onClick={addSpec} className="inline-flex items-center gap-2 text-sm font-medium text-[#004a99] hover:text-[#003d80] transition-colors cursor-pointer">
            <Plus size={16} /> Add Specification
          </button>
        </div>
      </div>

      {/* ===== SECTION 4: Documents (PDFs) ===== */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 mb-4 pb-2 border-b border-slate-100">Documents (PDF Files)</h3>
        <div className="space-y-3">
          {docEntries.map((entry, i) => (
            <div key={i} className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg p-3">
              <FileText size={18} className="text-slate-400 shrink-0" />
              <input
                type="text"
                value={entry.name}
                onChange={(e) => {
                  const updated = [...docEntries];
                  updated[i].name = e.target.value;
                  setDocEntries(updated);
                }}
                className={`${inputClasses} flex-1`}
                placeholder="Document name (e.g. Cut Sheet)"
              />
              <label className="shrink-0 px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors">
                {entry.file ? entry.file.name.substring(0, 20) + '...' : 'Choose File'}
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    const updated = [...docEntries];
                    updated[i].file = file;
                    if (file && !updated[i].name) {
                      updated[i].name = file.name.replace(/\.[^/.]+$/, '');
                    }
                    setDocEntries(updated);
                  }}
                />
              </label>
              <button type="button" onClick={() => removeDocEntry(i)} className="shrink-0 size-9 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors cursor-pointer">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <button type="button" onClick={addDocEntry} className="inline-flex items-center gap-2 text-sm font-medium text-[#004a99] hover:text-[#003d80] transition-colors cursor-pointer">
            <Plus size={16} /> Add Document
          </button>
        </div>
      </div>

      {/* ===== SECTION 5: Product Options ===== */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 mb-4 pb-2 border-b border-slate-100">Product Options</h3>
        <div className="space-y-4">
          {productOptions.map((option, i) => (
            <div key={i} className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="grid grid-cols-2 gap-3 flex-1">
                  <input
                    type="text"
                    value={option.label}
                    onChange={(e) => updateProductOption(i, 'label', e.target.value)}
                    className={`${inputClasses}`}
                    placeholder="Option Label (e.g. Door Hinge)"
                  />
                  <input
                    type="text"
                    value={option.name}
                    onChange={(e) => updateProductOption(i, 'name', e.target.value)}
                    className={`${inputClasses}`}
                    placeholder="Option Name (e.g. doorHinge)"
                  />
                </div>
                <button type="button" onClick={() => removeProductOption(i)} className="ml-3 shrink-0 size-9 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors cursor-pointer">
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Values</p>
                {option.options.map((optVal, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={optVal.label}
                      onChange={(e) => updateOptionValue(i, j, 'label', e.target.value)}
                      className={`${inputClasses} flex-1`}
                      placeholder="Value Label (e.g. Left Hinged)"
                    />
                    <input
                      type="text"
                      value={optVal.price || ''}
                      onChange={(e) => updateOptionValue(i, j, 'price', e.target.value)}
                      className={`${inputClasses} w-32`}
                      placeholder="Price (optional)"
                    />
                    <button type="button" onClick={() => removeOptionValue(i, j)} className="shrink-0 size-9 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors cursor-pointer">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => addOptionValue(i)} className="inline-flex items-center gap-2 text-sm font-medium text-[#004a99] hover:text-[#003d80] transition-colors cursor-pointer">
                  <Plus size={14} /> Add Value
                </button>
              </div>
            </div>
          ))}
          <button type="button" onClick={addProductOption} className="inline-flex items-center gap-2 text-sm font-medium text-[#004a99] hover:text-[#003d80] transition-colors cursor-pointer">
            <Plus size={16} /> Add Product Option
          </button>
        </div>
      </div>

      {/* ===== SECTION 6: FAQs ===== */}
      {!isWalkInCooler && (
        <div>
          <h3 className="text-sm font-bold text-slate-700 mb-4 pb-2 border-b border-slate-100">FAQs</h3>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="flex flex-col gap-2 bg-slate-50 border border-slate-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => updateFaq(i, 'question', e.target.value)}
                    className={`${inputClasses} flex-1`}
                    placeholder="Question"
                  />
                  <button type="button" onClick={() => removeFaq(i)} className="shrink-0 size-9 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors cursor-pointer">
                    <Trash2 size={14} />
                  </button>
                </div>
                <textarea
                  value={faq.answer}
                  onChange={(e) => updateFaq(i, 'answer', e.target.value)}
                  rows={2}
                  className={`${inputClasses} resize-y`}
                  placeholder="Answer"
                />
              </div>
            ))}
            <button type="button" onClick={addFaq} className="inline-flex items-center gap-2 text-sm font-medium text-[#004a99] hover:text-[#003d80] transition-colors cursor-pointer">
              <Plus size={16} /> Add FAQ
            </button>
          </div>
        </div>
      )}

      {/* ===== SECTION 7: Features ===== */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 mb-4 pb-2 border-b border-slate-100">Features (Panels, Doors, etc.)</h3>
        <div className="space-y-4">
          {isWalkInCooler && (
            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 mb-6 space-y-4">
              <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2">Walk-In Cooler Filters</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>Walk In Type</label>
                  <select value={walkInType} onChange={(e) => setWalkInType(e.target.value)} className={selectClasses}>
                    <option value="">Select Walk In Type...</option>
                    <option value="Cooler (Refrigerator) No Floor">Cooler (Refrigerator) No Floor</option>
                    <option value="Cooler (Refrigerator) with Floor">Cooler (Refrigerator) with Floor</option>
                    <option value="Freezer with Floor">Freezer with Floor</option>
                    <option value="Combo (Cooler & Freezer)">Combo (Cooler & Freezer)</option>
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>Size W x L</label>
                  <div className="flex items-center gap-2">
                    <input type="number" value={sizeW} onChange={(e) => setSizeW(e.target.value)} className={`${inputClasses} px-2`} placeholder="W (ft)" />
                    <span className="text-slate-400 font-medium">x</span>
                    <input type="number" value={sizeL} onChange={(e) => setSizeL(e.target.value)} className={`${inputClasses} px-2`} placeholder="L (ft)" />
                  </div>
                </div>
              </div>
            </div>
          )}
          {!isWalkInCooler && (
            <>
              <div>
                <label htmlFor="features-panels" className={labelClasses}>Panels (one per line)</label>
                <textarea
                  id="features-panels"
                  rows={3}
                  value={features.panels?.join('\n') || ''}
                  onChange={(e) => updateFeaturesList('panels', e.target.value)}
                  className={`${inputClasses} resize-y`}
                />
              </div>
              <div>
                <label htmlFor="features-doors" className={labelClasses}>Doors (one per line)</label>
                <textarea
                  id="features-doors"
                  rows={3}
                  value={features.doors?.join('\n') || ''}
                  onChange={(e) => updateFeaturesList('doors', e.target.value)}
                  className={`${inputClasses} resize-y`}
                />
              </div>
              <div>
                <label htmlFor="features-topMount" className={labelClasses}>Top Mount (one per line)</label>
                <textarea
                  id="features-topMount"
                  rows={3}
                  value={features.topMount?.join('\n') || ''}
                  onChange={(e) => updateFeaturesList('topMount', e.target.value)}
                  className={`${inputClasses} resize-y`}
                />
              </div>
              <div>
                <label htmlFor="features-remote" className={labelClasses}>Remote (one per line)</label>
                <textarea
                  id="features-remote"
                  rows={3}
                  value={features.remote?.join('\n') || ''}
                  onChange={(e) => updateFeaturesList('remote', e.target.value)}
                  className={`${inputClasses} resize-y`}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* ===== Actions ===== */}
      <div className="pt-4 flex flex-col-reverse sm:flex-row justify-end gap-3 border-t border-slate-100">
        <button type="button" onClick={() => window.history.back()} className="px-5 py-2.5 rounded-lg font-medium text-sm text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors text-center">
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting} className="flex items-center justify-center cursor-pointer gap-2 bg-[#004a99] hover:bg-[#003d80] text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-sm hover:shadow-md hover:shadow-[#004a99]/20 active:scale-[0.98]">
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <span>Save Product</span>
          )}
        </button>
      </div>
    </form>
  );
}
