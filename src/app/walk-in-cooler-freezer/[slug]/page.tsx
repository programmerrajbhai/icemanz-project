import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import WalkInCoolerProductClient from './[id]/WalkInCoolerProductClient';
import AstraProductClient from './[id]/AstraProductClient';
import WalkInCoolerFreezerClient from '../WalkInCoolerFreezerClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { mockProducts, getMockProductsByCategory, getMockProductBySlug } from '@/lib/mock-products';

const subcategoryTitles: Record<string, string> = {
  'walk-in-cooler-no-floor': 'Walk-In Cooler',
  'walk-in-freezer-with-floor': 'Walk-In Freezer',
  'walk-in-combo-cooler-freezer': 'Walk-In Combo (Cooler & Freezer)'
};

const slugToWalkInType: Record<string, string> = {
  'walk-in-cooler-no-floor': 'Cooler (Refrigerator) No Floor',
  'walk-in-cooler-with-floor': 'Cooler (Refrigerator) with Floor',
  'walk-in-freezer-with-floor': 'Freezer with Floor',
  'walk-in-combo-cooler-freezer': 'Combo (Cooler & Freezer)'
};

export const dynamic = 'force-dynamic';

export default async function WalkInCoolerSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Check if this is a subcategory page
  if (subcategoryTitles[slug]) {
    // Get all walk-in cooler products with category included
    let allWalkInProducts = [];
    let useMockData = false;

    try {
      allWalkInProducts = await prisma.product.findMany({
        where: {
          category: {
            slug: { in: ['walk-in-cooler-no-floor', 'walk-in-cooler-freezer', 'walk-in-cooler-with-floor', 'walk-in-freezer-with-floor', 'walk-in-combo-cooler-freezer'] }
          }
        },
        select: {
          id: true,
          title: true,
          price: true,
          images: true,
          slug: true,
          brand: true,
          features: true,
          category: {
            select: { id: true, slug: true, name: true }
          }
        },
        orderBy: [
          { brand: 'asc' },
          { title: 'asc' }
        ],
        take: 200,
      });
    } catch (error) {
      console.error('Database connection error, using mock data:', error);
      // Use mock data if database is not available
      useMockData = true;
      allWalkInProducts = mockProducts;
    }

    // Filter products for the current subcategory: first check category slug, then walk-in type
    const targetWalkInType = slugToWalkInType[slug];
    const products = allWalkInProducts.filter(product => {
      // Exclude ICEMANZ products from walk-in-cooler-no-floor page
      if (slug === 'walk-in-cooler-no-floor' && product.brand === 'ICEMANZ') {
        return false;
      }

      // Exclude Dade, Mr. Winter, and Norlake products from walk-in-freezer-with-floor page
      if (slug === 'walk-in-freezer-with-floor' && ['Dade', 'Mr. Winter', 'Norlake'].includes(product.brand || '')) {
        return false;
      }

      // First: check if product's category slug matches exactly
      if (product.category?.slug === slug) {
        return true;
      }

      // Fallback: check if walk-in type matches from features or title
      let walkInType = (product.features as any)?.walkInType;
      if (!walkInType) {
        // Try to extract walk-in type from title
        if (product.title.includes('Cooler')) {
          if (product.title.includes('No Floor') || product.title.includes('Floorless')) {
            walkInType = 'Cooler (Refrigerator) No Floor';
          } else {
            walkInType = 'Cooler (Refrigerator) with Floor';
          }
        } else if (product.title.includes('Freezer')) {
          walkInType = 'Freezer with Floor';
        } else if (product.title.includes('Combo')) {
          walkInType = 'Combo (Cooler & Freezer)';
        }
      }
      return walkInType === targetWalkInType;
    });

    return (
      <main className="min-h-screen bg-white selection:bg-primary selection:text-white">
        <Header />
        <div className="pt-24 lg:pt-32">
          <WalkInCoolerFreezerClient
            initialProducts={products}
            title={subcategoryTitles[slug]}
          />
        </div>
      </main>
    );
  }

  // Otherwise, treat as product page
  let product = null;
  let useMockData = false;

  try {
    product = await prisma.product.findUnique({
      where: { slug }
    });
  } catch (error) {
    console.error('Database connection error, using mock data:', error);
    useMockData = true;
    product = getMockProductBySlug(slug);
  }

  if (!product) {
    notFound();
  }

  // Fetch related products from the same category
  let relatedProducts: any[] = [];
  if (product.categoryId) {
    try {
      if (!useMockData) {
        relatedProducts = await prisma.product.findMany({
          where: {
            categoryId: product.categoryId,
            id: { not: product.id }
          },
          take: 8,
          select: {
            id: true,
            title: true,
            price: true,
            images: true,
            slug: true,
            brand: true,
            category: { select: { id: true, slug: true, name: true } }
          },
          orderBy: { title: 'asc' }
        });
      } else {
        relatedProducts = mockProducts.filter(
          p => p.categoryId === product?.categoryId && p.id !== product?.id
        ).slice(0, 8);
      }
    } catch (error) {
      console.error('Error fetching related products, using mock data:', error);
      relatedProducts = mockProducts.filter(
        p => p.categoryId === product?.categoryId && p.id !== product?.id
      ).slice(0, 8);
    }
  }

  // Map the product to the format expected by the client component
  const productData = {
    ...product,
    description: product.description || '',
    detailedFeatures: product.detailedFeatures || [],
    keyFeatures: product.keyFeatures || '',
    condition: product.condition || '',
    type: product.type || '',
    badge: product.badge || 'IN STOCK',
    price: product.price || '0',
    images: product.images.length > 0 ? product.images : ['/placeholder.png'],
    specs: product.specs || null,
    documents: product.documents || null,
    features: product.features || null
  };

  const serializedProduct = JSON.parse(JSON.stringify(productData));
  const serializedRelated = JSON.parse(JSON.stringify(relatedProducts));

  // Check if this is an Astra brand product
  const brand = (product.brand || '').toLowerCase();
  const isAstra = brand === 'astra' || (product.title && product.title.toLowerCase().startsWith('astra'));

  if (isAstra) {
    return (
      <AstraProductClient
        product={serializedProduct}
        relatedProducts={serializedRelated}
      />
    );
  }

  return (
    <>
      <WalkInCoolerProductClient
        product={serializedProduct}
        relatedProducts={serializedRelated}
      />
    </>
  );
}
