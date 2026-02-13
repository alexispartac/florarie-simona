// Discount code types for the flower shop

export interface Discount {
  discountId: string;           // Unique identifier
  code: string;                 // Discount code (e.g., "WELCOME20")
  amount: number;               // Fixed amount in cents (e.g., 2000 = 20 RON)
  expiresAt: Date;             // Expiration date
  isActive: boolean;           // Enable/disable code
  createdAt: Date;
  updatedAt: Date;
  usageCount?: number;         // Track how many times used (optional)
}

// Applied discount in cart/order
export interface AppliedDiscount {
  code: string;
  amount: number;
}

// Discount validation response
export interface DiscountValidationResponse {
  valid: boolean;
  discount?: {
    code: string;
    amount: number;
  };
  error?: string;
}

// Discount list response
export interface DiscountListResponse {
  discounts: Discount[];
  total: number;
  page?: number;
  limit?: number;
}
