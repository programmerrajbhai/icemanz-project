import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// All 35 Turbo Air Condensing Units from Atlantic SE
const turboAirProducts = [
  // Page 1 (20 products)
  { title: "Turbo Air TS040MR404A2 4 HP Extended Medium Temp Outdoor Condensing Unit", price: "4036.00", sku: "TS040MR404A2" },
  { title: "Turbo Air TS020MR404A2A 2 HP Extended Medium Temp Outdoor Condensing Unit", price: "3246.00", sku: "TS020MR404A2A" },
  { title: "Turbo Air TS008MR404A2 3/4 HP Extended Medium Temp Outdoor Condensing Unit", price: "2582.00", sku: "TS008MR404A2" },
  { title: "Turbo Air TS030MR404A2 3 HP Extended Medium Temp Outdoor Condensing Unit", price: "3599.00", sku: "TS030MR404A2" },
  { title: "Turbo Air TS010MR404A2 1 HP Extended Medium Temp Outdoor Condensing Unit", price: "2896.00", sku: "TS010MR404A2" },
  { title: "Turbo Air TS015XR404A2 1.5 HP Extra Low Temp Outdoor Condensing Unit", price: "3614.00", sku: "TS015XR404A2" },
  { title: "Turbo Air TS050MR404A2A 5 HP Extended Medium Temp Outdoor Condensing Unit", price: "4425.00", sku: "TS050MR404A2A" },
  { title: "Turbo Air TS015MR404A3A 1.5 HP Extended Medium Temp Outdoor Condensing Unit", price: "3184.00", sku: "TS015MR404A3A" },
  { title: "Turbo Air TS030XR404A3A 3 HP Extra Low Temp Outdoor Condensing Unit", price: "4001.00", sku: "TS030XR404A3A" },
  { title: "Turbo Air TS020XR404A2A 2 HP Extra Low Temp Outdoor Condensing Unit", price: "3804.00", sku: "TS020XR404A2A" },
  { title: "Turbo Air TS015XR404A3 1.5 HP Extra Low Temp Outdoor Condensing Unit", price: "3614.00", sku: "TS015XR404A3" },
  { title: "Turbo Air TS050MR404A3A 5 HP Extended Medium Temp Outdoor Condensing Unit", price: "4353.00", sku: "TS050MR404A3A" },
  { title: "Turbo Air TS030MR404A3 3 HP Extended Medium Temp Outdoor Condensing Unit", price: "3659.00", sku: "TS030MR404A3" },
  { title: "Turbo Air TS015MR404A2A 1.5 HP Extended Medium Temp Outdoor Condensing Unit", price: "3090.00", sku: "TS015MR404A2A" },
  { title: "Turbo Air TS006MR404A2 1/2 HP Extended Medium Temp Outdoor Condensing Unit", price: "2445.00", sku: "TS006MR404A2" },
  { title: "Turbo Air TS100XR404A3 10 HP Extra Low Temp Outdoor Condensing Unit", price: "11068.00", sku: "TS100XR404A3" },
  { title: "Turbo Air TS075XR404A3A 7.5 HP Extra Low Temp Outdoor Condensing Unit", price: "8782.00", sku: "TS075XR404A3A" },
  { title: "Turbo Air TS030XR404A2A 3 HP Extra Low Temp Outdoor Condensing Unit", price: "4001.00", sku: "TS030XR404A2A" },
  { title: "Turbo Air TS025XR404A3A 2.5 HP Extra Low Temp Outdoor Condensing Unit", price: "3894.00", sku: "TS025XR404A3A" },
  { title: "Turbo Air TS060XR404A3A 6 HP Extra Low Temp Outdoor Condensing Unit", price: "5564.00", sku: "TS060XR404A3A" },
  
  // Page 2 (15 products)
  { title: "Turbo Air TS008XR404A2 3/4 HP Extra Low Temp Outdoor Condensing Unit", price: "3416.00", sku: "TS008XR404A2" },
  { title: "Turbo Air TS040XR404A3A 4 HP Extra Low Temp Outdoor Condensing Unit", price: "4682.00", sku: "TS040XR404A3A" },
  { title: "Turbo Air TS050XR404A3A 5 HP Extra Low Temp Outdoor Condensing Unit", price: "5126.00", sku: "TS050XR404A3A" },
  { title: "Turbo Air TS010XR404A2A 1 HP Extra Low Temp Outdoor Condensing Unit", price: "3563.00", sku: "TS010XR404A2A" },
  { title: "Turbo Air TS020MR404A3 2 HP Extended Medium Temp Outdoor Condensing Unit", price: "3306.00", sku: "TS020MR404A3" },
  { title: "Turbo Air TS040MR404A3 4 HP Extended Medium Temp Outdoor Condensing Unit", price: "4096.00", sku: "TS040MR404A3" },
  { title: "Turbo Air TS006XR404A2 1/2 HP Extra Low Temp Outdoor Condensing Unit", price: "3187.00", sku: "TS006XR404A2" },
  { title: "Turbo Air TS100MR404A3A 10 HP Extended Medium Temp Outdoor Condensing Unit", price: "9391.00", sku: "TS100MR404A3A" },
  { title: "Turbo Air TS075MR404A3A 7.5 HP Extended Medium Temp Outdoor Condensing Unit", price: "7473.00", sku: "TS075MR404A3A" },
  { title: "Turbo Air TS060MR404A3A 6 HP Extended Medium Temp Outdoor Condensing Unit", price: "4718.00", sku: "TS060MR404A3A" },
  { title: "Turbo Air TS025MR404A3A 2.5 HP Extended Medium Temp Outdoor Condensing Unit", price: "3499.00", sku: "TS025MR404A3A" },
  { title: "Turbo Air TS010MR404A3 1 HP Extended Medium Temp Outdoor Condensing Unit", price: "2956.00", sku: "TS010MR404A3" },
  { title: "Turbo Air TS008MR404A3 3/4 HP Extended Medium Temp Outdoor Condensing Unit", price: "2642.00", sku: "TS008MR404A3" },
  { title: "Turbo Air TS006MR404A3 1/2 HP Extended Medium Temp Outdoor Condensing Unit", price: "2505.00", sku: "TS006MR404A3" },
  { title: "Turbo Air TS010XR404A3 1 HP Extra Low Temp Outdoor Condensing Unit", price: "3563.00", sku: "TS010XR404A3" }
];

