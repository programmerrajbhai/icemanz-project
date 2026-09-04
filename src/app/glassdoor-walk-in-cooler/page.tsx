import Header from '@/components/Header';
import { Wrench } from 'lucide-react';

export default function GlassdoorWalkInCoolerPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="pt-24 lg:pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Coming Soon Message */}
          <div className="max-w-3xl mx-auto text-center py-20">
            <div className="mb-8 flex justify-center">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                <Wrench className="w-12 h-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Glassdoor Walk-in Cooler
            </h1>
            <div className="inline-block bg-yellow-100 text-yellow-800 px-6 py-3 rounded-full font-bold text-lg mb-6">
              Coming Soon
            </div>
            <p className="text-xl text-gray-600 mb-8">
              We're working on bringing you premium glass-door display coolers and freezers.
            </p>
            <p className="text-gray-500 mb-8">
              Our glassdoor walk-in coolers will combine elegant design with advanced cooling performance, 
              featuring custom shelving solutions and energy-efficient glass panels perfect for retail and grocery stores.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/walk-in-cooler-freezer"
                className="inline-block bg-primary text-white px-8 py-3 rounded-sm font-bold hover:bg-primary/90 transition-colors"
              >
                Browse Walk-In Coolers
              </a>
              <a
                href="/refrigeration-equipment"
                className="inline-block bg-gray-100 text-gray-800 px-8 py-3 rounded-sm font-bold hover:bg-gray-200 transition-colors"
              >
                Refrigeration Equipment
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
