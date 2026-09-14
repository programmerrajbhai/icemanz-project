# Amerikooler Product Scraper

A comprehensive scraper for extracting all Amerikooler walk-in cooler and freezer products from the Atlantic SE website.

## Features

✅ **Complete Data Extraction**
- Product titles, descriptions, and specifications
- All product variants (different door configurations, sizes)
- Multiple product images with URLs
- Pricing information (current price, compare at price)
- Product features and specifications
- Spec sheet PDF links
- Product tags and categories
- SKU and availability information

✅ **Smart Scraping**
- Automatic retry logic with exponential backoff
- Rate limiting to avoid overwhelming the server
- Handles both collection pages and individual product pages
- Extracts structured JSON data embedded in product pages

✅ **Data Quality**
- Extracts features from HTML lists
- Parses specifications (dimensions, insulation, R-values)
- Handles image URLs with proper protocol
- Converts prices from cents to dollars
- Removes duplicate product URLs

## Installation

Dependencies are already installed in this project. The scraper uses:
- `cheerio` - For HTML parsing
- `node-fetch` - For HTTP requests (built into Node.js 18+)

## Usage

### Run the Scraper

```bash
npm run scrape:amerikooler
```

This will:
1. Fetch all Amerikooler product URLs from the collection page
2. Visit each product page and extract detailed information
3. Save results to `data/amerikooler-products-YYYY-MM-DD.json`

### Output Format

The scraper generates a JSON file with the following structure:

```json
[
  {
    "id": 8886649585894,
    "title": "Amerikooler QF060677**F 6' x 6' x 7' 7\" Quick Ship Indoor Box Only Walk-In Freezer with Aluminum Floor",
    "handle": "amerikooler-qf060677-f-6-x-6-x-7-7-quick-ship-indoor-box-only-walk-in-freezer-with-aluminum-floor",
    "vendor": "Amerikooler",
    "type": "Walk-In Boxes",
    "tags": ["Freezer Floor"],
    
    "price": 6389.00,
    "priceMin": 6389.00,
    "priceMax": 6389.00,
    "compareAtPrice": null,
    
    "description": "Quick Ship Indoor Walk-In Freezer, 6' W x 6' L x 7'-7\" H...",
    "descriptionHtml": "<meta charset=\"utf-8\"><p>Quick Ship Indoor Walk-In Freezer...</p>",
    "features": [
      "4\" Thick AK-XPS4 insulation, providing R-29 for coolers and R-32 for freezers",
      "26 Gauge Acrylume® coated corrosion resistant stucco embossed Galvalume on all interior and exterior surfaces",
      "30\"W x 76\"H or 36\"W x 76\"H flush mounted door with spring actuated door closer",
      "Smooth aluminum floor finish rated at 600 lbs per sq. ft. of uniformly distributed load"
    ],
    "specifications": {
      "Width": "6'",
      "Length": "6'",
      "Height": "7' 7\"",
      "Insulation Thickness": "4\" Thick",
      "R-Value": "R-32",
      "Panel Gauge": "26 Gauge"
    },
    
    "images": [
      {
        "src": "https://www.atlanticse.com/cdn/shop/files/2518576_13eb9bb7-f2dc-4073-9fe3-426995ced048.jpg",
        "alt": null,
        "position": 1,
        "width": 600,
        "height": 600
      }
    ],
    "featuredImage": "https://www.atlanticse.com/cdn/shop/files/2518576_13eb9bb7-f2dc-4073-9fe3-426995ced048.jpg",
    
    "variants": [
      {
        "id": 45508706992358,
        "title": "Left Hinged Door / 30\" Wide Door",
        "option1": "Left Hinged Door",
        "option2": "30\" Wide Door",
        "option3": null,
        "sku": "QF060677**F",
        "price": 638900,
        "available": true,
        "barcode": null
      }
    ],
    
    "options": [
      {
        "name": "Door Hinge",
        "position": 1,
        "values": ["Left Hinged Door", "Right Hinged Door"]
      },
      {
        "name": "Door Width",
        "position": 2,
        "values": ["30\" Wide Door", "36\" Wide Door"]
      }
    ],
    
    "url": "https://www.atlanticse.com/products/amerikooler-qf060677-f-6-x-6-x-7-7-quick-ship-indoor-box-only-walk-in-freezer-with-aluminum-floor",
    "specSheetUrl": "https://cdn.shopify.com/s/files/1/0379/1801/5627/files/amerikooler_qf060677f.pdf",
    
    "available": true,
    "publishedAt": "2024-01-05T02:57:35-05:00",
    "createdAt": "2024-11-15T09:40:06-05:00"
  }
]
```

