import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import * as cheerio from 'cheerio';

const prisma = new PrismaClient();

interface ProductData {
  title: string;
  slug: string;
  brand: string;
  sku: string;
  price: string;
  images: string[];
  description: string;
  keyFeatures: string;
  specs: any;
  productOptions: any;
  type: string;
  categoryId: string;
}

// Function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Function to extract price from text
function extractPrice(priceText: string): string {
  const match = priceText.match(/\$?([\d,]+\.?\d*)/);
  return match ? match[1].replace(/,/g, '') : '0';
}

// Function to scrape a single product page
async function scrapeProductPage(url: string): Promise<ProductData | null> {
  try {
    console.log(`Scraping product: ${url}`);
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);

    // Extract basic info
    const title = $('h1').first().text().trim() || '';
    const priceText = $('.price__regular .price-item--regular').text().trim() ||
      $('.price-item--regular').text().trim() ||
      $('[class*="price"]').first().text().trim() || '0';
    const price = extractPrice(priceText);

    // Extract SKU from title or page
    const skuMatch = title.match(/([A-Z]{3}\d+X?\d*[A-Z]?)/);
    const sku = skuMatch ? skuMatch[1] : '';

    // Extract images
    const images: string[] = [];
    $('img[src*="cdn.shopify"]').each((_, el) => {
      const src = $(el).attr('src');
      if (src && !src.includes('icon') && !src.includes('logo')) {
        const fullSrc = src.startsWith('//') ? 'https:' + src : src;
        const cleanSrc = fullSrc.split('?')[0];
        if (!images.includes(cleanSrc)) {
          images.push(cleanSrc);
        }
      }
    });

    // Extract description
    let description = '';
    $('.product__description, .product-single__description, [class*="description"]').each((_, el) => {
      const text = $(el).text().trim();
      if (text.length > description.length) {
        description = text;
      }
    });
    description = description.substring(0, 5000);

    // Extract key features
    const keyFeatures: string[] = [];
    $('ul li').each((_, el) => {
      const text = $(el).text().trim();
      if (text.length > 10 && text.length < 300 && !text.toLowerCase().includes('add to cart')) {
        keyFeatures.push(text);
      }
    });

    // Extract specifications
    const specs: any = {};
    $('.product-specs tr, table tr').each((_, el) => {
      const cells = $(el).find('td, th');
      if (cells.length >= 2) {
        const key = $(cells[0]).text().trim();
        const value = $(cells[1]).text().trim();
        if (key && value) {
          specs[key] = value;
        }
      }
    });

    // Extract product options (variants)
    const productOptions: any = {};

    // Check for radio button options
    $('.product-form__input').each((_, el) => {
      const legend = $(el).find('legend').text().trim();
      const options: string[] = [];
      $(el).find('label').each((_, label) => {
        const optText = $(label).text().trim();
        if (optText && optText !== 'Select') {
          options.push(optText);
        }
      });
      if (legend && options.length > 0) {
        productOptions[legend] = options;
      }
    });

    // Check for select options
    $('select').each((_, el) => {
      const label = $(el).prev('label').text().trim() ||
        $(el).closest('.product-form__input').find('legend').text().trim() ||
        $(el).attr('data-label') || '';
      const options: string[] = [];
      $(el).find('option').each((_, opt) => {
        const optText = $(opt).text().trim();
        if (optText && optText !== 'Select' && optText !== '') {
          options.push(optText);
        }
      });
      if (label && options.length > 0) {
        productOptions[label] = options;
      }
    });

    const slug = generateSlug(title);

    return {
      title,
      slug,
      brand: 'Astra',
      sku,
      price,
      images: images.slice(0, 10),
      description,
      keyFeatures: keyFeatures.slice(0, 20).join('\n'),
      specs,
      productOptions: Object.keys(productOptions).length > 0 ? productOptions : null,
      type: 'walk-in-combo',
      categoryId: '' // Will be set later
    };
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    return null;
  }
}

// Function to scrape product links from collection page
async function scrapeCollectionPage(pageNum: number): Promise<string[]> {
  try {
    const url = `https://www.atlanticse.com/collections/walk-in-freezers?sort_by=manual&filter.p.vendor=Astra&filter.v.price.gte=&filter.v.price.lte=&filter.p.m.custom.floor=With+Floor&page=${pageNum}`;
    console.log(`Scraping collection page ${pageNum}: ${url}`);

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const productLinks: string[] = [];

    // Extract product links
    $('a[href*="/products/"]').each((_, el) => {
      const href = $(el).attr('href');
      if (href && !href.includes('javascript') && !productLinks.includes(href)) {
        const fullUrl = href.startsWith('http') ? href : `https://www.atlanticse.com${href}`;
        productLinks.push(fullUrl);
      }
    });

    // Remove duplicates
    return [...new Set(productLinks)];
  } catch (error) {
    console.error(`Error scraping page ${pageNum}:`, error);
    return [];
  }
}

// Main scraping function
async function main() {
  console.log('Starting Astra Walk-In Combo (Cooler & Freezer) product scraper...\n');

  try {
    // Use the existing category ID
    const categoryId = '424fcc52-5dce-4e80-be39-55ef4b0dbdbf'; // walk-in-combo-cooler-freezer
    console.log(`Using category ID: ${categoryId}\n`);

    // Collect all product URLs
    const allProductUrls: string[] = [];
    let pageNum = 1;
    let hasMorePages = true;

    // Scrape collection pages to get all product links
    while (hasMorePages && allProductUrls.length < 150) {
      const productLinks = await scrapeCollectionPage(pageNum);

      if (productLinks.length === 0) {
        hasMorePages = false;
      } else {
        allProductUrls.push(...productLinks);
        console.log(`Found ${productLinks.length} combo products on page ${pageNum}`);
        console.log(`Total combo products found: ${allProductUrls.length}\n`);
        pageNum++;

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    console.log(`\nTotal unique combo product URLs collected: ${allProductUrls.length}\n`);

    // Scrape each product and save to database
    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < allProductUrls.length; i++) {
      const url = allProductUrls[i];
      console.log(`\n[${i + 1}/${allProductUrls.length}] Processing: ${url}`);

      try {
        const productData = await scrapeProductPage(url);

        if (productData) {
          // Only process combo products (check title for "Combo" keyword)
          if (!productData.title.toLowerCase().includes('combo') && !productData.title.toLowerCase().includes('cmb')) {
            skippedCount++;
            console.log(`⊗ Skipped (not a combo): ${productData.title}`);
            continue;
          }

          productData.categoryId = categoryId;

          // Check if product already exists
          const existingProduct = await prisma.product.findUnique({
            where: { slug: productData.slug }
          });

          if (existingProduct) {
            // Update existing product
            await prisma.product.update({
              where: { slug: productData.slug },
              data: productData
            });
            console.log(`✓ Updated: ${productData.title}`);
          } else {
            // Create new product
            await prisma.product.create({
              data: productData
            });
            console.log(`✓ Created: ${productData.title}`);
          }

          successCount++;
        } else {
          errorCount++;
          console.log(`✗ Failed to scrape product`);
        }

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 3000));
      } catch (error) {
        errorCount++;
        console.error(`✗ Error processing product:`, error);
      }
    }

    console.log('\n========================================');
    console.log('Scraping completed!');
    console.log(`Total URLs processed: ${allProductUrls.length}`);
    console.log(`Combo products successfully imported: ${successCount}`);
    console.log(`Skipped (not combo): ${skippedCount}`);
    console.log(`Errors: ${errorCount}`);
    console.log('========================================\n');

  } catch (error) {
    console.error('Fatal error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
main();
