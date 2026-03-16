import Link from 'next/link';
import { ArrowRight, ShoppingBag } from 'lucide-react';

const products = [
  {
    id: 1,
    title: 'Quick-Ship Walk-In Cooler',
    description: 'Fast delivery so you can get up and running quickly. Modular cam-lock panels.',
    price: 'Starting from $4,999',
    image: '/products/product_1.jpg',
    tag: '36-48h Shipping',
  },
  {
    id: 2,
    title: 'Quick-Ship Cooler-Freezer Combo',
    description: 'The new ICEMANZ® Quick-Ship Walk-In Cooler-Freezer combo deliver top-quality cooling solutions.',
    price: 'Starting from $6,499',
    image: '/products/product_2.jpg',
    tag: 'Quick-Ship Combo',
  },
  {
    id: 3,
    title: 'Custom Walk-In Cooler & Freezer',
    description: 'Tailored to your needs – Whether you need a small unit or a large walk-in, we offer any size.',
    price: 'Custom Pricing',
    image: '/slider/s_3.jpg',
    tag: 'Custom Sizes',
  }
];

export default function Products() {
  return (
    <section className="py-12 md:py-20 bg-gray-50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              Our Premium Cooling <span className="text-primary">Solutions</span>
            </h2>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              From quick-ship standard units to fully custom designs, ICEMANZ® provides high-performance refrigeration solutions tailored to your business.
            </p>
          </div>
          <Link href="/products" className="text-primary font-bold flex items-center gap-2 hover:underline group text-sm md:text-base">
            View All Products <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all group border border-gray-100 flex flex-col h-full">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                    {product.tag}
                  </span>
                </div>
              </div>
              
              <div className="p-6 flex flex-col grow">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                  {product.title}
                </h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
                <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-100">
                  <span className="text-primary font-bold text-lg">
                    {product.price}
                  </span>
                  <button className="bg-gray-100 p-3 rounded-full hover:bg-primary hover:text-white transition-all text-primary">
                    <ShoppingBag size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
