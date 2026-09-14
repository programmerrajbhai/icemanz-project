'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ShoppingCart, Grid3X3, LayoutList } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';

interface Product {
  id: string;
  title: string;
  price: string | null;
  images: string[];
  slug: string;
  badge?: string | null;
  brand?: string | null;
  features?: any;
}

export default function CondensingUnitsClient({ products, category }: { products: Product[], category: any }) {
  const { addToCart } = useCart();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedTempType, setSelectedTempType] = useState<string>('all');

  // Extract temperature types from products
  const tempTypes = useMemo(() => {
    const types = new Set<string>();
    products.forEach(p => {
      if (p.features?.temperatureType) {
        types.add(p.features.temperatureType);
      }
    });
    return Array.from(types).sort();
  }, [products]);

  // Filter products by temperature type
  const filteredProducts = useMemo(() => {
    if (selectedTempType === 'all') return products;
    return products.filter(p => p.features?.temperatureType === selectedTempType);
  }, [products, selectedTempType]);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.title,
      price: parseFloat(product.price || '0'),
      quantity: 1,
      image: product.images[0] || '/placeholder.png'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Condensing Units</h1>
          <p className="text-gray-600">High-quality Turbo Air condensing units for walk-in coolers and freezers</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Temperature Type</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedTempType('all')}
                  className={`w-full text-left px-3 py-2 rounded ${selectedTempType === 'all' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                >
                  All ({products.length})
                </button>
                {tempTypes.map(type => {
                  const count = products.filter(p => p.features?.temperatureType === type).length;
                  return (
                    <button
                      key={type}
                      onClick={() => setSelectedTempType(type)}
                      className={`w-full text-left px-3 py-2 rounded ${selectedTempType === type ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                    >
                      {type} ({count})
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* View mode toggle */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Showing {filteredProducts.length} of {products.length} products
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-gray-100'}`}
                >
                  <Grid3X3 size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-gray-100'}`}
                >
                  <LayoutList size={20} />
                </button>
              </div>
            </div>

            {/* Products */}
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <Link href={`/condensing-units/${product.slug}/${product.id}`}>
                    <div className="relative h-64 bg-gray-100">
                      <Image
                        src={product.images[0] || '/placeholder.png'}
                        alt={product.title}
                        fill
                        className="object-contain p-4"
                      />
                      {product.badge && (
                        <span className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold">
                          {product.badge}
                        </span>
                      )}
                    </div>
                  </Link>
                  <div className="p-4">
                    <Link href={`/condensing-units/${product.slug}/${product.id}`}>
                      <h3 className="font-semibold text-gray-900 mb-2 hover:text-primary transition-colors line-clamp-2">
                        {product.title}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2 mb-3">
                      {product.features?.hp && (
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {product.features.hp}
                        </span>
                      )}
                      {product.features?.temperatureType && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {product.features.temperatureType}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">
                        ${parseFloat(product.price || '0').toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors"
                      >
                        <ShoppingCart size={18} />
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <p className="text-gray-500">No products found matching your filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
