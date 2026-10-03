import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus, Image as ImageIcon, ChevronLeft, ChevronRight, Zap, Wind, Package2 } from "lucide-react";
import ProductActions from "../ProductActions";
import { Suspense } from "react";
import SearchBox from "./SearchBox";

export const dynamic = 'force-dynamic';

const categoryBadge: Record<string, { label: string; color: string }> = {
  'condensing-units': { label: 'Condensing', color: 'bg-blue-100 text-blue-700' },
  'evaporation-units': { label: 'Evaporation', color: 'bg-green-100 text-green-700' },
  'combo-units-package-units': { label: 'Combo / Package', color: 'bg-purple-100 text-purple-700' },
  'refrigeration-equipment': { label: 'General', color: 'bg-slate-100 text-slate-600' },
};

function getCategoryBadge(slug?: string | null) {
  if (!slug) return { label: 'Uncategorized', color: 'bg-slate-100 text-slate-500' };
  return categoryBadge[slug] ?? { label: slug, color: 'bg-slate-100 text-slate-600' };
}

export default async function RefrigerationEquipmentProductsPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string; sub?: string; q?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params?.page) || 1;
  const sub = params?.sub || 'all';
  const q = params?.q?.trim() || '';
  const limit = 10;
  const skip = (page - 1) * limit;

  // ── Category IDs ──────────────────────────────────────────────────────────
  const rootSlugs = ['refrigeration-equipment', 'evaporation-units', 'condensing-units', 'combo-units-package-units'];
  const rootCategories = await prisma.category.findMany({
    where: { slug: { in: rootSlugs } },
    include: { subcategories: { include: { subcategories: true } } },
  });

  const slugToId: Record<string, string> = {};
  for (const cat of rootCategories) {
    slugToId[cat.slug] = cat.id;
    for (const s of cat.subcategories) {
      slugToId[s.slug] = s.id;
      for (const ss of s.subcategories) slugToId[ss.slug] = ss.id;
    }
  }

  const allIds = Object.values(slugToId);
  const condensingIds = rootCategories.filter(c => c.slug === 'condensing-units')
    .flatMap(c => [c.id, ...c.subcategories.flatMap(s => [s.id, ...s.subcategories.map(ss => ss.id)])]);
  const evaporationIds = rootCategories.filter(c => c.slug === 'evaporation-units')
    .flatMap(c => [c.id, ...c.subcategories.flatMap(s => [s.id, ...s.subcategories.map(ss => ss.id)])]);
  const comboIds = rootCategories.filter(c => c.slug === 'combo-units-package-units')
    .flatMap(c => [c.id, ...c.subcategories.flatMap(s => [s.id, ...s.subcategories.map(ss => ss.id)])]);

  const activeIds =
    sub === 'condensing' ? condensingIds :
      sub === 'evaporation' ? evaporationIds :
        sub === 'combo' ? comboIds :
          allIds;

  // ── Build where clause — with optional search ─────────────────────────────
  const searchFilter = q
    ? {
      OR: [
        { title: { contains: q, mode: 'insensitive' as const } },
        { sku: { contains: q, mode: 'insensitive' as const } },
      ],
    }
    : {};

  const where = { categoryId: { in: activeIds }, ...searchFilter };

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      include: { category: true },
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip,
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  // ── Tab counts (unaffected by search) ────────────────────────────────────
  const [allCount, condensingCount, evaporationCount, comboCount] = await Promise.all([
    prisma.product.count({ where: { categoryId: { in: allIds } } }),
    prisma.product.count({ where: { categoryId: { in: condensingIds } } }),
    prisma.product.count({ where: { categoryId: { in: evaporationIds } } }),
    prisma.product.count({ where: { categoryId: { in: comboIds } } }),
  ]);

  const tabs = [
    { key: 'all', label: 'All', count: allCount, icon: null },
    { key: 'condensing', label: 'Condensing Units', count: condensingCount, icon: Zap },
    { key: 'evaporation', label: 'Evaporation Units', count: evaporationCount, icon: Wind },
    { key: 'combo', label: 'Combo / Package Units', count: comboCount, icon: Package2 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Refrigeration Equipment</h1>
          <p className="text-sm text-slate-500 mt-1">Manage Condensing Units, Evaporation Units and Combo / Package Units.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/admin/products/new?category=condensing-units"
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-lg text-sm font-medium transition-colors">
            <Zap size={15} /> Condensing
          </Link>
          <Link href="/admin/products/new?category=evaporation-units"
            className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-3.5 py-2 rounded-lg text-sm font-medium transition-colors">
            <Wind size={15} /> Evaporation
          </Link>
          <Link href="/admin/products/new?category=combo-units-package-units"
            className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white px-3.5 py-2 rounded-lg text-sm font-medium transition-colors">
            <Package2 size={15} /> Combo / Package
          </Link>
        </div>
      </div>

      {/* ── Filter tabs + Search ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 w-fit flex-wrap">
          {tabs.map((t) => (
            <Link key={t.key} href={`?sub=${t.key}&page=1${q ? `&q=${encodeURIComponent(q)}` : ''}`}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${sub === t.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}>
              {t.icon && <t.icon size={14} />}
              {t.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${sub === t.key ? 'bg-slate-100 text-slate-600' : 'bg-slate-200 text-slate-500'
                }`}>{t.count}</span>
            </Link>
          ))}
        </div>

        {/* Search box — needs Suspense because it uses useSearchParams */}
        <Suspense fallback={
          <div className="w-full sm:w-72 h-9 bg-slate-100 rounded-lg animate-pulse" />
        }>
          <SearchBox />
        </Suspense>
      </div>

      {/* Search result info */}
      {q && (
        <p className="text-sm text-slate-500">
          Showing results for <span className="font-semibold text-slate-800">&quot;{q}&quot;</span>
          {' '}— <span className="font-medium">{totalCount}</span> product{totalCount !== 1 ? 's' : ''} found
        </p>
      )}

      {/* ── Table ───────────────────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 whitespace-nowrap">
              <tr>
                <th className="px-6 py-4 w-full">Product</th>
                <th className="px-6 py-4">Sub-Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="size-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                        <ImageIcon className="size-8 text-slate-300" />
                      </div>
                      <p className="text-base font-medium text-slate-600">
                        {q ? `No products matching "${q}"` : 'No products found'}
                      </p>
                      <p className="text-sm text-slate-400 mt-1">
                        {q ? 'Try a different search term.' : 'Use the buttons above to add products.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const badge = getCategoryBadge(product.category?.slug);
                  return (
                    <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 max-w-[200px] sm:max-w-[300px] lg:max-w-[500px]">
                        <div className="flex items-center gap-4">
                          <div className="size-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                            {product.images?.[0] ? (
                              <img src={product.images[0]} alt={product.title} className="size-full object-cover" />
                            ) : (
                              <ImageIcon className="size-6 text-slate-400" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-slate-900 line-clamp-2 whitespace-normal break-words" title={product.title}>
                              {/* Highlight matched query */}
                              {q ? <HighlightText text={product.title} query={q} /> : product.title}
                            </p>
                            {product.sku && (
                              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                                SKU: {q ? <HighlightText text={product.sku} query={q} /> : product.sku}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap align-top">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-medium whitespace-nowrap align-top">
                        {product.price ? `$${product.price}` : '-'}
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap align-top">
                        <ProductActions productId={product.id} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination — preserve q param */}
        {totalPages > 1 && (
          <div className="border-t border-slate-200 px-6 py-4 flex items-center justify-between bg-slate-50">
            <div className="text-sm text-slate-500">
              Showing <span className="font-medium text-slate-900">{skip + 1}</span> to{' '}
              <span className="font-medium text-slate-900">{Math.min(skip + limit, totalCount)}</span>{' '}
              of <span className="font-medium text-slate-900">{totalCount}</span> results
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={page > 1 ? `?sub=${sub}&page=${page - 1}${q ? `&q=${encodeURIComponent(q)}` : ''}` : '#'}
                className={`p-2 rounded-lg border ${page > 1 ? 'border-slate-300 text-slate-700 hover:bg-slate-100' : 'border-slate-200 text-slate-400 cursor-not-allowed bg-slate-50'}`}
                aria-disabled={page <= 1}
              >
                <ChevronLeft size={18} />
              </Link>
              <div className="text-sm font-medium text-slate-700 px-2">Page {page} of {totalPages}</div>
              <Link
                href={page < totalPages ? `?sub=${sub}&page=${page + 1}${q ? `&q=${encodeURIComponent(q)}` : ''}` : '#'}
                className={`p-2 rounded-lg border ${page < totalPages ? 'border-slate-300 text-slate-700 hover:bg-slate-100' : 'border-slate-200 text-slate-400 cursor-not-allowed bg-slate-50'}`}
                aria-disabled={page >= totalPages}
              >
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Small helper to highlight matched text ────────────────────────────────────
function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-yellow-100 text-yellow-800 rounded px-0.5">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}
