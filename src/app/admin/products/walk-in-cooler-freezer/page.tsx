import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus, Image as ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";
import ProductActions from "../ProductActions";

export const dynamic = 'force-dynamic';

export default async function WalkInCoolerProductsPage({
  searchParams,
}: {
  searchParams?: Promise<{
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const page = Number(params?.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const walkInSlugs = ['walk-in-cooler-freezer', 'walk-in-cooler-no-floor', 'walk-in-cooler-with-floor', 'walk-in-freezer-with-floor', 'walk-in-combo-cooler-freezer'];

  const where = {
    category: {
      slug: {
        in: walkInSlugs
      }
    }
  };

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      include: {
        category: true,
      },
      where,
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: skip
    }),
    prisma.product.count({ where })
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Walk-In Cooler & Freezer</h1>
          <p className="text-sm text-slate-500 mt-1">Manage all products in Walk-In Cooler & Freezer category.</p>
        </div>
        <Link
          href="/admin/products/new?category=walk-in-cooler-freezer"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer"
        >
          <Plus size={20} />
          <span>Add Product</span>
        </Link>
      </div>

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
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <ImageIcon className="size-12 text-slate-300 mb-3" />
                      <p className="text-base font-medium text-slate-600">No products found</p>
                      <p className="text-sm">Get started by creating a new product.</p>
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
                            <img src={product.images[0]} alt={product.title} className="size-full object-cover" />
                          ) : (
                            <ImageIcon className="size-6 text-slate-400" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-slate-900 line-clamp-2 whitespace-normal break-words" title={product.title}>{product.title}</p>
                          <p className="text-xs text-slate-500 line-clamp-2 whitespace-normal break-words mt-0.5">{product.description || "No description"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap align-top">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                        {product.category?.name || "Uncategorized"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium whitespace-nowrap align-top">
                      {product.price || "-"}
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
              Showing <span className="font-medium text-slate-900">{skip + 1}</span> to{" "}
              <span className="font-medium text-slate-900">
                {Math.min(skip + limit, totalCount)}
              </span>{" "}
              of <span className="font-medium text-slate-900">{totalCount}</span> results
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={page > 1 ? `?page=${page - 1}` : "#"}
                className={`p-2 rounded-lg border ${page > 1
                    ? "border-slate-300 text-slate-700 hover:bg-slate-100"
                    : "border-slate-200 text-slate-400 cursor-not-allowed bg-slate-50"
                  }`}
                aria-disabled={page <= 1}
              >
                <ChevronLeft size={18} />
              </Link>
              <div className="text-sm font-medium text-slate-700 px-2">
                Page {page} of {totalPages}
              </div>
              <Link
                href={page < totalPages ? `?page=${page + 1}` : "#"}
                className={`p-2 rounded-lg border ${page < totalPages
                    ? "border-slate-300 text-slate-700 hover:bg-slate-100"
                    : "border-slate-200 text-slate-400 cursor-not-allowed bg-slate-50"
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
