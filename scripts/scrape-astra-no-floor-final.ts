import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

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

function fetchProductHandlesFromPage(page: number): string[] {
  const url = `https://www.atlanticse.com/collections/walk-in-coolers?sort_by=manual&filter.p.vendor=Astra&filter.p.m.custom.floor=Without+Floor&page=${page}`;

  try {
    const command = `curl -s '${url}' | grep -o '/products/[^"?]*' | cut -d '/' -f 3 | sort -u`;
    const output = execSync(command, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
    return output.trim().split('\n').filter(h => h.length > 0);
  } catch (error) {
    console.error(`Error fetching page ${page}:`, error);
    return [];
  }
}

async function getAllProductHandles(): Promise<string[]> {
  const allHandles = new Set<string>();

  console.log('Fetching product handles from all pages...\n');

  for (let page = 1; page <= 15; page++) {
    console.log(`Fetching page ${page}...`);
    const handles = fetchProductHandlesFromPage(page);

    if (handles.length === 0) {
      console.log(`No products found on page ${page}. Stopping.`);
      break;
    }

    let newCount = 0;
    handles.forEach(h => {
      if (!allHandles.has(h)) {
        allHandles.add(h);
        newCount++;
      }
    });

    console.log(`  Found ${newCount} new products (${allHandles.size} total)`);
  }

  console.log(`\n✓ Total unique products found: ${allHandles.size}\n`);
  return Array.from(allHandles);
}

async function fetchProductDetails(handle: string): Promise<ShopifyProduct | null> {
  try {
    const url = `https://www.atlanticse.com/products/${handle}.json`;
    const command = `curl -s '${url}'`;
    const output = execSync(command, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
    const json = JSON.parse(output);
    return json.product;
  } catch (error) {
    console.error(`Error fetching product ${handle}:`, error);
    return null;
  }
}

function extractDimensions(title: string): string | null {
  const match = title.match(/(\d+)\s*[xX×]\s*(\d+)/);
  if (match) {
    return `${match[1]}' x ${match[2]}'`;
  }
  return null;
}

function determineBadge(tags: string[] | string, title: string): string {
  const tagArray = Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',') : []);
  if (tagArray.some(t => t.toLowerCase().includes('quickship') || t.toLowerCase().includes('quick-ship'))) {
    return 'QuickShip';
  }
  if (title.toLowerCase().includes('custom')) {
    return 'Custom';
  }
  return 'New';
}

function hasVariants(product: ShopifyProduct): boolean {
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

function cleanDescription(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 800);
}

async function main() {
  console.log('='.repeat(60));
  console.log('Astra No Floor Products Import Script');
  console.log('='.repeat(60));
  console.log();

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
    console.log('✓ Category created\n');
  }

  // Get all product handles
  const handles = await getAllProductHandles();

  if (handles.length === 0) {
    console.log('❌ No products found!');
    return;
  }

  console.log('Starting product import...\n');

  let imported = 0;
  let skipped = 0;
  let errors = 0;
  let withOptions = 0;
  let addToCart = 0;

  for (let i = 0; i < handles.length; i++) {
    const handle = handles[i];

    try {
      console.log(`[${i + 1}/${handles.length}] Processing: ${handle}`);

      // Fetch product details
      const shopifyProduct = await fetchProductDetails(handle);

      if (!shopifyProduct) {
        console.log(`  ❌ Failed to fetch product details`);
        errors++;
        continue;
      }

      const slug = generateSlug(shopifyProduct.title);

      // Check if already exists
      const existing = await prisma.product.findUnique({
        where: { slug }
      });

      if (existing) {
        console.log(`  ⏭️  Already exists`);
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

      // Clean description
      const description = cleanDescription(shopifyProduct.body_html) ||
        `The ${shopifyProduct.title} is a commercial walk-in cooler designed for restaurants, delis, supermarkets, and foodservice operations.`;

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
        withOptions++;
      } else {
        addToCart++;
      }

      // Create product
      await prisma.product.create({
        data: {
          title: shopifyProduct.title,
          slug,
          brand: 'Astra',
          sku,
          badge,
          description,
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

      console.log(`  ✓ Imported ${hasOptions ? '(CHOOSE OPTION)' : '(ADD TO CART)'}`);
      imported++;

    } catch (error) {
      console.log(`  ❌ Error:`, error);
      errors++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('IMPORT SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total products found:     ${handles.length}`);
  console.log(`Successfully imported:    ${imported}`);
  console.log(`  - With "Add to Cart":   ${addToCart}`);
  console.log(`  - With "Choose Option": ${withOptions}`);
  console.log(`Skipped (already exist):  ${skipped}`);
  console.log(`Errors:                   ${errors}`);
  console.log('='.repeat(60));
  console.log('\n✅ Import complete!');
}

main()
  .catch((e) => {
    console.error('\n❌ Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
