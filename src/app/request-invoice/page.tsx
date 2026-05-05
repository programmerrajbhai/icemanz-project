import prisma from '@/lib/prisma';
import RequestInvoiceClient from './RequestInvoiceClient';
import { notFound } from 'next/navigation';

// Category mapping for alternate products
const getAlternateCategorySlug = (slug: string): string | null => {
  const mappings: Record<string, string> = {
    'condensing-units': 'evaporation-units',
    'evaporation-units': 'condensing-units',
    'scroll-compressor': 'low-profile-evaporator',
    'low-profile-evaporator': 'scroll-compressor',
    'semi-hermetic': 'reach-in-evaporator',
    'reach-in-evaporator': 'semi-hermetic',
  };
  return mappings[slug] || null;
};

export default async function RequestInvoicePage({
  searchParams,
}: {
  searchParams: Promise<{ productId?: string }>
}) {
  const { productId } = await searchParams;

  let initialAddedProduct = null;
  let categoryId = null;
  let alternateCategoryId = null;
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

      // Find alternate category
      if (product.category) {
        // First try mapping the current category's slug
        let alternateSlug = getAlternateCategorySlug(product.category.slug);
        
        // If not found, check parent category
        if (!alternateSlug && product.category.parentId) {
          const parentCategory = await prisma.category.findUnique({
            where: { id: product.category.parentId },
            select: { slug: true }
          });
          if (parentCategory) {
            alternateSlug = getAlternateCategorySlug(parentCategory.slug);
          }
        }

        if (alternateSlug) {
          // Find the alternate category
          const alternateCategory = await prisma.category.findFirst({
            where: { slug: alternateSlug }
          });
          if (alternateCategory) {
            alternateCategoryId = alternateCategory.id;
          }
        }
      }
    }
  }

  // Fetch products for the suggested sidebar
  let dbProducts = [];

  if (alternateCategoryId) {
    // If we found an alternate category, use it for suggestions
    dbProducts = await prisma.product.findMany({
      where: {
        categoryId: alternateCategoryId,
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
