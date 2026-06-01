const { PrismaClient } = require('@prisma/client');
const cheerio = require('cheerio');

const prisma = new PrismaClient();

async function scrapeTurboAir(baseUrl, categorySlug) {
  console.log(`Scraping category: ${categorySlug} from ${baseUrl}`);
  try {
    let category = await prisma.category.findUnique({ where: { slug: categorySlug } });
    if (!category) {
      console.log(`Category ${categorySlug} not found in DB! Please make sure it's created.`);
      return;
    }

    const allProductLinks = new Set();
    let currentPage = 1;
    let hasMorePages = true;

    while (hasMorePages) {
      const url = currentPage === 1 ? baseUrl : `${baseUrl}page/${currentPage}/`;
      console.log(`Fetching page ${currentPage}: ${url}`);

      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });

      if (!res.ok) {
        if (res.status === 404) {
          hasMorePages = false;
          break;
        }
        console.log(`Failed to fetch page ${currentPage} (Status: ${res.status})`);
        break;
      }

      const html = await res.text();
      const $ = cheerio.load(html);

      let foundOnPage = 0;
      $('a').each((i, el) => {
        const href = $(el).attr('href');
        if (href && href.includes('/products/') && !href.endsWith('/products/')) {
          if (!allProductLinks.has(href)) {
            allProductLinks.add(href);
            foundOnPage++;
          }
        }
      });

      console.log(`Found ${foundOnPage} new products on page ${currentPage}`);

      // If we didn't find any new product links on this page, or we don't see a next page link, stop
      if (foundOnPage === 0 || !html.includes('page-item next')) {
        hasMorePages = false;
      } else {
        currentPage++;
      }
    }

    console.log(`Total products to scrape for ${categorySlug}: ${allProductLinks.size}`);

    for (const link of allProductLinks) {
      console.log(`Scraping product: ${link}`);
      try {
        const prodRes = await fetch(link, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        });
        const prodHtml = await prodRes.text();
        const $$ = cheerio.load(prodHtml);

        const title = $$('.product_top_name h2').text().trim();
        const slug = link.replace(/\/$/, '').split('/').pop();

        let price = null;

        const images = [];
        $$('.js-slide-item img').each((i, el) => {
          let src = $$(el).attr('src');
          if (src && !images.includes(src)) {
            src = src.replace(/-\d+x\d+(\.[a-zA-Z]+)$/, '$1');
            images.push(src);
          }
        });

        const sku = $$('.sku').text().trim() || null;

        const description = $$('.key_features').next('p').text().trim();
        const keyFeatures = $$('.key_features').next('p').text().trim();

        const detailedFeatures = [];
        $$('.features_info p').each((i, el) => {
          const txt = $$(el).text().trim().replace(/\s+/g, ' ');
          if (txt) detailedFeatures.push(txt);
        });

        const warranty = [];
        $$('.warranty').next('ul').find('li').each((i, el) => {
          warranty.push($$(el).text().trim());
        });

        const documents = [];
        $$('.documents_links_box a').each((i, el) => {
          documents.push({
            name: $$(el).text().trim() || 'Document',
            url: $$(el).attr('href')
          });
        });

        const specs = [];
        $$('table tbody tr').each((i, el) => {
          const tds = $$(el).find('td');
          if (tds.length === 2) {
            specs.push({
              label: $$(tds[0]).text().trim(),
              value: $$(tds[1]).text().trim()
            });
          }
        });

        if (!title) {
          console.log(`Title not found for ${link}, skipping...`);
          continue;
        }

        await prisma.product.upsert({
          where: { slug: slug },
          update: {
            title,
            brand: 'Turbo Air',
            sku,
            description,
            keyFeatures,
            detailedFeatures,
            warranty,
            price,
            images,
            documents: documents.length > 0 ? documents : null,
            specs: specs.length > 0 ? specs : null,
            categoryId: category.id
          },
          create: {
            title,
            slug,
            brand: 'Turbo Air',
            sku,
            description,
            keyFeatures,
            detailedFeatures,
            warranty,
            price,
            images,
            documents: documents.length > 0 ? documents : null,
            specs: specs.length > 0 ? specs : null,
            categoryId: category.id
          }
        });
        console.log(`Saved product: ${title}`);
      } catch (err) {
        console.error(`Error scraping ${link}:`, err.message);
      }

      await new Promise(r => setTimeout(r, 1000));
    }
  } catch (err) {
    console.error(`Error scraping category ${baseUrl}:`, err.message);
  }
}

async function main() {
  const categoriesToScrape = [
    {
      url: 'https://www.turboairinc.com/refrigerationsystem/product-category/2021/condensing-units/semi-hermetic-discus-condensing-unit/freezer-semi-hermetic-discus-compressor/',
      slug: 'low-profile-semi-hermetic'
    },
    {
      url: 'https://www.turboairinc.com/refrigerationsystem/product-category/2021/condensing-units/scroll-condensing-unit/freezer-scroll-compressor/',
      slug: 'low-profile-scroll-compressor'
    },
    {
      url: 'https://www.turboairinc.com/refrigerationsystem/product-category/2021/condensing-units/scroll-condensing-unit/cooler-scroll-compressor/',
      slug: 'medium-profile-scroll-compressor'
    }
  ];

  for (const cat of categoriesToScrape) {
    await scrapeTurboAir(cat.url, cat.slug);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
