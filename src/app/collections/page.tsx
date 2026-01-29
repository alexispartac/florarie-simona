'use client';

import { useState } from 'react';
import { useCollections } from '@/hooks/useCollections';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Sparkles, ArrowRight, ImageIcon } from 'lucide-react';
import { Input } from '@/components/ui';

export default function CollectionsPage() {
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-primary to-primary-200 text-white my-20"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=1200&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
      >
        <div className="max-w-7xl mx-auto text-gray-800 px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
              Floral Collections
            </h1>
            <p className="text-lg md:text-xl text-gray-800 max-w-2xl mx-auto">
              Explore our curated collections of beautiful flowers for every occasion
            </p>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                fullWidth
                placeholder="Search collections..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Featured Filter */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="featured"
                checked={showFeaturedOnly}
                onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer"
              />
              <label
                htmlFor="featured"
                className="text-sm text-gray-700 cursor-pointer flex items-center"
              >
                <Sparkles className="h-4 w-4 mr-1 text-yellow-500" />
                Featured Only
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <p className="text-red-700">
              Error loading collections. Please try again later.
            </p>
          </div>
        ) : collections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.map((collection) => (
              <Link
                key={collection.collectionId}
                href={`/collections/${collection.collectionId}/?collectionId=${collection.collectionId}`}
                className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative h-64 bg-gray-100 overflow-hidden">
                  {collection.image ? (
                    <Image
                      src={collection.image}
                      alt={collection.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ImageIcon className="h-16 w-16 text-gray-300" />
                    </div>
                  )}
                  
                  {/* Featured Badge */}
                  {collection.featured && (
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-400 text-yellow-900 shadow-lg">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Featured
                      </span>
                    </div>
                  )}

                  {/* Product Count Badge */}
                  <div className="absolute bottom-4 left-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-900 shadow-sm">
                      {collection.products?.length || 0} Products
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                    {collection.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {collection.description}
                  </p>
                  
                  {/* View Collection Link */}
                  <div className="flex items-center text-primary font-medium text-sm group-hover:text-primary-200 transition-colors">
                    View Collection
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <ImageIcon className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No collections found
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery
                ? 'Try adjusting your search or filters'
                : 'Check back soon for new collections'}
            </p>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setShowFeaturedOnly(false);
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Nu gasesti ce cauti?
            </h2>
            <p className="text-gray-600 mb-6">
              Navigheaza printr-o colectie sau contacteaza-ne pentru un buchet personalizat
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-200 shadow-sm transition-colors"
              >
                Browse All Products
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 shadow-sm transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
