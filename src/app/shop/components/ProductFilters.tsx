        import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { ProductFiltersProps } from './types';
import { Input } from '@/components/ui/Input';

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  searchQuery,
  selectedCategories,
  categories,
  onSearchChange,
  onCategoryToggle,
  onClearFilters,
  showFilters,
  onToggleFilters,
}) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
      {/* Search Input */}
      <div className="relative flex-1 max-w-2xl">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type="text"
          fullWidth
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Mobile Filter Button */}
      <div className="md:hidden">
        <Button
          variant="outline"
          onClick={onToggleFilters}
          className="flex items-center gap-2 bg-primary text-white"
        >
          <Filter className="h-4 w-4" />
          {showFilters ? 'Hide' : 'Show'} Filters
        </Button>
      </div>

      {/* Desktop Category Filters */}
      <div className="hidden md:flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Categories:</span>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryToggle(category)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategories.includes(category)
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        {(searchQuery || selectedCategories.length > 0) && (
          <button
            onClick={onClearFilters}
            className="ml-2 text-sm text-primary hover:underline flex items-center gap-1"
          >
            <X className="h-4 w-4" /> Clear filters
          </button>
        )}
      </div>
    </div>

    {/* Mobile Filters Panel */}
    {showFilters && (
      <div className="md:hidden mb-6 p-4 bg-white rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Filters</h3>
          <button
            onClick={onToggleFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Categories</h4>
            <div className="space-y-2">
              {categories.map((category) => (
                <label key={category} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => onCategoryToggle(category)}
                    className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{category}</span>
                </label>
              ))}
            </div>
          </div>
          {(searchQuery || selectedCategories.length > 0) && (
            <Button
              variant="outline"
              onClick={onClearFilters}
              className="w-full mt-4"
            >
              Clear all filters
            </Button>
          )}
        </div>
      </div>
    )}
  </div>
);