async function main() {
  console.log('🚀 Starting Turbo Air Condensing Units import...\n');

  // Find or create the condensing-units category
  let category = await prisma.category.findUnique({
    where: { slug: 'condensing-units' }
  });

  if (!category) {
    console.log('Creating condensing-units category...');
    
    // Find refrigeration-equipment parent
    const parent = await prisma.category.findUnique({
      where: { slug: 'refrigeration-equipment' }
    });

    if (!parent) {
      console.error('❌ Parent category refrigeration-equipment not found!');
      process.exit(1);
    }

    category = await prisma.category.create({
      data: {
        name: 'Condensing Units',
        slug: 'condensing-units',
        parentId: parent.id
      }
    });
    console.log('✅ Category created\n');
  } else {
    console.log('✅ Category found\n');
  }

  // Delete existing products in this category
  console.log('🗑️  Deleting existing products in condensing-units category...');
  const deleted = await prisma.product.deleteMany({
    where: { categoryId: category.id }
  });
  console.log(`✅ Deleted ${deleted.count} existing products\n`);

  // Import all products
  console.log('📦 Importing 35 Turbo Air products...\n');

  for (let i = 0; i < turboAirProducts.length; i++) {
    const item = turboAirProducts[i];

    // Extract HP info from title
    const hpMatch = item.title.match(/([\d.\/]+)\s*HP/i);
    const hp = hpMatch ? hpMatch[1] : '';

    // Extract temp type
    let tempType = 'Medium Temp';
    if (item.title.toLowerCase().includes('extra low temp')) {
      tempType = 'Extra Low Temp';
    } else if (item.title.toLowerCase().includes('extended medium temp')) {
      tempType = 'Extended Medium Temp';
    } else if (item.title.toLowerCase().includes('low temp')) {
      tempType = 'Low Temp';
    }

    // Create slug from SKU
    const slug = `turbo-air-${item.sku.toLowerCase()}`;

    await prisma.product.create({
      data: {
        title: item.title,
        slug: slug,
        brand: 'Turbo Air',
        sku: item.sku,
        badge: 'In Stock',
        description: `Turbo Air ${item.sku} ${tempType} Outdoor Condensing Unit${hp ? ` - ${hp} HP` : ''}. Professional grade condensing unit designed for commercial refrigeration applications. Features weather-resistant construction, energy-efficient operation, and reliable performance for walk-in coolers and freezers.`,
        keyFeatures: `${hp ? hp + ' HP capacity' : 'Commercial grade'} • ${tempType} operation • R-404A refrigerant • Weather-resistant outdoor design • Energy efficient compressor`,
        condition: 'New',
        type: 'Outdoor Condensing Unit',
        price: item.price,
        images: ['/category/refrigerationEquipment/Make_mockup_refrigeration_item_202605120945.jpeg'],
        warranty: ['1 Year Parts Warranty', '90 Days Labor Warranty'],
        detailedFeatures: [
          'Commercial grade construction',
          `${tempType} operation`,
          hp ? `${hp} HP capacity` : 'High efficiency compressor',
          'R-404A refrigerant compatibility',
          'Weather-resistant outdoor design',
          'Easy maintenance access',
          'Reliable cooling performance',
          'Suitable for walk-in coolers and freezers',
          'Energy efficient operation',
          'Durable construction for long service life'
        ],
        specs: {
          brand: 'Turbo Air',
          model: item.sku,
          condition: 'New',
          type: 'Outdoor Condensing Unit',
          horsepower: hp || 'Varies',
          temperatureRange: tempType,
          refrigerant: 'R-404A',
          voltage: '115V/208-230V',
          phase: 'Single/Three Phase',
          application: 'Commercial Refrigeration',
          mounting: 'Outdoor'
        },
        categoryId: category.id
      }
    });

    console.log(`✅ [${i + 1}/35] ${item.title} - $${item.price}`);
  }

  console.log(`\n🎉 Successfully imported all 35 Turbo Air condensing units!`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
