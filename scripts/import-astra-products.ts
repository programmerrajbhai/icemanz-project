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
  try {
    console.log('🚀 Starting Astra products import...');

    // Get batch parameters from command line args
    const args = process.argv.slice(2);
    let batchSize = 50; // Process 50 products at a time
    let startIndex = 0;

    if (args.length >= 2) {
      startIndex = parseInt(args[0]) || 0;
      batchSize = parseInt(args[1]) || 50;
    }

    // Read the JSON file
    const jsonFilePath = path.join(process.cwd(), 'data', 'astra-products-full.json');
    const fileContent = fs.readFileSync(jsonFilePath, 'utf-8');
    const allProducts: AstraProduct[] = JSON.parse(fileContent);

    console.log(`📦 Total products in file: ${allProducts.length}`);
    console.log(`📍 Processing batch: ${startIndex} to ${Math.min(startIndex + batchSize, allProducts.length)}`);

    // Get batch of products
    const astraProducts = allProducts.slice(startIndex, startIndex + batchSize);

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

    // Find or create subcategories based on tags
    const subcategoryMap = new Map<string, string>();

    // Create Walk-In Cooler No Floor subcategory
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
    } else {
      console.log('📁 Found existing Walk-In Cooler No Floor subcategory');
    }
    subcategoryMap.set('Astra Cooler No Floor', coolerNoFloorSubcat.id);
    subcategoryMap.set('No Floor', coolerNoFloorSubcat.id);

    let importedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    for (const astraProduct of astraProducts) {
      try {
        console.log(`\n📦 Processing: ${astraProduct.title}`);

        // Determine the appropriate category/subcategory
        let targetCategoryId = category.id;

        // Check if product has specific tags for subcategories
        if (astraProduct.tags.includes('Astra Cooler No Floor') || astraProduct.tags.includes('No Floor')) {
          targetCategoryId = coolerNoFloorSubcat.id;
        }

        // Extract key features from body_html
        const keyFeatures = extractKeyFeatures(astraProduct.body_html);

        // Build the detailed features array
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
          description: stripHtmlTags(astraProduct.body_html),
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

        // Check if product already exists
        const existingProduct = await prisma.product.findUnique({
          where: { slug: astraProduct.handle }
        });

        if (existingProduct) {
          // Update existing product
          await prisma.product.update({
            where: { slug: astraProduct.handle },
            data: productData
          });
          console.log(`✅ Updated: ${astraProduct.title}`);
          updatedCount++;
        } else {
          // Create new product
          await prisma.product.create({
            data: productData
          });
          console.log(`✅ Imported: ${astraProduct.title}`);
          importedCount++;
        }

      } catch (error) {
        console.error(`❌ Error processing ${astraProduct.title}:`, error);
        skippedCount++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('🎉 Import Summary:');
    console.log(`   ✅ Imported: ${importedCount} products`);
    console.log(`   🔄 Updated: ${updatedCount} products`);
    console.log(`   ⏭️  Skipped: ${skippedCount} products`);
    console.log(`   📊 Batch total: ${astraProducts.length} products processed`);
    console.log(`   📦 Overall progress: ${startIndex + astraProducts.length}/${allProducts.length}`);
    console.log('='.repeat(60));

    // Check if there are more products to import
    if (startIndex + batchSize < allProducts.length) {
      console.log(`\n⏭️  Run again to import next batch: npm run import:astra ${startIndex + batchSize} ${batchSize}`);
    } else {
      console.log('\n🎊 All products have been imported!');
    }

  } catch (error) {
    console.error('❌ Fatal error during import:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Helper function to extract key features from HTML
function extractKeyFeatures(html: string): string {
  if (!html) return '';

  // Extract content from <h2>Key Features</h2> section
  const keyFeaturesMatch = html.match(/<h2[^>]*>Key Features<\/h2>\s*<ul[^>]*>([\s\S]*?)<\/ul>/i);

  if (keyFeaturesMatch) {
    // Extract list items
    const listItems = keyFeaturesMatch[1].match(/<li[^>]*>([\s\S]*?)<\/li>/gi);
    if (listItems) {
      const features = listItems.map(item => {
        // Remove HTML tags but keep the text
        return stripHtmlTags(item).trim();
      });
      return features.join('\n');
    }
  }

  // Fallback: extract first paragraph
  const firstParagraph = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  if (firstParagraph) {
    return stripHtmlTags(firstParagraph[1]).substring(0, 500) + '...';
  }

  return '';
}

// Helper function to strip HTML tags
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

// Helper function to determine badge from tags
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
    console.log('\n✅ Import completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Import failed:', error);
    process.exit(1);
  });
