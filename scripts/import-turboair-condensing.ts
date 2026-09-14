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

// Function to extract HP from title
function extractHP(product: any): string {
  const title = product.title.toLowerCase();
  const hpMatch = title.match(/(\d+(?:\.\d+)?|\d+\/\d+)\s*hp/i);
  if (hpMatch) {
    return hpMatch[1] + ' HP';
  }
  return 'Standard';
}

// Function to extract temperature type
function extractTempType(product: any): string {
  const title = product.title.toLowerCase();
  if (title.includes('extra low temp') || title.includes('xr')) {
    return 'Extra Low Temperature';
  }
  if (title.includes('medium temp') || title.includes('mr')) {
    return 'Medium Temperature';
  }
  return 'Medium Temperature'; // Default
}

async function importTurboAirProducts() {
  console.log('🚀 Starting Turbo Air Condensing Units Import...\n');

  try {
    // Read the JSON file
    const jsonPath = path.join(process.cwd(), 'data', 'turboair-condensing-2026-09-13.json');
    console.log(`📖 Reading products from: ${jsonPath}`);

    if (!fs.existsSync(jsonPath)) {
      console.error('❌ File not found:', jsonPath);
      console.log('\n💡 Please run the scraper first: npm run scrape:turboair\n');
      return;
    }

    const jsonData = fs.readFileSync(jsonPath, 'utf-8');
    const products = JSON.parse(jsonData);

    console.log(`✅ Found ${products.length} products in JSON file\n`);

    // Get or create "Condensing Units" category
    let category = await prisma.category.findUnique({
      where: { slug: 'condensing-units' }
    });

    if (!category) {
      category = await prisma.category.create({
        data: {
          slug: 'condensing-units',
          name: 'Condensing Units'
        }
      });
      console.log('✨ Created category: Condensing Units\n');
    }

    console.log('📦 Importing products...\n');

    let imported = 0;
    let updated = 0;
    let skipped = 0;

    for (const product of products) {
      try {
        // Generate slug
        const slug = product.handle || generateSlug(product.title);

        // Extract main image
        const mainImage = product.featuredImage || (product.images && product.images.length > 0 && product.images[0])
          || '/placeholder.png';

        // Extract all images (they are already strings, not objects)
        const images = product.images && product.images.length > 0
          ? product.images.filter((img: any) => img !== undefined && img !== null && img !== '')
          : [mainImage];

        // Extract price
        const price = typeof product.price === 'number'
          ? product.price.toString()
          : product.priceMin?.toString() || '0';

        // Extract SKU from first variant
        const sku = (product.variants && product.variants.length > 0 && product.variants[0].sku)
          || product.handle?.split('-').pop()
          || '';

        // Extract HP and temperature type
        const hp = extractHP(product);
        const tempType = extractTempType(product);

        // Build features object
        const features = {
          hp,
          temperatureType: tempType,
          specifications: product.specifications || {},
          features: product.features || [],
          cutSheetUrl: product.cutSheetUrl || null,
          manualUrl: product.manualUrl || null,
          warranty: product.warranty || null,
          variants: product.variants || [],
          options: product.options || [],
          vendor: product.vendor || 'Turbo Air',
          productType: product.type || 'Condensing Units',
          tags: product.tags || [],
          available: product.available !== false,
          publishedAt: product.publishedAt,
          sourceUrl: product.url
        };

        // Build documents array
        const documents = [];

        // Add cut sheet if available
        if (product.cutSheetUrl) {
          documents.push({
            name: 'Cut Sheet',
            url: product.cutSheetUrl
          });
        }

        // Add user manual if available
        if (product.manualUrl) {
          documents.push({
            name: 'User Manual',
            url: product.manualUrl
          });
        }

        // Add warranty document (standard for all Turbo Air products)
        documents.push({
          name: 'Warranty',
          url: 'https://cdn.shopify.com/s/files/1/0379/1801/5627/files/Turbo_Air_Warranty.pdf'
        });

        // Prepare product data
        const productData = {
          title: product.title,
          slug,
          brand: 'Turbo Air',
          sku,
          price,
          images,
          description: product.descriptionHtml || product.description || '',
          keyFeatures: product.features?.join('\n') || '',
          specs: product.specifications || null,
          features,
          documents,
          categoryId: category.id,
          type: 'condensing-unit',
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
    console.log('   http://localhost:3000/condensing-units\n');

  } catch (error) {
    console.error('💥 Fatal error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the import
importTurboAirProducts();
