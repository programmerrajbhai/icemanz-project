const fs = require('fs');

async function scrape() {
    try {
        const data = fs.readFileSync('test.html', 'utf8');

        const products = [];

        // We can extract each product container blocks
        // <div class="product_container">
        // ...
        // <div class="product_description_container">

        // A simple approach is to find all titles and then match their descriptions and images.
        // Let's use regex to find all <h3> titles in product_description_container

        const titleRegex = /<h3>(ADR[^<]+)<\/h3>/gi;
        let match;
        const titles = [];
        while ((match = titleRegex.exec(data)) !== null) {
            titles.push(match[1].trim());
        }

        for (const title of titles) {
            // Find the description
            // <div class="product-name">\s*<h3>ADR060AE</h3>\s*</div>\s*<div class="product-desc">\s*<p>(.*?)</p>
            const descRegex = new RegExp(`<h3>${title}</h3>\\s*</div>\\s*<div class="product-desc">\\s*<p>(.*?)</p>`, 'i');
            const descMatch = data.match(descRegex);
            let description = descMatch ? descMatch[1].trim() : '';
            description = description.replace(/&amp;/g, '&');

            // Find the image
            // <a href="...adr060ae/"><img ... src="(...)" ... srcset="..."
            const imgBlockRegex = new RegExp(`<a href="[^"]*${title.toLowerCase()}/?"><img[^>]*srcset="([^"]+)"`, 'i');
            const imgMatch = data.match(imgBlockRegex);

            let imageUrl = '';
            if (imgMatch) {
                const srcset = imgMatch[1];
                const parts = srcset.split(',');
                const largest = parts[parts.length - 1].trim().split(' ')[0];
                imageUrl = largest;
            } else {
                // fallback to src
                const srcRegex = new RegExp(`<a href="[^"]*${title.toLowerCase()}/?"><img[^>]*src="([^"]+)"`, 'i');
                const srcMatch = data.match(srcRegex);
                if (srcMatch) imageUrl = srcMatch[1];
            }

            products.push({
                title,
                description,
                features: description,
                imageUrl
            });
        }

        fs.writeFileSync('turboair_products.json', JSON.stringify(products, null, 2));
        console.log(`Successfully extracted ${products.length} products to turboair_products.json`);

    } catch (error) {
        console.error('Error scraping:', error);
    }
}

scrape();