## Data Fields Explained

### Basic Information
- **id**: Unique Shopify product ID
- **title**: Full product name
- **handle**: URL-friendly product identifier
- **vendor**: Manufacturer (always "Amerikooler")
- **type**: Product category (e.g., "Walk-In Boxes")
- **tags**: Product tags for categorization

### Pricing
- **price**: Current price in dollars
- **priceMin**: Minimum variant price
- **priceMax**: Maximum variant price
- **compareAtPrice**: Original price if on sale (null if not on sale)

### Content
- **description**: Plain text description
- **descriptionHtml**: HTML formatted description
- **features**: Array of feature bullet points
- **specifications**: Extracted specifications (dimensions, insulation, etc.)

### Media
- **images**: Array of all product images with metadata
- **featuredImage**: Main product image URL

### Variants
Each product can have multiple variants (different configurations):
- **id**: Variant ID
- **title**: Full variant name
- **option1/option2/option3**: Configuration options (e.g., door hinge, door width)
- **sku**: Stock keeping unit
- **price**: Variant price in cents
- **available**: Stock availability

### Options
Configuration options available for the product:
- **name**: Option name (e.g., "Door Hinge")
- **position**: Display order
- **values**: Available choices

### Additional
- **url**: Direct link to product page
- **specSheetUrl**: PDF specification sheet link
- **available**: Overall product availability
- **publishedAt**: Publication date
- **createdAt**: Creation date

## Configuration

You can modify the scraper behavior by editing `scripts/scrape-amerikooler.ts`:

```typescript
class AmerikoolerScraper {
  private baseUrl = 'https://www.atlanticse.com';
  private delay = 2000; // Milliseconds between requests
  private maxRetries = 3; // Number of retry attempts
}
```

## Rate Limiting

The scraper includes built-in rate limiting:
- 2 second delay between product page requests
- Exponential backoff on failed requests
- Maximum 3 retry attempts per request

This ensures respectful scraping and reduces the chance of being blocked.

## Error Handling

The scraper handles common errors:
- Network timeouts and connection errors
- Missing product data
- Invalid JSON parsing
- HTTP errors (404, 500, etc.)

Failed products are logged but don't stop the entire scraping process.

## Sample Output

After running the scraper, you'll see:

```
Starting Amerikooler product scraping...

Found 45 product URLs

Scraping product 1/45...
Fetching: https://www.atlanticse.com/products/... (attempt 1/3)
✓ Scraped: Amerikooler QF060677**F 6' x 6' x 7' 7" Quick Ship Indoor Box Only Walk-In Freezer

...

✓ Successfully scraped 45 products

✓ Saved 45 products to /path/to/data/amerikooler-products-2026-09-13.json

=== SCRAPING SUMMARY ===
Total products: 45
Total variants: 180
Total images: 45
Products with spec sheets: 43

=== SAMPLE PRODUCT ===
Title: Amerikooler QF060677**F 6' x 6' x 7' 7" Quick Ship Indoor Box Only Walk-In Freezer
Price: $6389.00
Variants: 4
Images: 1
Features: 9
URL: https://www.atlanticse.com/products/...
```

## Next Steps

After scraping, you can:

1. **Import to Database**: Create an import script similar to the Astra products importer
2. **Process Images**: Download images locally or upload to CDN
3. **Transform Data**: Map to your database schema
4. **Update Regularly**: Run scraper periodically to get updates

## Integration with Existing System

To integrate with your Prisma database, you can create an import script similar to `import-astra-products.ts`:

```typescript
import { PrismaClient } from '@prisma/client';
import { Product } from './scrape-amerikooler';
import * as fs from 'fs/promises';

const prisma = new PrismaClient();

async function importAmeriKoolerProducts() {
  const data = await fs.readFile('data/amerikooler-products-2026-09-13.json', 'utf-8');
  const products: Product[] = JSON.parse(data);
  
  for (const product of products) {
    await prisma.product.create({
      data: {
        name: product.title,
        slug: product.handle,
        description: product.description,
        price: product.price,
        // ... map other fields
      }
    });
  }
}
```

## Troubleshooting

### "No product JSON found"
- The page structure may have changed
- Check if the product page loads correctly in a browser

### Rate limiting errors (429)
- Increase the `delay` value in the scraper
- Reduce concurrent requests

### TypeScript errors
- Run `npm install` to ensure all dependencies are installed
- Check that `tsx` is available for running TypeScript files

## Source URL

Scraping from: https://www.atlanticse.com/collections/walk-in-coolers?sort_by=manual&filter.p.vendor=Amerikooler

## License

This scraper is for internal use only. Ensure compliance with the website's terms of service and robots.txt before running.
