import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/walk-in-cooler-freezer/walk-in-cooler-no-floor?busta=' + Date.now(), { waitUntil: 'domcontentloaded' });
  
  await page.waitForTimeout(2000);
  
  const content = await page.evaluate(() => {
    return {
      productCount: document.querySelectorAll('[data-product-count]').length ? document.querySelector('[data-product-count]').getAttribute('data-product-count') : null,
      allCount: document.querySelectorAll('[data-all-count]').length ? document.querySelector('[data-all-count]').getAttribute('data-all-count') : null,
      catCount: document.querySelectorAll('[data-cat-count]').length ? document.querySelector('[data-cat-count]').getAttribute('data-cat-count') : null,
      renderedProducts: document.querySelectorAll('.group[href^="/walk-in-cooler-freezer/"]').length
    };
  });
  
  console.log(content);
  await browser.close();
})();