import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  page.on('response', async response => {
    if (response.url().includes('searchanise')) {
      console.log('Searchanise URL:', response.url());
    }
  });

  const url = `https://www.atlanticse.com/a/search/astra-walk-in-combo-cooler-freezer-with-floor?filter_brand=Amerikooler`;
  console.log(`Scraping ${url}`);
  await page.goto(url, { waitUntil: 'networkidle' });

  await browser.close();
})();
