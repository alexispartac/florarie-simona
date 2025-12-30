export type OrderItem = {
    itemId: string;
    name: string;
    price: number;
    quantity: number;
    size: string;
    color: string;
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
};

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export type PaymentInfo = {
    method: 'credit-card' | 'bank-transfer' | 'cash-on-delivery';
    status: PaymentStatus;
};

export type OrderStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled';

export type Order = {
    orderId: string;
    date: string;
    status: OrderStatus;
    total: number;
    shippingCost: number;
    items: OrderItem[];
    shipping: ShippingInfo;
    payment: PaymentInfo;
    trackingNumber: string;
    createdAt?: Date;
    updatedAt?: Date;
};