const { PrismaClient } = require('@prisma/client');
const cheerio = require('cheerio');

const prisma = new PrismaClient();

async function scrapeTurboAir(url, categorySlug) {
  console.log(`Scraping category: ${categorySlug} from ${url}`);
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
    const html = await res.text();
    const $ = cheerio.load(html);

    // Ensure category exists
    let category = await prisma.category.findUnique({ where: { slug: categorySlug } });
    if (!category) {
      console.log(`Category ${categorySlug} not found in DB! Please make sure it's created.`);
      return;
    }

    const productLinks = [];
    $('a').each((i, el) => {
      const href = $(el).attr('href');
      if (href && href.includes('/products/') && !href.endsWith('/products/') && !productLinks.includes(href)) {
        productLinks.push(href);
      }
    });
    console.log(`Extracted links for ${url}: ${productLinks.length}`);

    console.log(`Found ${productLinks.length} products.`);

    for (const link of productLinks) {
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
            // remove size suffix like -700x467
            src = src.replace(/-\d+x\d+(\.[a-zA-Z]+)$/, '$1');
            images.push(src);
          }
        });

        const sku = $$('.sku').text().trim() || null;

        const description = $$('.key_features').next('p').text().trim();
        const keyFeatures = $$('.key_features').next('p').text().trim(); // or use it as keyFeatures

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

        const specs = {}; // Specs might be extracted from table, but here we don't have one easily identified.

        // upsert product
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
            specs: Object.keys(specs).length > 0 ? specs : null,
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
            specs: Object.keys(specs).length > 0 ? specs : null,
            categoryId: category.id
          }
        });
        console.log(`Saved product: ${title}`);
      } catch (err) {
        console.error(`Error scraping ${link}:`, err.message);
      }
    }
  } catch (err) {
    console.error(`Error scraping category ${url}:`, err.message);
  }
}

async function main() {
  const categoriesToScrape = [
    // Evaporation Units
    {
      url: 'https://www.turboairinc.com/refrigerationsystem/product-category/2021/unit-coolers/low-profile-evaporator/air-defrost/',
      slug: 'low-profile-evaporator-air-defrost'
    },
    {
      url: 'https://www.turboairinc.com/refrigerationsystem/product-category/2021/unit-coolers/low-profile-evaporator/electric-defrost/',
      slug: 'low-profile-evaporator-electric-defrost'
    },
    {
      url: 'https://www.turboairinc.com/refrigerationsystem/product-category/2021/unit-coolers/medium-profile-2025/air-defrost-2/',
      slug: 'medium-profile-air-defrost'
    },
    {
      url: 'https://www.turboairinc.com/refrigerationsystem/product-category/2021/unit-coolers/medium-profile-2025/electric-defrost-6fpi/',
      slug: 'medium-profile-electric-defrost-6fpi'
    },
    {
      url: 'https://www.turboairinc.com/refrigerationsystem/product-category/2021/unit-coolers/medium-profile-2025/electric-defrost-4fpi/',
      slug: 'medium-profile-electric-defrost-4fpi'
    },
    {
      url: 'https://www.turboairinc.com/refrigerationsystem/product-category/2021/unit-coolers/center-mount-evaporator-low-velocity/air-defrost-center-mount/',
      slug: 'center-mount-evaporator-low-velocity-air-defrost'
    },
    {
      url: 'https://www.turboairinc.com/refrigerationsystem/product-category/2021/unit-coolers/center-mount-evaporator-low-velocity/electric-defrost-center-mount/',
      slug: 'center-mount-evaporator-low-velocity-electric-defrost'
    },
    {
      url: 'https://www.turboairinc.com/refrigerationsystem/product-category/2021/unit-coolers/thin-profile-evaporator-reach-in/air-defrost-thin-profile/',
      slug: 'thin-profile-evaporator-reach-in-air-defrost'
    },
    {
      url: 'https://www.turboairinc.com/refrigerationsystem/product-category/2021/unit-coolers/thin-profile-evaporator-reach-in/electric-defrost-thin-profile/',
      slug: 'thin-profile-evaporator-reach-in-electric-defrost'
    },
    // Condensing Units
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
