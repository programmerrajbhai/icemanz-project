import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Atlantic SE Astra Products Data - Walk-In Freezers with Floor
const productsToImport = [
  {
    title: "Astra 5 x 6 Walk-In Cooler No Floor CNF5X6",
    slug: "astra-5x6-walk-in-cooler-no-floor",
    brand: "Astra",
    sku: "CNF5X6",
    badge: "QuickShip",
    description: "The Astra 5 x 6 Walk-In Cooler No Floor is a compact, quick-ship walk-in cooler box designed for restaurants, cafés, delis, convenience stores, bakeries, food trucks, and small commercial kitchens that need dependable cold storage without taking up unnecessary space.",
    price: "3169.00",
    images: [
      "https://cdn.shopify.com/s/files/1/0719/2369/5846/files/wicd6.png?v=1781104368",
      "https://cdn.shopify.com/s/files/1/0719/2369/5846/files/wicd5.png?v=1779888640",
      "https://cdn.shopify.com/s/files/1/0719/2369/5846/files/wicd3.png?v=1779888641"
    ],
    condition: "New",
    type: "Walk-In Box Only",
    keyFeatures: "5 ft. x 6 ft. compact walk-in cooler box • No-floor design for easy access • Quick-ship model • Modular cam-lock panels • 4\" thick foamed-in-place polyurethane insulation",
    detailedFeatures: [
      "4\" thick foamed-in-place polyurethane insulation",
      "Modular cam-lock panels for efficient installation",
      "Tongue-and-groove panel construction",
      "Pre-painted white galvanized steel panels",
      "Designed for commercial foodservice cold storage",
      "Compatible with top-mount or remote refrigeration systems"
    ],
    specs: {
      brand: "Astra",
      condition: "New",
      leadTime: "Usually Ships in 2 - 5 Days",
      dimensions: "5' x 6'",
      type: "No Floor"
    }
  },
  {
    title: "Astra 12' x 7' x 8' Walk-In Display Cooler with 4 Glass Doors",
    slug: "astra-12x7x8-walk-in-display-cooler",
    brand: "Astra",
    sku: "DCWF12X7",
    badge: "New",
    description: "The Astra 12' x 7' x 8' Walk-In Display Cooler with 4 Glass Doors is designed for businesses that need both refrigerated storage and customer-facing product visibility in one compact footprint.",
    price: "10905.00",
    images: [
      "https://cdn.shopify.com/s/files/1/0719/2369/5846/files/4glassdoorwalkincooler.png?v=1782760865"
    ],
    condition: "New",
    type: "Walk-In Box Only",
    keyFeatures: "12' x 7' x 8' walk-in display cooler • 4 glass front display doors • Separate side walk-in door • Black-framed glass doors • Insulated walk-in cooler panels",
    detailedFeatures: [
      "Four front glass display doors",
      "Solid side entry door for staff access",
      "Adjustable shelving for merchandising",
      "Black-framed glass doors",
      "Insulated walk-in cooler panels",
      "Suitable for beverage shops, liquor stores, convenience stores"
    ],
    specs: {
      brand: "Astra",
      condition: "New",
      leadTime: "Usually Ships in 2 - 5 Days",
      dimensions: "12' x 7' x 8'",
      type: "Display Cooler"
    }
  },
  {
    title: "Astra Custom Walk-In Cooler or Freezer",
    slug: "astra-custom-walk-in-cooler-or-freezer",
    brand: "Astra",
    sku: "CUSTOM-ASTRA",
    badge: "Custom",
    description: "Upgrade your refrigeration with Astra® Custom Size Walk-In Coolers & Freezers. Engineered for speed, quality, and flexibility, these units feature modular cam-lock panels for easy assembly and sizes ranging from 5' to 40'.",
    price: "0.00",
    images: [
      "https://cdn.shopify.com/s/files/1/0719/2369/5846/files/Custom_Walk_In_Cooler_L_Shape_White.png?v=1749218747",
      "https://cdn.shopify.com/s/files/1/0719/2369/5846/files/2_efc5a1e7-f4f7-4c8e-a355-4eaedc27a6b8.png?v=1749218476"
    ],
    condition: "New",
    type: "Walk-In Box Only",
    keyFeatures: "Ships in 48 Hours • Custom Sizes and Variations Available • Modular Design with Cam-Lock Panels • 10-Year Panel Warranty • 1-Year Parts Warranty on Doors",
    detailedFeatures: [
      "Ships in 48 Hours",
      "Custom Sizes and Variations Available",
      "Modular Design with Cam-Lock Panels",
      "10-Year Panel Warranty",
      "1-Year Parts Warranty on Doors",
      "2-Year Parts and 1-Year Labor Warranty on Top-Mount Refrigeration",
      "Certified: NSF, UL, DOE, ASTM Test 518 & E84, UL723 Compliant"
    ],
    specs: {
      brand: "Astra",
      condition: "New",
      leadTime: "Ships in 48 Hours",
      dimensions: "Custom (5' to 40')",
      type: "Custom Size"
    }
  },
  {
    title: "Astra 5 x 6 Walk-In Cooler with Floor CWF5X6",
    slug: "astra-5x6-walk-in-cooler-with-floor-secondary",
    brand: "Astra",
    sku: "CWF5X6",
    badge: "QuickShip",
    description: "Astra® Quick-Ship Walk-In Coolers & Freezers deliver quality and speed with modular cam-lock panels, sizes 5'-40', and top-mount or remote options. Ships in 48 hours, NSF, UL, DOE compliant, with 10-year panel warranty.",
    price: "3438.00",
    images: [
      "https://cdn.shopify.com/s/files/1/0719/2369/5846/files/walk_in_cooler_box_4c059710-e69e-4561-87fe-a9be6c1fb0ef.png?v=1754334533",
      "https://cdn.shopify.com/s/files/1/0719/2369/5846/files/CNW5X6-1A.png?v=1754334533"
    ],
    condition: "New",
    type: "Walk-In Box Only",
    keyFeatures: "Ships within 48 hours • Several Variations Available • Top-Mount or Remote Refrigeration • Modular design with all cam-lock panels • 10 year panel warranty",
    detailedFeatures: [
      "4\" Thick Foamed-In-Place Polyurethane Insulation",
      "Cam-Lock Panels, Tongue & Groove Design",
      "24 Gauge Pre-Painted White Galvanized Steel",
      "R27 for Coolers and R33 for Freezers",
      "10 Year Panel Warranty",
      "NSF, UL, DOE, ASTM Test 518, and ASTM Test E84 Compliant",
      "UL723 Flame Spread and Smoke Development Compliant"
    ],
    specs: {
      brand: "Astra",
      condition: "New",
      leadTime: "Usually Ships in 2 - 5 Days",
      dimensions: "5' x 6'",
      type: "With Floor"
    }
  },
  {
    title: "Astra 6 x 6 Walk-In Cooler No Floor CNF6X6",
    slug: "astra-6x6-walk-in-cooler-no-floor",
    brand: "Astra",
    sku: "CNF6X6",
    badge: "QuickShip",
    description: "The Astra CNF6X6 is a 6' x 6' commercial walk-in cooler box designed for restaurants, delis, supermarkets, convenience stores, cafés, ghost kitchens, and foodservice operations that need compact, reliable cold storage without a built-in insulated floor.",
    price: "3498.00",
    images: [
      "https://cdn.shopify.com/s/files/1/0719/2369/5846/files/wicd6.png?v=1781104368",
      "https://cdn.shopify.com/s/files/1/0719/2369/5846/files/wicd5.png?v=1779888640",
      "https://cdn.shopify.com/s/files/1/0719/2369/5846/files/wicd2.png?v=1781106008"
    ],
    condition: "New",
    type: "Walk-In Box Only",
    keyFeatures: "6' x 6' commercial walk-in cooler box • No floor design • 4\" foamed-in-place polyurethane insulated panels • Cam-lock tongue-and-groove construction • Quick-ship availability",
    detailedFeatures: [
      "4\" foamed-in-place polyurethane insulated panels",
      "Cam-lock tongue-and-groove construction",
      "24-gauge pre-painted white galvanized steel",
      "Self-closing flush-mounted door",
      "Keyed locking handle",
      "Compatible with remote or top-mount refrigeration"
    ],
    specs: {
      brand: "Astra",
      condition: "New",
      leadTime: "Usually Ships in 2 - 5 Days",
      dimensions: "6' x 6'",
      type: "No Floor"
    }
  },
  {
    title: "Astra 6 x 8 Walk-In Cooler No Floor CNF6X8",
    slug: "astra-6x8-walk-in-cooler-no-floor",
    brand: "Astra",
    sku: "CNF6X8",
    badge: "QuickShip",
    description: "The Astra 6 x 8 Walk-In Cooler No Floor is a practical, quick-ship walk-in cooler box designed for restaurants, delis, cafés, grocery stores, bakeries, food prep businesses, and commercial kitchens that need reliable cold storage without overcomplicating the installation.",
    price: "3828.00",
    images: [
      "https://cdn.shopify.com/s/files/1/0719/2369/5846/files/wicd6.png?v=1781104368",
      "https://cdn.shopify.com/s/files/1/0719/2369/5846/files/wicd5.png?v=1779888640",
      "https://cdn.shopify.com/s/files/1/0719/2369/5846/files/wicd2.png?v=1781106008"
    ],
    condition: "New",
    type: "Walk-In Box Only",
    keyFeatures: "6 ft. x 8 ft. footprint • No-floor design • Modular cam-lock panel system • 4-inch thick foamed-in-place polyurethane insulation • Self-closing door with locking handle",
    detailedFeatures: [
      "4-inch thick foamed-in-place polyurethane insulated panels",
      "Cam-lock panel system for secure assembly",
      "Tongue-and-groove panel design",
      "Pre-painted galvanized steel finish",
      "Self-closing flush-mounted door",
      "Heavy-duty hinges and durable door handle"
    ],
    specs: {
      brand: "Astra",
      condition: "New",
      leadTime: "Usually Ships in 2 - 5 Days",
      dimensions: "6' x 8'",
      type: "No Floor"
    }
  },
  {
    title: "Astra 6 x 10 Walk-In Cooler No Floor CNF6X10",
    slug: "astra-6x10-walk-in-cooler-no-floor",
    brand: "Astra",
    sku: "CNF6X10",
    badge: "QuickShip",
    description: "The Astra 6 x 10 Walk-In Cooler No Floor CNF6X10 is a quick-ship commercial walk-in cooler box designed for restaurants, delis, cafés, bakeries, grocery stores, commissary kitchens, catering businesses, and foodservice operations that need dependable refrigerated storage in a practical mid-size footprint.",
    price: "4174.00",
    images: [
      "https://cdn.shopify.com/s/files/1/0719/2369/5846/files/wicd6.png?v=1781104368",
      "https://cdn.shopify.com/s/files/1/0719/2369/5846/files/wicd5.png?v=1779888640",
      "https://cdn.shopify.com/s/files/1/0719/2369/5846/files/wicd2.png?v=1781106008"
    ],
    condition: "New",
    type: "Walk-In Box Only",
    keyFeatures: "6'7\" L x 9'10\" W x 7'3\" H dimensions • No-floor configuration • Modular insulated cam-lock panels • Compatible with top-mount or remote refrigeration",
    detailedFeatures: [
      "4\" Thick Foamed-In-Place Polyurethane Insulation",
      "Modular cam-lock panel system",
      "Tongue-and-groove construction",
      "Pre-painted galvanized steel finish",
      "Designed for commercial cold storage",
      "NSF, UL, DOE compliant"
    ],
    specs: {
      brand: "Astra",
      condition: "New",
      leadTime: "Usually Ships in 2 - 5 Days",
      dimensions: "6' x 10'",
      type: "No Floor"
    }
  },
  {
    title: "Astra 8 x 8 Walk-In Cooler No Floor CNF8X8",
    slug: "astra-8x8-walk-in-cooler-no-floor",
    brand: "Astra",
    sku: "CNF8X8",
    badge: "QuickShip",
    description: "The Astra 8' x 8' Walk-In Cooler No Floor CNF8X8 is a quick-ship commercial walk-in cooler box designed for restaurants, delis, supermarkets, convenience stores, prep kitchens, and foodservice operations that need dependable cold storage in a practical mid-size footprint.",
    price: "4200.00",
    images: [
      "https://cdn.shopify.com/s/files/1/0719/2369/5846/files/wicd6.png?v=1781104368",
      "https://cdn.shopify.com/s/files/1/0719/2369/5846/files/wicd5.png?v=1779888640",
      "https://cdn.shopify.com/s/files/1/0719/2369/5846/files/wicd2.png?v=1781106008"
    ],
    condition: "New",
    type: "Walk-In Box Only",
    keyFeatures: "8' x 8' commercial walk-in cooler box • No-floor model • 8'2\" L x 8'2\" W x 7'3\" H exterior dimensions • 4\" insulated polyurethane panels • Cam-lock tongue-and-groove panel construction",
    detailedFeatures: [
      "4\" insulated polyurethane panels",
      "Cam-lock tongue-and-groove panel construction",
      "Durable pre-painted galvanized steel finish",
      "Compatible with top-mount or remote refrigeration options",
      "Quick-ship walk-in cooler solution",
      "Commercial walk-in cooler construction standards"
    ],
    specs: {
      brand: "Astra",
      condition: "New",
      leadTime: "Usually Ships in 2 - 5 Days",
      dimensions: "8' x 8'",
      type: "No Floor"
    }
  },
  {
    title: "Astra 8 x 10 Walk-In Cooler No Floor CNF8X10",
    slug: "astra-8x10-walk-in-cooler-no-floor",
    brand: "Astra",
    sku: "CNF8X10",
    badge: "QuickShip",
    description: "Astra® Quick-Ship Walk-In Coolers deliver quality and speed with modular cam-lock panels, sizes 5'-40', and top-mount or remote options. Ships in 48 hours, NSF, UL, DOE compliant, with 10-year panel warranty.",
    price: "4556.00",
    images: [
      "https://cdn.shopify.com/s/files/1/0719/2369/5846/files/wicd6.png?v=1781104368",
      "https://cdn.shopify.com/s/files/1/0719/2369/5846/files/wicd5.png?v=1779888640",
      "https://cdn.shopify.com/s/files/1/0719/2369/5846/files/wicd2.png?v=1781106008"
    ],
    condition: "New",
    type: "Walk-In Box Only",
    keyFeatures: "8 x 10 walk-in cooler no floor • Ships within 48 hours • Top-Mount or Remote Refrigeration • Modular design with all cam-lock panels • 10 year panel warranty",
    detailedFeatures: [
      "4\" Thick Foamed-In-Place Polyurethane Insulation",
      "Modular cam-lock panel system",
      "Tongue-and-groove panel design",
      "Pre-painted galvanized steel finish",
      "Designed for commercial cold storage applications",
      "NSF, UL, DOE, ASTM Test 518, and ASTM Test E84 Compliant",
      "UL723 Flame Spread and Smoke Development Compliant"
    ],
    specs: {
      brand: "Astra",
      condition: "New",
      leadTime: "Usually Ships in 2 - 5 Days",
      dimensions: "8' x 10'",
      type: "No Floor"
    }
  },
  {
    title: "Astra 10 x 10 Walk-In Cooler No Floor CNF10X10",
    slug: "astra-10x10-walk-in-cooler-no-floor",
    brand: "Astra",
    sku: "CNF10X10",
    badge: "QuickShip",
    description: "Astra® Quick-Ship Walk-In Coolers deliver quality and speed with modular cam-lock panels, sizes 5'-40', and top-mount or remote options. Ships in 48 hours, NSF, UL, DOE compliant, with 10-year panel warranty.",
    price: "4939.00",
    images: [
      "https://cdn.shopify.com/s/files/1/0719/2369/5846/files/wicd6.png?v=1781104368",
      "https://cdn.shopify.com/s/files/1/0719/2369/5846/files/wicd5.png?v=1779888640",
      "https://cdn.shopify.com/s/files/1/0719/2369/5846/files/wicd2.png?v=1781106008"
    ],
    condition: "New",
    type: "Walk-In Box Only",
    keyFeatures: "10' x 10' walk-in cooler no floor • Ships within 48 hours • Top-Mount or Remote Refrigeration • Modular design with all cam-lock panels • 10 year panel warranty",
    detailedFeatures: [
      "4\" Thick Foamed-In-Place Polyurethane Insulation",
      "Modular design with all cam-lock panels",
      "Tongue & Groove Design for tight seal",
      "Pre-painted white galvanized steel",
      "10 year panel warranty, 1 year parts warranty on doors",
      "2 year parts and 1 labor warranty on top-mount refrigeration",
      "NSF, UL, DOE, ASTM Test 518, and ASTM Test E84 Compliant",
      "UL723 Flame Spread and Smoke Development Compliant"
    ],
    specs: {
      brand: "Astra",
      condition: "New",
      leadTime: "Usually Ships in 2 - 5 Days",
      dimensions: "10' x 10'",
      type: "No Floor"
    }
  }
];

