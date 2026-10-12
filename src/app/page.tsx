import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClientHomeDesign from "@/components/ClientHomeDesign";
import WalkInOptionsSlider from "@/components/WalkInOptionsSlider";
import prisma from "@/lib/prisma";
import { getMockProductsByCategory } from "@/lib/mock-products";

export const dynamic = 'force-dynamic';

export default async function Home() {
    let walkInProducts = [];

    try {
        walkInProducts = await prisma.product.findMany({
            where: { category: { slug: 'walk-in-cooler-no-floor' } },
            take: 12,
            include: { category: true }
        });
    } catch (error) {
        console.error('Database connection error, using mock data:', error);
        walkInProducts = getMockProductsByCategory('walk-in-cooler-no-floor');
    }

    return (
        <div className="flex flex-col min-h-screen">
            {/* হেডার ফিরিয়ে আনা হলো */}
            <Header />
            
            <main className="grow">
                {/* আপনার সুপার অ্যামেজিং গ্লোয়িং ব্লু ডিজাইন */}
                <ClientHomeDesign />

                {/* ডাটাবেস থেকে আসা স্লাইডার */}
                <div className="bg-[#F8FAFC] pb-24 relative z-10 border-t border-gray-200">
                    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 mb-8">
                        <h2 className="font-['Bricolage_Grotesque',_sans-serif] text-3xl md:text-4xl font-black text-[#0F172A] tracking-tight">
                            More dynamic options from catalog
                        </h2>
                    </div>
                    <WalkInOptionsSlider products={JSON.parse(JSON.stringify(walkInProducts))} />
                </div>
            </main>

            {/* সিঙ্গেল ফুটার */}
            <Footer />
        </div>
    );
}