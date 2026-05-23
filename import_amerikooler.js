const { PrismaClient } = require('@prisma/client');
const cheerio = require('cheerio');

const prisma = new PrismaClient();

async function run() {
  try {
    const response = await fetch('https://www.atlanticse.com/collections/astra-walk-in-cooler-no-floor/products.json?limit=250&page=2');
    const resData = await response.json();
    const products = resData.products.filter(p => p.vendor === 'Amerikooler');
    console.log(`Found ${products.length} Amerikooler products.`);

    const category = await prisma.category.findUnique({ where: { slug: 'walk-in-cooler-no-floor' } });
    if (!category) {
      console.error('Category walk-in-cooler-no-floor not found!');
      return;
    }

    for (const p of products) {
      const isTopMount = p.title.includes('Top Mounted');
      const isBoxOnly = p.title.includes('Box Only');
      let type = null;
      if (isTopMount) type = 'Top-Mount Refrigeration';
      else if (isBoxOnly) type = 'No Refrigeration';

      // Parse body_html
      const $ = cheerio.load(p.body_html || '');

      const features = [];
      $('li').each((_, el) => {
        features.push($(el).text().trim());
      });

      // Find spec sheet link
      let specSheetUrl = '';
      $('a').each((_, el) => {
        const href = $(el).attr('href');
        if (href && href.includes('.pdf')) {
          specSheetUrl = href;
        }
      });

      // Find description text (first paragraph)
      const description = $('p').first().text().trim();

      const documents = [
        { name: 'Warranty', url: '#' },
        { name: 'About Amerikooler', url: '#' },
        { name: 'California 65 Statement', url: '#' }
      ];
      if (specSheetUrl) {
        documents.push({ name: 'Spec Sheet', url: specSheetUrl });
      }

      const price = p.variants && p.variants.length > 0 ? p.variants[0].price : '0.00';
      const images = p.images ? p.images.map(img => img.src) : [];

      await prisma.product.create({
        data: {
          title: p.title,
          slug: p.handle,
          badge: 'IN STOCK',
          price: price,
          images: images,
          description: description,
          type: type,
          detailedFeatures: features,
          documents: documents,
          categoryId: category.id
        }
      });
    }

    console.log('Import successful!');
  } catch (error) {
    console.error('Error importing:', error);
  } finally {
    await prisma.$disconnect();
  }
}

run();
