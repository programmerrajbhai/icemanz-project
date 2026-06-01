'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Edit, Trash2, Loader2 } from 'lucide-react';
import { deleteProduct } from './actions';

export default function ProductActions({ productId }: { productId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleEdit = () => {
    router.push(`/admin/products/${productId}/edit`);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteProduct(productId);
    if (result?.error) {
      alert(result.error);
      setIsDeleting(false);
      setShowConfirm(false);
    } else {
      router.refresh();
    }
  };

  return (
    <div className="flex items-center justify-end gap-2 relative">
      <button
        onClick={handleEdit}
        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer flex items-center justify-center"
        title="Edit product"
      >
        <Edit size={20} strokeWidth={2} />
      </button>

      {showConfirm ? (
        <div className="flex items-center gap-1.5 animate-in fade-in slide-in-from-right-2 duration-200">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-2.5 py-1.5 text-xs font-medium text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors cursor-pointer disabled:opacity-60 flex items-center gap-1.5"
          >
            {isDeleting ? (
              <>
                <Loader2 size={12} className="animate-spin" />
                Deleting...
              </>
            ) : (
              'Confirm'
            )}
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            disabled={isDeleting}
            className="px-2.5 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowConfirm(true)}
          className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer flex items-center justify-center"
          title="Delete product"
        >
          <Trash2 size={20} strokeWidth={2} />
        </button>
      )}
    </div>
  );
}
