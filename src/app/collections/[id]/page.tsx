'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCollection } from '@/hooks/useCollections';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, ImageIcon, Sparkles } from 'lucide-react';
import { Product } from '@/types/products';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from '@/translations';

export default function CollectionDetailPage() {
  const { language } = useLanguage();
  const t = useTranslation(language);
  const params = useParams();
  const router = useRouter();
  const collectionId = params.id as string;

  const { data: collection, isLoading, error } = useCollection(collectionId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--primary-background)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="min-h-screen bg-[var(--primary-background)] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="serif-font text-2xl font-bold text-[var(--foreground)] mb-4">{t("collection.collectionNotFound")}</h1>
          <p className="serif-light text-[var(--muted-foreground)] mb-6">
            {t("collection.collectionNotFoundText")}
          </p>
          <Link
            href="/collections"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-[var(--primary-foreground)] bg-[var(--primary)] hover:bg-[var(--hover-primary)]"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("collection.backToCollections")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      {/* Back Button */}
      <div className="bg-[var(--card)] border-b border-[var(--border)] my-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.push('/collections')}
            className="inline-flex items-center text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            {t("collection.backToCollections")}
          </button>
        </div>
      </div>

      {/* Collection Header */}
      <div className="bg-[var(--card)] border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Collection Image */}
            <div className="relative h-96 rounded-lg overflow-hidden bg-[var(--muted)]">
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
                  <ImageIcon className="h-24 w-24 text-[var(--muted-foreground)]" />
                </div>
              )}
              {collection.featured && (
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-yellow-400 text-yellow-900 shadow-lg">
                    <Sparkles className="h-4 w-4 mr-1" />
                    {t("collection.featured")}
                  </span>
                </div>
              )}
            </div>

            {/* Collection Info */}
            <div>
              <h1 className="serif-font text-4xl font-bold text-[var(--foreground)] mb-4">
                {collection.name}
              </h1>
              <p className="serif-light text-lg text-[var(--muted-foreground)] mb-6">
                {collection.description}
              </p>
              <div className="flex items-center space-x-4 text-sm text-[var(--muted-foreground)]">
                <span className="inline-flex items-center">
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  {collection.products?.length || 0} {t("collection.products")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="serif-font text-2xl font-bold text-[var(--foreground)] mb-8">
          {t("collection.productsInCollection")}
        </h2>

        {collection.productsDetails && collection.productsDetails.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {collection.productsDetails.map((product: Product) => (
              <Link
                key={product.productId}
                href={`/shop/${product.productId}`}
                className="group bg-[var(--card)] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-[var(--border)]"
              >
                {/* Product Image */}
                <div className="relative h-64 bg-[var(--muted)]">
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ImageIcon className="h-16 w-16 text-[var(--muted-foreground)]" />
                    </div>
                  )}
                  {product.tags?.includes('new') && (
                    <div className="absolute top-2 right-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                        {t("collection.new")}
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="serif-font text-lg font-semibold text-[var(--foreground)] mb-1 line-clamp-2 group-hover:text-[var(--primary)] transition-colors">
                    {product.name}
                  </h3>
                  <p className="serif-light text-sm text-[var(--muted-foreground)] mb-2 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-[var(--primary)]">
                      ${(product.price / 100).toFixed(2)}
                    </span>
                    {product.available ? (
                      <span className="text-xs text-[var(--primary)] font-medium">
                        {t("collection.inStock")}
                      </span>
                    ) : (
                      <span className="text-xs text-[var(--destructive)] font-medium">
                        {t("collection.outOfStock")}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-[var(--card)] rounded-lg shadow-sm p-12 text-center border border-[var(--border)]">
            <ImageIcon className="mx-auto h-16 w-16 text-[var(--muted-foreground)] mb-4" />
            <h3 className="serif-font text-xl font-medium text-[var(--foreground)] mb-2">
              {t("collection.noProductsYet")}
            </h3>
            <p className="serif-light text-[var(--muted-foreground)] mb-6">
              {t("collection.noProductsText")}
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-[var(--primary-foreground)] bg-[var(--primary)] hover:bg-[var(--hover-primary)]"
            >
              {t("collection.browseAll")}
            </Link>
          </div>
        )}
      </div>

      {/* Related Collections CTA */}
      <div className="bg-[var(--card)] border-t border-[var(--border)] mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="serif-font text-2xl font-bold text-[var(--foreground)] mb-4">
              {t("collection.exploreMore")}
            </h2>
            <p className="serif-light text-[var(--muted-foreground)] mb-6">
              {t("collection.exploreMoreText")}
            </p>
            <Link
              href="/collections"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-[var(--primary-foreground)] bg-[var(--primary)] hover:bg-[var(--hover-primary)] shadow-sm transition-colors"
            >
              {t("collection.viewAllCollections")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
