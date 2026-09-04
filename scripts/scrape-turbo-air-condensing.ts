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
  const baseUrl = 'https://www.atlanticse.com/a/search/turbo-air-condensing-units?filter_brand=Turbo+Air';
  
  console.log('Fetching product list...');
  const { data } = await axios.get(baseUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
  });
  
  const $ = cheerio.load(data);
  
  // Extract product links
  const productLinks: string[] = [];
  $('.product-item a, .product-link, .product-card a, a.product').each((i, el) => {
    let href = $(el).attr('href');
    if (href && (href.includes('/p/') || href.includes('/product/'))) {
      if (href.startsWith('/')) href = 'https://www.atlanticse.com' + href;
      if (!productLinks.includes(href)) {
        productLinks.push(href);
      }
    }
  });
  
  console.log(`Found ${productLinks.length} products`);
  
  const allProducts: Product[] = [];
  
  for (let i = 0; i < productLinks.length; i++) {
    const link = productLinks[i];
    console.log(`\nScraping product ${i + 1}/${productLinks.length}`);
    
    const productData = await scrapeProductDetails(link);
    
    if (productData && productData.title) {
      // Create slug from title
      const slug = productData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 100);
      
      // Build product object
      const product: Product = {
        title: productData.title,
        slug: `turbo-air-${slug}`,
        brand: 'Turbo Air',
        sku: productData.sku || `TA-${i + 1}`,
        badge: productData.price !== '0.00' ? 'In Stock' : undefined,
        description: productData.description || `Turbo Air ${productData.title} - Professional grade condensing unit for commercial refrigeration applications.`,
        keyFeatures: productData.features.slice(0, 5).join(' • ') || 'Commercial grade quality • Energy efficient operation • Reliable performance • Easy installation',
        condition: 'New',
        type: 'Condensing Unit',
        price: productData.price,
        images: productData.images.length > 0 ? productData.images : ['/category/refrigerationEquipment/Make_mockup_refrigeration_item_202605120945.jpeg'],
        warranty: ['1 Year Parts Warranty', '90 Days Labor Warranty'],
        detailedFeatures: productData.features.length > 0 ? productData.features : [
          'Commercial grade construction',
          'Energy efficient compressor',
          'Weather-resistant design',
          'Easy maintenance access',
          'Reliable cooling performance'
        ],
        specs: Object.keys(productData.specs).length > 0 ? productData.specs : {
          brand: 'Turbo Air',
          condition: 'New',
          type: 'Condensing Unit'
        },
        productOptions: productData.hasOptions ? productData.productOptions : undefined
      };
      
      allProducts.push(product);
      console.log(`✓ Scraped: ${product.title} - $${product.price}`);
    }
    
    // Delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
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
