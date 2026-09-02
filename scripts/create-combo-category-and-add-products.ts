import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // First, create or find the Walk-In Combo Cooler & Freezer category
  let category = await prisma.category.findFirst({
    where: {
      slug: 'walk-in-combo-cooler-freezer'
    }
  });

  if (!category) {
    console.log('Creating Walk-In Combo Cooler & Freezer category...');
    category = await prisma.category.create({
      data: {
        name: 'Walk-In Combo Cooler & Freezer',
        slug: 'walk-in-combo-cooler-freezer'
      }
    });
    console.log(`✓ Created category: ${category.name} (${category.id})`);
  } else {
    console.log(`✓ Found existing category: ${category.name} (${category.id})`);
  }

  const products = [
    {
      title: "Astra 6 x 10 Walk-In Combo Cooler & Freezer With Floor CMB6X10",
      slug: "astra-6x10-walk-in-combo-cooler-freezer-cmb6x10",
      brand: "Astra",
      sku: "CMB6X10",
      price: "$6,438.00",
      description: "The Astra CMB6X10 is a 6' x 10' walk-in cooler/freezer combo box built for commercial foodservice storage where chilled and frozen inventory need to be organized in one footprint.",
      type: "Walk-In Combo Cooler & Freezer",
      condition: "New",
      badge: "With Floor",
      images: ["/Walk-in-Cooler-Freezer/box-type/walk_in_combo_1.avif"],
      specs: {
        "Panel Brand": "Astra",
        "Refrigeration Brand": "Turbo Air",
        "Model": "CMB6X10",
        "Internal Dimensions": "5' 11\"W x 9' 2\"L x 6' 11\"H",
        "External Dimensions": "6' 7\"W x 9' 10\"L x 7' 7\"H",
        "Nominal Width": "6'",
        "Nominal Length": "10'",
        "Nominal Height": "8'",
        "Cubic Feet": "149 ft³",
        "Shipping Weight": "1183 lb",
        "Insulation Value": "R27 for coolers and R33 for freezers",
        "Panel Construction": "4\" thick foamed-in-place polyurethane insulation",
        "Panel Warranty": "10 year panel warranty"
      },
      keyFeatures: JSON.stringify([
        "4\" Thick Foamed-In-Place Polyurethane Insulation",
        "Cam-Lock Panels, Tongue & Groove Design",
        "R27 for Coolers and R33 for Freezers",
        "10 Year Panel Warranty",
        "Self-Closing, Flush-Mounted Doors",
        "Keyed Locking Door Handle"
      ]),
      warranty: ["10-Year Panel Warranty", "2-Year Top Mount Refrigeration Parts", "1-Year Top Mount Refrigeration Labor"],
      categoryId: category.id
    },
    {
      title: "Astra 6 x 12 Walk-In Combo Cooler & Freezer With Floor CMB6X12",
      slug: "astra-6x12-walk-in-combo-cooler-freezer-cmb6x12",
      brand: "Astra",
      sku: "CMB6X12",
      price: "$6,873.00",
      description: "The Astra CMB6X12 is a 6' x 12' walk-in cooler/freezer combo designed for commercial foodservice storage where both refrigerated and frozen inventory need a defined cold storage footprint.",
      type: "Walk-In Combo Cooler & Freezer",
      condition: "New",
      badge: "With Floor",
      images: ["/Walk-in-Cooler-Freezer/box-type/walk_in_combo_1.avif"],
      specs: {
        "Panel Brand": "Astra",
        "Refrigeration Brand": "Turbo Air",
        "Model": "CMB6X12",
        "Internal Dimensions": "5' 11\"W x 10' 10\"L x 6' 11\"H",
        "External Dimensions": "6' 7\"W x 11' 6\"L x 7' 7\"H",
        "Nominal Width": "6'",
        "Nominal Length": "12'",
        "Nominal Height": "8'",
        "Cubic Feet": "169 ft³",
        "Shipping Weight": "1321 lb",
        "Insulation Value": "R27 for coolers and R33 for freezers",
        "Panel Construction": "4\" thick foamed-in-place polyurethane insulation",
        "Panel Warranty": "10 year panel warranty"
      },
      keyFeatures: JSON.stringify([
        "4\" Thick Foamed-In-Place Polyurethane Insulation",
        "Cam-Lock Panels, Tongue & Groove Design",
        "R27 for Coolers and R33 for Freezers",
        "10 Year Panel Warranty",
        "Self-Closing, Flush-Mounted Doors",
        "Keyed Locking Door Handle"
      ]),
      warranty: ["10-Year Panel Warranty", "2-Year Top Mount Refrigeration Parts", "1-Year Top Mount Refrigeration Labor"],
      categoryId: category.id
    },
    {
      title: "Astra 6 x 15 Walk-In Combo Cooler & Freezer With Floor CMB6X15",
      slug: "astra-6x15-walk-in-combo-cooler-freezer-cmb6x15",
      brand: "Astra",
      sku: "CMB6X15",
      price: "$7,842.00",
      description: "The Astra CMB6X15 is a 6' x 15' walk-in cooler/freezer combo box designed for commercial foodservice storage in restaurants, supermarkets, deli operations, and convenience stores.",
      type: "Walk-In Combo Cooler & Freezer",
      condition: "New",
      badge: "With Floor",
      images: ["/Walk-in-Cooler-Freezer/box-type/walk_in_combo_1.avif"],
      specs: {
        "Panel Brand": "Astra",
        "Refrigeration Brand": "Turbo Air",
        "Model": "CMB6X15",
        "Internal Dimensions": "5' 11\"W x 14' 1\"L x 6' 11\"H",
        "External Dimensions": "6' 7\"W x 14' 9\"L x 7' 7\"H",
        "Nominal Width": "6'",
        "Nominal Length": "15'",
        "Nominal Height": "8'",
        "Cubic Feet": "208 ft³",
        "Shipping Weight": "1597 lb",
        "Insulation Value": "R27 for coolers and R33 for freezers",
        "Panel Construction": "4\" thick foamed-in-place polyurethane insulation",
        "Panel Warranty": "10 year panel warranty"
      },
      keyFeatures: JSON.stringify([
        "4\" Thick Foamed-In-Place Polyurethane Insulation",
        "Cam-Lock Panels, Tongue & Groove Design",
        "R27 for Coolers and R33 for Freezers",
        "10 Year Panel Warranty",
        "Self-Closing, Flush-Mounted Doors",
        "Keyed Locking Door Handle"
      ]),
      warranty: ["10-Year Panel Warranty", "2-Year Top Mount Refrigeration Parts", "1-Year Top Mount Refrigeration Labor"],
      categoryId: category.id
    },
    {
      title: "Astra 6 x 17 Walk-In Combo Cooler & Freezer With Floor CMB6X17",
      slug: "astra-6x17-walk-in-combo-cooler-freezer-cmb6x17",
      brand: "Astra",
      sku: "CMB6X17",
      price: "$8,277.00",
      description: "The Astra CMB6X17 is a 6' x 17' walk-in cooler/freezer combo box designed for commercial foodservice storage where a single cold room needs to support multiple temperature zones.",
      type: "Walk-In Combo Cooler & Freezer",
      condition: "New",
      badge: "With Floor",
      images: ["/Walk-in-Cooler-Freezer/box-type/walk_in_combo_1.avif"],
      specs: {
        "Panel Brand": "Astra",
        "Refrigeration Brand": "Turbo Air",
        "Model": "CMB6X17",
        "Internal Dimensions": "5' 11\"W x 15' 9\"L x 6' 11\"H",
        "External Dimensions": "6' 7\"W x 16' 5\"L x 7' 7\"H",
        "Nominal Width": "6'",
        "Nominal Length": "17'",
        "Nominal Height": "8'",
        "Cubic Feet": "227 ft³",
        "Shipping Weight": "1736 lb",
        "Insulation Value": "R27 for coolers and R33 for freezers",
        "Panel Construction": "4\" thick foamed-in-place polyurethane insulation",
        "Panel Warranty": "10 year panel warranty"
      },
      keyFeatures: JSON.stringify([
        "4\" Thick Foamed-In-Place Polyurethane Insulation",
        "Cam-Lock Panels, Tongue & Groove Design",
        "R27 for Coolers and R33 for Freezers",
        "10 Year Panel Warranty",
        "Self-Closing, Flush-Mounted Doors",
        "Keyed Locking Door Handle"
      ]),
      warranty: ["10-Year Panel Warranty", "2-Year Top Mount Refrigeration Parts", "1-Year Top Mount Refrigeration Labor"],
      categoryId: category.id
    },
    {
      title: "Astra 6 x 20 Walk-In Combo Cooler & Freezer With Floor CMB6X20",
      slug: "astra-6x20-walk-in-combo-cooler-freezer-cmb6x20",
      brand: "Astra",
      sku: "CMB6X20",
      price: "$9,148.00",
      description: "The Astra CMB6X20 is a 6' x 20' walk-in cooler/freezer combo box designed for commercial foodservice storage where one footprint needs to support more than one temperature zone.",
      type: "Walk-In Combo Cooler & Freezer",
      condition: "New",
      badge: "With Floor",
      images: ["/Walk-in-Cooler-Freezer/box-type/walk_in_combo_1.avif"],
      specs: {
        "Panel Brand": "Astra",
        "Refrigeration Brand": "Turbo Air",
        "Model": "CMB6X20",
        "Internal Dimensions": "5' 11\"W x 19'L x 6' 11\"H",
        "External Dimensions": "6' 7\"W x 19' 8\"L x 7' 7\"H",
        "Nominal Width": "6'",
        "Nominal Length": "20'",
        "Nominal Height": "8'",
        "Cubic Feet": "266 ft³",
        "Shipping Weight": "2012 lb",
        "Insulation Value": "R27 for coolers and R33 for freezers",
        "Panel Construction": "4\" thick foamed-in-place polyurethane insulation",
        "Panel Warranty": "10 year panel warranty"
      },
      keyFeatures: JSON.stringify([
        "4\" Thick Foamed-In-Place Polyurethane Insulation",
        "Cam-Lock Panels, Tongue & Groove Design",
        "R27 for Coolers and R33 for Freezers",
        "10 Year Panel Warranty",
        "Self-Closing, Flush-Mounted Doors",
        "Keyed Locking Door Handle"
      ]),
      warranty: ["10-Year Panel Warranty", "2-Year Top Mount Refrigeration Parts", "1-Year Top Mount Refrigeration Labor"],
      categoryId: category.id
    },
    {
      title: "Astra 6 x 23 Walk-In Combo Cooler & Freezer With Floor CMB6X23",
      slug: "astra-6x23-walk-in-combo-cooler-freezer-cmb6x23",
      brand: "Astra",
      sku: "CMB6X23",
      price: "$10,019.00",
      description: "The Astra CMB6X23 is a 6' x 23' walk-in cooler/freezer combo box built for commercial foodservice storage where both chilled and frozen inventory need to be organized in one footprint.",
      type: "Walk-In Combo Cooler & Freezer",
      condition: "New",
      badge: "With Floor",
      images: ["/Walk-in-Cooler-Freezer/box-type/walk_in_combo_1.avif"],
      specs: {
        "Panel Brand": "Astra",
        "Refrigeration Brand": "Turbo Air",
        "Model": "CMB6X23",
        "External Dimensions": "6' 7\"W x 23' L x 7' 7\"H",
        "Nominal Width": "6'",
        "Nominal Length": "23'",
        "Nominal Height": "8'",
        "Cubic Feet": "305 ft³",
        "Shipping Weight": "2289 lb",
        "Insulation Value": "R27 for coolers and R33 for freezers",
        "Panel Construction": "4\" thick foamed-in-place polyurethane insulation",
        "Panel Warranty": "10 year panel warranty"
      },
      keyFeatures: JSON.stringify([
        "4\" Thick Foamed-In-Place Polyurethane Insulation",
        "Cam-Lock Panels, Tongue & Groove Design",
        "R27 for Coolers and R33 for Freezers",
        "10 Year Panel Warranty",
        "Self-Closing, Flush-Mounted Doors",
        "Keyed Locking Door Handle"
      ]),
      warranty: ["10-Year Panel Warranty", "2-Year Top Mount Refrigeration Parts", "1-Year Top Mount Refrigeration Labor"],
      categoryId: category.id
    },
    {
      title: "Astra 8 x 10 Walk-In Combo Cooler & Freezer With Floor CMB8X10",
      slug: "astra-8x10-walk-in-combo-cooler-freezer-cmb8x10",
      brand: "Astra",
      sku: "CMB8X10",
      price: "$7,188.00",
      description: "The Astra CMB8X10 is an 8 x 10 walk-in cooler/freezer combo box built for commercial foodservice storage, restaurant equipment planning, and back-of-house cold storage where one footprint needs to support multiple temperature zones.",
      type: "Walk-In Combo Cooler & Freezer",
      condition: "New",
      badge: "With Floor",
      images: ["/Walk-in-Cooler-Freezer/box-type/walk_in_combo_1.avif"],
      specs: {
        "Panel Brand": "Astra",
        "Refrigeration Brand": "Turbo Air",
        "Model": "CMB8X10",
        "Internal Dimensions": "7' 6\"W x 9' 2\"L x 6' 11\"H",
        "External Dimensions": "8' 2\"W x 9' 10\"L x 7' 7\"H",
        "Nominal Width": "8'",
        "Nominal Length": "10'",
        "Nominal Height": "8'",
        "Cubic Feet": "168 ft³",
        "Shipping Weight": "1317 lb",
        "Insulation Value": "R27 for coolers and R33 for freezers",
        "Panel Construction": "4\" thick foamed-in-place polyurethane insulation",
        "Panel Warranty": "10 year panel warranty"
      },
      keyFeatures: JSON.stringify([
        "4\" Thick Foamed-In-Place Polyurethane Insulation",
        "Cam-Lock Panels, Tongue & Groove Design",
        "R27 for Coolers and R33 for Freezers",
        "10 Year Panel Warranty",
        "Self-Closing, Flush-Mounted Doors",
        "Keyed Locking Door Handle"
      ]),
      warranty: ["10-Year Panel Warranty", "2-Year Top Mount Refrigeration Parts", "1-Year Top Mount Refrigeration Labor"],
      categoryId: category.id
    },
    {
      title: "Astra 8 x 12 Walk-In Combo Cooler & Freezer With Floor CMB8X12",
      slug: "astra-8x12-walk-in-combo-cooler-freezer-cmb8x12",
      brand: "Astra",
      sku: "CMB8X12",
      price: "$7,677.00",
      description: "The Astra CMB8X12 is an 8 x 12 walk-in cooler/freezer combo designed for commercial foodservice operations that need organized cold storage in one walk-in box.",
      type: "Walk-In Combo Cooler & Freezer",
      condition: "New",
      badge: "With Floor",
      images: ["/Walk-in-Cooler-Freezer/box-type/walk_in_combo_1.avif"],
      specs: {
        "Panel Brand": "Astra",
        "Refrigeration Brand": "Turbo Air",
        "Model": "CMB8X12",
        "Internal Dimensions": "7' 6\"W x 10' 10\"L x 6' 11\"H",
        "External Dimensions": "8' 2\"W x 11' 6\"L x 7' 7\"H",
        "Nominal Width": "8'",
        "Nominal Length": "12'",
        "Nominal Height": "8'",
        "Cubic Feet": "189 ft³",
        "Shipping Weight": "1468 lb",
        "Insulation Value": "R27 for coolers and R33 for freezers",
        "Panel Construction": "4\" thick foamed-in-place polyurethane insulation",
        "Panel Warranty": "10 year panel warranty"
      },
      keyFeatures: JSON.stringify([
        "4\" Thick Foamed-In-Place Polyurethane Insulation",
        "Cam-Lock Panels, Tongue & Groove Design",
        "R27 for Coolers and R33 for Freezers",
        "10 Year Panel Warranty",
        "Self-Closing, Flush-Mounted Doors",
        "Keyed Locking Door Handle"
      ]),
      warranty: ["10-Year Panel Warranty", "2-Year Top Mount Refrigeration Parts", "1-Year Top Mount Refrigeration Labor"],
      categoryId: category.id
    },
    {
      title: "Astra 8 x 18 Walk-In Combo Cooler & Freezer With Floor CMB8X18",
      slug: "astra-8x18-walk-in-combo-cooler-freezer-cmb8x18",
      brand: "Astra",
      sku: "CMB8X18",
      price: "$9,631.00",
      description: "The Astra CMB8X18 is an 8' x 18' walk-in cooler/freezer combo box designed for commercial foodservice storage where both refrigerated and frozen holding need to be planned in one unit.",
      type: "Walk-In Combo Cooler & Freezer",
      condition: "New",
      badge: "With Floor",
      images: ["/Walk-in-Cooler-Freezer/box-type/walk_in_combo_1.avif"],
      specs: {
        "Panel Brand": "Astra",
        "Refrigeration Brand": "Turbo Air",
        "Model": "CMB8X18",
        "Internal Dimensions": "7' 6\"W x 17' 5\"L x 6' 11\"H",
        "External Dimensions": "8' 2\"W x 18' 1\"L x 7' 7\"H",
        "Nominal Width": "8'",
        "Nominal Length": "18'",
        "Nominal Height": "8'",
        "Cubic Feet": "274 ft³",
        "Shipping Weight": "2071 lb",
        "Insulation Value": "R27 for coolers and R33 for freezers",
        "Panel Construction": "4\" thick foamed-in-place polyurethane insulation",
        "Panel Warranty": "10 year panel warranty"
      },
      keyFeatures: JSON.stringify([
        "4\" Thick Foamed-In-Place Polyurethane Insulation",
        "Cam-Lock Panels, Tongue & Groove Design",
        "R27 for Coolers and R33 for Freezers",
        "10 Year Panel Warranty",
        "Self-Closing, Flush-Mounted Doors",
        "Keyed Locking Door Handle"
      ]),
      warranty: ["10-Year Panel Warranty", "2-Year Top Mount Refrigeration Parts", "1-Year Top Mount Refrigeration Labor"],
      categoryId: category.id
    },
    {
      title: "Astra 8 x 20 Walk-In Combo Cooler & Freezer With Floor CMB8X20",
      slug: "astra-8x20-walk-in-combo-cooler-freezer-cmb8x20",
      brand: "Astra",
      sku: "CMB8X20",
      price: "$10,120.00",
      description: "The Astra CMB8X20 is an 8 x 20 walk-in cooler/freezer combo box designed for commercial foodservice storage where both refrigerated and frozen inventory need to be organized in one footprint.",
      type: "Walk-In Combo Cooler & Freezer",
      condition: "New",
      badge: "With Floor",
      images: ["/Walk-in-Cooler-Freezer/box-type/walk_in_combo_1.avif"],
      specs: {
        "Panel Brand": "Astra",
        "Refrigeration Brand": "Turbo Air",
        "Model": "CMB8X20",
        "Internal Dimensions": "7' 6\"W x 19'L x 6' 11\"H",
        "External Dimensions": "8' 2\"W x 19' 8\"L x 7' 7\"H",
        "Nominal Width": "8'",
        "Nominal Length": "20'",
        "Nominal Height": "8'",
        "Cubic Feet": "295 ft³",
        "Shipping Weight": "2222 lb",
        "Insulation Value": "R27 for coolers and R33 for freezers",
        "Panel Construction": "4\" thick foamed-in-place polyurethane insulation",
        "Panel Warranty": "10 year panel warranty"
      },
      keyFeatures: JSON.stringify([
        "4\" Thick Foamed-In-Place Polyurethane Insulation",
        "Cam-Lock Panels, Tongue & Groove Design",
        "R27 for Coolers and R33 for Freezers",
        "10 Year Panel Warranty",
        "Self-Closing, Flush-Mounted Doors",
        "Keyed Locking Door Handle"
      ]),
      warranty: ["10-Year Panel Warranty", "2-Year Top Mount Refrigeration Parts", "1-Year Top Mount Refrigeration Labor"],
      categoryId: category.id
    }
  ];

  console.log(`\nAdding ${products.length} products...`);

  for (const product of products) {
    try {
      const created = await prisma.product.create({
        data: product
      });
      console.log(`✓ Added: ${created.title}`);
    } catch (error: any) {
      console.error(`✗ Failed to add ${product.title}:`, error.message);
    }
  }

  console.log('\n✓ Import completed!');
  console.log(`\nCategory URL: http://localhost:3000/walk-in-cooler-freezer/${category.slug}`);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
