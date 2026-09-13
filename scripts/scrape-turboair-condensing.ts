/**
 * Turbo Air Condensing Units Scraper
 * Scrapes all Turbo Air condensing units from Atlantic SE website
 * including product details, specs, features, and documents
 */

import * as cheerio from 'cheerio';
import * as fs from 'fs/promises';
import * as path from 'path';

interface Product {
  // Basic Info
  id: number;
  title: string;
  handle: string;
  vendor: string;
  type: string;
  tags: string[];

  // Pricing
  price: number;
  priceMin: number;
  priceMax: number;
  compareAtPrice: number | null;

  // Description & Content
  description: string;
  descriptionHtml: string;
  features: string[];
  keyFeatures: string;
  specifications: Record<string, string>;

  // Images
  images: string[];
  featuredImage: string;

  // Variants
  variants: any[];

  // URLs
  url: string;
  cutSheetUrl?: string;
  userManualUrl?: string;

  // Availability
  available: boolean;
  publishedAt: string;
  createdAt: string;

  // Warranty
  warranty: string[];
}

class TurboAirCondensingUnitsScraper {
  private baseUrl = 'https://www.atlanticse.com';
  private collectionUrl = '/collections/turbo-air-condensing-units';
  private delay = 2000; // 2 seconds between requests
  private maxRetries = 3;

  /**
   * Delay execution for rate limiting
   */
  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Fetch HTML content with retry logic
   */
  private async fetchWithRetry(url: string, retries = this.maxRetries): Promise<string> {
    for (let i = 0; i < retries; i++) {
      try {
        console.log(`Fetching: ${url} (attempt ${i + 1}/${retries})`);
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.text();
      } catch (error) {
        console.error(`Attempt ${i + 1} failed:`, error);
        if (i < retries - 1) {
          await this.sleep(this.delay * (i + 1)); // Exponential backoff
        } else {
          throw error;
        }
      }
    }
    throw new Error('All retry attempts failed');
  }

  /**
   * Extract product URLs from collection using Shopify JSON API
   */
  private async getProductUrls(): Promise<string[]> {
    const productUrls: string[] = [];
    let page = 1;
    let hasMorePages = true;

    console.log('Fetching all product pages...');

    while (hasMorePages) {
      try {
        const url = `${this.baseUrl}/collections/turbo-air-condensing-units/products.json?limit=250&page=${page}`;
        console.log(`Fetching page ${page}: ${url}`);

        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'application/json',
          }
        });

        if (!response.ok) {
          console.log(`Page ${page} returned ${response.status}, stopping...`);
          break;
        }

        const data = await response.json();

