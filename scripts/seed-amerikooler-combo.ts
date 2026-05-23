import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Fetching combo products from Atlantic SE...');
  const res = await fetch('https://www.atlanticse.com/collections/walk-in-cooler-freezer-combo/products.json?limit=250');
  const data = await res.json();
  
  const amerikoolerProducts = data.products.filter((p: any) => p.vendor.toLowerCase().includes('amerikooler'));
  console.log(`Found ${amerikoolerProducts.length} Amerikooler products.`);

  // Ensure category exists
  let category = await prisma.category.findUnique({
    where: { slug: 'walk-in-combo-cooler-freezer' }
  });

  if (!category) {
    console.log('Category not found, creating...');
    category = await prisma.category.create({
      data: {
        name: 'Walk-In Combo (Cooler & Freezer)',
        slug: 'walk-in-combo-cooler-freezer'
      }
    });
  }

  for (const p of amerikoolerProducts) {
    const title = p.title;
    const slug = p.handle;

    // Extract price from first variant
    let price = "0.00";
    if (p.variants && p.variants.length > 0) {
      price = p.variants[0].price;
    }

    // Extract images
    const images = p.images.map((img: any) => img.src);

    // Determine type based on tags or title
    let type = null;
    if (p.title.includes('Box Only')) {
      type = 'No Refrigeration';
    } else if (p.title.includes('Top Mounted Refrigeration')) {
      type = 'Top-Mount Refrigeration';
    }

    // Parse description and features from body_html
    // A simple regex approach or just saving it as description
    // The user wants real image, full content details page content
    const bodyHtml = p.body_html || '';

    // We can extract everything before <ul> as description
    // And <ul> items as detailedFeatures
    // And <a href="..."> inside <p> as Spec Sheet
    let description = '';
    let detailedFeatures: string[] = [];
    let specSheetUrl = '';

    const ulMatch = bodyHtml.match(/<ul>([\s\S]*?)<\/ul>/);
    if (ulMatch) {
      const liMatches = [...ulMatch[1].matchAll(/<li>([\s\S]*?)<\/li>/g)];
      detailedFeatures = liMatches.map(m => m[1].replace(/<[^>]+>/g, '').trim());
    }

    // Description is before first <ul>
    const descMatch = bodyHtml.split('<ul>')[0];
    description = descMatch.replace(/<[^>]+>/g, '').trim();

    // Spec sheet URL
    const aMatch = bodyHtml.match(/<a[^>]+href="([^"]+\.pdf[^"]*)"/i);
    if (aMatch) {
      specSheetUrl = aMatch[1];
    }

    let documents = [];
    if (specSheetUrl) {
      documents.push({
        name: 'Spec Sheet',
        url: specSheetUrl
      });
    }

    // Default documents if not found
    documents.push({ name: 'Warranty', url: 'https://cdn.shopify.com/s/files/1/0719/2369/5846/files/LIMITEDPANELWARRANTY.pdf?v=1736803042' });
    documents.push({ name: 'About Amerikooler', url: 'https://cdn.shopify.com/s/files/1/0719/2369/5846/files/Company-Material-AboutUs.pdf?v=1736802546' });
    documents.push({ name: 'California 65 Statement', url: 'https://cdn.shopify.com/s/files/1/0719/2369/5846/files/Atlantic_California_65_Statement.pdf.pdf?v=1773411453' });

    // Upsert product
    await prisma.product.upsert({
      where: { slug },
      update: {
        title,
        price,
        images,
        description,
        detailedFeatures,
        type,
        documents,
        categoryId: category.id
      },
      create: {
        title,
        slug,
        price,
        images,
        description,
        detailedFeatures,
        type,
        badge: 'IN STOCK',
        condition: 'New',
        documents,
        categoryId: category.id
      }
    });
    console.log(`Upserted ${title}`);
  }

  console.log('Done seeding Amerikooler Walk-in Freezer with Floor products.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
