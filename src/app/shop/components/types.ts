
import { Product } from '@/types/products';

export interface ProductFiltersProps {
  searchQuery: string;
  selectedCategories: string[];
  categories: string[];
  onSearchChange: (query: string) => void;
  onCategoryToggle: (category: string) => void;
  onClearFilters: () => void;
  showFilters: boolean;
  onToggleFilters: () => void;
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
