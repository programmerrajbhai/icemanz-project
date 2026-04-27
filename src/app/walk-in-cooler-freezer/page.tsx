import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WalkInCoolerFreezerClient from './WalkInCoolerFreezerClient';

export default function WalkInCoolerFreezerPage() {
  return (
    <main className="min-h-screen bg-white selection:bg-primary selection:text-white">
      <Header />
      <div className="pt-24 lg:pt-32">
        <WalkInCoolerFreezerClient />
      </div>
      <Footer />
    </main>
  );
}
