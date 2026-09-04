import Header from '@/components/Header';
import { Wrench } from 'lucide-react';
import { notFound } from 'next/navigation';

// Valid slugs for glassdoor subcategories
const validSlugs = [
  'glassdoor-walk-in-cooler',
  'glassdoor-walk-in-freezer', 
  'glassdoor',
  'shelving'
];

const slugTitles: Record<string, string> = {
  'glassdoor-walk-in-cooler': 'Glassdoor Walk-in Cooler',
  'glassdoor-walk-in-freezer': 'Glassdoor Walk-in Freezer',
  'glassdoor': 'Glassdoor Display Units',
  'shelving': 'Commercial Shelving Solutions'
};

const slugDescriptions: Record<string, string> = {
  'glassdoor-walk-in-cooler': 'Premium glass-door walk-in coolers with elegant design and advanced cooling performance.',
  'glassdoor-walk-in-freezer': 'High-visibility walk-in freezers perfect for retail and grocery applications.',
  'glassdoor': 'Complete glassdoor display solutions for maximum product visibility.',
  'shelving': 'Custom shelving systems designed for walk-in coolers and freezers.'
};

export default async function GlassdoorSubcategoryPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;

  // Check if slug is valid
  if (!validSlugs.includes(slug)) {
    notFound();
  }

  const title = slugTitles[slug];
  const description = slugDescriptions[slug];

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
              {title}
            </h1>
            <div className="inline-block bg-yellow-100 text-yellow-800 px-6 py-3 rounded-full font-bold text-lg mb-6">
              Coming Soon
            </div>
            <p className="text-xl text-gray-600 mb-8">
              {description}
            </p>
            <p className="text-gray-500 mb-8">
              We're currently preparing this product line. Check back soon or contact us for more information about availability.
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
              <a
                href="/quote"
                className="inline-block border-2 border-primary text-primary px-8 py-3 rounded-sm font-bold hover:bg-primary hover:text-white transition-colors"
              >
                Request a Quote
              </a>
            </div>
          </div>

          {/* Additional Info Section */}
          <div className="max-w-4xl mx-auto mt-16 grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gray-50 rounded-sm">
              <h3 className="font-bold text-lg mb-2 text-gray-900">Custom Solutions</h3>
              <p className="text-gray-600 text-sm">
                We offer fully customizable glassdoor units tailored to your specific needs
              </p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-sm">
              <h3 className="font-bold text-lg mb-2 text-gray-900">Energy Efficient</h3>
              <p className="text-gray-600 text-sm">
                Advanced insulation and LED lighting for optimal energy savings
              </p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-sm">
              <h3 className="font-bold text-lg mb-2 text-gray-900">Expert Support</h3>
              <p className="text-gray-600 text-sm">
                Professional installation and ongoing technical support available
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
