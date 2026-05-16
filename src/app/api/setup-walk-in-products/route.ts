import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Product data extracted from the link
const noRefrigerationProducts = [
  {
    title: 'Amerikooler QC060672**N 6\' x 6\' x 7\' 2" Quick Ship Floorless Indoor Box Only Walk-in Cooler',
    slug: 'amerikooler-qc060672-n-6x6x7-2-quick-ship-floorless-indoor-box-only-walk-in-cooler',
    price: '5986.00',
    images: ['https://p16-cc-image-search-sign-sg.ibyteimg.com/tos-alisg-i-h9hire4aei-sg/img/af833039d2315172051dd4444cca9b52~tplv-h9hire4aei-image.jpeg?rk3s=add9cc80&x-expires=1783917199&x-signature=HqxifWVnzVbKy%2BIWRiMlfms%2Bb9Y%3D'],
    type: 'No Refrigeration'
  },
  {
    title: 'Amerikooler QC060672**N-O 6\' x 6\' x 7\' 2" Quick Ship Floorless Outdoor Box Only Walk-in Cooler',
    slug: 'amerikooler-qc060672-n-o-6x6x7-2-quick-ship-floorless-outdoor-box-only-walk-in-cooler',
    price: '6554.00',
    images: ['https://p16-cc-image-search-sign-sg.ibyteimg.com/tos-alisg-i-h9hire4aei-sg/img/9b489fa7ebd274a2e9e394843db507b4~tplv-h9hire4aei-image.jpeg?rk3s=add9cc80&x-expires=1783917199&x-signature=p1ats7qULSg%2FQxqfPPYolaQKUAI%3D'],
    type: 'No Refrigeration'
  },
  {
    title: 'Amerikooler QC060872**N 6\' x 8\' x 7\' 2" Quick Ship Floorless Indoor Box Only Walk-in Cooler',
    slug: 'amerikooler-qc060872-n-6x8x7-2-quick-ship-floorless-indoor-box-only-walk-in-cooler',
    price: '6853.00',
    images: ['https://p16-cc-image-search-sign-sg.ibyteimg.com/tos-alisg-i-h9hire4aei-sg/img/d96f2a3702edb0b54888f9a510b1dd45~tplv-h9hire4aei-image.jpeg?rk3s=add9cc80&x-expires=1783917199&x-signature=ZKFVtw5cz3jHFDfGxwaB4wakQ4s%3D'],
    type: 'No Refrigeration'
  },
  {
    title: 'Amerikooler QC061072**N 6\' x 10\' x 7\' 2" Quick Ship Floorless Indoor Box Only Walk-in Cooler',
    slug: 'amerikooler-qc061072-n-6x10x7-2-quick-ship-floorless-indoor-box-only-walk-in-cooler',
    price: '7034.00',
    images: ['https://p19-cc-image-search-sign-sg.ibyteimg.com/tos-alisg-i-h9hire4aei-sg/image/7e43bfc5169f20ca04c9487b5c9d827d~tplv-h9hire4aei-image.jpeg?rk3s=add9cc80&x-expires=1783917199&x-signature=iiZY4g6VOU52sDLsHHK3yRpj2hw%3D'],
    type: 'No Refrigeration'
  },
  {
    title: 'Amerikooler QC080872**N 8\' x 8\' x 7\' 2" Quick Ship Floorless Indoor Box Only Walk-in Cooler',
    slug: 'amerikooler-qc080872-n-8x8x7-2-quick-ship-floorless-indoor-box-only-walk-in-cooler',
    price: '7119.00',
    images: ['https://p19-cc-image-search-sign-sg.ibyteimg.com/tos-alisg-i-h9hire4aei-sg/img/6ca3339e44508716cb7be108eb4e8c93~tplv-h9hire4aei-image.jpeg?rk3s=add9cc80&x-expires=1783917199&x-signature=38rImvu%2FpnEORDkCnxXXiyGZI88%3D'],
    type: 'No Refrigeration'
  },
  {
    title: 'Amerikooler QC060872**N-O 6\' x 8\' x 7\' 2" Quick Ship Floorless Outdoor Box Only Walk-in Cooler',
    slug: 'amerikooler-qc060872-n-o-6x8x7-2-quick-ship-floorless-outdoor-box-only-walk-in-cooler',
    price: '7516.00',
    images: ['https://p16-cc-image-search-sign-sg.ibyteimg.com/tos-alisg-i-h9hire4aei-sg/img/d49797af87643888fb6b62d57df08e56~tplv-h9hire4aei-image.jpeg?rk3s=add9cc80&x-expires=1783917199&x-signature=tlO7AX4fb3Go7YlHa4ISZzBkjSY%3D'],
    type: 'No Refrigeration'
  },
  {
    title: 'Amerikooler QC061072**N-O 6\' x 10\' x 7\' 2" Quick Ship Floorless Outdoor Box Only Walk-in Cooler',
    slug: 'amerikooler-qc061072-n-o-6x10x7-2-quick-ship-floorless-outdoor-box-only-walk-in-cooler',
    price: '7679.00',
    images: ['https://p16-cc-image-search-sign-sg.ibyteimg.com/tos-alisg-i-h9hire4aei-sg/img/b0345a67b1e9899a2af0ee2db5d759d1~tplv-h9hire4aei-image.jpeg?rk3s=add9cc80&x-expires=1783917199&x-signature=31PpL3vTNzR%2FZWDQKD4VDPkhBhU%3D'],
    type: 'No Refrigeration'
  },
  {
    title: 'Amerikooler QC080872**N-O 8\' x 8\' x 7\' 2" Quick Ship Floorless Outdoor Box Only Walk-in Cooler',
    slug: 'amerikooler-qc080872-n-o-8x8x7-2-quick-ship-floorless-outdoor-box-only-walk-in-cooler',
    price: '7773.00',
    images: ['https://p16-cc-image-search-sign-sg.ibyteimg.com/tos-alisg-i-h9hire4aei-sg/img/6dcd0bac15b00ef9020c52b44359fb5d~tplv-h9hire4aei-image.jpeg?rk3s=add9cc80&x-expires=1783917199&x-signature=HriGBlBBWpRmRXN7v%2BUG4ORqzDA%3D'],
    type: 'No Refrigeration'
  },
  {
    title: 'Amerikooler QC061272**N 6\' x 12\' x 7\' 2" Quick Ship Floorless Indoor Box Only Walk-in Cooler',
    slug: 'amerikooler-qc061272-n-6x12x7-2-quick-ship-floorless-indoor-box-only-walk-in-cooler',
    price: '7837.00',
    images: ['https://p16-cc-image-search-sign-sg.ibyteimg.com/tos-alisg-i-h9hire4aei-sg/img/1c4bb0edea4277d2ed14f28a22628e25~tplv-h9hire4aei-image.jpeg?rk3s=add9cc80&x-expires=1783917199&x-signature=bYDfaaRU%2BHZy5ACzBXQxUvtNsvw%3D'],
    type: 'No Refrigeration'
  },
  {
    title: 'Amerikooler QC081072**N 8\' x 10\' x 7\' 2" Quick Ship Floorless Indoor Box Only Walk-in Cooler',
    slug: 'amerikooler-qc081072-n-8x10x7-2-quick-ship-floorless-indoor-box-only-walk-in-cooler',
    price: '7999.00',
    images: ['https://p16-cc-image-search-sign-sg.ibyteimg.com/tos-alisg-i-h9hire4aei-sg/img/75d5562ad4bb6484e6c635538fbb1f16~tplv-h9hire4aei-image.jpeg?rk3s=add9cc80&x-expires=1783917199&x-signature=HPegL%2BBTSlejPQM2FtrsheMHQGk%3D'],
    type: 'No Refrigeration'
  },
  {
    title: 'Amerikooler QC061272**N-O 6\' x 12\' x 7\' 2" Quick Ship Floorless Outdoor Box Only Walk-in Cooler',
    slug: 'amerikooler-qc061272-n-o-6x12x7-2-quick-ship-floorless-outdoor-box-only-walk-in-cooler',
    price: '8533.00',
    images: ['https://p16-cc-image-search-sign-sg.ibyteimg.com/tos-alisg-i-h9hire4aei-sg/img/e7fed588a1703aa7b014620e4c80fef3~tplv-h9hire4aei-image.jpeg?rk3s=add9cc80&x-expires=1783917199&x-signature=jifEojExLtDOF7yTMYjuP5rXuEg%3D'],
    type: 'No Refrigeration'
  },
  {
    title: 'Amerikooler QC081072**N-O 8\' x 10\' x 7\' 2" Quick Ship Floorless Outdoor Box Only Walk-in Cooler',
    slug: 'amerikooler-qc081072-n-o-8x10x7-2-quick-ship-floorless-outdoor-box-only-walk-in-cooler',
    price: '8717.00',
    images: ['https://p16-cc-image-search-sign-sg.ibyteimg.com/tos-alisg-i-h9hire4aei-sg/image/e865e4a11493dd0c4b26c4eb2412b5ec~tplv-h9hire4aei-image.jpeg?rk3s=add9cc80&x-expires=1783917199&x-signature=ESElpdZf4xirvGrO2lMuLBFhQzE%3D'],
    type: 'No Refrigeration'
  },
  {
    title: 'Amerikooler QC081272**N 8\' x 12\' x 7\' 2" Quick Ship Floorless Indoor Box Only Walk-in Cooler',
    slug: 'amerikooler-qc081272-n-8x12x7-2-quick-ship-floorless-indoor-box-only-walk-in-cooler',
    price: '8886.00',
    images: ['https://p16-cc-image-search-sign-sg.ibyteimg.com/tos-alisg-i-h9hire4aei-sg/img/7d7ccf8ca24dbafaa24f6c4d23def16d~tplv-h9hire4aei-image.jpeg?rk3s=add9cc80&x-expires=1783917199&x-signature=U1%2BVybC5%2Bkvlh9%2FEz6t9vJIGCBY%3D'],
    type: 'No Refrigeration'
  },
  {
    title: 'Amerikooler QC101072**N 10\' x 10\' x 7\' 2" Quick Ship Floorless Indoor Box Only Walk-in Cooler',
    slug: 'amerikooler-qc101072-n-10x10x7-2-quick-ship-floorless-indoor-box-only-walk-in-cooler',
    price: '8969.00',
    images: ['https://p16-cc-image-search-sign-sg.ibyteimg.com/tos-alisg-i-h9hire4aei-sg/img/fe22beca32c277d9ce53b3ad9af50aab~tplv-h9hire4aei-image.jpeg?rk3s=add9cc80&x-expires=1783917199&x-signature=kiGdz4FD%2B9Wvf39SAJdLGIRi3x8%3D'],
    type: 'No Refrigeration'
  },
  {
    title: 'Amerikooler QC081272**N-O 8\' x 12\' x 7\' 2" Quick Ship Floorless Outdoor Box Only Walk-in Cooler',
    slug: 'amerikooler-qc081272-n-o-8x12x7-2-quick-ship-floorless-outdoor-box-only-walk-in-cooler',
    price: '9646.00',
    images: ['https://p16-cc-image-search-sign-sg.ibyteimg.com/tos-alisg-i-h9hire4aei-sg/img/4e1bb806afffeeb9eda11276f43ea3b2~tplv-h9hire4aei-image.jpeg?rk3s=add9cc80&x-expires=1783917199&x-signature=MoQ1pHS05CQp%2FXVtv11YwfEgVkM%3D'],
    type: 'No Refrigeration'
  },
  {
    title: 'Amerikooler QC101072**N-O 10\' x 10\' x 7\' 2" Quick Ship Floorless Outdoor Box Only Walk-in Cooler',
    slug: 'amerikooler-qc101072-n-o-10x10x7-2-quick-ship-floorless-outdoor-box-only-walk-in-cooler',
    price: '9742.00',
    images: ['https://p16-cc-image-search-sign-sg.ibyteimg.com/tos-alisg-i-h9hire4aei-sg/img/8316b35185f41b22a2ba8c5eadf4e3d0~tplv-h9hire4aei-image.jpeg?rk3s=add9cc80&x-expires=1783917199&x-signature=xNxI%2FctXdj%2Bq6b7MVhCrT6g97Tk%3D'],
    type: 'No Refrigeration'
  },
  {
    title: 'Amerikooler QC101272**N 10\' x 12\' x 7\' 2" Quick Ship Floorless Indoor Box Only Walk-in Cooler',
    slug: 'amerikooler-qc101272-n-10x12x7-2-quick-ship-floorless-indoor-box-only-walk-in-cooler',
    price: '9933.00',
    images: ['https://p16-cc-image-search-sign-sg.ibyteimg.com/tos-alisg-i-h9hire4aei-sg/img/bef17d014485df6d38312e7766306e29~tplv-h9hire4aei-image.jpeg?rk3s=add9cc80&x-expires=1783917199&x-signature=L6uqD8ETJdlSkMoM%2BOpAlAgLDRY%3D'],
    type: 'No Refrigeration'
  }
];

