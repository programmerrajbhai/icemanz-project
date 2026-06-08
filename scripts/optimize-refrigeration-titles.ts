import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function toTitleCase(str: string) {
    return str.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

async function main() {
    console.log("Starting script to format refrigeration-equipment titles...");

    // 1. Get the parent categories
    const parentCategories = await prisma.category.findMany({
        where: {
            slug: {
                in: ['condensing-units', 'evaporation-units', 'combo-units-package-units', 'combo-units-indoor', 'combo-units-outdoor']
            }
        }
    });

    if (parentCategories.length === 0) {
        console.error("Categories not found!");
        return;
    }

    // 2. Recursively find all subcategories
    const categoryIds = new Set<string>();
    parentCategories.forEach(c => categoryIds.add(c.id));

    let currentIds = parentCategories.map(c => c.id);
    while (currentIds.length > 0) {
        const subs = await prisma.category.findMany({
            where: { parentId: { in: currentIds } }
        });
        currentIds = subs.map(s => s.id);
        subs.forEach(s => categoryIds.add(s.id));
    }

    console.log(`Found ${categoryIds.size} categories related to refrigeration-equipment.`);

    // 3. Fetch products in these categories
    const products = await prisma.product.findMany({
        where: { categoryId: { in: Array.from(categoryIds) } },
        select: { id: true, title: true }
    });

    console.log(`Found ${products.length} products. Generating preview for first 10 products...`);
    console.log("===========================================================================");

    // 4. Parsing Logic
    let count = 0;
    for (const p of products) {
        if (count >= 30) break; // Show 30 for better coverage

        let original = p.title;
        let current = original;

        // Extract Bracket
        let brackets = "";
        const bracketMatch = current.match(/\((.*?)\)/);
        if (bracketMatch) {
            brackets = `(${toTitleCase(bracketMatch[1].trim())})`;
            current = current.replace(/\(.*\)/, '');
        }

        // Extract HP
        let hp = "";
        const hpMatches = current.match(/\b\d+(?:\.\d+)?(?:-\d+(?:\.\d+)?)?(?:\/\d+)?\s*HP\b/gi);
        if (hpMatches && hpMatches.length > 0) {
            // Keep the first one found, format it
            hp = hpMatches[0].trim().toUpperCase();
            // Remove all occurrences of HP to avoid duplicates
            current = current.replace(/\b\d+(?:\.\d+)?(?:-\d+(?:\.\d+)?)?(?:\/\d+)?\s*HP\b/gi, '');
        }

        // Extract Temp
        let temp = "";
        const tempMatch = current.match(/\b(Low Temp|Medium Temp|High Temp|Medium\/High Temp|Med\/High Temp|Med Temp)\b/gi);
        if (tempMatch) {
            temp = tempMatch[0].trim();
            // Title Case
            temp = temp.split(/[\s\/]+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
            if (temp.includes('Med') && !temp.includes('Medium')) {
                temp = temp.replace('Med', 'Medium');
            }
            if (tempMatch[0].includes('/')) {
                // Restore slash if it was there
                temp = temp.replace(' High', '/High');
            }

            // Remove all occurrences
            current = current.replace(/\b(Low Temp|Medium Temp|High Temp|Medium\/High Temp|Med\/High Temp|Med Temp)\b/gi, '');
        }

        // Extract Type
        let type = "";
        const typeMatch = current.match(/\b(Condensing Units?|Evaporation Units?|Evaporator Units?|Evaporators?|Compressors?|Unit Coolers?|Combo Units?\/Package Units?|Combo Units?|Package Units?)\b/gi);
        if (typeMatch) {
            type = typeMatch[0].trim();
            // Singularize and Title Case
            type = toTitleCase(type)
                .replace(/Units$/i, 'Unit')
                .replace(/Evaporators$/i, 'Evaporator')
                .replace(/Compressors$/i, 'Compressor')
                .replace(/Coolers$/i, 'Cooler');
            current = current.replace(/\b(Condensing Units?|Evaporation Units?|Evaporator Units?|Evaporators?|Compressors?|Unit Coolers?|Combo Units?\/Package Units?|Combo Units?|Package Units?)\b/gi, '');
        }

        // Clean up remaining text (Brand + Model)
        // Remove commas, hyphens, and extra spaces
        current = current.replace(/,/g, '').replace(/-/g, ' ').trim();
        current = current.replace(/\s+/g, ' '); // collapse multiple spaces

        const brandModel = current;

        // Reconstruct title: [Brand] [Model] [HP] [Temp] [Type] ([Additional Features/Profile])
        const parts = [brandModel, hp, temp, type, brackets].filter(Boolean);
        const newTitle = parts.join(' ');

        console.log(`Original : ${original}`);
        console.log(`Formatted: ${newTitle}`);
        console.log("---------------------------------------------------------------------------");

        count++;
    }

    console.log("Preview complete. No database records were updated.");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });