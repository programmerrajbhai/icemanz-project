import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Atlantic SE Astra Products Data - Walk-In Freezers with Floor
const productsToImport = [
  {
    title: "Astra 5 x 6 Walk-In Freezer with Floor AFWF5X6",
    slug: "astra-5x6-walk-in-freezer-with-floor",
    brand: "Astra",
    sku: "AFWF5X6",
    badge: "QuickShip",
    description: "The Astra 5 x 6 Walk-In Freezer with Floor is a compact, commercial-grade freezer box designed for restaurants, cafés, delis, convenience stores, small markets, bakeries, and foodservice businesses that need reliable frozen storage in a limited space.",
    price: "3733.00",
    images: [
      "https://cdn.shopify.com/s/files/1/0719/2369/5846/files/wicd6.png?v=1781104368",
      "https://cdn.shopify.com/s/files/1/0719/2369/5846/files/wicd5.png?v=1779888640",
      "https://cdn.shopify.com/s/files/1/0719/2369/5846/files/wicd3.png?v=1779888641"
    ],
    condition: "New",
    type: "Walk-In Box Only",
    keyFeatures: "5' x 6' compact walk-in freezer box • Insulated floor included • 4\" thick foamed-in-place polyurethane insulation • R33 insulation value • Modular cam-lock panels",
    detailedFeatures: [
      "4\" thick foamed-in-place polyurethane insulation",
      "R33 insulation value for freezer performance",
      "Modular cam-lock panels with tongue and groove design",
      "24 gauge pre-painted white galvanized steel panels",
      "Self-closing flush-mounted door",
      "Keyed locking door handle",
      "Freezer door heating wire and pressure relief vent",
      "NSF, UL, DOE, ASTM Test 518, ASTM Test E84, and UL723 compliant"
    ],
    specs: {
      brand: "Astra",
      condition: "New",
      leadTime: "Usually Ships in 2 - 5 Days",
      dimensions: "5' x 6'",
      type: "With Floor - Freezer"
    }
  },
  {
    title: "Astra 5 x 8 Walk-In Freezer with Floor AFWF5X8",
    slug: "astra-5x8-walk-in-freezer-with-floor",
    brand: "Astra",
    sku: "AFWF5X8",
    badge: "QuickShip",
    description: "Astra® Quick-Ship Walk-In Freezers deliver quality and speed with modular cam-lock panels, sizes 5'-40', and top-mount or remote options. Ships in 48 hours, NSF, UL, DOE compliant, with 10-year panel warranty.",
    price: "4158.00",
    images: [
      "https://cdn.shopify.com/s/files/1/0719/2369/5846/files/walk_in_cooler_box_aee83453-3df6-47aa-888d-9d67421a79b7.png?v=1754334622",
      "https://cdn.shopify.com/s/files/1/0719/2369/5846/files/1_3effec0a-2231-4f4e-9a23-58c342d0d7cd.png?v=1754334622"
    ],
    condition: "New",
    type: "Walk-In Box Only",
    keyFeatures: "5 x 8 walk-in freezer with floor • Ships within 48 hours • Top-Mount or Remote Refrigeration • Modular design with all cam-lock panels • 10 year panel warranty",
    detailedFeatures: [
      "4\" Thick Foamed-In-Place Polyurethane Insulation",
      "Modular design with all cam-lock panels",
      "10 year panel warranty, 1 year parts warranty on doors",
      "2 year parts and 1 labor warranty on top-mount refrigeration",
      "NSF, UL, DOE, ASTM Test 518, and ASTM Test E84 Compliant",
      "UL723 Flame Spread and Smoke Development Compliant"
    ],
    specs: {
      brand: "Astra",
      condition: "New",
      leadTime: "Usually Ships in 2 - 5 Days",
      dimensions: "5' x 8'",
      type: "With Floor - Freezer"
    }
  },
  {
    title: "Norlake 6X6X7-7OD 6 X 6 Outdoor Walk-In Freezer With Floor",
    slug: "norlake-6x6x7-7od-outdoor-walk-in-freezer-with-floor",
    brand: "Norlake",
    sku: "6X6X7-7OD",
    badge: "Outdoor",
    description: "The Norlake 6 x 6 outdoor walk-in freezer is a practical commercial refrigeration solution for restaurants, supermarkets, and other foodservice operations that need reliable frozen storage outside the main kitchen.",
    price: "7507.00",
    images: [
      "https://cdn.shopify.com/s/files/1/0719/2369/5846/files/2231376.jpg?v=1781968737",
      "https://cdn.shopify.com/s/files/1/0719/2369/5846/files/2231377.jpg?v=1781968737",
      "https://cdn.shopify.com/s/files/1/0719/2369/5846/files/2231378.jpg?v=1781968737"
    ],
    condition: "New",
    type: "Walk-In Box Only",
    keyFeatures: "6 x 6 outdoor walk-in freezer • 196 cu. ft. capacity • Remote refrigeration design • 26-gauge corrosion-resistant embossed coated steel panels • Aluminum floor panels rated 800 lb. per sq. ft.",
    detailedFeatures: [
      "Remote refrigeration design",
      "26-gauge corrosion-resistant embossed coated steel panels",
      "Aluminum floor panels rated to 800 lb. per sq. ft.",
      "Self-closing door with deadbolt handle",
      "Digital thermometer and light switch",
      "Designed for outdoor use"
    ],
    specs: {
      brand: "Norlake",
      condition: "New",
      leadTime: "Contact for Lead Time",
      dimensions: "6' x 6'",
      type: "With Floor - Freezer - Outdoor"
    }
  },
  {
    title: "Astra 6 x 8 Walk-In Freezer with Floor AFWF6X8",
    slug: "astra-6x8-walk-in-freezer-with-floor",
    brand: "Astra",
    sku: "AFWF6X8",
    badge: "QuickShip",
    description: "Astra® Quick-Ship Walk-In Freezers deliver quality and speed with modular cam-lock panels, sizes 5'-40', and top-mount or remote options. Ships in 48 hours, NSF, UL, DOE compliant, with 10-year panel warranty.",
    price: "4699.00",
    images: [
      "https://cdn.shopify.com/s/files/1/0719/2369/5846/files/walk_in_cooler_box_2599508a-6e9f-43ad-b01c-c6527ba0b381.png?v=1754334617",
      "https://cdn.shopify.com/s/files/1/0719/2369/5846/files/Layout-CoolerFreezer_3.png?v=1754334617"
    ],
    condition: "New",
    type: "Walk-In Box Only",
    keyFeatures: "6 x 8 walk-in freezer with floor • Ships within 48 hours • Top-Mount or Remote Refrigeration • Modular design with all cam-lock panels • 10 year panel warranty",
    detailedFeatures: [
      "4\" Thick Foamed-In-Place Polyurethane Insulation",
      "Cam-Lock Panels, Tongue & Groove Design",
      "24 Gauge Pre-Painted White Galvanized Steel",
      "10 year panel warranty, 1 year parts warranty on doors",
      "2 year parts and 1 labor warranty on top-mount refrigeration",
      "NSF, UL, DOE, ASTM Test 518, and ASTM Test E84 Compliant",
      "UL723 Flame Spread and Smoke Development Compliant"
    ],
    specs: {
      brand: "Astra",
      condition: "New",
      leadTime: "Usually Ships in 2 - 5 Days",
      dimensions: "6' x 8'",
      type: "With Floor - Freezer"
    }
  },
  {
    title: "Mr. Winter MRW6X6CFRHHP-O 6 X 6 Outdoor Walk-In Cooler With Floor",
    slug: "mr-winter-mrw6x6cfrhhp-o-outdoor-walk-in-cooler-with-floor",
    brand: "Mr. Winter",
    sku: "MRW6X6CFRHHP-O",
    badge: "QuickShip",
    description: "The Mr. Winter MRW6X6CFRHHP-O is a 6' x 6' outdoor walk-in cooler with floor, built for commercial foodservice operations that need dependable refrigerated storage in a compact footprint.",
    price: "12581.95",
    images: [
      "https://cdn.shopify.com/s/files/1/0719/2369/5846/files/mrw6x6cfrhhp-o-1-e30d3fc2d64e.jpg?v=1782323687"
    ],
    condition: "New",
    type: "Walk-In Box Only",
    keyFeatures: "6' x 6' outdoor walk-in cooler • Self-contained • Quick Ship walk-in • Galvalume finish • 7'6\" nominal height • Built-in floor",
    detailedFeatures: [
      "Self-contained walk-in cooler",
      "Quick Ship for faster delivery",
      "Galvalume finish",
      "Nominal 6' x 6' size",
      "7'6\" nominal height",
      "Built-in floor included",
      "Designed for outdoor use"
    ],
    specs: {
      brand: "Mr. Winter",
      condition: "New",
      leadTime: "Quick Ship",
      dimensions: "6' x 6' x 7'6\"",
      type: "With Floor - Cooler - Outdoor"
    }
  },
  {
    title: "Dade DAD-CI-667.7-SC 6 X 6 Indoor Walk-In Cooler With Floor",
    slug: "dade-dad-ci-667-7-sc-indoor-walk-in-cooler-with-floor",
    brand: "Dade",
    sku: "DAD-CI-667.7-SC",
    badge: "Indoor",
    description: "The Dade DAD-CI-667.7-SC is a 6 x 6 indoor walk-in cooler with floor designed for commercial refrigeration needs in restaurants, supermarkets, and other foodservice operations.",
    price: "11070.00",
    images: [
      "https://cdn.shopify.com/s/files/1/0719/2369/5846/files/dade_7ea39575-ec5b-42bb-a27b-5017d0258626.webp?v=1782336289"
    ],
    condition: "New",
    type: "Walk-In Box Only",
    keyFeatures: "6 x 6 indoor walk-in cooler with floor • Modular panel construction • 4-inch XPS insulation • Self-contained refrigeration • Acrylic-coated stucco galvanized steel exterior",
    detailedFeatures: [
      "Modular panel construction for swift assembly",
      "4-inch XPS insulation",
      "Self-contained refrigeration type",
      "Acrylic-coated stucco galvanized steel exterior finish",
      "Purpose-built for walk-in cooler applications",
      "DOE regulations compliant"
    ],
    specs: {
      brand: "Dade",
      condition: "New",
      leadTime: "Contact for Lead Time",
      dimensions: "6' x 6' x 7'7\"",
      type: "With Floor - Cooler - Indoor"
    }
  },
  {
    title: "Norlake KLF7766-CX 6 X 6 Indoor Walk-In Freezer With Floor",
    slug: "norlake-klf7766-cx-indoor-walk-in-freezer-with-floor",
    brand: "Norlake",
    sku: "KLF7766-CX",
    badge: "Indoor",
    description: "The Norlake KLF7766-CX indoor walk-in freezer is a practical commercial refrigeration solution for restaurants, markets, and other foodservice operations that need dependable frozen storage in a compact footprint.",
    price: "13292.00",
    images: [
      "https://cdn.shopify.com/s/files/1/0719/2369/5846/files/414096.jpg?v=1781969594",
      "https://cdn.shopify.com/s/files/1/0719/2369/5846/files/610459.jpg?v=1781969594",
      "https://cdn.shopify.com/s/files/1/0719/2369/5846/files/3004946.jpg?v=1781969594"
    ],
    condition: "New",
    type: "Walk-In Box Only",
    keyFeatures: "6' x 6' indoor walk-in freezer • Top-mounted self-contained refrigeration • 196 cu. ft. capacity • Corrosion-resistant embossed galvanized steel panels • Aluminum floor",
    detailedFeatures: [
      "Top-mounted Capsule Pak maximizes interior storage",
      "Corrosion-resistant 26-gauge galvanized steel panels",
      "Aluminum floor provides sturdy storage surface",
      "Self-closing swing door with cam lift hinges",
      "Deadbolt locking handle",
      "Electric vaporizer eliminates need for drain line",
      "NSF Certified, UL Certified",
      "Made in America"
    ],
    specs: {
      brand: "Norlake",
      condition: "New",
      leadTime: "Contact for Lead Time",
      dimensions: "6' x 6'",
      type: "With Floor - Freezer - Indoor"
    }
  },
  {
    title: "Astra 6 x 12 Walk-In Freezer with Floor AFWF6X12",
    slug: "astra-6x12-walk-in-freezer-with-floor",
    brand: "Astra",
    sku: "AFWF6X12",
    badge: "QuickShip",
    description: "Astra® Quick-Ship Walk-In Freezers deliver quality and speed with modular cam-lock panels, sizes 5'-40', and top-mount or remote options. Ships in 48 hours, NSF, UL, DOE compliant, with 10-year panel warranty.",
    price: "5666.00",
    images: [
      "https://cdn.shopify.com/s/files/1/0719/2369/5846/files/walk_in_cooler_box_14716a3d-ea78-4866-8cff-ee0053a069b5.png?v=1754334613",
      "https://cdn.shopify.com/s/files/1/0719/2369/5846/files/Layout-CoolerFreezer_11.png?v=1754334613"
    ],
    condition: "New",
    type: "Walk-In Box Only",
    keyFeatures: "6 x 12 walk-in freezer with floor • Ships within 48 hours • Top-Mount or Remote Refrigeration • Modular design with all cam-lock panels • 10 year panel warranty",
    detailedFeatures: [
      "4\" Thick Foamed-In-Place Polyurethane Insulation",
      "Modular design with all cam-lock panels",
      "10 year panel warranty, 1 year parts warranty on doors",
      "2 year parts and 1 labor warranty on top-mount refrigeration",
      "NSF, UL, DOE, ASTM Test 518, and ASTM Test E84 Compliant",
      "UL723 Flame Spread and Smoke Development Compliant"
    ],
    specs: {
      brand: "Astra",
      condition: "New",
      leadTime: "Usually Ships in 2 - 5 Days",
      dimensions: "6' x 12'",
      type: "With Floor - Freezer"
    }
  },
  {
    title: "Astra 12 x 25 Walk-In Freezer with Floor and Remote Refrigeration AFWF12X25-RM",
    slug: "astra-12x25-walk-in-freezer-with-floor-remote",
    brand: "Astra",
    sku: "AFWF12X25-RM",
    badge: "QuickShip",
    description: "Astra® Quick-Ship Walk-In Freezers deliver quality and speed with modular cam-lock panels. Large capacity freezer with remote refrigeration. Ships in 48 hours, NSF, UL, DOE compliant, with 10-year panel warranty.",
    price: "21289.00",
    images: [
      "https://cdn.shopify.com/s/files/1/0719/2369/5846/files/walk_in_remote_refrigeration_2_31566de8-0a4f-40bd-8853-4938b2053995.png?v=1749573915",
      "https://cdn.shopify.com/s/files/1/0719/2369/5846/files/FWF12X25.jpg?v=1764359450"
    ],
    condition: "New",
    type: "Remote Refrigeration",
    keyFeatures: "12 x 25 walk-in freezer with floor • Remote refrigeration included • Ships within 48 hours • Modular design with all cam-lock panels • 10 year panel warranty",
    detailedFeatures: [
      "4\" Thick Foamed-In-Place Polyurethane Insulation",
      "Remote Refrigeration System Included",
      "Modular design with all cam-lock panels",
      "10 year panel warranty, 1 year parts warranty on doors",
      "2 year parts and 1 labor warranty on refrigeration",
      "NSF, UL, DOE, ASTM Test 518, and ASTM Test E84 Compliant",
      "UL723 Flame Spread and Smoke Development Compliant"
    ],
    specs: {
      brand: "Astra",
      condition: "New",
      leadTime: "Usually Ships in 2 - 5 Days",
      dimensions: "12' x 25'",
      type: "With Floor - Freezer - Remote Refrigeration"
    }
  },
  {
    title: "Astra 6 x 8 Walk-In Freezer with Floor and Remote Refrigeration AFWF6X8-RM",
    slug: "astra-6x8-walk-in-freezer-with-floor-remote",
    brand: "Astra",
    sku: "AFWF6X8-RM",
    badge: "QuickShip",
    description: "Astra® Quick-Ship Walk-In Freezers with remote refrigeration deliver quality and speed with modular cam-lock panels. Ships in 48 hours, NSF, UL, DOE compliant, with 10-year panel warranty.",
    price: "10485.00",
    images: [
      "https://cdn.shopify.com/s/files/1/0719/2369/5846/files/walk_in_remote_refrigeration_2_7d13ae7c-78fd-4467-8f5c-60b4d0174548.png?v=1749573874",
      "https://cdn.shopify.com/s/files/1/0719/2369/5846/files/Layout-CoolerFreezer_3_44889a07-f46f-455f-b991-eb78190c5a73.png?v=1749573874"
    ],
    condition: "New",
    type: "Remote Refrigeration",
    keyFeatures: "6 x 8 walk-in freezer with floor • Remote refrigeration included • Ships within 48 hours • Modular design with all cam-lock panels • 10 year panel warranty",
    detailedFeatures: [
      "4\" Thick Foamed-In-Place Polyurethane Insulation",
      "Remote Refrigeration System Included",
      "Modular design with all cam-lock panels",
      "10 year panel warranty, 1 year parts warranty on doors",
      "2 year parts and 1 labor warranty on refrigeration",
      "NSF, UL, DOE, ASTM Test 518, and ASTM Test E84 Compliant",
      "UL723 Flame Spread and Smoke Development Compliant"
    ],
    specs: {
      brand: "Astra",
      condition: "New",
      leadTime: "Usually Ships in 2 - 5 Days",
      dimensions: "6' x 8'",
      type: "With Floor - Freezer - Remote Refrigeration"
    }
  }
];

async function main() {
  console.log('Starting Astra freezer products import...');

  // Find the walk-in-freezer-with-floor category
  const category = await prisma.category.findUnique({
    where: { slug: 'walk-in-freezer-with-floor' }
  });

  if (!category) {
    console.error('Category "walk-in-freezer-with-floor" not found!');
    console.log('Creating category...');

    // Create the category if it doesn't exist
    const newCategory = await prisma.category.create({
      data: {
        name: 'Walk-In Freezer with Floor',
        slug: 'walk-in-freezer-with-floor'
      }
    });

    console.log('Category created:', newCategory.name);
  }

  const finalCategory = category || await prisma.category.findUnique({
    where: { slug: 'walk-in-freezer-with-floor' }
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
              "R33 for Freezers",
              "CFC and HFC Free Materials",
              "10 Year Panel Warranty"
            ],
            doors: [
              "30\" or 36\" wide doors (left or right hinged)",
              "Self-Closing, Flush-Mounted Doors",
              "Keyed Locking Door Handle",
              "Freezer Door Heating Wire",
              "Pressure Relief Vent",
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
