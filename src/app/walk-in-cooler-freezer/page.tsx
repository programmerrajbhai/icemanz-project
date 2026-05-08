import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WalkInCoolerFreezerClient from './WalkInCoolerFreezerClient';
import prisma from '@/lib/prisma';

export default async function WalkInCoolerFreezerPage() {
  const products = await prisma.product.findMany({
    where: {
      category: {
        slug: 'walk-in-cooler-freezer'
      }
    }
  });

  return (
    <main className="min-h-screen bg-white selection:bg-primary selection:text-white">
      <Header />
      <div className="pt-24 lg:pt-32">
        <WalkInCoolerFreezerClient initialProducts={products} />
      </div>
      <Footer />
    </main>
  );
}
