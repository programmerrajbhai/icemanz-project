/**
 * Astra Products FULL Scraper for atlanticse.com
 *
 * Phase 1: Pull core product data (title, price, images, variants, description)
 *          from the Shopify storefront JSON API.
 * Phase 2: For each product, fetch the actual product page HTML and parse
 *          the extra sections that are NOT in products.json:
 *            - Product Specifications box (refrigeration-builder-specs)
 *            - Walk-In Cooler & Freezer FAQs
 *            - Standard Features (Panels / Doors, with images)
 *            - Refrigeration Options (Top Mount / Remote, with images)
 *            - Additional Options (image gallery)
 *            - Warranty (bullet list)
 *            - Resources & Documents (PDF links + preview images)
 *            - Product Certifications (logo images)
 *
 * Usage:
 *   npm install axios cheerio
 *   node scripts/scrape-astra-full.js
 *
 * Output:
 *   data/astra-products-full.json
 */

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const COLLECTION_JSON_URL = 'https://www.atlanticse.com/collections/walk-in-coolers/products.json';
const LIMIT_PER_PAGE = 250;
const TARGET_VENDOR = 'astra';
const DELAY_LIST_MS = 600;      // between products.json page requests
const DELAY_DETAIL_MS = 1200;   // between individual product page requests (be gentle, 642 requests)
const OUTPUT_DIR = 'data';
const OUTPUT_FILE = 'astra-products-full.json';
const SAVE_EVERY = 20; // write progress to disk every N products, in case of interruption

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

