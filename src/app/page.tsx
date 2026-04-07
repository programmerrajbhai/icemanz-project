import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ScrollingTicker from "@/components/ScrollingTicker";
import Products from "@/components/Products";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="grow">
        <Hero />
        <ScrollingTicker />
        <Products />
        <Services />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
