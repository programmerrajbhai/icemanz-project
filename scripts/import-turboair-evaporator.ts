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

// Function to extract BTU capacity from title or key features
function extractBTU(product: any): string {
  const title = product.title.toLowerCase();
  const keyFeatures = (product.key_features || []).join(' ').toLowerCase();

  // Try to extract from title or key features
  const btuMatch = (title + ' ' + keyFeatures).match(/(\d+,?\d+)\s*btu/i);
  if (btuMatch) {
    return btuMatch[1].replace(',', '');
  }

  return '0';
}

// Function to extract fan count
function extractFanCount(product: any): number {
  const title = product.title.toLowerCase();
  const match = title.match(/(\d+)\s*fan/i);
  return match ? parseInt(match[1]) : 1;
}

// Function to extract voltage
function extractVoltage(product: any): string {
  const keyFeatures = (product.key_features || []).join(' ');
  const voltageMatch = keyFeatures.match(/(\d+V\/\dPh\/\d+Hz)/i);
  return voltageMatch ? voltageMatch[1] : '115V/1Ph/60Hz';
}

// Function to determine defrost type
function extractDefrostType(product: any): string {
  const title = product.title.toLowerCase();
  if (title.includes('electric defrost')) {
    return 'Electric Defrost';
  }
  return 'Air Defrost';
}

// Function to determine profile type
function extractProfileType(product: any): string {
  const title = product.title.toLowerCase();
  if (title.includes('low profile')) {
    return 'Low Profile';
  }
  return 'Standard Profile';
}

async function importTurboAirEvaporatorProducts() {
  console.log('🚀 Starting Turbo Air Evaporator Products Import...\n');

  try {
    // Read the JSON file
    const jsonPath = path.join(process.cwd(), 'data', 'turbo-air-evaporator-products.json');
    console.log(`📖 Reading products from: ${jsonPath}`);

    if (!fs.existsSync(jsonPath)) {
      console.error('❌ File not found:', jsonPath);
      console.log('\n💡 Please make sure the file exists at: data/turbo-air-evaporator-products.json\n');
      return;
    }

    const jsonData = fs.readFileSync(jsonPath, 'utf-8');
    const products = JSON.parse(jsonData);

    console.log(`✅ Found ${products.length} products in JSON file\n`);

    // Get or create Refrigeration Equipment category
    let refrigerationCategory = await prisma.category.findUnique({
      where: { slug: 'refrigeration-equipment' }
    });

    if (!refrigerationCategory) {
      refrigerationCategory = await prisma.category.create({
        data: {
          name: 'Refrigeration Equipment',
          slug: 'refrigeration-equipment'
        }
      });
      console.log('✨ Created category: Refrigeration Equipment');
    }

    // Get or create Evaporation Units category (use existing one)
    let evaporationCategory = await prisma.category.findUnique({
      where: { slug: 'evaporation-units' }
    });

    if (!evaporationCategory) {
      evaporationCategory = await prisma.category.create({
        data: {
          name: 'Evaporation Units',
          slug: 'evaporation-units',
          parentId: refrigerationCategory.id
        }
      });
      console.log('✨ Created subcategory: Evaporation Units');
    } else {
      console.log('✅ Using existing category: Evaporation Units');
    }

    console.log('\n📦 Importing products...\n');

    let imported = 0;
    let updated = 0;
    let skipped = 0;

    for (const product of products) {
      try {
        // Generate slug
        const slug = product.handle || generateSlug(product.title);

        // Extract main image
        const mainImage = product.images && product.images.length > 0
          ? product.images[0].src
          : '/Walk-in-Cooler-Freezer/category/condensingUnits/TS-MR_XR1-600x600-1.jpg';

        // Extract all images
        const images = product.images && product.images.length > 0
          ? product.images.map((img: any) => img.src)
          : ['/Walk-in-Cooler-Freezer/category/condensingUnits/TS-MR_XR1-600x600-1.jpg'];

        // Extract price from first variant
        const price = product.variants && product.variants.length > 0
          ? product.variants[0].price
          : '0';

        // Extract SKU
        const sku = (product.variants && product.variants.length > 0)
          ? product.variants[0].sku
          : product.handle?.split('-').pop()?.toUpperCase() || '';

        // Extract technical specifications
        const btuCapacity = extractBTU(product);
        const fanCount = extractFanCount(product);
        const voltage = extractVoltage(product);
        const defrostType = extractDefrostType(product);
        const profileType = extractProfileType(product);

        // Build features object
        const features = {
          btuCapacity,
          fanCount,
          voltage,
          defrostType,
          profileType,
          specifications: product.specifications || {},
          vendor: product.vendor || 'Turbo Air',
          productType: product.product_type || 'Evaporator Coil',
          tags: product.tags || [],
          available: product.variants?.[0]?.available !== false,
          publishedAt: product.published_at,
          sourceUrl: product.url,
          modelSeries: sku.startsWith('ADR') ? 'ADR Series (Air Defrost)' : 'LED Series (Electric Defrost)'
        };

        // Build documents array - filter only PDF documents
        const documents = product.documents
          ?.filter((doc: any) => doc.href && doc.href.includes('.pdf'))
          .map((doc: any) => ({
            name: doc.name,
            url: doc.href
          })) || [];

        // Add spec sheet if not already in documents
        if (!documents.find((d: any) => d.name === 'Spec Sheet')) {
          const cutSheet = documents.find((d: any) => d.name === 'Cut Sheet');
          if (cutSheet) {
            documents.push({
              name: 'Spec Sheet',
              url: cutSheet.url
            });
          }
        }

        // Build detailed features list
        const detailedFeatures = product.features || [];

        // Build key features description
        const keyFeaturesText = product.key_features && product.key_features.length > 0
          ? product.key_features[0]
          : `${btuCapacity} BTU, ${profileType}, ${defrostType}, ${fanCount} Fan${fanCount > 1 ? 's' : ''}, ${voltage}`;

        // Build description - combine body_html and features
        let description = product.body_html || '';
        if (!description && product.features && product.features.length > 0) {
          description = `<h4>Features</h4><ul>${product.features.map((f: string) => `<li>${f}</li>`).join('')}</ul>`;
        }

        // Build warranty array
        const warranty = product.warranty && product.warranty.length > 0
          ? product.warranty.filter((w: string) => w && !w.includes('Cut Sheet') && !w.includes('User Manual'))
          : ['1 Year Fan Motor and Parts Warranty'];

        // Prepare product data
        const productData = {
          title: product.title,
          slug,
          brand: 'Turbo Air',
          sku,
          price,
          images,
          description,
          keyFeatures: keyFeaturesText,
          detailedFeatures,
          specs: product.specifications || null,
          features,
          documents,
          warranty,
          categoryId: evaporationCategory.id,
          type: 'evaporator-coil',
          condition: 'New',
          badge: btuCapacity && parseInt(btuCapacity) > 10000 ? 'HIGH CAPACITY' :
            defrostType === 'Electric Defrost' ? 'ELECTRIC DEFROST' : null
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
          console.log(`✅ Imported: ${product.title} (${sku}) - $${price}`);
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
    console.log('   http://localhost:3000/refrigeration-equipment/evaporation-units\n');

  } catch (error) {
    console.error('💥 Fatal error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the import
importTurboAirEvaporatorProducts();
