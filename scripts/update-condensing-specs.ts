import prisma from '../src/lib/prisma';

const skuDetails: Record<string, { size: string, width: string, height: string, voltage: string }> = {
  // Size 1: 24.5(D) x 28.25(W) x 20.75(H) (6 products)
  'TS006MR404A2': { size: '24.5(D) x 28.25(W) x 20.75(H)', width: '28.5 Inches', height: '20.75 inches', voltage: '208-230V/1Ph/60Hz' },
  'TS008MR404A2': { size: '24.5(D) x 28.25(W) x 20.75(H)', width: '28.5 Inches', height: '20.75 inches', voltage: '208-230V/1Ph/60Hz' },
  'TS010MR404A2': { size: '24.5(D) x 28.25(W) x 20.75(H)', width: '28.5 Inches', height: '20.75 inches', voltage: '208-230V/1Ph/60Hz' },
  'TS015XR404A2': { size: '24.5(D) x 28.25(W) x 20.75(H)', width: '28.25 Inches', height: '20.75 inches', voltage: '208-230V/1Ph/60Hz' },
  'TS015XR404A3': { size: '24.5(D) x 28.25(W) x 20.75(H)', width: '28.25 Inches', height: '20.75 inches', voltage: '208-230V/3Ph/60Hz' },
  'TS010XR404A2': { size: '24.5(D) x 28.25(W) x 20.75(H)', width: '28.25 Inches', height: '20.75 inches', voltage: '208-230V/1Ph/60Hz' },
  'TS010XR404A2A': { size: '24.5(D) x 28.25(W) x 20.75(H)', width: '28.25 Inches', height: '20.75 inches', voltage: '208-230V/1Ph/60Hz' },
  'TS006XR404A2': { size: '24.5(D) x 28.25(W) x 20.75(H)', width: '28.25 Inches', height: '20.75 inches', voltage: '208-230V/1Ph/60Hz' },
  'TS008XR404A2': { size: '24.5(D) x 28.25(W) x 20.75(H)', width: '28.25 Inches', height: '20.75 inches', voltage: '208-230V/1Ph/60Hz' },
  'TS006MR404A3': { size: '24.5(D) x 28.25(W) x 20.75(H)', width: '28.5 Inches', height: '20.75 inches', voltage: '208-230V/3Ph/60Hz' },
  'TS008MR404A3': { size: '24.5(D) x 28.25(W) x 20.75(H)', width: '28.5 Inches', height: '20.75 inches', voltage: '208-230V/3Ph/60Hz' },
  'TS010MR404A3': { size: '24.5(D) x 28.25(W) x 20.75(H)', width: '28.5 Inches', height: '20.75 inches', voltage: '208-230V/3Ph/60Hz' },
  'TS010XR404A3': { size: '24.5(D) x 28.25(W) x 20.75(H)', width: '28.25 Inches', height: '20.75 inches', voltage: '208-230V/3Ph/60Hz' },

  // Size 2: 38.5(D) x 28.25(W) x 20.75(H) (18 products)
  'TS020MR404A2A': { size: '38.5(D) x 28.25(W) x 20.75(H)', width: '28.5 Inches', height: '20.75 inches', voltage: '208-230V/1Ph/60Hz' },
  'TS015MR404A3A': { size: '38.5(D) x 28.25(W) x 20.75(H)', width: '28.5 Inches', height: '20.75 inches', voltage: '208-230V/3Ph/60Hz' },
  'TS030XR404A3A': { size: '38.5(D) x 28.25(W) x 20.75(H)', width: '28.25 Inches', height: '20.75 inches', voltage: '208-230V/3Ph/60Hz' },
  'TS020XR404A2A': { size: '38.5(D) x 28.25(W) x 20.75(H)', width: '28.25 Inches', height: '20.75 inches', voltage: '208-230V/1Ph/60Hz' },
  'TS015MR404A2A': { size: '38.5(D) x 28.25(W) x 20.75(H)', width: '28.5 Inches', height: '20.75 inches', voltage: '208-230V/1Ph/60Hz' },
  'TS030XR404A2A': { size: '38.5(D) x 28.25(W) x 20.75(H)', width: '28.25 Inches', height: '20.75 inches', voltage: '208-230V/1Ph/60Hz' },
  'TS025XR404A3A': { size: '38.5(D) x 28.25(W) x 20.75(H)', width: '28.25 Inches', height: '20.75 inches', voltage: '208-230V/3Ph/60Hz' },
  'TS060XR404A3A': { size: '38.5(D) x 28.25(W) x 20.75(H)', width: '28.25 Inches', height: '20.75 inches', voltage: '208-230V/3Ph/60Hz' },
  'TS025MR404A3A': { size: '38.5(D) x 28.25(W) x 20.75(H)', width: '28.5 Inches', height: '20.75 inches', voltage: '208-230V/3Ph/60Hz' },
  'TS020MR404A3': { size: '38.5(D) x 28.25(W) x 20.75(H)', width: '28.5 Inches', height: '20.75 inches', voltage: '208-230V/3Ph/60Hz' },
  'TS020MR404A3A': { size: '38.5(D) x 28.25(W) x 20.75(H)', width: '28.5 Inches', height: '20.75 inches', voltage: '208-230V/3Ph/60Hz' },
  'TS025MR404A2A': { size: '38.5(D) x 28.25(W) x 20.75(H)', width: '28.5 Inches', height: '20.75 inches', voltage: '208-230V/1Ph/60Hz' },
  'TS020XR404A3A': { size: '38.5(D) x 28.25(W) x 20.75(H)', width: '28.25 Inches', height: '20.75 inches', voltage: '208-230V/3Ph/60Hz' },
  'TS035XR404A2A': { size: '38.5(D) x 28.25(W) x 20.75(H)', width: '28.25 Inches', height: '20.75 inches', voltage: '208-230V/1Ph/60Hz' },
  'TS035XR404A3A': { size: '38.5(D) x 28.25(W) x 20.75(H)', width: '28.25 Inches', height: '20.75 inches', voltage: '208-230V/3Ph/60Hz' },
  'TS045XR404A2A': { size: '38.5(D) x 28.25(W) x 20.75(H)', width: '28.25 Inches', height: '20.75 inches', voltage: '208-230V/1Ph/60Hz' },
  'TS045XR404A3A': { size: '38.5(D) x 28.25(W) x 20.75(H)', width: '28.25 Inches', height: '20.75 inches', voltage: '208-230V/3Ph/60Hz' },
  'TS055XR404A2A': { size: '38.5(D) x 28.25(W) x 20.75(H)', width: '28.25 Inches', height: '20.75 inches', voltage: '208-230V/1Ph/60Hz' },
  'TS055XR404A3A': { size: '38.5(D) x 28.25(W) x 20.75(H)', width: '28.25 Inches', height: '20.75 inches', voltage: '208-230V/3Ph/60Hz' },

  // Size 3: 38.5(D) x 30.25(W) x 27.25(H) (5 products)
  'TS040MR404A2': { size: '38.5(D) x 30.25(W) x 27.25(H)', width: '30.25 Inches', height: '27.25 inches', voltage: '208-230V/1Ph/60Hz' },
  'TS030MR404A2': { size: '38.5(D) x 30.25(W) x 27.25(H)', width: '30.25 Inches', height: '27.25 inches', voltage: '208-230V/1Ph/60Hz' },
  'TS030MR404A3': { size: '38.5(D) x 30.25(W) x 27.25(H)', width: '30.25 Inches', height: '27.25 inches', voltage: '208-230V/3Ph/60Hz' },
  'TS040MR404A3': { size: '38.5(D) x 30.25(W) x 27.25(H)', width: '30.25 Inches', height: '27.25 inches', voltage: '208-230V/3Ph/60Hz' },
  'TS060MR404A3A': { size: '38.5(D) x 30.25(W) x 27.25(H)', width: '30.25 Inches', height: '27.25 inches', voltage: '208-230V/3Ph/60Hz' },
  'TS060MR404A3': { size: '38.5(D) x 30.25(W) x 27.25(H)', width: '30.25 Inches', height: '27.25 inches', voltage: '208-230V/3Ph/60Hz' },
  'TS040XR404A3A': { size: '38.5(D) x 30.25(W) x 27.25(H)', width: '30.25 Inches', height: '27.25 inches', voltage: '208-230V/3Ph/60Hz' },
  'TS050XR404A3A': { size: '38.5(D) x 30.25(W) x 27.25(H)', width: '30.25 Inches', height: '27.25 inches', voltage: '208-230V/3Ph/60Hz' },

  // Size 4: 42.4(D) x 30.25(W) x 29.75(H) (2 products)
  'TS050MR404A2A': { size: '42.4(D) x 30.25(W) x 29.75(H)', width: '30.25 Inches', height: '29.75 inches', voltage: '208-230V/1Ph/60Hz' },
  'TS050MR404A3A': { size: '42.4(D) x 30.25(W) x 29.75(H)', width: '30.25 Inches', height: '29.75 inches', voltage: '208-230V/3Ph/60Hz' },

  // Size 5: 46.4 (D) x 38.1 (W) x 38 (H) (2 products)
  'TS075XR404A3A': { size: '46.4 (D) x 38.1 (W) x 38 (H)', width: '38.1 Inches', height: '20.75 inches', voltage: '208-230V/3Ph/60Hz' },
  'TS100XR404A3': { size: '46.4 (D) x 38.1 (W) x 38 (H)', width: '38.1 Inches', height: '20.75 inches', voltage: '208-230V/3Ph/60Hz' },

  // Size 6: 58.2(D) x 38.1(W) x 39.25(H) (2 products)
  'TS075MR404A3A': { size: '58.2(D) x 38.1(W) x 39.25(H)', width: '38.1 Inches', height: '39.25 inches', voltage: '208-230V/3Ph/60Hz' },
  'TS100MR404A3A': { size: '58.2(D) x 38.1(W) x 39.25(H)', width: '38.1 Inches', height: '39.25 inches', voltage: '208-230V/3Ph/60Hz' },
  'TS075MR404A3': { size: '58.2(D) x 38.1(W) x 39.25(H)', width: '38.1 Inches', height: '39.25 inches', voltage: '208-230V/3Ph/60Hz' },
  'TS100MR404A3': { size: '58.2(D) x 38.1(W) x 39.25(H)', width: '38.1 Inches', height: '39.25 inches', voltage: '208-230V/3Ph/60Hz' }
};

