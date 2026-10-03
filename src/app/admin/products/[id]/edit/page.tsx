import prisma from "@/lib/prisma";
import EditProductForm from "./EditProductForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true, brandRef: true },
  });

  if (!product) {
    notFound();
  }

  // Fetch ALL categories with their hierarchy
  const allCategories = await prisma.category.findMany({
    include: {
      subcategories: {
        include: {
          subcategories: true
        }
      }
    },
    orderBy: {
      name: 'asc'
    }
  });

  // Fetch all brands
  const allBrands = await prisma.brand.findMany({ orderBy: { name: 'asc' } });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Edit Product</h1>
          <p className="text-sm text-slate-500 mt-1">Update the details for &quot;{product.title}&quot;.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
        <EditProductForm product={product} allCategories={allCategories} allBrands={allBrands} />
      </div>
    </div>
  );
}
