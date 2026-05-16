const fs = require('fs');

const scraped = JSON.parse(fs.readFileSync('scraped_combo_products.json', 'utf8'));

function parseProduct(p) {
    const fullTitle = p.title.replace(/\s+/g, ' ').trim();
    const slug = fullTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const priceMatch = p.price.match(/\$([\d,]+(\.\d{2})?)/);
    const price = priceMatch ? priceMatch[1].replace(',', '') : '';

    return {
        title: fullTitle,
        slug: slug,
        price: price,
        images: p.image ? [p.image] : [],
        type: 'Top-Mount Refrigeration'
    };
}

const finalProducts = scraped.map(parseProduct).filter(Boolean);
fs.writeFileSync('final_combo_products.json', JSON.stringify(finalProducts, null, 2));
console.log(`Generated ${finalProducts.length} combo products`);
