import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  let allProducts = [];

  // Total 42 products expected, probably 3 pages max
  for (let pageNum = 1; pageNum <= 3; pageNum++) {
    const url = `https://www.atlanticse.com/a/search/astra-walk-in-combo-cooler-freezer-with-floor?filter_brand=Amerikooler&filter_Refrigeration=Top-Mount+Refrigeration&page=${pageNum}`;
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
          let fullTitle = titleEl.innerText.trim();
          if (imgEl && imgEl.alt && imgEl.alt.length > fullTitle.length && imgEl.alt !== "Image") {
            fullTitle = imgEl.alt.trim();
          }
          results.push({
            title: fullTitle,
            price: priceEl ? priceEl.innerText.trim().replace(/\n/g, ' ') : '',
            image: imgEl ? imgEl.src : ''
          });
        }
      });
      return results;
    });

    console.log(`Found ${products.length} products on page ${pageNum}`);
    if (products.length === 0) {
      break;
    }
    allProducts = allProducts.concat(products);
  }

  console.log(`Total products scraped: ${allProducts.length}`);
  fs.writeFileSync('scraped_combo_products.json', JSON.stringify(allProducts, null, 2));

  await browser.close();
})();