const topMountRefrigerationProducts = [
  {
    title: 'Amerikooler QC060672**NBSC 6\' x 6\' x 7\' 2" Quick Ship Floorless Indoor Walk-in Cooler with Top-Mounted Refrigeration',
    slug: 'amerikooler-qc060672-nbsc-6x6x7-2-quick-ship-floorless-indoor-walk-in-cooler-with-top-mounted-refrigeration',
    price: '9299.00',
    images: ['https://p16-cc-image-search-sign-sg.ibyteimg.com/tos-alisg-i-h9hire4aei-sg/img/5a0d45a2f677894254782a24aa056ac7~tplv-h9hire4aei-image.jpeg?rk3s=add9cc80&x-expires=1783917199&x-signature=cbTZZN9kru%2FS4jAfLk8twp6XKr4%3D'],
    type: 'Top-Mount Refrigeration'
  },
  {
    title: 'Amerikooler QC060872**NBSC 6\' x 8\' x 7\' 2" Quick Ship Floorless Indoor Walk-in Cooler with Top-Mounted Refrigeration',
    slug: 'amerikooler-qc060872-nbsc-6x8x7-2-quick-ship-floorless-indoor-walk-in-cooler-with-top-mounted-refrigeration',
    price: '10649.00',
    images: ['https://p16-cc-image-search-sign-sg.ibyteimg.com/tos-alisg-i-h9hire4aei-sg/image/6d5a803d8128daa6d3ee7d8000565bb9~tplv-h9hire4aei-image.jpeg?rk3s=add9cc80&x-expires=1783917199&x-signature=DHFSZgXOg1aChu6BzFi1u0nfk84%3D'],
    type: 'Top-Mount Refrigeration'
  }
  // Add remaining 11 Top-Mount products here as you collect them
];

