import { PrismaClient } from '@prisma/client';
import * as https from 'https';

const prisma = new PrismaClient();

interface ShopifyProduct {
  id: number;
  title: string;
  handle: string;
  vendor: string;
  product_type: string;
  variants: Array<{
    id: number;
    title: string;
    price: string;
    sku: string;
    available: boolean;
  }>;
  images: Array<{
    src: string;
    alt: string | null;
  }>;
  body_html: string;
  tags: string[];
}

function fetchUrl(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function getAllProductHandles(): Promise<string[]> {
  const baseUrl = 'https://www.atlanticse.com/collections/walk-in-freezers?sort_by=manual&filter.p.vendor=Astra&filter.p.m.custom.floor=With+Floor';
  const handles = new Set<string>();

  // Fetch multiple pages to get all products (177 products, ~50 per page = ~4 pages)
  for (let page = 1; page <= 10; page++) {
    try {
      console.log(`Fetching page ${page}...`);
      const html = await fetchUrl(`${baseUrl}&page=${page}`);

      // Extract product handles from /products/...
      const regex = /\/products\/([^?"\s]+)/g;
      let match;
      let pageHandles = 0;

      while ((match = regex.exec(html)) !== null) {
        const handle = match[1];
        if (!handles.has(handle)) {
          handles.add(handle);
          pageHandles++;
        }
      }

      console.log(`  Found ${pageHandles} new products on page ${page} (total: ${handles.size})`);

      // If we got less than 10 products on this page, we've likely reached the end
      if (pageHandles < 10) {
        console.log('Reached end of collection');
        break;
      }

      // Rate limiting between page fetches
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.error(`Error fetching page ${page}:`, error);
    }
  }

  console.log(`\nFound ${handles.size} unique product handles`);
  return Array.from(handles);
}

async function fetchProductDetails(handle: string): Promise<ShopifyProduct | null> {
  try {
    const url = `https://www.atlanticse.com/products/${handle}.json`;
    const data = await fetchUrl(url);
    const json = JSON.parse(data);
    return json.product;
  } catch (error) {
    console.error(`Error fetching product ${handle}:`, error);
    return null;
  }
}

function extractDimensions(title: string): string | null {
  // Extract dimensions like "5 x 6", "10 x 12", etc.
  const match = title.match(/(\d+)\s*[xX×]\s*(\d+)/);
  if (match) {
    return `${match[1]}' x ${match[2]}'`;
  }
  return null;
}

function determineBadge(tags: string[], title: string): string {
  if (tags.some(t => t.toLowerCase().includes('quickship') || t.toLowerCase().includes('quick-ship'))) {
    return 'QuickShip';
  }
  if (title.toLowerCase().includes('custom')) {
    return 'Custom';
  }
  return 'New';
}

function hasVariants(product: ShopifyProduct): boolean {
  // Check if product has meaningful variants (not just "Default Title")
  return product.variants.length > 1 ||
    (product.variants.length === 1 && product.variants[0].title !== 'Default Title');
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

async function main() {
  console.log('Starting Astra Walk-In Freezer With Floor products scrape...');
  console.log('Target: https://www.atlanticse.com/collections/walk-in-freezers?filter.p.vendor=Astra&filter.p.m.custom.floor=With+Floor');

  // Find or create the category
  let category = await prisma.category.findUnique({
    where: { slug: 'walk-in-freezer-with-floor' }
  });

  if (!category) {
    console.log('Creating walk-in-freezer-with-floor category...');
    category = await prisma.category.create({
      data: {
        name: 'Walk-In Freezer With Floor',
        slug: 'walk-in-freezer-with-floor'
      }
    });
  }

  console.log(`✓ Category ready: ${category.name} (${category.slug})\n`);

  // Get all product handles
  const handles = await getAllProductHandles();
  console.log(`\nFetching details for ${handles.length} products...\n`);

  let imported = 0;
  let skipped = 0;
  let errors = 0;

  for (const handle of handles) {
    try {
      // Fetch product details
      const shopifyProduct = await fetchProductDetails(handle);

      if (!shopifyProduct) {
        errors++;
        continue;
      }

      const slug = generateSlug(shopifyProduct.title);

      // Check if already exists
      const existing = await prisma.product.findUnique({
        where: { slug }
      });

      if (existing) {
        console.log(`⏭️  Skipped (exists): ${shopifyProduct.title}`);
        skipped++;
        continue;
      }

      // Get first variant price
      const price = shopifyProduct.variants[0]?.price || '0.00';
      const sku = shopifyProduct.variants[0]?.sku || '';

      // Extract images
      const images = shopifyProduct.images.map(img => img.src);

      // Determine if product has variants
      const hasOptions = hasVariants(shopifyProduct);

      // Extract dimensions
      const dimensions = extractDimensions(shopifyProduct.title);

      // Determine badge
      const badge = determineBadge(shopifyProduct.tags, shopifyProduct.title);

      // Clean description (remove HTML tags)
      const description = shopifyProduct.body_html
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .trim()
        .substring(0, 500); // Limit to 500 chars

      // Prepare product options if variants exist
      let productOptions = null;
      if (hasOptions) {
        productOptions = {
          hasVariants: true,
          variants: shopifyProduct.variants.map(v => ({
            id: v.id.toString(),
            title: v.title,
            price: v.price,
            sku: v.sku,
            available: v.available
          }))
        };
      }

      // Create product
      await prisma.product.create({
        data: {
          title: shopifyProduct.title,
          slug,
          brand: 'Astra',
          sku,
          badge,
          description: description || `The ${shopifyProduct.title} is a commercial walk-in freezer with insulated floor designed for restaurants, delis, supermarkets, and foodservice operations.`,
          keyFeatures: 'Quick-ship walk-in freezer box with floor • 4" thick polyurethane insulation • Modular cam-lock panels • Insulated floor system • Compatible with top-mount or remote refrigeration',
          condition: 'New',
          type: 'Walk-In Freezer With Floor',
          price,
          images,
          detailedFeatures: [
            '4" Thick Foamed-In-Place Polyurethane Insulation',
            'Insulated floor system included',
            'Modular cam-lock panel system',
            'Tongue-and-groove construction',
            'Pre-painted galvanized steel finish',
            'Self-closing flush-mounted door',
            'Compatible with top-mount or remote refrigeration',
            'R27 insulation rating'
          ],
          specs: {
            brand: 'Astra',
            condition: 'New',
            leadTime: 'Usually Ships in 2 - 5 Days',
            dimensions: dimensions || 'Various sizes available',
            type: 'With Floor',
            temperature: 'Freezer (-10°F to 0°F)'
          },
          productOptions: productOptions || undefined,
          features: {
            panels: [
              '4" Thick Foamed-In-Place Polyurethane Insulation',
              'Cam-Lock Panels, Tongue & Groove Design',
              '24 Gauge Pre-Painted White Galvanized Steel',
              'R27 Insulation Rating',
              '10 Year Panel Warranty'
            ],
            floor: [
              'Insulated floor system included',
              'Heavy-duty construction',
              'Seamless integration with wall panels'
            ],
            doors: [
              '30" or 36" wide doors available',
              'Self-Closing, Flush-Mounted Doors',
              'Keyed Locking Door Handle',
              'Heavy-Duty Hinges',
              'Low-temperature rated'
            ]
          },
          warranty: [
            '10 Year Panel Warranty',
            '1 Year Parts Warranty on Doors',
            '2 Year Parts and 1 Year Labor Warranty on Top-Mount Refrigeration'
          ],
          documents: [
            {
              name: 'Spec Sheet',
              url: 'https://cdn.shopify.com/s/files/1/0719/2369/5846/files/astra-spec-sheet.pdf'
            },
            {
              name: 'Warranty',
              url: 'https://cdn.shopify.com/s/files/1/0719/2369/5846/files/LIMITEDPANELWARRANTY.pdf'
            },
            {
              name: 'About Astra',
              url: 'https://cdn.shopify.com/s/files/1/0719/2369/5846/files/Company-Material-AboutUs.pdf'
            }
          ],
          categoryId: category.id
        }
      });

      console.log(`✓ Imported: ${shopifyProduct.title} ${hasOptions ? '(Choose Options)' : '(Add to Cart)'}`);
      imported++;

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
      console.error(`Error processing ${handle}:`, error);
      errors++;
    }
  }

  console.log('\n=== Import Summary ===');
  console.log(`Total products found: ${handles.length}`);
  console.log(`Successfully imported: ${imported}`);
  console.log(`Skipped (already exist): ${skipped}`);
  console.log(`Errors: ${errors}`);
  console.log('\n✓ Import complete!');
  console.log(`\nView products at: http://localhost:3000/walk-in-cooler-freezer/walk-in-freezer-with-floor`);
}

main()
  .catch((e) => {
    console.error('Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
