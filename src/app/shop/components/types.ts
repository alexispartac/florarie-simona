
import { Product, FlowerColor, FlowerOccasion } from '@/types/products';

export interface ProductFiltersProps {
  selectedCategories: string[];
  categories: string[];
  onCategoryToggle: (category: string) => void;
  onClearFilters: () => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  // Flower-specific filters
  selectedColors: FlowerColor[];
  selectedOccasions: FlowerOccasion[];
  sameDayDeliveryOnly: boolean;
  sortBy: string;
  onColorToggle: (color: FlowerColor) => void;
  onOccasionToggle: (occasion: FlowerOccasion) => void;
  onSameDayDeliveryToggle: () => void;
  onSortChange: (sortBy: string) => void;
}

export interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
}

export interface ProductGridProps {
  products: Product[];
  onAddToCart: (productId: string) => void;
  onToggleWishlist: (productId: string) => void;
}

export interface ShopHeroProps {
  title: string;
  subtitle: string;
}
