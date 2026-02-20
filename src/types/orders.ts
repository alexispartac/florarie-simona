export type OrderItem = {
    itemId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    customMessage?: string; // Custom message for greeting card
};

export type ShippingInfo = {
    name: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
    email: string;
    recipientName?: string; // If sending to someone else
    recipientPhone?: string; // Recipient's phone for delivery
    deliveryInstructions?: string; // Special delivery instructions
    preferredDeliveryTime?: string; // e.g., "morning", "afternoon", "evening"
    isGift?: boolean; // Is this a gift delivery?
    createdAt?: Date;
    updatedAt?: Date;
};

export type BillingInfo = {
    name: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
    email: string;
    company?: string; // Optional company name for businesses
    taxId?: string; // Optional tax ID / VAT number for businesses
    createdAt?: Date;
    updatedAt?: Date;
};

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export type PaymentInfo = {
    method: 'credit-card' | 'bank-transfer' | 'cash-on-delivery';
    status: PaymentStatus;
    transactionId?: string; // euPlatesc transaction ID (ep_id)
    euplatescData?: {
        action: string;
        message: string;
        approval?: string;
        timestamp: string;
        amount: string;
        curr: string;
        nonce: string;
        ep_id: string;
    };
};

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'out-for-delivery' | 'delivered' | 'cancelled' | 'failed-delivery';

export type Order = {
    orderId: string;
    date: string;
    status: OrderStatus;
    total: number;
    shippingCost: number;
    items: OrderItem[];
    shipping: ShippingInfo;
    billing: BillingInfo;
    payment: PaymentInfo;
    trackingNumber: string;
    deliveryDate?: string; // Scheduled delivery date (ISO string)
    isSameDayDelivery?: boolean; // Is this a same-day delivery order?
    deliveryTime?: string; // Actual delivery time (ISO string)
    deliveredBy?: string; // Delivery person name
    deliveryNotes?: string; // Notes from delivery person
    customerNotes?: string; // Special requests from customer
    discount?: {
        code: string;
        amount: number;
    };
    createdAt?: Date;
    updatedAt?: Date;
};