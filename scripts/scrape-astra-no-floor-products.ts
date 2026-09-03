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
  const baseUrl = 'https://www.atlanticse.com/collections/walk-in-coolers?sort_by=manual&filter.p.vendor=Astra&filter.p.m.custom.floor=Without+Floor';
  const handles = new Set<string>();

  // Fetch multiple pages to get all products (24 products per page, ~10 pages total)
  for (let page = 1; page <= 15; page++) {
    try {
      console.log(`Fetching page ${page}...`);
      const html = await fetchUrl(`${baseUrl}&page=${page}`);

      let pageHandleCount = 0;

      // Extract product handles from /products/...
      const regex = /\/products\/([^?"\s]+)/g;
      let match;

      while ((match = regex.exec(html)) !== null) {
        const handle = match[1];
        if (!handles.has(handle)) {
          handles.add(handle);
          pageHandleCount++;
        }
      }

      console.log(`  Found ${pageHandleCount} new products on page ${page} (${handles.size} total)`);

      // If we got no new products on this page, we've reached the end
      if (pageHandleCount === 0) {
        console.log(`No more products found after page ${page - 1}`);
        break;
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.error(`Error fetching page ${page}:`, error);
    }
  }

  console.log(`\nFound ${handles.size} unique product handles total`);
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
  console.log('Starting Astra No Floor products scrape...');

  // Find or create the category
  let category = await prisma.category.findUnique({
    where: { slug: 'walk-in-cooler-no-floor' }
  });

  if (!category) {
    console.log('Creating walk-in-cooler-no-floor category...');
    category = await prisma.category.create({
      data: {
        name: 'Walk-In Cooler No Floor',
        slug: 'walk-in-cooler-no-floor'
      }
    });
  }

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
          description: description || `The ${shopifyProduct.title} is a commercial walk-in cooler designed for restaurants, delis, supermarkets, and foodservice operations.`,
          keyFeatures: 'Quick-ship walk-in cooler box • No-floor design • Modular cam-lock panels • 4" thick polyurethane insulation • Compatible with top-mount or remote refrigeration',
          condition: 'New',
          type: 'Walk-In Box Only',
          price,
          images,
          detailedFeatures: [
            '4" Thick Foamed-In-Place Polyurethane Insulation',
            'Modular cam-lock panel system',
            'Tongue-and-groove construction',
            'Pre-painted galvanized steel finish',
            'Self-closing flush-mounted door',
            'Compatible with top-mount or remote refrigeration'
          ],
          specs: {
            brand: 'Astra',
            condition: 'New',
            leadTime: 'Usually Ships in 2 - 5 Days',
            dimensions: dimensions || 'Various sizes available',
            type: 'No Floor'
          },
          productOptions: productOptions || undefined,
          features: {
            panels: [
              '4" Thick Foamed-In-Place Polyurethane Insulation',
              'Cam-Lock Panels, Tongue & Groove Design',
              '24 Gauge Pre-Painted White Galvanized Steel',
              'R27 for Coolers',
              '10 Year Panel Warranty'
            ],
            doors: [
              '30" or 36" wide doors available',
              'Self-Closing, Flush-Mounted Doors',
              'Keyed Locking Door Handle',
              'Heavy-Duty Hinges'
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

      console.log(`✓ Imported: ${shopifyProduct.title} ${hasOptions ? '(with options)' : '(add to cart)'}`);
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
  console.log('\nImport complete!');
}

main()
  .catch((e) => {
    console.error('Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
