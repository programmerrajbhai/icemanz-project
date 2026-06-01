import prisma from "@/lib/prisma";
import ProductForm from "./ProductForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function NewProductPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const params = await searchParams;
  const categorySlug = params.category;

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

  // Find pre-selected category if slug is provided
  const preselectedCategory = categorySlug 
    ? await prisma.category.findFirst({ 
        where: { slug: categorySlug },
        include: { parent: true }
      })
    : null;

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
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Add New Product</h1>
          <p className="text-sm text-slate-500 mt-1">Fill in the details below to add a new product to your catalog.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
        <ProductForm allCategories={allCategories} preselectedCategory={preselectedCategory} />
      </div>
    </div>
  );
}
