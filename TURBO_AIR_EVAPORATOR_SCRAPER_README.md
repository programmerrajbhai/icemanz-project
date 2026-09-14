# Turbo Air Evaporator Fan Scraper - Completion Report

## Overview
Successfully scraped **23 Turbo Air Evaporator Fan products** from atlanticse.com with full details extracted from HTML pages.

## Scraper Details

### Script Location
`scripts/scrape-turbo-air-evaporator.js`

### Output File
`data/turbo-air-evaporator-products.json` (123 KB)

### Source URL
- Collection: https://www.atlanticse.com/collections/turbo-air-evaporator-fan
- Example Product: https://www.atlanticse.com/collections/turbo-air-evaporator-fan/products/turbo-air-adr089aenc-2-fan-low-profile-evaporator-coil-unit-cooler

## Data Extracted

### Phase 1: Core Product Data (JSON API)
- Product ID
- Title
- Handle (URL slug)
- Vendor (Turbo Air)
- Product Type (Evaporator Coil)
- Tags
- Description (HTML)
- Options/Variants
- Images (high resolution)
- Price
- SKU
- Availability

### Phase 2: HTML Page Details
For each product, the scraper extracts:

1. **Features** (Detailed List)
   - Blue anti-corrosion fin details
   - Air-pass guard specifications
   - Defrost heater information
   - Corrugated fin technology
   - Motor and fan specifications
   - Parts availability (Expansion Valve, Solenoid Valve, Thermostat)
   - EC Motor efficiency details
   - Average: 18 features per product

2. **Key Features** (Summary)
   - BTU capacity (e.g., "8,900 BTU")
   - Profile type (Low Profile)
   - Defrost method (Air Defrost or Electric Defrost)
   - Motor type (EC Motor - Dual Speed & Voltage)
   - Electrical specifications (115V/1Ph/60Hz)

3. **Warranty Information**
   - All products: "1 Year Fan Motor and Parts Warranty"

4. **Documents** (PDF Links)
   - **Cut Sheet** - Technical specifications and dimensions
   - **User Manual** - CAREL controller manual
   - Direct links to turboairinc.com PDFs

5. **Product Images**
   - High-resolution product images
   - Hosted on Shopify CDN

## Product Range

### Air Defrost Models (ADR Series)
- ADR060AENC - 1 Fan - $1,344.00
- ADR089AENC - 2 Fan - $1,482.00
- ADR112AENC - 2 Fan - $1,665.00
- ADR125AENC - 2 Fan - $1,902.00
- ADR137AENC - 3 Fan - $2,082.00
- ADR171AENC - 3 Fan - $2,438.00
- ADR191AENC - 3 Fan - $2,534.00
- ADR258AENC - 4 Fan - $2,845.00
- ADR325AENC - 5 Fan - $3,397.00
- ADR352AENC - 6 Fan - $3,877.00
- ADR392AENC - 6 Fan - $4,232.00

### Electric Defrost Models (LED Series)
- LED036BENC - 1 Fan - $1,555.00
- LED052BENC - 2 Fan - $1,851.00
- LED072BENC - 2 Fan - $1,982.00
- LED081BENC - 2 Fan - $2,059.00
- LED090BENC - 3 Fan - $2,308.00
- LED114BENC - 3 Fan - $2,675.00
- LED124BENC - 4 Fan - $3,137.00
- LED157BENC - 4 Fan - $3,239.00
- LED176BENC - 4 Fan - $3,338.00
- LED225BENC - 5 Fan - $3,338.00
- LED244BENC - 6 Fan - $4,064.00
- LED273BENC - 6 Fan - $4,582.00

## Statistics

- **Total Products**: 23
- **Products with Features**: 23 (100%)
- **Products with Documents**: 23 (100%)
- **Products with Warranty Info**: 23 (100%)
- **Average Features per Product**: 18
- **Price Range**: $1,344 - $4,582

## Key Features Across All Products

