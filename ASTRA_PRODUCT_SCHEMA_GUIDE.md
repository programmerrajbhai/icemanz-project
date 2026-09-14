# 🎯 Astra Product Schema Guide

Complete mapping of Atlantic SE product data to our Prisma database schema.

---

## 📋 Database Schema (Prisma)

```typescript
model Product {
  id               String    @id @default(uuid())
  title            String
  slug             String    @unique
  brand            String?
  sku              String?
  badge            String?
  description      String?
  keyFeatures      String?
  condition        String?
  type             String?
  price            String?
  images           String[]
  warranty         String[]
  detailedFeatures String[]
  specs            Json?
  documents        Json?
  faqs             Json?
  productOptions   Json?
  features         Json?
  categoryId       String?
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
  category         Category? @relation(fields: [categoryId], references: [id])
}
```

---

## 🔍 Field Mapping from Atlantic SE

### Basic Information

| Prisma Field | Atlantic SE Source | Example | Type |
|--------------|-------------------|---------|------|
| `id` | Auto-generated UUID | `"550e8400-e29b-41d4-a716-446655440000"` | String |
| `title` | `<h1>` product title | `"Astra 12' x 7' x 8' Walk-In Display Cooler..."` | String |
| `slug` | Generated from title | `"astra-12-x-7-x-8-walk-in-display-cooler..."` | String |
| `brand` | Hardcoded `"Astra"` | `"Astra"` | String |
| `sku` | Model number from specs | `"DCWF12X7"` | String |
| `badge` | Product type/category | `"Display Cooler"`, `"Quick Ship"`, `"IN STOCK"` | String |
| `price` | `.price-item--regular` text | `"10905.00"` (no $ or commas) | String |

### Content Fields

| Prisma Field | Atlantic SE Source | Example | Type |
|--------------|-------------------|---------|------|
| `description` | `.product__description` text | Full product description paragraph(s) | String |
| `keyFeatures` | Extracted from description/lists | `"4 Glass Doors\nWalk-In Entry\n..."` (newline-separated) | String |
| `condition` | Usually `"New"` | `"New"` | String |
| `type` | Determined from title | `"cooler"`, `"freezer"`, `"combo"`, `"display-cooler"` | String |

### Arrays

| Prisma Field | Atlantic SE Source | Example | Type |
|--------------|-------------------|---------|------|
| `images` | `img[src*="cdn.shopify"]` | `["https://cdn.shopify.com/...", "..."]` | String[] |
| `warranty` | Warranty section text | `["10-Year Panel Warranty", "1-Year Parts"]` | String[] |
| `detailedFeatures` | Feature lists (`<ul><li>`) | `["4\" Insulation", "Cam-Lock Panels", ...]` | String[] |

### JSON Objects

#### `specs` (Json)
Product specifications from table:

```json
{
  "Panel Brand": "Astra",
  "Refrigeration Brand": "Turbo Air",
  "Model": "DCWF12X7",
  "Nominal Width": "7'",
  "Nominal Length": "12'",
  "Nominal Height": "8'",
  "Insulation Value": "R27 for coolers and R33 for freezers",
  "Panel Construction": "4\" thick foamed-in-place polyurethane insulation",
  "Panel Warranty": "10 year panel warranty"
}
```

**Source:** 
```html
<table class="product-specs">
  <tr>
    <td>Panel Brand</td>
    <td>Astra</td>
  </tr>
  ...
</table>
```

---

#### `documents` (Json)
Downloadable files/PDFs:

```json
[
  {
    "name": "Spec Sheet",
    "url": "https://cdn.shopify.com/.../spec-sheet.pdf"
  },
  {
    "name": "Warranty Information",
    "url": "https://cdn.shopify.com/.../warranty.pdf"
  },
  {
    "name": "Installation Guide",
    "url": "https://cdn.shopify.com/.../installation.pdf"
  }
]
```

**Source:** Links with `href*=".pdf"` or document download sections

---

#### `faqs` (Json)
Frequently asked questions:

```json
[
  {
    "question": "What Size Walk-In Cooler Do I Need?",
    "answer": "The right size depends on your available space..."
  },
  {
    "question": "Is Refrigeration Included?",
    "answer": "It depends on the model..."
  }
]
```

**Source:** FAQ accordion sections (`<div class="faq">`)

---

#### `productOptions` (Json)
Product variants/options with pricing:

```json
[
  {
    "label": "Door Hinge",
    "name": "door-hinge",
    "options": [
      { "label": "Left Hinged", "price": "" },
      { "label": "Right Hinged", "price": "" }
    ]
  },
  {
    "label": "Add-Ons",
    "name": "add-ons",
    "options": [
      { "label": "LED Light", "price": "150.00" },
      { "label": "Door Kick Plate", "price": "160.00" }
    ]
  }
]
```

**Source:** 
```html
<select name="Door Hinge">
  <option>Left Hinged</option>
  <option>Right Hinged</option>
</select>
```

---

#### `features` (Json)
Grouped features by category:

