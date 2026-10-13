import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import CondensingUnitsClient, {
  type CatalogProduct,
} from './CondensingUnitsClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Condensing Units | ICEMANZ',
  description:
    'Explore commercial condensing units by brand, temperature, horsepower, voltage and compressor type.',
};

type DataObject = Record<string, unknown>;

function object(value: unknown): DataObject {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as DataObject)
    : {};
}

function text(value: unknown): string {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number') return String(value);
  return '';
}

function key(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Supports objects and [{ label, value }] specification arrays.
function flatten(value: unknown, depth = 0): DataObject {
  if (depth > 3) return {};

  const result: DataObject = {};

  if (Array.isArray(value)) {
    for (const item of value) {
      Object.assign(result, flatten(item, depth + 1));
    }
    return result;
  }

  const source = object(value);
  const label = text(source.label) || text(source.name);
  const labelValue = text(source.value);

  if (label && labelValue) {
    result[key(label)] = labelValue;
  }

  for (const [name, field] of Object.entries(source)) {
    if (typeof field === 'string' || typeof field === 'number') {
      result[key(name)] = field;
    } else if (field && typeof field === 'object') {
      Object.assign(result, flatten(field, depth + 1));
    }
  }

  return result;
}

function read(
  sources: DataObject[],
  names: string[],
): string {
  for (const source of sources) {
    for (const name of names) {
      const value = text(source[key(name)]);
      if (value) return value;
    }
  }

  return '';
}

function price(value: string | null): number | null {
  if (!value) return null;

  const cleaned = value
    .trim()
    .replace(/^USD\s*/i, '')
    .replace(/^\$\s*/, '')
    .replace(/,/g, '')
    .trim();

  if (!/^\d+(?:\.\d{1,2})?$/.test(cleaned)) return null;

  const amount = Number(cleaned);

  return Number.isFinite(amount) && amount > 0
    ? amount
    : null;
}

function firstImage(value: unknown): string {
  const entries = Array.isArray(value) ? value : [value];

  for (const entry of entries) {
    const image =
      typeof entry === 'string'
        ? entry.trim()
        : text(object(entry).url) || text(object(entry).src);

    if (
      /^https?:\/\//i.test(image) ||
      (image.startsWith('/') && !image.startsWith('//'))
    ) {
      return image;
    }
  }

  return '';
}

function hasOptions(value: unknown): boolean {
  if (Array.isArray(value)) return value.length > 0;
  return Object.keys(object(value)).length > 0;
}

function temperatureLabel(value: string): string {
  if (/extra[\s-]*low/i.test(value)) return 'Extra Low Temp';
  if (/\blow\b/i.test(value)) return 'Low Temp';
  if (/\bmedium\b/i.test(value)) return 'Medium Temp';
  return value;
}

async function loadProducts(): Promise<{
  products: CatalogProduct[];
  error: string | null;
}> {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        parentId: true,
      },
    });

    const categoryIds = new Set(
      categories
        .filter((category) =>
          /condensing[\s-]*units?/i.test(
            `${category.slug} ${category.name}`,
          ),
        )
        .map((category) => category.id),
    );

    let changed = true;

    while (changed) {
      changed = false;

      for (const category of categories) {
        if (
          category.parentId &&
          categoryIds.has(category.parentId) &&
          !categoryIds.has(category.id)
        ) {
          categoryIds.add(category.id);
          changed = true;
        }
      }
    }

    // Also find explicitly named/typed condensing units when
    // their category slug differs from "condensing-units".
    const records = await prisma.product.findMany({
      where: {
        OR: [
          {
            categoryId: {
              in: Array.from(categoryIds),
            },
          },
          {
            type: {
              contains: 'condensing',
              mode: 'insensitive',
            },
          },
          {
            title: {
              contains: 'condensing unit',
              mode: 'insensitive',
            },
          },
        ],
      },
      orderBy: [
        { title: 'asc' },
        { id: 'asc' },
      ],
      select: {
        id: true,
        slug: true,
        title: true,
        sku: true,
        brand: true,
        price: true,
        images: true,
        badge: true,
        features: true,
        specs: true,
        productOptions: true,
      },
    });

    const products: CatalogProduct[] = records.map((product) => {
      const features = object(product.features);
      const sources = [
        flatten(product.features),
        flatten(product.specs),
      ];

      const rawTemperature =
        read(sources, [
          'temperatureType',
          'temperature',
          'applicationTemperature',
        ]) ||
        product.title.match(
          /extra[\s-]*low\s*temp(?:erature)?|medium\s*temp(?:erature)?|low\s*temp(?:erature)?/i,
        )?.[0] ||
        '';

      let hp =
        read(sources, ['hp', 'horsepower', 'horse power']) ||
        product.title.match(
          /(?:\d+\s+)?\d+(?:[./]\d+)?\s*HP\b/i,
        )?.[0] ||
        '';

      if (/^(standard|unknown|n\/a)$/i.test(hp)) {
        hp = '';
      } else if (hp && !/\bhp\b/i.test(hp)) {
        hp += ' HP';
      }

      const rawCompressor = read(sources, [
        'compressorType',
        'compressor type',
      ]);

      const compressor = /semi[\s-]*hermetic/i.test(rawCompressor)
        ? 'Semi-Hermetic'
        : /scroll/i.test(rawCompressor)
          ? 'Scroll'
          : rawCompressor;

      const variants = features.variants;

      return {
        id: product.id,
        slug: product.slug,
        title: product.title,
        sku: product.sku || '',
        brand:
          product.brand ||
          text(features.vendor) ||
          'Unspecified',
        price: price(product.price),
        image: firstImage(product.images),
        temperature: temperatureLabel(rawTemperature),
        hp,
        voltage: read(sources, [
          'voltage',
          'electrical',
          'power supply',
          'voltage phase',
        ]),
        compressor,
        dimensions: read(sources, [
          'dimensions',
          'overall dimensions',
          'size',
        ]),
        unavailable:
          features.available === false ||
          features.available === 'false' ||
          /out\s*of\s*stock|sold\s*out/i.test(product.badge || ''),
        configurable:
          hasOptions(product.productOptions) ||
          (Array.isArray(variants) && variants.length > 1),
      };
    });

    return { products, error: null };
  } catch (error) {
    console.error('[Condensing catalog]', error);

    return {
      products: [],
      error:
        'The catalog could not be loaded. Please refresh the page or contact our team.',
    };
  }
}

export default async function CondensingUnitsPage() {
  const result = await loadProducts();

  return (
    <CondensingUnitsClient
      products={result.products}
      error={result.error}
    />
  );
}