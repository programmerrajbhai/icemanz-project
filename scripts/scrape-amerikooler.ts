/**
 * Amerikooler Product Scraper
 * Scrapes all Amerikooler walk-in cooler products from Atlantic SE website
 * including product details, images, variants, and specifications
 */

import * as cheerio from 'cheerio';
import * as fs from 'fs/promises';
import * as path from 'path';

interface ProductVariant {
  id: number;
  title: string;
  option1: string | null;
  option2: string | null;
  option3: string | null;
  sku: string;
  price: number;
  available: boolean;
  barcode: string | null;
}

interface ProductOption {
  name: string;
  position: number;
  values: string[];
}

interface ProductImage {
  src: string;
  alt?: string | null;
  position: number;
  width: number;
  height: number;
}

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
  specifications: Record<string, string>;

  // Images
  images: ProductImage[];
  featuredImage: string;

  // Variants & Options
  variants: ProductVariant[];
  options: ProductOption[];

  // URLs
  url: string;
  specSheetUrl?: string;

  // Availability
  available: boolean;
  publishedAt: string;
  createdAt: string;
}

class AmerikoolerScraper {
  private baseUrl = 'https://www.atlanticse.com';
  private collectionUrl = '/collections/walk-in-coolers?sort_by=manual&filter.p.vendor=Amerikooler&filter.v.price.gte=&filter.v.price.lte=';
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
   * Extract product URLs from collection using Shopify JSON API with pagination
   */
  private async getProductUrls(): Promise<string[]> {
    const productUrls: string[] = [];
    let page = 1;
    let hasMorePages = true;

    console.log('Fetching all product pages...');

    while (hasMorePages) {
      try {
        // Use Shopify's paginated collection endpoint
        const url = `${this.baseUrl}/collections/walk-in-coolers/products.json?limit=250&page=${page}&vendor=Amerikooler`;
        console.log(`Fetching page ${page}: ${url}`);

        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'application/json',
          }
        });

        if (!response.ok) {
          console.log(`Page ${page} returned ${response.status}, trying HTML scraping...`);
          break;
        }

        const data = await response.json();

