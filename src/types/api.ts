
export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface CreateOrderRequest {
  items: Array<{
    productId: string;
    quantity: number;
    customizations?: {
      size?: string;
      color?: string;
      embroidery?: string;
      [key: string]: unknown;
    };
  }>;
  shippingAddress: ShippingAddress;
}

// Error handling types
export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiErrorResponse {
  error: ApiError;
}

// Common error codes
export enum ErrorCodes {
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED'
}

// API response type for better type safety
export type ApiResponse<T> = 
  | { success: true; data: T }
  | { success: false; error: ApiError };