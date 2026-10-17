import Link from "next/link";
import { notFound } from "next/navigation";
import type { Prisma } from "@prisma/client";
import {
  AlertCircle,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Plus,
  Search,
  Tag,
} from "lucide-react";

import prisma from "@/lib/prisma";
import ProductActions from "@/app/admin/products/ProductActions";

export const dynamic = "force-dynamic";

const BRAND_NAMES = new Map<string, string>([
  ["astra", "Astra"],
  ["amerikooler", "Amerikooler"],
  ["icemanz", "Icemanz"],
]);

const BRAND_BASE_PATH =
  "/admin/products/walk-in-cooler-freezer/brand";

const WALK_IN_PATH =
  "/admin/products/walk-in-cooler-freezer";

const PAGE_SIZE = 10;

type SearchValues = {
  page?: string | string[];
  q?: string | string[];
};

type PageProps = {
  params: Promise<{
    brandSlug: string;
  }>;
  searchParams?: Promise<SearchValues>;
};

function firstValue(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function getRequestedPage(value: string): number {
  const parsed = Number(value);

  if (!Number.isSafeInteger(parsed) || parsed < 1) {
    return 1;
  }

  return parsed;
}

function getProductImage(images: Prisma.JsonValue | null): string | null {
  if (!Array.isArray(images)) {
    return null;
  }

  for (const image of images) {
    if (typeof image === "string" && image.trim()) {
      return image;
    }
  }

  return null;
}

function displayPrice(value: string | null): string {
  const original = value?.trim();

  if (!original) {
    return "—";
  }

  // Supports both "12132.00" and "$12,132.00".
  const cleaned = original.replace(/[$,\s]/g, "");

  if (!/^\d+(\.\d+)?$/.test(cleaned)) {
    return original;
  }

  const amount = Number(cleaned);

  if (!Number.isFinite(amount)) {
    return original;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export default async function BrandProductsPage({
  params,
  searchParams,
}: PageProps) {
  const { brandSlug: rawBrandSlug } = await params;
  const search = await searchParams;

  const brandSlug = rawBrandSlug.trim().toLowerCase();
  const knownBrandName = BRAND_NAMES.get(brandSlug);

  const q = firstValue(search?.q).trim();
  const requestedPage = getRequestedPage(firstValue(search?.page));

  // Prefer the exact stored slug.
  let brand = await prisma.brand.findUnique({
    where: {
      slug: rawBrandSlug,
    },
  });

  // Support links whose capitalization differs from the stored slug.
  if (!brand) {
    brand = await prisma.brand.findFirst({
      where: {
        slug: {
          equals: brandSlug,
          mode: "insensitive",
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  // A completely unknown brand URL should still return a real 404.
  // Known sidebar brands can render even before their Brand row exists.
  if (!brand && !knownBrandName) {
    notFound();
  }

  const brandName = brand?.name ?? knownBrandName ?? brandSlug;
  const routeSlug = brand?.slug ?? brandSlug;

  const pagePath =
    `${BRAND_BASE_PATH}/${encodeURIComponent(routeSlug)}`;

  // Match linked products and older products that only contain brand text.
  const brandConditions: Prisma.ProductWhereInput[] = [];

  if (brand) {
    brandConditions.push({
      brandId: brand.id,
    });
  }

  const textNames = new Set<string>([
    brandName,
    brandSlug,
  ]);

  if (knownBrandName) {
    textNames.add(knownBrandName);
  }

  for (const name of textNames) {
    brandConditions.push({
      brand: {
        equals: name,
        mode: "insensitive",
      },
    });
  }

  const conditions: Prisma.ProductWhereInput[] = [
    {
      OR: brandConditions,
    },
  ];

  if (q) {
    conditions.push({
      OR: [
        {
          title: {
            contains: q,
            mode: "insensitive",
          },
        },
        {
          sku: {
            contains: q,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  const where: Prisma.ProductWhereInput = {
    AND: conditions,
  };

  const totalCount = await prisma.product.count({
    where,
  });

  const totalPages = Math.max(
    1,
    Math.ceil(totalCount / PAGE_SIZE),
  );

  // Avoid an empty page after deleting the last item on a later page.
  const page = Math.min(requestedPage, totalPages);
  const skip = (page - 1) * PAGE_SIZE;

  const products = await prisma.product.findMany({
    where,
    include: {
      category: true,
    },
    orderBy: [
      {
        createdAt: "desc",
      },
      {
        id: "desc",
      },
    ],
    take: PAGE_SIZE,
    skip,
  });

  const addParams = new URLSearchParams({
    category: "walk-in-cooler-freezer",
  });

  // Only preselect a brand that actually exists in the database.
  if (brand) {
    addParams.set("brand", brand.slug);
  }

  const addProductUrl =
    `/admin/products/new?${addParams.toString()}`;

  function paginationUrl(nextPage: number): string {
    const query = new URLSearchParams({
      page: String(nextPage),
    });

    if (q) {
      query.set("q", q);
    }

    return `${pagePath}?${query.toString()}`;
  }

  const firstResult = totalCount > 0 ? skip + 1 : 0;
  const lastResult = Math.min(skip + PAGE_SIZE, totalCount);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href={WALK_IN_PATH}
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-blue-600"
          >
            <ArrowLeft size={16} />
            Walk-In Cooler &amp; Freezer
          </Link>

          <h1 className="flex items-center gap-3 text-2xl font-bold tracking-tight text-slate-900">
            <span className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Tag size={22} />
            </span>

            {brandName}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {totalCount} product{totalCount === 1 ? "" : "s"}
            {" "}found for {brandName}.
          </p>
        </div>

        <Link
          href={addProductUrl}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md active:scale-[0.98]"
        >
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      {/* Missing brand record: useful information instead of a 404 */}
      {!brand && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900"
        >
          <AlertCircle
            size={20}
            className="mt-0.5 shrink-0"
          />

          <div className="space-y-1 text-sm">
            <p className="font-semibold">
              {brandName} is not registered in the Brand table.
            </p>

            <p>
              Products saved with the brand text &quot;{brandName}&quot;
              {" "}can still appear here.
            </p>

            <p>
              To enable brand selection in the product form, add a Brand
              record with name{" "}
              <strong>{brandName}</strong>
              {" "}and slug{" "}
              <code className="rounded bg-amber-100 px-1.5 py-0.5">
                {brandSlug}
              </code>
              {" "}in Prisma Studio.
            </p>
          </div>
        </div>
      )}

      {/* Brand navigation and search */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <nav
          aria-label="Product brands"
          className="flex flex-wrap items-center gap-2"
        >
          {Array.from(BRAND_NAMES.entries()).map(([slug, name]) => {
            const active = slug === brandSlug;

            return (
              <Link
                key={slug}
                href={`${BRAND_BASE_PATH}/${slug}`}
                aria-current={active ? "page" : undefined}
                className={[
                  "rounded-full px-4 py-2 text-sm font-semibold",
                  "transition-colors",
                  active
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                ].join(" ")}
              >
                {name}
              </Link>
            );
          })}
        </nav>

        <form
          action={pagePath}
          method="get"
          className="flex w-full items-center gap-2 lg:w-auto"
        >
          <div className="relative min-w-0 flex-1">
            <Search
              size={17}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              key={q}
              type="search"
              name="q"
              defaultValue={q}
              aria-label="Search products by title or SKU"
              placeholder="Search title or SKU..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 lg:w-72"
            />
          </div>

          <button
            type="submit"
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
          >
            Search
          </button>
        </form>
      </div>

      {q && (
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <p>
            Results for{" "}
            <strong className="text-slate-800">
              &quot;{q}&quot;
            </strong>
          </p>

          <Link
            href={pagePath}
            className="font-semibold text-blue-600 hover:underline"
          >
            Clear search
          </Link>
        </div>
      )}

      {/* Products */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <tr>
                <th scope="col" className="px-6 py-4">
                  Product
                </th>

                <th
                  scope="col"
                  className="whitespace-nowrap px-6 py-4"
                >
                  Category
                </th>

                <th
                  scope="col"
                  className="whitespace-nowrap px-6 py-4"
                >
                  Price
                </th>

                <th
                  scope="col"
                  className="px-6 py-4 text-right"
                >
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {products.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-16 text-center"
                  >
                    <div className="mx-auto flex max-w-sm flex-col items-center">
                      <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-slate-100">
                        <ImageIcon
                          size={30}
                          className="text-slate-400"
                        />
                      </div>

                      <p className="text-base font-semibold text-slate-800">
                        {q
                          ? "No products match your search"
                          : `No products found for ${brandName}`}
                      </p>

                      <p className="mt-2 text-sm text-slate-500">
                        {q
                          ? "Try a different title or SKU."
                          : "Check the product's saved brand or add a new product."}
                      </p>

                      <Link
                        href={q ? pagePath : addProductUrl}
                        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-100"
                      >
                        {q ? (
                          "Clear Search"
                        ) : (
                          <>
                            <Plus size={16} />
                            Add Product
                          </>
                        )}
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const imageUrl = getProductImage(product.images);

                  return (
                    <tr
                      key={product.id}
                      className="transition-colors hover:bg-slate-50/70"
                    >
                      <td className="min-w-[280px] max-w-[520px] px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={product.title}
                                loading="lazy"
                                className="size-full object-contain"
                              />
                            ) : (
                              <ImageIcon
                                size={23}
                                className="text-slate-400"
                              />
                            )}
                          </div>

                          <div className="min-w-0">
                            <Link
                              href={`/admin/products/${product.id}/edit`}
                              className="line-clamp-2 font-semibold text-slate-900 transition-colors hover:text-blue-600"
                            >
                              {product.title}
                            </Link>

                            {product.sku && (
                              <p className="mt-1 font-mono text-xs text-slate-400">
                                SKU: {product.sku}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                          {product.category?.name ?? "Uncategorized"}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 font-semibold text-slate-800">
                        {displayPrice(product.price)}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <ProductActions productId={product.id} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <strong className="text-slate-800">
              {firstResult}–{lastResult}
            </strong>
            {" "}of{" "}
            <strong className="text-slate-800">
              {totalCount}
            </strong>
          </p>

          {totalPages > 1 && (
            <nav
              aria-label="Product pagination"
              className="flex items-center gap-3"
            >
              {page > 1 ? (
                <Link
                  href={paginationUrl(page - 1)}
                  aria-label="Previous page"
                  className="rounded-lg border border-slate-300 bg-white p-2 text-slate-600 transition-colors hover:bg-slate-100"
                >
                  <ChevronLeft size={18} />
                </Link>
              ) : (
                <span
                  aria-disabled="true"
                  aria-label="Previous page"
                  className="rounded-lg border border-slate-200 p-2 text-slate-300"
                >
                  <ChevronLeft size={18} />
                </span>
              )}

              <span className="text-sm font-medium text-slate-700">
                {page} / {totalPages}
              </span>

              {page < totalPages ? (
                <Link
                  href={paginationUrl(page + 1)}
                  aria-label="Next page"
                  className="rounded-lg border border-slate-300 bg-white p-2 text-slate-600 transition-colors hover:bg-slate-100"
                >
                  <ChevronRight size={18} />
                </Link>
              ) : (
                <span
                  aria-disabled="true"
                  aria-label="Next page"
                  className="rounded-lg border border-slate-200 p-2 text-slate-300"
                >
                  <ChevronRight size={18} />
                </span>
              )}
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}