        if (data.products && data.products.length > 0) {
          console.log(`Page ${page}: Found ${data.products.length} products`);

          data.products.forEach((product: any) => {
            const productUrl = `${this.baseUrl}/products/${product.handle}`;
            if (!productUrls.includes(productUrl)) {
              productUrls.push(productUrl);
            }
          });

          if (data.products.length < 250) {
            hasMorePages = false;
          } else {
            page++;
            await this.sleep(1000);
          }
        } else {
          hasMorePages = false;
        }
      } catch (error) {
        console.error(`Error fetching page ${page}:`, error);
        hasMorePages = false;
      }
    }

    console.log(`Total found: ${productUrls.length} product URLs`);
    return [...new Set(productUrls)];
  }

  /**
   * Extract product data from product page
   */
  private async scrapeProductPage(url: string): Promise<Product | null> {
    try {
      await this.sleep(this.delay);
      const html = await this.fetchWithRetry(url);
      const $ = cheerio.load(html);

      // Find the product JSON data
      const productJsonScript = $('script[data-product-json]').html();
      if (!productJsonScript) {
        console.error(`No product JSON found for ${url}`);
        return null;
      }

      const productData = JSON.parse(productJsonScript);
      const rawProduct = productData.product;

      // Extract features from description HTML (don't reload into cheerio)
      const features: string[] = [];
      const descriptionHtml = rawProduct.description || '';

      // Use the main $ instance to parse description
      const $descTemp = $('<div>').html(descriptionHtml);
      $descTemp.find('li').each((_, el) => {
        const feature = $(el).text().trim();
        if (feature) {
          features.push(feature);
        }
      });

      // Extract Key Features
      let keyFeatures = '';
      const keyFeaturesMatch = descriptionHtml.match(/Key Features([\s\S]*?)(?:Warranty|Documents|$)/i);
      if (keyFeaturesMatch) {
        const $kf = $('<div>').html(keyFeaturesMatch[1]);
        keyFeatures = $kf.text().trim();
      }

      // Extract Warranty
      const warranty: string[] = [];
      const warrantyMatch = descriptionHtml.match(/Warranty([\s\S]*?)(?:Documents|$)/i);
      if (warrantyMatch) {
        const $war = $('<div>').html(warrantyMatch[1]);
        $war.find('li, p').each((_, el) => {
          const text = $(el).text().trim();
          if (text) warranty.push(text);
        });

        // If no list items, use the whole warranty text
        if (warranty.length === 0) {
          const text = $war.text().trim();
          if (text) warranty.push(text);
        }
      }

      // Extract specifications from title and description
      const specifications: Record<string, string> = {};

      // Extract HP from title
      const hpMatch = rawProduct.title.match(/(\d+(?:\.\d+)?)\s*HP/i);
      if (hpMatch) {
        specifications['Horsepower'] = hpMatch[1] + ' HP';
      }

      // Extract temperature type
      if (rawProduct.title.toLowerCase().includes('medium temp')) {
        specifications['Temperature Range'] = 'Medium Temperature';
      } else if (rawProduct.title.toLowerCase().includes('low temp')) {
        specifications['Temperature Range'] = 'Low Temperature';
      } else if (rawProduct.title.toLowerCase().includes('extra low')) {
        specifications['Temperature Range'] = 'Extra Low Temperature';
      }

      // Extract voltage from key features or description
      const voltageMatch = descriptionHtml.match(/(\d{3}-?\d{3}V\/\d+Ph\/\d+Hz)/i);
      if (voltageMatch) {
        specifications['Voltage'] = voltageMatch[1];
      }

      // Extract compressor type
      if (descriptionHtml.toLowerCase().includes('scroll compressor')) {
        specifications['Compressor Type'] = 'Scroll Compressor';
      }

      // Extract document URLs
      let cutSheetUrl: string | undefined;
      let userManualUrl: string | undefined;

      const $docs = $('<div>').html(descriptionHtml);
      $docs.find('a').each((_, el) => {
        const href = $(el).attr('href');
        const text = $(el).text().toLowerCase();
        if (href) {
          if (text.includes('cut sheet') || text.includes('spec sheet')) {
            cutSheetUrl = href.startsWith('http') ? href : this.baseUrl + href;
          } else if (text.includes('user manual') || text.includes('manual')) {
            userManualUrl = href.startsWith('http') ? href : this.baseUrl + href;
          }
        }
      });

      // Process images
      const images: string[] = [];
      if (rawProduct.media && rawProduct.media.length > 0) {
        rawProduct.media.forEach((media: any) => {
          const src = media.src.startsWith('//') ? 'https:' + media.src : media.src;
          images.push(src);
        });
      } else if (rawProduct.images && rawProduct.images.length > 0) {
        rawProduct.images.forEach((imgSrc: string) => {
          const src = imgSrc.startsWith('//') ? 'https:' + imgSrc : imgSrc;
          images.push(src);
        });
      }

      // If no images, use placeholder
      if (images.length === 0) {
        images.push('/placeholder.png');
      }

      // Process variants
      const variants = rawProduct.variants || [];

      // Build product object
      const product: Product = {
        id: rawProduct.id,
        title: rawProduct.title,
        handle: rawProduct.handle,
        vendor: rawProduct.vendor || 'Turbo Air',
        type: rawProduct.type || 'Condensing Units',
        tags: rawProduct.tags || [],

        price: rawProduct.price / 100,
        priceMin: rawProduct.price_min / 100,
        priceMax: rawProduct.price_max / 100,
        compareAtPrice: rawProduct.compare_at_price ? rawProduct.compare_at_price / 100 : null,

        description: $('<div>').html(descriptionHtml).text().replace(/\s+/g, ' ').trim(),
        descriptionHtml: descriptionHtml,
        features: features,
        keyFeatures: keyFeatures,
        specifications: specifications,

        images: images,
        featuredImage: images[0] || '/placeholder.png',

        variants: variants,

        url: url,
        cutSheetUrl: cutSheetUrl,
        userManualUrl: userManualUrl,

        available: rawProduct.available,
        publishedAt: rawProduct.published_at,
        createdAt: rawProduct.created_at,

        warranty: warranty
      };

      console.log(`✓ Scraped: ${product.title}`);
      return product;

    } catch (error) {
      console.error(`Error scraping ${url}:`, error);
      return null;
    }
  }

  /**
   * Main scraping function
   */
  async scrapeAll(): Promise<Product[]> {
    console.log('Starting Turbo Air Condensing Units scraping...\n');

    const productUrls = await this.getProductUrls();
    console.log(`\nFound ${productUrls.length} products to scrape\n`);

    const products: Product[] = [];
    for (let i = 0; i < productUrls.length; i++) {
      console.log(`\nScraping product ${i + 1}/${productUrls.length}...`);
      const product = await this.scrapeProductPage(productUrls[i]);
      if (product) {
        products.push(product);
      }
    }

    console.log(`\n✓ Successfully scraped ${products.length} products`);
    return products;
  }

  /**
   * Save products to JSON file
   */
  async saveToFile(products: Product[], filename: string): Promise<void> {
    const outputPath = path.join(process.cwd(), 'data', filename);
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, JSON.stringify(products, null, 2), 'utf-8');
    console.log(`\n✓ Saved ${products.length} products to ${outputPath}`);
  }
}

// Main execution
async function main() {
  try {
    const scraper = new TurboAirCondensingUnitsScraper();
    const products = await scraper.scrapeAll();

    // Save to JSON file
    const timestamp = new Date().toISOString().split('T')[0];
    await scraper.saveToFile(products, `turboair-condensing-${timestamp}.json`);

    // Print summary
    console.log('\n=== SCRAPING SUMMARY ===');
    console.log(`Total products: ${products.length}`);
    console.log(`Total variants: ${products.reduce((sum, p) => sum + p.variants.length, 0)}`);
    console.log(`Total images: ${products.reduce((sum, p) => sum + p.images.length, 0)}`);
    console.log(`Products with cut sheets: ${products.filter(p => p.cutSheetUrl).length}`);
    console.log(`Products with manuals: ${products.filter(p => p.userManualUrl).length}`);

    // Sample product info
    if (products.length > 0) {
      console.log('\n=== SAMPLE PRODUCT ===');
      const sample = products[0];
      console.log(`Title: ${sample.title}`);
      console.log(`Price: $${sample.price.toFixed(2)}`);
      console.log(`HP: ${sample.specifications['Horsepower'] || 'N/A'}`);
      console.log(`Temp: ${sample.specifications['Temperature Range'] || 'N/A'}`);
      console.log(`Features: ${sample.features.length}`);
      console.log(`Warranty: ${sample.warranty.join(', ')}`);
      console.log(`URL: ${sample.url}`);
    }

  } catch (error) {
    console.error('Scraping failed:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

export { TurboAirCondensingUnitsScraper };
export type { Product };
