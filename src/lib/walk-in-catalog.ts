import prisma from '@/lib/prisma';

type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
};

export type WalkInCatalogProduct = {
  id: string;
  title: string;
  slug: string;
  sku: string;
  brand: string;
  badge: string;
  type: string;
  price: string | null;
  priceValue: number | null;
  images: string[];
  features: Record<string, string>;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
};

export type WalkInCatalogResult = {
  products: WalkInCatalogProduct[];
  error: string | null;
};

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function getWalkInCategoryIds(
  categories: CategoryItem[],
): Set<string> {
  const ids = new Set(
    categories
      .filter((category) =>
        /\bwalk\s*in\b/.test(
          normalize(`${category.slug} ${category.name}`),
        ),
      )
      .map((category) => category.id),
  );

  // Include every descendant, including brand/category nesting.
  let changed = true;

  while (changed) {
    changed = false;

    for (const category of categories) {
      if (
        category.parentId &&
        ids.has(category.parentId) &&
        !ids.has(category.id)
      ) {
        ids.add(category.id);
        changed = true;
      }
    }
  }

  return ids;
}

function getPriceValue(raw: string | null): number | null {
  if (!raw) return null;

  const cleaned = raw
    .replace(/^USD\s*/i, '')
    .replace(/^\$\s*/, '')
    .replace(/,/g, '')
    .trim();

  if (!/^\d+(?:\.\d{1,2})?$/.test(cleaned)) {
    return null;
  }

  const value = Number(cleaned);

  return Number.isFinite(value) && value > 0
    ? value
    : null;
}

function getImages(value: unknown): string[] {
  const entries = Array.isArray(value) ? value : [value];

  return entries
    .map((entry) => {
      if (typeof entry === 'string') {
        return entry.trim();
      }

      if (
        entry &&
        typeof entry === 'object' &&
        !Array.isArray(entry)
      ) {
        const image = entry as Record<string, unknown>;

        if (typeof image.url === 'string') {
          return image.url.trim();
        }

        if (typeof image.src === 'string') {
          return image.src.trim();
        }
      }

      return '';
    })
    .filter(
      (image) =>
        /^https?:\/\//i.test(image) ||
        (image.startsWith('/') && !image.startsWith('//')),
    );
}

function getFeatures(value: unknown): Record<string, string> {
  if (
    !value ||
    typeof value !== 'object' ||
    Array.isArray(value)
  ) {
    return {};
  }

  const source = value as Record<string, unknown>;
  const result: Record<string, string> = {};

  for (const key of [
    'size',
    'floorType',
    'walkInType',
    'refrigerationType',
  ]) {
    const field = source[key];

    if (typeof field === 'string' && field.trim()) {
      result[key] = field.trim();
    }
  }

  return result;
}

export async function getWalkInCatalog(): Promise<WalkInCatalogResult> {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        parentId: true,
      },
    });

    const categoryIds = getWalkInCategoryIds(categories);

    if (categoryIds.size === 0) {
      console.warn(
        '[Walk-in catalog] No Walk-in category found in the connected database.',
      );

      return {
        products: [],
        error: null,
      };
    }

    const records = await prisma.product.findMany({
      where: {
        categoryId: {
          in: Array.from(categoryIds),
        },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        sku: true,
        brand: true,
        badge: true,
        type: true,
        price: true,
        images: true,
        features: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: [
        { title: 'asc' },
        { id: 'asc' },
      ],
    });

    const products: WalkInCatalogProduct[] = records.map(
      (product) => {
        const priceValue = getPriceValue(product.price);

        return {
          id: product.id,
          title: product.title,
          slug: product.slug,
          sku: product.sku || '',
          brand: product.brand || '',
          badge: product.badge || '',
          type: product.type || '',
          price:
            priceValue === null
              ? null
              : String(priceValue),
          priceValue,
          images: getImages(product.images),
          features: getFeatures(product.features),
          category: product.category,
        };
      },
    );

    return {
      products,
      error: null,
    };
  } catch (error) {
    console.error('[Walk-in catalog] Database query failed:', error);

    return {
      products: [],
      error:
        'The product catalog is temporarily unavailable. Please refresh the page or contact our team.',
    };
  }
}