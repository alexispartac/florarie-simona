import { ProductProps } from "./admin/types";

// props pentru un produs compus cum ar fi buchete, aranjamente florale etc
export interface ItemProps {
    id: string,
    title: string,
    imageSrc?: string,
    price_category: {
        standard: {
            price: number;
        },
        premium: {
            price: number;
        },
        basic: {
            price: number;
        }
    },
    isPopular?: boolean,
    stockCode?: string,
    inStock?: boolean,
    description?: string,
    composition?: ProductProps[],
    colors?: string,
    type?: string, 
    category?: string, 
    promotion?: boolean
}

export interface OrderProduct {
    id: string,
    title: string,
    price: number,
    quantity: number,
}

export interface Order {
    id: string,
    orderNumber: string,
    clientName: string,
    clientEmail: string,
    clientPhone: string,
    clientAddress: string,
    orderDate: string,
    deliveryDate?: string,
    status: string,
    totalPrice: number,
    products: OrderProduct[]
}

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
}