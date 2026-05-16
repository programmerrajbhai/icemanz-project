import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  let allProducts = [];
  
  // Total 30 products expected, probably 2 pages max
  for (let pageNum = 1; pageNum <= 2; pageNum++) {
    const url = `https://www.atlanticse.com/a/search/astra-walk-in-freezer-with-floor?filter_brand=Amerikooler&page=${pageNum}`;
    console.log(`Scraping ${url}`);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(5000); // Wait for searchanise widget
    
    const products = await page.evaluate(() => {
      const items = document.querySelectorAll('.snize-product, .product-item, .grid-product');
      const results = [];
      items.forEach(item => {
        const titleEl = item.querySelector('.snize-title, .product-item__title, .grid-product__title');
        const priceEl = item.querySelector('.snize-price, .price');
        const imgEl = item.querySelector('img');
        
        if (titleEl) {
          results.push({
            title: titleEl.innerText.trim(),
            price: priceEl ? priceEl.innerText.trim().replace(/\n/g, ' ') : '',
            image: imgEl ? imgEl.src : ''
          });
        }
      });
      return results;
    });
    
    if (products.length === 0) break; // Exit if no more products found
    allProducts = allProducts.concat(products);
  }
  
  fs.writeFileSync('scraped_products_freezer.json', JSON.stringify(allProducts, null, 2));
  await browser.close();
  console.log(`Scraped ${allProducts.length} products`);
})();