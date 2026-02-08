// Seasonal Collections types for promotional pop-ups

export interface SeasonalCollection {
  collectionId: string;
  title: string;
  description: string;
  slug: string;
  image: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  isActive: boolean;
  priority: number; // Higher priority shows first
  buttonText: string;
  buttonLink: string; // Link to collection page or products
  products?: string[]; // Array of product IDs in this collection
  createdAt?: string;
  updatedAt?: string;
}

export interface SeasonalCollectionListResponse {
  collections: SeasonalCollection[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SeasonalCollectionFilters {
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
  sortBy?: 'priority' | 'startDate' | 'endDate' | 'newest';
  page?: number;
  limit?: number;
}