        if (data.products && data.products.length > 0) {
          // Filter only Amerikooler products
          const amerikoolerProducts = data.products.filter((p: any) =>
            p.vendor === 'Amerikooler' ||
            p.title?.toLowerCase().includes('amerikooler') ||
            p.handle?.includes('amerikooler')
          );

          console.log(`Page ${page}: Found ${amerikoolerProducts.length} Amerikooler products (${data.products.length} total)`);

          amerikoolerProducts.forEach((product: any) => {
            const productUrl = `${this.baseUrl}/products/${product.handle}`;
            if (!productUrls.includes(productUrl)) {
              productUrls.push(productUrl);
            }
          });

          // Check if there are more pages
          if (data.products.length < 250) {
            hasMorePages = false;
          } else {
            page++;
            await this.sleep(1000); // Small delay between pagination requests
          }
        } else {
          hasMorePages = false;
        }
      } catch (error) {
        console.error(`Error fetching page ${page}:`, error);
        hasMorePages = false;
      }
    }

    // Fallback: If JSON API didn't work, try HTML scraping with pagination
    if (productUrls.length === 0) {
      console.log('JSON API failed, falling back to HTML scraping...');
      productUrls.push(...await this.getProductUrlsFromHTML());
    }

    console.log(`Total found: ${productUrls.length} product URLs`);
    return [...new Set(productUrls)]; // Remove duplicates
  }

  /**
   * Fallback method: Extract product URLs from HTML pages with pagination
   */
  private async getProductUrlsFromHTML(): Promise<string[]> {
    const productUrls: string[] = [];
    let page = 1;
    let hasMorePages = true;

    while (hasMorePages) {
      try {
        const url = `${this.baseUrl}${this.collectionUrl}&page=${page}`;
        console.log(`Scraping HTML page ${page}...`);

        const html = await this.fetchWithRetry(url);
        const $ = cheerio.load(html);
        let foundOnThisPage = 0;

        // Find all product links in the collection
        $('a[href*="/products/amerikooler"]').each((_, element) => {
          const href = $(element).attr('href');
          if (href && !href.includes('#')) {
            const fullUrl = href.startsWith('http') ? href : this.baseUrl + href.split('?')[0];
            if (!productUrls.includes(fullUrl)) {
              productUrls.push(fullUrl);
              foundOnThisPage++;
            }
          }
        });

        // Also try to find product items in grid
        $('.product-item a.product-item__image-wrapper, .product-item__title a').each((_, element) => {
          const href = $(element).attr('href');
          if (href && href.includes('amerikooler')) {
            const fullUrl = href.startsWith('http') ? href : this.baseUrl + href.split('?')[0];
            if (!productUrls.includes(fullUrl)) {
              productUrls.push(fullUrl);
              foundOnThisPage++;
            }
          }
        });

        console.log(`Page ${page}: Found ${foundOnThisPage} new products`);

        // Check if there's a next page
        const hasNextPage = $('a.pagination__nav-item--next, a[rel="next"]').length > 0;

        if (foundOnThisPage === 0 || !hasNextPage) {
          hasMorePages = false;
        } else {
          page++;
          await this.sleep(1500); // Delay between HTML page requests
        }
      } catch (error) {
        console.error(`Error scraping HTML page ${page}:`, error);
        hasMorePages = false;
      }
    }

    return productUrls;
  }

  /**
   * Extract product data from product page
   */
  private async scrapeProductPage(url: string): Promise<Product | null> {
    try {
      await this.sleep(this.delay); // Rate limiting
      const html = await this.fetchWithRetry(url);
      const $ = cheerio.load(html);

      // Find the product JSON data embedded in the page
      const productJsonScript = $('script[data-product-json]').html();
      if (!productJsonScript) {
        console.error(`No product JSON found for ${url}`);
        return null;
      }

      const productData = JSON.parse(productJsonScript);
      const rawProduct = productData.product;

      // Extract features from description
      const features: string[] = [];
      const descriptionHtml = rawProduct.description || '';
      const $desc = cheerio.load(descriptionHtml);
      $desc('li').each((_, el) => {
        const feature = $desc(el).text().trim();
        if (feature) {
          features.push(feature);
        }
      });

      // Extract specifications from description
      const specifications: Record<string, string> = {};
      const fullText = $desc.text();

      // Try to extract common specifications
      const specPatterns = [
        /(\d+['"])\s*W\s*x\s*(\d+['"])\s*L\s*x\s*(\d+['"]?\s*-?\s*\d+["']?)\s*H/i,
        /(\d+["'])\s*[Tt]hick/i,
        /R-(\d+)/gi,
        /(\d+)\s*[Gg]auge/i,
      ];

      specPatterns.forEach(pattern => {
        const matches = fullText.match(pattern);
        if (matches) {
          if (pattern.source.includes('W.*x.*L.*x.*H')) {
            specifications['Width'] = matches[1];
            specifications['Length'] = matches[2];
            specifications['Height'] = matches[3];
          } else if (pattern.source.includes('thick')) {
            specifications['Insulation Thickness'] = matches[0];
          } else if (pattern.source.includes('R-')) {
            specifications['R-Value'] = matches[0];
          } else if (pattern.source.includes('auge')) {
            specifications['Panel Gauge'] = matches[0];
          }
        }
      });

      // Extract spec sheet URL
      let specSheetUrl: string | undefined;
      $desc('a[href*=".pdf"]').each((_, el) => {
        const href = $desc(el).attr('href');
        if (href) {
          specSheetUrl = href.startsWith('http') ? href : this.baseUrl + href;
          return false; // Break loop
        }
      });

      // Process images
      const images: ProductImage[] = rawProduct.media?.map((media: any, index: number) => ({
        src: media.src.startsWith('//') ? 'https:' + media.src : media.src,
        alt: media.alt,
        position: index + 1,
        width: media.width,
        height: media.height,
      })) || [];

      // If no media, use images array
      if (images.length === 0 && rawProduct.images) {
        rawProduct.images.forEach((imgSrc: string, index: number) => {
          images.push({
            src: imgSrc.startsWith('//') ? 'https:' + imgSrc : imgSrc,
            position: index + 1,
            width: 600,
            height: 600,
          });
        });
      }

      // Process variants
      const variants: ProductVariant[] = rawProduct.variants?.map((v: any) => ({
        id: v.id,
        title: v.title,
        option1: v.option1,
        option2: v.option2,
        option3: v.option3,
        sku: v.sku,
        price: v.price,
        available: v.available,
        barcode: v.barcode,
      })) || [];

      // Process options
      const options: ProductOption[] = productData.options_with_values?.map((opt: any) => ({
        name: opt.name,
        position: opt.position,
        values: opt.values,
      })) || [];

      // Build product object
      const product: Product = {
        id: rawProduct.id,
        title: rawProduct.title,
        handle: rawProduct.handle,
        vendor: rawProduct.vendor,
        type: rawProduct.type,
        tags: rawProduct.tags || [],

        price: rawProduct.price / 100, // Convert cents to dollars
        priceMin: rawProduct.price_min / 100,
        priceMax: rawProduct.price_max / 100,
        compareAtPrice: rawProduct.compare_at_price ? rawProduct.compare_at_price / 100 : null,

        description: $desc.text().replace(/\s+/g, ' ').trim(),
        descriptionHtml: descriptionHtml,
        features: features,
        specifications: specifications,

        images: images,
        featuredImage: rawProduct.featured_image?.startsWith('//')
          ? 'https:' + rawProduct.featured_image
          : rawProduct.featured_image,

        variants: variants,
        options: options,

        url: url,
        specSheetUrl: specSheetUrl,

        available: rawProduct.available,
        publishedAt: rawProduct.published_at,
        createdAt: rawProduct.created_at,
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
    console.log('Starting Amerikooler product scraping...\n');

    // Get all product URLs
    const productUrls = await this.getProductUrls();
    console.log(`\nFound ${productUrls.length} products to scrape\n`);

    // Scrape each product
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
    const scraper = new AmerikoolerScraper();
    const products = await scraper.scrapeAll();

    // Save to JSON file
    const timestamp = new Date().toISOString().split('T')[0];
    await scraper.saveToFile(products, `amerikooler-products-${timestamp}.json`);

    // Print summary
    console.log('\n=== SCRAPING SUMMARY ===');
    console.log(`Total products: ${products.length}`);
    console.log(`Total variants: ${products.reduce((sum, p) => sum + p.variants.length, 0)}`);
    console.log(`Total images: ${products.reduce((sum, p) => sum + p.images.length, 0)}`);
    console.log(`Products with spec sheets: ${products.filter(p => p.specSheetUrl).length}`);

    // Sample product info
    if (products.length > 0) {
      console.log('\n=== SAMPLE PRODUCT ===');
      const sample = products[0];
      console.log(`Title: ${sample.title}`);
      console.log(`Price: $${sample.price.toFixed(2)}`);
      console.log(`Variants: ${sample.variants.length}`);
      console.log(`Images: ${sample.images.length}`);
      console.log(`Features: ${sample.features.length}`);
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

export { AmerikoolerScraper };
export type { Product, ProductVariant, ProductOption, ProductImage };
