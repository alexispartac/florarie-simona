'use client';

import { memo, useState, useEffect, useRef } from 'react';
import Button from '@/components/ui/Button';
import { ProductCard } from './components/ProductCard';
import { ProductFilters } from './components/ProductFilters';
import { ProductFiltersSkeleton } from './components/ProductFiltersSkeleton';
import { ShopHero } from './components/ShopHero';
import { useShop } from '@/context/ShopContext';
import { ProductInCatalog, WishlistItem, FlowerColor, FlowerOccasion } from '@/types/products';
import { useProductsCatalogInfinite, useProductCategories } from '@/hooks/useProducts';
import { Spinner } from '@/components/ui/Spinner';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from '@/translations';
import { ProductCardSkeleton } from './components/ProductCardSkeleton';

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
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedColors, setSelectedColors] = useState<FlowerColor[]>([]);
  const [selectedOccasions, setSelectedOccasions] = useState<FlowerOccasion[]>([]);
  const [sameDayDeliveryOnly, setSameDayDeliveryOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  
  // Infinite scroll setup with filters
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { 
    data, 
    isLoading, 
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProductsCatalogInfinite(12, {
    categories: selectedCategories,
    colors: selectedColors,
    occasions: selectedOccasions,
    sameDayDelivery: sameDayDeliveryOnly,
    sortBy: sortBy,
  });
  
  // Fetch all categories separately
  const { data: categories = [] } = useProductCategories();
  
  const { language } = useLanguage();
  const t = useTranslation(language);
  const { addToWishlist } = useShop();
  
  // Flatten all pages into a single products array and remove duplicates
  const allProducts = data?.pages.flatMap(page => page.products) ?? [];
  const products = Array.from(
    new Map(allProducts.map(product => [product.productId, product])).values()
  );

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };
  
  const toggleColor = (color: FlowerColor) => {
    setSelectedColors((prev) =>
      prev.includes(color)
        ? prev.filter((c) => c !== color)
        : [...prev, color]
    );
  };
  
  const toggleOccasion = (occasion: FlowerOccasion) => {
    setSelectedOccasions((prev) =>
      prev.includes(occasion)
        ? prev.filter((o) => o !== occasion)
        : [...prev, occasion]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedColors([]);
    setSelectedOccasions([]);
    setSameDayDeliveryOnly(false);
  };

  const toggleWishlist = (product: WishlistItem) => {
    addToWishlist(product);
  };
  
  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: '100px', // Start loading 100px before reaching the bottom
        threshold: 0.1,
      }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--primary-background)]">
        <ShopHero
          title="Intra in lumea florilor"
          subtitle="Descopera buchete proaspete și aranjamente florale superbe pentru orice ocazie. Nu ezita sa ne contactezi pentru orice intrebare."
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ProductFiltersSkeleton />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <p className="text-[var(--muted-foreground)]">{t('shop.error')}</p>
        </div>
      </div>
    );
  }

  // All filtering and sorting is now handled by the API/database
  // Products are already filtered and sorted when they arrive from the server

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <ShopHero
        title="Intra in lumea florilor"
        subtitle="Descopera buchete proaspete și aranjamente florale superbe pentru orice ocazie. Nu ezita sa ne contactezi pentru orice intrebare."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductFilters
          selectedCategories={selectedCategories}
          categories={categories}
          selectedColors={selectedColors}
          selectedOccasions={selectedOccasions}
          sameDayDeliveryOnly={sameDayDeliveryOnly}
          sortBy={sortBy}
          onCategoryToggle={toggleCategory}
          onColorToggle={toggleColor}
          onOccasionToggle={toggleOccasion}
          onSameDayDeliveryToggle={() => setSameDayDeliveryOnly(!sameDayDeliveryOnly)}
          onSortChange={setSortBy}
          onClearFilters={clearFilters}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
        />

        {/* Products Grid */}
        <div className="mb-12">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-[var(--foreground)]">{t('shop.noProducts')}</h3>
              <p className="mt-1 text-[var(--muted-foreground)]">{t('shop.tryDifferentSearch')}</p>
              <Button
                onClick={clearFilters}
                variant="outline"
              >
                {t('shop.clearFilters')}
              </Button>
            </div>
          ) : (
            <>
              <ProductList
                products={products as unknown as ProductInCatalog[]}
                onToggleWishlist={toggleWishlist}
              />
              
              {/* Load More Trigger */}
              <div ref={loadMoreRef} className="flex justify-center py-8">
                {isFetchingNextPage && (
                  <div className="flex flex-col items-center space-y-2">
                    <Spinner className="w-8 h-8" />
                    <p className="text-[var(--muted-foreground)]">Se încarcă mai multe produse...</p>
                  </div>
                )}
                {!hasNextPage && products.length > 0 && (
                  <p className="text-[var(--muted-foreground)]">Ai ajuns la finalul catalogului 🌸</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}