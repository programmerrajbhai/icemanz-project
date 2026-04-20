'use client';

import { useState, useMemo } from "react";
import { updateProduct } from "./actions";
import { AlertCircle, Loader2, ImagePlus, X, Plus, FileText, Trash2 } from "lucide-react";
import { Category, Product } from "@prisma/client";

type CategoryWithSubs = Category & {
  subcategories: (Category & {
    subcategories: Category[];
  })[];
};

type ProductWithCategory = Product & {
  category: Category | null;
};

// Helper: find which top-level, level-2, and level-3 categories match the product's categoryId
function findCategoryPath(allCategories: CategoryWithSubs[], categoryId: string | null) {
  if (!categoryId) return { l1: '', l2: '', l3: '' };

  for (const top of allCategories) {
    if (top.id === categoryId) return { l1: top.id, l2: '', l3: '' };
    for (const sub of top.subcategories) {
      if (sub.id === categoryId) return { l1: top.id, l2: sub.id, l3: '' };
      for (const sub2 of sub.subcategories) {
        if (sub2.id === categoryId) return { l1: top.id, l2: sub.id, l3: sub2.id };
      }
    }
  }
  return { l1: '', l2: '', l3: '' };
}

export default function EditProductForm({ product, allCategories }: { product: ProductWithCategory, allCategories: CategoryWithSubs[] }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [existingImages, setExistingImages] = useState<string[]>(product.images || []);
  const [newImages, setNewImages] = useState<{file: File, preview: string}[]>([]);

  // Cascading category state
  const initialPath = useMemo(() => findCategoryPath(allCategories, product.categoryId), [allCategories, product.categoryId]);
  const [selectedLevel1, setSelectedLevel1] = useState(initialPath.l1);
  const [selectedLevel2, setSelectedLevel2] = useState(initialPath.l2);
  const [selectedLevel3, setSelectedLevel3] = useState(initialPath.l3);

  // Specs state
  const initialSpecs = (product.specs as { label: string; value: string }[]) || [];
  const [specs, setSpecs] = useState<{ label: string; value: string }[]>(initialSpecs);

  // Documents state
  const initialDocs = (product.documents as { name: string; url: string }[]) || [];
  const [existingDocs, setExistingDocs] = useState<{ name: string; url: string }[]>(initialDocs);
  const [newDocEntries, setNewDocEntries] = useState<{ name: string; file: File | null }[]>([]);

  const topCategories = useMemo(() => allCategories.filter(c => !c.parentId), [allCategories]);

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
    formData.set('existingDocuments', JSON.stringify(existingDocs));
    formData.set('existingImages', JSON.stringify(existingImages));

    formData.delete('images');
    newImages.forEach(img => formData.append('images', img.file));

    // Add new document files and names
    formData.delete('documents');
    formData.delete('documentNames');
    for (const entry of newDocEntries) {
      if (entry.file) {
        formData.append('documents', entry.file);
        formData.append('documentNames', entry.name || entry.file.name);
      }
    }

    const result = await updateProduct(product.id, formData);

    if (result?.error) {
      setError(result.error);
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const added = files.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setNewImages(prev => [...prev, ...added]);
    }
    e.target.value = '';
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setNewImages(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const addSpec = () => setSpecs([...specs, { label: '', value: '' }]);
  const removeSpec = (i: number) => setSpecs(specs.filter((_, idx) => idx !== i));
  const updateSpec = (i: number, field: 'label' | 'value', val: string) => {
    const updated = [...specs];
    updated[i][field] = val;
    setSpecs(updated);
  };

  const addNewDocEntry = () => setNewDocEntries([...newDocEntries, { name: '', file: null }]);
  const removeNewDocEntry = (i: number) => setNewDocEntries(newDocEntries.filter((_, idx) => idx !== i));
  const removeExistingDoc = (i: number) => setExistingDocs(existingDocs.filter((_, idx) => idx !== i));

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
          {/* Existing Images */}
          {existingImages.map((imgUrl, idx) => (
            <div key={`existing-${idx}`} className="relative w-full aspect-square rounded-xl border border-slate-200 overflow-hidden group bg-white shadow-sm">
              <img src={imgUrl} alt={`Existing ${idx + 1}`} className="w-full h-full object-cover" />
              <button type="button" onClick={(e) => { e.preventDefault(); removeExistingImage(idx); }} className="absolute top-2 right-2 size-7 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer opacity-100 md:opacity-0 md:group-hover:opacity-100">
                <X size={14} />
              </button>
            </div>
          ))}
          {/* New Images */}
          {newImages.map((img, idx) => (
            <div key={`new-${idx}`} className="relative w-full aspect-square rounded-xl border border-slate-200 overflow-hidden group bg-white shadow-sm">
              <img src={img.preview} alt={`New ${idx + 1}`} className="w-full h-full object-cover" />
              <button type="button" onClick={(e) => { e.preventDefault(); removeNewImage(idx); }} className="absolute top-2 right-2 size-7 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer opacity-100 md:opacity-0 md:group-hover:opacity-100">
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
                {(existingImages.length > 0 || newImages.length > 0) ? "Add more images" : "Click to upload"}
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
                <input type="text" id="title" name="title" required defaultValue={product.title} className={inputClasses} placeholder="e.g. TS060MR404A3-T" />
              </div>
              <div>
                <label htmlFor="slug" className={labelClasses}>Slug</label>
                <input type="text" id="slug" name="slug" defaultValue={product.slug} className={inputClasses} placeholder="Auto-generated if empty" />
              </div>
            </div>

            {/* Category Selector */}
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
              </div>
              <input type="hidden" name="categoryId" value={finalCategoryId} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className={labelClasses}>Price</label>
                <input type="text" id="price" name="price" defaultValue={product.price || ''} className={inputClasses} placeholder="e.g. $1,299.00" />
              </div>
              <div>
                <label htmlFor="badge" className={labelClasses}>Badge</label>
                <input type="text" id="badge" name="badge" defaultValue={product.badge || ''} className={inputClasses} placeholder="e.g. IN STOCK" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="condition" className={labelClasses}>Condition</label>
                <input type="text" id="condition" name="condition" defaultValue={product.condition || ''} className={inputClasses} placeholder="e.g. New" />
              </div>
              <div>
                <label htmlFor="type" className={labelClasses}>Type</label>
                <input type="text" id="type" name="type" defaultValue={product.type || ''} className={inputClasses} placeholder="e.g. Compressor" />
              </div>
            </div>
          </div>
        </div>

      {/* ===== SECTION 2: Product Details ===== */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 mb-4 pb-2 border-b border-slate-100">Product Details</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="keyFeatures" className={labelClasses}>Key Features (short summary)</label>
            <input type="text" id="keyFeatures" name="keyFeatures" defaultValue={product.keyFeatures || ''} className={inputClasses} placeholder="e.g. 3.5 HP, Low Temperature Condensing Unit With Scroll Compressor" />
          </div>
          <div>
            <label htmlFor="description" className={labelClasses}>Description</label>
            <textarea id="description" name="description" rows={3} defaultValue={product.description || ''} className={`${inputClasses} resize-y`} placeholder="Detailed product description..."></textarea>
          </div>
          <div>
            <label htmlFor="warranty" className={labelClasses}>Warranty (one per line)</label>
            <textarea id="warranty" name="warranty" rows={2} defaultValue={product.warranty.join('\n')} className={`${inputClasses} resize-y`} placeholder={"1 Year Compressor Warranty\n1 Year Fan Motor and Parts Warranty"}></textarea>
          </div>
          <div>
            <label htmlFor="detailedFeatures" className={labelClasses}>Detailed Features (one per line)</label>
            <textarea id="detailedFeatures" name="detailedFeatures" rows={4} defaultValue={product.detailedFeatures.join('\n')} className={`${inputClasses} resize-y`} placeholder={"Blue anti-corrosion-fin increases the life span\nHighest quality compressor in the world\nControl box is designed for easy installation"}></textarea>
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
          {/* Existing Documents */}
          {existingDocs.map((doc, i) => (
            <div key={`existing-${i}`} className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg p-3">
              <FileText size={18} className="text-[#004a99] shrink-0" />
              <div className="flex-1 text-sm font-medium text-slate-700 truncate">
                {doc.name}
              </div>
              <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-[#004a99] hover:underline px-2">View</a>
              <button type="button" onClick={() => removeExistingDoc(i)} className="shrink-0 size-9 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors cursor-pointer" title="Remove Document">
                <Trash2 size={14} />
              </button>
            </div>
          ))}

          {/* New Documents */}
          {newDocEntries.map((entry, i) => (
            <div key={`new-${i}`} className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg p-3">
              <FileText size={18} className="text-slate-400 shrink-0" />
              <input
                type="text"
                value={entry.name}
                onChange={(e) => {
                  const updated = [...newDocEntries];
                  updated[i].name = e.target.value;
                  setNewDocEntries(updated);
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
                    const updated = [...newDocEntries];
                    updated[i].file = file;
                    if (file && !updated[i].name) {
                      updated[i].name = file.name.replace(/\.[^/.]+$/, '');
                    }
                    setNewDocEntries(updated);
                  }}
                />
              </label>
              <button type="button" onClick={() => removeNewDocEntry(i)} className="shrink-0 size-9 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors cursor-pointer">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <button type="button" onClick={addNewDocEntry} className="inline-flex items-center gap-2 text-sm font-medium text-[#004a99] hover:text-[#003d80] transition-colors cursor-pointer">
            <Plus size={16} /> Add New Document
          </button>
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
              <span>Updating...</span>
            </>
          ) : (
            <span>Update Product</span>
          )}
        </button>
      </div>
    </form>
  );
}
