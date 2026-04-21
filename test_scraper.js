const cheerio = require('cheerio');
const fs = require('fs');

const html = fs.readFileSync('test.html', 'utf8');
const $ = cheerio.load(html);
const productUrls = new Set();
$('.product_container a').each((i, el) => {
  const href = $(el).attr('href');
  if (href && href.includes('/products/')) {
    productUrls.add(href);
  }
});
console.log(Array.from(productUrls));