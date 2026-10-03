'use client';

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { updateProduct } from "./actions";
import toast from "react-hot-toast";
import {
  AlertCircle, Loader2, ImagePlus, X, Plus, FileText,
  Trash2, Zap, Wind, Package2, Settings, RefreshCw, ShoppingBag, LayoutGrid
} from "lucide-react";
import { Brand, Category, Product } from "@prisma/client";

type CategoryWithSubs = Category & {
  subcategories: (Category & { subcategories: Category[] })[];
};
type ProductWithCategory = Product & { category: Category | null; brandRef?: Brand | null };
type ProductOption = { label: string; name: string; options: { label: string; price?: string }[] };
type Faq = { question: string; answer: string };
type Features = { panels?: string[]; doors?: string[]; topMount?: string[]; remote?: string[] };
type RefrigFeatures = {
  temperatureType?: string; hp?: string; voltage?: string;
  btu?: string; evaporatorType?: string; defrostType?: string; location?: string;
};
type ConfigPropOption = { label: string; priceCents?: number };
type RefrigChoice = { label: string; value: string; priceCents?: number };
type Addon = { name: string; priceText: string; maxQty: number };
type Layout = { name: string; value: string; thumbnail?: string };

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

// Parse existing Astra productOptions object into state
function parseAstraProductOptions(raw: any) {
  const cp = raw?.configurable_properties || {};
  const configGroups = Object.entries(cp).map(([groupName, opts]: [string, any]) => ({
    groupName,
    options: Array.isArray(opts) ? opts.map((o: any) => ({
      label: o.label || o.value || '',
      priceCents: o.price_cents || undefined,
    })) : [],
  }));
  const refrigChoices: RefrigChoice[] = (raw?.refrigeration_choice || []).map((r: any) => ({
    label: r.label || '',
    value: r.value || r.label || '',
    priceCents: r.price_cents || undefined,
  }));
  const addons: Addon[] = (raw?.addons || []).map((a: any) => ({
    name: a.name || '',
    priceText: a.price_text || '',
    maxQty: a.max_quantity || 5,
  }));
  return { configGroups, refrigChoices, addons };
}

function parseLayouts(raw: any): Layout[] {
  if (!raw || !Array.isArray(raw)) return [];
  return raw.map((l: any) => ({
    name: l.name || '',
    value: l.value || '',
    thumbnail: l.thumbnail || l.preview_image || '',
  }));
}

