import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import WalkInCoolerProductClient from './WalkInCoolerProductClient';

// Mock data for fallback when not in database
const mockProductsDetails: Record<string, any> = {
  '1': {
    id: '1',
    title: 'Astra 6 x 6 Walk-In Cooler No Floor',
    slug: 'astra-6-x-6-walk-in-cooler-no-floor',
    price: '2,903.00',
    images: [
      '/Walk-in-Cooler-Freezer/walkincoolers.jpg',
      '/Walk-in-Cooler-Freezer/box-type/walk_in_cooler_1.avif',
      '/Walk-in-Cooler-Freezer/box-type/walk_in_combo_1.avif',
      '/Walk-in-Cooler-Freezer/Layout-CoolerFreezer.webp'
    ],
    badge: 'Best Seller',
    description: 'Astra Walk-In Coolers are designed for durability and efficiency. This 6x6 model without floor is perfect for existing concrete floors.',
    keyFeatures: 'High-density insulation, Easy assembly, Energy efficient',
    condition: 'New',
    type: 'Cooler',
    warranty: ['15 Year Panel Warranty', '1 Year Parts Warranty'],
    detailedFeatures: [
      '4" Thick Foamed-In-Place Polyurethane Insulation',
      'Cam-Lock Panels, Tongue & Groove Design',
      '24 Gauge Pre-Painted White Galvanized Steel',
      'R27 for Coolers',
      'CFC and HFC Free Materials',
      '10 Year Panel Warranty'
    ],
    specs: [
      { label: 'Dimensions', value: '6\' x 6\' x 7\' 6"' },
      { label: 'Floor', value: 'None' },
      { label: 'Application', value: 'Indoor/Outdoor' }
    ],
    documents: [
      { name: 'Installation Manual', url: '#' },
      { name: 'Specifications Sheet', url: '#' }
    ],
    productOptions: [
      {
        label: 'Layout',
        name: 'layout',
        options: [
          { label: '1A', price: '' },
          { label: '1A1B', price: '' },
          { label: '1BHinge Side (From Exterior)', price: '' }
        ]
      },
      {
        label: 'Door Variations',
        name: 'door',
        options: [
          { label: '30" Wide Door' },
          { label: '36" Wide Door' }
        ]
      },
      {
        label: 'Hinge Side',
        name: 'hinge',
        options: [
          { label: 'Hinged on Right' },
          { label: 'Hinged on Left' }
        ]
      },
      {
        label: 'LED Lights',
        name: 'led',
        options: [
          { label: 'No LED Lights' },
          { label: '4ft LED Light', price: '$125' }
        ]
      }
    ],
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
      ],
      remote: [
        'Includes Condensing Units And Evaporators',
        'Cooler And Freezer Available (208-230V, Hard Wire)',
        '1 Year Compressor And Parts Warranty',
        'Pre-Mounted Expansion Valve And Solenoid Valve',
        'Indoor Or Outdoor (Requires A Refrigeration Technician)'
      ]
    },
    faqs: [
      {
        question: 'What is a walk-in cooler or freezer?',
        answer: 'A walk-in cooler or freezer is a large, refrigerated room designed to store perishable items like food or beverages at consistent temperatures. They are commonly used in restaurants, supermarkets, and warehouses.'
      },
      {
        question: 'What sizes are available for walk-in coolers?',
        answer: 'Walk-in coolers come in various sizes, ranging from compact units for small kitchens to large-scale units for warehouses. Common sizes include 5\'x6\', 6\'x8\', and 10\'x12\'. Custom sizes are also available.'
      },
      {
        question: 'What are the benefits of a walk-in cooler?',
        answer: 'Walk-in coolers help maintain consistent temperatures, reduce food spoilage, and provide ample storage for bulk goods. They also improve operational efficiency in commercial kitchens.'
      },
      {
        question: 'How do I maintain a walk-in cooler?',
        answer: 'Regular maintenance includes cleaning the condenser coils, checking door seals, and monitoring temperature settings. Proper upkeep extends the lifespan and efficiency of your unit.'
      },
      {
        question: 'Are walk-in coolers energy-efficient?',
        answer: 'Modern walk-in coolers are designed with energy-efficient components, such as insulated panels and energy-saving compressors, to minimize energy consumption while maintaining optimal cooling performance.'
      }
    ]
  },
  '2': {
    id: '2',
    title: 'Astra 6 x 8 Walk-In Cooler No Floor',
    slug: 'astra-6-x-8-walk-in-cooler-no-floor',
    price: '3,156.00',
    images: [
      '/Walk-in-Cooler-Freezer/walkincoolers.jpg',
      '/Walk-in-Cooler-Freezer/box-type/walk_in_freezer_1.avif',
      '/Walk-in-Cooler-Freezer/box-type/beer_cave.avif',
      '/Walk-in-Cooler-Freezer/Layout-CoolerFreezer.webp'
    ],
    badge: 'Best Seller',
    description: 'Astra Walk-In Coolers are designed for durability and efficiency. This 6x8 model without floor is perfect for existing concrete floors.',
    keyFeatures: 'High-density insulation, Easy assembly, Energy efficient',
    condition: 'New',
    type: 'Cooler',
    warranty: ['15 Year Panel Warranty', '1 Year Parts Warranty'],
    detailedFeatures: [
      '4" thick insulation',
      'Cam-lock construction',
      'Heavy-duty door hardware',
      'NSF Certified',
      'UL Listed'
    ],
    specs: [
      { label: 'Dimensions', value: '6\' x 8\' x 7\' 6"' },
      { label: 'Floor', value: 'None' },
      { label: 'Application', value: 'Indoor/Outdoor' }
    ],
    documents: [
      { name: 'Installation Manual', url: '#' },
      { name: 'Specifications Sheet', url: '#' }
    ]
  },
  '3': {
    id: '3',
    title: 'Astra 6 x 6 Walk-In Cooler with Floor',
    slug: 'astra-6-x-6-walk-in-cooler-with-floor',
    price: '3,165.00',
    images: [
      '/Walk-in-Cooler-Freezer/coolerswithfloor.jpg',
      '/Walk-in-Cooler-Freezer/box-type/custom_walk_in_cooler_48458996-e588-449c-b300-188f07f6326d.avif',
      '/Walk-in-Cooler-Freezer/box-type/cold_refrigerated_warehouse.webp',
      '/Walk-in-Cooler-Freezer/Layout-CoolerFreezer.webp'
    ],
    badge: 'Popular',
    description: 'Astra Walk-In Coolers are designed for durability and efficiency. This 6x6 model includes a heavy-duty floor for better insulation.',
    keyFeatures: 'Includes floor, High-density insulation, Easy assembly',
    condition: 'New',
    type: 'Cooler',
    warranty: ['15 Year Panel Warranty', '1 Year Parts Warranty'],
    detailedFeatures: [
      '4" thick insulation',
      'Cam-lock construction',
      'Heavy-duty door hardware',
      'Reinforced floor panels',
      'NSF Certified'
    ],
    specs: [
      { label: 'Dimensions', value: '6\' x 6\' x 7\' 6"' },
      { label: 'Floor', value: 'Included' },
      { label: 'Application', value: 'Indoor' }
    ],
    documents: [
      { name: 'Installation Manual', url: '#' },
      { name: 'Specifications Sheet', url: '#' }
    ]
  }
};

export default async function ProductDetailsPage({ params }: { params: Promise<{ slug: string, id: string }> }) {
  const { slug, id } = await params;

  // 1. Try to fetch from database
  let product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: {
        include: {
          parent: {
            include: { parent: true }
          }
        }
      }
    }
  });

  // 2. If not found in DB, check mock data
  if (!product && mockProductsDetails[id]) {
    product = mockProductsDetails[id];
  }

  if (!product) {
    notFound();
  }

  // Fetch related products
  let relatedProducts: any[] = [];
  if (product.categoryId) {
    // Try to fetch from the same category first
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
  } else {
    // Fallback related products from mock data
    relatedProducts = Object.values(mockProductsDetails)
      .filter(p => p.id !== id)
      .slice(0, 20);
  }

  return (
    <WalkInCoolerProductClient
      product={JSON.parse(JSON.stringify(product))}
      relatedProducts={JSON.parse(JSON.stringify(relatedProducts))}
    />
  );
}
