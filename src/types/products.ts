// Flower-specific enums and types
export type FlowerSize = 'small' | 'medium' | 'large' | 'extra-large';
export type FlowerColor = 'rosu' | 'roz' | 'alb' | 'galben' | 'mov' | 'portocaliu' | 'albastru' | 'mixt' | 'pastel' | 'negru';
export type FlowerOccasion = 'birthday' | 'anniversary' | 'wedding' | 'funeral' | 'romantic' | 'congratulations' | 'get-well' | 'thank-you' | 'just-because' | 'mothers-day' | 'valentines-day';
export type FlowerType = 'roses' | 'tulips' | 'lilies' | 'carnations' | 'sunflowers' | 'orchids' | 'peonies' | 'hydrangeas' | 'daisies' | 'mixed';
export type SeasonalAvailability = 'all-year' | 'spring' | 'summer' | 'fall' | 'winter';

// Care instructions interface
export interface CareInstructions {
  wateringFrequency: string; // e.g., "daily", "every 2 days"
  sunlightRequirement: string; // e.g., "indirect sunlight", "full sun"
  temperature: string; // e.g., "15-25°C"
  specialNotes?: string;
  expectedLifespan: string; // e.g., "7-10 days"
}

// Flower-specific details
export interface FlowerDetails {
  size?: FlowerSize[];
  colors?: FlowerColor[];
  flowerTypes?: FlowerType[];
  occasions?: FlowerOccasion[];
  seasonalAvailability?: SeasonalAvailability;
  stemCount?: number; // number of stems in the bouquet
  includesVase?: boolean;
  careInstructions?: CareInstructions;
  sameDayDelivery?: boolean;
  customMessageAvailable?: boolean;
}

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
export interface RelatedProduct {
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  category: string;
}

// Main product interface
export interface Product {
  productId: string;
  name: string;
  slug: string;
  description: string;
  price: number; // Price in cents
  salePrice?: number; // Sale price in cents (optional)
  category: string;
  tags: string[];
  isFeatured: boolean;
  isNew: boolean;
  rating?: number;
  reviewCount: number;
  details: string[];
  available: boolean;
  stock?: number; // Inventory stock count
  sku?: string; // Stock Keeping Unit (product code)
  weight?: number; // Weight in kg
  images: string[];
  relatedProducts: RelatedProduct[];
  reviews: ProductReview[];
  flowerDetails?: FlowerDetails; // Flower-specific information
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
  colors?: FlowerColor[];
  occasions?: FlowerOccasion[];
  flowerTypes?: FlowerType[];
  sizes?: FlowerSize[];
  sortBy?: 'price-asc' | 'price-desc' | 'newest' | 'popular' | 'rating';
  searchQuery?: string;
  inStock?: boolean;
  sameDayDelivery?: boolean;
  page?: number;
  limit?: number;
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
  images: string[],
  available: boolean,
  flowerDetails?: {
    colors?: FlowerColor[];
    occasions?: FlowerOccasion[];
    sameDayDelivery?: boolean;
  }
}

// Type for cart item
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  selectedSize?: FlowerSize; // For flower products
  customMessage?: string; // Custom message for card/greeting
  deliveryDate?: string; // ISO date string for scheduled delivery
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