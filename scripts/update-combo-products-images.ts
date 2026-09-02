import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Product image mappings from Atlantic SE website
  const productUpdates = [
    {
      sku: "CMB6X10",
      images: [
        "https://cdn11.bigcommerce.com/s-8ffc0/images/stencil/1280x1280/products/2046/5846/CMB6X10-5C5F-30L30L__40839.1733936881.jpg",
        "https://cdn11.bigcommerce.com/s-8ffc0/images/stencil/1280x1280/products/2046/5847/CMB6X10-5C5F-30R30R__02917.1733936881.jpg",
        "https://cdn11.bigcommerce.com/s-8ffc0/images/stencil/1280x1280/products/2046/5848/CMB6X10-7C3F-30L30L__54023.1733936881.jpg",
        "https://cdn11.bigcommerce.com/s-8ffc0/images/stencil/1280x1280/products/2046/5849/CMB6X10-7C3F-30R30R__60632.1733936881.jpg"
      ]
    },
    {
      sku: "CMB6X12",
      images: [
        "https://cdn11.bigcommerce.com/s-8ffc0/images/stencil/1280x1280/products/2047/5854/CMB6X12-7C5F-30L30L__35166.1733936917.jpg",
        "https://cdn11.bigcommerce.com/s-8ffc0/images/stencil/1280x1280/products/2047/5855/CMB6X12-7C5F-30R30R__31754.1733936917.jpg",
        "https://cdn11.bigcommerce.com/s-8ffc0/images/stencil/1280x1280/products/2047/5856/CMB6X12-8C4F-30L30L__43656.1733936917.jpg",
        "https://cdn11.bigcommerce.com/s-8ffc0/images/stencil/1280x1280/products/2047/5857/CMB6X12-8C4F-30R30R__22639.1733936917.jpg"
      ]
    },
    {
      sku: "CMB6X15",
      images: [
        "https://cdn11.bigcommerce.com/s-8ffc0/images/stencil/1280x1280/products/2048/5862/CMB6X15-10C5F-30L30L__82084.1733936944.jpg",
        "https://cdn11.bigcommerce.com/s-8ffc0/images/stencil/1280x1280/products/2048/5863/CMB6X15-10C5F-30R30R__20230.1733936944.jpg",
        "https://cdn11.bigcommerce.com/s-8ffc0/images/stencil/1280x1280/products/2048/5864/CMB6X15-8C7F-30L30L__61925.1733936944.jpg",
        "https://cdn11.bigcommerce.com/s-8ffc0/images/stencil/1280x1280/products/2048/5865/CMB6X15-8C7F-30R30R__29068.1733936944.jpg"
      ]
    },
    {
      sku: "CMB6X17",
      images: [
        "https://cdn11.bigcommerce.com/s-8ffc0/images/stencil/1280x1280/products/2049/5870/CMB6X17-11C6F-30L30L__60044.1733936969.jpg",
        "https://cdn11.bigcommerce.com/s-8ffc0/images/stencil/1280x1280/products/2049/5871/CMB6X17-11C6F-30R30R__90584.1733936969.jpg",
        "https://cdn11.bigcommerce.com/s-8ffc0/images/stencil/1280x1280/products/2049/5872/CMB6X17-9C8F-30L30L__93024.1733936969.jpg",
        "https://cdn11.bigcommerce.com/s-8ffc0/images/stencil/1280x1280/products/2049/5873/CMB6X17-9C8F-30R30R__98453.1733936969.jpg"
      ]
    },
    {
      sku: "CMB6X20",
      images: [
        "https://cdn11.bigcommerce.com/s-8ffc0/images/stencil/1280x1280/products/2050/5878/CMB6X20-13C7F-30L30L__95629.1733936993.jpg",
        "https://cdn11.bigcommerce.com/s-8ffc0/images/stencil/1280x1280/products/2050/5879/CMB6X20-13C7F-30R30R__17913.1733936993.jpg",
        "https://cdn11.bigcommerce.com/s-8ffc0/images/stencil/1280x1280/products/2050/5880/CMB6X20-10C10F-30L30L__41063.1733936993.jpg",
        "https://cdn11.bigcommerce.com/s-8ffc0/images/stencil/1280x1280/products/2050/5881/CMB6X20-10C10F-30R30R__09298.1733936993.jpg"
      ]
    },
    {
      sku: "CMB6X23",
      images: [
        "https://cdn11.bigcommerce.com/s-8ffc0/images/stencil/1280x1280/products/2051/5886/CMB6X23-15C8F-30L30L__53513.1733937016.jpg",
        "https://cdn11.bigcommerce.com/s-8ffc0/images/stencil/1280x1280/products/2051/5887/CMB6X23-15C8F-30R30R__12134.1733937016.jpg",
        "https://cdn11.bigcommerce.com/s-8ffc0/images/stencil/1280x1280/products/2051/5888/CMB6X23-12C11F-30L30L__93089.1733937017.jpg",
        "https://cdn11.bigcommerce.com/s-8ffc0/images/stencil/1280x1280/products/2051/5889/CMB6X23-12C11F-30R30R__42636.1733937017.jpg"
      ]
    },
    {
      sku: "CMB8X10",
      images: [
        "https://cdn11.bigcommerce.com/s-8ffc0/images/stencil/1280x1280/products/2052/5894/CMB8X10-5C5F-30L30L__49879.1733937042.jpg",
        "https://cdn11.bigcommerce.com/s-8ffc0/images/stencil/1280x1280/products/2052/5895/CMB8X10-5C5F-30R30R__56816.1733937042.jpg",
        "https://cdn11.bigcommerce.com/s-8ffc0/images/stencil/1280x1280/products/2052/5896/CMB8X10-7C3F-30L30L__71088.1733937042.jpg",
        "https://cdn11.bigcommerce.com/s-8ffc0/images/stencil/1280x1280/products/2052/5897/CMB8X10-7C3F-30R30R__00820.1733937042.jpg"
      ]
    },
    {
      sku: "CMB8X12",
      images: [
        "https://cdn11.bigcommerce.com/s-8ffc0/images/stencil/1280x1280/products/2053/5902/CMB8X12-8C4F-30L30L__42082.1733937068.jpg",
        "https://cdn11.bigcommerce.com/s-8ffc0/images/stencil/1280x1280/products/2053/5903/CMB8X12-8C4F-30R30R__47949.1733937068.jpg",
        "https://cdn11.bigcommerce.com/s-8ffc0/images/stencil/1280x1280/products/2053/5904/CMB8X12-9C3F-30L30L__92788.1733937068.jpg",
        "https://cdn11.bigcommerce.com/s-8ffc0/images/stencil/1280x1280/products/2053/5905/CMB8X12-9C3F-30R30R__32267.1733937068.jpg"
      ]
    },
    {
      sku: "CMB8X18",
      images: [
        "https://cdn11.bigcommerce.com/s-8ffc0/images/stencil/1280x1280/products/2054/5910/CMB8X18-12C6F-30L30L__58912.1733937093.jpg",
        "https://cdn11.bigcommerce.com/s-8ffc0/images/stencil/1280x1280/products/2054/5911/CMB8X18-12C6F-30R30R__65943.1733937093.jpg",
        "https://cdn11.bigcommerce.com/s-8ffc0/images/stencil/1280x1280/products/2054/5912/CMB8X18-13C5F-30L30L__48858.1733937093.jpg",
        "https://cdn11.bigcommerce.com/s-8ffc0/images/stencil/1280x1280/products/2054/5913/CMB8X18-13C5F-30R30R__55301.1733937093.jpg"
      ]
    },
    {
      sku: "CMB8X20",
      images: [
        "https://cdn11.bigcommerce.com/s-8ffc0/images/stencil/1280x1280/products/2055/5918/CMB8X20-13C7F-30L30L__86302.1733937118.jpg",
        "https://cdn11.bigcommerce.com/s-8ffc0/images/stencil/1280x1280/products/2055/5919/CMB8X20-13C7F-30R30R__30838.1733937118.jpg",
        "https://cdn11.bigcommerce.com/s-8ffc0/images/stencil/1280x1280/products/2055/5920/CMB8X20-14C6F-30L30L__71382.1733937118.jpg",
        "https://cdn11.bigcommerce.com/s-8ffc0/images/stencil/1280x1280/products/2055/5921/CMB8X20-14C6F-30R30R__49926.1733937118.jpg"
      ]
    }
  ];

  console.log('Updating product images...\n');

  for (const update of productUpdates) {
    try {
      const product = await prisma.product.findFirst({
        where: { sku: update.sku }
      });

      if (product) {
        await prisma.product.update({
          where: { id: product.id },
          data: {
            images: update.images
          }
        });
        console.log(`✓ Updated images for ${update.sku} (${update.images.length} images)`);
      } else {
        console.log(`✗ Product not found: ${update.sku}`);
      }
    } catch (error: any) {
      console.error(`✗ Failed to update ${update.sku}:`, error.message);
    }
  }

  console.log('\n✓ Image update completed!');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
