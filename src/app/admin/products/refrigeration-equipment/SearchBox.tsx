'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useTransition } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBox() {
  const router      = useRouter();
  const pathname    = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentQ = searchParams.get('q') || '';

  const update = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set('q', value);
      } else {
        params.delete('q');
      }
      params.set('page', '1'); // reset page on search
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [router, pathname, searchParams],
  );

  return (
    <div className="relative w-full sm:w-72">
      <Search
        size={16}
        className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${
          isPending ? 'text-blue-400' : 'text-slate-400'
        }`}
      />
      <input
        type="text"
        defaultValue={currentQ}
        onChange={e => update(e.target.value)}
        placeholder="Search by title or SKU..."
        className="w-full pl-9 pr-8 py-2 text-sm border border-slate-300 rounded-lg bg-white placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all"
      />
      {currentQ && (
        <button
          type="button"
          onClick={() => update('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
