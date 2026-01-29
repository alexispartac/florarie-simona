import React from 'react';
import { Filter, X, Truck, SlidersHorizontal } from 'lucide-react';
import { ProductFiltersProps } from './types';
import { FlowerColor, FlowerOccasion } from '@/types/products';

// Available filter options
const FLOWER_COLORS: FlowerColor[] = ['rosu', 'roz', 'alb', 'galben', 'mov', 'portocaliu', 'albastru', 'mixt', 'pastel', 'negru'];
const FLOWER_OCCASIONS: FlowerOccasion[] = ['birthday', 'anniversary', 'wedding', 'funeral', 'romantic', 'congratulations', 'get-well', 'thank-you', 'just-because', 'mothers-day', 'valentines-day'];
const SORT_OPTIONS = [
  { value: 'featured', label: 'Recomandate' },
  { value: 'price-asc', label: 'Preț: Crescător' }, 
  { value: 'price-desc', label: 'Preț: Descrescător' },
  { value: 'newest', label: 'Cele mai noi' },
  { value: 'rating', label: 'Cel mai bine cotate' },
];

// Color translation map
const COLOR_LABELS: Record<FlowerColor, string> = {
  rosu: 'Roșu',
  roz: 'Roz',
  alb: 'Alb',
  galben: 'Galben',
  mov: 'Mov',
  portocaliu: 'Portocaliu',
  albastru: 'Albastru',
  mixt: 'Mixt',
  pastel: 'Pastel',
  negru: 'Negru',
};

// Occasion translation map
const OCCASION_LABELS: Record<FlowerOccasion, string> = {
  birthday: 'Zi de naștere',
  anniversary: 'Aniversare',
  wedding: 'Nuntă',
  funeral: 'Funeralii',
  romantic: 'Romantic',
  congratulations: 'Felicitări',
  'get-well': 'Însănătoșire',
  'thank-you': 'Mulțumire',
  'just-because': 'Fără motiv',
  'mothers-day': 'Ziua Mamei',
  'valentines-day': 'Ziua Îndrăgostiților',
};

// Color swatches for visual representation
const COLOR_SWATCHES: Record<FlowerColor, string> = {
  rosu: 'bg-red-500',
  roz: 'bg-pink-400',
  alb: 'bg-white border-2 border-gray-300',
  galben: 'bg-yellow-400',
  mov: 'bg-purple-500',
  portocaliu: 'bg-orange-500',
  albastru: 'bg-blue-500',
  mixt: 'bg-gradient-to-r from-red-400 via-pink-400 to-purple-400',
  pastel: 'bg-gradient-to-r from-pink-200 via-blue-200 to-purple-200',
  negru: 'bg-gray-900',
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
  const hasActiveFilters = selectedCategories.length > 0 || 
    selectedColors.length > 0 || selectedOccasions.length > 0 || sameDayDeliveryOnly;

  const activeFilterCount = selectedCategories.length + selectedColors.length + selectedOccasions.length + (sameDayDeliveryOnly ? 1 : 0);

  return (
    <div className="mb-8">
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {/* Toggle Filters Button - Desktop & Mobile */}
          <button
            onClick={onToggleFilters}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Filter className="h-4 w-4" />
            {showFilters ? 'Ascunde filtrele' : 'Arată filtrele'}
            {activeFilterCount > 0 && (
              <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary rounded-full">
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
              className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary cursor-pointer hover:border-gray-400 transition-colors"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <SlidersHorizontal className="h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Filters */}
      {showFilters && (
        <div className="hidden md:block bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="space-y-6">
          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Categorii</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => onCategoryToggle(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategories.includes(category)
                      ? 'bg-primary text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200"></div>

          {/* Colors */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Culori</h3>
            <div className="flex flex-wrap gap-3">
              {FLOWER_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => onColorToggle(color)}
                  className={`group flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedColors.includes(color)
                      ? 'bg-primary text-white ring-2 ring-primary ring-offset-2'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full ${COLOR_SWATCHES[color]} ${selectedColors.includes(color) ? 'ring-2 ring-white' : ''}`}></span>
                  {COLOR_LABELS[color]}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200"></div>

          {/* Occasions */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Ocazii</h3>
            <div className="flex flex-wrap gap-2">
              {FLOWER_OCCASIONS.map((occasion) => (
                <button
                  key={occasion}
                  onClick={() => onOccasionToggle(occasion)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedOccasions.includes(occasion)
                      ? 'bg-primary text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {OCCASION_LABELS[occasion]}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200"></div>

          {/* Same Day Delivery */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Livrare</h3>
            <button
              onClick={onSameDayDeliveryToggle}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                sameDayDeliveryOnly
                  ? 'bg-primary text-white'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Truck className="h-4 w-4" />
              Livrare în aceeași zi
            </button>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <>
              <div className="border-t border-gray-200"></div>
              <button
                onClick={onClearFilters}
                className="text-sm text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2 transition-colors"
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
        <div className="md:hidden fixed inset-0 z-50 overflow-y-auto bg-white">
          <div className="min-h-screen p-4">
            {/* Mobile Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Filtre</h3>
              <button
                onClick={onToggleFilters}
                className="p-2 -mr-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Categories Mobile */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Categorii</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label
                      key={category}
                      className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => onCategoryToggle(category)}
                        className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200"></div>

              {/* Colors Mobile */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Culori</h4>
                <div className="flex flex-wrap gap-2">
                  {FLOWER_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => onColorToggle(color)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedColors.includes(color)
                          ? 'bg-primary text-white'
                          : 'bg-gray-50 text-gray-700 border border-gray-200'
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full ${COLOR_SWATCHES[color]}`}></span>
                      {COLOR_LABELS[color]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200"></div>

              {/* Occasions Mobile */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Ocazii</h4>
                <div className="flex flex-wrap gap-2">
                  {FLOWER_OCCASIONS.map((occasion) => (
                    <button
                      key={occasion}
                      onClick={() => onOccasionToggle(occasion)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedOccasions.includes(occasion)
                          ? 'bg-primary text-white'
                          : 'bg-gray-50 text-gray-700 border border-gray-200'
                      }`}
                    >
                      {OCCASION_LABELS[occasion]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200"></div>

              {/* Same Day Delivery Mobile */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Livrare</h4>
                <label className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sameDayDeliveryOnly}
                    onChange={onSameDayDeliveryToggle}
                    className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    Livrare în aceeași zi
                  </span>
                </label>
              </div>
            </div>

            {/* Mobile Footer */}
            <div className="sticky bottom-0 left-0 right-0 pt-6 pb-2 bg-white border-t border-gray-200 mt-6">
              {hasActiveFilters && (
                <button
                  onClick={onClearFilters}
                  className="w-full mb-3 py-3 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
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
