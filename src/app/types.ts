import { ProductProps } from "./admin/types";

export interface ItemProps {
    id: string,
    title: string,
    info_category: {
        standard: {
            price: number;
            imageSrc: string,
            composition: ProductProps[],
        }
    },
    isPopular?: boolean,
    stockCode?: string,
    inStock?: boolean,
    description?: string,
    colors?: string,
    category: string,
    promotion?: boolean
    newest?: boolean,
    discountPercentage?: number
}

export interface CartItem {
    id: string,
    title: string,
    price: number,
    category: string,
    composition: { id: string, quantity: number }[],
    quantity: number,
    image: string,
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
    products: CartItem[]
    paymentMethod: string,
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
    avatar?: string; 
}
