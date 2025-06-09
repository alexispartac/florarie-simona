import { ProductProps } from "./admin/types";

// props pentru un produs compus cum ar fi buchete, aranjamente florale etc
export interface ItemProps {
    id: string,
    title: string,
    info_category: {
        standard: {
            price: number;
            imageSrc: string,
            composition: ProductProps[],
        },
        premium: {
            price: number;
            imageSrc: string,
            composition: ProductProps[],
        },
        basic: {
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

export interface BlogPostProps {
    id: string;
    title: string;
    date: string;
    description: string;
    image: string | null;
    likes: number;
    dislikes: number;
    likedBy: string[];
    dislikedBy: string[];
}