export async function GET() {
  try {
    // Get walk-in-cooler-freezer category
    const category = await prisma.category.findUnique({
      where: { slug: 'walk-in-cooler-freezer' }
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Delete existing products in this category
    await prisma.product.deleteMany({
      where: { categoryId: category.id }
    });

    // Create new products
    const allProducts = [...noRefrigerationProducts, ...topMountRefrigerationProducts];
    const createdProducts = [];

    for (const product of allProducts) {
      const created = await prisma.product.create({
        data: {
          title: product.title,
          slug: product.slug,
          price: product.price,
          images: product.images,
          type: product.type,
          categoryId: category.id,
          badge: 'IN STOCK',
          warranty: [],
          detailedFeatures: [
            '4" Thick AK-XPS4 Insulation (R-29 for Coolers, R-32 for Freezers)',
            'Modular cam-lock design for easy installation',
            '26-gauge Acrylume coated galvanized steel finish',
            'Heavy-duty hardware and flush-mounted doors',
            'NSF, UL, and City of Los Angeles approved'
          ]
        }
      });
      createdProducts.push(created);
    }

    return NextResponse.json({
      success: true,
      message: `Created ${createdProducts.length} products`,
      noRefrigerationCount: noRefrigerationProducts.length,
      topMountCount: topMountRefrigerationProducts.length
    });
  } catch (error) {
    console.error('Error setting up products:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
