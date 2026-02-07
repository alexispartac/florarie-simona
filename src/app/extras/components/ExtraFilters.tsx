import React from 'react';
import { Filter, X, SlidersHorizontal } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from '@/translations';

interface ExtraFiltersProps {
  selectedCategories: string[];
  categories: string[];
  sortBy: string;
  onCategoryToggle: (category: string) => void;
  onSortChange: (sortBy: string) => void;
  onClearFilters: () => void;
  showFilters: boolean;
  onToggleFilters: () => void;
}

export const ExtraFilters: React.FC<ExtraFiltersProps> = ({
  selectedCategories,
  categories,
  sortBy,
  onCategoryToggle,
  onSortChange,
  onClearFilters,
  showFilters,
  onToggleFilters,
}) => {
  const { language } = useLanguage();
  const t = useTranslation(language);

  const activeFilterCount = selectedCategories.length;

  const SORT_OPTIONS = [
    { value: 'price-asc', label: t('shop.sort.priceAsc') },
    { value: 'price-desc', label: t('shop.sort.priceDesc') },
    { value: 'newest', label: t('shop.sort.newest') },
  ];

  return (
    <div className="mb-8">
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {/* Toggle Filters Button */}
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
        <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[var(--foreground)] flex items-center gap-2">
              <Filter className="h-5 w-5 text-[var(--primary)]" />
              {t('extras.filterBy')}
            </h3>
            {activeFilterCount > 0 && (
              <button
                onClick={onClearFilters}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)] rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
                {t('shop.clearAll')}
              </button>
            )}
          </div>

          {/* Categories Grid */}
          <div>
            <h4 className="font-medium text-[var(--foreground)] mb-4 text-sm uppercase tracking-wide">
              {t('extras.categories')}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {categories.map((category) => (
                <label
                  key={category}
                  className={`
                    relative flex items-center justify-center px-4 py-3 rounded-lg cursor-pointer transition-all duration-200
                    ${selectedCategories.includes(category)
                      ? 'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-md ring-2 ring-[var(--primary)] ring-offset-2 ring-offset-[var(--background)]'
                      : 'bg-[var(--accent)] text-[var(--foreground)] hover:bg-[var(--accent)]/70 border border-[var(--border)]'
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => onCategoryToggle(category)}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium capitalize text-center">
                    {category}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Pills */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-sm text-[var(--muted-foreground)]">
            {t('shop.filterBy')}:
          </span>
          {selectedCategories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryToggle(category)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full text-sm font-medium hover:bg-[var(--primary)]/20 transition-colors"
            >
              {category}
              <X className="h-3 w-3" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
