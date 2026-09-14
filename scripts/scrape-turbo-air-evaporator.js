/**
 * Turbo Air Evaporator Fan Products FULL Scraper for atlanticse.com
 *
 * Phase 1: Pull core product data (title, price, images, variants, description)
 *          from the Shopify storefront JSON API.
 * Phase 2: For each product, fetch the actual product page HTML and parse
 *          the extra sections:
 *            - Features (detailed bullet list)
 *            - Key Features
 *            - Specifications
 *            - Warranty information
 *            - Documents (PDF links like Cut Sheet, User Manual)
 *            - Product images
 *            - Variants and options
 *
 * Usage:
 *   npm install axios cheerio
 *   node scripts/scrape-turbo-air-evaporator.js
 *
 * Output:
 *   data/turbo-air-evaporator-products.json
 */

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const COLLECTION_JSON_URL = 'https://www.atlanticse.com/collections/turbo-air-evaporator-fan/products.json';
const LIMIT_PER_PAGE = 250;
const TARGET_VENDOR = 'turbo air'; // Case-insensitive match
const DELAY_LIST_MS = 600;      // between products.json page requests
const DELAY_DETAIL_MS = 1200;   // between individual product page requests
const OUTPUT_DIR = 'data';
const OUTPUT_FILE = 'turbo-air-evaporator-products.json';
const SAVE_EVERY = 10; // write progress to disk every N products

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Accept-Language': 'en-US,en;q=0.9',
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------- Phase 1: collection JSON ----------

async function fetchListPage(page) {
  const url = `${COLLECTION_JSON_URL}?limit=${LIMIT_PER_PAGE}&page=${page}`;
  const res = await axios.get(url, { headers: HEADERS, timeout: 30000 });
  return res.data.products || [];
}

async function fetchAllTurboAirProducts() {
  let page = 1;
  let all = [];
  while (true) {
    console.log(`[list] fetching page ${page}...`);
    const products = await fetchListPage(page);
    if (!products.length) break;
    all = all.concat(products);
    if (products.length < LIMIT_PER_PAGE) break;
    page += 1;
    await sleep(DELAY_LIST_MS);
  }
  console.log(`[list] total products (all vendors): ${all.length}`);
  const turboAir = all.filter((p) => (p.vendor || '').toLowerCase().includes('turbo air'));
  console.log(`[list] Turbo Air products: ${turboAir.length}`);
  return turboAir.map((p) => ({
    id: p.id,
    title: p.title,
    handle: p.handle,
    url: `https://www.atlanticse.com/products/${p.handle}`,
    vendor: p.vendor,
    product_type: p.product_type,
    tags: p.tags || [],
    published_at: p.published_at,
    body_html: p.body_html || '',
    options: p.options || [],
    images: (p.images || []).map((img) => ({
      id: img.id,
      src: img.src,
      width: img.width,
      height: img.height,
      alt: img.alt || '',
    })),
    variants: (p.variants || []).map((v) => ({
      id: v.id,
      title: v.title,
      sku: v.sku || '',
      price: v.price,
      compare_at_price: v.compare_at_price || null,
      available: v.available,
      option1: v.option1 || null,
      option2: v.option2 || null,
      option3: v.option3 || null,
    })),
  }));
}

// ---------- Phase 2: per-product page HTML ----------

function absUrl(src) {
  if (!src) return src;
  if (src.startsWith('//')) return 'https:' + src;
  if (src.startsWith('/')) return 'https://www.atlanticse.com' + src;
  return src;
}

function cleanText(text) {
  return text.replace(/\s+/g, ' ').trim();
}