export default function EditProductForm({
  product,
  allCategories,
  allBrands,
}: {
  product: ProductWithCategory;
  allCategories: CategoryWithSubs[];
  allBrands: Brand[];
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>(product.images || []);
  const [newImages, setNewImages] = useState<{ file: File; preview: string }[]>([]);

  // ── Category cascade ───────────────────────────────────────────────────────
  const initialPath = useMemo(
    () => findCategoryPath(allCategories, product.categoryId),
    [allCategories, product.categoryId],
  );
  const [selectedLevel1, setSelectedLevel1] = useState(initialPath.l1);
  const [selectedLevel2, setSelectedLevel2] = useState(initialPath.l2);
  const [selectedLevel3, setSelectedLevel3] = useState(initialPath.l3);

  // ── JSON field states ──────────────────────────────────────────────────────
  // specs: normalize — DB may store as array [{label,value}] OR plain object {Key:Value}
  function normalizeSpecs(raw: any): { label: string; value: string }[] {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw.map((s: any) => ({ label: s.label || '', value: s.value || '' }));
    if (typeof raw === 'object') return Object.entries(raw).map(([k, v]) => ({ label: k, value: String(v ?? '') }));
    return [];
  }
  const [specs, setSpecs] = useState(() => normalizeSpecs(product.specs));

  // documents: normalize — may be array [{name,url}] OR Astra object {resources:[],certifications:[]}
  function normalizeDocs(raw: any): { name: string; url: string }[] {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw.map((d: any) => ({ name: d.name || '', url: d.url || d.href || '' }));
    if (typeof raw === 'object') {
      const result: { name: string; url: string }[] = [];
      for (const group of ['resources', 'certifications']) {
        const items = (raw as any)[group];
        if (Array.isArray(items)) {
          items.forEach((item: any) => {
            const url = item.url || item.href || item.src || '';
            if (url) result.push({ name: item.title || item.name || group, url });
          });
        }
      }
      return result;
    }
    return [];
  }
  const [existingDocs, setExistingDocs] = useState(() => normalizeDocs(product.documents));
  const [newDocEntries, setNewDocEntries] = useState<{ name: string; file: File | null }[]>([]);

  const [productOptions, setProductOptions] = useState<ProductOption[]>(
    Array.isArray(product.productOptions) ? (product.productOptions as ProductOption[]) : [],
  );
  const [faqs, setFaqs] = useState<Faq[]>(
    Array.isArray(product.faqs) ? (product.faqs as Faq[]) : [],
  );

  const initialFeatures: any = (product.features as any) || {};
  const [features, setFeatures] = useState<Features>(initialFeatures);

  // ── Walk-in ────────────────────────────────────────────────────────────────
  const [walkInType, setWalkInType] = useState<string>(initialFeatures.walkInType || '');
  const parsedSize = initialFeatures.size?.match(/(\d+)'\s*x\s*(\d+)'/);
  const [sizeW, setSizeW] = useState(parsedSize?.[1] || '');
  const [sizeL, setSizeL] = useState(parsedSize?.[2] || '');

  // ── Brand ──────────────────────────────────────────────────────────────────
  const [selectedBrandId, setSelectedBrandId] = useState((product as any).brandId || '');

  // ── Refrigeration quick-fields ─────────────────────────────────────────────
  const [refrigFeatures, setRefrigFeatures] = useState<RefrigFeatures>({
    temperatureType: initialFeatures.temperatureType || '',
    hp: initialFeatures.hp || '',
    voltage: initialFeatures.voltage || '',
    btu: initialFeatures.btu || '',
    evaporatorType: initialFeatures.evaporatorType || '',
    defrostType: initialFeatures.defrostType || '',
    location: initialFeatures.location || '',
  });

  // ── Detect if existing productOptions is Astra structure ──────────────────
  const existingPO = product.productOptions as any;
  const existingPOIsAstra = existingPO &&
    !Array.isArray(existingPO) &&
    (existingPO.configurable_properties !== undefined ||
      existingPO.refrigeration_choice !== undefined ||
      existingPO.addons !== undefined);

  const parsedAstra = useMemo(
    () => existingPOIsAstra ? parseAstraProductOptions(existingPO) : null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // ── Astra state — init from existing data if available ────────────────────
  const [configGroups, setConfigGroups] = useState<{ groupName: string; options: ConfigPropOption[] }[]>(
    parsedAstra?.configGroups || [],
  );
  const [refrigChoices, setRefrigChoices] = useState<RefrigChoice[]>(parsedAstra?.refrigChoices || []);
  const [addons, setAddons] = useState<Addon[]>(parsedAstra?.addons || []);
  const [layouts, setLayouts] = useState<Layout[]>(
    parseLayouts((product as any).layouts),
  );
  const [standardFeaturesHtml, setStandardFeaturesHtml] = useState(initialFeatures.standard_features_html || '');
  const [refrigerationOptionsHtml, setRefrigerationOptionsHtml] = useState(initialFeatures.refrigeration_options_html || '');
  const [additionalOptionsHtml, setAdditionalOptionsHtml] = useState(initialFeatures.additional_options_html || '');

  // ── Category flags ─────────────────────────────────────────────────────────
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

  // isWalkInCooler: true if selected top-level is walk-in-cooler-freezer OR the product's
  // own category is any walk-in slug (Astra products are stored under walk-in-* directly)
  const walkInSlugs = [
    'walk-in-cooler-freezer', 'walk-in-cooler-no-floor',
    'walk-in-cooler-with-floor', 'walk-in-freezer-with-floor', 'walk-in-combo-cooler-freezer',
  ];
  const isWalkInCooler = !!(
    (walkInCoolerCat && selectedLevel1 === walkInCoolerCat.id) ||
    walkInSlugs.includes(activeCatSlug) ||
    walkInSlugs.includes(getSlug(selectedLevel1))
  );

  const isCondensing = activeCatSlug === 'condensing-units';
  const isEvaporation = activeCatSlug === 'evaporation-units';
  const isCombo = activeCatSlug === 'combo-units-package-units';
  const isRefrigEquip = isCondensing || isEvaporation || isCombo;

  const selectedBrand = allBrands.find(b => b.id === selectedBrandId);
  const isAstraBrand =
    selectedBrand?.slug === 'astra' ||
    selectedBrand?.name?.toLowerCase() === 'astra' ||
    product.brand?.toLowerCase() === 'astra' ||
    (product as any).brandRef?.slug === 'astra';

  // Show Astra sections whenever brand is Astra — not gated on isWalkInCooler
  // because Astra category slugs (walk-in-cooler-no-floor etc.) are top-level
  const showAstraSections = isAstraBrand;

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set('categoryId', finalCategoryId);
    formData.set('brandId', selectedBrandId);
    formData.set('specs', JSON.stringify(specs));
    formData.set('existingDocuments', JSON.stringify(existingDocs));
    formData.set('existingImages', JSON.stringify(existingImages));
    formData.set('productOptions', JSON.stringify(
      showAstraSections ? buildAstraProductOptions() : productOptions
    ));
    formData.set('faqs', JSON.stringify(faqs));

    // Features — preserve ALL existing keys first, then overlay walk-in + refrig fields
    const currentFeatures: any = { ...initialFeatures };
    if (isWalkInCooler) {
      currentFeatures.walkInType = walkInType;
      if (sizeW && sizeL) currentFeatures.size = `${sizeW}' x ${sizeL}'`;
    }
    if (isRefrigEquip) Object.assign(currentFeatures, refrigFeatures);
    if (showAstraSections) {
      if (standardFeaturesHtml) currentFeatures.standard_features_html = standardFeaturesHtml;
      if (refrigerationOptionsHtml) currentFeatures.refrigeration_options_html = refrigerationOptionsHtml;
      if (additionalOptionsHtml) currentFeatures.additional_options_html = additionalOptionsHtml;
    }
    formData.set('features', JSON.stringify(currentFeatures));

    // Layouts
    if (showAstraSections) {
      formData.set('layouts', JSON.stringify(layouts));
    }

    formData.delete('images');
    newImages.forEach(img => formData.append('images', img.file));
    formData.delete('documents');
    formData.delete('documentNames');
    for (const entry of newDocEntries) {
      if (entry.file) {
        formData.append('documents', entry.file);
        formData.append('documentNames', entry.name || entry.file.name);
      }
    }

    const result = await updateProduct(product.id, formData);
    if (result?.error) { setError(result.error); setIsSubmitting(false); return; }
    if ((result as any)?.success) {
      toast.success('Product updated successfully!', { duration: 3000 });
      // Go back to brand page if this is an Astra product
      const brandSlug = selectedBrand?.slug || (isAstraBrand ? 'astra' : null);
      const dest = brandSlug
        ? `/admin/products/walk-in-cooler-freezer/brand/${brandSlug}`
        : '/admin/products';
      router.push(dest);
    }
  };

  const buildAstraProductOptions = () => {
    const configurable_properties: Record<string, any[]> = {};
    for (const grp of configGroups) {
      if (grp.groupName.trim()) {
        configurable_properties[grp.groupName] = grp.options.map(o => ({
          label: o.label, value: o.label,
          ...(o.priceCents ? { price_cents: o.priceCents } : {}),
        }));
      }
    }
    return {
      configurable_properties,
      refrigeration_choice: refrigChoices.map(r => ({
        label: r.label, value: r.value || r.label,
        ...(r.priceCents ? { price_cents: r.priceCents } : {}),
      })),
      addons: addons.map(a => ({ name: a.name, price_text: a.priceText, max_quantity: a.maxQty })),
    };
  };

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length) setNewImages(prev => [...prev, ...files.map(f => ({ file: f, preview: URL.createObjectURL(f) }))]);
    e.target.value = '';
  };
  const removeExistingImage = (i: number) => setExistingImages(prev => prev.filter((_, idx) => idx !== i));
  const removeNewImage = (i: number) => setNewImages(prev => {
    const u = [...prev]; URL.revokeObjectURL(u[i].preview); u.splice(i, 1); return u;
  });

  const addSpec = () => setSpecs([...specs, { label: '', value: '' }]);
  const removeSpec = (i: number) => setSpecs(specs.filter((_, idx) => idx !== i));
  const updateSpec = (i: number, f: 'label' | 'value', v: string) => { const u = [...specs]; u[i][f] = v; setSpecs(u); };

  const addNewDocEntry = () => setNewDocEntries([...newDocEntries, { name: '', file: null }]);
  const removeNewDocEntry = (i: number) => setNewDocEntries(newDocEntries.filter((_, idx) => idx !== i));
  const removeExistingDoc = (i: number) => setExistingDocs(existingDocs.filter((_, idx) => idx !== i));

  const addProductOption = () => setProductOptions([...productOptions, { label: '', name: '', options: [{ label: '', price: '' }] }]);
  const removeProductOption = (i: number) => setProductOptions(productOptions.filter((_, idx) => idx !== i));
  const updateProductOption = (i: number, f: 'label' | 'name', v: string) => { const u = [...productOptions]; u[i][f] = v; setProductOptions(u); };
  const addOptionValue = (oi: number) => { const u = [...productOptions]; u[oi].options.push({ label: '', price: '' }); setProductOptions(u); };
  const removeOptionValue = (oi: number, vi: number) => { const u = [...productOptions]; u[oi].options = u[oi].options.filter((_, i) => i !== vi); setProductOptions(u); };
  const updateOptionValue = (oi: number, vi: number, f: 'label' | 'price', v: string) => { const u = [...productOptions]; u[oi].options[vi][f] = v; setProductOptions(u); };

  const addFaq = () => setFaqs([...faqs, { question: '', answer: '' }]);
  const removeFaq = (i: number) => setFaqs(faqs.filter((_, idx) => idx !== i));
  const updateFaq = (i: number, f: 'question' | 'answer', v: string) => { const u = [...faqs]; u[i][f] = v; setFaqs(u); };

  const updateFeaturesList = (section: keyof Features, value: string) => {
    const list = value.split('\n').map(s => s.trim()).filter(Boolean);
    setFeatures(prev => ({ ...prev, [section]: list.length > 0 ? list : undefined }));
  };
  const setRF = (key: keyof RefrigFeatures, val: string) =>
    setRefrigFeatures(prev => ({ ...prev, [key]: val }));

  // Astra handlers
  const addConfigGroup = () => setConfigGroups([...configGroups, { groupName: '', options: [{ label: '' }] }]);
  const removeConfigGroup = (gi: number) => setConfigGroups(configGroups.filter((_, i) => i !== gi));
  const updateConfigGroupName = (gi: number, v: string) => { const u = [...configGroups]; u[gi].groupName = v; setConfigGroups(u); };
  const addConfigOption = (gi: number) => { const u = [...configGroups]; u[gi].options.push({ label: '' }); setConfigGroups(u); };
  const removeConfigOption = (gi: number, oi: number) => { const u = [...configGroups]; u[gi].options = u[gi].options.filter((_, i) => i !== oi); setConfigGroups(u); };
  const updateConfigOption = (gi: number, oi: number, f: keyof ConfigPropOption, v: any) => { const u = [...configGroups]; (u[gi].options[oi] as any)[f] = v; setConfigGroups(u); };

  const addRefrigChoice = () => setRefrigChoices([...refrigChoices, { label: '', value: '' }]);
  const removeRefrigChoice = (i: number) => setRefrigChoices(refrigChoices.filter((_, idx) => idx !== i));
  const updateRefrigChoice = (i: number, f: keyof RefrigChoice, v: any) => { const u = [...refrigChoices]; (u[i] as any)[f] = v; setRefrigChoices(u); };

  const addAddon = () => setAddons([...addons, { name: '', priceText: '', maxQty: 5 }]);
  const removeAddon = (i: number) => setAddons(addons.filter((_, idx) => idx !== i));
  const updateAddon = (i: number, f: keyof Addon, v: any) => { const u = [...addons]; (u[i] as any)[f] = v; setAddons(u); };

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
      {refrigBanner && (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border ${refrigBanner.color} text-sm font-medium`}>
          <refrigBanner.icon size={16} className="shrink-0" />
          Editing: <span className="font-bold ml-1">{refrigBanner.label}</span>
        </div>
      )}
      {showAstraSections && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl border bg-amber-50 border-amber-200 text-amber-800 text-sm font-medium">
          <Settings size={16} className="shrink-0" />
          Astra brand — Astra-specific sections are enabled below
        </div>
      )}

      {/* ===== SECTION 1: Images ===== */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 mb-4 pb-2 border-b border-slate-100">Product Images</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {existingImages.map((imgUrl, idx) => (
            <div key={`ex-${idx}`} className="relative w-full aspect-square rounded-xl border border-slate-200 overflow-hidden group bg-white shadow-sm">
              <img src={imgUrl} alt="" className="w-full h-full object-cover" />
              <button type="button" onClick={() => removeExistingImage(idx)} className="absolute top-2 right-2 size-7 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer opacity-100 md:opacity-0 md:group-hover:opacity-100">
                <X size={14} />
              </button>
            </div>
          ))}
          {newImages.map((img, idx) => (
            <div key={`new-${idx}`} className="relative w-full aspect-square rounded-xl border border-slate-200 overflow-hidden group bg-white shadow-sm">
              <img src={img.preview} alt="" className="w-full h-full object-cover" />
              <button type="button" onClick={() => removeNewImage(idx)} className="absolute top-2 right-2 size-7 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer opacity-100 md:opacity-0 md:group-hover:opacity-100">
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
                {(existingImages.length + newImages.length) > 0 ? "Add more images" : "Click to upload"}
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
            <div><label htmlFor="title" className={lc}>Title *</label>
              <input type="text" id="title" name="title" required defaultValue={product.title} className={ic} /></div>
            {!isWalkInCooler && (
              <div><label htmlFor="slug" className={lc}>Slug</label>
                <input type="text" id="slug" name="slug" defaultValue={product.slug} className={ic} /></div>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div><label htmlFor="brand" className={lc}>Brand (Text)</label>
              <input type="text" id="brand" name="brand" defaultValue={product.brand || ''} className={ic} placeholder="e.g. Astra" /></div>
            <div>
              <label htmlFor="brandId" className={lc}>Brand</label>
              <select id="brandId" value={selectedBrandId} onChange={e => setSelectedBrandId(e.target.value)}
                className={`${sc} ${selectedBrandId ? 'border-[#004a99]/40 bg-[#004a99]/[0.03]' : ''}`}>
                <option value="">Select Brand...</option>
                {allBrands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
              <input type="hidden" name="brandId" value={selectedBrandId} />
            </div>
            {/* SKU always visible */}
            <div><label htmlFor="sku" className={lc}>SKU</label>
              <input type="text" id="sku" name="sku" defaultValue={product.sku || ''} className={ic} placeholder="e.g. DCWF8X10" /></div>
            <div><label htmlFor="price" className={lc}>Price ($)</label>
              <input type="text" id="price" name="price" defaultValue={product.price || ''} className={ic} /></div>
          </div>

          {/* Category selector — non-walk-in */}
          {!isWalkInCooler && (
            <div>
              <label className={`${lc} mb-2`}>Category</label>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 sm:p-4 space-y-3">
                <div className="flex items-start sm:items-center gap-3">
                  <span className="shrink-0 size-6 rounded-full bg-[#004a99] text-white text-xs font-bold flex items-center justify-center mt-1 sm:mt-0">1</span>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-500 mb-1">Main Category</p>
                    <select value={selectedLevel1} onChange={e => { setSelectedLevel1(e.target.value); setSelectedLevel2(''); setSelectedLevel3(''); }}
                      className={`${sc} ${selectedLevel1 ? 'border-[#004a99]/40 bg-[#004a99]/[0.03]' : ''}`}>
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
                      <select value={selectedLevel2} onChange={e => { setSelectedLevel2(e.target.value); setSelectedLevel3(''); }}
                        className={`${sc} ${selectedLevel2 ? 'border-[#0070cc]/40 bg-[#0070cc]/[0.03]' : ''}`}>
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
                      <select value={selectedLevel3} onChange={e => setSelectedLevel3(e.target.value)}
                        className={`${sc} ${selectedLevel3 ? 'border-[#0891b2]/40 bg-[#0891b2]/[0.03]' : ''}`}>
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
                      <select value={selectedLevel2} onChange={e => setSelectedLevel2(e.target.value)}
                        className={`${sc} ${selectedLevel2 ? 'border-[#0070cc]/40 bg-[#0070cc]/[0.03]' : ''}`}>
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

          {!isWalkInCooler && !isRefrigEquip && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label htmlFor="badge" className={lc}>Badge</label><input type="text" id="badge" name="badge" defaultValue={product.badge || ''} className={ic} /></div>
                <div><label htmlFor="condition" className={lc}>Condition</label><input type="text" id="condition" name="condition" defaultValue={product.condition || ''} className={ic} /></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label htmlFor="type" className={lc}>Type</label><input type="text" id="type" name="type" defaultValue={product.type || ''} className={ic} /></div>
              </div>
            </>
          )}

          {isWalkInCooler && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="type" className={lc}>Refrigeration Type</label>
                <select id="type" name="type" defaultValue={product.type || ''} className={sc}>
                  <option value="">Select Refrigeration Type...</option>
                  <option value="No Refrigeration">No Refrigeration</option>
                  <option value="Top-Mount Refrigeration">Top-Mount Refrigeration</option>
                  <option value="Remote Refrigeration">Remote Refrigeration</option>
                </select>
              </div>
            </div>
          )}

          {isRefrigEquip && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                {isCondensing ? '⚡ Condensing Unit Details' : isEvaporation ? '💨 Evaporation Unit Details' : '📦 Combo / Package Unit Details'}
              </p>
              {isCondensing && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div><label className={lc}>Horsepower (HP)</label><input type="text" value={refrigFeatures.hp || ''} onChange={e => setRF('hp', e.target.value)} className={ic} placeholder="e.g. 4 HP" /></div>
                  <div><label className={lc}>Temperature Type</label>
                    <select value={refrigFeatures.temperatureType || ''} onChange={e => setRF('temperatureType', e.target.value)} className={sc}>
                      <option value="">Select...</option><option>Medium Temperature</option><option>Low Temperature</option><option>Extended Medium Temperature</option>
                    </select></div>
                  <div><label className={lc}>Voltage</label>
                    <select value={refrigFeatures.voltage || ''} onChange={e => setRF('voltage', e.target.value)} className={sc}>
                      <option value="">Select...</option>
                      <option value="208-230V/1Ph/60Hz">208-230V / 1Ph / 60Hz</option>
                      <option value="208-230V/3Ph/60Hz">208-230V / 3Ph / 60Hz</option>
                    </select></div>
                  <input type="hidden" name="type" value="Condensing Unit" />
                  <input type="hidden" name="condition" value="New" />
                </div>
              )}
              {isEvaporation && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div><label className={lc}>BTU Capacity</label><input type="text" value={refrigFeatures.btu || ''} onChange={e => setRF('btu', e.target.value)} className={ic} placeholder="e.g. 13,700 BTU" /></div>
                  <div><label className={lc}>Evaporator Profile</label>
                    <select value={refrigFeatures.evaporatorType || ''} onChange={e => setRF('evaporatorType', e.target.value)} className={sc}>
                      <option value="">Select...</option><option>Low Profile</option><option>Medium Profile</option><option>Thin Profile</option><option>Center Mount</option>
                    </select></div>
                  <div><label className={lc}>Defrost Type</label>
                    <select value={refrigFeatures.defrostType || ''} onChange={e => setRF('defrostType', e.target.value)} className={sc}>
                      <option value="">Select...</option><option>Air Defrost</option><option>Electric Defrost</option><option>Hot Gas Defrost</option>
                    </select></div>
                  <div><label className={lc}>Voltage</label>
                    <select value={refrigFeatures.voltage || ''} onChange={e => setRF('voltage', e.target.value)} className={sc}>
                      <option value="">Select...</option>
                      <option value="115V/1Ph/60Hz">115V / 1Ph / 60Hz</option>
                      <option value="208-230V/1Ph/60Hz">208-230V / 1Ph / 60Hz</option>
                    </select></div>
                  <input type="hidden" name="type" value="Evaporator Coil" />
                  <input type="hidden" name="condition" value="New" />
                </div>
              )}
              {isCombo && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div><label className={lc}>BTU Capacity</label><input type="text" value={refrigFeatures.btu || ''} onChange={e => setRF('btu', e.target.value)} className={ic} placeholder="e.g. 2,200 BTU" /></div>
                  <div><label className={lc}>Temperature Type</label>
                    <select value={refrigFeatures.temperatureType || ''} onChange={e => setRF('temperatureType', e.target.value)} className={sc}>
                      <option value="">Select...</option><option>Medium Temperature</option><option>Low Temperature</option>
                    </select></div>
                  <div><label className={lc}>Location</label>
                    <select value={refrigFeatures.location || ''} onChange={e => setRF('location', e.target.value)} className={sc}>
                      <option value="">Select...</option><option>Indoor</option><option>Outdoor</option>
                    </select></div>
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
          <div><label htmlFor="keyFeatures" className={lc}>Key Features (short summary)</label>
            <input type="text" id="keyFeatures" name="keyFeatures" defaultValue={product.keyFeatures || ''} className={ic} /></div>
          <div><label htmlFor="description" className={lc}>Description</label>
            <textarea id="description" name="description" rows={3} defaultValue={product.description || ''} className={tac} /></div>
          <div><label htmlFor="warranty" className={lc}>Warranty (one per line)</label>
            <textarea id="warranty" name="warranty" rows={2} defaultValue={product.warranty.join('\n')} className={tac} /></div>
          <div><label htmlFor="detailedFeatures" className={lc}>Detailed Features (one per line)</label>
            <textarea id="detailedFeatures" name="detailedFeatures" rows={5} defaultValue={product.detailedFeatures.join('\n')} className={tac} /></div>
        </div>
      </div>

      {/* ===== SECTION: Walk-In Details ===== */}
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
              <input type="text" value={spec.label} onChange={e => updateSpec(i, 'label', e.target.value)} className={`${ic} flex-1`} placeholder="Label" />
              <input type="text" value={spec.value} onChange={e => updateSpec(i, 'value', e.target.value)} className={`${ic} flex-1`} placeholder="Value" />
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
          {existingDocs.map((doc, i) => (
            <div key={`ex-${i}`} className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg p-3">
              <FileText size={18} className="text-[#004a99] shrink-0" />
              <div className="flex-1 text-sm font-medium text-slate-700 truncate">{doc.name}</div>
              <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-[#004a99] hover:underline px-2">View</a>
              <button type="button" onClick={() => removeExistingDoc(i)} className="shrink-0 size-9 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors cursor-pointer"><Trash2 size={14} /></button>
            </div>
          ))}
          {newDocEntries.map((entry, i) => (
            <div key={`new-${i}`} className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg p-3">
              <FileText size={18} className="text-slate-400 shrink-0" />
              <input type="text" value={entry.name} onChange={e => { const u = [...newDocEntries]; u[i].name = e.target.value; setNewDocEntries(u); }} className={`${ic} flex-1`} placeholder="Document name" />
              <label className="shrink-0 px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors">
                {entry.file ? entry.file.name.substring(0, 20) + '...' : 'Choose File'}
                <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e => { const f = e.target.files?.[0] || null; const u = [...newDocEntries]; u[i].file = f; if (f && !u[i].name) u[i].name = f.name.replace(/\.[^/.]+$/, ''); setNewDocEntries(u); }} />
              </label>
              <button type="button" onClick={() => removeNewDocEntry(i)} className="shrink-0 size-9 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors cursor-pointer"><Trash2 size={14} /></button>
            </div>
          ))}
          <button type="button" onClick={addNewDocEntry} className="inline-flex items-center gap-2 text-sm font-medium text-[#004a99] hover:text-[#003d80] transition-colors cursor-pointer">
            <Plus size={16} /> Add New Document
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

      {/* ===== Generic Product Options (non-Astra) ===== */}
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
          {/* Configurable Properties */}
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

          {/* Refrigeration Choice */}
          <div>
            <h3 className="text-sm font-bold text-slate-700 mb-1 pb-2 border-b border-amber-200 flex items-center gap-2">
              <RefreshCw size={15} className="text-amber-600" /> Astra — Refrigeration Choice
            </h3>
            <p className="text-xs text-slate-400 mb-4">Options shown in the Refrigeration selector. Price in cents.</p>
            <div className="space-y-3">
              {refrigChoices.map((rc, i) => (
                <div key={i} className="flex items-center gap-3 bg-amber-50/60 border border-amber-200 rounded-lg p-3">
                  <input type="text" value={rc.label} onChange={e => updateRefrigChoice(i, 'label', e.target.value)} className={`${ic} flex-1`} placeholder="Label (e.g. Top Mount - Indoor)" />
                  <input type="text" value={rc.value} onChange={e => updateRefrigChoice(i, 'value', e.target.value)} className={`${ic} flex-1`} placeholder="Value key" />
                  <input type="number" value={rc.priceCents || ''} onChange={e => updateRefrigChoice(i, 'priceCents', e.target.value ? Number(e.target.value) : undefined)} className={`${ic} w-36`} placeholder="Price (cents)" />
                  <button type="button" onClick={() => removeRefrigChoice(i)} className="shrink-0 size-9 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors cursor-pointer"><Trash2 size={14} /></button>
                </div>
              ))}
              <button type="button" onClick={addRefrigChoice} className="inline-flex items-center gap-2 text-sm font-medium text-amber-700 hover:text-amber-900 transition-colors cursor-pointer">
                <Plus size={16} /> Add Refrigeration Option
              </button>
            </div>
          </div>

          {/* Add-Ons */}
          <div>
            <h3 className="text-sm font-bold text-slate-700 mb-1 pb-2 border-b border-amber-200 flex items-center gap-2">
              <ShoppingBag size={15} className="text-amber-600" /> Astra — Add-Ons
            </h3>
            <p className="text-xs text-slate-400 mb-4">Purchasable add-ons (e.g. LED Light, Ramp, Door Kick Plate).</p>
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

          {/* Layouts */}
          <div>
            <h3 className="text-sm font-bold text-slate-700 mb-1 pb-2 border-b border-amber-200 flex items-center gap-2">
              <LayoutGrid size={15} className="text-amber-600" /> Astra — Door Layouts
            </h3>
            <p className="text-xs text-slate-400 mb-4">Visual door layout options. Thumbnail is a public image URL.</p>
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

          {/* HTML Feature Sections */}
          <div>
            <h3 className="text-sm font-bold text-slate-700 mb-4 pb-2 border-b border-amber-200">Astra — Rich Feature HTML (optional)</h3>
            <div className="space-y-4">
              <div>
                <label className={lc}>Standard Features HTML</label>
                <p className="text-xs text-slate-400 mb-1.5">Panels, Doors section.</p>
                <textarea rows={4} value={standardFeaturesHtml} onChange={e => setStandardFeaturesHtml(e.target.value)} className={tac} placeholder="<ul><li>Feature 1</li>...</ul>" />
              </div>
              <div>
                <label className={lc}>Refrigeration Options HTML</label>
                <textarea rows={4} value={refrigerationOptionsHtml} onChange={e => setRefrigerationOptionsHtml(e.target.value)} className={tac} placeholder="<ul><li>Option 1</li>...</ul>" />
              </div>
              <div>
                <label className={lc}>Additional Options HTML</label>
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
          {isSubmitting ? <><Loader2 size={16} className="animate-spin" /><span>Saving...</span></> : <span>Update Product</span>}
        </button>
      </div>
    </form>
  );
}
