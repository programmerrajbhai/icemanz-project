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

  // Fetch related products from the same category
  let relatedProducts: any[] = [];
  if (product.categoryId) {
    relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id }
      },
      take: 20,
      include: { category: true }
    });

    // If we don't have enough, fetch other walk-in products
    if (relatedProducts.length < 10) {
      const moreProducts = await prisma.product.findMany({
        where: {
          id: { notIn: [product.id, ...relatedProducts.map(p => p.id)] },
          title: { contains: 'Walk-In', mode: 'insensitive' }
        },
        take: 20 - relatedProducts.length,
        include: { category: true }
      });
      relatedProducts = [...relatedProducts, ...moreProducts];
    }
  }

  // Map the product to the format expected by the client component
  const productData = {
    ...product,
    description: product.description || 'Quick Ship Indoor Walk-In Cooler, 6\' W x 6\' L x 7\'-2 1/4" H, Without Floor, 4" thick AK-XPS4 insulation providing R-29 for coolers and R-32 for freezers, ceiling & doors, insulation with 50 Year R-value warranty, 26 gauge stucco embossed corrosion resistant acrylic coated Acrylume on all interior & exterior surfaces, NSF vinyl screed, flush self-closing door, digital LED thermometer with pilot light switch, super cam-rise spring assisted hinges & door closer, ships in 48 hours - subject to terms & conditions, UL, Made in USA',
    detailedFeatures: (product.detailedFeatures && Array.isArray(product.detailedFeatures) && product.detailedFeatures.length > 0) ? product.detailedFeatures : [
      '4" Thick AK-XPS4 insulation, providing R-29 for coolers and R-32 for freezers',
      '26 Gauge Acrylume® coated corrosion resistant stucco embossed Galvalume on all interior and exterior surfaces',
      '30"W x 76"H or 36"W x 76"H flush mounted door with spring actuated door closer',
      '2 Super cam-rise spring assisted hinges',
      'Deadbolt keyed handle latch',
      'Interior safety lock release handle',
      'Digital LED thermometer with on and off pilot light switch',
      'Vapor proof light fixture centered on interior door jamb',
      'Floorless walk-ins have NSF vinyl screed'
    ],
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
    documents: (product.documents && Array.isArray(product.documents) && product.documents.length > 0) ? product.documents : [
      { name: 'Spec Sheet', url: 'https://cdn.shopify.com/s/files/1/0379/1801/5627/files/amerikooler_qc060672n.pdf?v=1704371062' },
      { name: 'Warranty', url: 'https://cdn.shopify.com/s/files/1/0719/2369/5846/files/LIMITEDPANELWARRANTY.pdf?v=1736803042' },
      { name: 'About Amerikooler', url: 'https://cdn.shopify.com/s/files/1/0719/2369/5846/files/Company-Material-AboutUs.pdf?v=1736802546' },
      { name: 'California 65 Statement', url: 'https://cdn.shopify.com/s/files/1/0719/2369/5846/files/Atlantic_California_65_Statement.pdf.pdf?v=1773411453' }
    ]
  };

  return (
    <>
      <WalkInCoolerProductClient
        product={JSON.parse(JSON.stringify(productData))}
        relatedProducts={JSON.parse(JSON.stringify(relatedProducts))}
      />
    </>
  );
}
