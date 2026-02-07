'use client';

import { memo, useState, useEffect, useRef } from 'react';
import Button from '@/components/ui/Button';
import { ExtraCard } from './components/ExtraCard';
import { ExtraFilters } from './components/ExtraFilters';
import { ExtrasHero } from './components/ExtrasHero';
import { useShop } from '@/context/ShopContext';
import { ExtraInCatalog } from '@/types/extras';
import { useExtrasCatalogInfinite, useExtraCategories } from '@/hooks/useExtras';
import { Spinner } from '@/components/ui/Spinner';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from '@/translations';
import { Package, Gift } from 'lucide-react';

const ExtraList = memo(({
  extras,
  onAddToCart,
}: {
  extras: ExtraInCatalog[];
  onAddToCart: (extra: ExtraInCatalog) => void;
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {extras.map((extra) => (
        <ExtraCard
          key={extra.extraId}
          extra={extra}
          onAddToCart={() => onAddToCart(extra)}
        />
      ))}
    </div>
  );
});

ExtraList.displayName = 'ExtraList';

export default function Extras() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  
  // Infinite scroll setup with filters
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { 
    data, 
    isLoading, 
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useExtrasCatalogInfinite(12, {
    categories: selectedCategories,
    sortBy: sortBy,
  });
  
  // Fetch all categories separately
  const { data: categories = [] } = useExtraCategories();
  
  const { language } = useLanguage();
  const t = useTranslation(language);
  const { addToCart } = useShop();
  
  // Flatten all pages into a single extras array and remove duplicates
  const allExtras = data?.pages.flatMap(page => page.extras) ?? [];
  const extras = Array.from(
    new Map(allExtras.map(extra => [extra.extraId, extra])).values()
  );

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
  };

  const handleAddToCart = (extra: ExtraInCatalog) => {
    addToCart({
      productId: extra.extraId,
      name: extra.name,
      price: extra.price,
      quantity: 1,
      image: extra.images[0],
      stock: extra.stock,
      isExtra: true,
      category: extra.category,
    });
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
        rootMargin: '200px',
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
      <div className="min-h-screen flex items-center justify-center bg-[var(--primary-background)]">
        <div className="flex flex-col items-center space-y-6">
          <Spinner className="w-16 h-16" />
          <div className="text-center">
            <p className="text-lg font-medium text-[var(--foreground)] mb-1">
              {t('shop.loading') || 'Se încarcă...'}
            </p>
            <p className="text-sm text-[var(--muted-foreground)]">
              Pregătim cadourile speciale pentru tine
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--primary-background)]">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
            <Package className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
            {t('shop.error') || 'A apărut o eroare'}
          </h3>
          <p className="text-[var(--muted-foreground)] mb-6">
            Ne cerem scuze, nu am putut încărca articolele. Te rugăm să încerci din nou.
          </p>
          <Button onClick={() => window.location.reload()}>
            Reîncearcă
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <ExtrasHero
        title={t('extras.title')}
        subtitle={t('extras.subtitle')}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Count */}
        {extras.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-[var(--muted-foreground)]">
              {extras.length} {extras.length === 1 ? 'produs găsit' : 'produse găsite'}
            </p>
          </div>
        )}

        <ExtraFilters
          selectedCategories={selectedCategories}
          categories={categories}
          sortBy={sortBy}
          onCategoryToggle={toggleCategory}
          onSortChange={setSortBy}
          onClearFilters={clearFilters}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
        />

        {/* Extras Grid */}
        <div className="mb-12">
          {extras.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[var(--accent)] mb-6">
                <Gift className="h-10 w-10 text-[var(--muted-foreground)]" />
              </div>
              <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">
                {t('extras.noExtras')}
              </h3>
              <p className="text-[var(--muted-foreground)] mb-6 max-w-md mx-auto">
                {t('shop.tryDifferentSearch') || 'Încearcă să ajustezi filtrele sau criteriile de căutare'}
              </p>
              {selectedCategories.length > 0 && (
                <Button
                  onClick={clearFilters}
                  variant="outline"
                >
                  {t('extras.clearFilters')}
                </Button>
              )}
            </div>
          ) : (
            <>
              <ExtraList 
                extras={extras} 
                onAddToCart={handleAddToCart}
              />
              
              {/* Load More Trigger */}
              <div ref={loadMoreRef} className="mt-12 flex justify-center">
                {isFetchingNextPage && (
                  <div className="flex flex-col items-center space-y-3">
                    <Spinner className="w-8 h-8" />
                    <p className="text-sm text-[var(--muted-foreground)]">
                      Se încarcă mai multe produse...
                    </p>
                  </div>
                )}
                {!hasNextPage && extras.length > 12 && (
                  <p className="text-sm text-[var(--muted-foreground)] text-center py-4">
                    🎉 Ai văzut toate produsele disponibile
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
