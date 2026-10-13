'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Box,
  Building2,
  Check,
  Clock,
  PackageSearch,
  Settings2,
  ShieldCheck,
  ShoppingCart,
  Snowflake,
  Star,
  Stethoscope,
  Truck,
  Utensils,
} from 'lucide-react';

import type { WalkInCatalogProduct } from '@/lib/walk-in-catalog';

type Props = {
  products: WalkInCatalogProduct[];
  catalogError?: string | null;
};

type BoxType = 'cooler' | 'freezer' | 'combo';
type RefrigerationType = 'remote' | 'top';
type PriceFilter = 'all' | 'small' | 'medium' | 'large';

const FALLBACK_IMAGE =
  '/Walk-in-Cooler-Freezer/category/Box_Only.webp';

const MONEY = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
});

const INDUSTRIES = [
  {
    name: 'Restaurants',
    icon: Utensils,
    title: 'Walk-ins sized for your kitchen',
    description:
      'Find cold-storage space for ingredients, prepared food and everyday kitchen operations.',
    points: [
      'Explore different footprints',
      'Compare cooler and freezer models',
      'Discuss your installation requirements',
    ],
    recommendation: 'Walk-in cooler or combo unit',
  },
  {
    name: 'Supermarkets',
    icon: ShoppingCart,
    title: 'Cold storage for busy retail spaces',
    description:
      'Plan storage and merchandising around the way your team stocks and serves customers.',
    points: [
      'Back-of-house storage options',
      'Glass-door display solutions',
      'Configurations for your available space',
    ],
    recommendation: 'Glass-door cooler or walk-in storage',
  },
  {
    name: 'Warehouses',
    icon: Box,
    title: 'More room for your inventory',
    description:
      'Discuss larger cold-storage layouts, loading requirements and operating temperatures.',
    points: [
      'Review storage capacity',
      'Plan access and loading',
      'Discuss project specifications',
    ],
    recommendation: 'Large walk-in cooler or freezer',
  },
  {
    name: 'Hospitality',
    icon: Building2,
    title: 'Cold storage for hospitality teams',
    description:
      'Explore practical storage options for kitchens, catering operations and food service.',
    points: [
      'Separate temperature zones',
      'Different capacity options',
      'Installation planning support',
    ],
    recommendation: 'Combo unit or multiple walk-ins',
  },
  {
    name: 'Healthcare',
    icon: Stethoscope,
    title: 'Discuss temperature-sensitive storage',
    description:
      'Share your temperature, monitoring and compliance requirements with our team.',
    points: [
      'Define the required temperature range',
      'Discuss monitoring needs',
      'Review suitability before ordering',
    ],
    recommendation: 'Project-specific consultation',
  },
  {
    name: 'Custom',
    icon: Star,
    title: 'A configuration for your project',
    description:
      'Have an unusual layout or a specific installation requirement? Start with a custom quote.',
    points: [
      'Share dimensions and floor plans',
      'Explain your operating requirements',
      'Review suitable configurations',
    ],
    recommendation: 'Custom cold-storage solution',
  },
];

const CATEGORIES = [
  {
    title: 'Walk-in Coolers',
    description: 'Explore cooler models and available sizes.',
    icon: Utensils,
    href: '/walk-in-cooler-freezer/walk-in-cooler-no-floor',
  },
  {
    title: 'Walk-in Freezers',
    description: 'Discover low-temperature storage options.',
    icon: Snowflake,
    href: '/walk-in-cooler-freezer/walk-in-freezer-with-floor',
  },
  {
    title: 'Combo Units',
    description: 'Cooler and freezer space in one solution.',
    icon: Box,
    href: '/walk-in-cooler-freezer/walk-in-combo-cooler-freezer',
  },
  {
    title: 'Glass-Door',
    description: 'Display and merchandising solutions.',
    icon: ShoppingCart,
    href: '/glassdoor-walk-in-cooler',
  },
  {
    title: 'Refrigeration',
    description: 'Explore refrigeration equipment.',
    icon: Settings2,
    href: '/refrigeration-equipment',
  },
];

