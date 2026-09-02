import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PromoBanners from "@/components/PromoBanners";
import ScrollingTicker from "@/components/ScrollingTicker";
import FeaturedCategories from "@/components/FeaturedCategories";
import Products from "@/components/Products";
import WalkInOptionsSlider from "@/components/WalkInOptionsSlider";
import Services from "@/components/Services";
import Industries from "@/components/Industries";
import Testimonials from "@/components/Testimonials";
import ImageGallery from "@/components/ImageGallery";
import CTA from "@/components/CTA";
import prisma from "@/lib/prisma";
import { getMockProductsByCategory } from "@/lib/mock-products";

export const dynamic = 'force-dynamic';

export default async function Home() {
    let walkInProducts = [];

    try {
        walkInProducts = await prisma.product.findMany({
            where: {
                category: {
                    slug: 'walk-in-cooler-no-floor'
                }
            },
            take: 12,
            include: { category: true }
        });
    } catch (error) {
        console.error('Database connection error, using mock data:', error);
        // Use mock data if database is not available
        walkInProducts = getMockProductsByCategory('walk-in-cooler-no-floor');
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="grow">
                <Hero />
                <ScrollingTicker />
                <Products />
                <WalkInOptionsSlider products={JSON.parse(JSON.stringify(walkInProducts))} />
                <Services />
                <PromoBanners />
                <Industries />
                <Testimonials />
                {/* <FeaturedCategories /> */}
                <ImageGallery />
                {/* <CTA /> */}
            </main>

        </div>
    );
}