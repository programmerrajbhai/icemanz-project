const fs = require('fs');

const scraped = JSON.parse(fs.readFileSync('scraped_products_freezer.json', 'utf8'));

function parseProduct(p) {
  // Extract model number from title (e.g. Amerikooler QF060677**NBSC-O)
  const match = p.title.match(/Amerikooler (QF\d+\*\*.*?)\s/);
  if (!match) return null;
  const model = match[1];
  
  // Extract dimensions from model
  // e.g. QF060877 -> 06, 08, 77 (7' 7")
  let w = parseInt(model.substring(2, 4), 10);
  let l = parseInt(model.substring(4, 6), 10);
  let dims = `${w}' x ${l}' x 7' 7"`;
  if (model.includes('QF06107**')) {
     w = 6; l = 10; dims = `6' x 10' x 7' 7"`;
  }
  
  const isOutdoor = model.endsWith('-O');
  const isTopMount = model.includes('BSC') || model.includes('BS2C') || model.includes('B2SC');
  
  const location = isOutdoor ? 'Outdoor' : 'Indoor';
  let typeStr = isTopMount ? 'Walk-in Freezer with Top-Mounted Refrigeration' : 'Box Only Walk-in Freezer';
  const typeFilter = isTopMount ? 'Top-Mount Refrigeration' : 'No Refrigeration';
  
  const fullTitle = `Amerikooler ${model} ${dims} Quick Ship With Floor ${location} ${typeStr}`;
  const slug = fullTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  
  const priceMatch = p.price.match(/\$([\d,]+(\.\d{2})?)/);
  const price = priceMatch ? priceMatch[1].replace(',', '') : '';
  
  return {
    title: fullTitle,
    slug: slug,
    price: price,
    images: p.image ? [p.image] : [],
    type: typeFilter
  };
}

const finalProducts = scraped.map(parseProduct).filter(Boolean);
fs.writeFileSync('final_products_freezer.json', JSON.stringify(finalProducts, null, 2));
console.log(`Generated ${finalProducts.length} products`);