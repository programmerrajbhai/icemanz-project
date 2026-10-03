'use client';

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createProduct } from "./actions";
import toast from "react-hot-toast";
import {
  AlertCircle, Loader2, ImagePlus, X, Plus, FileText,
  Trash2, Zap, Wind, Package2, Settings, RefreshCw, ShoppingBag, LayoutGrid
} from "lucide-react";
import { Brand, Category } from "@prisma/client";

type CategoryWithSubs = Category & {
  subcategories: (Category & { subcategories: Category[] })[];
};
type ProductOption = { label: string; name: string; options: { label: string; price?: string }[] };
type Faq = { question: string; answer: string };
type Features = { panels?: string[]; doors?: string[]; topMount?: string[]; remote?: string[] };
type RefrigFeatures = {
  temperatureType?: string;
  hp?: string;
  voltage?: string;
  btu?: string;
  evaporatorType?: string;
  defrostType?: string;
  location?: string;
};

// ── Astra-specific types ────────────────────────────────────────────────────
type ConfigPropOption = { label: string; priceCents?: number };
type ConfigProperties = Record<string, ConfigPropOption[]>;   // e.g. { "Floor Type": [...] }
type RefrigChoice = { label: string; value: string; priceCents?: number };
type Addon = { name: string; priceText: string; maxQty: number };
type Layout = { name: string; value: string; thumbnail?: string };

