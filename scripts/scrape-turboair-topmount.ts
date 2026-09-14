import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';

interface Product {
  id: number;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  vendor: string;
  type: string;
  tags: string[];
  price: number;
  priceMin: number;
  priceMax: number;
  available: boolean;
  images: string[];
  featuredImage: string;
  url: string;
  publishedAt: string;
  variants: any[];
  options: any[];
  specifications: Record<string, string>;
  features: string[];
  warranty: string[];
  cutSheetUrl: string | null;
  manualUrl: string | null;
}

const BASE_URL = 'https://www.atlanticse.com';
const COLLECTION_HANDLE = 'turbo-air-top-mount-refrigeration';

// Utility to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fetch all product URLs from collection
async function fetchAllProductPages(): Promise<string[]> {
  console.log('Fetching all product pages...');
  const productUrls: string[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const url = `${BASE_URL}/collections/${COLLECTION_HANDLE}/products.json?limit=250&page=${page}`;
    console.log(`Fetching page ${page}: ${url}`);

    try {
      const response = await axios.get(url);
      const products = response.data.products;

      if (products.length === 0) {
        hasMore = false;
      } else {
        console.log(`Page ${page}: Found ${products.length} products`);
        products.forEach((product: any) => {
          productUrls.push(`${BASE_URL}/products/${product.handle}`);
        });
        page++;
      }

      await delay(500); // Be nice to the server
    } catch (error) {
      console.error(`Error fetching page ${page}:`, error);
      hasMore = false;
    }
  }

  console.log(`Total found: ${productUrls.length} product URLs`);
  return productUrls;
}

// Parse specifications from description HTML
function parseSpecifications(html: string): Record<string, string> {
  const $ = cheerio.load(html);
  const specs: Record<string, string> = {};

  // Look for Key Features section
  const keyFeaturesHeading = $('h4').filter((_, el) => $(el).text().trim() === 'Key Features');
  if (keyFeaturesHeading.length > 0) {
    const keyFeaturesText = keyFeaturesHeading.next('p').text().trim();
    
    // Parse HP
    const hpMatch = keyFeaturesText.match(/(\d+(?:\.\d+)?)\s*HP/i);
    if (hpMatch) {
      specs['Horsepower'] = hpMatch[1] + ' HP';
    }

    // Parse Temperature Range
    if (keyFeaturesText.match(/Low\s+Temperature/i)) {
      specs['Temperature Range'] = 'Low Temperature';
    } else if (keyFeaturesText.match(/Medium\s+Temperature/i)) {
      specs['Temperature Range'] = 'Medium Temperature';
    }

    // Parse Voltage
    const voltageMatch = keyFeaturesText.match(/(\d+(?:-\d+)?V\/\d+Ph\/\d+Hz)/i);
    if (voltageMatch) {
      specs['Voltage'] = voltageMatch[1];
    }

    // Parse Compressor Type
    if (keyFeaturesText.match(/Scroll\s+Compressor/i)) {
      specs['Compressor Type'] = 'Scroll Compressor';
    }
  }

  return specs;
}

// Extract features from HTML
function extractFeatures(html: string): string[] {
  const $ = cheerio.load(html);
  const features: string[] = [];

  // Find Features heading and get the list items after it
  const featuresHeading = $('h4').filter((_, el) => $(el).text().trim() === 'Features');
  if (featuresHeading.length > 0) {
    let nextElement = featuresHeading.next();
    
    // Collect all <li> elements until we hit another <h4>
    while (nextElement.length > 0 && nextElement.prop('tagName') !== 'H4') {
      if (nextElement.prop('tagName') === 'LI') {
        const featureText = nextElement.text().trim();
        if (featureText) {
          features.push(featureText);
        }
      } else if (nextElement.prop('tagName') === 'UL') {
        nextElement.find('li').each((_, li) => {
          const featureText = $(li).text().trim();
          if (featureText) {
            features.push(featureText);
          }
        });
      }
      nextElement = nextElement.next();
    }
  }

  return features;
}

// Extract warranty information
function extractWarranty(html: string): string[] {
  const $ = cheerio.load(html);
  const warranty: string[] = [];

  const warrantyHeading = $('h4').filter((_, el) => $(el).text().trim() === 'Warranty');
  if (warrantyHeading.length > 0) {
    const warrantyPara = warrantyHeading.next('p');
    if (warrantyPara.length > 0) {
      const warrantyHtml = warrantyPara.html() || '';
      const lines = warrantyHtml.split('<br>').map(line => 
        line.replace(/<[^>]*>/g, '').trim()
      ).filter(line => line.length > 0);
      
      warranty.push(...lines);
    }
  }

  return warranty;
}

