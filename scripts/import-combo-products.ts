import { PrismaClient } from '@prisma/client';
import https from 'https';

const prisma = new PrismaClient();

const CATEGORY_ID = '424fcc52-5dce-4e80-be39-55ef4b0dbdbf'; // walk-in-combo-cooler-freezer

interface ShopifyProduct {
  id: number;
  title: string;
  handle: string;
  body_html: string;
  vendor: string;
  tags: string[];
  variants: {
    id: number;
    sku: string;
    price: string;
  }[];
  images: {
    src: string;
  }[];
}

function fetchShopifyProducts(): Promise<ShopifyProduct[]> {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'www.atlanticse.com',
      path: '/collections/walk-in-cooler-freezer-combo/products.json?limit=250&page=1',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*'
      }
    };

    https.get(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.products || []);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function cleanHtmlText(html: string): string {
  if (!html) return '';
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractSize(title: string): string {
  // Try 6' x 8' or 6 x 8 pattern
  const matchWithQuote = title.match(/(\d+)'\s*x\s*(\d+)'/i);
  if (matchWithQuote) {
    return `${matchWithQuote[1]}' x ${matchWithQuote[2]}'`;
  }
  const matchNoQuote = title.match(/(\d+)\s*x\s*(\d+)/i);
  if (matchNoQuote) {
    return `${matchNoQuote[1]}' x ${matchNoQuote[2]}'`;
  }
  return '';
}

function extractFloorType(title: string, bodyHtml: string, tags: string[]): string {
  const text = (title + ' ' + bodyHtml + ' ' + (tags || []).join(' ')).toLowerCase();
  if (text.includes('floorless') || text.includes('no floor') || text.includes('without floor')) {
    return 'No Floor';
  }
  return 'With Floor';
}

function extractRefrigerationType(title: string): string {
  const lower = title.toLowerCase();
  if (lower.includes('top mount') || lower.includes('top-mount') || lower.includes('top mounted')) {
    return 'Top-Mount Refrigeration';
  }
  if (lower.includes('remote')) {
    return 'Remote Refrigeration';
  }
  return 'No Refrigeration';
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function main() {
  console.log('Fetching AtlanticSE Walk-In Combo products...');
  const shopifyProducts = await fetchShopifyProducts();
  console.log(`Received ${shopifyProducts.length} total products from AtlanticSE collection.`);

  // Filter for Astra and Amerikooler
  const targetProducts = shopifyProducts.filter(p =>
    p.vendor === 'Astra' || p.vendor === 'Amerikooler'
  );
  console.log(`Filtered target products: ${targetProducts.length} (Astra & Amerikooler)`);

  let createdCount = 0;
  let updatedCount = 0;

  for (const p of targetProducts) {
    const rawDescription = cleanHtmlText(p.body_html || '');
    const description = rawDescription.slice(0, 3000) || `${p.title} - High quality commercial walk-in combo cooler & freezer unit.`;

    const size = extractSize(p.title);
    const floorType = extractFloorType(p.title, p.body_html || '', p.tags || []);
    const refrigType = extractRefrigerationType(p.title);

    const price = p.variants[0]?.price ? String(p.variants[0].price) : '0';
    const sku = p.variants[0]?.sku || '';
    const images = p.images.map(img => img.src).filter(Boolean);
    if (images.length === 0) {
      images.push('/placeholder.png');
    }

    const brand = p.vendor; // 'Astra' or 'Amerikooler'
    const slug = generateSlug(p.title);

    const detailedFeatures = [
      `Modular cam-lock panels with tongue and groove air-tight sealing`,
      `4" thick foamed-in-place polyurethane insulation`,
      `Flush self-closing door with spring assisted cam-rise hinges`,
      `Keyed locking handle with interior safety release lock`,
      `Digital LED thermometer display`,
      `NSF, UL, and DOE commercial compliance`
    ];

    if (floorType === 'No Floor') {
      detailedFeatures.push('NSF heavy duty vinyl floor screeds included for seamless ground installation');
    } else {
      detailedFeatures.push('Heavy-duty reinforced floor insulated panel designed for heavy food service storage');
    }

    if (refrigType === 'Top-Mount Refrigeration') {
      detailedFeatures.push('Includes self-contained top-mount refrigeration unit pre-charged with R-448A refrigerant');
    } else {
      detailedFeatures.push('Walk-in box only (refrigeration sold separately or customizable)');
    }

    const specs = [
      { label: 'Brand', value: brand },
      { label: 'SKU', value: sku },
      { label: 'Size', value: size || 'Standard' },
      { label: 'Floor Type', value: floorType },
      { label: 'Refrigeration', value: refrigType },
      { label: 'Condition', value: 'New' },
      { label: 'Lead Time', value: 'Usually Ships in 2 - 5 Days' }
    ];

    const featuresObj = {
      size: size,
      floorType: floorType,
      refrigerationType: refrigType,
      walkInType: 'Combo (Cooler & Freezer)'
    };

    const productData = {
      title: p.title,
      slug: slug,
      brand: brand,
      sku: sku,
      badge: 'QuickShip',
      description: description,
      keyFeatures: `${p.title} • Commercial Walk-In Combo Cooler & Freezer • ${size} • ${floorType} • ${refrigType}`,
      condition: 'New',
      type: refrigType,
      price: price,
      images: images,
      warranty: ['10 Year Panel Warranty', '1 Year Parts & Door Warranty'],
      detailedFeatures: detailedFeatures,
      specs: specs,
      features: featuresObj,
      categoryId: CATEGORY_ID
    };

    // Check if product exists by slug
    const existing = await prisma.product.findUnique({
      where: { slug: slug }
    });

    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: productData
      });
      updatedCount++;
    } else {
      await prisma.product.create({
        data: productData
      });
      createdCount++;
    }
  }

  console.log('========================================');
  console.log(`Import finished!`);
  console.log(`Created: ${createdCount}`);
  console.log(`Updated: ${updatedCount}`);
  console.log(`Total: ${createdCount + updatedCount}`);
  console.log('========================================');
}

main()
  .catch((e) => {
    console.error('Import error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
