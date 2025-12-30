'use client';

import { memo, useState } from 'react';
import Button from '@/components/ui/Button';
import { ProductCard } from './components/ProductCard';
import { ProductFilters } from './components/ProductFilters';
import { ShopHero } from './components/ShopHero';
import { useShop } from '@/context/ShopContext';
import { ProductInCatalog, WishlistItem } from '@/types/products';
import { useProductsCatalog } from '@/hooks/useProducts';
import { Spinner } from '@/components/ui/Spinner';

const ProductList = memo(({
  products,
  onToggleWishlist,
}: {
  products: ProductInCatalog[];
  onToggleWishlist: (product: WishlistItem) => void;
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.productId}
          product={product}
          onToggleWishlist={() => onToggleWishlist({ 
            productId: product.productId, 
            name: product.name, 
            price: product.price, 
            images: product.images 
          })}
        />
      ))}
    </div>
  );
});

ProductList.displayName = 'ProductList';

export default function Shop() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const { data: products, isLoading, isError } = useProductsCatalog();

  const { addToWishlist } = useShop();

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
  };

  const toggleWishlist = (product: WishlistItem) => {
    addToWishlist(product);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <Spinner className="w-12 h-12" />
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <p className="text-gray-600">Error loading products. Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <p className="text-gray-600">No products found</p>
        </div>
      </div>
    )
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(products.map((product) => product.category))];

  return (
    <div className="min-h-screen bg-gray-50">
      <ShopHero
        title="Discover Our Store"
        subtitle="Find the perfect outfit for any occasion from our curated selection of premium clothing"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductFilters
          searchQuery={searchQuery}
          selectedCategories={selectedCategories}
          categories={categories}
          onSearchChange={setSearchQuery}
          onCategoryToggle={toggleCategory}
          onClearFilters={clearFilters}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
        />

        {/* Products Grid */}
        <div className="mb-12">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900">No products found</h3>
              <p className="mt-1 text-gray-500">Try adjusting your search or filter criteria</p>
              <Button
                onClick={clearFilters}
                variant="outline"
                className="mt-4"
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            <ProductList
              products={filteredProducts as unknown as ProductInCatalog[]}
              onToggleWishlist={toggleWishlist}
            />
          )}
        </div>
      </div>
    </div>
  );
}