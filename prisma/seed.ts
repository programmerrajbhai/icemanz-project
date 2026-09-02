import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create Categories
  console.log('📁 Creating categories...');

  const walkInCategory = await prisma.category.upsert({
    where: { slug: 'walk-in-cooler-no-floor' },
    update: {},
    create: {
      name: 'Walk-in Cooler (No Floor)',
      slug: 'walk-in-cooler-no-floor',
    },
  });

  const walkInFloorCategory = await prisma.category.upsert({
    where: { slug: 'walk-in-cooler-with-floor' },
    update: {},
    create: {
      name: 'Walk-in Cooler (With Floor)',
      slug: 'walk-in-cooler-with-floor',
    },
  });

  const freezerCategory = await prisma.category.upsert({
    where: { slug: 'walk-in-freezer' },
    update: {},
    create: {
      name: 'Walk-in Freezer',
      slug: 'walk-in-freezer',
    },
  });

  const refrigerationCategory = await prisma.category.upsert({
    where: { slug: 'refrigeration-equipment' },
    update: {},
    create: {
      name: 'Refrigeration Equipment',
      slug: 'refrigeration-equipment',
    },
  });

  // Create Evaporation Units subcategory
  const evaporationUnitsCategory = await prisma.category.upsert({
    where: { slug: 'evaporation-units' },
    update: {},
    create: {
      name: 'Evaporation Units',
      slug: 'evaporation-units',
      parentId: refrigerationCategory.id,
    },
  });

  console.log('✅ Categories created');

  // Create Walk-in Cooler Products
  console.log('🧊 Creating Walk-in Cooler products...');

  const walkInProducts = [
    {
      title: '6x8 Walk-in Cooler (No Floor) - Indoor',
      slug: '6x8-walk-in-cooler-no-floor-indoor',
      brand: 'ICEMANZ',
      sku: 'WIC-6X8-NF-001',
      badge: 'BESTSELLER',
      description: 'Premium 6x8 walk-in cooler without floor, perfect for indoor installation. Ideal for restaurants, grocery stores, and commercial kitchens.',
      keyFeatures: 'Energy efficient, Easy installation, Temperature range 35°F to 38°F, Remote refrigeration ready',
      condition: 'New',
      type: 'Indoor',
      price: '4999',
      images: [
        '/Walk-in-Cooler-Freezer/NewCooler.jpg',
        '/Walk-in-Cooler-Freezer/category/Box_Only.webp',
      ],
      warranty: ['5 Year Warranty on Panels', '1 Year Parts Warranty'],
      detailedFeatures: [
        '4" thick insulated panels',
        'Cam-lock panel system',
        'Self-closing door with handle',
        'Interior lighting included',
        'Temperature range: 35°F - 38°F',
        'Energy Star rated',
      ],
      specs: {
        dimensions: {
          width: '6 ft',
          length: '8 ft',
          height: '7.5 ft',
        },
        insulation: '4 inch polyurethane foam',
        voltage: '115V/230V',
        refrigerantType: 'R-404A',
      },
      categoryId: walkInCategory.id,
    },
    {
      title: '8x10 Walk-in Cooler (No Floor) - Indoor',
      slug: '8x10-walk-in-cooler-no-floor-indoor',
      brand: 'ICEMANZ',
      sku: 'WIC-8X10-NF-002',
      badge: 'POPULAR',
      description: 'Spacious 8x10 walk-in cooler without floor. Perfect for medium to large commercial operations.',
      keyFeatures: 'Large capacity, Energy efficient, Easy assembly, Commercial grade',
      condition: 'New',
      type: 'Indoor',
      price: '6499',
      images: [
        '/Walk-in-Cooler-Freezer/coolerswithfloor.jpg',
        '/Walk-in-Cooler-Freezer/category/Box_Only.webp',
      ],
      warranty: ['5 Year Warranty on Panels', '1 Year Parts Warranty'],
      detailedFeatures: [
        '4" thick insulated panels',
        'Heavy-duty cam-lock system',
        'Pressure relief vent',
        'Digital thermometer',
        'Vapor barrier',
        'UL listed',
      ],
      categoryId: walkInCategory.id,
    },
    {
      title: '10x12 Walk-in Cooler (No Floor) - Indoor',
      slug: '10x12-walk-in-cooler-no-floor-indoor',
      brand: 'ICEMANZ',
      sku: 'WIC-10X12-NF-003',
      description: 'Extra-large 10x12 walk-in cooler perfect for high-volume storage needs.',
      keyFeatures: 'Extra large capacity, Heavy duty construction, Energy Star rated',
      condition: 'New',
      type: 'Indoor',
      price: '8999',
      images: [
        '/Walk-in-Cooler-Freezer/NewCooler.jpg',
        '/Walk-in-Cooler-Freezer/category/Box_Only.webp',
      ],
      warranty: ['5 Year Warranty on Panels', '2 Year Parts Warranty'],
      detailedFeatures: [
        '4" thick premium insulation',
        'Reinforced floor support',
        'Multiple door options',
        'Interior ramp included',
        'NSF certified',
      ],
      categoryId: walkInCategory.id,
    },
  ];

  for (const product of walkInProducts) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }

  console.log('✅ Walk-in Cooler products created');

  // Create Walk-in Freezer Products
  console.log('❄️ Creating Walk-in Freezer products...');

  const freezerProducts = [
    {
      title: '6x8 Walk-in Freezer - Indoor',
      slug: '6x8-walk-in-freezer-indoor',
      brand: 'ICEMANZ',
      sku: 'WIF-6X8-001',
      badge: 'BESTSELLER',
      description: 'High-quality 6x8 walk-in freezer for commercial use. Temperature range -10°F to 0°F.',
      keyFeatures: 'Heavy duty insulation, Energy efficient, Low temperature capable',
      condition: 'New',
      type: 'Indoor',
      price: '7999',
      images: [
        '/Walk-in-Cooler-Freezer/freezerswithfloor.jpg',
        '/Walk-in-Cooler-Freezer/box-type/walk_in_freezer_1.avif',
      ],
      warranty: ['5 Year Warranty on Panels', '2 Year Compressor Warranty'],
      detailedFeatures: [
        '6" thick insulated panels',
        'Heavy-duty freezer door',
        'Temperature range: -10°F to 0°F',
        'Heated door frame',
        'Interior safety release',
      ],
      categoryId: freezerCategory.id,
    },
    {
      title: '8x10 Walk-in Freezer - Indoor',
      slug: '8x10-walk-in-freezer-indoor',
      brand: 'ICEMANZ',
      sku: 'WIF-8X10-002',
      description: 'Spacious 8x10 walk-in freezer with superior insulation and energy efficiency.',
      keyFeatures: 'Extra insulation, Commercial grade, Low operating costs',
      condition: 'New',
      type: 'Indoor',
      price: '10999',
      images: [
        '/Walk-in-Cooler-Freezer/box-type/walk_in_freezer_1.avif',
        '/Walk-in-Cooler-Freezer/freezerswithfloor.jpg',
      ],
      warranty: ['5 Year Warranty on Panels', '2 Year Compressor Warranty'],
      detailedFeatures: [
        '6" thick premium insulation',
        'Heated floor perimeter',
        'Digital temperature controller',
        'Emergency alarm system',
        'UL and NSF certified',
      ],
      categoryId: freezerCategory.id,
    },
  ];

  for (const product of freezerProducts) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }

  console.log('✅ Walk-in Freezer products created');

  // Create Refrigeration Equipment Products
  console.log('🔧 Creating Refrigeration Equipment products...');

  const equipmentProducts = [
    {
      title: 'Commercial Reach-in Refrigerator - 3 Door',
      slug: 'commercial-reach-in-refrigerator-3-door',
      brand: 'TRUE',
      sku: 'REF-3D-001',
      badge: 'POPULAR',
      description: 'Professional 3-door reach-in refrigerator with stainless steel construction.',
      keyFeatures: 'Energy efficient, Digital controls, Heavy duty casters',
      condition: 'New',
      type: 'Reach-in Refrigerator',
      price: '3499',
      images: [
        '/Walk-in-Cooler-Freezer/category/condensingUnits/TS-MR_XR1-600x600-1.jpg',
      ],
      warranty: ['3 Year Parts & Labor Warranty'],
      detailedFeatures: [
        'Stainless steel interior and exterior',
        '72 cu. ft. capacity',
        'Digital temperature display',
        'Self-closing doors',
        'Adjustable shelves',
      ],
      categoryId: refrigerationCategory.id,
    },
    {
      title: 'Commercial Chest Freezer - 25 Cu Ft',
      slug: 'commercial-chest-freezer-25-cu-ft',
      brand: 'ARCTIC',
      sku: 'CHF-25-001',
      description: 'Large capacity chest freezer perfect for bulk storage.',
      keyFeatures: 'Large capacity, Energy Star rated, Lockable lid',
      condition: 'New',
      type: 'Chest Freezer',
      price: '1999',
      images: [
        '/Walk-in-Cooler-Freezer/category/condensingUnits/TS-MR_XR1-600x600-2.jpg',
      ],
      warranty: ['2 Year Parts & Labor Warranty'],
      detailedFeatures: [
        '25 cubic feet capacity',
        'Manual defrost',
        'Adjustable temperature control',
        'Interior LED lighting',
        'Heavy-duty hinges',
      ],
      categoryId: refrigerationCategory.id,
    },
    {
      title: 'Under Counter Refrigerator - 2 Door',
      slug: 'under-counter-refrigerator-2-door',
      brand: 'ICEMANZ',
      sku: 'UCR-2D-001',
      description: 'Compact under-counter refrigerator ideal for bars and prep stations.',
      keyFeatures: 'Space saving design, Front breathing, Easy access',
      condition: 'New',
      type: 'Under Counter',
      price: '1499',
      images: [
        '/Walk-in-Cooler-Freezer/category/condensingUnits/TS-MR_XR1-600x600-3.jpg',
      ],
      warranty: ['2 Year Parts Warranty'],
      detailedFeatures: [
        'Stainless steel construction',
        'Front-breathing design',
        '12 cu. ft. capacity',
        'Recessed door handles',
        'NSF listed',
      ],
      categoryId: refrigerationCategory.id,
    },
  ];

  for (const product of equipmentProducts) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }

  console.log('✅ Refrigeration Equipment products created');

  // Create Evaporation Units Products
  console.log('💨 Creating Evaporation Units products...');

  const evaporationProducts = [
    {
      title: 'Low Profile Evaporator Unit - 3,000 BTU',
      slug: 'low-profile-evaporator-3000-btu',
      brand: 'IcemanZ Pro',
      sku: 'EVP-LP-3000',
      badge: 'BESTSELLER',
      description: 'Compact low-profile evaporator unit perfect for walk-in coolers. High-efficiency design with minimal ceiling clearance requirements.',
      keyFeatures: 'Low profile design, Energy efficient, Electric defrost, Quiet operation',
      condition: 'New',
      type: 'Low Profile Evaporator',
      price: '599',
      images: [
        '/Walk-in-Cooler-Freezer/category/condensingUnits/TS-MR_XR1-600x600-1.jpg',
        '/Walk-in-Cooler-Freezer/category/condensingUnits/TS-MR_XR1-600x600-2.jpg',
      ],
      warranty: ['2 Year Parts Warranty', '1 Year Labor Warranty'],
      detailedFeatures: [
        '3,000 BTU cooling capacity',
        'Low-profile design for limited headroom',
        'Electric defrost system',
        'High-efficiency EC motor',
        'Stainless steel drain pan',
        'Temperature range: 32°F to 45°F',
        'Pre-wired and ready to install',
        'Includes mounting brackets',
      ],
      specs: {
        capacity: '3,000 BTU/hr',
        application: 'Medium Temperature',
        temperature: '32°F to 45°F',
        voltage: '115V/60Hz',
        phase: 'Single Phase',
        amperage: '2.5A',
        refrigerant: 'R-404A / R-452A compatible',
        dimensions: '36"W x 18"D x 12"H',
        weight: '65 lbs',
        airflow: '1,200 CFM',
        fanMotor: '1/10 HP EC Motor',
        defrost: 'Electric',
      },
      categoryId: evaporationUnitsCategory.id,
    },
    {
      title: 'Medium Temperature Evaporator - 5,500 BTU',
      slug: 'medium-temp-evaporator-5500-btu',
      brand: 'IcemanZ Pro',
      sku: 'EVP-MT-5500',
      badge: 'POPULAR',
      description: 'Medium temperature evaporator unit ideal for walk-in coolers and refrigerated storage rooms. Reliable performance with efficient cooling.',
      keyFeatures: 'Energy Star rated, Auto defrost, High airflow, Durable construction',
      condition: 'New',
      type: 'Medium Temperature Evaporator',
      price: '899',
      images: [
        '/Walk-in-Cooler-Freezer/category/condensingUnits/TS-MR_XR1-600x600-3.jpg',
        '/Walk-in-Cooler-Freezer/category/condensingUnits/TS-MR_XR1-600x600-4.jpg',
      ],
      warranty: ['2 Year Parts Warranty', '1 Year Labor Warranty'],
      detailedFeatures: [
        '5,500 BTU cooling capacity',
        'Suitable for 6x8 to 8x10 coolers',
        'Auto electric defrost with timer',
        'Epoxy-coated aluminum fins',
        'Copper tubing for durability',
        'Energy-efficient EC fans',
        'Easy installation and maintenance',
        'NSF certified',
      ],
      specs: {
        capacity: '5,500 BTU/hr',
        application: 'Medium Temperature',
        temperature: '32°F to 50°F',
        voltage: '115V/60Hz',
        phase: 'Single Phase',
        amperage: '4.2A',
        refrigerant: 'R-404A / R-452A / R-448A',
        dimensions: '42"W x 20"D x 16"H',
        weight: '95 lbs',
        airflow: '2,000 CFM',
        fanMotor: 'Dual 1/8 HP EC Motors',
      },
      categoryId: evaporationUnitsCategory.id,
    },
    {
      title: 'Low Temperature Freezer Evaporator - 8,000 BTU',
      slug: 'low-temp-freezer-evaporator-8000-btu',
      brand: 'IcemanZ Pro',
      sku: 'EVP-LT-8000',
      badge: 'PREMIUM',
      description: 'Heavy-duty low-temperature evaporator designed for walk-in freezers. Handles extreme cold with superior efficiency.',
      keyFeatures: 'Low temperature capable, Heavy duty construction, Electric defrost, Dual fans',
      condition: 'New',
      type: 'Low Temperature Evaporator',
      price: '1,299',
      images: [
        '/Walk-in-Cooler-Freezer/category/condensingUnits/TS-MR_XR1-600x600-5.jpg',
        '/Walk-in-Cooler-Freezer/category/condensingUnits/TS-MR_XR1-600x600-1.jpg',
      ],
      warranty: ['3 Year Parts Warranty', '2 Year Labor Warranty'],
      detailedFeatures: [
        '8,000 BTU cooling capacity',
        'Low temperature: -20°F to 0°F',
        'Heavy-duty freezer grade construction',
        'Electric defrost with hot gas option',
        'Stainless steel drain pan with heater',
        'Dual high-efficiency fans',
        'Suitable for 8x10 to 10x12 freezers',
        'UL and NSF listed',
      ],
      specs: {
        capacity: '8,000 BTU/hr',
        application: 'Low Temperature',
        temperature: '-20°F to 0°F',
        voltage: '208-230V/60Hz',
        phase: 'Single Phase',
        amperage: '6.8A',
        refrigerant: 'R-404A / R-452A / R-448A',
        dimensions: '48"W x 24"D x 18"H',
        weight: '145 lbs',
        airflow: '2,800 CFM',
        fanMotor: 'Dual 1/6 HP Motors',
        defrost: 'Electric / Hot Gas Compatible',
      },
      categoryId: evaporationUnitsCategory.id,
    },
    {
      title: 'Ceiling Mount Evaporator - 4,200 BTU',
      slug: 'ceiling-mount-evaporator-4200-btu',
      brand: 'IcemanZ Pro',
      sku: 'EVP-CM-4200',
      description: 'Ceiling-mounted evaporator unit with sleek design. Perfect for coolers with standard ceiling height.',
      keyFeatures: 'Ceiling mount, Easy installation, Adjustable airflow, Compact design',
      condition: 'New',
      type: 'Ceiling Mount Evaporator',
      price: '749',
      images: [
        '/Walk-in-Cooler-Freezer/category/condensingUnits/TS-MR_XR1-600x600-2.jpg',
        '/Walk-in-Cooler-Freezer/category/condensingUnits/TS-MR_XR1-600x600-3.jpg',
      ],
      warranty: ['2 Year Parts Warranty', '1 Year Labor Warranty'],
      detailedFeatures: [
        '4,200 BTU cooling capacity',
        'Ceiling mount design saves floor space',
        'Adjustable louvers for airflow direction',
        'Corrosion-resistant coating',
        'Easy-access service panel',
        'Pre-charged and tested',
        'Includes mounting hardware',
      ],
      specs: {
        capacity: '4,200 BTU/hr',
        application: 'Medium Temperature',
        temperature: '35°F to 45°F',
        voltage: '115V/60Hz',
        phase: 'Single Phase',
        amperage: '3.5A',
        dimensions: '40"W x 19"D x 14"H',
        weight: '75 lbs',
        airflow: '1,600 CFM',
      },
      categoryId: evaporationUnitsCategory.id,
    },
    {
      title: 'High-Capacity Dual Fan Evaporator - 12,000 BTU',
      slug: 'high-capacity-dual-fan-evaporator-12000-btu',
      brand: 'IcemanZ Pro',
      sku: 'EVP-HC-12000',
      badge: 'NEW',
      description: 'High-capacity evaporator unit with dual fans for large walk-in coolers and commercial cold storage facilities.',
      keyFeatures: 'High capacity, Dual fans, Energy efficient, Commercial grade',
      condition: 'New',
      type: 'High Capacity Evaporator',
      price: '1,799',
      images: [
        '/Walk-in-Cooler-Freezer/category/condensingUnits/TS-MR_XR1-600x600-4.jpg',
        '/Walk-in-Cooler-Freezer/category/condensingUnits/TS-MR_XR1-600x600-5.jpg',
      ],
      warranty: ['3 Year Parts Warranty', '2 Year Labor Warranty'],
      detailedFeatures: [
        '12,000 BTU cooling capacity',
        'Suitable for large coolers (12x14+)',
        'Dual high-efficiency EC fans',
        'Heavy-duty aluminum fin construction',
        'Auto defrost with digital controller',
        'Corrosion-resistant epoxy coating',
        'Low noise operation',
        'Energy Star certified',
      ],
      specs: {
        capacity: '12,000 BTU/hr',
        application: 'Medium Temperature',
        temperature: '32°F to 50°F',
        voltage: '208-230V/60Hz',
        phase: 'Single or Three Phase',
        amperage: '8.5A',
        refrigerant: 'R-404A / R-452A / R-448A / R-513A',
        dimensions: '60"W x 26"D x 20"H',
        weight: '185 lbs',
        airflow: '4,200 CFM',
        fanMotor: 'Dual 1/4 HP EC Motors',
      },
      categoryId: evaporationUnitsCategory.id,
    },
    {
      title: 'Compact Evaporator Unit - 2,000 BTU',
      slug: 'compact-evaporator-2000-btu',
      brand: 'IcemanZ Pro',
      sku: 'EVP-CP-2000',
      description: 'Ultra-compact evaporator perfect for small walk-in coolers, floral coolers, and wine storage rooms.',
      keyFeatures: 'Ultra compact, Quiet operation, Energy saving, Easy maintenance',
      condition: 'New',
      type: 'Compact Evaporator',
      price: '449',
      images: [
        '/Walk-in-Cooler-Freezer/category/condensingUnits/TS-MR_XR1-600x600-1.jpg',
        '/Walk-in-Cooler-Freezer/category/condensingUnits/TS-MR_XR1-600x600-2.jpg',
      ],
      warranty: ['1 Year Parts Warranty', '90 Days Labor Warranty'],
      detailedFeatures: [
        '2,000 BTU cooling capacity',
        'Ideal for 4x6 to 6x6 coolers',
        'Ultra-quiet operation',
        'Compact footprint',
        'Energy-efficient design',
        'Simple plug-and-play installation',
        'Manual defrost',
      ],
      specs: {
        capacity: '2,000 BTU/hr',
        application: 'Medium Temperature',
        temperature: '35°F to 50°F',
        voltage: '115V/60Hz',
        phase: 'Single Phase',
        amperage: '2.0A',
        dimensions: '28"W x 15"D x 10"H',
        weight: '42 lbs',
        airflow: '800 CFM',
      },
      categoryId: evaporationUnitsCategory.id,
    },
  ];

  for (const product of evaporationProducts) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }

  console.log('✅ Evaporation Units products created');

  // Get counts
  const categoryCount = await prisma.category.count();
  const productCount = await prisma.product.count();

  console.log('\n🎉 Seeding completed!');
  console.log(`📊 Summary:`);
  console.log(`   - Categories: ${categoryCount}`);
  console.log(`   - Products: ${productCount}`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
