import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface AstraProduct {
  id: number;
  title: string;
  handle: string;
  url: string;
  vendor: string;
  product_type: string;
  tags: string[];
  published_at: string;
  body_html: string;
  options: Array<{
    name: string;
    position: number;
    values: string[];
  }>;
  images: Array<{
    id: number;
    src: string;
    width: number;
    height: number;
    alt: string;
  }>;
  variants: Array<{
    id: number;
    title: string;
    sku: string;
    price: string;
    compare_at_price: string | null;
    available: boolean;
    option1: string | null;
    option2: string | null;
    option3: string | null;
  }>;
  specifications: Record<string, string>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  standard_features_html: string;
  refrigeration_options_html: string;
  additional_options_html: string;
  warranty: string[];
  resources: any[];
  certifications: Array<{
    src: string;
    alt: string;
  }>;
  configurable_properties: Record<string, Array<{
    value: string;
    label: string;
    selected: boolean;
    variant_id: string | null;
  }>>;
  refrigeration_choice: any;
  addons: Array<{
    name: string;
    price_text: string;
    variant_id: string;
    price_cents: number;
    max_quantity: number;
  }>;
  layouts: any[];
}

async function importAstraProducts() {
  const startTime = Date.now();

  try {
    console.log('🚀 Starting complete Astra products import...\n');

    // Read the JSON file
    const jsonFilePath = path.join(process.cwd(), 'data', 'astra-products-full.json');
    const fileContent = fs.readFileSync(jsonFilePath, 'utf-8');
    const astraProducts: AstraProduct[] = JSON.parse(fileContent);

    console.log(`📦 Total products to import: ${astraProducts.length}\n`);

    // Find or create the Walk-In Cooler/Freezer category
    let category = await prisma.category.findFirst({
      where: {
        slug: 'walk-in-cooler-freezer'
      }
    });

    if (!category) {
      console.log('📁 Creating Walk-In Cooler/Freezer category...');
      category = await prisma.category.create({
        data: {
          name: 'Walk-In Cooler/Freezer',
          slug: 'walk-in-cooler-freezer'
        }
      });
    }

    // Find or create subcategory
    let coolerNoFloorSubcat = await prisma.category.findFirst({
      where: {
        slug: 'walk-in-cooler-no-floor'
      }
    });

    if (!coolerNoFloorSubcat) {
      console.log('📁 Creating Walk-In Cooler No Floor subcategory...');
      coolerNoFloorSubcat = await prisma.category.create({
        data: {
          name: 'Walk-In Cooler No Floor',
          slug: 'walk-in-cooler-no-floor',
          parentId: category.id
        }
      });
    }

    let importedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;
    let processedCount = 0;

    // Process products in batches to avoid memory issues
    const BATCH_SIZE = 10;

    for (let i = 0; i < astraProducts.length; i += BATCH_SIZE) {
      const batch = astraProducts.slice(i, i + BATCH_SIZE);

      for (const astraProduct of batch) {
        try {
          processedCount++;

          // Show progress every 50 products
          if (processedCount % 50 === 0) {
            const elapsed = Math.round((Date.now() - startTime) / 1000);
            const rate = processedCount / elapsed;
            const remaining = Math.round((astraProducts.length - processedCount) / rate);
            console.log(`📊 Progress: ${processedCount}/${astraProducts.length} (${Math.round(processedCount / astraProducts.length * 100)}%) - ETA: ${remaining}s`);
          }

          // Determine the appropriate category
          let targetCategoryId = category.id;
          if (astraProduct.tags.includes('Astra Cooler No Floor') || astraProduct.tags.includes('No Floor')) {
            targetCategoryId = coolerNoFloorSubcat.id;
          }

          // Extract key features
          const keyFeatures = extractKeyFeatures(astraProduct.body_html);

          // Build detailed features
          const detailedFeatures = [
            astraProduct.standard_features_html,
            astraProduct.refrigeration_options_html,
            astraProduct.additional_options_html
          ].filter(Boolean);

          // Prepare product data
          const productData = {
            title: astraProduct.title,
            slug: astraProduct.handle,
            brand: astraProduct.vendor,
            sku: astraProduct.variants[0]?.sku || null,
            badge: determineBadge(astraProduct.tags),
            description: astraProduct.body_html, // Keep HTML format
            keyFeatures: keyFeatures,
            condition: 'New',
            type: astraProduct.product_type,
            price: astraProduct.variants[0]?.price || null,
            images: astraProduct.images.map(img => img.src),
            warranty: astraProduct.warranty,
            detailedFeatures: detailedFeatures,
            specs: astraProduct.specifications,
            documents: {
              resources: astraProduct.resources,
              certifications: astraProduct.certifications
            },
            faqs: astraProduct.faqs,
            productOptions: {
              configurable_properties: astraProduct.configurable_properties,
              refrigeration_choice: astraProduct.refrigeration_choice,
              addons: astraProduct.addons,
              variants: astraProduct.variants
            },
            features: {
              standard_features_html: astraProduct.standard_features_html,
              refrigeration_options_html: astraProduct.refrigeration_options_html,
              additional_options_html: astraProduct.additional_options_html
            },
            layouts: astraProduct.layouts,
            categoryId: targetCategoryId
          };

          // Check if product exists
          const existingProduct = await prisma.product.findUnique({
            where: { slug: astraProduct.handle }
          });

          if (existingProduct) {
            await prisma.product.update({
              where: { slug: astraProduct.handle },
              data: productData
            });
            updatedCount++;
          } else {
            await prisma.product.create({
              data: productData
            });
            importedCount++;
          }

        } catch (error: any) {
          console.error(`\n❌ Error: ${astraProduct.title} - ${error.message}`);
          skippedCount++;
        }
      }
    }

    const totalTime = Math.round((Date.now() - startTime) / 1000);

    console.log('\n' + '='.repeat(70));
    console.log('🎉 Import Complete!');
    console.log('='.repeat(70));
    console.log(`   ✅ New imports:    ${importedCount} products`);
    console.log(`   🔄 Updated:        ${updatedCount} products`);
    console.log(`   ⏭️  Skipped:        ${skippedCount} products`);
    console.log(`   📊 Total processed: ${processedCount}/${astraProducts.length}`);
    console.log(`   ⏱️  Total time:     ${totalTime} seconds`);
    console.log('='.repeat(70));

  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Helper functions
function extractKeyFeatures(html: string): string {
  if (!html) return '';
  const keyFeaturesMatch = html.match(/<h2[^>]*>Key Features<\/h2>\s*<ul[^>]*>([\s\S]*?)<\/ul>/i);
  if (keyFeaturesMatch) {
    const listItems = keyFeaturesMatch[1].match(/<li[^>]*>([\s\S]*?)<\/li>/gi);
    if (listItems) {
      const features = listItems.map(item => stripHtmlTags(item).trim());
      return features.join('\n');
    }
  }
  const firstParagraph = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  if (firstParagraph) {
    return stripHtmlTags(firstParagraph[1]).substring(0, 500) + '...';
  }
  return '';
}

function stripHtmlTags(html: string): string {
  if (!html) return '';
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function determineBadge(tags: string[]): string | null {
  if (tags.includes('new')) return 'New';
  if (tags.includes('QuickShip')) return 'Quick Ship';
  if (tags.includes('best-seller')) return 'Best Seller';
  if (tags.includes('sale')) return 'Sale';
  return null;
}

// Run the import
importAstraProducts()
  .then(() => {
    console.log('\n✅ All done! Run: npm run verify:astra to check the results\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Import failed:', error);
    process.exit(1);
  });
