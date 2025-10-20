
export interface User {
    id: string,
    name: string,
    surname: string,
    email: string,
    phone: string,
    address: string,
    orders: number,
    createdAt: string,
    password: string,
    avatar?: string,
}

export interface ProductImageProps {
    url: string,
    public_id: string,
    width: number,
    height: number,
    format: string,
    created_at: string,
} 

export interface SimpleProductProps {
    id: string,
    title: string,
    stockCode: string,
    inStock: boolean,
    category: string,
    quantity: number,
    price: number,
}

// type pentru un produs compus cum ar fi un aranjament floral
export interface ComposedProductProps {
    id: string,
    title: string,
    info_category: {
        standard: {
            price: number;
        },
        premium: {
            price: number;
        },
        basic: {
            price: number;
        }
    }
    isPopular: boolean,
    stockCode: string,
    inStock: boolean,
    description: string,
    composition: SimpleProductProps[],
    colors: string,
    category: string,
    promotion: boolean,
    newest: boolean,
}

export interface OrderProductProps {
    id: string;
    title: string;
    price: number;
    category: string;
    quantity: number;
}

export interface OrderProps {
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
}

export interface BlogPostProps {
    id: string;
    title: string;
    date: string;
    description: string;
    likes: number;
    dislikes: number;
    likedBy: string[];
    dislikedBy: string[];
}