import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import WalkInCoolerProductClient from './[id]/WalkInCoolerProductClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default async function WalkInCoolerProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug }
  });

  if (!product) {
    // If not found in DB, maybe it's a subcategory? 
    // But user wants real products from server, so if not found, it's 404
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
