'use client';

import { useState } from 'react';
import { useCollections } from '@/hooks/useCollections';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Sparkles, ArrowRight, ImageIcon } from 'lucide-react';
import { Input } from '@/components/ui';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from '@/translations';
import { CollectionCardSkeleton } from './components/CollectionCardSkeleton';

export default function CollectionsPage() {
  const { language } = useLanguage();
  const t = useTranslation(language);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  const { data, isLoading, error } = useCollections({
    page: 1,
    limit: 50,
    search: searchQuery,
    featured: showFeaturedOnly || undefined,
  });

  const collections = data?.data || [];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      {/* Hero Section */}
      <div className="relative bg-[var(--secondary)] text-[var(--foreground)] my-20"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=1200&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--primary)]/25 via-[var(--primary)]/15 to-[var(--primary)]/30" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="serif-font text-4xl md:text-5xl font-bold mb-4 text-[var(--primary-foreground)] drop-shadow-lg">
              {t("collections.title")}
            </h1>
            <p className="serif-light text-lg md:text-xl text-[var(--primary-foreground)]/95 max-w-2xl mx-auto drop-shadow-md">
              {t("collections.subtitle")}
            </p>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-[var(--card)] rounded-lg shadow-sm p-6 border border-[var(--border)]">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-[var(--muted-foreground)]" />
              </div>
              <Input
                type="text"
                fullWidth
                placeholder={t("collections.searchPlaceholder")}
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10 pr-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-[var(--card)] text-[var(--foreground)]"
              />
            </div>

            {/* Featured Filter */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="featured"
                checked={showFeaturedOnly}
                onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                className="h-4 w-4 text-[var(--primary)] focus:ring-[var(--primary)] border-[var(--border)] rounded cursor-pointer"
              />
              <label
                htmlFor="featured"
                className="text-sm text-[var(--foreground)] cursor-pointer flex items-center"
              >
                <Sparkles className="h-4 w-4 mr-1 text-yellow-500" />
                {t("collections.featuredOnly")}
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <CollectionCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="bg-[var(--destructive)]/10 border border-[var(--destructive)]/30 rounded-lg p-8 text-center">
            <p className="text-[var(--destructive)]">
              {t("collections.errorLoading")}
            </p>
          </div>
        ) : collections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.map((collection) => (
              <Link
                key={collection.collectionId}
                href={`/collections/${collection.collectionId}/?collectionId=${collection.collectionId}`}
                className="group bg-[var(--card)] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-[var(--border)]"
              >
                {/* Image */}
                <div className="relative h-64 bg-[var(--muted)] overflow-hidden">
                  {collection.image ? (
                    <Image
                      src={collection.image}
                      alt={collection.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ImageIcon className="h-16 w-16 text-[var(--muted-foreground)]" />
                    </div>
                  )}
                  
                  {/* Featured Badge */}
                  {collection.featured && (
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-400 text-yellow-900 shadow-lg">
                        <Sparkles className="h-3 w-3 mr-1" />
                        {t("collections.featured")}
                      </span>
                    </div>
                  )}

                  {/* Product Count Badge */}
                  <div className="absolute bottom-4 left-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[var(--card)]/90 text-[var(--foreground)] shadow-sm backdrop-blur-sm">
                      {collection.products?.length || 0} {t("collections.products")}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="serif-font text-xl font-semibold text-[var(--foreground)] mb-2 group-hover:text-[var(--primary)] transition-colors">
                    {collection.name}
                  </h3>
                  <p className="serif-light text-[var(--muted-foreground)] text-sm mb-4 line-clamp-3">
                    {collection.description}
                  </p>
                  
                  {/* View Collection Link */}
                  <div className="flex items-center text-[var(--primary)] font-medium text-sm group-hover:text-[var(--hover-primary)] transition-colors">
                    {t("collections.viewCollection")}
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-[var(--card)] rounded-lg shadow-sm p-12 text-center border border-[var(--border)]">
            <ImageIcon className="mx-auto h-16 w-16 text-[var(--muted-foreground)] mb-4" />
            <h3 className="text-xl font-medium text-[var(--foreground)] mb-2">
              {t("collections.noCollectionsFound")}
            </h3>
            <p className="text-[var(--muted-foreground)] mb-6">
              {searchQuery
                ? t("collections.tryAdjusting")
                : t("collections.noCollectionsText")}
            </p>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setShowFeaturedOnly(false);
                }}
                className="inline-flex items-center px-4 py-2 border border-[var(--border)] rounded-md shadow-sm text-sm font-medium text-[var(--foreground)] bg-[var(--card)] hover:bg-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]"
              >
                {t("collections.clearFilters")}
              </button>
            )}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-[var(--card)] border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="serif-font text-2xl font-bold text-[var(--foreground)] mb-4">
              {t("collections.ctaTitle")}
            </h2>
            <p className="serif-light text-[var(--muted-foreground)] mb-6">
              {t("collections.ctaSubtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-[var(--primary-foreground)] bg-[var(--primary)] hover:bg-[var(--hover-primary)] shadow-sm transition-colors"
              >
                {t("collections.browseAll")}
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border border-[var(--border)] text-base font-medium rounded-md text-[var(--foreground)] bg-[var(--card)] hover:bg-[var(--accent)] shadow-sm transition-colors"
              >
                {t("collections.contactUs")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