### Common Features
1. **Blue Anti-Corrosion Fin** - Increases coil lifespan
2. **Air-Pass Guard** - Improves heat exchange rate
3. **Corrugated Fin** - Expands surface area for better heat exchange
4. **Front Cover Access** - Easy maintenance in confined spaces
5. **Seamless Inner Groove Copper Tube** - Enhanced heat exchange
6. **Venturi Type Distributor** - Minimizes pressure drop
7. **EC Motor (Dual Speed)** - High energy efficiency
8. **Spiral Fan Guard** - Efficient cold air delivery
9. **Anti-Oxidizing Stainless Steel** - Mounting and bolts

### LED Series Additional Features
- Easy to replace defrost heater
- Thermostat to prevent over temperature (opens at 70°F)

### Included Parts (Factory Pre-mounted)
- Expansion Valve (Sporlan)
- Solenoid Valve (Sporlan)
- Thermostat (Johnson Control) - Shipped Loose

## Usage

### Run the Scraper
```bash
cd /Users/user/Desktop/icemanz
node scripts/scrape-turbo-air-evaporator.js
```

### Requirements
```bash
npm install axios cheerio
```

### Configuration
- **Collection URL**: Configurable in script
- **Target Vendor**: "turbo air" (case-insensitive)
- **Delay between requests**: 1200ms (be respectful to server)
- **Auto-save progress**: Every 10 products

## Data Quality

### Strengths
✅ All 23 products successfully scraped  
✅ 100% have detailed features  
✅ 100% have warranty information  
✅ 100% have technical documents (Cut Sheet + Manual)  
✅ Complete pricing and SKU data  
✅ High-resolution product images  
✅ Structured JSON output  

### Notes
- Some documents array entries are not PDFs (social sharing links) - can be filtered
- Specifications table was empty in the HTML (not used by Turbo Air)
- All products follow consistent naming convention: Model# - Fan Count - Profile Type

## Next Steps

### Import to Database
The scraped data can be imported into the Prisma database using a similar approach to the Astra and Amerikooler imports.

### Suggested Database Fields
```typescript
{
  title: string
  slug: string
  brand: "Turbo Air"
  sku: string
  price: number
  images: string[]
  features: string[] // Detailed features list
  keyFeatures: string[] // BTU, voltage, etc.
  warranty: string[]
  documents: { name: string, href: string }[]
  productType: "Evaporator Coil"
  tags: string[]
  variants: object[]
}
```

## Sample Product Data Structure

```json
{
  "id": 9610816520422,
  "title": "Turbo Air ADR089AENC 2 Fan Low Profile Evaporator Coil (Unit Cooler)",
  "handle": "turbo-air-adr089aenc-2-fan-low-profile-evaporator-coil-unit-cooler",
  "sku": "ADR089AENC",
  "price": "1482.00",
  "vendor": "Turbo Air",
  "product_type": "Evaporator Coil",
  "features": [
    "Blue anti-corrosion-fin increases the life span of the coil.",
    "Air-pass guard is located at the bottom of the coil to improve heat exchange rate.",
    ...
  ],
  "key_features": [
    "8,900 BTU, Low Profile Unit Cooler, Air Defrost with EC Motor (Dual Speed & Voltage), 115V/1Ph/60Hz"
  ],
  "warranty": [
    "1 Year Fan Motor and Parts Warranty"
  ],
  "documents": [
    {
      "name": "Cut Sheet",
      "href": "https://www.turboairinc.com/refrigerationsystem/wp-content/uploads/sites/8/2021/03/ADR089AE.pdf"
    },
    {
      "name": "User Manual",
      "href": "https://www.turboairinc.com/refrigerationsystem/wp-content/uploads/sites/8/2021/07/251010turbo-air-carel-controller-manual-V002.pdf"
    }
  ]
}
```

## Conclusion

The Turbo Air Evaporator Fan scraper successfully extracted comprehensive product data from all 23 products in the collection. The data is well-structured, complete, and ready for database import or further processing.

**Total Scraping Time**: ~30 seconds  
**Data Quality**: Excellent (100% success rate)  
**Output Size**: 123 KB JSON  

---

*Scraper created: September 13, 2026*  
*Last run: September 13, 2026*
