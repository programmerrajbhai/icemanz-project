import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import WalkInCoolerProductClient from './[id]/WalkInCoolerProductClient';
import WalkInCoolerFreezerClient from '../WalkInCoolerFreezerClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const subcategoryTitles: Record<string, string> = {
  'walk-in-cooler-no-floor': 'Walk-In Cooler No Floor',
  'walk-in-cooler-with-floor': 'Walk-In Cooler with Floor',
  'walk-in-freezer-with-floor': 'Walk-In Freezer With Floor',
  'walk-in-combo-cooler-freezer': 'Walk-In Combo (Cooler & Freezer)'
};

export const dynamic = 'force-dynamic';

export default async function WalkInCoolerSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Check if this is a subcategory page
  if (subcategoryTitles[slug]) {
    let products = await prisma.product.findMany({
      where: {
        category: {
          slug: slug
        }
      }
    });

    // Fallback: If no products found in the specific subcategory,
    // load the original products from the main 'walk-in-cooler-freezer' category
    // or the 'walk-in-cooler-no-floor' category as requested ("ager product guloi show korby")
    if (products.length === 0) {
      products = await prisma.product.findMany({
        where: {
          category: {
            slug: 'walk-in-cooler-no-floor'
          }
        }
      });
    }

    return (
      <main className="min-h-screen bg-white selection:bg-primary selection:text-white">
        <Header />
        <div className="pt-24 lg:pt-32">
          <WalkInCoolerFreezerClient
            initialProducts={products}
            title={subcategoryTitles[slug]}
          />
        </div>
        <Footer />
      </main>
    );
  }

  // Otherwise, treat as product page
  const product = await prisma.product.findUnique({
    where: { slug }
  });

  if (!product) {
    notFound();
  }

  // Fetch related products from the same category only
  let relatedProducts: any[] = [];
  if (product.categoryId) {
    relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id }
      },
      take: 5,
      include: { category: true }
    });
  }

  // Map the product to the format expected by the client component
  const productData = {
    ...product,
    description: product.description || undefined,
    keyFeatures: product.keyFeatures || undefined,
    condition: product.condition || undefined,
    type: product.type || undefined,
    badge: product.badge || 'IN STOCK',
    price: product.price || '0',
    images: product.images.length > 0 ? product.images : ['/placeholder.png'],
    features: {
      panels: [
        '4" Thick Foamed-In-Place Polyurethane Insulation',
        'Cam-Lock Panels, Tongue & Groove Design',
        '24 Gauge Pre-Painted White Galvanized Steel',
        'R27 for Coolers and R33 for Freezers',
        'CFC and HFC Free Materials',
        '10 Year Panel Warranty'
      ],
      doors: [
        '30" or 36" wide doors (left or right hinged)',
        'Self-Closing, Flush-Mounted Doors',
        'Keyed Locking Door Handle',
        '120V/1P/1A Heating Wire and Pressure Relief Vent on Freezers',
        'Heavy-Duty Hinges and Durable Handles'
      ],
      topMount: [
        'Self-Contained Package (Includes Condensing Unit And Evaporator)',
        'Cooler And Freezer Available (Indoor Or Outdoor - 208)',
        '230V, Hard Wire, R448A Refrigerant',
        '1 Year Compressor And Parts Warranty',
        '1-Year Labor Warranty',
        'NSF And UL Listed, EPA Registered',
        'No Need For Refrigeration Technician (Easy Install)'
      ]
    },
    specs: [
      { label: 'Brand', value: 'ASTRA' },
      { label: 'Condition', value: 'New' },
      { label: 'Lead Time', value: 'Usually Ships in 2 - 5 Days' }
    ],
    documents: [
      { name: 'Installation Manual', url: '#' },
      { name: 'Specifications Sheet', url: '#' }
    ]
  };

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <WalkInCoolerProductClient
        product={JSON.parse(JSON.stringify(productData))}
        relatedProducts={JSON.parse(JSON.stringify(relatedProducts))}
      />
      <Footer />
    </main>
  );
}
