'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCollection } from '@/hooks/useCollections';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, ImageIcon, Sparkles } from 'lucide-react';
import { Product } from '@/types/products';

export default function CollectionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const collectionId = params.id as string;

  const { data: collection, isLoading, error } = useCollection(collectionId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Colecție Negătită</h1>
          <p className="text-gray-600 mb-6">
            Colecția pe care o căutai nu a fost găsită sau a fost eliminată.
          </p>
          <Link
            href="/collections"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Înapoi la Colecții
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200 my-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.push('/collections')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Înapoi la Colecții
          </button>
        </div>
      </div>

      {/* Collection Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Collection Image */}
            <div className="relative h-96 rounded-lg overflow-hidden bg-gray-100">
              {collection.image ? (
                <Image
                  src={collection.image}
                  alt={collection.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <ImageIcon className="h-24 w-24 text-gray-300" />
                </div>
              )}
              {collection.featured && (
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-yellow-400 text-yellow-900 shadow-lg">
                    <Sparkles className="h-4 w-4 mr-1" />
                    Featured
                  </span>
                </div>
              )}
            </div>

            {/* Collection Info */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {collection.name}
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                {collection.description}
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="inline-flex items-center">
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  {collection.products?.length || 0} Products
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Products in this Collection
        </h2>

        {collection.productsDetails && collection.productsDetails.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {collection.productsDetails.map((product: Product) => (
              <Link
                key={product.productId}
                href={`/shop/${product.productId}`}
                className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Product Image */}
                <div className="relative h-64 bg-gray-100">
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ImageIcon className="h-16 w-16 text-gray-300" />
                    </div>
                  )}
                  {product.tags?.includes('new') && (
                    <div className="absolute top-2 right-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                        New
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">
                      ${(product.price / 100).toFixed(2)}
                    </span>
                    {product.available ? (
                      <span className="text-xs text-green-600 font-medium">
                        In Stock
                      </span>
                    ) : (
                      <span className="text-xs text-red-600 font-medium">
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <ImageIcon className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No Products Yet
            </h3>
            <p className="text-gray-500 mb-6">
              This collection doesn&apos;t have any products at the moment.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-200"
            >
              Browse All Products
            </Link>
          </div>
        )}
      </div>

      {/* Related Collections CTA */}
      <div className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Explore More Collections
            </h2>
            <p className="text-gray-600 mb-6">
              Discover other beautiful floral arrangements
            </p>
            <Link
              href="/collections"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-200 shadow-sm transition-colors"
            >
              View All Collections
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