const GALLERY = [
  {
    src: '/home/hf.jpeg',
    alt: 'Commercial refrigeration equipment',
  },
  {
    src: '/home/hf2.jpeg',
    alt: 'Commercial walk-in cooler',
  },
  {
    src: '/home/hf3.jpeg',
    alt: 'Refrigeration system',
  },
  {
    src: '/home/hf4.jpeg',
    alt: 'Walk-in cold-storage unit',
  },
  {
    src: '/home/hf5.jpeg',
    alt: 'Commercial cooling equipment',
  },
];

function CatalogImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const [source, setSource] = useState(src || FALLBACK_IMAGE);

  if (!source) {
    return (
      <div className="absolute inset-0 flex items-center justify-center text-slate-300">
        <Box size={48} strokeWidth={1.2} />
      </div>
    );
  }

  return (
    <Image
      src={source}
      alt={alt}
      fill
      unoptimized
      sizes="(max-width: 639px) 90vw, (max-width: 1023px) 45vw, 300px"
      className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
      onError={() => {
        setSource((previous) =>
          previous === FALLBACK_IMAGE ? '' : FALLBACK_IMAGE,
        );
      }}
    />
  );
}

export default function ClientHomeDesign({
  products = [],
  catalogError = null,
}: Props) {
  const [boxType, setBoxType] = useState<BoxType>('cooler');
  const [refrigeration, setRefrigeration] =
    useState<RefrigerationType>('remote');

  const [width, setWidth] = useState(10);
  const [length, setLength] = useState(12);
  const [activeIndustry, setActiveIndustry] = useState(0);
  const [priceFilter, setPriceFilter] =
    useState<PriceFilter>('all');

  const [galleryIndex, setGalleryIndex] =
    useState<number | null>(null);

  useEffect(() => {
    if (galleryIndex === null) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setGalleryIndex(null);
      }
    };

    window.addEventListener('keydown', handleKey);

    return () => window.removeEventListener('keydown', handleKey);
  }, [galleryIndex]);

  const calculator = useMemo(() => {
    const height = 8;
    const scale = 5.2;

    const point = (x: number, y: number, z: number) =>
      [
        200 + (x - y) * 0.866 * scale,
        140 +
          (x + y) * 0.5 * scale -
          z * scale -
          ((width + length) * 0.5 * scale) / 2,
      ].join(',');

    const polygon = (points: number[][]) =>
      points
        .map(([x, y, z]) => point(x, y, z))
        .join(' ');

    const area = width * length;

    let estimate = area * 42 + 2400 + area * 30;

    if (boxType === 'freezer') estimate *= 1.35;
    if (boxType === 'combo') estimate *= 1.25;
    if (refrigeration === 'top') estimate *= 1.06;

    const formatEstimate = (value: number) =>
      MONEY.format(Math.round(value / 50) * 50);

    return {
      top: polygon([
        [0, 0, height],
        [width, 0, height],
        [width, length, height],
        [0, length, height],
      ]),
      left: polygon([
        [0, length, 0],
        [width, length, 0],
        [width, length, height],
        [0, length, height],
      ]),
      right: polygon([
        [width, 0, 0],
        [width, length, 0],
        [width, length, height],
        [width, 0, height],
      ]),
      door: polygon([
        [width * 0.3, length, 0],
        [width * 0.3 + 3, length, 0],
        [width * 0.3 + 3, length, 7],
        [width * 0.3, length, 7],
      ]),
      unit: polygon([
        [width * 0.3, length * 0.3, height],
        [width * 0.3 + 3, length * 0.3, height],
        [width * 0.3 + 3, length * 0.3 + 3, height + 1.5],
        [width * 0.3, length * 0.3 + 3, height + 1.5],
      ]),
      price:
        `${formatEstimate(estimate * 0.92)}–` +
        formatEstimate(estimate * 1.08),
      area,
    };
  }, [width, length, boxType, refrigeration]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (priceFilter === 'all') return true;
      if (product.priceValue === null) return false;

      if (priceFilter === 'small') {
        return product.priceValue < 10000;
      }

      if (priceFilter === 'medium') {
        return (
          product.priceValue >= 10000 &&
          product.priceValue <= 12500
        );
      }

      return product.priceValue > 12500;
    });
  }, [products, priceFilter]);

  const industry = INDUSTRIES[activeIndustry];

  const quoteUrl =
    `/quote?type=${boxType}` +
    `&size=${width}x${length}` +
    `&refrig=${refrigeration}`;

  return (
    <div className="bg-[#f4f7fb] text-[#0f172a]">
      {/* Hero and estimate calculator */}
      <section className="relative overflow-hidden bg-[#0a1c27] px-4 pb-28 pt-32 sm:px-6 lg:px-8 lg:pt-44">
        <div className="pointer-events-none absolute -right-32 top-0 h-[500px] w-[500px] rounded-full bg-blue-600/25 blur-[130px]" />
        <div className="pointer-events-none absolute -bottom-40 -left-24 h-[450px] w-[450px] rounded-full bg-blue-800/30 blur-[100px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <span className="mb-6 inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/10 px-3 py-2 text-xs font-bold uppercase tracking-widest text-blue-200">
              <Snowflake size={15} />
              Commercial Cold Storage
            </span>

            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Build your walk-in.
              <br />
              <span className="text-blue-400">
                Explore the options.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">
              Compare cooler and freezer models, explore sizes
              and start planning your cold-storage project.
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {[
                'Coolers & Freezers',
                'Multiple Configurations',
                'Custom Quotes',
              ].map((label) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white"
                >
                  <Check size={14} className="text-blue-400" />
                  {label}
                </span>
              ))}
            </div>

            <Link
              href="#shop"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-4 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
            >
              Explore Available Models
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl lg:col-span-7">
            <div className="grid md:grid-cols-[0.9fr_1.1fr]">
              <div className="flex flex-col justify-center border-b border-slate-200 bg-slate-50 p-5 md:border-b-0 md:border-r">
                <svg
                  viewBox="0 0 400 240"
                  role="img"
                  aria-label={`${width} by ${length} foot ${boxType} concept`}
                  className="h-auto w-full"
                >
                  <polygon
                    points={calculator.right}
                    fill="#bfdbfe"
                    stroke="#1e3a8a"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <polygon
                    points={calculator.left}
                    fill="#dbeafe"
                    stroke="#1e3a8a"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <polygon
                    points={calculator.top}
                    fill="#ffffff"
                    stroke="#1e3a8a"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <polygon
                    points={calculator.door}
                    fill="#2563eb"
                    stroke="#1e3a8a"
                    strokeWidth="2"
                  />
                  {refrigeration === 'top' && (
                    <polygon
                      points={calculator.unit}
                      fill="#1e3a8a"
                      stroke="#1e3a8a"
                      strokeWidth="2"
                    />
                  )}
                </svg>

                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg border border-slate-200 bg-white p-3 text-center">
                    <p className="text-[10px] font-bold uppercase text-slate-400">
                      Dimensions
                    </p>
                    <p className="mt-1 text-lg font-extrabold">
                      {width} × {length} ft
                    </p>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-white p-3 text-center">
                    <p className="text-[10px] font-bold uppercase text-slate-400">
                      Footprint
                    </p>
                    <p className="mt-1 text-lg font-extrabold">
                      {calculator.area} ft²
                    </p>
                  </div>
                </div>

                <p className="mt-3 text-center text-[10px] text-slate-400">
                  Illustrative concept, not an engineering drawing.
                </p>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1">
                  {(['cooler', 'freezer', 'combo'] as const).map(
                    (value) => (
                      <button
                        key={value}
                        type="button"
                        aria-pressed={boxType === value}
                        onClick={() => setBoxType(value)}
                        className={`rounded-lg px-2 py-3 text-xs font-bold capitalize transition ${
                          boxType === value
                            ? 'bg-white text-blue-700 shadow-sm'
                            : 'text-slate-500'
                        }`}
                      >
                        {value}
                      </button>
                    ),
                  )}
                </div>

                <div className="mt-6 space-y-6">
                  <div>
                    <label
                      htmlFor="home-width"
                      className="mb-3 flex items-center justify-between text-sm font-bold"
                    >
                      Width
                      <span className="text-blue-700">
                        {width} ft
                      </span>
                    </label>

                    <input
                      id="home-width"
                      type="range"
                      min={6}
                      max={30}
                      value={width}
                      onChange={(event) =>
                        setWidth(Number(event.target.value))
                      }
                      className="w-full accent-blue-600"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="home-length"
                      className="mb-3 flex items-center justify-between text-sm font-bold"
                    >
                      Length
                      <span className="text-blue-700">
                        {length} ft
                      </span>
                    </label>

                    <input
                      id="home-length"
                      type="range"
                      min={6}
                      max={30}
                      value={length}
                      onChange={(event) =>
                        setLength(Number(event.target.value))
                      }
                      className="w-full accent-blue-600"
                    />
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
                  {[
                    { value: 'remote' as const, label: 'Remote System' },
                    { value: 'top' as const, label: 'Top-Mount' },
                  ].map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      aria-pressed={refrigeration === item.value}
                      onClick={() => setRefrigeration(item.value)}
                      className={`rounded-lg px-2 py-3 text-xs font-bold ${
                        refrigeration === item.value
                          ? 'bg-white text-blue-700 shadow-sm'
                          : 'text-slate-500'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <div className="mt-6 border-t border-slate-100 pt-5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Illustrative Budget Estimate
                  </p>

                  <p className="mt-1 text-xl font-extrabold text-blue-900">
                    {calculator.price}
                  </p>

                  <p className="mt-2 text-[11px] leading-5 text-slate-500">
                    Planning estimate only. Final equipment,
                    delivery and installation pricing requires a quote.
                  </p>

                  <Link
                    href={quoteUrl}
                    className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-3 text-sm font-bold text-white hover:bg-blue-800"
                  >
                    Request a Quote
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service highlights */}
      <section className="relative z-10 mx-auto -mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-5 rounded-2xl bg-gradient-to-r from-blue-900 to-blue-600 p-6 text-white shadow-xl md:grid-cols-4">
          {[
            { icon: Box, title: 'Product Options', text: 'Explore available models' },
            { icon: Settings2, title: 'Configurations', text: 'Compare your requirements' },
            { icon: Truck, title: 'Delivery Planning', text: 'Discuss your location' },
            { icon: ShieldCheck, title: 'Product Details', text: 'Review specifications' },
          ].map((item) => (
            <div key={item.title} className="text-center">
              <item.icon size={25} className="mx-auto mb-3" />
              <h2 className="text-sm font-bold">{item.title}</h2>
              <p className="mt-1 text-xs text-blue-100">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section
        id="need"
        className="mx-auto max-w-7xl scroll-mt-36 px-4 py-16 sm:px-6 lg:px-8"
      >
        <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
          What do you need to keep cold?
        </h2>

        <p className="mt-3 text-slate-500">
          Select a category to explore suitable products.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {CATEGORIES.map((category) => (
            <Link
              key={category.title}
              href={category.href}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-500 hover:shadow-lg"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <category.icon size={23} />
              </div>

              <h3 className="text-base font-bold">
                {category.title}
              </h3>

              <p className="mt-2 flex-1 text-xs leading-6 text-slate-500">
                {category.description}
              </p>

              <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-blue-700">
                Explore
                <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Industry selector */}
      <section
        id="industry"
        className="border-y border-slate-200 bg-white py-16"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            Built for how you work
          </h2>

          <p className="mt-3 text-slate-500">
            Explore cold-storage requirements for your business.
          </p>

          <div className="mt-9 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {INDUSTRIES.map((item, index) => (
                <button
                  key={item.name}
                  type="button"
                  aria-pressed={activeIndustry === index}
                  onClick={() => setActiveIndustry(index)}
                  className={`flex items-center justify-between rounded-xl border px-5 py-4 text-left text-sm font-bold transition ${
                    activeIndustry === index
                      ? 'border-blue-700 bg-blue-700 text-white'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <item.icon size={18} />
                    {item.name}
                  </span>

                  <ArrowRight size={16} />
                </button>
              ))}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 md:p-9">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-700">
                {industry.name}
              </span>

              <h3 className="mt-3 text-2xl font-extrabold md:text-3xl">
                {industry.title}
              </h3>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
                {industry.description}
              </p>

              <ul className="mt-6 space-y-3">
                {industry.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-3 text-sm font-medium"
                  >
                    <Check size={18} className="shrink-0 text-blue-700" />
                    {point}
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex flex-col justify-between gap-5 border-t border-slate-200 pt-6 sm:flex-row sm:items-center">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Explore
                  </p>
                  <p className="mt-1 text-sm font-bold">
                    {industry.recommendation}
                  </p>
                </div>

                <Link
                  href="/quote"
                  className="inline-flex w-fit items-center gap-2 rounded-lg bg-blue-700 px-5 py-3 text-sm font-bold text-white hover:bg-blue-800"
                >
                  Get a Quote
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real database products */}
      <section
        id="shop"
        className="mx-auto max-w-7xl scroll-mt-36 px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              Explore Our Models
            </h2>

            <p className="mt-3 text-sm text-slate-500">
              Select a product to view its details and configuration options.
            </p>
          </div>

          <div className="flex max-w-full flex-wrap gap-1 rounded-xl border border-slate-200 bg-white p-1.5">
            {[
              { value: 'all' as const, label: 'All' },
              { value: 'small' as const, label: '< $10k' },
              { value: 'medium' as const, label: '$10k–$12.5k' },
              { value: 'large' as const, label: '> $12.5k' },
            ].map((filter) => (
              <button
                key={filter.value}
                type="button"
                aria-pressed={priceFilter === filter.value}
                onClick={() => setPriceFilter(filter.value)}
                className={`rounded-lg px-4 py-2.5 text-xs font-bold transition ${
                  priceFilter === filter.value
                    ? 'bg-blue-700 text-white'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {catalogError ? (
          <div
            role="alert"
            className="rounded-xl border border-amber-200 bg-amber-50 p-8 text-center"
          >
            <PackageSearch
              size={34}
              className="mx-auto mb-3 text-amber-600"
            />
            <h3 className="font-bold">Catalog temporarily unavailable</h3>
            <p className="mt-3 text-sm text-slate-600">{catalogError}</p>
            <a
              href="/"
              className="mt-5 inline-flex rounded-lg bg-blue-700 px-5 py-3 text-sm font-bold text-white"
            >
              Refresh
            </a>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <PackageSearch
              size={36}
              className="mx-auto mb-4 text-slate-400"
            />

            <h3 className="text-lg font-bold">
              {products.length === 0
                ? 'No walk-in products are listed yet'
                : 'No products in this price range'}
            </h3>

            {products.length > 0 ? (
              <button
                type="button"
                onClick={() => setPriceFilter('all')}
                className="mt-4 text-sm font-bold text-blue-700"
              >
                Show All Models
              </button>
            ) : (
              <Link
                href="/quote"
                className="mt-4 inline-flex text-sm font-bold text-blue-700"
              >
                Contact Us for Available Options
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.slice(0, 8).map((product) => {
              const href =
                `/walk-in-cooler-freezer/` +
                `${encodeURIComponent(product.slug)}/` +
                encodeURIComponent(product.id);

              return (
                <article
                  key={product.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-600 hover:shadow-xl hover:shadow-blue-900/5"
                >
                  <Link
                    href={href}
                    aria-label={`View ${product.title}`}
                    className="relative mb-5 block aspect-[4/3] overflow-hidden rounded-xl border border-slate-100 bg-slate-50"
                  >
                    <CatalogImage
                      src={product.images[0] || ''}
                      alt={product.title}
                    />
                  </Link>

                  {(product.brand || product.badge) && (
                    <span className="mb-3 w-fit rounded bg-blue-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-700">
                      {product.brand || product.badge}
                    </span>
                  )}

                  <Link
                    href={href}
                    className="rounded hover:text-blue-700"
                  >
                    <h3 className="line-clamp-2 text-base font-extrabold leading-6">
                      {product.title}
                    </h3>
                  </Link>

                  {product.sku && (
                    <p className="mb-5 mt-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      SKU: {product.sku}
                    </p>
                  )}

                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                    <p className="text-xl font-extrabold text-blue-900">
                      {product.priceValue !== null
                        ? MONEY.format(product.priceValue)
                        : 'Request Price'}
                    </p>

                    <Link
                      href={href}
                      aria-label={`View details for ${product.title}`}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-700 text-white transition hover:bg-blue-800"
                    >
                      <ArrowRight size={17} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {products.length > 0 && !catalogError && (
          <div className="mt-9 text-center">
            <Link
              href="/walk-in-cooler-freezer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-700 bg-white px-6 py-3.5 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
            >
              View All {products.length} Models
              <ArrowRight size={17} />
            </Link>
          </div>
        )}
      </section>

      {/* Product category banners */}
      <section className="grid lg:grid-cols-2">
        {[
          {
            title: 'Walk-In Coolers & Freezers',
            text: 'Explore sizes, brands and available configurations.',
            href: '/walk-in-cooler-freezer',
            image: '/home/hf4.jpeg',
          },
          {
            title: 'Refrigeration Equipment',
            text: 'Find equipment for your commercial cooling project.',
            href: '/refrigeration-equipment',
            image: '/home/hf3.jpeg',
          },
        ].map((banner) => (
          <div
            key={banner.title}
            className="relative flex min-h-80 items-center overflow-hidden bg-slate-950 px-7 py-12 sm:px-12"
          >
            <Image
              src={banner.image}
              alt=""
              fill
              sizes="(max-width: 1023px) 100vw, 50vw"
              className="object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent" />

            <div className="relative max-w-md">
              <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
                {banner.title}
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-300">
                {banner.text}
              </p>
              <Link
                href={banner.href}
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
              >
                Explore Products
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* Industry overview */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
            Target Industries
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
            Cold storage for your sector.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map((item, index) => (
            <a
              key={item.name}
              href="#industry"
              onClick={() => setActiveIndustry(index)}
              className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-blue-500 hover:shadow-lg"
            >
              <div className="h-fit rounded-xl bg-blue-50 p-3 text-blue-700">
                <item.icon size={25} />
              </div>
              <div>
                <h3 className="text-sm font-extrabold uppercase">
                  {item.name}
                </h3>
                <p className="mt-3 text-xs leading-6 text-slate-500">
                  {item.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Project assistance */}
      <section className="bg-[#0f172a] px-4 py-14 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-7 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-300">
              <Clock size={15} />
              Plan Your Next Project
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight md:text-4xl">
              Need help choosing the right system?
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Share your dimensions, temperature requirements
              and installation location with our team.
            </p>
          </div>

          <Link
            href="/recommendation"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-6 py-4 text-sm font-bold text-white hover:bg-blue-700"
          >
            Get a Recommendation
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      {/* Gallery */}
      <section className="border-b-4 border-blue-600 bg-white px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1600px] grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {GALLERY.map((image, index) => (
            <button
              key={image.src}
              type="button"
              aria-label={`Enlarge ${image.alt}`}
              onClick={() => setGalleryIndex(index)}
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 767px) 45vw, 300px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      </section>

      {galleryIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={GALLERY[galleryIndex].alt}
          onClick={() => setGalleryIndex(null)}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-5"
        >
          <button
            type="button"
            autoFocus
            onClick={() => setGalleryIndex(null)}
            className="absolute right-5 top-5 z-10 rounded-lg bg-white px-4 py-2 text-sm font-bold text-slate-900"
          >
            Close
          </button>

          <div className="relative h-[75vh] w-full max-w-5xl">
            <Image
              src={GALLERY[galleryIndex].src}
              alt={GALLERY[galleryIndex].alt}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}