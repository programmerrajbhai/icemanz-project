import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  ChevronRight,
  PackageSearch,
  Snowflake,
} from 'lucide-react';

import Header from '@/components/Header';
import WalkInCoolerFreezerClient from './WalkInCoolerFreezerClient';
import { getWalkInCatalog } from '@/lib/walk-in-catalog';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Walk-In Coolers & Freezers | ICEMANZ',
  description:
    'Explore commercial walk-in coolers and freezers. Compare models, sizes, brands and refrigeration configurations.',
};

export default async function WalkInCatalogPage() {
  const { products, error } = await getWalkInCatalog();

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 pt-[100px] lg:pt-[140px]">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
            <nav
              aria-label="Breadcrumb"
              className="mb-6 flex items-center gap-2 text-xs text-slate-500"
            >
              <Link
                href="/"
                className="hover:text-blue-700"
              >
                Home
              </Link>

              <ChevronRight size={13} />

              <span
                aria-current="page"
                className="text-slate-800"
              >
                Walk-In Coolers & Freezers
              </span>
            </nav>

            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                  <Snowflake size={15} />
                  Commercial Cold Storage
                </span>

                <h1 className="text-3xl font-extrabold tracking-tight text-[#102747] sm:text-4xl lg:text-5xl">
                  Walk-In Coolers & Freezers
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                  Explore available models and compare sizes,
                  brands, floor options and refrigeration systems.
                </p>

                {!error && (
                  <p className="mt-4 text-sm font-semibold text-blue-700">
                    {products.length} products in the catalog
                  </p>
                )}
              </div>

              <Link
                href="/quote"
                className="inline-flex w-fit shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-800"
              >
                Request a Custom Quote
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {error ? (
          <div className="mx-auto max-w-3xl px-4 py-14">
            <div
              role="alert"
              className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center"
            >
              <PackageSearch
                size={38}
                className="mx-auto mb-4 text-amber-600"
              />

              <h2 className="text-xl font-bold text-slate-900">
                Catalog temporarily unavailable
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {error}
              </p>

              <a
                href="/walk-in-cooler-freezer"
                className="mt-6 inline-flex rounded-lg bg-blue-700 px-5 py-3 text-sm font-bold text-white"
              >
                Refresh Catalog
              </a>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="mx-auto max-w-3xl px-4 py-14">
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
              <PackageSearch
                size={42}
                className="mx-auto mb-4 text-slate-400"
              />

              <h2 className="text-xl font-bold text-slate-900">
                No walk-in products are listed yet
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Contact our team for available models and
                custom cold-storage solutions.
              </p>

              <Link
                href="/quote"
                className="mt-6 inline-flex rounded-lg bg-blue-700 px-5 py-3 text-sm font-bold text-white"
              >
                Request a Quote
              </Link>
            </div>
          </div>
        ) : (
          <WalkInCoolerFreezerClient
            initialProducts={products}
            title="Walk-In Coolers & Freezers"
          />
        )}
      </main>
    </>
  );
}