export default function ProductForm({
  allCategories,
  allBrands,
  preselectedCategory,
  preselectedBrand,
}: {
  allCategories: CategoryWithSubs[];
  allBrands: Brand[];
  preselectedCategory?: any;
  preselectedBrand?: Brand | null;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);

  // ── Category cascade ───────────────────────────────────────────────────────
  const [selectedLevel1, setSelectedLevel1] = useState(() => {
    if (!preselectedCategory) return '';
    return preselectedCategory.parentId ? preselectedCategory.parentId : preselectedCategory.id;
  });
  const [selectedLevel2, setSelectedLevel2] = useState(() => {
    if (!preselectedCategory) return '';
    return preselectedCategory.parentId ? preselectedCategory.id : '';
  });
  const [selectedLevel3, setSelectedLevel3] = useState('');

  // ── JSON fields ────────────────────────────────────────────────────────────
  const [specs, setSpecs] = useState<{ label: string; value: string }[]>([]);
  const [docEntries, setDocEntries] = useState<{ name: string; file: File | null }[]>([]);
  const [productOptions, setProductOptions] = useState<ProductOption[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [features, setFeatures] = useState<Features>({});

  // ── Walk-in ────────────────────────────────────────────────────────────────
  const [walkInType, setWalkInType] = useState('');
  const [sizeW, setSizeW] = useState('');
  const [sizeL, setSizeL] = useState('');

  // ── Brand ──────────────────────────────────────────────────────────────────
  const [selectedBrandId, setSelectedBrandId] = useState(preselectedBrand?.id || '');

  // ── Refrigeration Equipment quick-fields ───────────────────────────────────
  const [refrigFeatures, setRefrigFeatures] = useState<RefrigFeatures>({});

  // ── Astra-specific state ───────────────────────────────────────────────────
  // configurable_properties: dynamic groups (e.g. Floor Type, Door Size, Indoor/Outdoor)
  const [configGroups, setConfigGroups] = useState<
    { groupName: string; options: ConfigPropOption[] }[]
  >([]);
  // refrigeration_choice
  const [refrigChoices, setRefrigChoices] = useState<RefrigChoice[]>([]);
  // addons
  const [addons, setAddons] = useState<Addon[]>([]);
  // layouts
  const [layouts, setLayouts] = useState<Layout[]>([]);
  // rich HTML features
  const [standardFeaturesHtml, setStandardFeaturesHtml] = useState('');
  const [refrigerationOptionsHtml, setRefrigerationOptionsHtml] = useState('');
  const [additionalOptionsHtml, setAdditionalOptionsHtml] = useState('');

  // ── Derived category flags ─────────────────────────────────────────────────
  const topCategories = useMemo(() => allCategories.filter(c => !c.parentId), [allCategories]);
  const level2Options = useMemo(() => {
    if (!selectedLevel1) return [];
    return topCategories.find(c => c.id === selectedLevel1)?.subcategories || [];
  }, [selectedLevel1, topCategories]);
  const level3Options = useMemo(() => {
    if (!selectedLevel2) return [];
    return level2Options.find(c => c.id === selectedLevel2)?.subcategories || [];
  }, [selectedLevel2, level2Options]);
  const finalCategoryId = selectedLevel3 || selectedLevel2 || selectedLevel1 || '';

  const getSlug = (id: string) =>
    allCategories.find(c => c.id === id)?.slug ??
    allCategories.flatMap(c => c.subcategories).find(c => c.id === id)?.slug ??
    allCategories.flatMap(c => c.subcategories).flatMap(c => c.subcategories).find(c => c.id === id)?.slug ?? '';

  const activeCatSlug = getSlug(finalCategoryId) || getSlug(selectedLevel1);
  const walkInCoolerCat = topCategories.find(c => c.slug === 'walk-in-cooler-freezer');
  const isWalkInCooler = !!(walkInCoolerCat && selectedLevel1 === walkInCoolerCat.id);
  const isCondensing = activeCatSlug === 'condensing-units';
  const isEvaporation = activeCatSlug === 'evaporation-units';
  const isCombo = activeCatSlug === 'combo-units-package-units';
  const isRefrigEquip = isCondensing || isEvaporation || isCombo;

  // Detect if selected brand is Astra
  const selectedBrand = allBrands.find(b => b.id === selectedBrandId);
  const isAstraBrand = selectedBrand?.slug === 'astra' || selectedBrand?.name?.toLowerCase() === 'astra';
  const showAstraSections = isWalkInCooler && isAstraBrand;

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set('categoryId', finalCategoryId);
    formData.set('brandId', selectedBrandId);
    formData.set('specs', JSON.stringify(specs));
    formData.set('productOptions', JSON.stringify(
      showAstraSections
        ? buildAstraProductOptions()
        : productOptions
    ));
    formData.set('faqs', JSON.stringify(faqs));

    // Build features — preserve any existing keys, add walk-in + refrig fields
    const currentFeatures: any = { ...features };
    if (isWalkInCooler) {
      currentFeatures.walkInType = walkInType;
      if (sizeW && sizeL) currentFeatures.size = `${sizeW}' x ${sizeL}'`;
    }
    if (isRefrigEquip) Object.assign(currentFeatures, refrigFeatures);

    // Astra HTML feature sections
    if (showAstraSections) {
      if (standardFeaturesHtml) currentFeatures.standard_features_html = standardFeaturesHtml;
      if (refrigerationOptionsHtml) currentFeatures.refrigeration_options_html = refrigerationOptionsHtml;
      if (additionalOptionsHtml) currentFeatures.additional_options_html = additionalOptionsHtml;
    }
    formData.set('features', JSON.stringify(currentFeatures));

    // Layouts (Astra)
    if (showAstraSections) {
      formData.set('layouts', JSON.stringify(layouts));
    }

    formData.delete('images');
    images.forEach(img => formData.append('images', img.file));
    formData.delete('documents');
    formData.delete('documentNames');
    for (const entry of docEntries) {
      if (entry.file) {
        formData.append('documents', entry.file);
        formData.append('documentNames', entry.name || entry.file.name);
      }
    }

    const result = await createProduct(formData);
    if (result?.error) { setError(result.error); setIsSubmitting(false); return; }
    if ((result as any)?.success) {
      toast.success('Product added successfully!', { duration: 3000 });
      // Return to brand page if we came from there
      const ref = isAstraBrand ? `/admin/products/walk-in-cooler-freezer/brand/${selectedBrand?.slug}` : '/admin/products';
      router.push(ref);
    }
  };

  // Build Astra productOptions object from state
  const buildAstraProductOptions = () => {
    const configurable_properties: ConfigProperties = {};
    for (const grp of configGroups) {
      if (grp.groupName.trim()) {
        configurable_properties[grp.groupName] = grp.options.map(o => ({
          label: o.label,
          value: o.label,
          ...(o.priceCents ? { price_cents: o.priceCents } : {}),
        }));
      }
    }
    return {
      configurable_properties,
      refrigeration_choice: refrigChoices.map(r => ({
        label: r.label,
        value: r.value || r.label,
        ...(r.priceCents ? { price_cents: r.priceCents } : {}),
      })),
      addons: addons.map(a => ({
        name: a.name,
        price_text: a.priceText,
        max_quantity: a.maxQty,
      })),
    };
  };

  // ── Generic option handlers ────────────────────────────────────────────────
  const addProductOption = () => setProductOptions([...productOptions, { label: '', name: '', options: [{ label: '', price: '' }] }]);
  const removeProductOption = (i: number) => setProductOptions(productOptions.filter((_, idx) => idx !== i));
  const updateProductOption = (i: number, f: 'label' | 'name', v: string) => { const u = [...productOptions]; u[i][f] = v; setProductOptions(u); };
  const addOptionValue = (oi: number) => { const u = [...productOptions]; u[oi].options.push({ label: '', price: '' }); setProductOptions(u); };
  const removeOptionValue = (oi: number, vi: number) => { const u = [...productOptions]; u[oi].options = u[oi].options.filter((_, i) => i !== vi); setProductOptions(u); };
  const updateOptionValue = (oi: number, vi: number, f: 'label' | 'price', v: string) => { const u = [...productOptions]; u[oi].options[vi][f] = v; setProductOptions(u); };

  // ── FAQ handlers ───────────────────────────────────────────────────────────
  const addFaq = () => setFaqs([...faqs, { question: '', answer: '' }]);
  const removeFaq = (i: number) => setFaqs(faqs.filter((_, idx) => idx !== i));
  const updateFaq = (i: number, f: 'question' | 'answer', v: string) => { const u = [...faqs]; u[i][f] = v; setFaqs(u); };

  // ── Features helpers ───────────────────────────────────────────────────────
  const updateFeaturesList = (section: keyof Features, value: string) => {
    const list = value.split('\n').map(s => s.trim()).filter(Boolean);
    setFeatures(prev => ({ ...prev, [section]: list.length > 0 ? list : undefined }));
  };
  const setRF = (key: keyof RefrigFeatures, val: string) =>
    setRefrigFeatures(prev => ({ ...prev, [key]: val }));

  // ── Image handlers ─────────────────────────────────────────────────────────
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length) setImages(prev => [...prev, ...files.map(f => ({ file: f, preview: URL.createObjectURL(f) }))]);
    e.target.value = '';
  };
  const removeImage = (i: number) => setImages(prev => { const n = [...prev]; URL.revokeObjectURL(n[i].preview); n.splice(i, 1); return n; });

  // ── Spec handlers ──────────────────────────────────────────────────────────
  const addSpec = () => setSpecs([...specs, { label: '', value: '' }]);
  const removeSpec = (i: number) => setSpecs(specs.filter((_, idx) => idx !== i));
  const updateSpec = (i: number, f: 'label' | 'value', v: string) => { const u = [...specs]; u[i][f] = v; setSpecs(u); };

  // ── Doc handlers ───────────────────────────────────────────────────────────
  const addDocEntry = () => setDocEntries([...docEntries, { name: '', file: null }]);
  const removeDocEntry = (i: number) => setDocEntries(docEntries.filter((_, idx) => idx !== i));

  // ── Astra configurable_properties handlers ─────────────────────────────────
  const addConfigGroup = () => setConfigGroups([...configGroups, { groupName: '', options: [{ label: '' }] }]);
  const removeConfigGroup = (gi: number) => setConfigGroups(configGroups.filter((_, i) => i !== gi));
  const updateConfigGroupName = (gi: number, v: string) => { const u = [...configGroups]; u[gi].groupName = v; setConfigGroups(u); };
  const addConfigOption = (gi: number) => { const u = [...configGroups]; u[gi].options.push({ label: '' }); setConfigGroups(u); };
  const removeConfigOption = (gi: number, oi: number) => { const u = [...configGroups]; u[gi].options = u[gi].options.filter((_, i) => i !== oi); setConfigGroups(u); };
  const updateConfigOption = (gi: number, oi: number, f: keyof ConfigPropOption, v: any) => {
    const u = [...configGroups]; (u[gi].options[oi] as any)[f] = v; setConfigGroups(u);
  };

  // ── Astra refrigeration_choice handlers ────────────────────────────────────
  const addRefrigChoice = () => setRefrigChoices([...refrigChoices, { label: '', value: '' }]);
  const removeRefrigChoice = (i: number) => setRefrigChoices(refrigChoices.filter((_, idx) => idx !== i));
  const updateRefrigChoice = (i: number, f: keyof RefrigChoice, v: any) => { const u = [...refrigChoices]; (u[i] as any)[f] = v; setRefrigChoices(u); };

  // ── Astra addon handlers ───────────────────────────────────────────────────
  const addAddon = () => setAddons([...addons, { name: '', priceText: '', maxQty: 5 }]);
  const removeAddon = (i: number) => setAddons(addons.filter((_, idx) => idx !== i));
  const updateAddon = (i: number, f: keyof Addon, v: any) => { const u = [...addons]; (u[i] as any)[f] = v; setAddons(u); };

  // ── Astra layout handlers ──────────────────────────────────────────────────
  const addLayout = () => setLayouts([...layouts, { name: '', value: '' }]);
  const removeLayout = (i: number) => setLayouts(layouts.filter((_, idx) => idx !== i));
  const updateLayout = (i: number, f: keyof Layout, v: string) => { const u = [...layouts]; (u[i] as any)[f] = v; setLayouts(u); };

  // ── Styles ─────────────────────────────────────────────────────────────────
  const ic = "py-2.5 px-3.5 block w-full border border-slate-300 rounded-lg text-sm focus:border-[#004a99] focus:ring-1 focus:ring-[#004a99]/20 bg-white placeholder:text-slate-400 outline-none transition-all";
  const sc = `${ic} appearance-none cursor-pointer`;
  const lc = "block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5";
  const tac = `${ic} resize-y`;

  const refrigBanner = isCondensing
    ? { icon: Zap, label: 'Condensing Unit', color: 'bg-blue-50 border-blue-200 text-blue-700' }
    : isEvaporation
      ? { icon: Wind, label: 'Evaporation Unit', color: 'bg-green-50 border-green-200 text-green-700' }
      : isCombo
        ? { icon: Package2, label: 'Combo / Package Unit', color: 'bg-purple-50 border-purple-200 text-purple-700' }
        : null;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-start gap-3">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Category type banner */}
      {refrigBanner && (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border ${refrigBanner.color} text-sm font-medium`}>
          <refrigBanner.icon size={16} className="shrink-0" />
          Adding product to: <span className="font-bold ml-1">{refrigBanner.label}</span>
        </div>
      )}

      {/* Astra banner */}
      {showAstraSections && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl border bg-amber-50 border-amber-200 text-amber-800 text-sm font-medium">
          <Settings size={16} className="shrink-0" />
          Astra brand detected — Astra-specific sections are enabled below
        </div>
      )}

      {/* ===== SECTION 1: Images ===== */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 mb-4 pb-2 border-b border-slate-100">Product Images</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {images.map((img, idx) => (
            <div key={idx} className="relative w-full aspect-square rounded-xl border border-slate-200 overflow-hidden group bg-white shadow-sm">
              <img src={img.preview} alt="" className="w-full h-full object-cover" />
              <button type="button" onClick={() => removeImage(idx)} className="absolute top-2 right-2 size-7 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer opacity-100 md:opacity-0 md:group-hover:opacity-100">
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
              <label htmlFor="title" className={lc}>Title *</label>
              <input type="text" id="title" name="title" required className={ic} placeholder="e.g. Astra 8x10 Walk-in Cooler" />
            </div>
            {!isWalkInCooler && (
              <div>
                <label htmlFor="slug" className={lc}>Slug</label>
                <input type="text" id="slug" name="slug" className={ic} placeholder="Auto-generated if empty" />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Brand text — auto-fill from selected brand */}
            <div>
              <label htmlFor="brand" className={lc}>Brand (Text)</label>
              <input
                type="text"
                id="brand"
                name="brand"
                className={ic}
                placeholder="e.g. Astra"
                defaultValue={preselectedBrand?.name || ''}
                key={preselectedBrand?.name}
              />
            </div>
            <div>
              <label htmlFor="brandId" className={lc}>Brand</label>
              <select
                id="brandId"
                value={selectedBrandId}
                onChange={e => setSelectedBrandId(e.target.value)}
                className={`${sc} ${selectedBrandId ? 'border-[#004a99]/40 bg-[#004a99]/[0.03]' : ''}`}
              >
                <option value="">Select Brand...</option>
                {allBrands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
              <input type="hidden" name="brandId" value={selectedBrandId} />
            </div>
            {/* SKU — always visible */}
            <div>
              <label htmlFor="sku" className={lc}>SKU</label>
              <input type="text" id="sku" name="sku" className={ic} placeholder="e.g. DCWF8X10" />
            </div>
            <div>
              <label htmlFor="price" className={lc}>Price ($)</label>
              <input type="text" id="price" name="price" className={ic} placeholder="e.g. 3680" />
            </div>
          </div>

          {/* Category Selector */}
          {!isWalkInCooler && (
            <div>
              <label className={`${lc} mb-2`}>Category</label>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 sm:p-4 space-y-3">
                <div className="flex items-start sm:items-center gap-3">
                  <span className="shrink-0 size-6 rounded-full bg-[#004a99] text-white text-xs font-bold flex items-center justify-center mt-1 sm:mt-0">1</span>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-500 mb-1">Main Category</p>
                    <select value={selectedLevel1} onChange={e => { setSelectedLevel1(e.target.value); setSelectedLevel2(''); setSelectedLevel3(''); }} className={`${sc} ${selectedLevel1 ? 'border-[#004a99]/40 bg-[#004a99]/[0.03]' : ''}`}>
                      <option value="">Select category...</option>
                      {topCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                  </div>
                </div>
                {level2Options.length > 0 && (
                  <div className="flex items-start sm:items-center gap-3">
                    <span className="shrink-0 size-6 rounded-full bg-[#0070cc] text-white text-xs font-bold flex items-center justify-center mt-1 sm:mt-0">2</span>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-slate-500 mb-1">Subcategory</p>
                      <select value={selectedLevel2} onChange={e => { setSelectedLevel2(e.target.value); setSelectedLevel3(''); }} className={`${sc} ${selectedLevel2 ? 'border-[#0070cc]/40 bg-[#0070cc]/[0.03]' : ''}`}>
                        <option value="">Select subcategory...</option>
                        {level2Options.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                      </select>
                    </div>
                  </div>
                )}
                {level3Options.length > 0 && (
                  <div className="flex items-start sm:items-center gap-3">
                    <span className="shrink-0 size-6 rounded-full bg-[#0891b2] text-white text-xs font-bold flex items-center justify-center mt-1 sm:mt-0">3</span>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-slate-500 mb-1">Type</p>
                      <select value={selectedLevel3} onChange={e => setSelectedLevel3(e.target.value)} className={`${sc} ${selectedLevel3 ? 'border-[#0891b2]/40 bg-[#0891b2]/[0.03]' : ''}`}>
                        <option value="">Select type...</option>
                        {level3Options.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
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

          {/* Walk-in category (locked) */}
          {isWalkInCooler && (
            <div>
              <label className={`${lc} mb-2`}>Category</label>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 sm:p-4 space-y-3">
                <div className="flex items-start sm:items-center gap-3">
                  <span className="shrink-0 size-6 rounded-full bg-[#004a99] text-white text-xs font-bold flex items-center justify-center mt-1 sm:mt-0">1</span>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-500 mb-1">Main Category</p>
                    <input type="text" value={topCategories.find(c => c.id === selectedLevel1)?.name || ''} disabled className={`${ic} bg-slate-100`} />
                  </div>
                </div>
                {level2Options.length > 0 && (
                  <div className="flex items-start sm:items-center gap-3">
                    <span className="shrink-0 size-6 rounded-full bg-[#0070cc] text-white text-xs font-bold flex items-center justify-center mt-1 sm:mt-0">2</span>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-slate-500 mb-1">Subcategory</p>
                      <select value={selectedLevel2} onChange={e => setSelectedLevel2(e.target.value)} className={`${sc} ${selectedLevel2 ? 'border-[#0070cc]/40 bg-[#0070cc]/[0.03]' : ''}`}>
                        <option value="">Select subcategory...</option>
                        {level2Options.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          <input type="hidden" name="categoryId" value={finalCategoryId} />

          {/* Generic (non-walk-in, non-refrig) extra fields */}
          {!isWalkInCooler && !isRefrigEquip && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label htmlFor="badge" className={lc}>Badge</label><input type="text" id="badge" name="badge" className={ic} placeholder="e.g. IN STOCK" /></div>
                <div><label htmlFor="condition" className={lc}>Condition</label><input type="text" id="condition" name="condition" className={ic} placeholder="e.g. New" /></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label htmlFor="type" className={lc}>Type</label><input type="text" id="type" name="type" className={ic} placeholder="e.g. Compressor" /></div>
              </div>
            </>
          )}

          {/* Walk-in type selector — extended with Remote option */}
          {isWalkInCooler && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="type" className={lc}>Refrigeration Type</label>
                <select id="type" name="type" className={sc}>
                  <option value="">Select Refrigeration Type...</option>
                  <option value="No Refrigeration">No Refrigeration</option>
                  <option value="Top-Mount Refrigeration">Top-Mount Refrigeration</option>
                  <option value="Remote Refrigeration">Remote Refrigeration</option>
                </select>
              </div>
            </div>
          )}

          {/* Refrigeration Equipment quick-fields */}
          {isRefrigEquip && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                {isCondensing ? '⚡ Condensing Unit Details' : isEvaporation ? '💨 Evaporation Unit Details' : '📦 Combo / Package Unit Details'}
              </p>
              {isCondensing && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div><label className={lc}>Horsepower (HP)</label><input type="text" value={refrigFeatures.hp || ''} onChange={e => setRF('hp', e.target.value)} className={ic} placeholder="e.g. 4 HP" /></div>
                  <div>
                    <label className={lc}>Temperature Type</label>
                    <select value={refrigFeatures.temperatureType || ''} onChange={e => setRF('temperatureType', e.target.value)} className={sc}>
                      <option value="">Select...</option>
                      <option>Medium Temperature</option><option>Low Temperature</option><option>Extended Medium Temperature</option>
                    </select>
                  </div>
                  <div>
                    <label className={lc}>Voltage</label>
                    <select value={refrigFeatures.voltage || ''} onChange={e => setRF('voltage', e.target.value)} className={sc}>
                      <option value="">Select...</option>
                      <option value="208-230V/1Ph/60Hz">208-230V / 1Ph / 60Hz</option>
                      <option value="208-230V/3Ph/60Hz">208-230V / 3Ph / 60Hz</option>
                    </select>
                  </div>
                  <input type="hidden" name="type" value="Condensing Unit" />
                  <input type="hidden" name="condition" value="New" />
                </div>
              )}
              {isEvaporation && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div><label className={lc}>BTU Capacity</label><input type="text" value={refrigFeatures.btu || ''} onChange={e => setRF('btu', e.target.value)} className={ic} placeholder="e.g. 13,700 BTU" /></div>
                  <div>
                    <label className={lc}>Evaporator Profile</label>
                    <select value={refrigFeatures.evaporatorType || ''} onChange={e => setRF('evaporatorType', e.target.value)} className={sc}>
                      <option value="">Select...</option>
                      <option>Low Profile</option><option>Medium Profile</option><option>Thin Profile</option><option>Center Mount</option>
                    </select>
                  </div>
                  <div>
                    <label className={lc}>Defrost Type</label>
                    <select value={refrigFeatures.defrostType || ''} onChange={e => setRF('defrostType', e.target.value)} className={sc}>
                      <option value="">Select...</option>
                      <option>Air Defrost</option><option>Electric Defrost</option><option>Hot Gas Defrost</option>
                    </select>
                  </div>
                  <div>
                    <label className={lc}>Voltage</label>
                    <select value={refrigFeatures.voltage || ''} onChange={e => setRF('voltage', e.target.value)} className={sc}>
                      <option value="">Select...</option>
                      <option value="115V/1Ph/60Hz">115V / 1Ph / 60Hz</option>
                      <option value="208-230V/1Ph/60Hz">208-230V / 1Ph / 60Hz</option>
                    </select>
                  </div>
                  <input type="hidden" name="type" value="Evaporator Coil" />
                  <input type="hidden" name="condition" value="New" />
                </div>
              )}
              {isCombo && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div><label className={lc}>BTU Capacity</label><input type="text" value={refrigFeatures.btu || ''} onChange={e => setRF('btu', e.target.value)} className={ic} placeholder="e.g. 2,200 BTU" /></div>
                  <div>
                    <label className={lc}>Temperature Type</label>
                    <select value={refrigFeatures.temperatureType || ''} onChange={e => setRF('temperatureType', e.target.value)} className={sc}>
                      <option value="">Select...</option><option>Medium Temperature</option><option>Low Temperature</option>
                    </select>
                  </div>
                  <div>
                    <label className={lc}>Location</label>
                    <select value={refrigFeatures.location || ''} onChange={e => setRF('location', e.target.value)} className={sc}>
                      <option value="">Select...</option><option>Indoor</option><option>Outdoor</option>
                    </select>
                  </div>
                  <input type="hidden" name="type" value="Indoor Package Unit" />
                  <input type="hidden" name="condition" value="New" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ===== SECTION: Product Details ===== */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 mb-4 pb-2 border-b border-slate-100">Product Details</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="keyFeatures" className={lc}>Key Features (short summary)</label>
            <input type="text" id="keyFeatures" name="keyFeatures" className={ic}
              placeholder={isCondensing ? "e.g. 4 HP, Medium Temperature Condensing Unit 208-230V/1Ph/60Hz"
                : isEvaporation ? "e.g. 13,700 BTU, Low Profile Unit Cooler, Air Defrost with EC Motor"
                  : isCombo ? "e.g. 2,200 BTU, Medium Temperature, Indoor Package Unit"
                    : "Short description of key specs"} />
          </div>
          <div>
            <label htmlFor="description" className={lc}>Description</label>
            <textarea id="description" name="description" rows={3} className={tac} placeholder="Detailed product description..." />
          </div>
          <div>
            <label htmlFor="warranty" className={lc}>Warranty (one per line)</label>
            <textarea id="warranty" name="warranty" rows={2} className={tac}
              placeholder={isCondensing ? "1 Year Fan Motor and Parts Warranty\n1 Year Compressor Warranty"
                : isEvaporation ? "1 Year Fan Motor and Parts Warranty"
                  : isCombo ? "2 Year Compressor and Parts Warranty\n1 Year Labor Warranty"
                    : "1 Year Compressor Warranty\n1 Year Fan Motor and Parts Warranty"} />
          </div>
          <div>
            <label htmlFor="detailedFeatures" className={lc}>Detailed Features (one per line)</label>
            <textarea id="detailedFeatures" name="detailedFeatures" rows={5} className={tac}
              placeholder="Blue anti-corrosion-fin increases the life span&#10;Highest quality compressor in the world&#10;Control box is designed for easy installation" />
          </div>
        </div>
      </div>

      {/* ===== SECTION: Walk-In Filters ===== */}
      {isWalkInCooler && (
        <div>
          <h3 className="text-sm font-bold text-slate-700 mb-4 pb-2 border-b border-slate-100">Walk-In Details</h3>
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={lc}>Walk In Type</label>
                <select value={walkInType} onChange={e => setWalkInType(e.target.value)} className={sc}>
                  <option value="">Select Walk In Type...</option>
                  <option value="Cooler (Refrigerator) No Floor">Cooler (Refrigerator) No Floor</option>
                  <option value="Cooler (Refrigerator) with Floor">Cooler (Refrigerator) with Floor</option>
                  <option value="Freezer with Floor">Freezer with Floor</option>
                  <option value="Combo (Cooler & Freezer)">Combo (Cooler &amp; Freezer)</option>
                </select>
              </div>
              <div>
                <label className={lc}>Size W x L (ft)</label>
                <div className="flex items-center gap-2">
                  <input type="number" value={sizeW} onChange={e => setSizeW(e.target.value)} className={`${ic} px-2`} placeholder="W" />
                  <span className="text-slate-400 font-medium">x</span>
                  <input type="number" value={sizeL} onChange={e => setSizeL(e.target.value)} className={`${ic} px-2`} placeholder="L" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== SECTION: Specifications ===== */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 mb-4 pb-2 border-b border-slate-100">Specifications</h3>
        <div className="space-y-3">
          {specs.map((spec, i) => (
            <div key={i} className="flex items-center gap-3">
              <input type="text" value={spec.label} onChange={e => updateSpec(i, 'label', e.target.value)} className={`${ic} flex-1`} placeholder="Label (e.g. Horsepower)" />
              <input type="text" value={spec.value} onChange={e => updateSpec(i, 'value', e.target.value)} className={`${ic} flex-1`} placeholder="Value (e.g. 4 HP)" />
              <button type="button" onClick={() => removeSpec(i)} className="shrink-0 size-9 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors cursor-pointer"><Trash2 size={14} /></button>
            </div>
          ))}
          <button type="button" onClick={addSpec} className="inline-flex items-center gap-2 text-sm font-medium text-[#004a99] hover:text-[#003d80] transition-colors cursor-pointer">
            <Plus size={16} /> Add Specification
          </button>
        </div>
      </div>

      {/* ===== SECTION: Documents ===== */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 mb-4 pb-2 border-b border-slate-100">Documents (PDF Files)</h3>
        <div className="space-y-3">
          {docEntries.map((entry, i) => (
            <div key={i} className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg p-3">
              <FileText size={18} className="text-slate-400 shrink-0" />
              <input type="text" value={entry.name} onChange={e => { const u = [...docEntries]; u[i].name = e.target.value; setDocEntries(u); }} className={`${ic} flex-1`} placeholder="Document name (e.g. Cut Sheet)" />
              <label className="shrink-0 px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors">
                {entry.file ? entry.file.name.substring(0, 20) + '...' : 'Choose File'}
                <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e => { const f = e.target.files?.[0] || null; const u = [...docEntries]; u[i].file = f; if (f && !u[i].name) u[i].name = f.name.replace(/\.[^/.]+$/, ''); setDocEntries(u); }} />
              </label>
              <button type="button" onClick={() => removeDocEntry(i)} className="shrink-0 size-9 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors cursor-pointer"><Trash2 size={14} /></button>
            </div>
          ))}
          <button type="button" onClick={addDocEntry} className="inline-flex items-center gap-2 text-sm font-medium text-[#004a99] hover:text-[#003d80] transition-colors cursor-pointer">
            <Plus size={16} /> Add Document
          </button>
        </div>
      </div>

      {/* ===== SECTION: FAQs ===== */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 mb-4 pb-2 border-b border-slate-100">FAQs</h3>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="flex flex-col gap-2 bg-slate-50 border border-slate-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <input type="text" value={faq.question} onChange={e => updateFaq(i, 'question', e.target.value)} className={`${ic} flex-1`} placeholder="Question" />
                <button type="button" onClick={() => removeFaq(i)} className="shrink-0 size-9 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors cursor-pointer"><Trash2 size={14} /></button>
              </div>
              <textarea value={faq.answer} onChange={e => updateFaq(i, 'answer', e.target.value)} rows={2} className={tac} placeholder="Answer" />
            </div>
          ))}
          <button type="button" onClick={addFaq} className="inline-flex items-center gap-2 text-sm font-medium text-[#004a99] hover:text-[#003d80] transition-colors cursor-pointer">
            <Plus size={16} /> Add FAQ
          </button>
        </div>
      </div>

      {/* ===== SECTION: Generic Product Options (non-Astra) ===== */}
      {!showAstraSections && (
        <div>
          <h3 className="text-sm font-bold text-slate-700 mb-4 pb-2 border-b border-slate-100">Product Options</h3>
          <div className="space-y-4">
            {productOptions.map((option, i) => (
              <div key={i} className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="grid grid-cols-2 gap-3 flex-1">
                    <input type="text" value={option.label} onChange={e => updateProductOption(i, 'label', e.target.value)} className={ic} placeholder="Option Label" />
                    <input type="text" value={option.name} onChange={e => updateProductOption(i, 'name', e.target.value)} className={ic} placeholder="Option Name" />
                  </div>
                  <button type="button" onClick={() => removeProductOption(i)} className="ml-3 shrink-0 size-9 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors cursor-pointer"><Trash2 size={14} /></button>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Values</p>
                  {option.options.map((optVal, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <input type="text" value={optVal.label} onChange={e => updateOptionValue(i, j, 'label', e.target.value)} className={`${ic} flex-1`} placeholder="Value Label" />
                      <input type="text" value={optVal.price || ''} onChange={e => updateOptionValue(i, j, 'price', e.target.value)} className={`${ic} w-32`} placeholder="Price (opt.)" />
                      <button type="button" onClick={() => removeOptionValue(i, j)} className="shrink-0 size-9 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors cursor-pointer"><Trash2 size={14} /></button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addOptionValue(i)} className="inline-flex items-center gap-2 text-sm font-medium text-[#004a99] hover:text-[#003d80] transition-colors cursor-pointer"><Plus size={14} /> Add Value</button>
                </div>
              </div>
            ))}
            <button type="button" onClick={addProductOption} className="inline-flex items-center gap-2 text-sm font-medium text-[#004a99] hover:text-[#003d80] transition-colors cursor-pointer">
              <Plus size={16} /> Add Product Option
            </button>
          </div>
        </div>
      )}

      {/* ===== ASTRA SECTIONS ===== */}
      {showAstraSections && (
        <>
          {/* ── Astra: Configurable Properties ── */}
          <div>
            <h3 className="text-sm font-bold text-slate-700 mb-1 pb-2 border-b border-amber-200 flex items-center gap-2">
              <Settings size={15} className="text-amber-600" /> Astra — Configurable Properties
            </h3>
            <p className="text-xs text-slate-400 mb-4">e.g. Floor Type, Door Size, Indoor/Outdoor — each group becomes a dropdown on the product page.</p>
            <div className="space-y-4">
              {configGroups.map((grp, gi) => (
                <div key={gi} className="bg-amber-50/60 border border-amber-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <input type="text" value={grp.groupName} onChange={e => updateConfigGroupName(gi, e.target.value)} className={`${ic} flex-1`} placeholder="Group name (e.g. Floor Type)" />
                    <button type="button" onClick={() => removeConfigGroup(gi)} className="shrink-0 size-9 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors cursor-pointer"><Trash2 size={14} /></button>
                  </div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Options</p>
                  {grp.options.map((opt, oi) => (
                    <div key={oi} className="flex items-center gap-2">
                      <input type="text" value={opt.label} onChange={e => updateConfigOption(gi, oi, 'label', e.target.value)} className={`${ic} flex-1`} placeholder="Option label (e.g. With Floor)" />
                      <input type="number" value={opt.priceCents || ''} onChange={e => updateConfigOption(gi, oi, 'priceCents', e.target.value ? Number(e.target.value) : undefined)} className={`${ic} w-36`} placeholder="Price (cents)" />
                      <button type="button" onClick={() => removeConfigOption(gi, oi)} className="shrink-0 size-9 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors cursor-pointer"><Trash2 size={14} /></button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addConfigOption(gi)} className="inline-flex items-center gap-2 text-xs font-medium text-amber-700 hover:text-amber-900 transition-colors cursor-pointer"><Plus size={13} /> Add Option</button>
                </div>
              ))}
              <button type="button" onClick={addConfigGroup} className="inline-flex items-center gap-2 text-sm font-medium text-amber-700 hover:text-amber-900 transition-colors cursor-pointer">
                <Plus size={16} /> Add Property Group
              </button>
            </div>
          </div>

          {/* ── Astra: Refrigeration Choice ── */}
          <div>
            <h3 className="text-sm font-bold text-slate-700 mb-1 pb-2 border-b border-amber-200 flex items-center gap-2">
              <RefreshCw size={15} className="text-amber-600" /> Astra — Refrigeration Choice
            </h3>
            <p className="text-xs text-slate-400 mb-4">Options shown in the Refrigeration selector (e.g. Top Mount - Indoor, Remote, Box Only). Price in cents.</p>
            <div className="space-y-3">
              {refrigChoices.map((rc, i) => (
                <div key={i} className="flex items-center gap-3 bg-amber-50/60 border border-amber-200 rounded-lg p-3">
                  <input type="text" value={rc.label} onChange={e => updateRefrigChoice(i, 'label', e.target.value)} className={`${ic} flex-1`} placeholder="Label (e.g. Top Mount - Indoor)" />
                  <input type="text" value={rc.value} onChange={e => updateRefrigChoice(i, 'value', e.target.value)} className={`${ic} flex-1`} placeholder="Value key (e.g. top-mount-indoor)" />
                  <input type="number" value={rc.priceCents || ''} onChange={e => updateRefrigChoice(i, 'priceCents', e.target.value ? Number(e.target.value) : undefined)} className={`${ic} w-36`} placeholder="Price (cents)" />
                  <button type="button" onClick={() => removeRefrigChoice(i)} className="shrink-0 size-9 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors cursor-pointer"><Trash2 size={14} /></button>
                </div>
              ))}
              <button type="button" onClick={addRefrigChoice} className="inline-flex items-center gap-2 text-sm font-medium text-amber-700 hover:text-amber-900 transition-colors cursor-pointer">
                <Plus size={16} /> Add Refrigeration Option
              </button>
            </div>
          </div>

          {/* ── Astra: Add-Ons ── */}
          <div>
            <h3 className="text-sm font-bold text-slate-700 mb-1 pb-2 border-b border-amber-200 flex items-center gap-2">
              <ShoppingBag size={15} className="text-amber-600" /> Astra — Add-Ons
            </h3>
            <p className="text-xs text-slate-400 mb-4">Purchasable add-ons shown on the product page (e.g. LED Light, Ramp, Door Kick Plate).</p>
            <div className="space-y-3">
              {addons.map((addon, i) => (
                <div key={i} className="flex items-center gap-3 bg-amber-50/60 border border-amber-200 rounded-lg p-3">
                  <input type="text" value={addon.name} onChange={e => updateAddon(i, 'name', e.target.value)} className={`${ic} flex-1`} placeholder="Add-on name (e.g. LED Light)" />
                  <input type="text" value={addon.priceText} onChange={e => updateAddon(i, 'priceText', e.target.value)} className={`${ic} flex-1`} placeholder="Price text (e.g. $150.00 / Ea.)" />
                  <input type="number" min={1} max={20} value={addon.maxQty} onChange={e => updateAddon(i, 'maxQty', Number(e.target.value))} className={`${ic} w-24`} placeholder="Max qty" />
                  <button type="button" onClick={() => removeAddon(i)} className="shrink-0 size-9 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors cursor-pointer"><Trash2 size={14} /></button>
                </div>
              ))}
              <button type="button" onClick={addAddon} className="inline-flex items-center gap-2 text-sm font-medium text-amber-700 hover:text-amber-900 transition-colors cursor-pointer">
                <Plus size={16} /> Add Add-On
              </button>
            </div>
          </div>

          {/* ── Astra: Layouts ── */}
          <div>
            <h3 className="text-sm font-bold text-slate-700 mb-1 pb-2 border-b border-amber-200 flex items-center gap-2">
              <LayoutGrid size={15} className="text-amber-600" /> Astra — Door Layouts
            </h3>
            <p className="text-xs text-slate-400 mb-4">Visual door layout options shown as diagram grid. Thumbnail is a public image URL.</p>
            <div className="space-y-3">
              {layouts.map((layout, i) => (
                <div key={i} className="flex items-center gap-3 bg-amber-50/60 border border-amber-200 rounded-lg p-3">
                  <input type="text" value={layout.name} onChange={e => updateLayout(i, 'name', e.target.value)} className={`${ic} flex-1`} placeholder="Layout name (e.g. Left Door)" />
                  <input type="text" value={layout.value} onChange={e => updateLayout(i, 'value', e.target.value)} className={`${ic} flex-1`} placeholder="Value key (e.g. left-door)" />
                  <input type="text" value={layout.thumbnail || ''} onChange={e => updateLayout(i, 'thumbnail', e.target.value)} className={`${ic} flex-1`} placeholder="Thumbnail URL (optional)" />
                  <button type="button" onClick={() => removeLayout(i)} className="shrink-0 size-9 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors cursor-pointer"><Trash2 size={14} /></button>
                </div>
              ))}
              <button type="button" onClick={addLayout} className="inline-flex items-center gap-2 text-sm font-medium text-amber-700 hover:text-amber-900 transition-colors cursor-pointer">
                <Plus size={16} /> Add Layout
              </button>
            </div>
          </div>

          {/* ── Astra: HTML Feature Sections ── */}
          <div>
            <h3 className="text-sm font-bold text-slate-700 mb-4 pb-2 border-b border-amber-200">Astra — Rich Feature HTML (optional)</h3>
            <div className="space-y-4">
              <div>
                <label className={lc}>Standard Features HTML</label>
                <p className="text-xs text-slate-400 mb-1.5">Panels, Doors section — paste raw HTML from Astra spec sheet.</p>
                <textarea rows={4} value={standardFeaturesHtml} onChange={e => setStandardFeaturesHtml(e.target.value)} className={tac} placeholder="<ul><li>Feature 1</li>...</ul>" />
              </div>
              <div>
                <label className={lc}>Refrigeration Options HTML</label>
                <p className="text-xs text-slate-400 mb-1.5">Top-Mount / Remote refrigeration options section.</p>
                <textarea rows={4} value={refrigerationOptionsHtml} onChange={e => setRefrigerationOptionsHtml(e.target.value)} className={tac} placeholder="<ul><li>Option 1</li>...</ul>" />
              </div>
              <div>
                <label className={lc}>Additional Options HTML</label>
                <p className="text-xs text-slate-400 mb-1.5">Extra add-ons gallery section.</p>
                <textarea rows={4} value={additionalOptionsHtml} onChange={e => setAdditionalOptionsHtml(e.target.value)} className={tac} placeholder="<ul><li>Option 1</li>...</ul>" />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Generic Features (non-walk-in, non-refrig, non-Astra) */}
      {!isWalkInCooler && !isRefrigEquip && (
        <div>
          <h3 className="text-sm font-bold text-slate-700 mb-4 pb-2 border-b border-slate-100">Features</h3>
          <div className="space-y-4">
            <div><label className={lc}>Panels (one per line)</label><textarea rows={3} value={features.panels?.join('\n') || ''} onChange={e => updateFeaturesList('panels', e.target.value)} className={tac} /></div>
            <div><label className={lc}>Doors (one per line)</label><textarea rows={3} value={features.doors?.join('\n') || ''} onChange={e => updateFeaturesList('doors', e.target.value)} className={tac} /></div>
            <div><label className={lc}>Top Mount (one per line)</label><textarea rows={3} value={features.topMount?.join('\n') || ''} onChange={e => updateFeaturesList('topMount', e.target.value)} className={tac} /></div>
            <div><label className={lc}>Remote (one per line)</label><textarea rows={3} value={features.remote?.join('\n') || ''} onChange={e => updateFeaturesList('remote', e.target.value)} className={tac} /></div>
          </div>
        </div>
      )}

      {/* ===== Actions ===== */}
      <div className="pt-4 flex flex-col-reverse sm:flex-row justify-end gap-3 border-t border-slate-100">
        <button type="button" onClick={() => window.history.back()} className="px-5 py-2.5 rounded-lg font-medium text-sm text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors text-center">
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting} className="flex items-center justify-center cursor-pointer gap-2 bg-[#004a99] hover:bg-[#003d80] text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-sm hover:shadow-md hover:shadow-[#004a99]/20 active:scale-[0.98]">
          {isSubmitting ? <><Loader2 size={16} className="animate-spin" /><span>Saving...</span></> : <span>Save Product</span>}
        </button>
      </div>
    </form>
  );
}
