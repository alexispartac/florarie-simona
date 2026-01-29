import { FlowerSize } from './products';

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  recipientName?: string; // For gift deliveries
  recipientPhone?: string;
  deliveryInstructions?: string;
  preferredDeliveryTime?: 'morning' | 'afternoon' | 'evening' | 'anytime';
}

export interface CreateOrderRequest {
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
    name: string;
    image?: string;
    customizations?: {
      size?: FlowerSize;
      customMessage?: string; // Message for greeting card
      [key: string]: unknown;
    };
  }>;
  shippingAddress: ShippingAddress;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  deliveryDate?: string; // ISO date string for scheduled delivery
  isSameDayDelivery?: boolean;
  isGift?: boolean;
  customerNotes?: string;
  paymentMethod: 'credit-card' | 'bank-transfer' | 'cash-on-delivery';
}

export interface UpdateOrderStatusRequest {
  status: 'pending' | 'confirmed' | 'preparing' | 'out-for-delivery' | 'delivered' | 'cancelled' | 'failed-delivery';
  deliveryNotes?: string;
  deliveredBy?: string;
  deliveryTime?: string; // ISO date string
}

export interface TrackOrderResponse {
  orderId: string;
  trackingNumber: string;
  status: string;
  estimatedDelivery?: string;
  lastUpdate: string;
  statusHistory: Array<{
    status: string;
    timestamp: string;
    notes?: string;
  }>;
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
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  DELIVERY_UNAVAILABLE = 'DELIVERY_UNAVAILABLE',
  INVALID_DELIVERY_DATE = 'INVALID_DELIVERY_DATE'
}

// API response type for better type safety
export type ApiResponse<T> = 
  | { success: true; data: T }
  | { success: false; error: ApiError };