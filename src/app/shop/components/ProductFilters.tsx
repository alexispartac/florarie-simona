import React from 'react';
import { Filter, X, Truck, SlidersHorizontal } from 'lucide-react';
import { ProductFiltersProps } from './types';
import { FlowerColor, FlowerOccasion } from '@/types/products';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from '@/translations';

// Available filter options
const FLOWER_COLORS: FlowerColor[] = ['rosu', 'roz', 'alb', 'galben', 'mov', 'portocaliu', 'albastru', 'mixt', 'pastel', 'negru'];
const FLOWER_OCCASIONS: FlowerOccasion[] = ['birthday', 'anniversary', 'wedding', 'funeral', 'romantic', 'congratulations', 'get-well', 'thank-you', 'just-because', 'mothers-day', 'valentines-day'];

// Color swatches for visual representation
const COLOR_SWATCHES: Record<FlowerColor, string> = {
  rosu: 'bg-red-500',
  roz: 'bg-pink-400',
  alb: 'bg-white border-2 border-[var(--border)]',
  galben: 'bg-yellow-400',
  mov: 'bg-purple-500',
  portocaliu: 'bg-orange-500',
  albastru: 'bg-blue-500',
  mixt: 'bg-gradient-to-r from-red-400 via-pink-400 to-purple-400',
  pastel: 'bg-gradient-to-r from-pink-200 via-blue-200 to-purple-200',
  negru: 'bg-[var(--foreground)]',
};

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  selectedCategories,
  categories,
  selectedColors,
  selectedOccasions,
  sameDayDeliveryOnly,
  sortBy,
  onCategoryToggle,
  onColorToggle,
  onOccasionToggle,
  onSameDayDeliveryToggle,
  onSortChange,
  onClearFilters,
  showFilters,
  onToggleFilters,
}) => {
  const { language } = useLanguage();
  const t = useTranslation(language);
  
  const hasActiveFilters = selectedCategories.length > 0 || 
    selectedColors.length > 0 || selectedOccasions.length > 0 || sameDayDeliveryOnly;

  const activeFilterCount = selectedCategories.length + selectedColors.length + selectedOccasions.length + (sameDayDeliveryOnly ? 1 : 0);

  // Dynamic sort options
  const SORT_OPTIONS = [
    { value: 'featured', label: t('shop.sort.featured') },
    { value: 'price-asc', label: t('shop.sort.priceAsc') }, 
    { value: 'price-desc', label: t('shop.sort.priceDesc') },
    { value: 'newest', label: t('shop.sort.newest') },
    { value: 'rating', label: t('shop.sort.rating') },
  ];

  // Helper function to get color label
  const getColorLabel = (color: FlowerColor) => {
    return t(`shop.color.${color}` as keyof typeof t);
  };

  // Helper function to get occasion label
  const getOccasionLabel = (occasion: FlowerOccasion) => {
    const key = occasion.replace(/-/g, '');
    const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
    return t(`shop.occasion.${capitalizedKey}` as keyof typeof t);
  };

  return (
    <div className="mb-8">
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {/* Toggle Filters Button - Desktop & Mobile */}
          <button
            onClick={onToggleFilters}
            className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--card)] text-sm font-medium text-[var(--foreground)] hover:bg-[var(--accent)] transition-colors"
          >
            <Filter className="h-4 w-4" />
            {showFilters ? t('shop.hideFilters') : t('shop.showFilters')}
            {activeFilterCount > 0 && (
              <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-[var(--primary-foreground)] bg-[var(--primary)] rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 border border-[var(--border)] rounded-lg bg-[var(--card)] text-sm font-medium text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] cursor-pointer hover:border-[var(--primary)]/50 transition-colors"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <SlidersHorizontal className="h-4 w-4 text-[var(--muted-foreground)]" />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Filters */}
      {showFilters && (
        <div className="hidden md:block bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 mb-6">
          <div className="space-y-6">
          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">{t('shop.categories')}</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => onCategoryToggle(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategories.includes(category)
                      ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                      : 'bg-[var(--secondary)] text-[var(--foreground)] hover:bg-[var(--accent)] border border-[var(--border)]'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-[var(--border)]"></div>

          {/* Colors */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">{t('shop.colors')}</h3>
            <div className="flex flex-wrap gap-3">
              {FLOWER_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => onColorToggle(color)}
                  className={`group flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedColors.includes(color)
                      ? 'bg-[var(--primary)] text-[var(--primary-foreground)] ring-2 ring-[var(--primary)] ring-offset-2'
                      : 'bg-[var(--secondary)] text-[var(--foreground)] hover:bg-[var(--accent)] border border-[var(--border)]'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full ${COLOR_SWATCHES[color]} ${selectedColors.includes(color) ? 'ring-2 ring-[var(--primary-foreground)]' : ''}`}></span>
                  {getColorLabel(color)}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-[var(--border)]"></div>

          {/* Occasions */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">{t('shop.occasions')}</h3>
            <div className="flex flex-wrap gap-2">
              {FLOWER_OCCASIONS.map((occasion) => (
                <button
                  key={occasion}
                  onClick={() => onOccasionToggle(occasion)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedOccasions.includes(occasion)
                      ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                      : 'bg-[var(--secondary)] text-[var(--foreground)] hover:bg-[var(--accent)] border border-[var(--border)]'
                  }`}
                >
                  {getOccasionLabel(occasion)}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-[var(--border)]"></div>

          {/* Same Day Delivery */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Livrare</h3>
            <button
              onClick={onSameDayDeliveryToggle}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                sameDayDeliveryOnly
                  ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                  : 'bg-[var(--secondary)] text-[var(--foreground)] hover:bg-[var(--accent)] border border-[var(--border)]'
              }`}
            >
              <Truck className="h-4 w-4" />
              {t('shop.sameDayDelivery')}
            </button>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <>
              <div className="border-t border-[var(--border)]"></div>
              <button
                onClick={onClearFilters}
                className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] font-medium flex items-center gap-2 transition-colors"
              >
                <X className="h-4 w-4" />
                Resetează filtrele
              </button>
            </>
          )}
        </div>
      </div>
      )}

      {/* Mobile Filters Panel */}
      {showFilters && (
        <div className="md:hidden fixed inset-0 z-50 overflow-y-auto bg-[var(--background)]">
          <div className="min-h-screen p-4">
            {/* Mobile Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border)]">
              <h3 className="text-lg font-semibold text-[var(--foreground)]">Filtre</h3>
              <button
                onClick={onToggleFilters}
                className="p-2 -mr-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)] rounded-lg transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Categories Mobile */}
              <div>
                <h4 className="text-sm font-semibold text-[var(--foreground)] mb-3">{t('shop.categories')}</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label
                      key={category}
                      className="flex items-center p-3 rounded-lg hover:bg-[var(--accent)] transition-colors cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => onCategoryToggle(category)}
                        className="h-4 w-4 text-[var(--primary)] rounded border-[var(--border)] focus:ring-[var(--primary)]"
                      />
                      <span className="ml-3 text-sm font-medium text-[var(--foreground)]">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-[var(--border)]"></div>

              {/* Colors Mobile */}
              <div>
                <h4 className="text-sm font-semibold text-[var(--foreground)] mb-3">{t('shop.colors')}</h4>
                <div className="flex flex-wrap gap-2">
                  {FLOWER_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => onColorToggle(color)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedColors.includes(color)
                          ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                          : 'bg-[var(--secondary)] text-[var(--foreground)] border border-[var(--border)]'
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full ${COLOR_SWATCHES[color]}`}></span>
                      {getColorLabel(color)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-[var(--border)]"></div>

              {/* Occasions Mobile */}
              <div>
                <h4 className="text-sm font-semibold text-[var(--foreground)] mb-3">{t('shop.occasions')}</h4>
                <div className="flex flex-wrap gap-2">
                  {FLOWER_OCCASIONS.map((occasion) => (
                    <button
                      key={occasion}
                      onClick={() => onOccasionToggle(occasion)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedOccasions.includes(occasion)
                          ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                          : 'bg-[var(--secondary)] text-[var(--foreground)] border border-[var(--border)]'
                      }`}
                    >
                      {getOccasionLabel(occasion)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-[var(--border)]"></div>

              {/* Same Day Delivery Mobile */}
              <div>
                <h4 className="text-sm font-semibold text-[var(--foreground)] mb-3">Livrare</h4>
                <label className="flex items-center p-3 rounded-lg hover:bg-[var(--accent)] transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sameDayDeliveryOnly}
                    onChange={onSameDayDeliveryToggle}
                    className="h-4 w-4 text-[var(--primary)] rounded border-[var(--border)] focus:ring-[var(--primary)]"
                  />
                  <span className="ml-3 text-sm font-medium text-[var(--foreground)] flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    {t('shop.sameDayDelivery')}
                  </span>
                </label>
              </div>
            </div>

            {/* Mobile Footer */}
            <div className="sticky bottom-0 left-0 right-0 pt-6 pb-2 bg-[var(--background)] border-t border-[var(--border)] mt-6">
              {hasActiveFilters && (
                <button
                  onClick={onClearFilters}
                  className="w-full mb-3 py-3 rounded-lg text-sm font-medium text-[var(--foreground)] bg-[var(--secondary)] hover:bg-[var(--accent)] transition-colors flex items-center justify-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Resetează filtrele
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
