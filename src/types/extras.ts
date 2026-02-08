// Extra/Add-on item types for gifts and additional items

export type ExtraSize = 'small' | 'medium' | 'large';

// Main Extra interface
export interface Extra {
  extraId: string;
  name: string;
  slug: string;
  price: number; // Price in cents
  salePrice?: number; // Sale price in cents (optional)
  category: string;
  tags: string[];
  isFeatured: boolean;
  isNew: boolean;
  available: boolean;
  stock?: number; // Inventory stock count
  sku?: string; // Stock Keeping Unit (product code)
  images: string[];
  size?: ExtraSize; // Size of the item (optional)
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
}

// Type for extra list response
export interface ExtraListResponse {
  extras: Extra[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Type for extra filter options
export interface ExtraFilters {
  categories?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  sizes?: ExtraSize[];
  sortBy?: 'price-asc' | 'price-desc' | 'newest' | 'popular' | 'rating';
  searchQuery?: string;
  inStock?: boolean;
  page?: number;
  limit?: number;
}

// Type for extras in catalog (simplified version)
export interface ExtraInCatalog {
  extraId: string;
  name: string;
  slug: string;
  price: number;
  category: string;
  tags: string[];
  isFeatured: boolean;
  isNew: boolean;
  images: string[];
  available: boolean;
  stock?: number;
  size?: ExtraSize;
}

// Type for cart extra item
export interface CartExtraItem {
  extraId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  stock?: number;
  category: string;
  size?: ExtraSize;
}
