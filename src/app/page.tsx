import Header from '@/components/Header';
import ClientHomeDesign from '@/components/ClientHomeDesign';
import { getWalkInCatalog } from '@/lib/walk-in-catalog';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const { products, error } = await getWalkInCatalog();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="grow">
        <ClientHomeDesign
          products={products}
          catalogError={error}
        />
      </main>
    </div>
  );
}