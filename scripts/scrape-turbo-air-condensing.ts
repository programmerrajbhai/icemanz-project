import * as cheerio from 'cheerio';
import axios from 'axios';
import * as fs from 'fs';

interface Product {
  title: string;
  slug: string;
  brand: string;
  sku: string;
  badge?: string;
  description: string;
  keyFeatures: string;
  condition: string;
  type: string;
  price: string;
  images: string[];
  warranty: string[];
  detailedFeatures: string[];
  specs: any;
  documents?: any;
  faqs?: any;
  productOptions?: any;
}

async function scrapeProductDetails(url: string): Promise<any> {
  try {
    console.log(`Fetching product: ${url}`);
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(data);

    // Extract product details
    const productData: any = {};

    // Title
    productData.title = $('h1.product-title, h1.page-title, .product-name h1').first().text().trim();

    // SKU / Model
    productData.sku = $('.sku-number, .product-sku, [itemprop="sku"]').first().text().replace(/SKU:|Model:|#/gi, '').trim();
    if (!productData.sku) {
      // Try to extract from title or URL
      const titleMatch = productData.title.match(/([A-Z0-9-]+)$/i);
      if (titleMatch) productData.sku = titleMatch[1];
    }

    // Price
    let price = $('.price-block .price, .product-price, [itemprop="price"]').first().text().trim();
    price = price.replace(/[$,]/g, '').trim();
    productData.price = price || '0.00';

    // Images
    const images: string[] = [];
    $('.product-images img, .product-image img, .gallery-image img').each((i, el) => {
      let src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-zoom-image');
      if (src && !src.includes('placeholder') && !src.includes('loading')) {
        if (src.startsWith('//')) src = 'https:' + src;
        if (src.startsWith('/')) src = 'https://www.atlanticse.com' + src;
        if (!images.includes(src)) images.push(src);
      }
    });
    productData.images = images.slice(0, 5); // Limit to 5 images

    // Description
    productData.description = $('.product-description, .description, .product-info-description').first().text().trim();

    // Features
    const features: string[] = [];
    $('.features li, .product-features li, ul.features li').each((i, el) => {
      const feature = $(el).text().trim();
      if (feature) features.push(feature);
    });
    productData.features = features;

    // Specifications
    const specs: any = {};
    $('.specifications tr, .specs tr, .product-specs tr').each((i, el) => {
      const label = $(el).find('th, td:first-child').text().trim();
      const value = $(el).find('td:last-child').text().trim();
      if (label && value) {
        const key = label.toLowerCase().replace(/[^a-z0-9]/g, '_');
        specs[key] = value;
      }
    });
    productData.specs = specs;

    // Check for options/variants (add to cart vs choose options)
    const hasOptions = $('.product-options, .product-variants, select.product-option').length > 0;
    productData.hasOptions = hasOptions;

    // Product options if they exist
    if (hasOptions) {
      const options: any = {};
      $('.product-options select, .product-variants select').each((i, el) => {
        const optionName = $(el).attr('name') || $(el).prev('label').text().trim();
        const optionValues: string[] = [];
        $(el).find('option').each((j, opt) => {
          const val = $(opt).text().trim();
          if (val && !val.toLowerCase().includes('select')) {
            optionValues.push(val);
          }
        });
        if (optionName && optionValues.length > 0) {
          options[optionName] = optionValues;
        }
      });
      productData.productOptions = options;
    }

    return productData;
  } catch (error: any) {
    console.error(`Error scraping ${url}:`, error.message);
    return null;
  }
}

async function scrapeAllProducts() {
  // Scrape both pages
  const pages = [
    'https://www.atlanticse.com/a/search/turbo-air-condensing-units?filter_brand=Turbo+Air&page=1',
    'https://www.atlanticse.com/a/search/turbo-air-condensing-units?filter_brand=Turbo+Air&page=2'
  ];

  const allProductData: any[] = [];

  for (const pageUrl of pages) {
    console.log(`Fetching page: ${pageUrl}`);
    const { data } = await axios.get(pageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(data);

    // Extract products directly from listing page
    $('.product-item, [class*="product"]').each((i, el) => {
      const $product = $(el);

      // Get title - look for various title patterns
      let title = $product.find('a[href*="/p/"]').text().trim();
      if (!title) {
        title = $product.find('.product-title, h3, h4, .title').text().trim();
      }

      // Skip if no title or not a Turbo Air product
      if (!title || !title.includes('Turbo Air')) return;

      // Extract price
      let price = $product.find('.price, [class*="price"]').text().trim();
      price = price.replace(/Regular price|\$|,|\/\s*Ea\./gi, '').trim();

      // Extract product link
      let link = $product.find('a[href*="/p/"]').attr('href') || '';
      if (link.startsWith('/')) link = 'https://www.atlanticse.com' + link;

      if (title && price) {
        allProductData.push({ title, price, link });
      }
    });

    // Small delay between pages
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`Found ${allProductData.length} products`);

  const allProducts: Product[] = [];

  for (let i = 0; i < allProductData.length; i++) {
    const item = allProductData[i];
    console.log(`\nProcessing product ${i + 1}/${allProductData.length}: ${item.title}`);

    // Extract SKU from title
    const skuMatch = item.title.match(/TS\d+[A-Z]+\d+[A-Z]?\d?[A-Z]?/i);
    const sku = skuMatch ? skuMatch[0] : `TA-CU-${i + 1}`;

    // Extract HP info from title
    const hpMatch = item.title.match(/([\d.\/]+)\s*HP/i);
    const hp = hpMatch ? hpMatch[1] : '';

    // Extract temp type
    let tempType = 'Medium Temp';
    if (item.title.toLowerCase().includes('extra low temp')) {
      tempType = 'Extra Low Temp';
    } else if (item.title.toLowerCase().includes('extended medium temp')) {
      tempType = 'Extended Medium Temp';
    } else if (item.title.toLowerCase().includes('low temp')) {
      tempType = 'Low Temp';
    }

    // Create slug from title
    const slug = item.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 100);

    // Build product object
    const product: Product = {
      title: item.title,
      slug: `turbo-air-${slug}`,
      brand: 'Turbo Air',
      sku: sku,
      badge: 'In Stock',
      description: `Turbo Air ${sku} ${tempType} Outdoor Condensing Unit${hp ? ` - ${hp} HP` : ''}. Professional grade condensing unit designed for commercial refrigeration applications. Features weather-resistant construction and reliable performance.`,
      keyFeatures: `${hp ? hp + ' HP capacity' : 'Commercial grade'} • ${tempType} operation • R-404A refrigerant • Weather-resistant outdoor design • Energy efficient compressor`,
      condition: 'New',
      type: 'Outdoor Condensing Unit',
      price: item.price,
      images: ['/category/refrigerationEquipment/Make_mockup_refrigeration_item_202605120945.jpeg'],
      warranty: ['1 Year Parts Warranty', '90 Days Labor Warranty'],
      detailedFeatures: [
        'Commercial grade construction',
        `${tempType} operation`,
        hp ? `${hp} HP capacity` : 'High efficiency compressor',
        'R-404A refrigerant',
        'Weather-resistant outdoor design',
        'Easy maintenance access',
        'Reliable cooling performance',
        'Suitable for walk-in coolers and freezers'
      ],
      specs: {
        brand: 'Turbo Air',
        model: sku,
        condition: 'New',
        type: 'Outdoor Condensing Unit',
        horsepower: hp || 'Varies',
        temperatureRange: tempType,
        refrigerant: 'R-404A',
        voltage: '115V/208-230V',
        phase: 'Single/Three Phase',
        application: 'Commercial Refrigeration'
      }
    };

    allProducts.push(product);
    console.log(`✓ Created: ${product.title} - $${product.price}`);
  }

  // Save to JSON file
  fs.writeFileSync(
    './scripts/turbo-air-condensing-products.json',
    JSON.stringify(allProducts, null, 2)
  );

  console.log(`\n✅ Scraped ${allProducts.length} products`);
  console.log(`Data saved to: ./scripts/turbo-air-condensing-products.json`);

  return allProducts;
}

scrapeAllProducts()
  .then(() => {
    console.log('Scraping completed successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('Error during scraping:', error);
    process.exit(1);
  });