// Extract document URLs
function extractDocuments(html: string): { cutSheetUrl: string | null; manualUrl: string | null } {
  const $ = cheerio.load(html);
  let cutSheetUrl: string | null = null;
  let manualUrl: string | null = null;

  const documentsHeading = $('h4').filter((_, el) => $(el).text().trim() === 'Documents');
  if (documentsHeading.length > 0) {
    let nextElement = documentsHeading.next();
    
    while (nextElement.length > 0 && nextElement.prop('tagName') === 'P') {
      const link = nextElement.find('a').first();
      if (link.length > 0) {
        const linkText = link.text().trim();
        const linkHref = link.attr('href');
        
        if (linkHref) {
          if (linkText.match(/Cut\s+Sheet/i)) {
            cutSheetUrl = linkHref;
          } else if (linkText.match(/User\s+Manual|Manual/i)) {
            manualUrl = linkHref;
          }
        }
      }
      nextElement = nextElement.next();
    }
  }

  return { cutSheetUrl, manualUrl };
}

// Scrape individual product details
async function scrapeProductDetails(productUrl: string, retries = 3): Promise<Product | null> {
  const jsonUrl = productUrl + '.json';
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Fetching: ${jsonUrl} (attempt ${attempt}/${retries})`);
      const response = await axios.get(jsonUrl);
      const data = response.data.product;

      const descriptionHtml = data.body_html || '';
      
      // Create plain text description
      const $ = cheerio.load(descriptionHtml);
      const descriptionText = $('body').text().replace(/\s+/g, ' ').trim();

      // Extract structured data
      const specifications = parseSpecifications(descriptionHtml);
      const features = extractFeatures(descriptionHtml);
      const warranty = extractWarranty(descriptionHtml);
      const { cutSheetUrl, manualUrl } = extractDocuments(descriptionHtml);

      // Extract price info
      const prices = data.variants.map((v: any) => parseFloat(v.price));
      const priceMin = Math.min(...prices);
      const priceMax = Math.max(...prices);

      // Extract images
      const images = data.images.map((img: any) => img.src);
      const featuredImage = data.image?.src || images[0] || '';

      const product: Product = {
        id: data.id,
        title: data.title,
        handle: data.handle,
        description: descriptionText,
        descriptionHtml: descriptionHtml,
        vendor: data.vendor || 'Turbo Air',
        type: data.product_type || 'Top Mount Refrigeration',
        tags: typeof data.tags === 'string' ? data.tags.split(',').map((t: string) => t.trim()) : [],
        price: priceMin,
        priceMin,
        priceMax,
        available: data.variants.some((v: any) => v.available),
        images,
        featuredImage,
        url: productUrl,
        publishedAt: data.published_at,
        variants: data.variants,
        options: data.options,
        specifications,
        features,
        warranty,
        cutSheetUrl,
        manualUrl
      };

      console.log(`✓ Scraped: ${product.title}`);
      return product;

    } catch (error: any) {
      console.error(`✗ Attempt ${attempt} failed for ${productUrl}:`, error.message);
      if (attempt < retries) {
        await delay(2000 * attempt); // Exponential backoff
      }
    }
  }

  return null;
}

// Main scraping function
async function scrapeAllProducts() {
  console.log('Starting Turbo Air Top Mount Refrigeration scraping...');
  
  // Fetch all product URLs
  const productUrls = await fetchAllProductPages();
  
  if (productUrls.length === 0) {
    console.log('No products found!');
    return;
  }

  console.log(`Found ${productUrls.length} products to scrape`);

  const products: Product[] = [];
  let successCount = 0;
  let failCount = 0;

  // Scrape each product
  for (let i = 0; i < productUrls.length; i++) {
    console.log(`\nScraping product ${i + 1}/${productUrls.length}...`);
    const product = await scrapeProductDetails(productUrls[i]);
    
    if (product) {
      products.push(product);
      successCount++;
    } else {
      failCount++;
    }

    // Be nice to the server
    await delay(1000);
  }

  // Save to JSON file
  const today = new Date().toISOString().split('T')[0];
  const outputPath = path.join(process.cwd(), 'data', `turboair-topmount-${today}.json`);
  
  // Ensure data directory exists
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(products, null, 2));

  console.log(`\n✓ Successfully scraped ${successCount} products`);
  console.log(`✗ Failed to scrape ${failCount} products`);
  console.log(`✓ Saved ${products.length} products to ${outputPath}`);

  // Print summary
  console.log('\n=== SCRAPING SUMMARY ===');
  console.log(`Total products: ${products.length}`);
  console.log(`Total variants: ${products.reduce((sum, p) => sum + p.variants.length, 0)}`);
  console.log(`Total images: ${products.reduce((sum, p) => sum + p.images.length, 0)}`);
  console.log(`Products with cut sheets: ${products.filter(p => p.cutSheetUrl).length}`);
  console.log(`Products with manuals: ${products.filter(p => p.manualUrl).length}`);

  // Print sample product
  if (products.length > 0) {
    const sample = products[0];
    console.log('\n=== SAMPLE PRODUCT ===');
    console.log(`Title: ${sample.title}`);
    console.log(`Price: $${sample.price.toFixed(2)}`);
    console.log(`HP: ${sample.specifications['Horsepower'] || 'N/A'}`);
    console.log(`Temp: ${sample.specifications['Temperature Range'] || 'N/A'}`);
    console.log(`Features: ${sample.features.length}`);
    console.log(`Warranty: ${sample.warranty.join(', ')}`);
    console.log(`URL: ${sample.url}`);
  }
}

// Run the scraper
scrapeAllProducts().catch(console.error);
