import prisma from '@/lib/prisma';
import RequestInvoiceClient from './RequestInvoiceClient';
import { notFound } from 'next/navigation';

async function getAlternateCategoryIds(categoryId: string): Promise<string[] | null> {
  const allCategories = await prisma.category.findMany();

  let current = allCategories.find(c => c.id === categoryId);
  if (!current) return null;

  // Find profile level and top level
  let profileLevel = null;
  let topLevel = current;

  if (current.parentId !== null) {
    let parent = allCategories.find(c => c.id === current.parentId);
    if (parent && parent.parentId !== null) {
      // current is level 3 (e.g. Scroll Compressor)
      profileLevel = parent;
      topLevel = allCategories.find(c => c.id === parent.parentId) || topLevel;
    } else {
      // current is level 2
      profileLevel = current;
      topLevel = parent || topLevel;
    }
  }

  // Determine alternate top level
  let altTopLevelName = null;
  if (topLevel.name === 'Condensing Units') altTopLevelName = 'Evaporation Units';
  else if (topLevel.name === 'Evaporation Units') altTopLevelName = 'Condensing Units';

  if (!altTopLevelName) return null;

  const altTopLevel = allCategories.find(c => c.name === altTopLevelName);
  if (!altTopLevel) return null;

  let altProfileCategory = null;
  if (profileLevel) {
    if (profileLevel.name.includes('Low Profile')) {
      const altName = altTopLevelName === 'Evaporation Units' ? 'Low Profile Evaporator' : 'Low Profile';
      altProfileCategory = allCategories.find(c => c.name === altName && c.parentId === altTopLevel.id);
    } else if (profileLevel.name.includes('Medium Profile')) {
      const altName = altTopLevelName === 'Evaporation Units' ? 'Medium Profile' : 'Medium Profile (Scroll Compressor)';
      altProfileCategory = allCategories.find(c => c.name === altName && c.parentId === altTopLevel.id);
    }
  }

  const targetCategory = altProfileCategory || altTopLevel;

  // Get all descendent category IDs so we can fetch all products under it
  const ids = [targetCategory.id];
  const children = allCategories.filter(c => c.parentId === targetCategory.id);
  ids.push(...children.map(c => c.id));

  // Get grandchildren if any
  for (const child of children) {
    const grandchildren = allCategories.filter(c => c.parentId === child.id);
    ids.push(...grandchildren.map(c => c.id));
  }

  return ids;
}

export default async function RequestInvoicePage({
  searchParams,
}: {
  searchParams: Promise<{ productId?: string }>
}) {
  const { productId } = await searchParams;

  let initialAddedProduct = null;
  let categoryId = null;
  let alternateCategoryIds: string[] | null = null;
  let initialCategory = null;

  if (productId) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: {
          select: { id: true, name: true, slug: true, parentId: true }
        }
      }
    });

    if (product) {
      categoryId = product.categoryId;
      initialCategory = product.category;
      initialAddedProduct = {
        id: product.id,
        brand: product.category?.name || 'ICEMANZ',
        title: product.title,
        image: product.images[0] || '/Walk-in-Cooler-Freezer/combounits.jpg',
        rating: 5,
        reviews: 0,
        price: product.price ? (product.price.startsWith('$') ? product.price : `$${product.price}`) : 'Price on Request',
        href: '#'
      };

      if (product.categoryId) {
        alternateCategoryIds = await getAlternateCategoryIds(product.categoryId);
      }
    }
  }

  // Fetch products for the suggested sidebar
  let dbProducts = [];

  if (alternateCategoryIds && alternateCategoryIds.length > 0) {
    // If we found alternate categories, use them for suggestions
    dbProducts = await prisma.product.findMany({
      where: {
        categoryId: { in: alternateCategoryIds },
        ...(productId ? { id: { not: productId } } : {})
      },
      take: 6,
      select: {
        id: true,
        title: true,
        images: true,
        price: true,
        category: { select: { name: true } }
      }
    });
  } else if (categoryId) {
    // Fallback to same category if no alternate found
    dbProducts = await prisma.product.findMany({
      where: {
        categoryId: categoryId,
        ...(productId ? { id: { not: productId } } : {})
      },
      take: 6,
      select: {
        id: true,
        title: true,
        images: true,
        price: true,
        category: { select: { name: true } }
      }
    });
  } else {
    // Default to latest products
    dbProducts = await prisma.product.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        images: true,
        price: true,
        category: { select: { name: true } }
      }
    });
  }

  const initialSuggestedProducts = dbProducts
    .filter(p => p.id !== productId)
    .map((p, i) => ({
      id: p.id,
      brand: p.category?.name || 'ICEMANZ',
      title: p.title,
      image: p.images[0] || `/slider/s_${(i % 3) + 1}.jpeg`,
      rating: 4 + (i % 2),
      reviews: 100 + (i * 23),
      price: p.price ? (p.price.startsWith('$') ? p.price : `$${p.price}`) : 'Price on Request',
      href: '#'
    }));

  return (
    <RequestInvoiceClient
      initialAddedProduct={initialAddedProduct}
      initialSuggestedProducts={initialSuggestedProducts}
    />
  );
}