function parseProductPage(html, productUrl) {
  const $ = cheerio.load(html);
  const result = {
    features: [],
    key_features: [],
    specifications: {},
    warranty: [],
    documents: [],
    product_images_extra: [],
  };

  // Features section - typically in a .rte or .product-single__description
  // Look for "Features" heading followed by list items
  $('.product-single__description, .rte').each((_, section) => {
    const text = $(section).text();
    if (text.includes('Features') || text.includes('features')) {
      $(section).find('ul li, ol li').each((__, li) => {
        const feature = cleanText($(li).text());
        if (feature && feature.length > 5) {
          result.features.push(feature);
        }
      });
    }
  });

  // Alternative: Look for specific Features section
  $('h2, h3, h4, strong, b').each((_, heading) => {
    const headingText = $(heading).text().trim();
    if (headingText.toLowerCase() === 'features') {
      let nextEl = $(heading).next();
      while (nextEl.length && nextEl[0].name !== 'h2' && nextEl[0].name !== 'h3') {
        if (nextEl[0].name === 'ul' || nextEl[0].name === 'ol') {
          nextEl.find('li').each((__, li) => {
            const feature = cleanText($(li).text());
            if (feature && feature.length > 5 && !result.features.includes(feature)) {
              result.features.push(feature);
            }
          });
        }
        nextEl = nextEl.next();
      }
    }
  });

  // Key Features - usually a short description or highlighted text
  $('.product-single__title + .product-single__vendor + p, .product__description p').first().each((_, p) => {
    const text = cleanText($(p).text());
    if (text && text.length > 10 && text.length < 300) {
      result.key_features.push(text);
    }
  });

  // Look for key features in any paragraph containing BTU, voltage, etc.
  $('.product-single__description p, .rte p').each((_, p) => {
    const text = cleanText($(p).text());
    if ((text.includes('BTU') || text.includes('Fan') || text.includes('Profile') || 
         text.includes('Defrost') || text.includes('Motor') || text.includes('Voltage')) 
         && text.length < 300) {
      if (!result.key_features.includes(text)) {
        result.key_features.push(text);
      }
    }
  });

  // Specifications - look for table or definition list
  $('table tr').each((_, tr) => {
    const cells = $(tr).find('td, th');
    if (cells.length >= 2) {
      const label = cleanText($(cells[0]).text());
      const value = cleanText($(cells[1]).text());
      if (label && value) {
        result.specifications[label] = value;
      }
    }
  });

  // Specifications from dl/dt/dd
  $('dl').each((_, dl) => {
    $(dl).find('dt').each((__, dt) => {
      const label = cleanText($(dt).text());
      const dd = $(dt).next('dd');
      if (dd.length) {
        result.specifications[label] = cleanText(dd.text());
      }
    });
  });

  // Warranty section
  $('h2, h3, h4, strong, b').each((_, heading) => {
    const headingText = $(heading).text().trim();
    if (headingText.toLowerCase().includes('warrant')) {
      let nextEl = $(heading).next();
      while (nextEl.length && nextEl[0].name !== 'h2' && nextEl[0].name !== 'h3') {
        if (nextEl[0].name === 'ul' || nextEl[0].name === 'ol') {
          nextEl.find('li').each((__, li) => {
            result.warranty.push(cleanText($(li).text()));
          });
        } else if (nextEl[0].name === 'p') {
          const text = cleanText(nextEl.text());
          if (text && text.length > 5) {
            result.warranty.push(text);
          }
        }
        nextEl = nextEl.next();
      }
    }
  });

  // Documents - look for PDF links
  $('a[href*=".pdf"], a[href*="/files/"]').each((_, link) => {
    const href = absUrl($(link).attr('href'));
    let name = cleanText($(link).text());
    
    // If link text is not descriptive, try parent or sibling
    if (!name || name.length < 3) {
      name = cleanText($(link).parent().text()) || cleanText($(link).prev().text()) || 'Document';
    }
    
    // Clean up common patterns
    if (name.toLowerCase().includes('cut sheet')) name = 'Cut Sheet';
    if (name.toLowerCase().includes('user manual') || name.toLowerCase().includes('manual')) name = 'User Manual';
    if (name.toLowerCase().includes('spec sheet')) name = 'Spec Sheet';
    if (name.toLowerCase().includes('installation')) name = 'Installation Guide';
    
    if (href && !result.documents.find(d => d.href === href)) {
      result.documents.push({ name, href });
    }
  });

  // Additional product images from gallery
  $('.product-single__photo img, .product__photo img').each((_, img) => {
    const src = absUrl($(img).attr('src') || $(img).attr('data-src'));
    if (src && !src.includes('cdn.shopify.com/s/files/1/')) {
      // Skip if already in main images
      return;
    }
    if (src && !result.product_images_extra.includes(src)) {
      result.product_images_extra.push(src);
    }
  });

  return result;
}

async function fetchProductDetail(url) {
  const res = await axios.get(url, { headers: HEADERS, timeout: 30000 });
  return parseProductPage(res.data, url);
}

// ---------- Main ----------

async function main() {
  const outputPath = path.join(process.cwd(), OUTPUT_DIR);
  if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath, { recursive: true });
  const outputFile = path.join(outputPath, OUTPUT_FILE);

  console.log('Phase 1: fetching product list from products.json...');
  const products = await fetchAllTurboAirProducts();

  console.log(`Phase 2: fetching ${products.length} product pages for extra details...`);
  const enriched = [];

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    process.stdout.write(`[detail] (${i + 1}/${products.length}) ${p.handle} ... `);
    try {
      const details = await fetchProductDetail(p.url);
      enriched.push({ ...p, ...details });
      console.log('ok');
    } catch (err) {
      console.log(`FAILED (${err.message})`);
      // Keep the product with core data only, so nothing is lost
      enriched.push({ ...p, scrape_error: err.message });
    }

    if ((i + 1) % SAVE_EVERY === 0 || i === products.length - 1) {
      fs.writeFileSync(outputFile, JSON.stringify(enriched, null, 2), 'utf-8');
      console.log(`   ...progress saved (${enriched.length}/${products.length})`);
    }

    await sleep(DELAY_DETAIL_MS);
  }

  console.log(`\nDone. Saved ${enriched.length} products to ${OUTPUT_DIR}/${OUTPUT_FILE}`);
  console.log(`\nSummary:`);
  console.log(`  - Total products scraped: ${enriched.length}`);
  console.log(`  - Products with features: ${enriched.filter(p => p.features && p.features.length > 0).length}`);
  console.log(`  - Products with documents: ${enriched.filter(p => p.documents && p.documents.length > 0).length}`);
  console.log(`  - Products with warranty info: ${enriched.filter(p => p.warranty && p.warranty.length > 0).length}`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
