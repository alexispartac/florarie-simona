import Link from 'next/link';
import Image from 'next/image';
import { RelatedProduct } from '@/types/products';

interface RelatedProductsProps {
  products: RelatedProduct[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <Link 
            key={`${product.productId}-${index}`} 
            href={`/shop/${product.productId}?slug=${product.slug}`}
            className="group block overflow-hidden rounded-lg transition-shadow hover:shadow-lg"
          >
            <div className="relative h-64 w-full">
              <Image
                src={product.image || '/placeholder-product.jpg'}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium text-lg group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              <p className="text-gray-600">{(product.price / 100).toFixed(2)} RON</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
