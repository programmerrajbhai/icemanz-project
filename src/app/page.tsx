import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PromoBanners from "@/components/PromoBanners";
import ScrollingTicker from "@/components/ScrollingTicker";
import Products from "@/components/Products";
import WalkInOptionsSlider from "@/components/WalkInOptionsSlider";
import Services from "@/components/Services";
import Industries from "@/components/Industries";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const walkInCoolerProducts = await prisma.product.findMany({
    where: {
      category: {
        slug: 'walk-in-cooler-no-floor'
      }
    },
    take: 12
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="grow">
        <Hero />
        <ScrollingTicker />
        <PromoBanners />
        <Products />
        <WalkInOptionsSlider products={walkInCoolerProducts} />
        <Services />
        <Industries />
        <Testimonials />
        <CTA />
      </main>

    </div>
  );
}
