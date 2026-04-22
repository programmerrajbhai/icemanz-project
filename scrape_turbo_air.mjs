import { PrismaClient } from '@prisma/client';
import * as cheerio from 'cheerio';

const prisma = new PrismaClient();

const slugify = (text) => text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');

async function scrapeCategory(url, categoryName) {
    console.log(`Scraping category: ${categoryName} from ${url}`);

    // Find category in DB
    const category = await prisma.category.findFirst({
        where: { name: categoryName }
    });

    if (!category) {
        console.error(`Category ${categoryName} not found in database!`);
        return;
    }
    console.log(`Found category: ${category.name} (ID: ${category.id})`);

    try {
        let currentPage = 1;
        let hasNextPage = true;
        const productLinks = new Set();

        while (hasNextPage) {
            const pageUrl = currentPage === 1 ? url : `${url}page/${currentPage}/`;
            console.log(`Fetching page ${currentPage}: ${pageUrl}`);

            const res = await fetch(pageUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
                }
            });

            if (!res.ok) {
                if (res.status === 404) {
                    console.log('Reached end of pages.');
                    hasNextPage = false;
                    break;
                }
                throw new Error(`HTTP ${res.status}`);
            }

            const html = await res.text();
            const $ = cheerio.load(html);

            let productsOnPage = 0;
            $('.product_container a').each((i, el) => {
                const href = $(el).attr('href');
                if (href && href.includes('/products/')) {
                    productLinks.add(href);
                    productsOnPage++;
                }
            });

            if (productsOnPage === 0) {
                console.log('No products found on this page. Stopping pagination.');
                hasNextPage = false;
            } else {
                currentPage++;
                await new Promise(r => setTimeout(r, 500));
            }
        }

        const linksArray = Array.from(productLinks);
        console.log(`Found ${linksArray.length} products total across all pages. First link: ${linksArray[0]}`);

        for (const link of linksArray) {
            if (!link.includes('products/')) continue; // Skip non-product links

            console.log(`Scraping product: ${link}`);
            try {
                const prodRes = await fetch(link, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
                    }
                });
                const prodHtml = await prodRes.text();
                const $prod = cheerio.load(prodHtml);

                const title = $prod('h1').text().trim() || $prod('h2').first().text().trim();
                if (!title) {
                    console.log(`Skipping ${link} because no title found.`);
                    continue;
                }

                // Description
                let description = $prod('h4').filter((i, el) => $prod(el).text().includes('Key Features')).next('p').text().trim();
                if (!description) description = $prod('.woocommerce-product-details__short-description').text().trim() || $prod('.product-desc').text().trim() || '';

                // Images
                const images = [];
                $prod('img').each((i, el) => {
                    let src = $prod(el).attr('data-src') || $prod(el).attr('src');
                    if (src && src.includes('wp-content/uploads') &&
                        !src.includes('logo') &&
                        !src.includes('favicon') &&
                        !src.includes('DarkDotBox') &&
                        !src.includes('LightDotBox') &&
                        !src.includes('Closing_Button') &&
                        !src.includes('AC_Logo') &&
                        !src.includes('100x100')) {

                        if (src.includes('-')) {
                            const originalSrc = src.replace(/-\d+x\d+/, '');
                            if (!images.includes(originalSrc)) images.push(originalSrc);
                        } else {
                            if (!images.includes(src)) images.push(src);
                        }
                    }
                });

                const uniqueImages = [...new Set(images)];

                // Features
                const detailedFeatures = [];
                $prod('.features_info p, .product_features li, .features li, #tab-features li').each((i, el) => {
                    const text = $prod(el).text().trim();
                    if (text) detailedFeatures.push(text);
                });

                // Warranty
                const warranty = [];
                $prod('h4').filter((i, el) => $prod(el).text().includes('Warranty')).next('ul').find('li').each((i, el) => {
                    warranty.push($prod(el).text().trim());
                });

                // Specs / Documents (PDFs)
                const documents = [];
                $prod('a').each((i, el) => {
                    const href = $prod(el).attr('href');
                    if (href && href.endsWith('.pdf')) {
                        const docTitle = $prod(el).text().trim() || 'Document';
                        if (!documents.find(d => d.url === href)) {
                            documents.push({ name: docTitle, url: href });
                        }
                    }
                });

                const productData = {
                    title,
                    slug: slugify(title) + '-' + Math.random().toString(36).substring(7),
                    description: description,
                    keyFeatures: detailedFeatures.join('\n'),
                    detailedFeatures: detailedFeatures,
                    images: uniqueImages,
                    warranty: warranty,
                    documents: documents.length > 0 ? documents : null,
                    categoryId: category.id
                };

                console.log(`Trying to save: ${title}...`);
                // Save to DB
                await prisma.product.create({
                    data: productData
                });

                console.log(`Saved product: ${title}`);

                // Wait a bit to not overwhelm the server
                await new Promise(r => setTimeout(r, 500));

            } catch (err) {
                console.error(`Error scraping product ${link}:`, err.message);
            }
        }
    } catch (err) {
        console.error(`Error scraping category ${url}:`, err.message);
    }
}

async function main() {
    await scrapeCategory('https://www.turboairinc.com/refrigerationsystem/product-category/2021/condensing-units/scroll-condensing-unit/', 'Scroll compressor');
    await scrapeCategory('https://www.turboairinc.com/refrigerationsystem/product-category/2021/condensing-units/semi-hermetic-discus-condensing-unit/', 'Semi- Hermetic');
    console.log("Done!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