async function main() {
  const products = await prisma.product.findMany();
  console.log('Total products in DB:', products.length);

  let updatedCount = 0;
  for (const product of products) {
    let sku = (product.sku || '').toUpperCase();
    if (!sku) {
      const match = product.title.match(/TS\d+[MX]R404A\w*/i);
      if (match) sku = match[0].toUpperCase();
    }

    if (sku && skuDetails[sku]) {
      const details = skuDetails[sku];
      let existingSpecs: any = {};
      if (typeof product.specs === 'object' && product.specs !== null && !Array.isArray(product.specs)) {
        existingSpecs = product.specs;
      }

      const updatedSpecs = {
        ...existingSpecs,
        size: details.size,
        width: details.width,
        height: details.height,
        voltage: details.voltage,
        condenserType: 'Compressor',
        productType: 'Condensing Unit'
      };

      const keyFeatures = `${product.keyFeatures || ''} • Size: ${details.size} • Width: ${details.width} • Height: ${details.height} • Voltage: ${details.voltage} • Condenser Type: Compressor • Product Type: Condensing Unit`;

      await prisma.product.update({
        where: { id: product.id },
        data: {
          specs: updatedSpecs,
          keyFeatures: keyFeatures,
          type: 'Condensing Unit'
        }
      });
      updatedCount++;
    }
  }

  console.log(`Updated ${updatedCount} condensing unit products with full specs!`);
}

main().finally(() => prisma.$disconnect());
