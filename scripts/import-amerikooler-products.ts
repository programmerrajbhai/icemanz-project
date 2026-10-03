import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Function to generate slug from title or handle
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Function to extract dimensions from title or specs
function extractDimensions(product: any): string {
  // Try to extract from title like "5 x 6" or "5' x 6'"
  const titleMatch = product.title.match(/(\d+)'?\s*x\s*(\d+)'?/i);
  if (titleMatch) {
    return `${titleMatch[1]}' x ${titleMatch[2]}'`;
  }

  // Try from specifications
  if (product.specifications) {
    const width = product.specifications['Nominal Width'] || product.specifications['Width'];
    const length = product.specifications['Nominal Length'] || product.specifications['Length'];
    if (width && length) {
      return `${width} x ${length}`;
    }
  }

  return 'Standard';
}

// Function to determine category from product
function determineCategory(product: any): string {
  const title = product.title.toLowerCase();
  const tags = product.tags || [];
  const description = (product.description || '').toLowerCase();

  // Check for combination units first (most specific)
  if (title.includes('combination') || title.includes('combo') || title.includes('dw0')) {
    return 'walk-in-combo-cooler-freezer';
  }

  // Check tags
  if (tags.includes('Freezer Floor') || tags.includes('With Floor')) {
    if (title.includes('freezer') || title.includes('qf0')) {
      return 'walk-in-freezer-with-floor';
    }
    return 'walk-in-cooler-with-floor';
  }

  // Check title patterns
  if (title.includes('floorless') || title.includes('no floor') || title.includes('**n ')) {
    return 'walk-in-cooler-no-floor';
  }

  if (title.includes('with floor') || title.includes('aluminum floor') || title.includes('**f ')) {
    if (title.includes('freezer') || title.includes('qf0')) {
      return 'walk-in-freezer-with-floor';
    }
    return 'walk-in-cooler-with-floor';
  }

  // Check if it's a freezer
  if (title.includes('freezer') || title.includes('qf0')) {
    return 'walk-in-freezer-with-floor';
  }

  // Default to cooler with floor
  return 'walk-in-cooler-with-floor';
}

// Function to determine refrigeration type
function determineRefrigerationType(product: any): string {
  const title = product.title.toLowerCase();

  if (title.includes('top mount') || title.includes('topmount')) {
    return 'Top Mount';
  }
  if (title.includes('remote')) {
    return 'Remote';
  }
  if (title.includes('box only') || product.tags?.includes('Walk-In Box Only')) {
    return 'Box Only';
  }

  // Check if refrigeration options are mentioned
  if (product.refrigeration_options_html || product.refrigeration_choice) {
    return 'Multiple Options Available';
  }

  return 'Box Only';
}

async function importAmeriKoolerProducts() {
  console.log('🚀 Starting AmeriKooler Products Import...\n');

  try {
    // Read the JSON file - use the latest scraped file
    const jsonPath = path.join(process.cwd(), 'data', 'amerikooler-products-2026-10-03.json');
    console.log(`📖 Reading products from: ${jsonPath}`);

    if (!fs.existsSync(jsonPath)) {
      console.error('❌ File not found:', jsonPath);
      console.log('\n💡 Please make sure the file exists at: data/amerikooler-products-2026-10-03.json\n');
      return;
    }

    const jsonData = fs.readFileSync(jsonPath, 'utf-8');
    const products = JSON.parse(jsonData);

    console.log(`✅ Found ${products.length} products in JSON file\n`);

    // Get or create categories
    const categoryMap = new Map<string, string>();
    const categoryConfigs = [
      { slug: 'walk-in-cooler-no-floor', name: 'Walk-In Cooler No Floor' },
      { slug: 'walk-in-cooler-with-floor', name: 'Walk-In Cooler With Floor' },
      { slug: 'walk-in-freezer-with-floor', name: 'Walk-In Freezer With Floor' },
      { slug: 'walk-in-combo-cooler-freezer', name: 'Walk-In Combo (Cooler & Freezer)' }
    ];

    for (const config of categoryConfigs) {
      let category = await prisma.category.findUnique({
        where: { slug: config.slug }
      });

      if (!category) {
        category = await prisma.category.create({
          data: config
        });
        console.log(`✨ Created category: ${config.name}`);
      }

      categoryMap.set(config.slug, category.id);
    }

    console.log('\n📦 Importing products...\n');

    let imported = 0;
    let updated = 0;
    let skipped = 0;

    for (const product of products) {
      try {
        // Determine category
        const categorySlug = determineCategory(product);
        const categoryId = categoryMap.get(categorySlug);

        if (!categoryId) {
          console.log(`⚠️  Skipping ${product.title} - no category found`);
          skipped++;
          continue;
        }

        // Generate slug
        const slug = product.handle || generateSlug(product.title);

        // Extract main image
        const mainImage = product.images && product.images.length > 0
          ? product.images[0].src
          : '/placeholder.png';

        // Extract all images
        const images = product.images && product.images.length > 0
          ? product.images.map((img: any) => img.src)
          : ['/placeholder.png'];

        // Extract price (convert from cents to dollars if needed)
        const price = typeof product.price === 'number'
          ? product.price.toString()
          : product.priceMin?.toString() || '0';

        // Extract SKU from first variant
        const sku = (product.variants && product.variants.length > 0 && product.variants[0].sku)
          || product.handle?.split('-').pop()
          || '';

        // Extract dimensions
        const dimensions = extractDimensions(product);

        // Determine refrigeration type
        const refrigerationType = determineRefrigerationType(product);

        // Build features object with all scraped data including dynamic options
        const features = {
          dimensions,
          refrigerationType,
          walkInType: categorySlug === 'walk-in-cooler-no-floor'
            ? 'Cooler (Refrigerator) No Floor'
            : categorySlug === 'walk-in-freezer-with-floor'
              ? 'Freezer with Floor'
              : categorySlug === 'walk-in-combo-cooler-freezer'
                ? 'Combo (Cooler & Freezer)'
                : 'Cooler (Refrigerator) with Floor',
          hasFloor: !categorySlug.includes('no-floor'),
          specifications: product.specifications || {},
          features: product.features || [],
          specSheetUrl: product.specSheetUrl || null,
          variants: product.variants || [],
          options: product.options || [], // Add product options for dynamic dropdowns
          vendor: product.vendor || 'Amerikooler',
          productType: product.type || 'Walk-In Boxes',
          tags: product.tags || [],
          available: product.available !== false,
          publishedAt: product.publishedAt,
          sourceUrl: product.url
        };

        // Build documents array with spec sheet and standard documents
        const documents = [];

        // Add spec sheet if available
        if (product.specSheetUrl) {
          documents.push({
            name: 'Spec Sheet',
            url: product.specSheetUrl
          });
        }

        // Add standard Amerikooler documents
        documents.push(
          {
            name: 'Warranty',
            url: 'https://cdn.shopify.com/s/files/1/0379/1801/5627/files/Amerikooler_Warranty.pdf'
          },
          {
            name: 'About Amerikooler',
            url: 'https://cdn.shopify.com/s/files/1/0379/1801/5627/files/About_Amerikooler.pdf'
          },
          {
            name: 'California 65 Statement',
            url: 'https://cdn.shopify.com/s/files/1/0379/1801/5627/files/California_65_Statement.pdf'
          }
        );

        // Prepare product data
        const productData = {
          title: product.title,
          slug,
          brand: 'Amerikooler',
          sku,
          price,
          images,
          description: product.descriptionHtml || product.description || '',
          keyFeatures: product.features?.join('\n') || '',
          specs: product.specifications || null,
          features,
          documents,
          categoryId,
          type: 'walk-in',
          badge: product.available ? 'IN STOCK' : 'OUT OF STOCK'
        };

        // Check if product exists
        const existingProduct = await prisma.product.findUnique({
          where: { slug }
        });

        if (existingProduct) {
          // Update existing product
          await prisma.product.update({
            where: { slug },
            data: productData
          });
          console.log(`✏️  Updated: ${product.title}`);
          updated++;
        } else {
          // Create new product
          await prisma.product.create({
            data: productData
          });
          console.log(`✅ Imported: ${product.title}`);
          imported++;
        }

      } catch (error) {
        console.error(`❌ Error processing ${product.title}:`, error);
        skipped++;
      }
    }

    console.log('\n\n========================================');
    console.log('📊 Import Summary:');
    console.log(`   Total products in JSON: ${products.length}`);
    console.log(`   ✅ Newly imported: ${imported}`);
    console.log(`   ✏️  Updated: ${updated}`);
    console.log(`   ⚠️  Skipped: ${skipped}`);
    console.log('========================================\n');

    console.log('✨ Import complete! You can now view the products at:');
    console.log('   http://localhost:3000/walk-in-cooler-freezer\n');

  } catch (error) {
    console.error('💥 Fatal error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the import
importAmeriKoolerProducts();