```json
{
  "panels": [
    "4\" Thick Foamed-In-Place Polyurethane Insulation",
    "Cam-Lock Panels, Tongue & Groove Design",
    "24 Gauge Pre-Painted White Galvanized Steel",
    "R27 for Coolers and R33 for Freezers"
  ],
  "doors": [
    "30\" or 36\" wide doors (left or right hinged)",
    "Self-Closing, Flush-Mounted Doors",
    "Keyed Locking Door Handle"
  ],
  "topMount": [
    "Self-Contained Package",
    "230V, Hard Wire, R448A Refrigerant",
    "1 Year Compressor And Parts Warranty"
  ],
  "remote": [
    "Includes Condensing Units And Evaporators",
    "Pre-Mounted Expansion Valve"
  ]
}
```

**Source:** Feature sections with headings like "Panels", "Doors", "Top Mount", etc.

---

## 🎨 Data Extraction Strategy

### Images
1. Try JSON-LD structured data (`<script type="application/ld+json">`)
2. Meta tags (`<meta property="og:image">`)
3. Product gallery (`.product__media img`)
4. Fallback: All Shopify CDN images

**Clean URLs:**
- Remove query parameters: `?v=123456`
- Use high-res versions: Replace `_small`, `_medium` with `_2048x`

### Price
```javascript
// Extract from: $10,905.00 / Ea.
const priceText = $('.price__regular .price-item--regular').text();
const price = priceText.replace(/[^0-9.]/g, ''); // "10905.00"
```

### SKU
```javascript
// Extract from title or specs
const skuMatch = title.match(/([A-Z]{3}\d+[A-Z]?\d*)/);
const sku = skuMatch ? skuMatch[1] : ''; // "DCWF12X7"
```

### Type Classification
```javascript
const titleLower = title.toLowerCase();
let type = 'cooler';
if (titleLower.includes('display')) {
  type = 'display-cooler';
} else if (titleLower.includes('combo')) {
  type = 'combo';
} else if (titleLower.includes('freezer')) {
  type = 'freezer';
}
```

---

## 🔧 Scraper Implementation

### Complete Product Data Object
```typescript
const productData: ProductData = {
  title,
  slug: generateSlug(title),
  brand: 'Astra',
  sku,
  price,
  images: images.length > 0 ? images : ['/placeholder.png'],
  description: description || '',
  keyFeatures: keyFeatures.join('\n'),
  condition: 'New',
  type: determineType(title),
  warranty: extractWarranty($),
  detailedFeatures: extractFeatures($),
  specs: Object.keys(specs).length > 0 ? specs : null,
  documents: extractDocuments($),
  faqs: extractFAQs($),
  productOptions: extractOptions($),
  features: extractGroupedFeatures($),
  categoryId: determineCategoryId(title, categories)
};
```

---

## 📊 Category Assignment Logic

```typescript
function determineCategory(title: string): string {
  const titleLower = title.toLowerCase();
  
  // Base type
  let baseType = 'cooler';
  if (titleLower.includes('combo')) baseType = 'combo';
  else if (titleLower.includes('freezer')) baseType = 'freezer';
  
  // Sub-type
  let subType = 'box-only';
  if (titleLower.includes('with floor')) subType = 'with-floor';
  else if (titleLower.includes('no floor')) subType = 'no-floor';
  else if (titleLower.includes('top mount')) subType = 'top-mount';
  else if (titleLower.includes('remote')) subType = 'remote';
  else if (titleLower.includes('display')) subType = 'display';
  
  return `walk-in-${baseType}-${subType}`;
}
```

---

## ✅ Quality Checks

Before saving to database, validate:

| Field | Validation | Action if Invalid |
|-------|-----------|------------------|
| `title` | Length > 10 | Skip product |
| `price` | Numeric, > 0 | Set to "0" |
| `images` | At least 1 image | Use placeholder |
| `sku` | Not empty | Generate from title |
| `brand` | Always "Astra" | Hardcode |

---

## 🎯 Sample Complete Product

See: `astra-product-sample-schema.json` for a full example with all fields populated.

---

## 🚀 Usage in Code

### Fetch Product
```typescript
const product = await prisma.product.findUnique({
  where: { id: productId },
  include: { category: true }
});
```

### Display Product Options
```typescript
{product.productOptions?.map((option, i) => (
  <div key={i}>
    <label>{option.label}</label>
    <select>
      {option.options.map((opt, j) => (
        <option key={j}>
          {opt.label} {opt.price && `+$${opt.price}`}
        </option>
      ))}
    </select>
  </div>
))}
```

### Display Specs
```typescript
{Object.entries(product.specs || {}).map(([key, value]) => (
  <div key={key}>
    <strong>{key}:</strong> {value}
  </div>
))}
```

---

## 📝 Notes

- All Astra products use `brand: "Astra"` (hardcoded)
- Price stored as string without $ or commas: `"10905.00"`
- Images stored as full URLs (Shopify CDN)
- Features can be in `detailedFeatures` (array) or `features` (grouped object)
- FAQs are standard across all walk-in products
- Product options determine variants (door hinge, size, add-ons)

