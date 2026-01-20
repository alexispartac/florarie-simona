export interface OrderProductProps {
    id: string,
    title: string,
    title_category: string,
    price: number,
    quantity: number,
}

export interface OrderProps {
    id: string,
    orderNumber: number,
    clientName: string,
    clientEmail: string,
    clientPhone: string,
    clientAddress: string,
    orderDate: string,
    deliveryDate?: string,
    status: string,
    totalPrice: number,
    products: OrderProductProps[],
}

export interface OrderPropsAdmin {
    id: string,
    userId: string,
    orderNumber: number,
    clientName: string,
    clientEmail: string,
    clientPhone: string,
    clientAddress: string,
    orderDate: string,
    deliveryDate?: string,
    info?: string,
    status: 'Pending' | 'Processing' | 'Delivered' | 'Cancelled',
    totalPrice: number,
    paymentMethod: 'ramburs' | 'card',
    products: OrderProductProps[],
    paymentStatus?: 'pending' | 'paid' | 'failed',
    paymentDetails?: {
        euplatescId?: string,
        approval?: string,
        timestamp?: string,
        amount?: string,
        currency?: string,
    },
    paymentFailureReason?: string,
    createdAt?: string,
    updatedAt?: string,
}
