// Base product variant interface
export interface ProductVariant {
  variantId: string;
  productId: string;
  sku: string;
  size: string;
  color: string;
  colorName: string;
  colorCode: string;
  priceAdjustment: number;
  stock: number;
  images: string[];
  barcode?: string;
  isActive: boolean;
}

// Size guide measurements
export interface SizeMeasurements {
  size: string;
  chest?: string;
  waist?: string;
  length?: string;
  sleeve?: string;
}

// Size guide interface
export interface SizeGuide {
  category: string;
  sizes: SizeMeasurements[];
  measuringGuide: string;
}

// Review interface
export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  verifiedPurchase: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// Related product interface
export interface RelatedProduct {
  id: string;
  name: string;
  price: number;
  slug: string;
  image: string;
  category: string;
}

// Available color option
export interface ColorOption {
  name: string;
  code: string;
  image: string;
}

// Main product interface
export interface Product {
  productId: string;
  name: string;
  slug: string;
  description: string;
  price: number; // Price in cents
  category: string;
  tags: string[];
  isFeatured: boolean;
  isNew: boolean;
  rating?: number;
  reviewCount: number;
  details: string[];
  
  // Nested objects
  variants: ProductVariant[];
  availableSizes: string[];
  availableColors: ColorOption[];
  images: string[];
  relatedProducts: RelatedProduct[];
  reviews: ProductReview[];
  sizeGuide: SizeGuide;
}

// Type for product list response
export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Type for product filter options
export interface ProductFilters {
  categories?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  sizes?: string[];
  colors?: string[];
  sortBy?: 'price-asc' | 'price-desc' | 'newest' | 'popular' | 'rating';
  searchQuery?: string;
  inStock?: boolean;
  onSale?: boolean;
  page?: number;
  limit?: number;
}

// Type for creating/updating a product
export interface ProductFormData extends Omit<Product, 'productId' | 'createdAt' | 'updatedAt' | 'variants' | 'reviews'> {
  variants: Array<Omit<ProductVariant, 'variantId' | 'productId' | 'createdAt' | 'updatedAt'>>;
}

export interface ProductInCatalog {
  productId: string,
  name: string,
  slug: string,
  price: number,
  category: string,
  tags: string[];
  isFeatured: boolean,
  isNew: boolean,
  rating: number,
  reviewCount: number,
  availableSizes: string[],
  availableColors: ColorOption[],
  images: string[]
}

// Type for cart item
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  variant: ProductVariant;
}

// Type for wishlist item
export interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  images: string[];
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  limit: number;
  offset: number;
}