async function main() {
  console.log('Starting Astra products import...');

  // Find the walk-in-cooler-no-floor category
  const category = await prisma.category.findUnique({
    where: { slug: 'walk-in-cooler-no-floor' }
  });

  if (!category) {
    console.error('Category "walk-in-cooler-no-floor" not found!');
    console.log('Creating category...');

    // Create the category if it doesn't exist
    const newCategory = await prisma.category.create({
      data: {
        name: 'Walk-In Cooler No Floor',
        slug: 'walk-in-cooler-no-floor'
      }
    });

    console.log('Category created:', newCategory.name);
  }

  const finalCategory = category || await prisma.category.findUnique({
    where: { slug: 'walk-in-cooler-no-floor' }
  });

  let importedCount = 0;
  let skippedCount = 0;

  for (const product of productsToImport) {
    try {
      // Check if product already exists
      const existingProduct = await prisma.product.findUnique({
        where: { slug: product.slug }
      });

      if (existingProduct) {
        console.log(`Product already exists: ${product.title}`);
        skippedCount++;
        continue;
      }

      // Create the product
      await prisma.product.create({
        data: {
          title: product.title,
          slug: product.slug,
          brand: product.brand,
          sku: product.sku,
          badge: product.badge,
          description: product.description,
          keyFeatures: product.keyFeatures,
          condition: product.condition,
          type: product.type,
          price: product.price,
          images: product.images,
          detailedFeatures: product.detailedFeatures,
          specs: product.specs,
          categoryId: finalCategory!.id,
          documents: [
            {
              name: "Spec Sheet",
              url: "https://cdn.shopify.com/s/files/1/0379/1801/5627/files/amerikooler_qc060672n.pdf"
            },
            {
              name: "Warranty",
              url: "https://cdn.shopify.com/s/files/1/0719/2369/5846/files/LIMITEDPANELWARRANTY.pdf"
            },
            {
              name: "About Astra",
              url: "https://cdn.shopify.com/s/files/1/0719/2369/5846/files/Company-Material-AboutUs.pdf"
            }
          ],
          features: {
            panels: [
              "4\" Thick Foamed-In-Place Polyurethane Insulation",
              "Cam-Lock Panels, Tongue & Groove Design",
              "24 Gauge Pre-Painted White Galvanized Steel",
              "R27 for Coolers and R33 for Freezers",
              "CFC and HFC Free Materials",
              "10 Year Panel Warranty"
            ],
            doors: [
              "30\" or 36\" wide doors (left or right hinged)",
              "Self-Closing, Flush-Mounted Doors",
              "Keyed Locking Door Handle",
              "Heavy-Duty Hinges and Durable Handles"
            ]
          },
          warranty: [
            "10 Year Panel Warranty",
            "1 Year Parts Warranty on Doors",
            "2 Year Parts and 1 Year Labor Warranty on Top-Mount Refrigeration"
          ]
        }
      });

      console.log(`✓ Imported: ${product.title}`);
      importedCount++;
    } catch (error) {
      console.error(`Error importing ${product.title}:`, error);
    }
  }

  console.log('\n=== Import Summary ===');
  console.log(`Total products processed: ${productsToImport.length}`);
  console.log(`Successfully imported: ${importedCount}`);
  console.log(`Skipped (already exist): ${skippedCount}`);
  console.log('Import complete!');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
