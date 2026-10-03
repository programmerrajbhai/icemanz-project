import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus, Image as ImageIcon, ChevronLeft, ChevronRight, Tag } from "lucide-react";
import ProductActions from "@/app/admin/products/ProductActions";
import { Suspense } from "react";
import BrandSearchBox from "./SearchBox";

export const dynamic = 'force-dynamic';

export default async function BrandProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ brandSlug: string }>;
  searchParams?: Promise<{ page?: string; q?: string }>;
}) {
  const { brandSlug } = await params;
  const resolvedSearch = await searchParams;
  const page = Number(resolvedSearch?.page) || 1;
  const q = resolvedSearch?.q?.trim() || '';
  const limit = 10;
  const skip = (page - 1) * limit;

  // Find the brand
  const brand = await prisma.brand.findUnique({
    where: { slug: brandSlug },
  });

  if (!brand) notFound();

  // Match by brandId (relation) OR brand text (for products imported before brandId was set)
  const where = {
    AND: [
      {
        OR: [
          { brandId: brand.id },
          { brand: { equals: brand.name, mode: 'insensitive' as const } },
        ],
      },
      ...(q
        ? [{
          OR: [
            { title: { contains: q, mode: 'insensitive' as const } },
            { sku: { contains: q, mode: 'insensitive' as const } },
          ],
        }]
        : []),
    ],
  };

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip,
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <Link
              href="/admin/products/walk-in-cooler-freezer"
              className="hover:text-blue-600 transition-colors"
            >
              Walk-in Cooler &amp; Freezer
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-medium">{brand.name}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Tag size={22} className="text-blue-500" />
            {brand.name}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {totalCount} product{totalCount !== 1 ? 's' : ''} under{' '}
            <span className="font-medium text-slate-700">{brand.name}</span>
          </p>
        </div>
        <Link
          href={`/admin/products/new?brand=${brand.slug}&category=walk-in-cooler-freezer`}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer"
        >
          <Plus size={20} />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Brand badge tabs — quick navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {['astra', 'amerikooler', 'icemanz'].map((slug) => (
            <Link
              key={slug}
              href={`/admin/products/walk-in-cooler-freezer/brand/${slug}`}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize ${slug === brandSlug
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
            >
              {slug.charAt(0).toUpperCase() + slug.slice(1)}
            </Link>
          ))}
        </div>

        {/* Search */}
        <Suspense fallback={<div className="w-full sm:w-72 h-9 bg-slate-100 rounded-lg animate-pulse" />}>
          <BrandSearchBox />
        </Suspense>
      </div>

      {/* Search result info */}
      {q && (
        <p className="text-sm text-slate-500">
          Showing results for <span className="font-semibold text-slate-800">&quot;{q}&quot;</span>
          {' '}— <span className="font-medium">{totalCount}</span> product{totalCount !== 1 ? 's' : ''} found
        </p>
      )}

      {/* Products Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 whitespace-nowrap">
              <tr>
                <th className="px-6 py-4 w-full">Product</th>
                <th className="px-6 py-4">Category</th>
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
                        {q ? `No products matching "${q}"` : `No products for ${brand.name} yet`}
                      </p>
                      <p className="text-sm text-slate-400 mt-1">
                        {q ? 'Try a different search term.' : 'Click "Add Product" to get started.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 max-w-[200px] sm:max-w-[300px] lg:max-w-[500px]">
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="size-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="size-6 text-slate-400" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p
                            className="font-semibold text-slate-900 line-clamp-2 whitespace-normal break-words"
                            title={product.title}
                          >
                            {product.title}
                          </p>
                          {product.sku && (
                            <p className="text-xs text-slate-400 mt-0.5 font-mono">SKU: {product.sku}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap align-top">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                        {product.category?.name || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium whitespace-nowrap align-top">
                      {product.price || '-'}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap align-top">
                      <ProductActions productId={product.id} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-slate-200 px-6 py-4 flex items-center justify-between bg-slate-50">
            <div className="text-sm text-slate-500">
              Showing{' '}
              <span className="font-medium text-slate-900">{skip + 1}</span> to{' '}
              <span className="font-medium text-slate-900">
                {Math.min(skip + limit, totalCount)}
              </span>{' '}
              of <span className="font-medium text-slate-900">{totalCount}</span> results
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={page > 1 ? `?page=${page - 1}${q ? `&q=${encodeURIComponent(q)}` : ''}` : '#'}
                className={`p-2 rounded-lg border ${page > 1
                  ? 'border-slate-300 text-slate-700 hover:bg-slate-100'
                  : 'border-slate-200 text-slate-400 cursor-not-allowed bg-slate-50'
                  }`}
                aria-disabled={page <= 1}
              >
                <ChevronLeft size={18} />
              </Link>
              <div className="text-sm font-medium text-slate-700 px-2">
                Page {page} of {totalPages}
              </div>
              <Link
                href={page < totalPages ? `?page=${page + 1}${q ? `&q=${encodeURIComponent(q)}` : ''}` : '#'}
                className={`p-2 rounded-lg border ${page < totalPages
                  ? 'border-slate-300 text-slate-700 hover:bg-slate-100'
                  : 'border-slate-200 text-slate-400 cursor-not-allowed bg-slate-50'
                  }`}
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