async function fetchAllAstraProducts() {
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
  const astra = all.filter((p) => (p.vendor || '').toLowerCase() === TARGET_VENDOR);
  console.log(`[list] astra products: ${astra.length}`);
  return astra.map((p) => ({
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
  return src;
}

function findCardByTitle($, titleText) {
  // Matches both plain card__header layout and card__collapsible-button layout
  let found = null;
  $('.card').each((_, el) => {
    const card = $(el);
    const titleEl = card.find('.card__title').first();
    if (titleEl.length && titleEl.text().trim() === titleText) {
      found = card;
      return false; // break
    }
  });
  return found;
}

function parseProductPage(html, productUrl) {
  const $ = cheerio.load(html);
  const result = {
    specifications: {},
    faqs: [],
    standard_features_html: null,
    refrigeration_options_html: null,
    additional_options_html: null,
    warranty: [],
    resources: [],
    certifications: [],
    configurable_properties: {},
    refrigeration_choice: null,
    addons: [],
    layouts: [],
  };

  // Configurable dropdowns: Door Hinge, Indoor/Outdoor, Door Size, Floor Type
  $('.refrigeration-builder-property').each((_, el) => {
    const prop = $(el);
    const titleEl = prop.find('.refrigeration-builder-property__title').first();
    const title = titleEl.text().trim();
    if (!title) return;
    const select = prop.find('select').first();
    if (!select.length) return;
    const options = [];
    select.find('option').each((__, optEl) => {
      const opt = $(optEl);
      options.push({
        value: opt.attr('value'),
        label: opt.text().trim(),
        selected: opt.attr('selected') !== undefined,
        variant_id: opt.attr('data-rain-roof-variant-id') || opt.attr('data-door-upgrade-variant-id') || opt.attr('data-floor-variant-id') || null,
      });
    });
    if (options.length) result.configurable_properties[title] = options;
  });

  // Refrigeration select (Box Only / Top Mount / Remote)
  const refrigSelect = $('[data-rb-refrigeration-select]').first();
  if (refrigSelect.length) {
    const options = [];
    refrigSelect.find('option').each((_, optEl) => {
      const opt = $(optEl);
      options.push({
        value: opt.attr('value'),
        label: opt.text().trim(),
        selected: opt.attr('selected') !== undefined,
        price_cents: opt.attr('data-rb-price') ? Number(opt.attr('data-rb-price')) : null,
        variant_id: opt.attr('data-rb-top-mount-id') || null,
        variant_title: opt.attr('data-rb-top-mount-name') || null,
      });
    });
    result.refrigeration_choice = options;
  }

  // Add-Ons (LED Light, Door Kick Plate, Exterior Ramp etc.)
  $('.refrigeration-builder__option--addon').each((_, el) => {
    const addon = $(el);
    const name = addon.find('.refrigeration-builder__label > span').first().text().trim();
    const priceText = addon.find('.refrigeration-builder__addon-price').text().trim();
    const select = addon.find('select[data-rb-addon]').first();
    result.addons.push({
      name,
      price_text: priceText,
      variant_id: select.attr('data-rb-variant-id') || null,
      price_cents: select.attr('data-rb-price') ? Number(select.attr('data-rb-price')) : null,
      max_quantity: select.find('option').length ? select.find('option').length - 1 : null,
    });
  });

  // Layout picker (visual box configuration options)
  $('.product-layout-picker__option').each((_, el) => {
    const opt = $(el);
    const value = opt.find('input.product-layout-picker__input').attr('value');
    const selected = opt.find('input.product-layout-picker__input').attr('checked') !== undefined;
    const img = opt.find('img.product-layout-picker__image');
    result.layouts.push({
      name: opt.find('.product-layout-picker__name').text().trim() || value,
      value,
      selected,
      thumbnail: absUrl(img.attr('src')),
      preview_image: absUrl(opt.find('[data-layout-preview-image]').attr('data-layout-preview-image')),
    });
  });

  // Product Specifications box
  $('.refrigeration-builder-specs__item').each((_, el) => {
    const label = $(el).find('.refrigeration-builder-specs__label').text().trim();
    const value = $(el).find('.refrigeration-builder-specs__value').text().trim();
    if (label) result.specifications[label] = value;
  });

  // FAQs
  $('.refrigeration-builder-faq__item').each((_, el) => {
    const question = $(el).find('.refrigeration-builder-faq__question').text().trim();
    const answer = $(el).find('.refrigeration-builder-faq__answer').text().trim();
    if (question) result.faqs.push({ question, answer });
  });

  // Standard Features card -> raw inner HTML of .rte block
  const standardFeaturesCard = findCardByTitle($, 'Standard Features');
  if (standardFeaturesCard) {
    const rte = standardFeaturesCard.find('.card__section.expandable-content .rte').first();
    if (rte.length) result.standard_features_html = rte.html().trim();
  }

  // Refrigeration Options card
  const refrigCard = findCardByTitle($, 'Refrigeration Options');
  if (refrigCard) {
    const rte = refrigCard.find('.card__section.expandable-content .rte').first();
    if (rte.length) result.refrigeration_options_html = rte.html().trim();
  }

  // Additional Options card (collapsible variant)
  const addOptCard = findCardByTitle($, 'Additional Options');
  if (addOptCard) {
    const rte = addOptCard.find('.card__collapsible-content .rte').first();
    if (rte.length) result.additional_options_html = rte.html().trim();
  }

  // Warranty card -> list items as plain text array
  const warrantyCard = findCardByTitle($, 'Warranty');
  if (warrantyCard) {
    warrantyCard.find('.card__collapsible-content .rte li').each((_, el) => {
      result.warranty.push($(el).text().trim());
    });
  }

  // Resources & Documents
  $('.product-documents__card').each((_, el) => {
    const href = absUrl($(el).attr('href'));
    const name = $(el).find('.product-documents__name').text().trim();
    const preview = absUrl($(el).find('.product-documents__image').attr('src'));
    result.resources.push({ name, href, preview_image: preview });
  });

  // Product Certifications
  $('.product-certificates__item img').each((_, el) => {
    result.certifications.push({
      src: absUrl($(el).attr('src')),
      alt: $(el).attr('alt') || '',
    });
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
  const products = await fetchAllAstraProducts();

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
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});